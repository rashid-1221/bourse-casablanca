<?php
// api/markets-proxy.php — Cours mondiaux (Yahoo Finance v8/chart)
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Cache-Control: public, max-age=300');

$symbols = [
    'GC=F'     => ['nom' => 'Or',          'emoji' => '🥇', 'unite' => '$/oz'],
    'SI=F'     => ['nom' => 'Argent',      'emoji' => '🥈', 'unite' => '$/oz'],
    'CL=F'     => ['nom' => 'Pétrole WTI', 'emoji' => '🛢️', 'unite' => '$/b'],
    'BZ=F'     => ['nom' => 'Brent',       'emoji' => '⛽', 'unite' => '$/b'],
    'PL=F'     => ['nom' => 'Platine',     'emoji' => '⚪', 'unite' => '$/oz'],
    '^GSPC'    => ['nom' => 'S&P 500',     'emoji' => '🇺🇸', 'unite' => 'pts'],
    '^FCHI'    => ['nom' => 'CAC 40',      'emoji' => '🇫🇷', 'unite' => 'pts'],
    '^CMC'     => ['nom' => 'MASI',        'emoji' => '🇲🇦', 'unite' => 'pts'],
    '^DJI'     => ['nom' => 'Dow Jones',   'emoji' => '📈', 'unite' => 'pts'],
    '^IXIC'    => ['nom' => 'Nasdaq',      'emoji' => '💻', 'unite' => 'pts'],
    'EURUSD=X' => ['nom' => 'EUR/USD',     'emoji' => '💱', 'unite' => ''],
    'USDMAD=X' => ['nom' => 'USD/MAD',     'emoji' => '💵', 'unite' => ''],
];

$ctx = stream_context_create(['http' => [
    'timeout' => 6,
    'header'  => "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)\r\n" .
                 "Accept: application/json\r\n"
]]);

$results = [];

foreach ($symbols as $sym => $info) {
    $symEnc = urlencode($sym);
    $url    = "https://query2.finance.yahoo.com/v8/finance/chart/{$symEnc}?interval=1d&range=2d";
    $raw    = @file_get_contents($url, false, $ctx);
    if (!$raw) continue;

    $d    = json_decode($raw, true);
    $meta = $d['chart']['result'][0]['meta'] ?? null;
    if (!$meta) continue;

    $prix     = $meta['regularMarketPrice'] ?? null;
    $prevClose= $meta['chartPreviousClose'] ?? $meta['previousClose'] ?? null;
    $variation = ($prix && $prevClose && $prevClose > 0)
        ? round(($prix - $prevClose) / $prevClose * 100, 2)
        : null;

    if ($prix === null) continue;

    $results[] = [
        'symbole'   => $sym,
        'nom'       => $info['nom'],
        'emoji'     => $info['emoji'],
        'unite'     => $info['unite'],
        'prix'      => round($prix, 2),
        'variation' => $variation,
        'change'    => ($prix && $prevClose) ? round($prix - $prevClose, 2) : null,
    ];
}

echo json_encode([
    'success' => true,
    'count'   => count($results),
    'data'    => $results,
    'ts'      => date('H:i'),
], JSON_UNESCAPED_UNICODE);
?>
