<?php
/**
 * api/translate-proxy.php
 * Traduit un tableau de titres EN→FR  ET  EN→AR  via Google Translate (client=gtx, sans clé API)
 * Cache individuel par hash MD5 dans api/translations-cache/ — durée 30 jours
 *
 * POST  { "texts": ["titre 1", "titre 2", …] }
 * ──→   { "success": true, "results": [{"fr":"…","ar":"…"}, …] }
 */
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

// ── Répertoire cache ──────────────────────────────────────────────────────
$cacheDir = __DIR__ . '/translations-cache/';
if (!is_dir($cacheDir)) @mkdir($cacheDir, 0755, true);

// ── Lecture du body ───────────────────────────────────────────────────────
$body  = json_decode(file_get_contents('php://input'), true);
$texts = array_slice(array_values($body['texts'] ?? []), 0, 30); // max 30

if (empty($texts)) {
    echo json_encode(['success' => false, 'error' => 'texts[] requis']);
    exit;
}

// ── Trier : cache hit vs. à traduire ─────────────────────────────────────
$results     = [];
$toTranslate = [];           // [index => cleaned_text]

foreach ($texts as $i => $raw) {
    $text = trim(mb_substr((string)$raw, 0, 400, 'UTF-8'));
    $key  = md5($text);
    $file = $cacheDir . $key . '.json';

    if (file_exists($file) && (time() - filemtime($file)) < 86400 * 30) {
        $cached = json_decode(file_get_contents($file), true);
        $results[$i] = is_array($cached) ? $cached : ['fr' => $text, 'ar' => $text];
    } else {
        $toTranslate[$i] = $text;
        $results[$i]     = ['fr' => '', 'ar' => ''];
    }
}

// ── Traduction parallèle via curl_multi ───────────────────────────────────
if (!empty($toTranslate)) {

    $mh    = curl_multi_init();
    $curls = [];

    foreach ($toTranslate as $i => $text) {
        foreach (['fr', 'ar'] as $lang) {
            $url = 'https://translate.googleapis.com/translate_a/single?'
                . http_build_query([
                    'client' => 'gtx',
                    'sl'     => 'auto',
                    'tl'     => $lang,
                    'dt'     => 't',
                    'q'      => $text,
                ]);

            $ch = curl_init($url);
            curl_setopt_array($ch, [
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_TIMEOUT        => 12,
                CURLOPT_USERAGENT      => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                CURLOPT_SSL_VERIFYPEER => false,
                CURLOPT_FOLLOWLOCATION => true,
            ]);
            curl_multi_add_handle($mh, $ch);
            $curls[] = ['ch' => $ch, 'i' => $i, 'lang' => $lang, 'orig' => $text];
        }
    }

    // Exécuter toutes les requêtes en parallèle
    $active = null;
    do {
        curl_multi_exec($mh, $active);
        curl_multi_select($mh, 0.3);
    } while ($active > 0);

    // Collecter les résultats
    foreach ($curls as $item) {
        $raw  = curl_multi_getcontent($item['ch']);
        curl_multi_remove_handle($mh, $item['ch']);
        curl_close($item['ch']);

        $translated = '';
        if ($raw) {
            $j = json_decode($raw, true);
            // Format Google Translate: [ [ ["traduit","orig",...], ... ], ... ]
            if (is_array($j) && is_array($j[0])) {
                foreach ($j[0] as $seg) {
                    $translated .= ($seg[0] ?? '');
                }
            }
        }
        $results[$item['i']][$item['lang']] = $translated ?: $item['orig'];
    }
    curl_multi_close($mh);

    // Sauvegarder chaque traduction dans le cache
    foreach ($toTranslate as $i => $text) {
        $key  = md5($text);
        $file = $cacheDir . $key . '.json';
        @file_put_contents($file, json_encode($results[$i], JSON_UNESCAPED_UNICODE));
    }
}

ksort($results);
echo json_encode(
    ['success' => true, 'results' => array_values($results)],
    JSON_UNESCAPED_UNICODE
);
