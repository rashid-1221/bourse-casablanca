<?php
// api/news-proxy.php
// Nouvelles en arabe : 3 locales Maroc + 6 mondiales importantes
// Traduction automatique vers l'arabe via Google Translate gratuit

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

$cacheDir  = __DIR__ . '/cache';
if (!is_dir($cacheDir)) @mkdir($cacheDir, 0755, true);
$cacheFile = $cacheDir . '/top_news.json';
$cacheTTL  = isset($_GET['force']) ? 0 : 900;

if ($cacheTTL > 0 && file_exists($cacheFile) && (time() - filemtime($cacheFile)) < $cacheTTL) {
    echo file_get_contents($cacheFile);
    exit;
}

$ctx = stream_context_create(['http' => [
    'timeout'    => 10,
    'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'header'     => "Accept: text/html,application/xhtml+xml\r\nAccept-Language: fr-FR,fr;q=0.9\r\n",
]]);

// ── TRADUCTION ARABE via Google Translate gratuit ─────────────────────────────
function translateToAr(string $text, $ctx): string {
    if (empty(trim($text))) return $text;
    $q   = urlencode($text);
    $url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=ar&dt=t&q={$q}";
    $raw = @file_get_contents($url, false, $ctx);
    if (!$raw) return $text;
    $j = json_decode($raw, true);
    if (!isset($j[0])) return $text;
    $translated = '';
    foreach ($j[0] as $part) {
        if (isset($part[0])) $translated .= $part[0];
    }
    return trim($translated) ?: $text;
}

// ── LOCALES : boursenews.ma (regex corrigé) ───────────────────────────────────
function fetchBoursenews($ctx): array {
    // cURL — plus fiable depuis MAMP Windows
    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL            => 'https://boursenews.ma/articles/marches',
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_SSL_VERIFYHOST => false,
        CURLOPT_TIMEOUT        => 12,
        CURLOPT_USERAGENT      => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        CURLOPT_HTTPHEADER     => ['Accept: text/html','Accept-Language: fr-FR,fr;q=0.9'],
    ]);
    $html = curl_exec($ch);
    curl_close($ch);
    if (!$html) return [];

    $html = preg_replace('/[\r\n\t]+/', ' ', $html);
    $html = preg_replace('/  +/', ' ', $html);

    // Structure réelle : <h3><a href="/article/marches/...">TITRE <span>DATE</span></a></h3>
    preg_match_all('/<a\s[^>]*href="(\/article\/marches\/[^"]+)"[^>]*>(.*?)<\/a>/is', $html, $ms, PREG_SET_ORDER);

    $mois = ['janvier'=>1,'février'=>2,'mars'=>3,'avril'=>4,'mai'=>5,'juin'=>6,
             'juillet'=>7,'août'=>8,'septembre'=>9,'octobre'=>10,'novembre'=>11,'décembre'=>12];
    $items = [];
    foreach ($ms as $m) {
        $inner = $m[2];
        // Chercher la date directement dans le contenu de <a>
        if (!preg_match('/(\d{1,2})\s+([A-Za-zÀ-ÿ]+)\s+(\d{4})/u', $inner, $dm)) continue;
        $mo = $mois[mb_strtolower($dm[2],'UTF-8')] ?? 0;
        if (!$mo) continue;
        $ts = mktime(0,0,0,$mo,(int)$dm[1],(int)$dm[3]);
        if ($ts < time() - 4*86400) continue;
        // Titre = contenu <a> sans le <span> date
        $titre = preg_replace('/<span[^>]*>.*?<\/span>/is', '', $inner);
        $titre = strip_tags($titre);
        $titre = html_entity_decode(trim(preg_replace('/\s+/', ' ', $titre)), ENT_QUOTES | ENT_HTML5, 'UTF-8');
        if (strlen($titre) < 10) continue;
        $items[] = ['title'=>$titre,'url'=>'https://boursenews.ma'.$m[1],'ts'=>$ts,'cat'=>'local','src'=>'🇲🇦 بورصة نيوز'];
    }
    return $items;
}

// ── INTERNATIONALES : Google News RSS ────────────────────────────────────────
function fetchInternational($ctx): array {
    $feeds = [
        // Guerres commerciales, tarifs douaniers Trump — impact direct BVC
        ['url'=>'https://news.google.com/rss/search?q=trump+tariffs+trade+war+markets+2026&hl=en&gl=US&ceid=US:en','src'=>'🌍 Reuters'],
        // Wall Street, Fed, taux intérêt
        ['url'=>'https://news.google.com/rss/search?q=fed+interest+rate+wall+street+dow+nasdaq+sp500&hl=en&gl=US&ceid=US:en','src'=>'🌍 Bloomberg'],
        // Or, pétrole, matières premières (OCP/phosphates, énergie Maroc)
        ['url'=>'https://news.google.com/rss/search?q=gold+price+record+oil+opec+brent+crude+2026&hl=en&gl=US&ceid=US:en','src'=>'🌍 FT'],
        // Marchés européens + CAC40 + BCE
        ['url'=>'https://news.google.com/rss/search?q=cac40+bce+euro+inflation+recession+europe+2026&hl=fr&gl=FR&ceid=FR:fr','src'=>'🌍 Les Échos'],
        // Maroc, OCP, phosphates, BVC, dirham
        ['url'=>'https://news.google.com/rss/search?q=maroc+bourse+casablanca+OCP+phosphate+dirham+2026&hl=fr&gl=MA&ceid=MA:fr','src'=>'🌍 Médias24'],
        // Marchés arabes — Golfe, MENA
        ['url'=>'https://news.google.com/rss/search?q=أسواق+مالية+وول+ستريت+نفط+ذهب+تعريفة+ترامب+2026&hl=ar&gl=AE&ceid=AE:ar','src'=>'🌍 العربية'],
    ];

    // Mots-clés filtre : marchés financiers, matières premières, BVC
    $kw = [
        // Anglais
        'market','stock','gold','oil','fed','rate','economy','inflation',
        'dow','nasdaq','sp500','wall street','bourse','tariff','trade',
        'opec','brent','crude','barrel','recession','gdp','ecb','imf',
        'trump','china','treasury','bond','yield','dollar',
        // Français
        'pétrole','or','taux','banque','économie','cac','euro',
        'récession','croissance','maroc','casablanca','phosphate','ocp','dirham','masi',
        // Arabe
        'اقتصاد','بورصة','نفط','ذهب','أسواق','فيدرالي','تعريفة','تضخم','ترامب','تجارة',
    ];

    $items = [];
    foreach ($feeds as $feed) {
        $xml = @file_get_contents($feed['url'], false, $ctx);
        if (!$xml) continue;
        $dom = new DOMDocument('1.0','UTF-8');
        @$dom->loadXML($xml);
        foreach ($dom->getElementsByTagName('item') as $it) {
            $title = trim($it->getElementsByTagName('title')->item(0)?->textContent ?? '');
            $link  = trim($it->getElementsByTagName('link')->item(0)?->textContent ?? '');
            $pub   = trim($it->getElementsByTagName('pubDate')->item(0)?->textContent ?? '');
            if (!$title || !$link) continue;
            $ts = strtotime($pub);
            if (!$ts || $ts < time() - 48*3600) continue;
            $title = preg_replace('/ - [^-]{3,50}$/','',$title);
            $title = html_entity_decode($title, ENT_QUOTES, 'UTF-8');
            $low = mb_strtolower($title,'UTF-8');
            $ok = false;
            foreach ($kw as $k) { if (mb_strpos($low,$k)!==false) { $ok=true; break; } }
            if (!$ok) continue;
            $items[] = ['title'=>$title,'url'=>$link,'ts'=>$ts,'cat'=>'intl','src'=>$feed['src']];
        }
    }
    return $items;
}

function dedup(array $items): array {
    $seen=[]; $out=[];
    foreach ($items as $i) {
        $k = strtolower(substr($i['title'],0,45));
        if (!isset($seen[$k])) { $seen[$k]=true; $out[]=$i; }
    }
    return $out;
}

function ageLabel(int $ts): string {
    $d = time() - $ts;
    if ($d < 3600)  return 'منذ ' . max(1,round($d/60)) . ' دقيقة';
    if ($d < 86400) return 'منذ ' . round($d/3600) . ' ساعة';
    return 'اليوم';
}

// ── Collecter + trier ────────────────────────────────────────────────────────
$locales = fetchBoursenews($ctx);
$intls   = fetchInternational($ctx);

usort($locales, fn($a,$b) => $b['ts']-$a['ts']);
usort($intls,   fn($a,$b) => $b['ts']-$a['ts']);

$locales = array_slice(dedup($locales), 0, 3);
$intls   = array_slice(dedup($intls),   0, 6);

// ── Liste finale : 3 locales + 6 mondiales — langues originales mélangées ────
$news = [];
foreach ($locales as $l) {
    $news[] = [
        'title'  => $l['title'],   // français (boursenews.ma)
        'url'    => $l['url'],
        'source' => $l['src'],
        'age'    => ageLabel($l['ts']),
        'cat'    => 'local',
        'rtl'    => false,
    ];
}
foreach ($intls as $n) {
    // Détecter RTL si source arabe
    $rtl = strpos($n['src'], 'العربية') !== false || strpos($n['src'], 'الجزيرة') !== false;
    $news[] = [
        'title'  => $n['title'],   // langue originale (EN / FR / AR)
        'url'    => $n['url'],
        'source' => $n['src'],
        'age'    => ageLabel($n['ts']),
        'cat'    => 'intl',
        'rtl'    => $rtl,
    ];
}

$output = [
    'success'   => true,
    'timestamp' => date('Y-m-d H:i:s'),
    'total'     => count($news),
    'locales'   => count($locales),
    'intl'      => count($intls),
    'news'      => $news,
];

$json = json_encode($output, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
file_put_contents($cacheFile, $json);
echo $json;
