<?php
// api/browse-folder.php — Navigateur de dossiers côté serveur (admin only)
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

$path = trim($_GET['path'] ?? '');

// Racine : lister les lecteurs Windows (A:\ à Z:\)
if ($path === '' || $path === '/' || $path === '\\') {
    $drives = [];
    foreach (range('A', 'Z') as $letter) {
        $d = $letter . ':\\';
        if (is_dir($d)) {
            $drives[] = ['name' => $letter . ':', 'path' => $d, 'type' => 'drive'];
        }
    }
    echo json_encode(['success' => true, 'path' => '', 'label' => 'Ce PC', 'parent' => null, 'items' => $drives], JSON_UNESCAPED_UNICODE);
    exit;
}

// Normaliser les séparateurs
$path = rtrim(str_replace('/', '\\', $path), '\\');

if (!is_dir($path)) {
    echo json_encode(['success' => false, 'error' => 'Dossier introuvable : ' . $path]);
    exit;
}

// Lister les sous-dossiers uniquement
$items   = [];
$entries = @scandir($path);
if ($entries === false) {
    echo json_encode(['success' => false, 'error' => 'Accès refusé : ' . $path]);
    exit;
}

foreach ($entries as $entry) {
    if ($entry === '.' || $entry === '..') continue;
    $full = $path . '\\' . $entry;
    if (is_dir($full)) {
        // Exclure dossiers système cachés courants
        if (in_array(strtolower($entry), ['$recycle.bin', 'system volume information', 'recovery'])) continue;
        $items[] = ['name' => $entry, 'path' => $full, 'type' => 'dir'];
    }
}

usort($items, fn($a, $b) => strcasecmp($a['name'], $b['name']));

// Dossier parent
$parent = dirname($path);
if ($parent === $path) $parent = ''; // à la racine d'un lecteur → revenir à la liste des lecteurs

echo json_encode([
    'success' => true,
    'path'    => $path,
    'label'   => basename($path) ?: $path,
    'parent'  => $parent,
    'items'   => $items,
], JSON_UNESCAPED_UNICODE);
?>
