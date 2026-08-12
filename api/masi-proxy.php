<?php
// api/masi-proxy.php — Valeur et variation du MASI
ini_set('serialize_precision', 14);
// Sources (par priorité) :
//   1. Yahoo Finance — ^MASI (temps réel, le plus fiable)
//   2. BVC officielle — casablanca-bourse.com
//   3. BMCE Capital Bourse — fallback
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Cache-Control: no-cache, must-revalidate');

// ─── Source 1 : Yahoo Finance (^MASI) ────────────────────────────────────────
function fetchMasiYahoo(): array {
    $cookieFile = sys_get_temp_dir() . '/yahoo_bvc_cookie.txt';
    // Crumb
    $ch = curl_init('https://fc.yahoo.com');
    curl_setopt_array($ch, [CURLOPT_RETURNTRANSFER=>true,CURLOPT_SSL_VERIFYPEER=>false,CURLOPT_TIMEOUT=>6,CURLOPT_COOKIEJAR=>$cookieFile,CURLOPT_COOKIEFILE=>$cookieFile,CURLOPT_USERAGENT=>'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36']);
    curl_exec($ch); curl_close($ch);
    $ch = curl_init('https://query2.finance.yahoo.com/v1/test/getcrumb');
    curl_setopt_array($ch, [CURLOPT_RETURNTRANSFER=>true,CURLOPT_SSL_VERIFYPEER=>false,CURLOPT_TIMEOUT=>6,CURLOPT_COOKIEFILE=>$cookieFile,CURLOPT_USERAGENT=>'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36']);
    $crumb = trim((string)curl_exec($ch)); curl_close($ch);
    if (strlen($crumb) > 40) $crumb = '';

    // Requête MASI
    $url = 'https://query1.finance.yahoo.com/v7/finance/quote?symbols=%5EMASI&fields=regularMarketPrice,regularMarketChangePercent,regularMarketPreviousClose';
    if ($crumb) $url .= '&crumb=' . urlencode($crumb);
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER=>true, CURLOPT_SSL_VERIFYPEER=>false, CURLOPT_TIMEOUT=>10,
        CURLOPT_COOKIEFILE=>$cookieFile,
        CURLOPT_USERAGENT=>'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        CURLOPT_HTTPHEADER=>['Accept: application/json','Referer: https://finance.yahoo.com/'],
    ]);
    $raw  = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    if ($code !== 200 || !$raw) return [];
    $j = json_decode($raw, true);
    $q = $j['quoteResponse']['result'][0] ?? null;
    if (!$q) return [];
    $val = $q['regularMarketPrice'] ?? null;
    $var = $q['regularMarketChangePercent'] ?? null;
    if (!$val || $val < 1000) return [];
    return [
        'valeur'    => round((float)$val, 2),
        'variation' => $var !== null ? round((float)$var, 2) : 0,
        'source'    => 'yahoo'
    ];
}

// ─── Source 2 : BVC officielle ───────────────────────────────────────────────
function fetchMasiBVC(): array {
    $ch = curl_init('https://www.casablanca-bourse.com/fr/live-market/overview');
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER=>true, CURLOPT_SSL_VERIFYPEER=>false,
        CURLOPT_FOLLOWLOCATION=>true, CURLOPT_TIMEOUT=>10, CURLOPT_CONNECTTIMEOUT=>5,
        CURLOPT_USERAGENT=>'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        CURLOPT_HTTPHEADER=>['Accept-Language: fr-FR,fr;q=0.9'],
    ]);
    $html = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    if ($code !== 200 || !$html) return [];
    $html = preg_replace('/\s+/', ' ', $html);

    // Chercher valeur MASI dans la page
    $val = null; $var = null;
    // Pattern 1 : "MASI" suivi d'une valeur numérique > 1000
    if (preg_match('/MASI[^0-9]*([0-9]{4,6}[.,][0-9]{1,4})/i', $html, $m)) {
        $raw = str_replace(',', '.', preg_replace('/[^0-9.]/', '', $m[1]));
        if (is_numeric($raw) && (float)$raw > 1000) $val = round((float)$raw, 2);
    }
    // Pattern 2 : variation après MASI
    if ($val && preg_match('/MASI[^%]*([+-]?[0-9]+[.,][0-9]+)\s*%/i', $html, $m2)) {
        $raw = str_replace(',', '.', $m2[1]);
        if (is_numeric($raw)) $var = round((float)$raw, 2);
    }
    if (!$val) return [];
    return ['valeur' => $val, 'variation' => $var ?? 0, 'source' => 'bvc'];
}

// ─── Source 3 : BMCE Capital Bourse (fallback) ───────────────────────────────
function fetchMasiBMCE(): array {
    $ch = curl_init('https://www.bmcecapitalbourse.com/bkbbourse/indices');
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER=>true, CURLOPT_FOLLOWLOCATION=>true,
        CURLOPT_SSL_VERIFYPEER=>false, CURLOPT_USERAGENT=>'Mozilla/5.0',
        CURLOPT_TIMEOUT=>12, CURLOPT_HTTPHEADER=>['Accept-Language: fr-FR,fr;q=0.9']
    ]);
    $html     = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    if ($httpCode !== 200 || !$html) return [];

    $html = preg_replace('/[\r\n\t]/', ' ', $html);
    $html = preg_replace('/  +/', ' ', $html);

    $val = null; $var = null;
    if (preg_match('/data-s="1356351,102,608:LVAL_NORM[^"]*"[^>]*>(?:<span[^>]*>)?([^<]+)</i', $html, $mv)) {
        $raw = preg_replace('/[^\d,\.]/', '', trim($mv[1]));
        $raw = str_replace(',', '.', $raw);
        if (is_numeric($raw) && (float)$raw > 1000) $val = (float)$raw;
    }
    if (preg_match('/data-s="1356351,102,608:NC2_PR_NORM[^"]*"[^>]*>([^<]+)</i', $html, $mv)) {
        $raw = str_replace([' ',"\xc2\xa0",',','%','+'],['',' ','.','',''], trim(strip_tags($mv[1])));
        if (is_numeric($raw)) $var = (float)$raw;
    }
    if (!$val) return [];
    return ['valeur' => round($val, 2), 'variation' => round($var ?? 0, 2), 'source' => 'bmce'];
}

// ─── Source 0 : TradingView Scanner pour MASI ────────────────────────────────
function fetchMasiTradingView(): array {
    $payload = json_encode([
        'filter'  => [['left'=>'name','operation'=>'equal','right'=>'XCAS:MASI']],
        'columns' => ['name','close','change','change_abs'],
        'range'   => [0, 1],
    ]);
    $ch = curl_init('https://scanner.tradingview.com/morocco/scan');
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER=>true, CURLOPT_SSL_VERIFYPEER=>false, CURLOPT_TIMEOUT=>8,
        CURLOPT_POST=>true, CURLOPT_POSTFIELDS=>$payload,
        CURLOPT_USERAGENT=>'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        CURLOPT_HTTPHEADER=>['Content-Type: application/json','Origin: https://fr.tradingview.com','Referer: https://fr.tradingview.com/'],
    ]);
    $raw  = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    if ($code !== 200 || !$raw) return [];
    $j = json_decode($raw, true);
    $d = $j['data'][0]['d'] ?? null;
    if (!$d || count($d) < 3) return [];
    $val = (float)($d[1] ?? 0);
    $var = (float)($d[2] ?? 0);
    if ($val < 1000) return [];
    return ['valeur' => round($val, 2), 'variation' => round($var, 2), 'source' => 'tradingview'];
}

// ─── Source 0 : casablancabourse.com API JSON (priorité maximale) ────────────
function fetchMasiCasablancaBourseAPI(): array {
    $url = 'https://www.casablancabourse.com/functions/masi.json?t=' . time();
    $ch  = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_TIMEOUT        => 10,
        CURLOPT_USERAGENT      => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        CURLOPT_HTTPHEADER     => [
            'Accept: application/json, */*',
            'Referer: https://www.casablancabourse.com/',
            'Origin: https://www.casablancabourse.com',
        ],
    ]);
    $raw  = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    if ($code !== 200 || !$raw) return [];

    $d = json_decode($raw, true);
    if (!$d) return [];

    $val = (float)($d['Cours']        ?? 0);
    $var = (float)($d['VariationDay'] ?? 0);
    $ytd = (float)($d['VariationAnneeYTD'] ?? 0);
    if ($val < 1000) return [];

    return [
        'valeur'    => round($val, 2),
        'variation' => round($var, 2),
        'ytd'       => round($ytd, 2),
        'source'    => 'casablancabourse',
    ];
}

// ─── Source 4 : casablancabourse.com scraping (fallback) ─────────────────────
function fetchMasiCasablancaBourse(): array {
    $ch = curl_init('https://www.casablancabourse.com/');
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_TIMEOUT        => 12,
        CURLOPT_USERAGENT      => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        CURLOPT_HTTPHEADER     => ['Accept-Language: fr-FR,fr;q=0.9'],
    ]);
    $html = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    if ($code !== 200 || !$html) return [];

    $html = preg_replace('/\s+/', ' ', $html);
    $val = null; $var = null;

    // Pattern MASI + valeur numérique > 1000
    if (preg_match('/MASI[^0-9]{0,30}([0-9]{4,6}[,\s\.][0-9]{1,4})/i', $html, $m)) {
        $raw = str_replace([' ', ','], ['', '.'], preg_replace('/[^0-9,\.]/', '', $m[1]));
        if (is_numeric($raw) && (float)$raw > 1000) $val = round((float)$raw, 2);
    }
    // Pattern variation %
    if ($val && preg_match('/MASI[^%]{0,80}([+\-]?\s*[0-9]+[,\.][0-9]+)\s*%/i', $html, $m2)) {
        $raw = str_replace([' ', ','], ['', '.'], $m2[1]);
        if (is_numeric($raw)) $var = round((float)$raw, 2);
    }
    if (!$val) return [];
    return ['valeur' => $val, 'variation' => $var ?? 0, 'source' => 'casablancabourse'];
}

// ─── Source priorité absolue : API officielle BVC dashboard/data ─────────────
function fetchMasiBVCDashboard(): array {
    $url = 'https://www.casablanca-bourse.com/api/proxy/fr/api/bourse/dashboard/data'
         . '?indices[0]=512343&indices[1]=512335&indices[2]=512320'
         . '&mw_high[limit]=5&mw_high[type_marche]=59&mw_high[classes][25]=25&mw_high[ss_classes][38]=38'
         . '&mw_low[limit]=5&mw_low[type_marche]=59&mw_low[classes][25]=25&mw_low[ss_classes][38]=38';

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_TIMEOUT        => 10,
        CURLOPT_USERAGENT      => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        CURLOPT_HTTPHEADER     => [
            'Accept: application/json, */*',
            'Referer: https://www.casablanca-bourse.com/fr/live-market/overview',
            'Origin: https://www.casablanca-bourse.com',
        ],
    ]);
    $raw  = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    if ($code !== 200 || !$raw) return [];

    $d    = json_decode($raw, true);
    if (!$d) return [];
    $data = $d['data'] ?? $d;

    $indices = $data['indices'] ?? [];
    $masi    = null;
    foreach ($indices as $idx) {
        if (($idx['index_code'] ?? '') === 'MASI') { $masi = $idx; break; }
    }
    if (!$masi) return [];

    $val = (float)($masi['field_index_value'] ?? 0);
    $var = (float)($masi['field_var_veille']  ?? 0);
    $ytd = (float)($masi['field_var_year']    ?? 0);
    if ($val < 1000) return [];

    return [
        'valeur'    => round($val, 2),
        'variation' => round($var, 2),
        'ytd'       => round($ytd, 2),
        'source'    => 'casablanca-bourse.com',
    ];
}

// ─── Essayer les sources dans l'ordre ────────────────────────────────────────
$result = fetchMasiBVCDashboard();                  // Source 0 — API officielle BVC
if (empty($result)) $result = fetchMasiCasablancaBourseAPI();  // Source 1 — JSON direct
if (empty($result)) $result = fetchMasiTradingView();
if (empty($result)) $result = fetchMasiYahoo();
if (empty($result)) $result = fetchMasiCasablancaBourse();
if (empty($result)) $result = fetchMasiBVC();
if (empty($result)) $result = fetchMasiBMCE();

if (!empty($result)) {
    // Normaliser la précision des flottants
    $result['valeur']    = (float)number_format((float)$result['valeur'],    2, '.', '');
    $result['variation'] = (float)number_format((float)($result['variation'] ?? 0), 2, '.', '');
    echo json_encode(array_merge(['success' => true], $result), JSON_UNESCAPED_UNICODE);
} else {
    echo json_encode(['success' => false, 'error' => 'Toutes les sources MASI inaccessibles']);
}
