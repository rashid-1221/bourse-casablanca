<?php
// api/portfolio-sync.php — Portefeuille anonyme partagé (fichier local à cet hôte PHP)
// Le portefeuille par compte utilisateur est géré côté client via Firestore (voir script.js).

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');

$file = __DIR__ . '/portfolio_data.json';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $body = file_get_contents('php://input');
    if (!$body) { echo json_encode(['ok' => false, 'error' => 'empty body']); exit; }
    $decoded = json_decode($body, true);
    if ($decoded === null) { echo json_encode(['ok' => false, 'error' => 'invalid json']); exit; }
    // Sauvegarder le payload complet (stocks + tags + historique)
    $ok = file_put_contents($file, $body, LOCK_EX);
    $nb = isset($decoded['data']) ? count($decoded['data']) : count($decoded);
    echo json_encode(['ok' => $ok !== false, 'saved' => $nb]);
} else {
    if (!file_exists($file)) {
        echo json_encode(['ok' => true, 'data' => [], 'tags' => [], 'history' => [], 'historySym' => []]);
    } else {
        $content = file_get_contents($file);
        $payload = json_decode($content, true);
        // Support ancien format (tableau brut) et nouveau format (objet avec data+tags+history)
        if (is_array($payload) && array_values($payload) === $payload) {
            // Ancien format : tableau direct de stocks
            echo json_encode(['ok' => true, 'data' => $payload, 'tags' => [], 'history' => [], 'historySym' => []]);
        } else {
            // Nouveau format : { data: [...], tags: {...}, history: [...], historySym: {...} }
            echo json_encode([
                'ok'        => true,
                'data'      => $payload['data']       ?? [],
                'tags'      => $payload['tags']       ?? [],
                'history'   => $payload['history']    ?? [],
                'historySym'=> $payload['historySym'] ?? [],
            ]);
        }
    }
}
?>
