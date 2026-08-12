<?php
// api/auth.php — Auth sans session PHP (token SQLite/MySQL)
require_once __DIR__ . '/db.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');

$action = $_POST['action'] ?? $_GET['action'] ?? '';
$token  = $_POST['token']  ?? $_GET['token']  ?? '';

// ── CHECK TOKEN ────────────────────────────────────────────────────────────
if ($action === 'check') {
    if (!$token) { echo json_encode(['loggedIn' => false]); exit; }
    try {
        $db   = getDB();
        $user = getUserByToken($db, $token);
        if ($user) {
            echo json_encode(['loggedIn' => true, 'user' => $user]);
        } else {
            echo json_encode(['loggedIn' => false]);
        }
    } catch (Exception $e) {
        echo json_encode(['loggedIn' => false]);
    }
    exit;
}

// ── CONNEXION ──────────────────────────────────────────────────────────────
if ($action === 'login') {
    $email = trim($_POST['email']    ?? '');
    $pass  =      $_POST['password'] ?? '';

    if (!$email || !$pass) {
        echo json_encode(['success' => false, 'error' => 'Veuillez remplir tous les champs.']);
        exit;
    }

    try {
        $db   = getDB();
        $stmt = $db->prepare("SELECT * FROM users WHERE email = ? LIMIT 1");
        $stmt->execute([$email]);
        $user = $stmt->fetch();

        if (!$user || !password_verify($pass, $user['password_hash'])) {
            echo json_encode(['success' => false, 'error' => 'Email ou mot de passe incorrect.']);
            exit;
        }

        $db->prepare("UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?")
           ->execute([$user['id']]);

        $tok = createToken($db, (int)$user['id']);
        echo json_encode([
            'success' => true,
            'token'   => $tok,
            'user'    => ['id' => $user['id'], 'prenom' => $user['prenom'],
                          'nom' => $user['nom'], 'email' => $user['email']],
        ]);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'error' => 'Erreur serveur : ' . $e->getMessage()]);
    }
    exit;
}

// ── INSCRIPTION ────────────────────────────────────────────────────────────
if ($action === 'register') {
    $prenom = trim($_POST['prenom']    ?? '');
    $nom    = trim($_POST['nom']       ?? '');
    $email  = trim($_POST['email']     ?? '');
    $pass   =      $_POST['password']  ?? '';
    $pass2  =      $_POST['password2'] ?? '';

    if (!$prenom || !$nom || !$email || !$pass) {
        echo json_encode(['success' => false, 'error' => 'Tous les champs sont obligatoires.']);
        exit;
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['success' => false, 'error' => 'Adresse email invalide.']);
        exit;
    }
    if (strlen($pass) < 6) {
        echo json_encode(['success' => false, 'error' => 'Le mot de passe doit contenir au moins 6 caractères.']);
        exit;
    }
    if ($pass !== $pass2) {
        echo json_encode(['success' => false, 'error' => 'Les mots de passe ne correspondent pas.']);
        exit;
    }

    try {
        $db   = getDB();
        $stmt = $db->prepare("SELECT id FROM users WHERE email = ? LIMIT 1");
        $stmt->execute([$email]);
        if ($stmt->fetch()) {
            echo json_encode(['success' => false, 'error' => 'Un compte existe déjà avec cet email.']);
            exit;
        }

        $hash = password_hash($pass, PASSWORD_BCRYPT);
        $ins  = $db->prepare("INSERT INTO users (prenom, nom, email, password_hash) VALUES (?,?,?,?)");
        $ins->execute([$prenom, $nom, $email, $hash]);
        $id = (int)$db->lastInsertId();

        $tok = createToken($db, $id);
        echo json_encode([
            'success' => true,
            'token'   => $tok,
            'user'    => ['id' => $id, 'prenom' => $prenom, 'nom' => $nom, 'email' => $email],
        ]);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'error' => 'Erreur serveur : ' . $e->getMessage()]);
    }
    exit;
}

// ── DÉCONNEXION ────────────────────────────────────────────────────────────
if ($action === 'logout') {
    if ($token) {
        try { deleteToken(getDB(), $token); } catch (Exception $e) {}
    }
    echo json_encode(['success' => true]);
    exit;
}

echo json_encode(['success' => false, 'error' => 'Action inconnue.']);
?>
