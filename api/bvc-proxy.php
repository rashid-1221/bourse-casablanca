<?php
ini_set('serialize_precision', 14); // Éviter l'excès de décimales dans json_encode
// api/bvc-proxy.php — Données consolidées BVC
// Sources (par priorité) :
//   0. TradingView Scanner API  — JSON public, temps réel, très fiable
//   1. Yahoo Finance v7/quote   — requête batch, données temps réel
//   2. casablancabourse.com     — scraping, top hausses/baisses directement
//   3. BVC officielle           — casablanca-bourse.com
//   4. CDG Capital Bourse       — scraping / API JSON
//   5. Wafabourse               — scraping
//   6. Boursenews.ma            — scraping table BVC
//   7. Leboursier.ma            — source supplémentaire
//   8. BMCE Capital Bourse      — fallback (souvent en décalage)
// Cache fichier : 10 min en séance BVC, 30 min hors séance
// Consensus : médiane des sources "temps réel" — BMCE exclu du vote principal
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Cache-Control: no-cache, must-revalidate');

// ─── Liste complète BVC symbole → nom ────────────────────────────────────────
$SOCIETES = [
    'ADH'=>'Addoha','ADI'=>'Alliances','AFM'=>'AFMA','AGM'=>'Agma',
    'AIS'=>'Afric Industries','AKT'=>'Akdital','ALM'=>'Aluminium du Maroc',
    'ARD'=>'Aradei Capital','ATH'=>'Auto Hall','ATL'=>'AtlantaSanad',
    'ATW'=>'Attijariwafa Bank','BAL'=>'Balima','BCI'=>'BMCI',
    'BCP'=>'Banque Populaire','BOA'=>'Bank of Africa','CDM'=>'Crédit du Maroc',
    'CFG'=>'CFG Bank','CIH'=>'CIH Bank','CMA'=>'Ciments du Maroc',
    'CMG'=>'CMGP Group','CMT'=>'CMT','COL'=>'Colorado','CRS'=>'Cartier Saada',
    'CSH'=>'Cash Plus','CSR'=>'Cosumar','CTM'=>'CTM','DHO'=>'Delta Holding',
    'DRI'=>'Dari Couspate','DST'=>'Disty Technologies','DWY'=>'Disway',
    'NKL'=>'Ennakl','EQD'=>'Eqdom','FBR'=>'Fenie Brossette',
    'GAZ'=>'Afriquia Gaz','HPS'=>'HPS','IAM'=>'Maroc Telecom',
    'IBC'=>'IBMaroc.com','IMR'=>'Immorente','INV'=>'Involys',
    'JET'=>'Jet Contractors','LBV'=>'Label Vie','LES'=>'Lesieur Cristal',
    'LHM'=>'LafargeHolcim','M2M'=>'M2M Group','MDP'=>'Med Paper',
    'MGB'=>'Maghrebail','MIC'=>'Microdata','MLE'=>'Maroc Leasing',
    'MNG'=>'Managem','MOX'=>'Maghreb Oxygène','MUT'=>'Mutandis',
    'NEJ'=>'Auto Nejma','OUL'=>'Oulmès','PRO'=>'Promopharm',
    'RDS'=>'Résidences Dar Saada','REB'=>'Rebab Company','RIS'=>'Risma',
    'S2M'=>'S2M','SAH'=>'Sanlam Maroc','SAL'=>'Salafin',
    'SBM'=>'Sté Boissons du Maroc','MSA'=>'Marsa Maroc','GTM'=>'SGTM',
    'SID'=>'Sonasid','SMI'=>'SMI','SNA'=>'SNA','SNP'=>'SNEP',
    'SOT'=>'Sothema','SRM'=>'SRM','STI'=>'Stroc Industrie','TGC'=>'TGCC',
    'TMA'=>'TotalEnergies','TQM'=>'Taqa Morocco','UMR'=>'Unimer',
    'VCN'=>'Vicenne','WAA'=>'Wafa Assurance','ZDJ'=>'Zellidja',
];

// ─── Anciens tickers utilisés par le bandeau casablancabourse.com → nos symboles internes
const OLD_TICKER_ALIAS = [
    'AFI' => 'AIS',   // Afric Industries
    'DYT' => 'DST',   // Disty Technologies
    'MAB' => 'MGB',   // Maghrebail
    'SLF' => 'SAL',   // Salafin
    'STR' => 'STI',   // Stroc Industrie
];

// ─── Noms alternatifs BMCE/Boursenews → symbole BVC ──────────────────────────
const NAME_MAP = [
    // IAM
    'itissalalatmaghrib'  => 'IAM', 'iam'              => 'IAM',
    'maroctelecom'        => 'IAM', 'itissalat'        => 'IAM',
    // BCP
    'banquepopulaire'     => 'BCP', 'bcp'              => 'BCP',
    'groupebanquepopulaire'=> 'BCP',
    // Attijariwafa
    'attijariwafabank'    => 'ATW', 'attijariwafa'     => 'ATW',
    // LafargeHolcim
    'holcimmaroc'         => 'LHM', 'lafargeholcimmaroc'=> 'LHM',
    'lafargeholcim'       => 'LHM',
    // TotalEnergies
    'totalenergiesmaroc'  => 'TMA', 'totalmaroc'       => 'TMA',
    'totalenergiesmktgmaroc'=> 'TMA',
    // Label Vie
    'labelvieroussafood'  => 'LBV', 'labelvie'         => 'LBV',
    // Ciments du Maroc
    'cimentsdumaroc'      => 'CMA', 'asment'           => 'CMA',
    // Sanlam Maroc (ex Saham)
    'sahamassurance'      => 'SAH', 'sanlammaroc'      => 'SAH',
    // Boissons du Maroc
    'sbm'                 => 'SBM', 'societeboissonsdumaroc' => 'SBM',
    // Maghrebail
    'maghrebail'          => 'MGB',
    // Maghreb Oxygène
    'maghreboxygene'      => 'MOX', 'maghreboxy'       => 'MOX',
    // Résidences Dar Saada
    'residencesdarsaada'  => 'RDS', 'darsaada'         => 'RDS',
    'residdarsaada'       => 'RDS', 'resdaraada'       => 'RDS',
    'resid'               => 'RDS', // BMCE abrège parfois en "Résid. Dar Saada"
    // Oulmès
    'lesboissonsdumaroc'  => 'OUL', 'oulmes'           => 'OUL',
    // Marsa Maroc (ex-SODEP)
    'marsamaroc'          => 'MSA', 'sodep'            => 'MSA',
    'sodepmarsamaroc'     => 'MSA', 'marsa'            => 'MSA',
];

// ─── Normaliser nom pour matching ────────────────────────────────────────────
function norm(string $s): string {
    $s = mb_strtolower($s, 'UTF-8');
    $s = str_replace(
        ['à','â','é','è','ê','ë','î','ï','ô','ù','û','ü','ç'],
        ['a','a','e','e','e','e','i','i','o','u','u','u','c'],
        $s
    );
    return preg_replace('/[^a-z0-9]/i', '', $s);
}

// ─── Trouver symbole depuis un nom BMCE/Boursenews ───────────────────────────
function findSymbole(string $name, array $societes): ?string {
    $k = norm($name);
    // 1. NAME_MAP direct
    if (isset(NAME_MAP[$k])) return NAME_MAP[$k];
    // 2. Correspondance exacte dans $societes
    foreach ($societes as $sym => $nom) {
        if (norm($nom) === $k) return $sym;
    }
    // 3. NAME_MAP préfixe (8 chars min pour éviter faux positifs)
    if (strlen($k) >= 8) {
        foreach (NAME_MAP as $altKey => $sym) {
            if (strlen($altKey) >= 8 && substr($k, 0, 8) === substr($altKey, 0, 8)) return $sym;
        }
    }
    // 4. Exact dans $societes avec préfixe 9 chars
    if (strlen($k) >= 9) {
        foreach ($societes as $sym => $nom) {
            $n = norm($nom);
            if (strlen($n) >= 9 && substr($k, 0, 9) === substr($n, 0, 9)) return $sym;
        }
    }
    return null;
}

// ─── Cache fichier ────────────────────────────────────────────────────────────
function getCacheDir(): string {
    return sys_get_temp_dir() . '/bvc_proxy_cache';
}

function getCachePath(): string {
    return getCacheDir() . '/bvc_all.json';
}

function isSeanceBVC(): bool {
    // Séance BVC : lun-ven 09:30-15:30 UTC+1
    $ts       = time() + 3600; // UTC+1
    $jour     = (int)date('N', $ts); // 1=lun, 7=dim
    $heure    = (int)date('H', $ts);
    $minute   = (int)date('i', $ts);
    $minutes  = $heure * 60 + $minute;
    return ($jour >= 1 && $jour <= 5 && $minutes >= 570 && $minutes < 930); // 9h30=570, 15h30=930
}

function getCacheTTL(): int {
    return isSeanceBVC() ? 600 : 1800; // 10 min en séance, 30 min hors séance
}

function readCache(): ?array {
    $path = getCachePath();
    if (!file_exists($path)) return null;
    $raw = @file_get_contents($path);
    if (!$raw) return null;
    $decoded = json_decode($raw, true);
    if (!is_array($decoded)) return null;
    return $decoded;
}

function writeCache(array $payload): void {
    $dir = getCacheDir();
    if (!is_dir($dir)) {
        @mkdir($dir, 0755, true);
    }
    $payload['_cached_at'] = time();
    @file_put_contents(getCachePath(), json_encode($payload, JSON_UNESCAPED_UNICODE));
}

// ─── SOURCE 1 : Yahoo Finance v7/quote — 1 requête batch pour tous les stocks ──
function getYahooCrumb(): array {
    // Cookie + crumb nécessaires pour éviter le rate-limit Yahoo
    $cookieFile = sys_get_temp_dir() . '/yahoo_bvc_cookie.txt';

    // Étape 1 : obtenir les cookies depuis fc.yahoo.com
    $ch = curl_init('https://fc.yahoo.com');
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true, CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_FOLLOWLOCATION => true, CURLOPT_TIMEOUT => 8,
        CURLOPT_COOKIEJAR  => $cookieFile, CURLOPT_COOKIEFILE => $cookieFile,
        CURLOPT_USERAGENT  => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        CURLOPT_HTTPHEADER => ['Accept-Language: en-US,en;q=0.9'],
    ]);
    curl_exec($ch); curl_close($ch);

    // Étape 2 : récupérer le crumb
    $ch = curl_init('https://query2.finance.yahoo.com/v1/test/getcrumb');
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true, CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_TIMEOUT => 8, CURLOPT_COOKIEFILE => $cookieFile,
        CURLOPT_USERAGENT  => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        CURLOPT_HTTPHEADER => ['Accept: */*', 'Referer: https://finance.yahoo.com/'],
    ]);
    $crumb = curl_exec($ch);
    $code  = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    $crumb = ($code === 200 && $crumb && strlen($crumb) < 50) ? trim($crumb) : null;
    return ['crumb' => $crumb, 'cookie' => $cookieFile];
}

function fetchYahoo(array $societes): array {
    // ── Obtenir cookie + crumb Yahoo ──────────────────────────────────────────
    ['crumb' => $crumb, 'cookie' => $cookieFile] = getYahooCrumb();

    // ── Construire liste symboles .CS ─────────────────────────────────────────
    $syms    = array_keys($societes);
    $tickers = implode('%2C', array_map(fn($s) => urlencode($s.'.CS'), $syms));
    $fields  = 'regularMarketPrice,regularMarketChangePercent,regularMarketPreviousClose,'
             . 'regularMarketDayHigh,regularMarketDayLow,regularMarketVolume,shortName';
    $url = "https://query1.finance.yahoo.com/v7/finance/quote?symbols={$tickers}&fields={$fields}&lang=en&region=US";
    if ($crumb) $url .= '&crumb=' . urlencode($crumb);

    // ── Requête batch unique ──────────────────────────────────────────────────
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true, CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_TIMEOUT => 15, CURLOPT_CONNECTTIMEOUT => 6,
        CURLOPT_COOKIEFILE => $cookieFile,
        CURLOPT_USERAGENT  => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        CURLOPT_HTTPHEADER => [
            'Accept: application/json',
            'Accept-Language: en-US,en;q=0.9',
            'Referer: https://finance.yahoo.com/',
            'Origin: https://finance.yahoo.com',
        ],
    ]);
    $raw  = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    // ── Fallback v8/chart individuel si batch échoue ──────────────────────────
    if ($code !== 200 || empty($raw)) {
        return fetchYahooV8Fallback($societes, $cookieFile);
    }

    $json   = json_decode($raw, true);
    $quotes = $json['quoteResponse']['result'] ?? [];
    if (empty($quotes)) return fetchYahooV8Fallback($societes, $cookieFile);

    $data = [];
    foreach ($quotes as $q) {
        $symRaw = $q['symbol'] ?? '';                         // ex : "ADH.CS"
        $sym    = strtoupper(str_replace('.CS', '', $symRaw));
        if (!isset($societes[$sym])) continue;

        $price = $q['regularMarketPrice'] ?? null;
        if (!$price || $price <= 0) continue;

        // regularMarketChangePercent : Yahoo renvoie directement le % (ex: 1.23 = +1.23%)
        // NE PAS multiplier par 100 — valeur déjà en pourcentage
        $varRaw = $q['regularMarketChangePercent'] ?? null;
        $var    = $varRaw !== null ? round((float)$varRaw, 2) : 0;
        $var = max(-15.0, min(15.0, $var));

        $data[$sym] = [
            'symbole'   => $sym,
            'name'      => $societes[$sym],
            'price'     => round($price, 2),
            'variation' => $var,
            'prevClose' => isset($q['regularMarketPreviousClose']) ? round($q['regularMarketPreviousClose'], 2) : null,
            'haut_jour' => isset($q['regularMarketDayHigh'])       ? round($q['regularMarketDayHigh'],       2) : null,
            'bas_jour'  => isset($q['regularMarketDayLow'])        ? round($q['regularMarketDayLow'],        2) : null,
            'volume'    => $q['regularMarketVolume'] ?? null,
            'source'    => 'yahoo',
        ];
    }
    return $data;
}

// Fallback individuel v8/chart si batch v7 échoue (ex: rate-limit sur v7)
function fetchYahooV8Fallback(array $societes, string $cookieFile = ''): array {
    $mh      = curl_multi_init();
    $handles = [];
    // Limiter à 30 stocks pour éviter le rate-limit
    $subset = array_slice($societes, 0, 30, true);
    foreach (array_keys($subset) as $sym) {
        $url = 'https://query1.finance.yahoo.com/v8/finance/chart/'
             . urlencode($sym.'.CS') . '?interval=1d&range=2d&includePrePost=false';
        $ch = curl_init();
        curl_setopt_array($ch, [
            CURLOPT_URL => $url, CURLOPT_RETURNTRANSFER => true,
            CURLOPT_SSL_VERIFYPEER => false, CURLOPT_TIMEOUT => 8, CURLOPT_CONNECTTIMEOUT => 4,
            CURLOPT_COOKIEFILE => $cookieFile ?: '',
            CURLOPT_USERAGENT  => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            CURLOPT_HTTPHEADER => ['Accept: application/json', 'Referer: https://finance.yahoo.com/'],
        ]);
        curl_multi_add_handle($mh, $ch);
        $handles[$sym] = $ch;
    }
    $running = null;
    $dl = microtime(true) + 12;
    do { curl_multi_exec($mh, $running); if ($running) curl_multi_select($mh, 0.3); }
    while ($running > 0 && microtime(true) < $dl);

    $data = [];
    foreach ($handles as $sym => $ch) {
        $raw  = curl_multi_getcontent($ch);
        $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_multi_remove_handle($mh, $ch); curl_close($ch);
        if ($code !== 200 || !$raw) continue;
        $json = json_decode($raw, true);
        if (!isset($json['chart']['result'][0]['meta'])) continue;
        $meta  = $json['chart']['result'][0]['meta'];
        $price = $meta['regularMarketPrice'] ?? null;
        if (!$price || $price <= 0) continue;
        // Yahoo v8 chart : regularMarketChangePercent déjà en % direct
        $cp  = $meta['regularMarketChangePercent'] ?? null;
        $var = $cp !== null ? round((float)$cp, 2) : 0;
        $var = max(-15.0, min(15.0, $var));
        $data[$sym] = [
            'symbole'   => $sym, 'name' => $societes[$sym],
            'price'     => round($price, 2), 'variation' => $var,
            'prevClose' => isset($meta['chartPreviousClose']) ? round($meta['chartPreviousClose'],2) : null,
            'haut_jour' => $meta['regularMarketDayHigh'] ?? null,
            'bas_jour'  => $meta['regularMarketDayLow']  ?? null,
            'volume'    => $meta['regularMarketVolume']  ?? null,
            'source'    => 'yahoo_v8',
        ];
    }
    curl_multi_close($mh);
    return $data;
}

// ─── SOURCE 0a : TradingView Scanner API (JSON public, temps réel) ───────────
function fetchTradingView(array $societes): array {
    // TradingView expose un endpoint scanner public pour le marché marocain (XCAS)
    $payload = json_encode([
        'filter'  => [['left'=>'exchange','operation'=>'equal','right'=>'XCAS']],
        'options' => ['lang'=>'fr'],
        'columns' => ['name','close','change_from_open_abs_percent','change','volume','open','high','low'],
        'sort'    => ['sortBy'=>'change','sortOrder'=>'desc'],
        'range'   => [0, 150],
    ]);
    $ch = curl_init('https://scanner.tradingview.com/morocco/scan');
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_TIMEOUT        => 10,
        CURLOPT_CONNECTTIMEOUT => 5,
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => $payload,
        CURLOPT_USERAGENT      => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        CURLOPT_HTTPHEADER     => [
            'Content-Type: application/json',
            'Origin: https://fr.tradingview.com',
            'Referer: https://fr.tradingview.com/',
            'Accept: application/json',
        ],
    ]);
    $raw  = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    if ($code !== 200 || !$raw) return [];
    $json = json_decode($raw, true);
    if (!isset($json['data']) || !is_array($json['data'])) return [];

    $data = [];
    foreach ($json['data'] as $row) {
        $d = $row['d'] ?? [];
        if (count($d) < 3) continue;
        // name = "XCAS:ADH" ou "ADH"
        $rawSym = $d[0] ?? '';
        $sym    = strtoupper(preg_replace('/^XCAS:/', '', $rawSym));
        $price  = isset($d[1]) ? (float)$d[1] : 0;
        // TradingView 'change' = variation % vs clôture précédente
        $var    = isset($d[3]) ? round((float)$d[3], 2) : 0;
        if (!$sym || $price <= 0 || !isset($societes[$sym])) continue;
        $data[$sym] = [
            'symbole'   => $sym,
            'name'      => $societes[$sym],
            'price'     => round($price, 2),
            'variation' => $var,
            'volume'    => $d[4] ?? null,
            'source'    => 'tradingview',
        ];
    }
    return $data;
}

// ─── SOURCE 0b : casablancabourse.com (top hausses/baisses + cours) ──────────
function fetchCasablancaBourse(array $societes): array {
    $ch = curl_init('https://www.casablancabourse.com/');
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_TIMEOUT        => 12,
        CURLOPT_CONNECTTIMEOUT => 5,
        CURLOPT_USERAGENT      => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        CURLOPT_HTTPHEADER     => ['Accept-Language: fr-FR,fr;q=0.9'],
    ]);
    $html = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    if ($code !== 200 || !$html || strlen($html) < 2000) return [];

    $data = [];

    // Bandeau ticker temps réel en haut de page — chaque valeur est un bloc isolé :
    // <span class="s-item">
    //   <a href="https://www.casablancabourse.com/ADH/action/capitalisation" class="s-sym">ADDOHA</a>
    //   <span class="s-price">37.00 <span>DH</span></span>
    //   <span class="s-up|s-dn|s-flat">▲/▼/— 1.57%</span>
    // </span>
    // NB : on isole chaque bloc s-item avant d'extraire — sans ça, une valeur "s-flat"
    // (variation nulle, sans "%") fait dériver le parsing vers le prix de la valeur suivante.
    preg_match_all('/<span class="s-item">(.*?)<\/span>\s*(?=<span class="s-item">|<\/div>)/is', $html, $blocks);

    foreach ($blocks[1] as $block) {
        if (!preg_match(
            '/href="https:\/\/www\.casablancabourse\.com\/([A-Z0-9]+)\/action\/capitalisation"[^>]*class="s-sym"[^>]*>([^<]*)<\/a>.*?class="s-price">\s*([0-9]+(?:[.,][0-9]+)?)\s*<span[^>]*>\s*DH\s*<\/span>\s*<\/span>\s*<span[^>]*class="(s-up|s-dn|s-flat)"[^>]*>\s*(?:▲|▼)?\s*([0-9]+(?:[.,][0-9]+)?)?%?/isu',
            $block, $row
        )) continue;

        $siteSym = strtoupper($row[1]);
        $sym     = OLD_TICKER_ALIAS[$siteSym] ?? $siteSym;
        if (!isset($societes[$sym]) || isset($data[$sym])) continue;

        $price = (float)str_replace(',', '.', $row[3]);
        if ($price <= 0) continue;

        if ($row[4] === 's-flat') {
            $var = 0.0;
        } else {
            $var = isset($row[5]) && $row[5] !== '' ? (float)str_replace(',', '.', $row[5]) : 0.0;
            if ($row[4] === 's-dn') $var = -$var;
        }

        $data[$sym] = [
            'symbole'   => $sym,
            'name'      => $societes[$sym],
            'price'     => round($price, 2),
            'variation' => round($var, 2),
            'source'    => 'casablancabourse',
        ];
    }
    return $data;
}

// ─── SOURCE 0 (PRIORITÉ ABSOLUE) : API JSON BVC — marche-actions-groupement ───
// Certains tickers BVC diffèrent du symbole interne utilisé dans ce site.
// La BVC utilise MSA pour Marsa Maroc — identique à notre système interne.
$BVC_TICKER_ALIAS = [];

function fetchBVCTickerAPI(array $societes): array {
    global $BVC_TICKER_ALIAS;

    // Endpoint officiel BVC : cours en temps réel depuis marche-actions-groupement
    // Champ "dernier cours" = field_cours_courant
    $url = 'https://www.casablanca-bourse.com/api/proxy/fr/api/bourse/dashboard/ticker'
         . '?marche=59&class[0]=25';

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_TIMEOUT        => 15,
        CURLOPT_USERAGENT      => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        CURLOPT_HTTPHEADER     => [
            'Accept: application/json, */*',
            'Accept-Language: fr-FR,fr;q=0.9',
            'Referer: https://www.casablanca-bourse.com/fr/live-market/marche-actions-groupement',
            'Origin: https://www.casablanca-bourse.com',
        ],
    ]);
    $raw  = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($code !== 200 || !$raw) return [];

    $data  = [];
    $parts = explode('"type":"market_watch"', $raw);

    foreach ($parts as $part) {
        // Extraire ticker, label, dernier cours, variation
        preg_match('/"ticker":"([A-Z0-9]+)"/',           $part, $mT);
        preg_match('/"label":"([^"]+)"/',                $part, $mL);
        preg_match('/"field_cours_courant":"([^"]+)"/',  $part, $mC);
        preg_match('/"field_var_veille":"([^"]+)"/',     $part, $mV);

        $ticker = $mT[1] ?? null;
        $label  = $mL[1] ?? null;
        $cours  = $mC[1] ?? null;

        if (!$ticker || !is_numeric($cours) || (float)$cours <= 0) continue;

        // Remapper les tickers BVC vers le symbole interne (ex: MSA → SOD)
        $localSym = $BVC_TICKER_ALIAS[$ticker] ?? $ticker;

        if (!isset($societes[$localSym])) continue;
        if (isset($data[$localSym]))      continue;

        $data[$localSym] = [
            'symbole'   => $localSym,
            'name'      => $societes[$localSym],
            'price'     => round((float)$cours, 2),
            'variation' => round((float)($mV[1] ?? 0), 4),
            'source'    => 'bvc',
        ];
    }
    return $data;
}

// ─── SOURCE 0c : BVC directe (casablanca-bourse.com) — fallback scraping ──────
function fetchBVC(array $societes): array {
    $urls = [
        'https://www.casablanca-bourse.com/fr/live-market/overview',
        'https://www.casablanca-bourse.com/fr/live-market/instruments',
    ];
    $html = '';
    foreach ($urls as $url) {
        $ch = curl_init();
        curl_setopt_array($ch, [
            CURLOPT_URL            => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_TIMEOUT        => 12,
            CURLOPT_CONNECTTIMEOUT => 5,
            CURLOPT_USERAGENT      => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
            CURLOPT_HTTPHEADER     => [
                'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language: fr-FR,fr;q=0.9',
                'Referer: https://www.casablanca-bourse.com/',
            ],
        ]);
        $res  = curl_exec($ch);
        $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        if ($code === 200 && $res && strlen($res) > 3000) { $html = $res; break; }
    }
    if (!$html) return [];

    $html = preg_replace('/\s+/', ' ', $html);
    $data = [];

    // Chercher données JSON inline (window.__DATA__ ou similar)
    if (preg_match('/window\.__(?:DATA|STATE|NUXT)__\s*=\s*(\{.*?\});/s', $html, $m)) {
        $json = json_decode($m[1], true);
        if ($json) {
            // Parser la structure JSON si disponible
            $instruments = $json['instruments'] ?? $json['data'] ?? $json['market'] ?? [];
            foreach ($instruments as $item) {
                $sym   = strtoupper(trim($item['code'] ?? $item['ticker'] ?? $item['symbol'] ?? ''));
                $price = (float)($item['last'] ?? $item['cours'] ?? $item['price'] ?? 0);
                $var   = (float)($item['variation'] ?? $item['change'] ?? $item['var'] ?? 0);
                if (!$sym || $price <= 0 || !isset($societes[$sym])) continue;
                $data[$sym] = ['symbole'=>$sym,'name'=>$societes[$sym],'price'=>round($price,2),'variation'=>round($var,2),'source'=>'bvc'];
            }
            if (count($data) >= 20) return $data;
        }
    }

    // Fallback : scraping HTML tables
    preg_match_all('/<table[^>]*>(.*?)<\/table>/is', $html, $tables);
    foreach ($tables[1] as $tbl) {
        preg_match_all('/<tr[^>]*>(.*?)<\/tr>/is', $tbl, $rows);
        if (count($rows[1]) < 10) continue;
        foreach ($rows[1] as $row) {
            preg_match_all('/<t[dh][^>]*>(.*?)<\/t[dh]>/is', $row, $cells);
            $c = array_map(fn($x) => trim(strip_tags($x)), $cells[1]);
            if (count($c) < 3) continue;
            // Chercher ticker (3-5 lettres majuscules) dans les premières colonnes
            $sym = null; $price = null; $var = null;
            foreach ($c as $i => $val) {
                if (!$sym && preg_match('/^[A-Z]{2,5}$/', trim($val)) && isset($societes[trim($val)])) {
                    $sym = trim($val);
                    continue;
                }
                $v = str_replace([' ',"\xc2\xa0",','],['',' ','.'], $val);
                if ($price === null && is_numeric($v) && (float)$v > 0) { $price = round((float)$v, 2); continue; }
                if ($price !== null && $var === null) {
                    $vv = str_replace(['%','+',' ',',','−','–'],['','','','','-','-'], $val);
                    if (is_numeric(trim($vv))) $var = round((float)trim($vv), 2);
                }
            }
            if (!$sym || $price === null || $price <= 0) continue;
            if (!isset($data[$sym])) {
                $data[$sym] = ['symbole'=>$sym,'name'=>$societes[$sym],'price'=>$price,'variation'=>$var??0,'source'=>'bvc'];
            }
        }
        if (count($data) >= 30) break;
    }
    return $data;
}

// ─── SOURCE 2 : Boursenews.ma ─────────────────────────────────────────────────
function fetchBoursenews(array $societes): array {
    $urls = [
        'https://www.boursenews.ma/page/bourse',
        'https://www.boursenews.ma/bourse',
    ];
    $html = '';
    foreach ($urls as $url) {
        $ch = curl_init();
        curl_setopt_array($ch, [
            CURLOPT_URL            => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_TIMEOUT        => 12,
            CURLOPT_CONNECTTIMEOUT => 5,
            CURLOPT_USERAGENT      => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            CURLOPT_HTTPHEADER     => ['Accept-Language: fr-FR,fr;q=0.9'],
        ]);
        $res  = curl_exec($ch);
        $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        if ($code === 200 && $res && strlen($res) > 5000) { $html = $res; break; }
    }
    if (!$html) return [];

    $html = preg_replace('/\s+/', ' ', $html);
    $data = [];

    preg_match_all('/<table[^>]*>(.*?)<\/table>/is', $html, $tables);
    foreach ($tables[1] as $tbl) {
        preg_match_all('/<tr[^>]*>(.*?)<\/tr>/is', $tbl, $rows);
        if (count($rows[1]) < 20) continue;
        foreach ($rows[1] as $row) {
            preg_match_all('/<td[^>]*>(.*?)<\/td>/is', $row, $cells);
            $c = array_map(fn($x) => trim(strip_tags($x)), $cells[1]);
            if (count($c) < 4) continue;

            $name = ''; $price = null; $var = null;
            foreach ($c as $i => $val) {
                if ($i === 0 && strlen($val) > 1) $name = $val;
                if ($price === null && is_numeric(str_replace([' ',','],['','.'],$val))
                    && (float)str_replace([' ',','],['','.'],$val) > 0 && $i >= 1) {
                    $price = round((float)str_replace([' ',','],['','.'],$val), 2);
                }
                if ($price !== null && $var === null && $i > 1) {
                    $raw = str_replace([' ',',','%','+'],['','.','',' '], trim($val));
                    if (is_numeric(trim($raw))) $var = round((float)trim($raw), 2);
                }
            }
            if (!$name || $price === null || $price <= 0) continue;
            $sym = findSymbole($name, $societes);
            if (!$sym || isset($data[$sym])) continue;
            $data[$sym] = [
                'symbole'   => $sym,
                'name'      => $societes[$sym],
                'price'     => $price,
                'variation' => $var ?? 0,
                'source'    => 'boursenews',
            ];
        }
        if (count($data) >= 30) break;
    }
    return $data;
}

// ─── SOURCE 3 : Leboursier.ma (NOUVELLE) ─────────────────────────────────────
function fetchLeboursier(array $societes): array {
    $urls = [
        'https://www.leboursier.ma/cours-bourse',
        'https://www.leboursier.ma/bourse',
        'https://www.leboursier.ma/fr/cours/actions',
    ];
    $html = '';
    foreach ($urls as $url) {
        $ch = curl_init();
        curl_setopt_array($ch, [
            CURLOPT_URL            => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_TIMEOUT        => 12,
            CURLOPT_CONNECTTIMEOUT => 5,
            CURLOPT_USERAGENT      => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            CURLOPT_HTTPHEADER     => ['Accept-Language: fr-FR,fr;q=0.9', 'Accept: text/html,application/xhtml+xml'],
        ]);
        $res  = curl_exec($ch);
        $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        if ($code === 200 && $res && strlen($res) > 3000) { $html = $res; break; }
    }
    if (!$html) return [];

    $html = preg_replace('/\s+/', ' ', $html);
    $data = [];

    preg_match_all('/<table[^>]*>(.*?)<\/table>/is', $html, $tables);
    foreach ($tables[1] as $tbl) {
        preg_match_all('/<tr[^>]*>(.*?)<\/tr>/is', $tbl, $rows);
        if (count($rows[1]) < 10) continue;
        foreach ($rows[1] as $row) {
            preg_match_all('/<t[dh][^>]*>(.*?)<\/t[dh]>/is', $row, $cells);
            $c = array_map(fn($x) => trim(strip_tags($x)), $cells[1]);
            if (count($c) < 3) continue;
            $name = $c[0]; $price = null; $var = null;
            foreach ($c as $i => $val) {
                if ($i === 0) continue;
                $v = str_replace([' ', "\xc2\xa0", ','], ['', '', '.'], $val);
                if ($price === null && is_numeric($v) && (float)$v > 0) { $price = round((float)$v, 2); continue; }
                if ($price !== null && $var === null) {
                    $vv = str_replace([' ', '%', '+', "\xc2\xa0", ','], ['', '', '', '', '.'], $val);
                    if (is_numeric(trim($vv))) { $var = round((float)trim($vv), 2); }
                }
            }
            if (!$name || $price === null || $price <= 0) continue;
            $sym = findSymbole($name, $societes);
            if (!$sym || isset($data[$sym])) continue;
            $data[$sym] = ['symbole'=>$sym,'name'=>$societes[$sym],'price'=>$price,'variation'=>$var??0,'source'=>'leboursier'];
        }
        if (count($data) >= 30) break;
    }
    return $data;
}

// ─── SOURCE 4b : Wafabourse.com ───────────────────────────────────────────────
function fetchWafa(array $societes): array {
    $urls = [
        'https://www.wafabourse.com/fr/market-tracking/instruments-financiers',
        'https://www.wafabourse.com/bourse/actions',
    ];
    $html = '';
    foreach ($urls as $url) {
        $ch = curl_init();
        curl_setopt_array($ch, [
            CURLOPT_URL            => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_TIMEOUT        => 10,
            CURLOPT_CONNECTTIMEOUT => 4,
            CURLOPT_USERAGENT      => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            CURLOPT_HTTPHEADER     => ['Accept-Language: fr-FR,fr;q=0.9'],
        ]);
        $res  = curl_exec($ch);
        $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        if ($code === 200 && $res && strlen($res) > 3000) { $html = $res; break; }
    }
    if (!$html) return [];
    $html = preg_replace('/\s+/', ' ', $html);
    $data = [];
    preg_match_all('/<table[^>]*>(.*?)<\/table>/is', $html, $tables);
    foreach ($tables[1] as $tbl) {
        preg_match_all('/<tr[^>]*>(.*?)<\/tr>/is', $tbl, $rows);
        if (count($rows[1]) < 10) continue;
        foreach ($rows[1] as $row) {
            preg_match_all('/<t[dh][^>]*>(.*?)<\/t[dh]>/is', $row, $cells);
            $c = array_map(fn($x) => trim(strip_tags($x)), $cells[1]);
            if (count($c) < 3) continue;
            // Chercher ticker en majuscules ou nom en colonne 0-1
            $sym = null; $price = null; $var = null;
            foreach ($c as $i => $val) {
                if (!$sym && preg_match('/^[A-Z]{2,5}$/', trim($val)) && isset($societes[trim($val)])) { $sym = trim($val); continue; }
                if (!$sym && $i <= 1) { $s = findSymbole($val, $societes); if ($s) { $sym = $s; continue; } }
                $v = str_replace([' ',"\xc2\xa0",'  ',','], ['','','',' '], $val);
                $v = preg_replace('/\s+/', '', $v);
                if ($price === null && is_numeric($v) && (float)$v > 0) { $price = round((float)$v, 2); continue; }
                if ($price !== null && $var === null) {
                    $vv = str_replace(['%','+','−','–',' ',','], ['','','-','-','','.'], $val);
                    if (is_numeric(trim($vv))) $var = round((float)trim($vv), 2);
                }
            }
            if (!$sym || $price === null || $price <= 0) continue;
            if (!isset($data[$sym])) $data[$sym] = ['symbole'=>$sym,'name'=>$societes[$sym],'price'=>$price,'variation'=>$var??0,'source'=>'wafa'];
        }
        if (count($data) >= 30) break;
    }
    return $data;
}

// ─── SOURCE 4c : CDG Capital Bourse ─────────────────────────────────────────
function fetchCDG(array $societes): array {
    $url = 'https://www.cdgcapitalbourse.ma/trader/market/index/XCAS/MNE';
    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL            => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_TIMEOUT        => 10,
        CURLOPT_CONNECTTIMEOUT => 4,
        CURLOPT_USERAGENT      => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        CURLOPT_HTTPHEADER     => ['Accept-Language: fr-FR,fr;q=0.9', 'Accept: application/json, text/html'],
    ]);
    $raw  = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    if ($code !== 200 || !$raw) return [];

    $data = [];
    // Essai JSON direct
    $json = json_decode($raw, true);
    if ($json && isset($json['rows'])) {
        foreach ($json['rows'] as $r) {
            $sym   = strtoupper(trim($r['ticker'] ?? $r['code'] ?? ''));
            $price = (float)($r['last'] ?? $r['price'] ?? 0);
            $var   = (float)($r['variation'] ?? $r['change'] ?? 0);
            if (!$sym || $price <= 0 || !isset($societes[$sym])) continue;
            $data[$sym] = ['symbole'=>$sym,'name'=>$societes[$sym],'price'=>round($price,2),'variation'=>round($var,2),'source'=>'cdg'];
        }
        if (count($data) >= 20) return $data;
    }
    // Scraping HTML
    $html = preg_replace('/\s+/', ' ', $raw);
    preg_match_all('/<table[^>]*>(.*?)<\/table>/is', $html, $tables);
    foreach ($tables[1] as $tbl) {
        preg_match_all('/<tr[^>]*>(.*?)<\/tr>/is', $tbl, $rows);
        if (count($rows[1]) < 10) continue;
        foreach ($rows[1] as $row) {
            preg_match_all('/<t[dh][^>]*>(.*?)<\/t[dh]>/is', $row, $cells);
            $c = array_map(fn($x) => trim(strip_tags($x)), $cells[1]);
            if (count($c) < 3) continue;
            $sym = null; $price = null; $var = null;
            foreach ($c as $i => $val) {
                if (!$sym && preg_match('/^[A-Z]{2,5}$/', trim($val)) && isset($societes[trim($val)])) { $sym = trim($val); continue; }
                if (!$sym && $i <= 1) { $s = findSymbole($val, $societes); if ($s) { $sym = $s; continue; } }
                $v = preg_replace('/[^0-9.]/', '', str_replace(',', '.', $val));
                if ($price === null && is_numeric($v) && (float)$v > 0) { $price = round((float)$v, 2); continue; }
                if ($price !== null && $var === null) {
                    $vv = str_replace(['%','+','−','–',' ',','], ['','','-','-','','.'], $val);
                    if (is_numeric(trim($vv))) $var = round((float)trim($vv), 2);
                }
            }
            if (!$sym || $price === null || $price <= 0) continue;
            if (!isset($data[$sym])) $data[$sym] = ['symbole'=>$sym,'name'=>$societes[$sym],'price'=>$price,'variation'=>$var??0,'source'=>'cdg'];
        }
        if (count($data) >= 30) break;
    }
    return $data;
}

// ─── Détection de péremption des données ─────────────────────────────────────
function detecterPeRemption(string $html): array {
    $today     = date('Y-m-d');
    $dataDate  = null;
    $stale     = false;
    $reason    = '';

    if (preg_match_all('/\b(\d{2})\/(\d{2})\/(\d{4})\b/', $html, $m)) {
        foreach ($m[3] as $i => $year) {
            if ($year >= 2024 && $year <= 2030) {
                $candidate = $m[3][$i] . '-' . $m[2][$i] . '-' . $m[1][$i];
                if ($candidate <= $today) { $dataDate = $candidate; break; }
            }
        }
    }
    if (!$dataDate && preg_match('/\b(202[4-9]|2030)-(\d{2})-(\d{2})\b/', $html, $m)) {
        $candidate = $m[1] . '-' . $m[2] . '-' . $m[3];
        if ($candidate <= $today) $dataDate = $candidate;
    }

    if ($dataDate && $dataDate < $today) {
        $stale  = true;
        $reason = "Données BMCE du {$dataDate} (hier ou plus ancien)";
    }

    return ['stale' => $stale, 'data_date' => $dataDate ?? $today, 'reason' => $reason];
}

// ─── SOURCE 4 : BMCE Capital Bourse (fallback) ───────────────────────────────
$BMCE_STALE_INFO = ['stale' => false, 'data_date' => date('Y-m-d'), 'reason' => ''];

function fetchBMCE(array $societes): array {
    global $BMCE_STALE_INFO;
    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL            => 'https://www.bmcecapitalbourse.com/bkbbourse/lists/TK?q=AE31180F8E3BE20E762758E81EDC1204',
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_USERAGENT      => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        CURLOPT_TIMEOUT        => 15,
        CURLOPT_HEADER         => true,
    ]);
    $raw  = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $hSz  = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
    curl_close($ch);
    $html = ($raw !== false && $hSz > 0) ? substr($raw, $hSz) : (string)$raw;
    if ($code !== 200 || !$html) return [];

    $BMCE_STALE_INFO = detecterPeRemption($html);

    $html = preg_replace('/\s+/', ' ', $html);
    preg_match_all('/<table[^>]*>(.*?)<\/table>/is', $html, $tables);

    $rawData = [];
    foreach ($tables[1] as $tbl) {
        preg_match_all('/<tr[^>]*>(.*?)<\/tr>/is', $tbl, $rows);
        if (count($rows[1]) < 30) continue;
        foreach ($rows[1] as $row) {
            preg_match_all('/<td[^>]*>(.*?)<\/td>/is', $row, $cells);
            $c = $cells[1];
            if (count($c) < 5) continue;
            $name = trim(strip_tags($c[0]));
            if (!$name || in_array($name, ['Valeur','Hausses','Baisses'])) continue;
            $prix = preg_replace('/[^0-9.]/', '', str_replace([' ',','],['','.'], trim(strip_tags($c[3]))));
            $var  = str_replace([',',' ','%'],['.','',' '], trim(strip_tags($c[4])));
            if (!is_numeric($prix) || (float)$prix <= 0) continue;
            $rawData[$name] = [
                'price'     => round((float)$prix, 2),
                'variation' => is_numeric($var) ? round((float)$var, 2) : 0,
            ];
        }
        break;
    }

    $data = [];
    foreach ($rawData as $name => $item) {
        $sym = findSymbole($name, $societes);
        if (!$sym || isset($data[$sym])) continue;
        $data[$sym] = [
            'symbole'   => $sym,
            'name'      => $societes[$sym],
            'price'     => $item['price'],
            'variation' => $item['variation'],
            'source'    => 'bmce',
        ];
    }
    return $data;
}

// ─── Vérification du cache ────────────────────────────────────────────────────
$cached = readCache();
if ($cached !== null && isset($cached['_cached_at'])) {
    $age = time() - $cached['_cached_at'];
    $ttl = getCacheTTL();
    if ($age < $ttl) {
        // Cache valide — retourner immédiatement
        unset($cached['_cached_at']);
        $cached['from_cache']   = true;
        $cached['cache_age_s']  = $age;
        echo json_encode($cached, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
        exit;
    }
}

// ─── SOURCE 0 ABSOLUE : API officielle BVC (marche-actions-groupement) ──────
// Si elle retourne 40+ cours, on l'utilise directement sans consensus
$bvcTickerAPI = fetchBVCTickerAPI($SOCIETES);
if (count($bvcTickerAPI) >= 40) {
    // Construire la réponse directement depuis l'API BVC officielle
    $final = array_values($bvcTickerAPI);
    $BMCE_STALE_INFO = ['stale' => false, 'reason' => '', 'data_date' => date('Y-m-d')];

    // Stocker les variables vides pour le payload
    $tv = $csbourse = $bvc = $yahoo = $wafa = $cdg = $boursenews = $leboursier = $bmce = [];

    $payload = [
        'success'      => true,
        'timestamp'    => time(),
        'date'         => date('Y-m-d H:i:s'),
        'count'        => count($final),
        'stale'        => false,
        'data_date'    => date('Y-m-d'),
        'stale_reason' => '',
        'from_cache'   => false,
        'sources'      => ['bvc' => count($final)],
        'data'         => $final,
    ];
    if (count($final) > 0) writeCache($payload);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

// ─── Appels sources fallback (si API BVC indisponible) ───────────────────────
$tv         = fetchTradingView($SOCIETES);   // TradingView Scanner (JSON, temps réel)
$csbourse   = fetchCasablancaBourse($SOCIETES); // casablancabourse.com
$bvc        = fetchBVC($SOCIETES);           // BVC officielle (scraping)
$yahoo      = fetchYahoo($SOCIETES);         // Yahoo Finance
$wafa       = fetchWafa($SOCIETES);          // Wafabourse
$cdg        = fetchCDG($SOCIETES);           // CDG Capital Bourse
// Sources secondaires (si moins de 40 cours via sources temps réel)
$nbTR = count($tv) + count($yahoo);
$boursenews = ($nbTR < 40) ? fetchBoursenews($SOCIETES) : [];
$leboursier = ($nbTR < 40) ? fetchLeboursier($SOCIETES) : [];
$bmce       = fetchBMCE($SOCIETES);          // BMCE (décalage — dernier recours)

// ─── Consolidation multi-sources avec consensus ───────────────────────────────
$allSources = [
    'tradingview'    => $tv,
    'casablancabourse'=> $csbourse,
    'bvc'            => $bvc,
    'yahoo'          => $yahoo,
    'wafa'           => $wafa,
    'cdg'            => $cdg,
    'boursenews'     => $boursenews,
    'leboursier'     => $leboursier,
    'bmce'           => $bmce,
];

$result      = [];
$allSymboles = array_unique(array_merge(...array_values(array_map('array_keys', $allSources))));

foreach ($allSymboles as $sym) {
    $candidates = [];
    foreach ($allSources as $srcName => $srcData) {
        if (isset($srcData[$sym])) $candidates[$srcName] = $srcData[$sym];
    }
    if (empty($candidates)) continue;

    // Prix de référence : TradingView > casablancabourse > BVC > Yahoo > Wafa > CDG > BN > BMCE
    $item = $candidates['tradingview']
         ?? $candidates['casablancabourse']
         ?? $candidates['bvc']
         ?? $candidates['yahoo']
         ?? $candidates['wafa']
         ?? $candidates['cdg']
         ?? $candidates['boursenews']
         ?? $candidates['leboursier']
         ?? $candidates['bmce'];

    // Consensus prix : si 2+ sources concordent (écart < 2%), utiliser leur moyenne
    $prices = array_filter(
        array_map(fn($c) => $c['price'], $candidates),
        fn($p) => $p > 0
    );
    if (count($prices) >= 2) {
        $priceArr = array_values($prices);
        sort($priceArr);
        $median       = $priceArr[intval(count($priceArr) / 2)];
        $concordantes = array_filter($priceArr, fn($p) => abs($p - $median) / $median < 0.02);
        if (count($concordantes) >= 2) {
            $item['price']         = round(array_sum($concordantes) / count($concordantes), 2);
            $item['price_sources'] = count($concordantes);
        }
    }

    // ── Variation : consensus multi-sources ──────────────────────────────────
    // BMCE est souvent en décalage → on l'exclut du consensus principal
    $varParSource = [];
    foreach ($candidates as $srcName => $c) {
        if (isset($c['variation']) && $c['variation'] !== null) {
            $varParSource[$srcName] = (float)$c['variation'];
        }
    }
    // Sources "temps réel" (fiables, sans BMCE qui est souvent en décalage)
    $srcTempsReel = ['tradingview', 'casablancabourse', 'bvc', 'yahoo', 'wafa', 'cdg'];
    $varsTR = array_filter($varParSource, fn($v, $k) => in_array($k, $srcTempsReel), ARRAY_FILTER_USE_BOTH);

    if (count($varsTR) >= 2) {
        // Consensus entre sources temps réel : médiane (élimine les outliers)
        $arr = array_values($varsTR);
        sort($arr);
        $medTR = $arr[intval(count($arr) / 2)];

        // Vérifier si une source temps réel dévie fortement (>4%) de la médiane
        $concordTR = array_filter($arr, fn($v) => abs($v - $medTR) <= 4.0);
        $varFinal  = count($concordTR) > 0
            ? round(array_sum($concordTR) / count($concordTR), 2)
            : round($medTR, 2);

        // Déterminer quelle source a fourni la valeur
        $srcUsed = 'consensus_tr';
        foreach ($srcTempsReel as $s) {
            if (isset($varParSource[$s]) && abs($varParSource[$s] - $varFinal) < 0.5) {
                $srcUsed = $s; break;
            }
        }
        $item['variation']  = $varFinal;
        $item['var_source'] = $srcUsed;
        $item['var_sources_count'] = count($varsTR);

    } elseif (count($varsTR) === 1) {
        // Une seule source TR disponible
        reset($varsTR);
        $item['variation']  = round(current($varsTR), 2);
        $item['var_source'] = key($varsTR);

    } elseif (!empty($varParSource)) {
        // Aucune source TR — utiliser médiane de tout ce qu'on a (BMCE inclus en dernier recours)
        $all = array_values($varParSource);
        sort($all);
        $item['variation']  = round($all[intval(count($all) / 2)], 2);
        $item['var_source'] = 'consensus_fallback';

    }
    // Marquer BMCE si c'est la seule source (données potentiellement en décalage)
    if (count($varParSource) === 1 && isset($varParSource['bmce'])) {
        $item['var_source'] = 'bmce_seul';
        $item['var_stale']  = true;
    }

    // Plafonner variation à ±15% (limite réaliste BVC)
    if (isset($item['variation'])) {
        $item['variation'] = max(-15.0, min(15.0, (float)$item['variation']));
    }

    $item['sources_count'] = count($candidates);
    $result[$sym] = $item;
}

// ─── Tri alphabétique par nom ─────────────────────────────────────────────────
uasort($result, fn($a, $b) => strcmp($a['name'], $b['name']));
$final = array_values($result);

// ─── Heuristique : si >70% des variations sont 0 pendant les heures de marché
$nbZero    = count(array_filter($final, fn($x) => ($x['variation'] ?? 0) == 0));
$pctZero   = count($final) > 0 ? $nbZero / count($final) : 0;
$marchéOuvert = isSeanceBVC();
if ($marchéOuvert && $pctZero > 0.70 && !$BMCE_STALE_INFO['stale']) {
    $BMCE_STALE_INFO['stale']  = true;
    $BMCE_STALE_INFO['reason'] = "Plus de 70% des variations sont à 0% pendant les heures de marché — données probablement périmées";
}

// ─── Construction de la réponse ───────────────────────────────────────────────
$payload = [
    'success'      => true,
    'timestamp'    => time(),
    'date'         => date('Y-m-d H:i:s'),
    'count'        => count($final),
    'stale'        => $BMCE_STALE_INFO['stale'],
    'data_date'    => $BMCE_STALE_INFO['data_date'],
    'stale_reason' => $BMCE_STALE_INFO['reason'],
    'from_cache'   => false,
    'sources'      => [
        'tradingview'     => count($tv),
        'casablancabourse'=> count($csbourse),
        'bvc'             => count($bvc),
        'yahoo'           => count($yahoo),
        'wafa'            => count($wafa),
        'cdg'             => count($cdg),
        'boursenews'      => count($boursenews),
        'leboursier'      => count($leboursier),
        'bmce'            => count($bmce),
    ],
    'data' => $final,
];

// Écrire dans le cache avant de retourner
// Si toutes les sources ont échoué (count=0) mais qu'un cache périmé existe, retourner le cache
if (count($final) === 0 && $cached !== null) {
    $age = isset($cached['_cached_at']) ? time() - $cached['_cached_at'] : 0;
    unset($cached['_cached_at']);
    $cached['from_cache']  = true;
    $cached['cache_age_s'] = $age;
    $cached['stale_reason'] = ($cached['stale_reason'] ?? '') . ' [cache périmé utilisé — aucune source ne répond]';
    echo json_encode($cached, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

// Cache valide à écrire uniquement si on a des données
if (count($final) > 0) {
    writeCache($payload);
}

echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
?>
