<?php
// api/why-proxy.php — Causes des mouvements des marchés mondiaux (Google News RSS)
// Retourne : { success, markets: { gold:[...], sp500:[...], crypto:[...], brent:[...], wti:[...], masi:[...], cac40:[...] } }
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

$cacheDir  = __DIR__ . '/cache';
if (!is_dir($cacheDir)) @mkdir($cacheDir, 0755, true);
$cacheFile = $cacheDir . '/why_news.json';
$cacheTTL  = isset($_GET['force']) ? 0 : 900; // 15 min

if ($cacheTTL > 0 && file_exists($cacheFile) && (time() - filemtime($cacheFile)) < $cacheTTL) {
    echo file_get_contents($cacheFile);
    exit;
}

// ── Marchés et leurs feeds Google News RSS ──────────────────────────────────
$MARKETS = [
    'gold' => [
        'label' => 'Or',
        'icon'  => '🥇',
        'feeds' => [
            'https://news.google.com/rss/search?q=gold+price+drop+fall+rise+why+reason&hl=en&gl=US&ceid=US:en',
            'https://news.google.com/rss/search?q=gold+price+dollar+fed+inflation+2026&hl=fr&gl=FR&ceid=FR:fr',
        ],
        'kw' => ['gold','or ','ounce','once','xau','precious','metal','haven','refuge'],
    ],
    'sp500' => [
        'label' => 'S&P 500',
        'icon'  => '🇺🇸',
        'feeds' => [
            'https://news.google.com/rss/search?q=S%26P+500+drop+rise+why+reason+today&hl=en&gl=US&ceid=US:en',
            'https://news.google.com/rss/search?q=nasdaq+dow+jones+wall+street+markets+today&hl=en&gl=US&ceid=US:en',
        ],
        'kw' => ['s&p','sp500','nasdaq','dow','wall street','stock market','equity','indices','index'],
    ],
    'crypto' => [
        'label' => 'Crypto (BTC)',
        'icon'  => '₿',
        'feeds' => [
            'https://news.google.com/rss/search?q=bitcoin+crypto+price+drop+rise+why+today&hl=en&gl=US&ceid=US:en',
            'https://news.google.com/rss/search?q=bitcoin+ethereum+cryptocurrency+market+2026&hl=fr&gl=FR&ceid=FR:fr',
        ],
        'kw' => ['bitcoin','btc','crypto','ethereum','eth','blockchain','coin','digital asset','altcoin'],
    ],
    'brent' => [
        'label' => 'Pétrole Brent',
        'icon'  => '🛢️',
        'feeds' => [
            'https://news.google.com/rss/search?q=brent+crude+oil+price+drop+rise+opec+why&hl=en&gl=US&ceid=US:en',
            'https://news.google.com/rss/search?q=pétrole+brent+prix+opec+baisse+hausse&hl=fr&gl=FR&ceid=FR:fr',
        ],
        'kw' => ['brent','crude','oil','pétrole','opec','barrel','barril','énergie','energy'],
    ],
    'wti' => [
        'label' => 'WTI (Brut)',
        'icon'  => '⛽',
        'feeds' => [
            'https://news.google.com/rss/search?q=WTI+crude+oil+price+today+why+reason&hl=en&gl=US&ceid=US:en',
            'https://news.google.com/rss/search?q=west+texas+intermediate+oil+production+supply&hl=en&gl=US&ceid=US:en',
        ],
        'kw' => ['wti','west texas','crude','oil','barrel','production','supply','demand','shale'],
    ],
    'masi' => [
        'label' => 'MASI (BVC)',
        'icon'  => '🇲🇦',
        'feeds' => [
            'https://news.google.com/rss/search?q=MASI+bourse+casablanca+BVC+maroc&hl=fr&gl=MA&ceid=MA:fr',
            'https://news.google.com/rss/search?q=bourse+casablanca+maroc+actions+marchés+2026&hl=fr&gl=MA&ceid=MA:fr',
        ],
        'kw' => ['masi','bvc','casablanca','bourse','maroc','marocain','ocp','attijariwafa','bmce','cih'],
    ],
    'cac40' => [
        'label' => 'CAC 40',
        'icon'  => '🇫🇷',
        'feeds' => [
            'https://news.google.com/rss/search?q=CAC+40+bourse+paris+baisse+hausse+pourquoi&hl=fr&gl=FR&ceid=FR:fr',
            'https://news.google.com/rss/search?q=CAC40+Paris+bourse+europe+BCE+inflation+2026&hl=fr&gl=FR&ceid=FR:fr',
        ],
        'kw' => ['cac','paris','lvmh','total','bnp','airbus','bce','euro','euronext','france','europe','eurostoxx'],
    ],
];

// ── Fetch parallèle ──────────────────────────────────────────────────────────
$mh    = curl_multi_init();
$curls = []; // [market_key, feed_url, ch]

foreach ($MARKETS as $key => $market) {
    foreach ($market['feeds'] as $url) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_TIMEOUT        => 10,
            CURLOPT_CONNECTTIMEOUT => 5,
            CURLOPT_USERAGENT      => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            CURLOPT_ENCODING       => '',
            CURLOPT_HTTPHEADER     => ['Accept-Language: fr-FR,fr;q=0.9,en;q=0.8'],
        ]);
        curl_multi_add_handle($mh, $ch);
        $curls[] = ['key' => $key, 'ch' => $ch];
    }
}

$active = null; $deadline = microtime(true) + 12;
do {
    curl_multi_exec($mh, $active);
    if ($active) curl_multi_select($mh, 0.05);
} while ($active > 0 && microtime(true) < $deadline);

// ── Parser + collecter ───────────────────────────────────────────────────────
$now48h = time() - 48 * 3600;
$now    = time();

$results = [];
foreach (array_keys($MARKETS) as $k) $results[$k] = [];
$seen = [];

function parseWhyRSS(string $xml): array {
    $items = [];
    $xml = preg_replace('/\s+xmlns[^=]*="[^"]*"/', '', $xml);
    libxml_use_internal_errors(true);
    $dom = new DOMDocument('1.0', 'UTF-8');
    @$dom->loadXML($xml);
    foreach ($dom->getElementsByTagName('item') as $it) {
        $title = html_entity_decode(
            trim($it->getElementsByTagName('title')->item(0)?->textContent ?? ''),
            ENT_QUOTES, 'UTF-8'
        );
        $link  = trim($it->getElementsByTagName('link')->item(0)?->textContent ?? '');
        $pub   = trim($it->getElementsByTagName('pubDate')->item(0)?->textContent ?? '');
        $desc  = html_entity_decode(
            strip_tags($it->getElementsByTagName('description')->item(0)?->textContent ?? ''),
            ENT_QUOTES, 'UTF-8'
        );
        $desc = mb_substr(trim(preg_replace('/\s+/', ' ', $desc)), 0, 200, 'UTF-8');
        // Nettoyer le titre (supprimer la source à la fin)
        $title = preg_replace('/ - [^-]{3,50}$/', '', $title);
        $title = trim($title);
        if (!$title || mb_strlen($title, 'UTF-8') < 8) continue;
        $ts = $pub ? @strtotime($pub) : 0;
        $items[] = ['title' => $title, 'url' => $link, 'ts' => $ts ?: 0, 'desc' => $desc, 'source' => ''];
    }
    return $items;
}

function ageLabel(int $ts): string {
    if (!$ts) return '';
    $d = time() - $ts;
    if ($d < 60)   return 'à l\'instant';
    if ($d < 3600) return 'il y a ' . max(1, round($d / 60)) . ' min';
    if ($d < 86400) return 'il y a ' . round($d / 3600) . 'h';
    return 'il y a ' . round($d / 86400) . 'j';
}

foreach ($curls as $item) {
    $body = curl_multi_getcontent($item['ch']);
    curl_multi_remove_handle($mh, $item['ch']);
    curl_close($item['ch']);
    if (!$body) continue;

    $key    = $item['key'];
    $market = $MARKETS[$key];
    $parsed = parseWhyRSS($body);
    $kw     = $market['kw'];

    foreach ($parsed as $art) {
        if ($art['ts'] && ($art['ts'] < $now48h || $art['ts'] > $now + 3600)) continue;
        // Filtrer : le titre doit contenir un mot-clé du marché
        $low = mb_strtolower($art['title'] . ' ' . $art['desc'], 'UTF-8');
        $ok  = false;
        foreach ($kw as $k) { if (mb_strpos($low, $k) !== false) { $ok = true; break; } }
        if (!$ok) continue;
        // Dédup global
        $dk = mb_strtolower(mb_substr($art['title'], 0, 50, 'UTF-8'), 'UTF-8');
        if (isset($seen[$key . $dk])) continue;
        $seen[$key . $dk] = true;

        $results[$key][] = [
            'title' => $art['title'],
            'url'   => $art['url'],
            'age'   => ageLabel($art['ts']),
            'ts'    => $art['ts'],
            'desc'  => $art['desc'],
        ];
    }
}
curl_multi_close($mh);

// ── Trier par fraîcheur, garder 6 par marché ────────────────────────────────
$markets_out = [];
foreach ($MARKETS as $key => $meta) {
    $items = $results[$key];
    usort($items, fn($a, $b) => $b['ts'] - $a['ts']);
    $items = array_slice($items, 0, 6);

    // Synthèse = titre du premier article (le plus récent = cause principale)
    $synthesis = '';
    if (!empty($items)) {
        $synthesis = $items[0]['title'];
        // Limiter à ~120 caractères pour rester lisible
        if (mb_strlen($synthesis, 'UTF-8') > 120) {
            $synthesis = mb_substr($synthesis, 0, 118, 'UTF-8') . '…';
        }
    }

    // Supprimer le champ ts (interne)
    foreach ($items as &$it) unset($it['ts']);
    unset($it);
    $markets_out[$key] = [
        'label'     => $meta['label'],
        'icon'      => $meta['icon'],
        'synthesis' => $synthesis,
        'items'     => $items,
    ];
}

$output = json_encode([
    'success'   => true,
    'timestamp' => date('Y-m-d H:i:s'),
    'markets'   => $markets_out,
], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);

file_put_contents($cacheFile, $output);
echo $output;
?>
