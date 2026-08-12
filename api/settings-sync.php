<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');

$file = __DIR__ . '/app_settings.json';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $body = file_get_contents('php://input');
    if (!$body) { echo json_encode(['ok' => false, 'error' => 'empty']); exit; }
    $decoded = json_decode($body, true);
    if ($decoded === null) { echo json_encode(['ok' => false, 'error' => 'invalid json']); exit; }
    $ok = file_put_contents($file, $body, LOCK_EX);
    echo json_encode(['ok' => $ok !== false]);
} else {
    if (!file_exists($file)) {
        echo json_encode(['ok' => true, 'data' => null]);
    } else {
        $content = file_get_contents($file);
        echo json_encode(['ok' => true, 'data' => json_decode($content, true)]);
    }
}
