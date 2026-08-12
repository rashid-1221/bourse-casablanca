<?php
// api/save-backup.php — Sauvegarde complète du site (chemin personnalisable)
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

$srcDir    = realpath(__DIR__ . '/..');   // C:\MAMP\htdocs\bourse de casablanca\Claude
$timestamp = date('d-m-Y_H-i');          // ex: 15-03-2026_14-30

// Chemin de destination : paramètre GET/POST ou dossier Sauvegarde/ par défaut
$destParam = trim($_GET['dest'] ?? $_POST['dest'] ?? '');

if ($destParam !== '') {
    // Normaliser les séparateurs (accepte / ou \)
    $destParam = rtrim(str_replace(['/', '\\'], DIRECTORY_SEPARATOR, $destParam), DIRECTORY_SEPARATOR);
    $parentDir = $destParam;
    $backupDir = $destParam . DIRECTORY_SEPARATOR . $timestamp;
} else {
    $parentDir = $srcDir . DIRECTORY_SEPARATOR . 'Sauvegarde';
    $backupDir = $parentDir . DIRECTORY_SEPARATOR . $timestamp;
}

// Créer le dossier parent si nécessaire
if (!is_dir($parentDir)) {
    if (!mkdir($parentDir, 0777, true)) {
        echo json_encode(['success'=>false,'error'=>'Impossible de créer le dossier parent: '.$parentDir]);
        exit;
    }
}

// Créer le dossier horodaté
if (!mkdir($backupDir, 0777, true)) {
    echo json_encode(['success'=>false,'error'=>'Impossible de créer le dossier: '.$backupDir]);
    exit;
}

// Dossiers et fichiers à exclure
$exclusions = [
    'Sauvegarde',   // Pas de copie récursive des sauvegardes internes
    '.claude',      // Dossier interne Claude Code
    '.git',         // Git si présent
    'node_modules', // Node modules si présent
];

$copied = 0;
$errors = [];

/**
 * Copie récursive d'un dossier source vers destination
 */
function copyDir($src, $dst, $exclusions, &$copied, &$errors) {
    if (!is_dir($src)) return;

    $items = scandir($src);
    foreach ($items as $item) {
        if ($item === '.' || $item === '..') continue;
        if (in_array($item, $exclusions)) continue;

        $srcPath = $src . DIRECTORY_SEPARATOR . $item;
        $dstPath = $dst . DIRECTORY_SEPARATOR . $item;

        if (is_dir($srcPath)) {
            if (!is_dir($dstPath)) mkdir($dstPath, 0777, true);
            copyDir($srcPath, $dstPath, $exclusions, $copied, $errors);
        } else {
            if (copy($srcPath, $dstPath)) {
                $copied++;
            } else {
                $errors[] = str_replace($src . DIRECTORY_SEPARATOR, '', $srcPath);
            }
        }
    }
}

copyDir($srcDir, $backupDir, $exclusions, $copied, $errors);

echo json_encode([
    'success' => true,
    'folder'  => $timestamp,
    'path'    => str_replace('/', '\\', $backupDir),
    'dest'    => $destParam !== '' ? $destParam : 'défaut',
    'copied'  => $copied,
    'errors'  => $errors,
], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
?>
