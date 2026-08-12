<?php
// api/portfolio-sync.php — Portefeuille lié au compte utilisateur (SQLite)
require_once __DIR__ . '/db.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');

$token = $_GET['token'] ?? $_POST['token'] ?? '';

// ── Sans token : fallback sur fichier partagé ─────────────────────────────
if (!$token) {
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
    exit;
}

// ── Avec token : portefeuille lié au compte (SQLite) ─────────────────────
$db   = getDB();
$user = getUserByToken($db, $token);
if (!$user) {
    echo json_encode(['ok' => false, 'error' => 'Token invalide ou expiré']);
    exit;
}
$userId = (int)$user['id'];

// Ajouter les colonnes manquantes si elles n'existent pas encore (idempotent)
try { $db->exec("ALTER TABLE portfolios ADD COLUMN tags_json    TEXT DEFAULT '{}'"); } catch (Exception $e) {}
try { $db->exec("ALTER TABLE portfolios ADD COLUMN history_json TEXT DEFAULT '{}'"); } catch (Exception $e) {}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $body    = file_get_contents('php://input');
    $payload = json_decode($body, true);
    if (!isset($payload['data']) || !is_array($payload['data'])) {
        echo json_encode(['ok' => false, 'error' => 'Données invalides']);
        exit;
    }
    $json         = json_encode($payload['data']);
    $tags_json    = isset($payload['tags'])       ? json_encode($payload['tags'])       : '{}';
    // Historique : on stocke { history: [...], historySym: {...} } dans une seule colonne
    $history_blob = json_encode([
        'history'    => $payload['history']    ?? [],
        'historySym' => $payload['historySym'] ?? [],
    ]);

    $db->prepare("INSERT INTO portfolios (user_id, data, tags_json, history_json, updated_at)
                  VALUES (?, ?, ?, ?, datetime('now'))
                  ON CONFLICT(user_id) DO UPDATE
                  SET data=excluded.data,
                      tags_json=excluded.tags_json,
                      history_json=excluded.history_json,
                      updated_at=excluded.updated_at")
       ->execute([$userId, $json, $tags_json, $history_blob]);

    echo json_encode(['ok' => true, 'saved' => count($payload['data'])]);

} else {
    $stmt = $db->prepare("SELECT data, tags_json, history_json FROM portfolios WHERE user_id = ?");
    $stmt->execute([$userId]);
    $row = $stmt->fetch();
    if ($row) {
        $tags       = json_decode($row['tags_json']    ?? '{}', true) ?: [];
        $histBlob   = json_decode($row['history_json'] ?? '{}', true) ?: [];
        $history    = $histBlob['history']    ?? [];
        $historySym = $histBlob['historySym'] ?? [];
        echo json_encode([
            'ok'        => true,
            'data'      => json_decode($row['data'], true),
            'tags'      => $tags,
            'history'   => $history,
            'historySym'=> $historySym,
        ]);
    } else {
        echo json_encode(['ok' => true, 'data' => [], 'tags' => [], 'history' => [], 'historySym' => []]);
    }
}
?>
