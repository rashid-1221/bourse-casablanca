<?php
// api/casablanca-sante-proxy.php — Santé financière depuis l'API Drupal de casablanca-bourse.com
// L'API JSON est à : https://api.casablanca-bourse.com/
// Usage : casablanca-sante-proxy.php?symbole=AFMA
// Debug  : casablanca-sante-proxy.php?symbole=AFMA&debug=1

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

$symbole = isset($_GET['symbole']) ? strtoupper(trim($_GET['symbole'])) : '';
$debug   = !empty($_GET['debug']);

if (empty($symbole)) {
    echo json_encode(['success'=>false,'error'=>'Paramètre symbole manquant']); exit;
}

// ── Cache ──────────────────────────────────────────────────────────────────────
$cacheDir  = sys_get_temp_dir() . '/bvc_casa_v2';
if (!is_dir($cacheDir)) @mkdir($cacheDir, 0755, true);
$cacheFile = $cacheDir . '/casa_' . preg_replace('/[^A-Z0-9]/', '', $symbole) . '.json';
$noCache   = !empty($_GET['nocache']) || !empty($_GET['refresh']);
if ($noCache && file_exists($cacheFile)) @unlink($cacheFile);

$heure    = (int)date('H');
$jour     = (int)date('N');
$enSeance = ($jour >= 1 && $jour <= 5 && $heure >= 9 && $heure < 16);
$cacheTTL = $enSeance ? 600 : 3600;

if (!$noCache && file_exists($cacheFile) && (time() - filemtime($cacheFile)) < $cacheTTL) {
    $d = json_decode(file_get_contents($cacheFile), true);
    if ($d && ($d['success'] ?? false)) { $d['from_cache'] = true; echo json_encode($d, JSON_UNESCAPED_UNICODE); exit; }
}

// ── Fetch générique ────────────────────────────────────────────────────────────
function bvcFetch(string $url, bool $json = false): array {
    $ch = curl_init();
    $headers = [
        'Accept: ' . ($json ? 'application/vnd.api+json, application/json' : 'text/html,application/xhtml+xml,*/*'),
        'Accept-Language: fr-FR,fr;q=0.9,en;q=0.8',
        'Connection: keep-alive',
    ];
    if ($json) $headers[] = 'X-Requested-With: XMLHttpRequest';
    curl_setopt_array($ch, [
        CURLOPT_URL            => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_SSL_VERIFYHOST => false,
        CURLOPT_TIMEOUT        => 20,
        CURLOPT_CONNECTTIMEOUT => 10,
        CURLOPT_ENCODING       => '',
        CURLOPT_USERAGENT      => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        CURLOPT_HTTPHEADER     => $headers,
        CURLOPT_REFERER        => 'https://www.casablanca-bourse.com/',
    ]);
    $body     = curl_exec($ch);
    $code     = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $final    = curl_getinfo($ch, CURLINFO_EFFECTIVE_URL);
    $err      = curl_error($ch);
    curl_close($ch);
    return ['body' => ($body ?: ''), 'code' => $code, 'final' => $final, 'err' => $err];
}

function cleanNum($s): ?float {
    if (is_float($s) || is_int($s)) return (float)$s;
    $s = str_replace([' ', "\xc2\xa0", '&nbsp;', "\u{00A0}", "\u{202F}", ' '], '', (string)$s);
    $s = str_replace(',', '.', $s);
    $s = preg_replace('/[^0-9.\-]/', '', trim($s));
    return is_numeric($s) ? (float)$s : null;
}
function cellText(string $html): string {
    return trim(preg_replace('/\s+/', ' ', html_entity_decode(strip_tags($html), ENT_QUOTES|ENT_HTML5, 'UTF-8')));
}

// ── Noms de sociétés BVC (pour recherche par titre sur l'API Drupal) ───────────
// Le ticker ne correspond pas forcément au titre Drupal — on cherche aussi par nom
$COMPANY_NAMES_LOCAL = [
    'AFMA'=>'AFMA','ADH'=>'Addoha','ADI'=>'Alliances','AKT'=>'Akdital',
    'ATH'=>'Auto Hall','ATW'=>'Attijariwafa','BCP'=>'Banque Centrale Populaire',
    'BOA'=>'Bank of Africa','CDM'=>'Crédit du Maroc','CIH'=>'CIH Bank',
    'CMR'=>'Crédit Immobilier','COL'=>'Colorado','CSR'=>'Cosumar',
    'CTM'=>'CTM','DHO'=>'Delta Holding','DWY'=>'Disway',
    'ENK'=>'Ennakl','GAZ'=>'Afriquia Gaz','HPS'=>'HPS',
    'IAM'=>'Maroc Telecom','IBC'=>'Immorente','LBV'=>'Label Vie',
    'LES'=>'Lesieur','LHM'=>'LafargeHolcim','LYD'=>'Lydec',
    'MNG'=>'Managem','MNP'=>'Mutandis','MSA'=>'Marsa Maroc',
    'MSIN'=>'M2M Group','OCP'=>'OCP','OUA'=>'Oulmès','PRO'=>'Promopharm',
    'RDS'=>'Résidences Dar Saada','RIS'=>'Risma','SAH'=>'Sahara',
    'SID'=>'Sonasid','SNA'=>'SNA','SOT'=>'Sothema',
    'TAQA'=>'TAQA Morocco','TIM'=>'Timar','TQM'=>'Total Maroc',
    'WAA'=>'Wafa Assurance',
];

// ── Stratégie 1 : API JSON Drupal (emetteurs list) ─────────────────────────────
// L'API Drupal JSON:API peut lister les emetteurs avec leurs données
$metrics   = [];
$sourceUrl = '';
$method    = '';

// Essayer les endpoints JSON de l'API Drupal
$apiEndpoints = [
    // JSONAPI Drupal — liste des emetteurs avec filtre par titre/ticker
    "https://api.casablanca-bourse.com/fr/api/node/emetteur?filter[title]={$symbole}&include=emetteur_list",
    "https://api.casablanca-bourse.com/api/node/emetteur?filter[title]={$symbole}",
    // Endpoint pour les cours en direct (possiblement une route custom)
    "https://api.casablanca-bourse.com/fr/api/cours/{$symbole}",
    "https://api.casablanca-bourse.com/fr/api/emetteur/{$symbole}",
    "https://api.casablanca-bourse.com/fr/live-market/cours/{$symbole}",
];

foreach ($apiEndpoints as $apiUrl) {
    $r = bvcFetch($apiUrl, true);
    if ($r['code'] === 200 && !empty($r['body'])) {
        $jdata = json_decode($r['body'], true);
        if ($jdata) {
            $method    = 'api_json';
            $sourceUrl = $r['final'];
            // Parser la réponse JSON (structure Drupal JSON:API)
            $metrics = parseJsonApiData($jdata, $symbole);
            if (!empty($metrics)) break;
        }
    }
}

// ── Stratégie 2 : Page HTML directe (plusieurs patterns d'URL) ────────────────
if (empty($metrics)) {
    $htmlUrls = [
        "https://www.casablanca-bourse.com/fr/live-market/emetteurs/{$symbole}",
        "https://www.casablanca-bourse.com/fr/emetteurs/{$symbole}",
        "https://www.casablanca-bourse.com/fr/live-market/cours/{$symbole}",
    ];
    foreach ($htmlUrls as $htmlUrl) {
        $r = bvcFetch($htmlUrl);
        if ($r['code'] === 200 && strlen($r['body']) > 3000) {
            $method    = 'html_scrape';
            $sourceUrl = $r['final'];
            $metrics   = parseHtmlMetrics($r['body']);
            if (!empty($metrics)) break;
        }
    }
}

// ── Stratégie 3 : Page liste + extraction du lien de la société ───────────────
if (empty($metrics)) {
    $listR = bvcFetch("https://www.casablanca-bourse.com/fr/live-market/emetteurs");
    if ($listR['code'] === 200 && strlen($listR['body']) > 3000) {
        // Chercher dans la liste le lien vers ce ticker
        preg_match_all('/<a[^>]+href="([^"]+)"[^>]*>(.*?)<\/a>/is', $listR['body'], $lM);
        $targetUrl = '';
        for ($i = 0; $i < count($lM[1]); $i++) {
            $txt = strtoupper(strip_tags($lM[2][$i]));
            $href = $lM[1][$i];
            if (strpos($txt, $symbole) !== false || strpos($href, $symbole) !== false
                || strpos($href, strtolower($symbole)) !== false) {
                $targetUrl = preg_match('/^https?:/', $href) ? $href : 'https://www.casablanca-bourse.com' . $href;
                break;
            }
        }
        // Aussi chercher par nom de société
        if (empty($targetUrl) && isset($COMPANY_NAMES_LOCAL[$symbole])) {
            $nomSearch = strtoupper($COMPANY_NAMES_LOCAL[$symbole]);
            for ($i = 0; $i < count($lM[1]); $i++) {
                $txt = strtoupper(strip_tags($lM[2][$i]));
                if (strpos($txt, substr($nomSearch, 0, 6)) !== false) {
                    $href = $lM[1][$i];
                    $targetUrl = preg_match('/^https?:/', $href) ? $href : 'https://www.casablanca-bourse.com' . $href;
                    break;
                }
            }
        }
        if (!empty($targetUrl)) {
            $detR = bvcFetch($targetUrl);
            if ($detR['code'] === 200 && strlen($detR['body']) > 3000) {
                $method    = 'list_then_detail';
                $sourceUrl = $detR['final'];
                $metrics   = parseHtmlMetrics($detR['body']);
            }
        }
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Parser la réponse JSON:API Drupal
// ─────────────────────────────────────────────────────────────────────────────
function parseJsonApiData(array $data, string $symbole): array {
    $metrics = [];
    // Structure JSON:API : { data: [{attributes: {...}}] }
    $items = $data['data'] ?? [];
    if (isset($data['attributes'])) $items = [$data]; // réponse item unique
    if (empty($items)) return [];

    foreach ($items as $item) {
        $attrs = $item['attributes'] ?? [];
        // Chercher des champs de type cours/variation
        foreach ($attrs as $k => $v) {
            $ku = strtolower($k);
            if (!is_numeric($v)) continue;
            $fv = (float)$v;
            if (preg_match('/cours|last|price|cloture/', $ku) && empty($metrics['cours']) && $fv > 1)
                $metrics['cours'] = $fv;
            elseif (preg_match('/variation|change|var/', $ku) && empty($metrics['variation']))
                $metrics['variation'] = $fv;
            elseif (preg_match('/capi/', $ku) && empty($metrics['capitalisation']))
                $metrics['capitalisation'] = $fv;
            elseif (preg_match('/per|p_e|ratio/', $ku) && empty($metrics['per']))
                $metrics['per'] = $fv;
            elseif (preg_match('/rendement|yield|divid/', $ku) && empty($metrics['rendement_dividende']))
                $metrics['rendement_dividende'] = $fv;
            elseif (preg_match('/flottant/', $ku) && empty($metrics['flottant']))
                $metrics['flottant'] = $fv;
            elseif (preg_match('/haut.*52|52.*haut/', $ku) && empty($metrics['plus_haut_52s']))
                $metrics['plus_haut_52s'] = $fv;
            elseif (preg_match('/bas.*52|52.*bas/', $ku) && empty($metrics['plus_bas_52s']))
                $metrics['plus_bas_52s'] = $fv;
            elseif (preg_match('/volume/', $ku) && empty($metrics['volume']))
                $metrics['volume'] = $fv;
            elseif (preg_match('/nb.*titre|nombre.*titre/', $ku) && empty($metrics['nb_titres']))
                $metrics['nb_titres'] = $fv;
        }
        if (!empty($metrics)) break;
    }
    return $metrics;
}

// ─────────────────────────────────────────────────────────────────────────────
// Parser le HTML d'une page casablanca-bourse.com
// ─────────────────────────────────────────────────────────────────────────────
function parseHtmlMetrics(string $html): array {
    $metrics = [];
    $html = preg_replace('/[\r\n\t]+/', ' ', $html);
    $html = preg_replace('/  +/', ' ', $html);

    // Tables label/valeur
    preg_match_all('/<tr[^>]*>(.*?)<\/tr>/is', $html, $rowM);
    foreach ($rowM[1] as $row) {
        preg_match_all('/<t[dh][^>]*>(.*?)<\/t[dh]>/is', $row, $cm);
        $cells = array_map('cellText', $cm[1]);
        if (count($cells) < 2) continue;
        $lbl = strtoupper($cells[0]);
        $val = $cells[1];
        if      (preg_match('/COURS|DERNIER|LAST/u', $lbl) && !preg_match('/CLÔT|PREV|OUVER/u', $lbl)) { $v = cleanNum($val); if ($v && $v > 0 && empty($metrics['cours'])) $metrics['cours'] = $v; }
        elseif  (preg_match('/VARIATION/u', $lbl))    { $v = cleanNum(str_replace(['%','+'],'',$val)); if ($v !== null && empty($metrics['variation'])) $metrics['variation'] = $v; }
        elseif  (preg_match('/CAPITALISA/u', $lbl))   { $v = cleanNum($val); if ($v && empty($metrics['capitalisation'])) $metrics['capitalisation'] = $v; }
        elseif  (preg_match('/^P\.?E\.?R|^P\/E/u', $lbl)) { $v = cleanNum($val); if ($v && empty($metrics['per'])) $metrics['per'] = $v; }
        elseif  (preg_match('/RENDEMENT|DIVID.*%/u', $lbl)) { $v = cleanNum(str_replace(['%','+'],'',$val)); if ($v !== null && empty($metrics['rendement_dividende'])) $metrics['rendement_dividende'] = $v; }
        elseif  (preg_match('/FLOTTANT/u', $lbl))    { $v = cleanNum(str_replace(['%','+'],'',$val)); if ($v !== null && empty($metrics['flottant'])) $metrics['flottant'] = $v; }
        elseif  (preg_match('/NOMBRE.*TITRES?|NB.*TITRES?/u', $lbl)) { $v = cleanNum(str_replace(' ','',$val)); if ($v && empty($metrics['nb_titres'])) $metrics['nb_titres'] = $v; }
        elseif  (preg_match('/HAUT.*52|52.*HAUT/u', $lbl)) { $v = cleanNum($val); if ($v && empty($metrics['plus_haut_52s'])) $metrics['plus_haut_52s'] = $v; }
        elseif  (preg_match('/BAS.*52|52.*BAS/u', $lbl))   { $v = cleanNum($val); if ($v && empty($metrics['plus_bas_52s'])) $metrics['plus_bas_52s'] = $v; }
        elseif  (preg_match('/VOLUME|ÉCHANGES/u', $lbl))   { $v = cleanNum(str_replace(' ','',$val)); if ($v && empty($metrics['volume'])) $metrics['volume'] = $v; }
        elseif  (preg_match('/SECTEUR/u', $lbl) && empty($metrics['secteur'])) $metrics['secteur'] = $val;
    }

    // Data attributes
    if (preg_match_all('/data-(cours|last|variation|capitalisation|per|rendement|flottant)\s*=\s*"([^"]+)"/i', $html, $dM)) {
        for ($i = 0; $i < count($dM[1]); $i++) {
            $k = strtolower($dM[1][$i]);
            $v = cleanNum(str_replace(['%','+'], '', $dM[2][$i]));
            if ($v === null) continue;
            if (in_array($k, ['cours','last']) && empty($metrics['cours'])) $metrics['cours'] = $v;
            elseif ($k === 'variation' && empty($metrics['variation'])) $metrics['variation'] = $v;
            elseif ($k === 'capitalisation' && empty($metrics['capitalisation'])) $metrics['capitalisation'] = $v;
            elseif ($k === 'per' && empty($metrics['per'])) $metrics['per'] = $v;
            elseif ($k === 'rendement' && empty($metrics['rendement_dividende'])) $metrics['rendement_dividende'] = $v;
            elseif ($k === 'flottant' && empty($metrics['flottant'])) $metrics['flottant'] = $v;
        }
    }

    // JSON embarqué dans __NEXT_DATA__ ou window.__INITIAL_STATE__
    if (preg_match('/<script[^>]+id="__NEXT_DATA__"[^>]*>(.*?)<\/script>/is', $html, $ndM)) {
        $nd = json_decode($ndM[1], true);
        if ($nd) extractFromNextData($nd, $metrics);
    }
    if (preg_match('/window\.__INITIAL_STATE__\s*=\s*(\{.*?\});\s*<\/script>/is', $html, $isM)) {
        $is = json_decode($isM[1], true);
        if ($is) extractFromNextData($is, $metrics);
    }
    // __NEXT_DATA__ peut aussi être dans props.pageProps
    if (preg_match('/window\.__NEXT_DATA__\s*=\s*(\{.*?\})\s*<\/script>/is', $html, $ndM2)) {
        $nd2 = json_decode($ndM2[1], true);
        if ($nd2) extractFromNextData($nd2, $metrics);
    }

    return $metrics;
}

function extractFromNextData(array $data, array &$metrics): void {
    // Parcourir récursivement pour trouver des champs financiers
    array_walk_recursive($data, function($v, $k) use (&$metrics) {
        if (!is_numeric($v)) return;
        $fv = (float)$v;
        $kl = strtolower((string)$k);
        if (preg_match('/cours|last|close|price/', $kl) && empty($metrics['cours']) && $fv > 1) $metrics['cours'] = $fv;
        elseif (preg_match('/variation|change/', $kl) && empty($metrics['variation'])) $metrics['variation'] = $fv;
        elseif (preg_match('/capi/', $kl) && empty($metrics['capitalisation'])) $metrics['capitalisation'] = $fv;
        elseif (preg_match('/per|p_e|^pe$/', $kl) && empty($metrics['per']) && $fv < 1000) $metrics['per'] = $fv;
        elseif (preg_match('/rendement|yield/', $kl) && empty($metrics['rendement_dividende'])) $metrics['rendement_dividende'] = $fv;
        elseif (preg_match('/flottant/', $kl) && empty($metrics['flottant'])) $metrics['flottant'] = $fv;
        elseif (preg_match('/haut.*52|52.*haut|year.*high|high.*year/', $kl) && empty($metrics['plus_haut_52s'])) $metrics['plus_haut_52s'] = $fv;
        elseif (preg_match('/bas.*52|52.*bas|year.*low|low.*year/', $kl) && empty($metrics['plus_bas_52s'])) $metrics['plus_bas_52s'] = $fv;
    });
}

// ── Réponse finale ─────────────────────────────────────────────────────────────
$success = !empty($metrics) && count($metrics) >= 1;

$response = [
    'success'    => $success,
    'symbole'    => $symbole,
    'source_url' => $sourceUrl ?: 'https://www.casablanca-bourse.com/fr/live-market/emetteurs',
    'method'     => $method,
    'metrics'    => $metrics,
    'timestamp'  => time(),
];

if (!$success && empty($metrics)) {
    $response['error'] = 'Le site casablanca-bourse.com est actuellement en maintenance ou inaccessible. Les données seront disponibles à son retour.';
    $response['maintenance'] = true;
}

if ($debug) {
    $response['debug_endpoints_tried'] = $apiEndpoints ?? [];
}

// Sauvegarder en cache si données trouvées
if ($success) {
    file_put_contents($cacheFile, json_encode($response, JSON_UNESCAPED_UNICODE));
}

echo json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
