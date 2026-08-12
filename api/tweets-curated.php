<?php
/**
 * api/tweets-curated.php
 * CRUD pour les infos importantes curatées manuellement
 * GET               → liste tous les posts
 * POST  (JSON body) → ajoute un post
 * DELETE ?id=XXX    → supprime un post par ID
 */
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

$file = __DIR__ . '/tweets-curated.json';

function readPosts(string $f): array {
    if (!file_exists($f)) return [];
    $data = json_decode(file_get_contents($f), true);
    return is_array($data) ? $data : [];
}

function writePosts(string $f, array $posts): void {
    file_put_contents($f, json_encode($posts, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
}

$method = $_SERVER['REQUEST_METHOD'];

// ── GET ──────────────────────────────────────────────────────────────────────
if ($method === 'GET') {
    $posts = readPosts($file);
    echo json_encode(['success' => true, 'posts' => $posts, 'count' => count($posts)], JSON_UNESCAPED_UNICODE);
    exit;
}

// ── POST ─────────────────────────────────────────────────────────────────────
if ($method === 'POST') {
    $body = json_decode(file_get_contents('php://input'), true);
    $text = trim($body['text'] ?? '');
    if (!$text) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Texte requis']);
        exit;
    }
    $cats  = ['geopolitique', 'petrole', 'fed', 'crypto', 'bvc', 'trump', 'guerre', 'autre'];
    $cat   = in_array($body['category'] ?? '', $cats) ? $body['category'] : 'autre';
    $rawUrl = trim($body['url'] ?? '');
    $url   = filter_var($rawUrl, FILTER_VALIDATE_URL) ? $rawUrl : '';

    $posts = readPosts($file);
    $post  = [
        'id'       => uniqid('p', true),
        'text'     => mb_substr($text, 0, 800, 'UTF-8'),
        'source'   => mb_substr(trim($body['source'] ?? ''), 0, 80, 'UTF-8'),
        'category' => $cat,
        'url'      => $url,
        'date'     => date('d/m/Y H:i'),
        'ts'       => time(),
    ];
    array_unshift($posts, $post);          // plus récent en premier
    $posts = array_slice($posts, 0, 100);  // max 100 posts
    writePosts($file, $posts);
    echo json_encode(['success' => true, 'post' => $post], JSON_UNESCAPED_UNICODE);
    exit;
}

// ── DELETE ───────────────────────────────────────────────────────────────────
if ($method === 'DELETE') {
    $id = trim($_GET['id'] ?? '');
    if (!$id) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'ID requis']);
        exit;
    }
    $posts = readPosts($file);
    $posts = array_values(array_filter($posts, fn($p) => ($p['id'] ?? '') !== $id));
    writePosts($file, $posts);
    echo json_encode(['success' => true, 'count' => count($posts)], JSON_UNESCAPED_UNICODE);
    exit;
}

http_response_code(405);
echo json_encode(['success' => false, 'error' => 'Méthode non autorisée']);
