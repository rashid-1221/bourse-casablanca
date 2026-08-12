<?php
// api/translate-why.php — Traduction batch via Google Translate gratuit (gtx)
// POST JSON : { "texts": ["...", "..."], "lang": "fr"|"ar" }
// Réponse   : { "translated": ["...", "..."] }
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

$body = file_get_contents('php://input');
$req  = json_decode($body, true);

$texts = $req['texts'] ?? [];
$lang  = $req['lang']  ?? 'fr';

if (!in_array($lang, ['fr','ar','en'])) {
    echo json_encode(['error' => 'lang invalide']); exit;
}
if (empty($texts) || !is_array($texts)) {
    echo json_encode(['translated' => []]); exit;
}

// ── Traduction parallèle via curl_multi ────────────────────────────────────
function buildTranslateUrl(string $text, string $lang): string {
    return 'https://translate.googleapis.com/translate_a/single?client=gtx'
         . '&sl=auto&tl=' . urlencode($lang)
         . '&dt=t&q=' . urlencode($text);
}

function extractTranslation(string $raw): string {
    $j = json_decode($raw, true);
    if (!isset($j[0])) return '';
    $out = '';
    foreach ($j[0] as $part) {
        if (isset($part[0])) $out .= $part[0];
    }
    return trim($out);
}

$mh    = curl_multi_init();
$curls = [];
$ua    = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

foreach ($texts as $i => $text) {
    if (!trim($text)) { $curls[] = ['ch' => null, 'idx' => $i]; continue; }
    $ch = curl_init(buildTranslateUrl($text, $lang));
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 8,
        CURLOPT_USERAGENT      => $ua,
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_ENCODING       => '',
    ]);
    curl_multi_add_handle($mh, $ch);
    $curls[] = ['ch' => $ch, 'idx' => $i];
}

$active = null; $deadline = microtime(true) + 9;
do {
    curl_multi_exec($mh, $active);
    if ($active) curl_multi_select($mh, 0.05);
} while ($active > 0 && microtime(true) < $deadline);

$translated = array_fill(0, count($texts), '');
foreach ($curls as $item) {
    if ($item['ch'] === null) { $translated[$item['idx']] = $texts[$item['idx']]; continue; }
    $body   = curl_multi_getcontent($item['ch']);
    $result = $body ? extractTranslation($body) : '';
    $translated[$item['idx']] = $result ?: $texts[$item['idx']];
    curl_multi_remove_handle($mh, $item['ch']);
    curl_close($item['ch']);
}
curl_multi_close($mh);

echo json_encode(['translated' => $translated], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
?>
