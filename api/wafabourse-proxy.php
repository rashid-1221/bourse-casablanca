<?php
// api/wafabourse-proxy.php — Carnet d'ordres depuis Wafabourse
// Usage : ?ticker=ADH
// Retourne le même format JSON que bmce-detail-proxy.php (tab=cotation)
//   { success, achats:[{nombre,quantite,prix}], ventes:[{nombre,quantite,prix}],
//     cours_actuel, variation, jour:{...}, source }

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Cache-Control: no-cache, must-revalidate');

$ticker = isset($_GET['ticker']) ? strtoupper(trim($_GET['ticker'])) : '';
if (empty($ticker)) {
    echo json_encode(['success'=>false,'error'=>'Paramètre ticker manquant']); exit;
}

// ── Nettoyage d'un nombre (espaces insécables, virgule → point) ───────────────
function cleanWafa(string $s): float {
    $s = preg_replace('/[^\d,.\-]/', '', $s);
    $s = str_replace(',', '.', $s);
    return (float)$s;
}

// ── Fetch Wafabourse ──────────────────────────────────────────────────────────
$url = 'https://www.wafabourse.com/fr/instrument/actions/' . urlencode($ticker);

$ch = curl_init($url);
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER  => true,
    CURLOPT_FOLLOWLOCATION  => true,
    CURLOPT_SSL_VERIFYPEER  => false,
    CURLOPT_TIMEOUT         => 20,
    CURLOPT_CONNECTTIMEOUT  => 8,
    CURLOPT_USERAGENT       => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    CURLOPT_HTTPHEADER      => [
        'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language: fr-FR,fr;q=0.9',
        'Referer: https://www.wafabourse.com/',
    ],
    CURLOPT_ENCODING        => 'gzip, deflate',
]);
$html = curl_exec($ch);
$code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($code !== 200 || empty($html)) {
    echo json_encode(['success'=>false,'error'=>"Wafabourse inaccessible (HTTP $code)"]); exit;
}

// ── Extraire texte d'un nœud HTML ─────────────────────────────────────────────
function innerText(string $html): string {
    $t = preg_replace('/<[^>]+>/', '', $html);
    $t = html_entity_decode($t, ENT_QUOTES | ENT_HTML5, 'UTF-8');
    return trim(preg_replace('/\s+/', ' ', $t));
}

// ── 1. Extraire le carnet d'ordres ────────────────────────────────────────────
// Wafabourse structure : une seule table avec 6 colonnes
// Header : N° | Qté | Cours | Cours | Qté | N°
//          (achats)          (ventes)
// Colonne 0 = N° achat, 1 = Qté achat, 2 = Cours achat
// Colonne 3 = Cours vente, 4 = Qté vente, 5 = N° vente

$achats = [];
$ventes = [];

// Trouver la table du carnet (rechercher header N°|Qté|Cours|Cours|Qté|N°)
preg_match_all('/<table[^>]*>(.*?)<\/table>/is', $html, $tableMatches);

foreach ($tableMatches[1] as $tableContent) {
    // Vérifier que c'est la table du carnet : doit avoir 2 colonnes "Cours"
    $headerText = '';
    preg_match('/<thead[^>]*>(.*?)<\/thead>/is', $tableContent, $theadM);
    if (!empty($theadM[1])) {
        $headerText = strtoupper(innerText($theadM[1]));
    }
    // La table du carnet contient "N" + "QTÉ" + "COURS" (x2)
    if (substr_count($headerText, 'COURS') < 2 && substr_count($headerText, 'N°') < 2) continue;

    // Extraire les lignes
    preg_match('/<tbody[^>]*>(.*?)<\/tbody>/is', $tableContent, $tbodyM);
    $tbody = $tbodyM[1] ?? $tableContent;

    preg_match_all('/<tr[^>]*>(.*?)<\/tr>/is', $tbody, $rowMatches);

    foreach ($rowMatches[1] as $rowHtml) {
        preg_match_all('/<td[^>]*>(.*?)<\/td>/is', $rowHtml, $cellMatches);
        $cells = array_map('innerText', $cellMatches[1]);

        if (count($cells) < 6) continue;

        // Achat : col[0]=N°, col[1]=Qté, col[2]=Cours
        $nombreAchat = cleanWafa($cells[0]);
        $qteAchat    = cleanWafa($cells[1]);
        $coursAchat  = cleanWafa($cells[2]);
        if ($coursAchat > 0 && $qteAchat > 0) {
            $achats[] = [
                'nombre'   => $nombreAchat > 0 ? intval($nombreAchat) : null,
                'quantite' => intval($qteAchat),
                'prix'     => round($coursAchat, 2),
            ];
        }

        // Vente : col[3]=Cours, col[4]=Qté, col[5]=N°
        $coursVente  = cleanWafa($cells[3]);
        $qteVente    = cleanWafa($cells[4]);
        $nombreVente = cleanWafa($cells[5]);
        if ($coursVente > 0 && $qteVente > 0) {
            $ventes[] = [
                'nombre'   => $nombreVente > 0 ? intval($nombreVente) : null,
                'quantite' => intval($qteVente),
                'prix'     => round($coursVente, 2),
            ];
        }
    }
    if (!empty($achats) || !empty($ventes)) break;
}

// ── 2. Extraire Résumé de séance (cours actuel, variation, etc.) ──────────────
$coursActuel = null;
$variation   = null;
$ouverture   = null;
$hautJour    = null;
$basJour     = null;
$volume      = null;
$quantite    = null;
$cmp         = null;

// Les données du résumé sont dans des <td> ou <div> avec labels : Cours, Variation (%), etc.
// Pattern : label dans une cellule, valeur dans la cellule suivante
// Format Wafabourse : <tr><td>Label</td><td>Valeur</td></tr>
preg_match_all('/<tr[^>]*>\s*<td[^>]*>(.*?)<\/td>\s*<td[^>]*>(.*?)<\/td>/is', $html, $trMatches);
foreach ($trMatches[1] as $i => $labelHtml) {
    $label = strtoupper(trim(innerText($labelHtml)));
    $val   = innerText($trMatches[2][$i]);
    // Nettoyer la valeur (enlever %, +, espaces)
    $numVal = cleanWafa(preg_replace('/[^0-9,.\-]/', '', str_replace(['%','+'], '', $val)));

    if ($label === 'COURS' && $coursActuel === null && $numVal > 0) {
        $coursActuel = $numVal;
    } elseif (strpos($label, 'VARIATION') !== false && $variation === null) {
        // Garder le signe de la variation
        $signedVal = trim(preg_replace('/[^0-9,.\-+]/', '', str_replace('%', '', $val)));
        $variation = cleanWafa($signedVal);
        if (strpos($val, '-') !== false && $variation > 0) $variation = -$variation;
    } elseif ($label === 'OUVERTURE' && $ouverture === null) {
        $ouverture = $numVal;
    } elseif ($label === '+HAUT' && $hautJour === null) {
        $hautJour = $numVal;
    } elseif ($label === '+BAS' && $basJour === null) {
        $basJour = $numVal;
    } elseif ($label === 'VOLUME' && $volume === null) {
        $volume = $numVal;
    } elseif (($label === 'QTÉ' || $label === 'QTE') && $quantite === null) {
        $quantite = $numVal;
    } elseif ($label === 'CMP' && $cmp === null) {
        $cmp = $numVal;
    }
}

// ── 3. Réponse ────────────────────────────────────────────────────────────────
echo json_encode([
    'success'       => true,
    'ticker'        => $ticker,
    'cours_actuel'  => $coursActuel,
    'variation'     => $variation,
    'achats'        => $achats,
    'ventes'        => $ventes,
    'jour'          => [
        'ouverture_jour' => $ouverture,
        'haut_jour'      => $hautJour,
        'bas_jour'       => $basJour,
        'volume_jour'    => $volume,
        'quantite_jour'  => $quantite,
        'cmp'            => $cmp,
    ],
    'source'        => 'wafabourse.com',
    'url'           => $url,
    'timestamp'     => time(),
], JSON_UNESCAPED_UNICODE);
