<?php
// api/x-feed-proxy.php
// Récupère les tweets du jour de comptes X via Nitter RSS (sans API key)

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

$accounts = isset($_GET['accounts'])
    ? array_filter(array_map('trim', explode(',', $_GET['accounts'])))
    : ['warsurv', 'ardizor', 'pushpendrakum', 'PressSec'];

$force    = isset($_GET['force']);
$cacheDir = __DIR__ . '/cache';
if (!is_dir($cacheDir)) @mkdir($cacheDir, 0755, true);

// Instances Nitter à essayer (fallback)
$NITTER = [
    'https://nitter.poast.org',
    'https://nitter.privacydev.net',
    'https://nitter.cz',
    'https://nitter.1d4.us',
    'https://nitter.woodland.cafe',
];

function fetchRSS(string $url): ?string {
    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL            => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_SSL_VERIFYHOST => false,
        CURLOPT_TIMEOUT        => 8,
        CURLOPT_CONNECTTIMEOUT => 4,
        CURLOPT_USERAGENT      => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        CURLOPT_HTTPHEADER     => ['Accept: application/rss+xml, application/xml, text/xml'],
    ]);
    $body = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    if (!$body || $code < 200 || $code >= 400) return null;
    // Vérifier que c'est bien du RSS
    if (strpos($body, '<rss') === false && strpos($body, '<feed') === false) return null;
    return $body;
}

function parseTweets(string $xml, string $account, string $nitter): array {
    $today = date('Y-m-d');
    $dom   = new DOMDocument('1.0', 'UTF-8');
    @$dom->loadXML($xml);

    $tweets = [];
    foreach ($dom->getElementsByTagName('item') as $item) {
        $title   = trim($item->getElementsByTagName('title')->item(0)?->textContent ?? '');
        $link    = trim($item->getElementsByTagName('link')->item(0)?->textContent ?? '');
        $pubDate = trim($item->getElementsByTagName('pubDate')->item(0)?->textContent ?? '');
        $desc    = trim($item->getElementsByTagName('description')->item(0)?->textContent ?? '');

        if (!$title || !$pubDate) continue;
        $ts = strtotime($pubDate);
        if (!$ts) continue;

        // Filtre : aujourd'hui uniquement
        if (date('Y-m-d', $ts) !== $today) continue;

        // Nettoyer le titre (Nitter préfixe avec "R@user: " pour les RTs)
        $isRT  = (bool) preg_match('/^R@/i', $title);
        $text  = preg_replace('/^R?@\w+:\s*/i', '', $title);
        $text  = html_entity_decode(trim($text), ENT_QUOTES | ENT_HTML5, 'UTF-8');

        // Convertir lien Nitter → X.com
        $tweetUrl = preg_replace('#^https?://[^/]+/#', 'https://x.com/', $link);

        // Extraire images depuis description HTML
        $images = [];
        if (preg_match_all('/<img[^>]+src="([^"]+)"/i', $desc, $im)) {
            foreach ($im[1] as $src) {
                // Reconstruire URL absolue si relative
                if (strpos($src, 'http') !== 0) $src = $nitter . $src;
                $images[] = $src;
            }
        }

        $tweets[] = [
            'text'    => $text,
            'url'     => $tweetUrl,
            'ts'      => $ts,
            'time'    => date('H:i', $ts),
            'is_rt'   => $isRT,
            'images'  => array_slice($images, 0, 2),
        ];
    }
    return $tweets;
}

$result = [];

foreach ($accounts as $account) {
    $cacheFile = $cacheDir . '/xfeed_' . strtolower($account) . '.json';
    $cacheTTL  = 600; // 10 min

    // Cache valide ?
    if (!$force && file_exists($cacheFile) && (time() - filemtime($cacheFile)) < $cacheTTL) {
        $cached = json_decode(file_get_contents($cacheFile), true);
        if ($cached) { $result[] = $cached; continue; }
    }

    // Essayer chaque instance Nitter
    $tweets  = [];
    $usedUrl = null;
    foreach ($NITTER as $base) {
        $rssUrl = $base . '/' . $account . '/rss';
        $xml    = fetchRSS($rssUrl);
        if ($xml) {
            $tweets  = parseTweets($xml, $account, $base);
            $usedUrl = $base;
            break;
        }
    }

    $entry = [
        'account' => $account,
        'url'     => 'https://x.com/' . $account,
        'tweets'  => $tweets,
        'total'   => count($tweets),
        'source'  => $usedUrl,
        'date'    => date('d/m/Y'),
        'fetched' => date('H:i:s'),
        'error'   => !$usedUrl ? 'Aucune instance Nitter disponible' : null,
    ];

    file_put_contents($cacheFile, json_encode($entry, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
    $result[] = $entry;
}

echo json_encode([
    'success'  => true,
    'date'     => date('d/m/Y'),
    'accounts' => $result,
], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
