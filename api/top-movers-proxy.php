<?php
// api/top-movers-proxy.php — Top 5 Hausses / Baisses BVC (temps réel)
ini_set('serialize_precision', 14);
// Source 0 : casablanca-bourse.com API officielle (dashboard/data)  ← PRIORITÉ MAXIMALE
// Source 1 : casablancabourse.com/functions/changetoday.json         ← fallback
// Source 2 : TradingView Scanner Morocco                             ← dernier recours

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Cache-Control: no-cache, must-revalidate');

// ─── Fonction CURL commune ────────────────────────────────────────────────────
function curlGet(string $url, array $headers = []): ?string {
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_TIMEOUT        => 12,
        CURLOPT_USERAGENT      => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        CURLOPT_HTTPHEADER     => array_merge([
            'Accept: application/json, */*',
            'Accept-Language: fr-FR,fr;q=0.9',
        ], $headers),
    ]);
    $raw  = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    return ($code === 200 && $raw) ? $raw : null;
}

// ─── Source 0 : API officielle Bourse de Casablanca (dashboard/data) ─────────
function fetchBVCDashboard(): array {
    $url = 'https://www.casablanca-bourse.com/api/proxy/fr/api/bourse/dashboard/data'
         . '?indices[0]=512343&indices[1]=512335&indices[2]=512320'
         . '&mw_high[limit]=5&mw_high[type_marche]=59&mw_high[classes][25]=25&mw_high[ss_classes][38]=38'
         . '&mw_low[limit]=5&mw_low[type_marche]=59&mw_low[classes][25]=25&mw_low[ss_classes][38]=38';

    $raw = curlGet($url, [
        'Referer: https://www.casablanca-bourse.com/fr/live-market/overview',
        'Origin: https://www.casablanca-bourse.com',
    ]);
    if (!$raw) return [];

    $d = json_decode($raw, true);
    if (!$d) return [];
    $data = $d['data'] ?? $d;

    $mapStock = function(array $s): array {
        $ticker = $s['ticker'] ?? ($s['label'] ?? '');
        $nom    = $s['label']  ?? $ticker;
        return [
            'ticker'    => strtoupper($ticker),
            'nom'       => $nom,
            'cours'     => round((float)($s['field_cours_courant'] ?? 0), 2),
            'variation' => round((float)($s['field_var_veille']    ?? 0), 2),
        ];
    };

    $high = array_values(array_slice($data['mw_high_values'] ?? [], 0, 5));
    $low  = array_values(array_slice($data['mw_low_values']  ?? [], 0, 5));

    if (empty($high) && empty($low)) return [];

    return [
        'hausses' => array_map($mapStock, $high),
        'baisses' => array_map($mapStock, $low),
        'date'    => date('d/m/Y H:i'),
        'source'  => 'casablanca-bourse.com',
    ];
}

// ─── Source 1 : casablancabourse.com API JSON ─────────────────────────────────
function fetchCasablancaBourseAPI(): array {
    $url = 'https://www.casablancabourse.com/functions/changetoday.json?t=' . time();
    $raw = curlGet($url, [
        'Referer: https://www.casablancabourse.com/',
        'Origin: https://www.casablancabourse.com',
    ]);
    if (!$raw) return [];

    $data = json_decode($raw, true);
    if (!$data) return [];
    $obj = is_array($data) && isset($data[0]) ? $data[0] : $data;

    $gainers = $obj['top_gainers'] ?? [];
    $losers  = $obj['top_losers']  ?? [];
    if (empty($gainers) && empty($losers)) return [];

    $mapEntry = fn(array $item): array => [
        'ticker'    => (string)($item['Symbol']  ?? ''),
        'nom'       => (string)($item['Libelle'] ?? $item['Symbol'] ?? ''),
        'cours'     => round((float)($item['Cours']     ?? 0), 2),
        'variation' => round((float)($item['Variation'] ?? 0), 2),
    ];

    return [
        'hausses' => array_values(array_slice(array_map($mapEntry, $gainers), 0, 5)),
        'baisses' => array_values(array_slice(array_map($mapEntry, $losers),  0, 5)),
        'date'    => $obj['last_update'] ?? date('d/m/Y H:i'),
        'source'  => 'casablancabourse',
    ];
}

// ─── Source 2 : TradingView Scanner Morocco (fallback) ───────────────────────
function fetchTradingView(): array {
    $payload = json_encode([
        'columns' => ['name','description','close','change','volume'],
        'sort'    => ['sortBy'=>'change','sortOrder'=>'desc'],
        'range'   => [0, 200],
    ]);
    $ch = curl_init('https://scanner.tradingview.com/morocco/scan');
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_TIMEOUT        => 12,
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => $payload,
        CURLOPT_USERAGENT      => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        CURLOPT_HTTPHEADER     => ['Content-Type: application/json','Origin: https://fr.tradingview.com','Referer: https://fr.tradingview.com/'],
    ]);
    $raw  = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    if ($code !== 200 || !$raw) return [];
    $j = json_decode($raw, true);
    if (!isset($j['data'])) return [];

    $stocks = [];
    foreach ($j['data'] as $item) {
        $d = $item['d'] ?? [];
        if (count($d) < 4) continue;
        $ticker = strtoupper(preg_replace('/^[A-Z]+:/', '', (string)($d[0] ?? '')));
        $nom    = (string)($d[1] ?? $ticker);
        $cours  = (float)($d[2] ?? 0);
        $var    = (float)($d[3] ?? 0);
        if (!$ticker || $cours <= 0 || $var == 0) continue;
        $stocks[] = compact('ticker','nom','cours') + ['variation' => $var];
    }
    if (empty($stocks)) return [];

    $seen = []; $dedup = [];
    foreach ($stocks as $s) {
        if (!isset($seen[$s['ticker']])) { $seen[$s['ticker']] = true; $dedup[] = $s; }
    }

    usort($dedup, fn($a,$b) => $b['variation'] <=> $a['variation']);
    $hausses = array_slice($dedup, 0, 5);
    usort($dedup, fn($a,$b) => $a['variation'] <=> $b['variation']);
    $baisses = array_slice($dedup, 0, 5);

    $normalize = fn($list) => array_values(array_map(fn($s) => [
        'ticker'    => $s['ticker'],
        'nom'       => $s['nom'],
        'cours'     => round((float)$s['cours'],    2),
        'variation' => round((float)$s['variation'], 2),
    ], $list));

    return [
        'hausses' => $normalize($hausses),
        'baisses' => $normalize($baisses),
        'date'    => date('d/m/Y H:i'),
        'source'  => 'tradingview',
    ];
}

// ─── Appel des sources dans l'ordre de priorité ───────────────────────────────
$result = fetchBVCDashboard();
if (empty($result)) $result = fetchCasablancaBourseAPI();
if (empty($result)) $result = fetchTradingView();

if (empty($result)) {
    echo json_encode(['success'=>false,'error'=>'Toutes les sources indisponibles'], JSON_UNESCAPED_UNICODE);
    exit;
}

echo json_encode([
    'success' => true,
    'source'  => $result['source'],
    'date'    => $result['date'],
    'hausses' => $result['hausses'],
    'baisses' => $result['baisses'],
], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
