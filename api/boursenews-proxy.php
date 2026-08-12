<?php
// api/boursenews-proxy.php
// Scrape boursenews.ma/articles/marches — retourne uniquement les articles de la dernière date

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

$cacheDir  = __DIR__ . '/cache';
if (!is_dir($cacheDir)) @mkdir($cacheDir, 0755, true);
$cacheFile = $cacheDir . '/boursenews_marches.json';
$cacheTTL  = isset($_GET['force']) ? 0 : 600; // 10 min

if ($cacheTTL > 0 && file_exists($cacheFile) && (time() - filemtime($cacheFile)) < $cacheTTL) {
    echo file_get_contents($cacheFile);
    exit;
}

$url = 'https://boursenews.ma/articles/marches';

// cURL — gère mieux SSL depuis MAMP Windows
$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL            => $url,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_SSL_VERIFYPEER => false,
    CURLOPT_SSL_VERIFYHOST => false,
    CURLOPT_TIMEOUT        => 12,
    CURLOPT_CONNECTTIMEOUT => 6,
    CURLOPT_USERAGENT      => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    CURLOPT_HTTPHEADER     => ['Accept: text/html','Accept-Language: fr-FR,fr;q=0.9'],
    CURLOPT_ENCODING       => '',
]);
$html = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlErr  = curl_error($ch);
curl_close($ch);

if (!$html || $httpCode < 200 || $httpCode >= 400) {
    echo json_encode(['success'=>false,'error'=>"HTTP $httpCode — $curlErr",'articles'=>[]]);
    exit;
}

// Mode debug : chercher les liens articles
if (isset($_GET['debug'])) {
    $pos = strpos($html, '/article/');
    $pos2 = strpos($html, 'article/marches');
    $pos3 = strpos($html, '<article');
    // Chercher liens href avec article
    preg_match_all('/href="([^"]*article[^"]*)"/', $html, $hrefMatches);
    // Chercher tous les liens <a href
    preg_match_all('/<a\s[^>]*href="([^"]+)"/', $html, $allLinks);
    $articleLinks = array_filter($allLinks[1], fn($l) => strpos($l,'marche')!==false || strpos($l,'article')!==false);
    echo json_encode([
        'html_length'=>strlen($html),
        'http'=>$httpCode,
        'pos_article'=>$pos,
        'pos_article_marches'=>$pos2,
        'pos_article_tag'=>$pos3,
        'href_with_article'=>array_slice($hrefMatches[1],0,10),
        'links_with_marche'=>array_values(array_slice($articleLinks,0,20)),
        'html_snippet_30000'=>substr($html,30000,2000),
    ]);
    exit;
}

// Supprimer les sauts de ligne pour faciliter le parsing
$html = preg_replace('/[\r\n\t]+/', ' ', $html);
$html = preg_replace('/  +/', ' ', $html);

// Extraire tous les liens d'articles /article/marches/
preg_match_all('/<a\s[^>]*href="(\/article\/marches\/[^"]+)"[^>]*>(.*?)<\/a>/is', $html, $matches, PREG_SET_ORDER);

$articles = [];
$moisFr = [
    'janvier'=>1,'février'=>2,'mars'=>3,'avril'=>4,'mai'=>5,'juin'=>6,
    'juillet'=>7,'août'=>8,'septembre'=>9,'octobre'=>10,'novembre'=>11,'décembre'=>12
];

foreach ($matches as $m) {
    $href    = 'https://boursenews.ma' . $m[1];
    $inner   = $m[2];

    // Structure réelle : <a href="...">TITRE <span>DATE - par </span></a>
    // Le titre est directement dans <a>, la date dans <span>

    // Extraire la date depuis <span> dans le contenu de <a>
    if (!preg_match('/(\d{1,2})\s+([A-Za-zÀ-ÿ]+)\s+(\d{4})/u', $inner, $dm)) continue;
    $jour  = (int)$dm[1];
    $moisS = mb_strtolower($dm[2], 'UTF-8');
    $annee = (int)$dm[3];
    $mois  = $moisFr[$moisS] ?? 0;
    if (!$mois) continue;

    $dateStr = sprintf('%04d-%02d-%02d', $annee, $mois, $jour);
    $dateTs  = mktime(0,0,0,$mois,$jour,$annee);

    // Extraire le titre : supprimer le <span> de date, puis strip_tags
    $titre = preg_replace('/<span[^>]*>.*?<\/span>/is', '', $inner);
    $titre = strip_tags($titre);
    $titre = html_entity_decode(trim($titre), ENT_QUOTES | ENT_HTML5, 'UTF-8');
    $titre = preg_replace('/\s+/', ' ', $titre);
    $titre = trim($titre);
    if (strlen($titre) < 8) continue;

    // Pas d'image dans le lien titre (image dans div frère) — laisser null
    $img = null;

    $articles[] = [
        'titre'    => $titre,
        'url'      => $href,
        'date'     => $dateStr,
        'date_ts'  => $dateTs,
        'date_fr'  => $dm[0],
        'img'      => $img,
        'source'   => 'boursenews.ma',
    ];
}

if (empty($articles)) {
    echo json_encode(['success' => false, 'error' => 'Aucun article trouvé', 'articles' => []]);
    exit;
}

// Dédupliquer par URL
$seen = [];
$articles = array_filter($articles, function($a) use (&$seen) {
    if (isset($seen[$a['url']])) return false;
    $seen[$a['url']] = true;
    return true;
});
$articles = array_values($articles);

// Trouver la date la plus récente
$maxTs = max(array_column($articles, 'date_ts'));

// Garder uniquement les articles de la dernière date
$latest = array_values(array_filter($articles, fn($a) => $a['date_ts'] === $maxTs));

// Exclure les "Feuilles de marché" et documents de données brutes (pas des articles)
$latest = array_values(array_filter($latest, function($a) {
    $t = mb_strtolower($a['titre'], 'UTF-8');
    return strpos($t, 'feuille')          === false
        && strpos($t, 'cours du march')   === false
        && strpos($t, 'bulletin de march')=== false
        && strpos($t, 'tableau de bord')  === false;
}));

$moisFrLong = [1=>'janvier',2=>'février',3=>'mars',4=>'avril',5=>'mai',6=>'juin',
               7=>'juillet',8=>'août',9=>'septembre',10=>'octobre',11=>'novembre',12=>'décembre'];
$datePubFr = date('j', $maxTs) . ' ' . $moisFrLong[(int)date('n', $maxTs)] . ' ' . date('Y', $maxTs);

$result = [
    'success'      => true,
    'date_pub'     => date('d/m/Y', $maxTs),
    'date_pub_fr'  => $datePubFr,
    'total'        => count($latest),
    'articles'     => $latest,
    'fetched_at'   => date('H:i', new DateTime('now', new DateTimeZone('Africa/Casablanca'))),
    'fetched_date' => date('d/m/Y', (new DateTime('now', new DateTimeZone('Africa/Casablanca')))->getTimestamp()),
];

$json = json_encode($result, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
file_put_contents($cacheFile, $json);
echo $json;
