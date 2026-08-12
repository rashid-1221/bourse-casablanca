<?php
// api/git-deploy.php — Déployer vers GitHub (push) ou importer (pull)
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');

$action  = $_POST['action'] ?? $_GET['action'] ?? '';
$message = trim($_POST['message'] ?? 'Mise à jour depuis le site');

// Dossier racine du projet (parent de api/)
$projectDir = realpath(__DIR__ . '/..');

// ── Exécuter une commande shell ──────────────────────────────────────────
function runCmd($cmd, $dir) {
    $output = [];
    $code   = 0;
    if (PHP_OS_FAMILY === 'Windows') {
        $full = 'cmd /c "cd /d ' . $dir . ' && ' . $cmd . ' 2>&1"';
    } else {
        $full = 'cd ' . escapeshellarg($dir) . ' && ' . $cmd . ' 2>&1';
    }
    exec($full, $output, $code);
    return ['output' => implode("\n", $output), 'code' => $code];
}

// ── Action : push ────────────────────────────────────────────────────────
if ($action === 'push') {
    // Sanitize le message de commit
    $msg = $message ?: 'Mise à jour depuis le site';
    $msg = preg_replace('/["\r\n]/', '', $msg);
    $msg = substr($msg, 0, 120);

    $r1 = runCmd('git add .', $projectDir);
    $r2 = runCmd('git commit -m "' . $msg . '"', $projectDir);
    $r3 = runCmd('git push', $projectDir);

    // Commit vide = "nothing to commit" → pas une vraie erreur
    $nothingToCommit = (strpos($r2['output'], 'nothing to commit') !== false
                     || strpos($r2['output'], 'rien') !== false);

    $success = ($r3['code'] === 0);
    echo json_encode([
        'ok'      => $success,
        'message' => $success
            ? ($nothingToCommit ? '✅ Déjà à jour — rien à committer, push OK' : '✅ Déployé sur GitHub avec succès')
            : '❌ Erreur lors du déploiement',
        'steps'   => [
            ['cmd' => 'git add .',       'out' => $r1['output'], 'code' => $r1['code']],
            ['cmd' => 'git commit -m …', 'out' => $r2['output'], 'code' => $r2['code']],
            ['cmd' => 'git push',        'out' => $r3['output'], 'code' => $r3['code']],
        ],
    ]);

// ── Action : pull ────────────────────────────────────────────────────────
} elseif ($action === 'pull') {
    $r = runCmd('git pull', $projectDir);
    $success = ($r['code'] === 0);
    echo json_encode([
        'ok'      => $success,
        'output'  => $r['output'],
        'message' => $success
            ? '✅ Site mis à jour depuis GitHub'
            : '❌ Erreur lors de l\'import depuis GitHub',
    ]);

// ── Action : status ──────────────────────────────────────────────────────
} elseif ($action === 'status') {
    $r1 = runCmd('git log --format="%h %ad %s" --date=short -5', $projectDir);
    $r2 = runCmd('git status --short', $projectDir);
    echo json_encode([
        'ok'     => true,
        'log'    => $r1['output'],
        'status' => $r2['output'],
    ]);

} else {
    echo json_encode(['ok' => false, 'error' => 'Action inconnue : ' . htmlspecialchars($action)]);
}
?>
