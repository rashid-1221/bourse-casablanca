<?php
// api/casablanca-debug.php — Inspecte la structure HTML de casablanca-bourse.com
// Usage : casablanca-debug.php?symbole=AFMA  (ou tout autre ticker BVC)

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

$symbole = isset($_GET['symbole']) ? strtoupper(trim($_GET['symbole'])) : 'AFMA';

function fetchPage($url) {
    $ch = curl_init();
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
        CURLOPT_HTTPHEADER     => [
            'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language: fr-FR,fr;q=0.9,en;q=0.8',
            'Cache-Control: no-cache',
            'Connection: keep-alive',
            'Referer: https://www.casablanca-bourse.com/',
        ],
    ]);
    $html     = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $finalUrl = curl_getinfo($ch, CURLINFO_EFFECTIVE_URL);
    $err      = curl_error($ch);
    curl_close($ch);
    return ['html' => ($html ?: ''), 'code' => $httpCode, 'final' => $finalUrl, 'err' => $err];
}

// ─── URLs à tester ───────────────────────────────────────────────────────────
$urlsToTest = [
    "https://www.casablanca-bourse.com/fr/live-market/emetteurs/{$symbole}",
    "https://www.casablanca-bourse.com/fr/live-market/emetteurs?ticker={$symbole}",
    "https://www.casablanca-bourse.com/fr/live-market/emetteurs?symbole={$symbole}",
    "https://www.casablanca-bourse.com/fr/live-market/emetteurs?code={$symbole}",
    "https://www.casablanca-bourse.com/bourseweb/Societe.aspx?codeValeur={$symbole}",
    "https://www.casablanca-bourse.com/bourseweb/cours.aspx?IdInstrument={$symbole}",
];

$results = [];

foreach ($urlsToTest as $url) {
    $r = fetchPage($url);
    $snippet = '';
    $links   = [];
    $tables  = [];
    $classes = [];

    if ($r['code'] === 200 && !empty($r['html'])) {
        $html = $r['html'];

        // Extrait un snippet du contenu texte (2000 chars)
        $snippet = substr(strip_tags($html), 0, 2000);
        $snippet = preg_replace('/\s+/', ' ', $snippet);

        // Cherche tous les <a href=...> contenant le ticker
        preg_match_all('/<a[^>]+href="([^"]*' . preg_quote($symbole, '/') . '[^"]*)"[^>]*>(.*?)<\/a>/is', $html, $linkM);
        for ($i = 0; $i < min(10, count($linkM[1])); $i++) {
            $links[] = ['href' => $linkM[1][$i], 'text' => trim(strip_tags($linkM[2][$i]))];
        }

        // Cherche toutes les tables et leurs headers
        preg_match_all('/<table[^>]*class="([^"]*)"[^>]*>(.*?)<\/table>/is', $html, $tabM);
        foreach ($tabM[2] as $k => $tContent) {
            preg_match_all('/<t[hd][^>]*>(.*?)<\/t[hd]>/is', $tContent, $cellM);
            $cells = array_slice(array_map(function($c){ return trim(strip_tags($c)); }, $cellM[1]), 0, 10);
            $cells = array_filter($cells);
            if (!empty($cells)) {
                $tables[] = ['class' => $tabM[1][$k], 'first_cells' => array_values($cells)];
            }
        }

        // Classes CSS uniques présentes (utiles pour scraping)
        preg_match_all('/class="([^"]+)"/', $html, $classM);
        $classFlat = [];
        foreach ($classM[1] as $cls) {
            foreach (explode(' ', $cls) as $c) {
                $c = trim($c);
                if ($c && strlen($c) > 2 && strlen($c) < 40) $classFlat[$c] = ($classFlat[$c] ?? 0) + 1;
            }
        }
        arsort($classFlat);
        $classes = array_slice($classFlat, 0, 30, true);

        // Cherche tous les liens <a href="...emetteur..." ou "...valeur..." ou "...societe..."
        preg_match_all('/<a[^>]+href="([^"]*(?:emetteur|valeur|societe|ticker|instrument|cours)[^"]*)"[^>]*>/is', $html, $emLinkM);
        $emLinks = array_slice(array_unique($emLinkM[1]), 0, 10);
    }

    $results[] = [
        'url'          => $url,
        'final_url'    => $r['final'],
        'http_code'    => $r['code'],
        'curl_error'   => $r['err'],
        'html_length'  => strlen($r['html']),
        'text_snippet' => $snippet,
        'ticker_links' => $links,
        'emetteur_links'=> $emLinks ?? [],
        'tables'       => $tables,
        'top_classes'  => $classes,
    ];

    // Si on trouve une page valide (200 + contenu), on peut s'arrêter
    if ($r['code'] === 200 && strlen($r['html']) > 5000) break;
}

// Aussi tester la page liste emetteurs pour trouver les vrais URLs
$listUrl = "https://www.casablanca-bourse.com/fr/live-market/emetteurs";
$listR   = fetchPage($listUrl);
$listLinks = [];
if ($listR['code'] === 200 && !empty($listR['html'])) {
    preg_match_all('/<a[^>]+href="([^"]*emetteur[^"]*)"[^>]*>(.*?)<\/a>/is', $listR['html'], $lM);
    for ($i = 0; $i < min(15, count($lM[1])); $i++) {
        $listLinks[] = ['href' => $lM[1][$i], 'text' => trim(strip_tags($lM[2][$i]))];
    }
    // Aussi cherche les liens avec le ticker dedans
    preg_match_all('/<a[^>]+href="([^"]*)"[^>]*>.*?' . preg_quote($symbole, '/') . '.*?<\/a>/is', $listR['html'], $tM);
    foreach (array_slice($tM[1], 0, 5) as $href) {
        $listLinks[] = ['href' => $href, 'text' => 'MATCH_TICKER'];
    }
}

echo json_encode([
    'symbole_tested' => $symbole,
    'list_page'      => [
        'url'       => $listUrl,
        'http_code' => $listR['code'],
        'html_len'  => strlen($listR['html']),
        'err'       => $listR['err'],
        'links'     => $listLinks,
        'snippet'   => substr(preg_replace('/\s+/', ' ', strip_tags($listR['html']??'')), 0, 1500),
    ],
    'company_page_attempts' => $results,
], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
