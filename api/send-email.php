<?php
// api/send-email.php — Envoi via Gmail SMTP (mot de passe d'application)
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

$body = json_decode(file_get_contents('php://input'), true) ?: [];

// ── Config persistante (email_config.json) ───────────────────────────────────
$configFile = __DIR__ . '/email_config.json';
$cfg = file_exists($configFile) ? (json_decode(file_get_contents($configFile), true) ?: []) : [];

if (!empty($body['save_config'])) {
    $save = array_merge($cfg, array_filter([
        'gmail_user'     => $body['gmail_user']     ?? null,
        'gmail_password' => $body['gmail_password'] ?? null,
        'to'             => $body['to']             ?? null,
    ], fn($v) => $v !== null && $v !== ''));
    file_put_contents($configFile, json_encode($save, JSON_PRETTY_PRINT));
    echo json_encode(['ok' => true, 'saved' => true]); exit;
}

// Fusionner config fichier + body
$gmailUser = $body['gmail_user']     ?? $cfg['gmail_user']     ?? '';
$gmailPass = $body['gmail_password'] ?? $cfg['gmail_password'] ?? '';
$to        = $body['to']             ?? $cfg['to']             ?? '';
$subject   = $body['subject']        ?? 'Alerte Bourse Casa';
$html      = $body['html']           ?? '';

if (isset($body['test'])) {
    $subject = '✅ Test Bourse Casa — Email OK';
    $html    = '<div style="font-family:Arial;padding:24px;background:#0d1117;color:#e6edf3;border-radius:10px;">
        <h2 style="color:#3fb950;margin:0 0 12px;">✅ Gmail configuré avec succès</h2>
        <p>Votre proxy email fonctionne. Les alertes portefeuille seront envoyées à cette adresse.</p>
        <p style="color:#8b949e;font-size:12px;">' . date('d/m/Y H:i:s') . '</p></div>';
}

if (!$gmailUser || !$gmailPass) {
    echo json_encode(['ok'=>false,'error'=>'Gmail non configuré. Renseignez votre adresse Gmail et votre mot de passe d\'application dans Paramètres → Alertes Email.']);
    exit;
}
if (!$to) {
    echo json_encode(['ok'=>false,'error'=>'Email destinataire manquant.']);
    exit;
}

// ── Envoi Gmail SMTP (STARTTLS port 587) ─────────────────────────────────────
$socket = @stream_socket_client('tcp://smtp.gmail.com:587', $errno, $errstr, 15);
if (!$socket) {
    echo json_encode(['ok'=>false,'error'=>"Connexion Gmail impossible: $errstr ($errno). Vérifiez votre connexion internet."]);
    exit;
}
stream_set_timeout($socket, 10);

$read = function() use ($socket) {
    $out = '';
    while (!feof($socket)) {
        $line = fgets($socket, 512);
        $out .= $line;
        if ($line && isset($line[3]) && $line[3] === ' ') break;
    }
    return $out;
};
$w = fn($s) => fputs($socket, $s . "\r\n");

$read();                       // 220 greeting
$w('EHLO localhost'); $read();
$w('STARTTLS');       $read();

if (!@stream_socket_enable_crypto($socket, true,
    STREAM_CRYPTO_METHOD_TLSv1_2_CLIENT | STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
    fclose($socket);
    echo json_encode(['ok'=>false,'error'=>'TLS échoué. Assurez-vous que PHP a accès à OpenSSL (MAMP → php.ini : extension=openssl).']);
    exit;
}

$w('EHLO localhost'); $read();
$w('AUTH LOGIN');     $read();
$w(base64_encode($gmailUser)); $read();
$w(base64_encode($gmailPass));
$auth = $read();

if (substr(trim($auth), 0, 3) !== '235') {
    fclose($socket);
    echo json_encode(['ok'=>false,'error'=>'Authentification Gmail échouée. Vérifiez : (1) mot de passe d\'application à 16 caractères sans espaces, (2) validation en 2 étapes activée sur votre compte Google.']);
    exit;
}

$w("MAIL FROM: <$gmailUser>"); $read();
$w("RCPT TO: <$to>");          $read();
$w('DATA');                    $read();

$subjectEncoded = '=?UTF-8?B?' . base64_encode($subject) . '?=';
$message  = "From: Bourse Casa <$gmailUser>\r\n";
$message .= "To: $to\r\n";
$message .= "Subject: $subjectEncoded\r\n";
$message .= "Date: " . date('r') . "\r\n";
$message .= "MIME-Version: 1.0\r\n";
$message .= "Content-Type: text/html; charset=utf-8\r\n";
$message .= "Content-Transfer-Encoding: base64\r\n\r\n";
$message .= chunk_split(base64_encode($html));
$message .= "\r\n.\r\n";

fputs($socket, $message);
$resp = $read();
$w('QUIT');
fclose($socket);

$code = (int) substr(trim($resp), 0, 3);
if ($code === 250) {
    echo json_encode(['ok' => true, 'via' => 'gmail']);
} else {
    echo json_encode(['ok' => false, 'error' => 'Gmail SMTP réponse inattendue: ' . trim($resp)]);
}
