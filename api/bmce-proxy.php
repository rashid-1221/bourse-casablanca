<?php
// api/bmce-proxy.php — Cours des actions BVC (temps réel)
// Source 0 : casablanca-bourse.com API officielle      ← PRIORITÉ
// Source 1 : Yahoo Finance (.CS suffix) — crumb auto   ← FALLBACK 1
// Source 2 : bmcecapitalbourse.com HTML                ← FALLBACK 2
ini_set('serialize_precision', 14);
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Cache-Control: no-cache, must-revalidate');

// ─── Helpers ──────────────────────────────────────────────────────────────────
function curlGet(string $url, array $opts = []): array {
    $ch = curl_init($url);
    curl_setopt_array($ch, $opts + [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_TIMEOUT        => 12,
        CURLOPT_CONNECTTIMEOUT => 5,
        CURLOPT_USERAGENT      => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        CURLOPT_ENCODING       => '',
    ]);
    $raw  = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    return [$raw ?: '', $code];
}

// ─── Source 0 : API officielle Bourse de Casablanca ──────────────────────────
function fetchBVCTicker(): array {
    $endpoints = [
        'https://www.casablanca-bourse.com/api/proxy/fr/api/bourse/dashboard/ticker?marche=59&class[0]=25',
        'https://www.casablanca-bourse.com/api/proxy/fr/api/bourse/dashboard/ticker?marche=59',
        'https://www.casablanca-bourse.com/api/proxy/fr/api/bourse/dashboard/ticker?marche=1',
    ];

    foreach ($endpoints as $url) {
        [$raw, $code] = curlGet($url, [
            CURLOPT_HTTPHEADER => [
                'Accept: application/json, text/plain, */*',
                'Accept-Language: fr-FR,fr;q=0.9,en;q=0.8',
                'Referer: https://www.casablanca-bourse.com/fr/live-market/marche-actions-groupement',
                'Origin: https://www.casablanca-bourse.com',
                'X-Requested-With: XMLHttpRequest',
            ],
        ]);

        if ($code !== 200 || !$raw) continue;

        $prices = [];
        $seen   = [];

        // ── Tentative 1 : json_decode (structure connue ou inconnue) ──
        $json = json_decode($raw, true);
        if ($json && is_array($json)) {
            // Aplatir les différentes structures possibles
            $candidates = [];
            if (isset($json[0]) && is_array($json[0]))                     $candidates = $json;
            elseif (isset($json['data']) && is_array($json['data']))        $candidates = $json['data'];
            elseif (isset($json['tickers']) && is_array($json['tickers']))  $candidates = $json['tickers'];
            elseif (isset($json['result']) && is_array($json['result']))    $candidates = $json['result'];
            elseif (isset($json['items']) && is_array($json['items']))      $candidates = $json['items'];
            else {
                // Chercher récursivement un tableau contenant ticker
                array_walk_recursive($json, function($v, $k) use (&$candidates, $json) {
                    if ($k === 'ticker' && is_string($v)) $candidates = is_array($json) ? [$json] : [];
                });
            }

            foreach ($candidates as $item) {
                if (!is_array($item)) continue;
                $ticker = $item['ticker']               ?? $item['symbol']    ?? $item['code']  ?? null;
                $label  = $item['label']                ?? $item['name']      ?? $item['nom']   ?? $ticker;
                $cours  = $item['field_cours_courant']  ?? $item['cours']     ?? $item['price'] ?? $item['last'] ?? $item['close'] ?? null;
                $var    = $item['field_var_veille']     ?? $item['variation'] ?? $item['change']?? $item['var']  ?? 0;

                if (!$ticker || !is_numeric($cours) || (float)$cours <= 0) continue;
                if (isset($seen[$ticker])) continue;
                $seen[$ticker] = true;

                $prices[] = [
                    'name'      => html_entity_decode((string)($label ?? $ticker), ENT_QUOTES, 'UTF-8'),
                    'ticker'    => strtoupper((string)$ticker),
                    'price'     => round((float)$cours, 2),
                    'variation' => round((float)$var, 4),
                ];
            }
        }

        // ── Tentative 2 : parsing regex sur le JSON brut ──
        if (count($prices) < 10) {
            $prices = []; $seen = [];
            // Chercher tous les blocs market_watch
            $parts = preg_split('/"type"\s*:\s*"market_watch"/', $raw);
            foreach ($parts as $part) {
                preg_match('/"ticker"\s*:\s*"([A-Z0-9]+)"/',             $part, $mT);
                preg_match('/"label"\s*:\s*"([^"]+)"/',                  $part, $mL);
                preg_match('/"field_cours_courant"\s*:\s*"?([0-9.,]+)"?/', $part, $mC);
                preg_match('/"field_var_veille"\s*:\s*"?(-?[0-9.,]+)"?/',  $part, $mV);

                $ticker = $mT[1] ?? null;
                $cours  = isset($mC[1]) ? str_replace(',', '.', $mC[1]) : null;
                $var    = isset($mV[1]) ? str_replace(',', '.', $mV[1]) : 0;

                if (!$ticker || !is_numeric($cours) || (float)$cours <= 0) continue;
                if (isset($seen[$ticker])) continue;
                $seen[$ticker] = true;

                $prices[] = [
                    'name'      => html_entity_decode($mL[1] ?? $ticker, ENT_QUOTES, 'UTF-8'),
                    'ticker'    => $ticker,
                    'price'     => round((float)$cours, 2),
                    'variation' => round((float)$var, 4),
                ];
            }
        }

        if (count($prices) >= 10) {
            usort($prices, fn($a, $b) => strcmp($a['name'], $b['name']));
            return $prices;
        }
    }

    return [];
}

// ─── Source 1 : Yahoo Finance — batch .CS ────────────────────────────────────
function fetchYahooFinance(): array {
    $bvcTickers = [
        'ADH','ADI','AFM','AGM','AIS','AKT','ALM','ARD','ATH','ATL','ATW',
        'BAL','BCI','BCP','BOA','CDM','CFG','CIH','CMA','CMG','CMT',
        'COL','CRS','CSH','CSR','CTM','DHO','DRI','DST','DWY','NKL',
        'EQD','FBR','GAZ','GTM','HPS','IAM','IBC','IMR','INV','JET',
        'LBV','LES','LHM','M2M','MDP','MGB','MIC','MLE','MNG','MOX',
        'MUT','NEJ','OCP','OUL','PRO','RDS','REB','RIS','S2M','SAH',
        'SAL','SBM','SOD','SID','SMI','SNA','SNP','SOT','SRM','STI',
        'TGC','TMA','TQM','UMR','VCN','WAA','ZDJ',
    ];

    $symbols    = array_map(fn($t) => $t . '.CS', $bvcTickers);
    $symbolsStr = implode(',', $symbols);
    $cookieJar  = sys_get_temp_dir() . '/bvc_yahoo_ck.txt';

    // Étape 1 — initialiser le cookie Yahoo (consent)
    $chCk = curl_init('https://fc.yahoo.com');
    curl_setopt_array($chCk, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_TIMEOUT        => 6,
        CURLOPT_COOKIEJAR      => $cookieJar,
        CURLOPT_COOKIEFILE     => $cookieJar,
        CURLOPT_USERAGENT      => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        CURLOPT_HTTPHEADER     => ['Accept-Language: en-US,en;q=0.9'],
    ]);
    curl_exec($chCk);
    curl_close($chCk);

    // Étape 2 — obtenir le crumb
    $chCr = curl_init('https://query1.finance.yahoo.com/v1/test/getcrumb');
    curl_setopt_array($chCr, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_TIMEOUT        => 6,
        CURLOPT_COOKIEFILE     => $cookieJar,
        CURLOPT_USERAGENT      => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        CURLOPT_HTTPHEADER     => ['Accept: text/plain, */*'],
    ]);
    $crumb = trim((string)curl_exec($chCr));
    curl_close($chCr);

    // Vérifier que le crumb est valide
    if (!$crumb || strlen($crumb) < 3 || str_contains($crumb, '<')) return [];

    // Étape 3 — requête batch
    $url = 'https://query1.finance.yahoo.com/v7/finance/quote'
         . '?symbols=' . urlencode($symbolsStr)
         . '&crumb='   . urlencode($crumb)
         . '&fields=regularMarketPrice,regularMarketChangePercent,shortName,longName';

    $chQ = curl_init($url);
    curl_setopt_array($chQ, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_TIMEOUT        => 15,
        CURLOPT_COOKIEFILE     => $cookieJar,
        CURLOPT_USERAGENT      => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        CURLOPT_HTTPHEADER     => ['Accept: application/json', 'Accept-Language: en-US,en;q=0.9'],
    ]);
    $raw  = curl_exec($chQ);
    $code = curl_getinfo($chQ, CURLINFO_HTTP_CODE);
    curl_close($chQ);

    if ($code !== 200 || !$raw) return [];

    $json    = json_decode($raw, true);
    $results = $json['quoteResponse']['result'] ?? [];
    if (empty($results)) return [];

    $prices = [];
    foreach ($results as $r) {
        $symbol = $r['symbol'] ?? '';
        $ticker = str_replace('.CS', '', $symbol);
        $price  = $r['regularMarketPrice']          ?? 0;
        $var    = $r['regularMarketChangePercent']   ?? 0;
        $name   = $r['shortName'] ?? $r['longName'] ?? $ticker;

        if ($price <= 0) continue;

        $prices[] = [
            'name'      => (string)$name,
            'ticker'    => $ticker,
            'price'     => round((float)$price, 2),
            'variation' => round((float)$var, 4),
        ];
    }

    if (count($prices) < 5) return [];
    usort($prices, fn($a, $b) => strcmp($a['name'], $b['name']));
    return $prices;
}

// ─── Source 2 : BMCE Capital Bourse (HTML scraping) ──────────────────────────
function fetchBMCE(): array {
    $urls = [
        'https://www.bmcecapitalbourse.com/bkbbourse/lists/TK?q=AE31180F8E3BE20E762758E81EDC1204',
        'https://www.bmcecapitalbourse.com/bkbbourse/lists/TK',
    ];

    foreach ($urls as $url) {
        [$html, $code] = curlGet($url, [CURLOPT_TIMEOUT => 20]);
        if ($code !== 200 || !$html) continue;

        $html = preg_replace('/\s+/', ' ', $html);
        preg_match_all('/<table[^>]*>(.*?)<\/table>/is', $html, $tableMatches);

        $prices  = [];
        $nomsVus = [];

        foreach ($tableMatches[1] as $tableContent) {
            preg_match_all('/<tr[^>]*>(.*?)<\/tr>/is', $tableContent, $rowMatches);
            if (count($rowMatches[1]) <= 30) continue;

            foreach ($rowMatches[1] as $row) {
                preg_match_all('/<td[^>]*>(.*?)<\/td>/is', $row, $cellMatches);
                $cells = $cellMatches[1];
                if (count($cells) < 5) continue;

                $name = trim(strip_tags($cells[0]));
                if (!$name || in_array($name, ['Valeur','Hausses','Baisses'], true)) continue;

                $priceRaw   = str_replace([' ', ','], ['', '.'], trim(strip_tags($cells[3])));
                $priceClean = preg_replace('/[^0-9.]/', '', $priceRaw);
                $varClean   = str_replace([',', '%', ' '], ['.', '', ''], trim(strip_tags($cells[4])));

                if (!is_numeric($priceClean) || isset($nomsVus[$name])) continue;
                $prices[]      = ['name' => $name, 'ticker' => '', 'price' => (float)$priceClean, 'variation' => (float)$varClean];
                $nomsVus[$name] = true;
            }
            break;
        }

        if (count($prices) >= 10) {
            usort($prices, fn($a, $b) => strcmp($a['name'], $b['name']));
            return $prices;
        }
    }

    return [];
}

// ─── Chaîne de fallback ───────────────────────────────────────────────────────
$prices = fetchBVCTicker();
$source = 'casablanca-bourse.com';

if (empty($prices)) {
    $prices = fetchYahooFinance();
    $source = 'Yahoo Finance (.CS)';
}

if (empty($prices)) {
    $prices = fetchBMCE();
    $source = 'bmcecapitalbourse.com';
}

if (empty($prices)) {
    echo json_encode(['success' => false, 'error' => 'Toutes les sources indisponibles (BVC + Yahoo + BMCE)']);
    exit;
}

echo json_encode([
    'success'   => true,
    'source'    => $source,
    'timestamp' => time(),
    'date'      => date('Y-m-d H:i:s'),
    'count'     => count($prices),
    'data'      => $prices,
], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
