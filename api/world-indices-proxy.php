<?php
/**
 * world-indices-proxy.php
 * Proxy Yahoo Finance — indices mondiaux, matières premières, crypto, forex
 * Cache 10 min  |  ?nocache=1 pour forcer le rafraîchissement
 */
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Cache-Control: no-cache');

$SYMBOLS = [
    '^GSPC', '^IXIC', '^DJI', '^NYA',
    '^FCHI', '^GDAXI',
    '^N225', '000001.SS', '^AXJO',
    'GC=F', 'BZ=F', 'CL=F',
    'BTC-USD', 'ETH-USD',
    'EURUSD=X', 'USDMAD=X'
];

// ── Cache 10 minutes ──────────────────────────────────────
$cache_key = sys_get_temp_dir() . '/world_idx_' . floor(time() / 600) . '.json';
if (!isset($_GET['nocache']) && file_exists($cache_key) && (time() - filemtime($cache_key)) < 600) {
    echo file_get_contents($cache_key);
    exit;
}

$ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
$headers = [
    'Accept: application/json, text/plain, */*',
    'Accept-Language: fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
    'Referer: https://finance.yahoo.com/',
    'Origin: https://finance.yahoo.com',
];

// ── 1. Tentative quotes live via v10/quoteSummary ─────────
//    Fallback : on calcule depuis le chart si ça échoue
$quotes = [];
$sym_enc = implode(',', array_map('rawurlencode', $SYMBOLS));

// Essai v7 (parfois bloqué, on ignore l'erreur)
$q_url = "https://query2.finance.yahoo.com/v7/finance/quote?symbols={$sym_enc}&lang=en-US&region=US";
$ch = curl_init($q_url);
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_SSL_VERIFYPEER => false,
    CURLOPT_SSL_VERIFYHOST => 0,
    CURLOPT_TIMEOUT        => 8,
    CURLOPT_USERAGENT      => $ua,
    CURLOPT_HTTPHEADER     => $headers,
    CURLOPT_FOLLOWLOCATION => true,
]);
$raw   = curl_exec($ch);
$errno = curl_errno($ch);
curl_close($ch);

if (!$errno && $raw) {
    $qdata = json_decode($raw, true);
    if (isset($qdata['quoteResponse']['result'])) {
        foreach ($qdata['quoteResponse']['result'] as $q) {
            if (!empty($q['regularMarketPrice'])) {
                $quotes[$q['symbol']] = [
                    'price'       => $q['regularMarketPrice'],
                    'change'      => $q['regularMarketChange']          ?? null,
                    'changePct'   => $q['regularMarketChangePercent']   ?? null,
                    'prevClose'   => $q['regularMarketPreviousClose']   ?? null,
                    'currency'    => $q['currency']                     ?? '',
                    'marketState' => $q['marketState']                  ?? '',
                ];
            }
        }
    }
}

// ── 2. Historique 1 mois (parallel curl_multi) ────────────
//    range=1mo  → ~21 séances pour un calcul fiable
//    On extrait : prix actuel, variation jour, variation 7j, sparkline
$mh      = curl_multi_init();
$handles = [];

foreach ($SYMBOLS as $sym) {
    // Pour crypto/forex très volatils, on prend 1mo ; pour les autres aussi
    $url = 'https://query1.finance.yahoo.com/v8/finance/chart/'
         . rawurlencode($sym)
         . '?interval=1d&range=1mo&includePrePost=false';
    $h = curl_init($url);
    curl_setopt_array($h, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_SSL_VERIFYHOST => 0,
        CURLOPT_TIMEOUT        => 10,
        CURLOPT_USERAGENT      => $ua,
        CURLOPT_HTTPHEADER     => $headers,
        CURLOPT_FOLLOWLOCATION => true,
    ]);
    curl_multi_add_handle($mh, $h);
    $handles[$sym] = $h;
}

$running = null;
do {
    curl_multi_exec($mh, $running);
    curl_multi_select($mh, 0.1);
} while ($running > 0);

$histories = [];
foreach ($handles as $sym => $h) {
    $raw2 = curl_multi_getcontent($h);
    curl_multi_remove_handle($mh, $h);
    curl_close($h);

    if (!$raw2) continue;
    $chart = json_decode($raw2, true);
    if (!isset($chart['chart']['result'][0])) continue;

    $meta   = $chart['chart']['result'][0]['meta'] ?? [];
    $closes = $chart['chart']['result'][0]['indicators']['quote'][0]['close'] ?? [];

    // Filtrer les nulls (séances sans données) et ré-indexer
    $closes = array_values(array_filter($closes, fn($v) => $v !== null));
    $n = count($closes);
    if ($n < 2) continue;

    $last  = (float)$closes[$n - 1];   // prix le plus récent disponible
    $prev  = (float)$closes[$n - 2];   // clôture précédente

    // Variation du jour = dernier prix vs clôture précédente
    $changePct = $prev > 0 ? (($last - $prev) / $prev) * 100 : 0;

    // Variation sur 7 jours glissants = ~5 séances boursières
    // On prend le point d'il y a 5 séances (ou moins si pas assez de données)
    $idx7 = max(0, $n - 6);   // 5 séances en arrière
    $base7 = (float)$closes[$idx7];
    $weeklyPct = $base7 > 0 ? (($last - $base7) / $base7) * 100 : 0;

    // Sparkline = les 8 derniers points disponibles
    $sparkline = array_slice($closes, -8);

    // Prix live depuis meta si disponible (plus récent que le dernier close journalier)
    $livePrice = !empty($meta['regularMarketPrice']) ? (float)$meta['regularMarketPrice'] : $last;
    $prevCloseFromMeta = !empty($meta['previousClose']) ? (float)$meta['previousClose'] : $prev;

    // Recalculer la variation avec le prix live si différent
    if ($livePrice !== $last && $prevCloseFromMeta > 0) {
        $changePct = (($livePrice - $prevCloseFromMeta) / $prevCloseFromMeta) * 100;
    }

    $histories[$sym] = [
        'price'     => round($livePrice, 4),
        'change'    => round($livePrice - ($prevCloseFromMeta ?: $prev), 4),
        'changePct' => round($changePct, 3),
        'prevClose' => round($prevCloseFromMeta ?: $prev, 4),
        'weeklyPct' => round($weeklyPct, 3),
        'sparkline' => array_map(fn($v) => round((float)$v, 6), $sparkline),
    ];
}
curl_multi_close($mh);

// ── 3. Fusion : quotes live en priorité, chart comme fallback ─
$result = [];
foreach ($SYMBOLS as $sym) {
    $h = $histories[$sym] ?? [];
    $q = $quotes[$sym]    ?? [];

    if (!empty($q['price']) && !empty($q['changePct'])) {
        // Quote live disponible : on garde le weeklyPct/sparkline du chart
        $result[$sym] = array_merge($h, $q);
    } else {
        // Fallback : données 100% calculées depuis l'historique chart
        $result[$sym] = $h;
    }
}

$out  = ['success' => true, 'data' => $result, 'ts' => time(), 'source' => 'chart+meta'];
$json = json_encode($out, JSON_UNESCAPED_UNICODE);

file_put_contents($cache_key, $json);
echo $json;
