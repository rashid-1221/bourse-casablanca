<?php
// api/news-articles.php — Actualités par type pour le menu Actualités (newsManager)
// Format retourné : { success: true, articles: [{title, link, source, date, image, desc}] }
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Cache-Control: no-store');

$type     = $_GET['type'] ?? 'bourse';
$now      = new DateTime('now', new DateTimeZone('Africa/Casablanca'));
// Social : fenêtre 5h · Géopolitique : 48h · Autres : 24h
$limitH   = ($type === 'social') ? '-5 hours' : (($type === 'geopolitique') ? '-48 hours' : '-24 hours');
$limit24h = (clone $now)->modify($limitH)->getTimestamp();
$nowTs    = $now->getTimestamp();

// ── Feeds par type ─────────────────────────────────────────────────────────────
$FEEDS = [
    'bourse' => [
        ['url' => 'https://boursenews.ma/rss.xml',             'source' => 'BourseNews',       'flag' => '🇲🇦'],
        ['url' => 'https://medias24.com/feed/',                 'source' => 'Medias24',          'flag' => '🇲🇦'],
        ['url' => 'https://www.leconomiste.com/rss.xml',       'source' => "L'Économiste",       'flag' => '🇲🇦'],
        ['url' => 'https://fnh.ma/feed/',                      'source' => 'Finances News',      'flag' => '🇲🇦'],
    ],
    'monde' => [
        ['url' => 'https://feeds.reuters.com/reuters/businessNews',    'source' => 'Reuters',        'flag' => '🌐'],
        ['url' => 'https://feeds.reuters.com/reuters/topNews',         'source' => 'Reuters World',  'flag' => '🌐'],
        ['url' => 'https://www.cnbc.com/id/10000664/device/rss/rss.html','source' => 'CNBC',         'flag' => '🌐'],
        ['url' => 'https://feeds.marketwatch.com/marketwatch/topstories/','source' => 'MarketWatch', 'flag' => '🌐'],
        ['url' => 'https://feeds.bloomberg.com/markets/news.rss',      'source' => 'Bloomberg',      'flag' => '🌐'],
        ['url' => 'https://feeds.lesechos.fr/lesechos-finance',        'source' => 'Les Échos',      'flag' => '🇫🇷'],
        ['url' => 'https://www.bfmtv.com/rss/economie/',               'source' => 'BFM Business',   'flag' => '🇫🇷'],
        ['url' => 'https://fr.reuters.com/rssFeed/businessNews',       'source' => 'Reuters FR',     'flag' => '🇫🇷'],
        ['url' => 'https://feeds.reuters.com/reuters/worldNews',           'source' => 'Reuters World',    'flag' => '🌐'],
        ['url' => 'https://apnews.com/rss',                                'source' => 'AP News',           'flag' => '🌐'],
        ['url' => 'https://feeds.a.dj.com/rss/RSSWorldNews.xml',          'source' => 'WSJ World',         'flag' => '🌐'],
        ['url' => 'https://www.project-syndicate.org/rss',                  'source' => 'Project Syndicate', 'flag' => '🌐'],
    ],
    'tendances' => [
        ['url' => 'https://news.google.com/rss/search?q=petrole+brent+wti&hl=fr&gl=MA&ceid=MA:fr',     'source' => 'Pétrole',          'flag' => '🛢️'],
        ['url' => 'https://news.google.com/rss/search?q=gold+or+prix+once&hl=fr&gl=MA&ceid=MA:fr',     'source' => 'Or & Métaux',      'flag' => '🥇'],
        ['url' => 'https://news.google.com/rss/search?q=bourse+maroc+masi+bvc&hl=fr&gl=MA&ceid=MA:fr', 'source' => 'Maroc Finance',    'flag' => '🇲🇦'],
        ['url' => 'https://news.google.com/rss/search?q=stock+market+nasdaq+sp500&hl=en&gl=US&ceid=US:en','source' => 'Bourses Mondiales','flag' => '🌐'],
        ['url' => 'https://news.google.com/rss/search?q=inflation+recession+fed+ecb&hl=fr&gl=FR&ceid=FR:fr','source' => 'Économie Mondiale','flag' => '🌐'],
        ['url' => 'https://news.google.com/rss/search?q=trump+sanctions+tariffs+trade+war&hl=en&gl=US&ceid=US:en', 'source' => 'Trump & Trade', 'flag' => '🇺🇸'],
        ['url' => 'https://news.google.com/rss/search?q=iran+strait+hormuz+nuclear+sanctions&hl=en&gl=US&ceid=US:en','source' => 'Iran & Geopolitics','flag' => '🌍'],
        ['url' => 'https://news.google.com/rss/search?q=federal+reserve+interest+rates+powell&hl=en&gl=US&ceid=US:en','source' => 'FED & Rates','flag' => '🏦'],
    ],
    'marches' => [], // BourseNews marchés HTML only (scraping)
    'geopolitique' => [
        ['url' => 'https://news.google.com/rss/search?q=iran+guerre+detroit+hormuz+sanctions+nucleaire&hl=fr&gl=MA&ceid=MA:fr',  'source' => 'Iran & Moyen-Orient',  'flag' => '🌍'],
        ['url' => 'https://news.google.com/rss/search?q=trump+tarifs+douanes+sanctions+guerre+commerciale&hl=fr&gl=MA&ceid=MA:fr','source' => 'Trump & Tarifs',       'flag' => '🇺🇸'],
        ['url' => 'https://news.google.com/rss/search?q=fed+taux+interet+inflation+jerome+powell+banque+centrale&hl=fr&gl=FR&ceid=FR:fr','source' => 'FED & Banques', 'flag' => '🏦'],
        ['url' => 'https://news.google.com/rss/search?q=bitcoin+ethereum+crypto+marche+prix+regulation&hl=fr&gl=MA&ceid=MA:fr',  'source' => 'Crypto & Bitcoin',     'flag' => '₿'],
        ['url' => 'https://news.google.com/rss/search?q=petrole+opec+production+brent+wti+prix+barril&hl=fr&gl=MA&ceid=MA:fr',  'source' => 'Pétrole & OPEC',        'flag' => '🛢️'],
        ['url' => 'https://news.google.com/rss/search?q=ukraine+russie+guerre+sanctions+cereales+energie&hl=fr&gl=MA&ceid=MA:fr','source' => 'Ukraine & Russie',     'flag' => '⚔️'],
        ['url' => 'https://news.google.com/rss/search?q=chine+usa+taiwan+commerce+economie+technologie&hl=fr&gl=MA&ceid=MA:fr', 'source' => 'Chine & USA',           'flag' => '🇨🇳'],
    ],

    // ── Sources "Social" : Reddit + Mastodon + Telegram RSS ──────────────────
    // Reddit a une API RSS publique et gratuite, très réactive (5-15 min après Twitter)
    // Ces subreddits agrègent et discutent exactement ce qui circule sur Twitter
    'social' => [
        // Reddit — actualités mondiales et marchés
        ['url' => 'https://www.reddit.com/r/worldnews/top/.rss?t=day&limit=25',       'source' => 'Reddit WorldNews',   'flag' => '🌐'],
        ['url' => 'https://www.reddit.com/r/geopolitics/top/.rss?t=day&limit=25',     'source' => 'Reddit Geopolitics', 'flag' => '🌍'],
        ['url' => 'https://www.reddit.com/r/investing/top/.rss?t=day&limit=25',       'source' => 'Reddit Investing',   'flag' => '📈'],
        ['url' => 'https://www.reddit.com/r/economics/top/.rss?t=day&limit=25',       'source' => 'Reddit Economics',   'flag' => '🏦'],
        ['url' => 'https://www.reddit.com/r/CryptoCurrency/top/.rss?t=day&limit=20',  'source' => 'Reddit Crypto',      'flag' => '₿'],
        ['url' => 'https://www.reddit.com/r/energy/top/.rss?t=day&limit=20',          'source' => 'Reddit Energy',      'flag' => '🛢️'],
        ['url' => 'https://www.reddit.com/r/MiddleEast/top/.rss?t=day&limit=20',      'source' => 'Reddit MoyenOrient', 'flag' => '🌍'],
        // Mastodon — journalistes et analystes financiers
        ['url' => 'https://mastodon.social/@Mastodon.rss',                            'source' => 'Mastodon',           'flag' => '🐘'],
        // Al Jazeera English — très réactif, couvre Moyen-Orient mieux que Reuters
        ['url' => 'https://www.aljazeera.com/xml/rss/all.xml',                        'source' => 'Al Jazeera',         'flag' => '🌍'],
        // The Guardian World
        ['url' => 'https://www.theguardian.com/world/rss',                            'source' => 'The Guardian',       'flag' => '🌐'],
        // Financial Times headlines (gratuit)
        ['url' => 'https://www.ft.com/world?format=rss',                              'source' => 'Financial Times',    'flag' => '🌐'],
        // DW (Deutsche Welle) — breaking news
        ['url' => 'https://rss.dw.com/rdf/rss-en-all',                               'source' => 'DW News',            'flag' => '🌐'],
    ],
];

// ── Scraper HTML boursenews.ma/articles/marches ─────────────────────────────
function scrapeBourseNewsMarches($limit24h, $nowTs) {
    $ch = curl_init('https://boursenews.ma/articles/marches');
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_TIMEOUT        => 12,
        CURLOPT_CONNECTTIMEOUT => 6,
        CURLOPT_USERAGENT      => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        CURLOPT_HTTPHEADER     => ['Accept: text/html,application/xhtml+xml', 'Accept-Language: fr-FR,fr;q=0.9,en;q=0.8'],
        CURLOPT_ENCODING       => '',
    ]);
    $html  = curl_exec($ch);
    $errno = curl_errno($ch);
    curl_close($ch);
    if ($errno || !$html) return [];

    libxml_use_internal_errors(true);
    $dom = new DOMDocument();
    @$dom->loadHTML('<?xml encoding="UTF-8"?>' . $html);
    libxml_clear_errors();
    $xpath = new DOMXPath($dom);

    $articles = [];
    $seen     = [];

    // ── Stratégie 1 : éléments <article> ──
    $items = $xpath->query('//article');

    // ── Stratégie 2 : conteneurs CMS courants ──
    if (!$items || $items->length === 0) {
        $items = $xpath->query(
            '//*[contains(@class,"node--type-article") or contains(@class,"views-row") or '
          . 'contains(@class,"article-item") or contains(@class,"post-item") or '
          . 'contains(@class,"news-card") or contains(@class,"card-article")]'
        );
    }

    // ── Stratégie 3 (fallback) : liens vers /articles/marches/ ──
    if (!$items || $items->length === 0) {
        $links = $xpath->query('//a[contains(@href,"/articles/marches/") or contains(@href,"/article/marche")]');
        foreach ($links as $link) {
            $href  = trim($link->getAttribute('href'));
            if (!$href || isset($seen[$href])) continue;
            $seen[$href] = true;
            $title = trim(preg_replace('/\s+/', ' ', $link->textContent));
            if (mb_strlen($title, 'UTF-8') < 10) continue;
            $fullUrl = (strpos($href, 'http') === 0) ? $href : 'https://boursenews.ma' . $href;
            $articles[] = [
                'title'  => $title,
                'link'   => $fullUrl,
                'source' => '🇲🇦 BourseNews Marchés',
                'date'   => null,
                'image'  => null,
                'desc'   => '',
            ];
            if (count($articles) >= 25) break;
        }
        return $articles;
    }

    // ── Extraction depuis éléments trouvés ──
    foreach ($items as $item) {
        // Titre
        $titleNodes = $xpath->query('.//h1|.//h2|.//h3|.//h4|.//*[contains(@class,"title")]|.//*[contains(@class,"heading")]', $item);
        $title = '';
        foreach ($titleNodes as $tn) {
            $t = trim(preg_replace('/\s+/', ' ', $tn->textContent));
            if (mb_strlen($t, 'UTF-8') > 10) { $title = $t; break; }
        }
        if (!$title) continue;

        // Lien
        $linkNodes = $xpath->query('.//a[@href]', $item);
        $href = '';
        foreach ($linkNodes as $ln) {
            $h = trim($ln->getAttribute('href'));
            if ($h && strpos($h, '#') !== 0 && strpos($h, 'javascript') !== 0) { $href = $h; break; }
        }
        if (!$href || isset($seen[$href])) continue;
        $seen[$href] = true;
        if (strpos($href, 'http') !== 0) $href = 'https://boursenews.ma' . $href;

        // Date
        $timeNodes = $xpath->query('.//*[@datetime]|.//time|.//*[contains(@class,"date")]', $item);
        $dateStr = null;
        foreach ($timeNodes as $tn) {
            $d = $tn->getAttribute('datetime') ?: trim($tn->textContent);
            if ($d && strlen(trim($d)) > 4) { $dateStr = trim($d); break; }
        }
        // Filtre 24h si date parseable
        $ts = null;
        if ($dateStr) {
            try { $dt = new DateTime($dateStr); $ts = $dt->getTimestamp(); }
            catch (Exception $e) { $ts = @strtotime($dateStr) ?: null; }
        }
        if ($ts && ($ts < $limit24h || $ts > $nowTs + 3600)) continue;

        // Image
        $imgSrc = null;
        foreach ($xpath->query('.//img[@src]', $item) as $img) {
            $src = $img->getAttribute('src');
            if ($src && strpos($src, 'data:') !== 0) {
                $imgSrc = (strpos($src, 'http') === 0) ? $src : 'https://boursenews.ma' . $src;
                break;
            }
        }

        // Description
        $descNodes = $xpath->query('.//*[contains(@class,"summary") or contains(@class,"excerpt") or contains(@class,"desc") or contains(@class,"teaser")]', $item);
        $desc = '';
        foreach ($descNodes as $dn) {
            $d = trim(preg_replace('/\s+/', ' ', $dn->textContent));
            if (strlen($d) > 20) { $desc = mb_substr($d, 0, 200, 'UTF-8'); break; }
        }

        $articles[] = [
            'title'  => $title,
            'link'   => $href,
            'source' => '🇲🇦 BourseNews Marchés',
            'date'   => $dateStr ?? null,
            'image'  => $imgSrc,
            'desc'   => $desc,
        ];
        if (count($articles) >= 25) break;
    }

    return $articles;
}

// ── Parser un flux RSS brut → articles ───────────────────────────────────────
function parseRSSToArticles($raw, $feed, $limit24h, $nowTs) {
    $raw = preg_replace('/\s+xmlns[^=]*="[^"]*"/', '', $raw);
    $raw = preg_replace('/<([a-zA-Z]+):[a-zA-Z]/', '<$1', $raw);
    $raw = preg_replace('/<\/[a-zA-Z]+:[a-zA-Z][^>]*>/', '</', $raw);

    libxml_use_internal_errors(true);
    $xml = @simplexml_load_string($raw);
    if (!$xml) return [];

    $items = $xml->channel->item ?? $xml->entry ?? [];
    $out   = [];

    foreach ($items as $item) {
        $title   = html_entity_decode(trim((string)($item->title ?? '')), ENT_QUOTES, 'UTF-8');
        $link    = trim((string)($item->link ?? $item->id ?? ''));
        $pubDate = trim((string)($item->pubDate ?? $item->published ?? $item->updated ?? ''));
        $desc    = html_entity_decode(strip_tags((string)($item->description ?? $item->summary ?? '')), ENT_QUOTES, 'UTF-8');
        $desc    = mb_substr(trim(preg_replace('/\s+/', ' ', $desc)), 0, 220, 'UTF-8');

        // Image depuis enclosure ou media:content
        $imgSrc = null;
        if (isset($item->enclosure)) {
            $type = (string)($item->enclosure['type'] ?? '');
            if (strpos($type, 'image') !== false) $imgSrc = (string)($item->enclosure['url'] ?? '');
        }

        if (!$title || mb_strlen($title, 'UTF-8') < 8) continue;

        // Filtre 24h
        $ts = null;
        if ($pubDate) {
            try { $dt = new DateTime($pubDate); $dt->setTimezone(new DateTimeZone('Africa/Casablanca')); $ts = $dt->getTimestamp(); }
            catch (Exception $e) { $ts = @strtotime($pubDate) ?: null; }
        }
        if (!$ts || $ts < $limit24h || $ts > $nowTs + 3600) continue;

        $out[] = [
            'title'  => $title,
            'link'   => $link,
            'source' => $feed['flag'] . ' ' . $feed['source'],
            'date'   => $pubDate ?: date('c', $ts),
            'image'  => $imgSrc,
            'desc'   => $desc,
        ];
        if (count($out) >= 25) break;
    }
    return $out;
}

// ══════════════════════════════════════════════════════════════════════════════
// ── GESTIONNAIRE SPÉCIAL : SOCIAL (Reddit JSON + RSS trending) ───────────────
// Utilise Reddit JSON API (sans clé) pour avoir les vrais upvotes.
// Score composite = (upvotes + comments×3) × decay_récence + breaking_bonus
// ══════════════════════════════════════════════════════════════════════════════
if ($type === 'social') {

    // ── Subs 100% finance/économie (pas de filtre whitelist nécessaire) ──────
    $REDDIT_SUBS = [
        // Finance pure
        'investing'         => ['source' => 'Reddit Investing',    'min' =>  50, 'finance' => true],
        'economics'         => ['source' => 'Reddit Economics',    'min' =>  30, 'finance' => true],
        'finance'           => ['source' => 'Reddit Finance',      'min' =>  20, 'finance' => true],
        'stocks'            => ['source' => 'Reddit Stocks',       'min' =>  50, 'finance' => true],
        'SecurityAnalysis'  => ['source' => 'Reddit Analysis',     'min' =>  10, 'finance' => true],
        'econmonitor'       => ['source' => 'Reddit EconMonitor',  'min' =>   5, 'finance' => true],
        'wallstreetbets'    => ['source' => 'Reddit WSB',          'min' => 500, 'finance' => true],
        'CryptoCurrency'    => ['source' => 'Reddit Crypto',       'min' => 100, 'finance' => true],
        'energy'            => ['source' => 'Reddit Energy',       'min' =>  30, 'finance' => true],
        // Actualités générales — filtrées par whitelist économique
        'worldnews'         => ['source' => 'Reddit WorldNews',    'min' => 500, 'finance' => false],
        'news'              => ['source' => 'Reddit News',         'min' => 800, 'finance' => false],
        'geopolitics'       => ['source' => 'Reddit Geopolitics',  'min' => 100, 'finance' => false],
        'europe'            => ['source' => 'Reddit Europe',       'min' => 200, 'finance' => false],
    ];

    // Hacker News via Algolia — filtré par whitelist
    $HN_SOURCES = [
        ['url' => 'https://hn.algolia.com/api/v1/search?tags=front_page&hitsPerPage=30', 'source' => 'Hacker News', 'min' => 150, 'finance' => false],
    ];

    // Mastodon trending — journalistes & analystes financiers (API publique, sans clé)
    $MASTODON_SOURCES = [
        ['url' => 'https://mastodon.social/api/v1/trends/statuses?limit=20', 'source' => 'Mastodon', 'min_fav' => 10, 'finance' => false],
    ];

    // Lemmy — communautés finance/économie (Reddit décentralisé)
    $LEMMY_SOURCES = [
        ['url' => 'https://lemmy.world/api/v3/post/list?type_=All&sort=TopDay&limit=15&community_name=economics',  'source' => 'Lemmy Economics', 'min' => 5,  'finance' => true],
        ['url' => 'https://lemmy.world/api/v3/post/list?type_=All&sort=TopDay&limit=15&community_name=finance',    'source' => 'Lemmy Finance',    'min' => 3,  'finance' => true],
        ['url' => 'https://lemmy.world/api/v3/post/list?type_=All&sort=TopDay&limit=10&community_name=investing',  'source' => 'Lemmy Investing',  'min' => 3,  'finance' => true],
        ['url' => 'https://lemmy.world/api/v3/post/list?type_=All&sort=TopDay&limit=10&community_name=worldnews',  'source' => 'Lemmy WorldNews',  'min' => 10, 'finance' => false],
    ];

    // Lobste.rs — communauté tech/finance, scores réels (JSON public)
    $LOBSTERS_SOURCES = [
        ['url' => 'https://lobste.rs/hottest.json', 'source' => 'Lobsters', 'min' => 5, 'finance' => false],
    ];

    $RSS_SOURCES = [];

    // ── Whitelist économique/financière ───────────────────────────────────────
    // Un article DOIT contenir au moins un de ces mots pour être gardé
    // (appliqué uniquement aux sources 'finance' => false)
    $FINANCE_KW = [
        // Marchés & Indices
        'stock','market','markets','shares','equity','equities','index','indices',
        'wall street','nyse','nasdaq','s&p','dow jones','ftse','dax','cac 40',
        'nikkei','hang seng','sensex','bse','trading','rally','selloff','sell-off',
        'bull market','bear market','correction','crash','ipo','listing',
        // Banques centrales & Politique monétaire
        'fed','federal reserve','ecb','central bank','interest rate','rate hike',
        'rate cut','inflation','deflation','quantitative easing','tapering',
        'monetary policy','jerome powell','lagarde','boe','bank of england',
        'bank of japan','boj','pboc','china bank',
        // Macroéconomie
        'gdp','recession','economic growth','economic','economy','employment',
        'unemployment','jobs report','payrolls','cpi','ppi','consumer price',
        'producer price','trade deficit','trade surplus','fiscal','budget deficit',
        // Finance & Banques
        'bank','banking','finance','financial','credit','debt','bond','yield',
        'treasury','mortgage','loan','earnings','revenue','profit','loss',
        'merger','acquisition','takeover','bankruptcy','default','hedge fund',
        'private equity','venture capital','asset management','blackrock',
        'jp morgan','goldman sachs','morgan stanley','citibank','ubs','deutsche bank',
        // Matières premières & Énergie
        'oil','crude','brent','wti','opec','natural gas','lng','energy price',
        'gold','silver','copper','lithium','cobalt','wheat','corn','soybean',
        'commodity','commodities',
        // Crypto & Digital
        'bitcoin','crypto','ethereum','blockchain','defi','stablecoin','coinbase',
        'binance','ftx','crypto market',
        // Commerce & Géopolitique économique
        'tariff','tariffs','trade war','sanction','sanctions','trade deal',
        'supply chain','export','import','wto','g7','g20','imf','world bank',
        'investment','investor','foreign direct investment',
        // Big Tech & Entreprises clés
        'apple','microsoft','amazon','google','alphabet','meta','tesla','nvidia',
        'berkshire','warren buffett','elon musk','sam altman',
        // Termes FR/généraux
        'bourse','marché','taux','obligation','dette','croissance','recession',
        'dette','déficit','surplus','exportation','importation',
    ];

    $isFinanceRelevant = function(string $t) use ($FINANCE_KW): bool {
        $t = strtolower($t);
        foreach ($FINANCE_KW as $kw) { if (strpos($t, $kw) !== false) return true; }
        return false;
    };

    // ── Mots-clés "breaking" — boost dans le score ────────────────────────────
    $BREAK_KW = ['breaking','urgent','just in','alert','crash','default','bankruptcy',
                 'rate hike','rate cut','recession','sanctions','collapse','crisis',
                 'emergency','surge','plunge','soars','tumbles','federal reserve',
                 'inflation spike','market crash','bank run','debt ceiling'];

    // ── Lance tous les fetches en parallèle ─────────────────────────────────
    $mh    = curl_multi_init();
    $curls = [];

    foreach ($REDDIT_SUBS as $sub => $meta) {
        $ch = curl_init("https://www.reddit.com/r/{$sub}/top.json?t=day&limit=15&raw_json=1");
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT        => 10,
            CURLOPT_USERAGENT      => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTPHEADER     => ['Accept: application/json'],
        ]);
        curl_multi_add_handle($mh, $ch);
        $curls[] = ['ch' => $ch, 'kind' => 'reddit', 'sub' => $sub, 'meta' => $meta];
    }

    foreach ($RSS_SOURCES as $feed) {
        $ch = curl_init($feed['url']);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT        => 10,
            CURLOPT_USERAGENT      => 'Mozilla/5.0 (compatible; BVCNewsBot/2.0)',
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_ENCODING       => '',
        ]);
        curl_multi_add_handle($mh, $ch);
        $curls[] = ['ch' => $ch, 'kind' => 'rss', 'source' => $feed['source']];
    }

    foreach ($HN_SOURCES as $hn) {
        $ch = curl_init($hn['url']);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 10,
            CURLOPT_USERAGENT => 'Mozilla/5.0 (compatible; BVCNewsBot/2.0)',
            CURLOPT_SSL_VERIFYPEER => false, CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTPHEADER => ['Accept: application/json'],
        ]);
        curl_multi_add_handle($mh, $ch);
        $curls[] = ['ch' => $ch, 'kind' => 'hn', 'source' => $hn['source'], 'min' => $hn['min'], 'finance' => $hn['finance']];
    }

    foreach ($MASTODON_SOURCES as $ms) {
        $ch = curl_init($ms['url']);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 10,
            CURLOPT_USERAGENT => 'Mozilla/5.0 (compatible; BVCNewsBot/2.0)',
            CURLOPT_SSL_VERIFYPEER => false, CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTPHEADER => ['Accept: application/json'],
        ]);
        curl_multi_add_handle($mh, $ch);
        $curls[] = ['ch' => $ch, 'kind' => 'mastodon', 'source' => $ms['source'], 'min_fav' => $ms['min_fav'], 'finance' => $ms['finance']];
    }

    foreach ($LEMMY_SOURCES as $lm) {
        $ch = curl_init($lm['url']);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 10,
            CURLOPT_USERAGENT => 'Mozilla/5.0 (compatible; BVCNewsBot/2.0)',
            CURLOPT_SSL_VERIFYPEER => false, CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTPHEADER => ['Accept: application/json'],
        ]);
        curl_multi_add_handle($mh, $ch);
        $curls[] = ['ch' => $ch, 'kind' => 'lemmy', 'source' => $lm['source'], 'min' => $lm['min'], 'finance' => $lm['finance']];
    }

    foreach ($LOBSTERS_SOURCES as $lb) {
        $ch = curl_init($lb['url']);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 10,
            CURLOPT_USERAGENT => 'Mozilla/5.0 (compatible; BVCNewsBot/2.0)',
            CURLOPT_SSL_VERIFYPEER => false, CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTPHEADER => ['Accept: application/json'],
        ]);
        curl_multi_add_handle($mh, $ch);
        $curls[] = ['ch' => $ch, 'kind' => 'lobsters', 'source' => $lb['source'], 'min' => $lb['min'], 'finance' => $lb['finance']];
    }

    $active = null; $deadline = microtime(true) + 11;
    do {
        curl_multi_exec($mh, $active);
        if ($active) curl_multi_select($mh, 0.05);
    } while ($active > 0 && microtime(true) < $deadline);

    // ── Collecte + scoring ───────────────────────────────────────────────────
    $articles = [];
    $seen     = [];

    $isBreaking = function(string $t) use ($BREAK_KW): bool {
        $t = strtolower($t);
        foreach ($BREAK_KW as $kw) { if (strpos($t, $kw) !== false) return true; }
        return false;
    };

    // Mots-clés sport — articles à exclure totalement
    $SPORT_KW = [
        'football','soccer','rugby','tennis','basketball','baseball','cricket','golf',
        'volleyball','swimming','cycling','athletics','boxing','wrestling','f1','formula 1',
        'formula one','motogp','nba','nfl','nhl','mlb','fifa','uefa','premier league',
        'champions league','serie a','bundesliga','ligue 1','la liga','copa','world cup',
        'super bowl','wimbledon','tour de france','olympics','olympic games','world cup',
        'match','tournament','championship','league table','transfer','footballer',
        'midfielder','goalkeeper','striker','winger','coach sacked','manager sacked',
        'hat-trick','penalty','offside','var','goal','goals scored','squad','fixtures',
        'kick off','kick-off','halftime','half-time','full time','full-time',
        'esports','e-sports','gaming tournament','cricket','ipl','test match',
        'grand slam','davis cup','french open','us open','australian open',
        ' fc ',' united ',' city fc',' rovers ',' wanderers ',' athletic ',
        'sport','sports news','sports update',
    ];
    $isSport = function(string $t) use ($SPORT_KW): bool {
        $t = strtolower($t);
        foreach ($SPORT_KW as $kw) { if (strpos($t, $kw) !== false) return true; }
        return false;
    };

    $recencyFactor = function(int $ts, float $decay) use ($nowTs): float {
        $h = max(0, ($nowTs - $ts) / 3600);
        return exp(-$decay * $h);
    };

    foreach ($curls as $item) {
        $body = curl_multi_getcontent($item['ch']);
        curl_multi_remove_handle($mh, $item['ch']);
        curl_close($item['ch']);
        if (!$body) continue;

        // ── Reddit JSON ──────────────────────────────────────────────────────
        if ($item['kind'] === 'reddit') {
            $j     = @json_decode($body, true);
            $posts = $j['data']['children'] ?? [];
            foreach ($posts as $post) {
                $d = $post['data'] ?? [];
                if ($d['stickied'] ?? false) continue;
                $score    = (int)($d['score']        ?? 0);
                $comments = (int)($d['num_comments'] ?? 0);
                $ratio    = (float)($d['upvote_ratio'] ?? 0);
                if ($score < $item['meta']['min']) continue;
                $ts = (int)($d['created_utc'] ?? 0);
                if (!$ts || $ts < $limit24h || $ts > $nowTs + 3600) continue;

                $title = html_entity_decode(trim($d['title'] ?? ''), ENT_QUOTES, 'UTF-8');
                if (!$title || mb_strlen($title, 'UTF-8') < 8) continue;
                if ($isSport($title)) continue;
                // Whitelist finance pour les subs généraux
                if (!($item['meta']['finance'] ?? false) && !$isFinanceRelevant($title)) continue;
                $key = mb_strtolower(mb_substr($title, 0, 55, 'UTF-8'), 'UTF-8');
                if (isset($seen[$key])) continue;
                $seen[$key] = true;

                $breaking   = $isBreaking($title);
                $rec        = $recencyFactor($ts, 0.04);
                $composite  = ($score + $comments * 3) * $rec + ($breaking ? 200000 : 0);

                // Lien : article externe si dispo, sinon thread Reddit
                $extUrl = trim($d['url'] ?? '');
                $link   = (filter_var($extUrl, FILTER_VALIDATE_URL) && strpos($extUrl, 'reddit.com') === false)
                    ? $extUrl
                    : 'https://www.reddit.com' . ($d['permalink'] ?? '');

                $articles[] = [
                    'title'       => $title,
                    'link'        => $link,
                    'source'      => $item['meta']['source'],
                    'date'        => date('c', $ts),
                    'score'       => $score,
                    'comments'    => $comments,
                    'upvote_ratio'=> (int)round($ratio * 100),
                    'is_breaking' => $breaking,
                    '_composite'  => $composite,
                ];
            }

        // ── Hacker News via Algolia ──────────────────────────────────────────
        } elseif ($item['kind'] === 'hn') {
            $j    = @json_decode($body, true);
            $hits = $j['hits'] ?? [];
            foreach ($hits as $hit) {
                $score    = (int)($hit['points']       ?? 0);
                $comments = (int)($hit['num_comments'] ?? 0);
                if ($score < $item['min']) continue;
                $ts = (int)($hit['created_at_i'] ?? 0);
                if (!$ts || $ts < $limit24h || $ts > $nowTs + 3600) continue;

                $title = html_entity_decode(trim($hit['title'] ?? ''), ENT_QUOTES, 'UTF-8');
                $link  = trim($hit['url'] ?? 'https://news.ycombinator.com/item?id=' . ($hit['objectID'] ?? ''));
                if (!$title || mb_strlen($title, 'UTF-8') < 8) continue;
                if ($isSport($title)) continue;
                // HN : garder uniquement les articles à impact économique/financier
                if (!($item['finance'] ?? false) && !$isFinanceRelevant($title)) continue;

                $key = mb_strtolower(mb_substr($title, 0, 55, 'UTF-8'), 'UTF-8');
                if (isset($seen[$key])) continue;
                $seen[$key] = true;

                $breaking  = $isBreaking($title);
                $rec       = $recencyFactor($ts, 0.05);
                $composite = ($score + $comments * 3) * $rec + ($breaking ? 200000 : 0);

                $articles[] = [
                    'title'       => $title,
                    'link'        => $link,
                    'source'      => $item['source'],
                    'date'        => date('c', $ts),
                    'score'       => $score,
                    'comments'    => $comments,
                    'upvote_ratio'=> 0,
                    'is_breaking' => $breaking,
                    '_composite'  => $composite,
                ];
            }

        // ── Mastodon trending ────────────────────────────────────────────────
        } elseif ($item['kind'] === 'mastodon') {
            $j = @json_decode($body, true);
            if (!is_array($j)) continue;
            foreach ($j as $status) {
                $favs     = (int)($status['favourites_count'] ?? 0);
                $reblogs  = (int)($status['reblogs_count']    ?? 0);
                $replies  = (int)($status['replies_count']    ?? 0);
                if ($favs < $item['min_fav']) continue;
                // Extraire le texte brut du HTML
                $html  = $status['content'] ?? '';
                $plain = html_entity_decode(strip_tags(preg_replace('/<br\s*\/?>/i', ' ', $html)), ENT_QUOTES, 'UTF-8');
                $plain = preg_replace('/\s+/', ' ', trim($plain));
                if (mb_strlen($plain, 'UTF-8') < 15) continue;
                // Utiliser les premiers 120 caractères comme titre
                $title = mb_substr($plain, 0, 120, 'UTF-8');
                if ($isSport($title)) continue;
                if (!($item['finance'] ?? false) && !$isFinanceRelevant($title)) continue;
                $link  = $status['url'] ?? '';
                $pub   = $status['created_at'] ?? '';
                $ts    = $pub ? @strtotime($pub) : 0;
                if (!$ts || $ts < $limit24h) continue;
                $key = mb_strtolower(mb_substr($title, 0, 55, 'UTF-8'), 'UTF-8');
                if (isset($seen[$key])) continue; $seen[$key] = true;
                $score     = $favs + $reblogs * 2;
                $breaking  = $isBreaking($title);
                $rec       = $recencyFactor($ts, 0.06);
                $composite = ($score + $replies * 3) * $rec + ($breaking ? 200000 : 0);
                $articles[] = [
                    'title' => $title, 'link' => $link, 'source' => $item['source'],
                    'date'  => $pub, 'score' => $score, 'comments' => $replies,
                    'upvote_ratio' => 0, 'is_breaking' => $breaking, '_composite' => $composite,
                ];
            }

        // ── Lemmy ────────────────────────────────────────────────────────────
        } elseif ($item['kind'] === 'lemmy') {
            $j = @json_decode($body, true);
            $posts = $j['posts'] ?? [];
            foreach ($posts as $post) {
                $score    = (int)($post['counts']['score']    ?? 0);
                $comments = (int)($post['counts']['comments'] ?? 0);
                if ($score < $item['min']) continue;
                $title = html_entity_decode(trim($post['post']['name'] ?? ''), ENT_QUOTES, 'UTF-8');
                $link  = trim($post['post']['url'] ?? $post['post']['ap_id'] ?? '');
                $pub   = $post['post']['published'] ?? '';
                if (!$title || mb_strlen($title, 'UTF-8') < 8) continue;
                if ($isSport($title)) continue;
                if (!($item['finance'] ?? false) && !$isFinanceRelevant($title)) continue;
                $ts = $pub ? @strtotime($pub) : 0;
                if (!$ts || $ts < $limit24h || $ts > $nowTs + 3600) continue;
                $key = mb_strtolower(mb_substr($title, 0, 55, 'UTF-8'), 'UTF-8');
                if (isset($seen[$key])) continue; $seen[$key] = true;
                $breaking  = $isBreaking($title);
                $rec       = $recencyFactor($ts, 0.05);
                $composite = ($score + $comments * 3) * $rec + ($breaking ? 200000 : 0);
                $articles[] = [
                    'title' => $title, 'link' => $link, 'source' => $item['source'],
                    'date'  => $pub, 'score' => $score, 'comments' => $comments,
                    'upvote_ratio' => 0, 'is_breaking' => $breaking, '_composite' => $composite,
                ];
            }

        // ── Lobste.rs ────────────────────────────────────────────────────────
        } elseif ($item['kind'] === 'lobsters') {
            $j = @json_decode($body, true);
            if (!is_array($j)) continue;
            foreach ($j as $story) {
                $score    = (int)($story['score']         ?? 0);
                $comments = (int)($story['comment_count'] ?? 0);
                if ($score < $item['min']) continue;
                $title = html_entity_decode(trim($story['title'] ?? ''), ENT_QUOTES, 'UTF-8');
                $link  = trim($story['url'] ?? 'https://lobste.rs/s/' . ($story['short_id'] ?? ''));
                $pub   = $story['created_at'] ?? '';
                if (!$title || mb_strlen($title, 'UTF-8') < 8) continue;
                if ($isSport($title)) continue;
                if (!($item['finance'] ?? false) && !$isFinanceRelevant($title)) continue;
                $ts = $pub ? @strtotime($pub) : 0;
                if (!$ts || $ts < $limit24h || $ts > $nowTs + 3600) continue;
                $key = mb_strtolower(mb_substr($title, 0, 55, 'UTF-8'), 'UTF-8');
                if (isset($seen[$key])) continue; $seen[$key] = true;
                $breaking  = $isBreaking($title);
                $rec       = $recencyFactor($ts, 0.05);
                $composite = ($score + $comments * 3) * $rec + ($breaking ? 200000 : 0);
                $articles[] = [
                    'title' => $title, 'link' => $link, 'source' => $item['source'],
                    'date'  => $pub, 'score' => $score, 'comments' => $comments,
                    'upvote_ratio' => 0, 'is_breaking' => $breaking, '_composite' => $composite,
                ];
            }

        // ── RSS ──────────────────────────────────────────────────────────────
        } else {
            $raw = preg_replace('/\s+xmlns[^=]*="[^"]*"/', '', $body);
            $raw = preg_replace('/<([a-zA-Z]+):[a-zA-Z]/', '<$1', $raw);
            $raw = preg_replace('/<\/[a-zA-Z]+:[a-zA-Z][^>]*>/', '</', $raw);
            libxml_use_internal_errors(true);
            $xml = @simplexml_load_string($raw);
            if (!$xml) continue;
            $items = $xml->channel->item ?? $xml->entry ?? [];
            $cnt = 0;
            foreach ($items as $xmlItem) {
                $title = html_entity_decode(trim((string)($xmlItem->title ?? '')), ENT_QUOTES, 'UTF-8');
                $link  = trim((string)($xmlItem->link ?? $xmlItem->id ?? ''));
                $pub   = trim((string)($xmlItem->pubDate ?? $xmlItem->published ?? $xmlItem->updated ?? ''));
                if (!$title || mb_strlen($title, 'UTF-8') < 8) continue;
                if ($isSport($title)) continue;   // ← exclure sport

                $ts = null;
                if ($pub) {
                    try { $dt = new DateTime($pub); $ts = $dt->getTimestamp(); }
                    catch (Exception $e) { $ts = @strtotime($pub) ?: null; }
                }
                if (!$ts || $ts < $limit24h || $ts > $nowTs + 3600) continue;

                $key = mb_strtolower(mb_substr($title, 0, 55, 'UTF-8'), 'UTF-8');
                if (isset($seen[$key])) continue;
                $seen[$key] = true;

                $breaking  = $isBreaking($title);
                $rec       = $recencyFactor($ts, 0.09);  // médias traditionnels vieillissent vite
                // Score de base élevé pour sources authorités
                $base      = $breaking ? 60000 : 9000;
                $composite = $base * $rec;

                $articles[] = [
                    'title'       => $title,
                    'link'        => $link,
                    'source'      => $item['source'],
                    'date'        => $pub ?: date('c', $ts),
                    'score'       => 0,
                    'comments'    => 0,
                    'upvote_ratio'=> 0,
                    'is_breaking' => $breaking,
                    '_composite'  => $composite,
                ];
                if (++$cnt >= 6) break; // max 6 par source RSS
            }
        }
    }
    curl_multi_close($mh);

    // ── Tri global par score composite ──────────────────────────────────────
    usort($articles, fn($a, $b) => $b['_composite'] <=> $a['_composite']);

    $out = array_slice(array_map(function($a) {
        unset($a['_composite']);
        return $a;
    }, $articles), 0, 40);

    echo json_encode([
        'success'  => true,
        'type'     => 'social',
        'count'    => count($out),
        'articles' => $out,
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

// ── Choix des feeds ────────────────────────────────────────────────────────────
$selectedFeeds  = $FEEDS[$type] ?? $FEEDS['bourse'];
$articles       = [];

// Scraping BourseNews marchés pour bourse et marches
if ($type === 'bourse' || $type === 'marches') {
    $articles = scrapeBourseNewsMarches($limit24h, $nowTs);
}

// ── Fetch parallèle RSS ────────────────────────────────────────────────────────
if (!empty($selectedFeeds)) {
    $mh  = curl_multi_init();
    $chs = [];
    foreach ($selectedFeeds as $i => $feed) {
        $ch = curl_init();
        curl_setopt_array($ch, [
            CURLOPT_URL            => $feed['url'],
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_TIMEOUT        => 8,
            CURLOPT_CONNECTTIMEOUT => 4,
            CURLOPT_USERAGENT      => 'Mozilla/5.0 (compatible; BVCNewsBot/2.0)',
            CURLOPT_ENCODING       => '',
        ]);
        curl_multi_add_handle($mh, $ch);
        $chs[$i] = $ch;
    }
    $running = null; $deadline = microtime(true) + 9;
    do { curl_multi_exec($mh, $running); if ($running) curl_multi_select($mh, 0.05); }
    while ($running > 0 && microtime(true) < $deadline);

    foreach ($chs as $i => $ch) {
        $raw = curl_multi_getcontent($ch);
        curl_multi_remove_handle($mh, $ch);
        curl_close($ch);
        if (!$raw) continue;
        $parsed   = parseRSSToArticles($raw, $selectedFeeds[$i], $limit24h, $nowTs);
        $articles = array_merge($articles, $parsed);
    }
    curl_multi_close($mh);
}

// ── Déduplication par titre ────────────────────────────────────────────────────
$seen = []; $dedup = [];
foreach ($articles as $a) {
    $key = mb_strtolower(mb_substr($a['title'], 0, 60, 'UTF-8'), 'UTF-8');
    if (!isset($seen[$key])) { $seen[$key] = true; $dedup[] = $a; }
}

// ── Tri : les plus récents d'abord ────────────────────────────────────────────
usort($dedup, function($a, $b) {
    $ta = $a['date'] ? @strtotime($a['date']) : 0;
    $tb = $b['date'] ? @strtotime($b['date']) : 0;
    return $tb - $ta;
});

echo json_encode([
    'success'  => true,
    'type'     => $type,
    'count'    => count($dedup),
    'articles' => array_slice($dedup, 0, 60),
], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
