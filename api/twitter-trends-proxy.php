<?php
// api/twitter-trends-proxy.php
// Récupère les tendances Twitter via trends24.in (gratuit, sans API key)
// Pays: Maroc, France, USA

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

$cacheDir  = __DIR__ . '/cache';
if (!is_dir($cacheDir)) @mkdir($cacheDir, 0755, true);
$cacheFile = $cacheDir . '/twitter_trends.json';
$cacheTTL  = 900; // 15 minutes

// Retourner le cache si encore valide
if (file_exists($cacheFile) && (time() - filemtime($cacheFile)) < $cacheTTL) {
    echo file_get_contents($cacheFile);
    exit;
}

// Mots-clés économie/finance pour filtre optionnel
$KEYWORDS_ECO = [
    // Français
    'bourse','marché','économie','finance','banque','inflation','pétrole','or','argent','action','indice','taux','fonds','invest','crypto','bitcoin','récession','dette','déficit','pib','croissance','emploi','chômage','salaire','impôt','budget','cac','dow','nasdaq','sp500',
    // Anglais
    'market','stock','economy','finance','bank','oil','gold','silver','trade','gdp','rate','fund','invest','crypto','bitcoin','recession','debt','nasdaq','dow','sp500','fed','inflation','jobs','unemployment','wage','tax','budget','earnings','ipo','merger',
    // Arabe
    'اقتصاد','بورصة','نفط','ذهب','فضة','أسهم','استثمار','تضخم','بنك','عملة','ميزانية','ديون','ناسداك','وول',
    // Général
    'ia','ai','chatgpt','tesla','nvidia','apple','amazon','google','microsoft','meta','trump','opec','euro','dollar','dirham'
];

function fetchTrends($country, $url) {
    $ctx = stream_context_create([
        'http' => [
            'timeout'     => 8,
            'user_agent'  => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
            'header'      => "Accept: text/html,application/xhtml+xml\r\nAccept-Language: fr-FR,fr;q=0.9,en;q=0.8\r\n"
        ]
    ]);

    $html = @file_get_contents($url, false, $ctx);
    if (!$html) return [];

    $trends = [];

    // trends24.in structure: <li class="trend-card__list-item"><a ...>#TrendName</a> <span class="tweet-count">12K</span>
    if (preg_match_all('/<a[^>]+class="[^"]*trend-card__list-item[^"]*"[^>]*>([^<]+)<\/a>/i', $html, $m)) {
        foreach ($m[1] as $t) {
            $t = trim(html_entity_decode($t, ENT_QUOTES, 'UTF-8'));
            if ($t) $trends[] = $t;
        }
    }

    // Fallback: chercher les liens #hashtag ou trends dans les list items
    if (empty($trends)) {
        if (preg_match_all('/<li[^>]*class="[^"]*trend[^"]*"[^>]*>\s*<a[^>]*>([^<]+)<\/a>/i', $html, $m2)) {
            foreach ($m2[1] as $t) {
                $t = trim(html_entity_decode($t, ENT_QUOTES, 'UTF-8'));
                if ($t && strlen($t) > 1) $trends[] = $t;
            }
        }
    }

    // Fallback 2: ol.trend-card__list > li > a
    if (empty($trends)) {
        if (preg_match_all('/<ol[^>]*class="[^"]*trend-card__list[^"]*"[^>]*>(.*?)<\/ol>/is', $html, $blocks)) {
            foreach ($blocks[1] as $block) {
                if (preg_match_all('/<a[^>]*>([^<]+)<\/a>/i', $block, $links)) {
                    foreach ($links[1] as $t) {
                        $t = trim(html_entity_decode($t, ENT_QUOTES, 'UTF-8'));
                        if ($t && strlen($t) > 1) $trends[] = $t;
                    }
                }
            }
        }
    }

    return array_slice(array_unique($trends), 0, 30);
}

$sources = [
    ['pays' => 'Maroc',   'flag' => '🇲🇦', 'lang' => 'ar/fr', 'url' => 'https://trends24.in/morocco/'],
    ['pays' => 'France',  'flag' => '🇫🇷', 'lang' => 'fr',    'url' => 'https://trends24.in/france/'],
    ['pays' => 'USA',     'flag' => '🇺🇸', 'lang' => 'en',    'url' => 'https://trends24.in/united-states/'],
];

$result = [];

foreach ($sources as $src) {
    $trends = fetchTrends($src['pays'], $src['url']);
    $result[] = [
        'pays'   => $src['pays'],
        'flag'   => $src['flag'],
        'lang'   => $src['lang'],
        'trends' => $trends,
        'count'  => count($trends),
    ];
}

// Filtrer: garder tendances liées à l'économie/finance (optionnel - false = tout afficher)
$FILTER_ECO = true;

if ($FILTER_ECO) {
    foreach ($result as &$src) {
        $src['trends'] = array_values(array_filter($src['trends'], function($t) use ($KEYWORDS_ECO) {
            $tl = mb_strtolower($t);
            foreach ($KEYWORDS_ECO as $kw) {
                if (mb_stripos($tl, mb_strtolower($kw)) !== false) return true;
            }
            return false;
        }));
        $src['count'] = count($src['trends']);
    }
    unset($src);
}

$output = [
    'success'   => true,
    'timestamp' => date('Y-m-d H:i:s'),
    'source'    => 'trends24.in',
    'data'      => $result,
];

$json = json_encode($output, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
file_put_contents($cacheFile, $json);
echo $json;
