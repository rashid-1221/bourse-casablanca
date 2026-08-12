<?php
// api/portfolio-dashboard.php — Dashboard portefeuille complet
// Retourne : KPIs globaux + detail par ligne + snapshot horodaté
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

const COMMISSION      = 0.0099;   // 0.99 % à l'achat ET à la vente
const TAXE_PLUS_VALUE = 0.15;     // 15 % sur les plus-values nettes

// ── Chargement du portefeuille ──────────────────────────────────────────────
$token = $_GET['token'] ?? '';
$stocks = [];

if ($token) {
    require_once __DIR__ . '/db.php';
    $db   = getDB();
    $user = getUserByToken($db, $token);
    if ($user) {
        $stmt = $db->prepare("SELECT data FROM portfolios WHERE user_id = ?");
        $stmt->execute([(int)$user['id']]);
        $row = $stmt->fetch();
        if ($row) $stocks = json_decode($row['data'], true) ?: [];
    }
}

if (empty($stocks)) {
    $file = __DIR__ . '/portfolio_data.json';
    if (file_exists($file)) {
        $payload = json_decode(file_get_contents($file), true);
        $stocks  = (isset($payload['data'])) ? $payload['data'] : $payload;
    }
}

if (empty($stocks)) {
    echo json_encode(['success' => false, 'error' => 'Aucune donnée de portefeuille trouvée']);
    exit;
}

// ── Calculs par ligne ───────────────────────────────────────────────────────
function prixTotalHT($s)       { return $s['quantite'] * $s['prixAchat']; }
function commAchat($s)         { return prixTotalHT($s) * COMMISSION; }
function prixTotalTTC($s)      { return prixTotalHT($s) + commAchat($s); }
function prixVenteHT($s)       { return $s['quantite'] * $s['prixActuel']; }
function commVente($s)         { return prixVenteHT($s) * COMMISSION; }
function prixVenteTTC($s)      { return prixVenteHT($s) - commVente($s); }
function profitBrut($s)        { return prixVenteTTC($s) - prixTotalTTC($s); }
function taxe($s) {
    $pb = profitBrut($s);
    return $pb > 0 ? $pb * TAXE_PLUS_VALUE : 0;
}
function profitNet($s) {
    $pb = profitBrut($s);
    return $pb > 0 ? $pb - taxe($s) : $pb;
}
function pct($s) {
    $ttc = prixTotalTTC($s);
    return $ttc > 0 ? (profitNet($s) / $ttc) * 100 : 0;
}

// ── Agrégation par symbole (consolider plusieurs lignes du même titre) ───────
$bySymbol = [];
foreach ($stocks as $s) {
    $sym = $s['symbole'];
    if (!isset($bySymbol[$sym])) {
        $bySymbol[$sym] = [
            'symbole'    => $sym,
            'nom'        => $s['nom'] ?? $sym,
            'prixActuel' => (float)$s['prixActuel'],
            'lignes'     => [],
        ];
    }
    $bySymbol[$sym]['lignes'][] = $s;
    // Garder le prixActuel le plus récent (tous les lignes du même titre ont le même)
    $bySymbol[$sym]['prixActuel'] = (float)$s['prixActuel'];
}

// ── Calcul des métriques globales et par symbole ─────────────────────────────
$totalInvesti     = 0;
$totalValeurActu  = 0;
$totalProfitNet   = 0;
$gagnantes        = 0;
$perdantes        = 0;
$neutres          = 0;

$lignesDetail = [];   // Une ligne par transaction individuelle
$symbolsDetail = [];  // Une ligne par symbole (consolidé)

// ── Détail par LIGNE INDIVIDUELLE ───────────────────────────────────────────
foreach ($stocks as $s) {
    $investi     = prixTotalTTC($s);
    $valActu     = prixVenteTTC($s);
    $gainNet     = profitNet($s);
    $gainPct     = pct($s);
    $statut      = $gainNet > 0.01 ? 'gagnant' : ($gainNet < -0.01 ? 'perdant' : 'neutre');

    $totalInvesti    += $investi;
    $totalValeurActu += prixVenteHT($s);   // valeur brute actuelle
    $totalProfitNet  += $gainNet;

    if ($statut === 'gagnant')  $gagnantes++;
    elseif ($statut === 'perdant') $perdantes++;
    else $neutres++;

    $lignesDetail[] = [
        'id'          => $s['id']       ?? '',
        'symbole'     => $s['symbole'],
        'nom'         => $s['nom']      ?? $s['symbole'],
        'quantite'    => (int)$s['quantite'],
        'prixAchat'   => round((float)$s['prixAchat'], 2),
        'prixActuel'  => round((float)$s['prixActuel'], 2),
        'dateAjout'   => $s['dateAjout'] ?? '',
        'investi'     => round($investi, 2),
        'valActuelle' => round(prixVenteHT($s), 2),
        'gainNet'     => round($gainNet, 2),
        'gainPct'     => round($gainPct, 2),
        'statut'      => $statut,
        'commAchat'   => round(commAchat($s), 2),
        'commVente'   => round(commVente($s), 2),
        'taxe'        => round(taxe($s), 2),
    ];
}

// ── Consolidé par symbole ────────────────────────────────────────────────────
foreach ($bySymbol as $sym => $grp) {
    $lignes      = $grp['lignes'];
    $invTot      = array_sum(array_map('prixTotalTTC', $lignes));
    $gainTot     = array_sum(array_map('profitNet',    $lignes));
    $valActuTot  = array_sum(array_map('prixVenteHT',  $lignes));
    $qteTot      = array_sum(array_column($lignes, 'quantite'));
    $pctTot      = $invTot > 0 ? ($gainTot / $invTot) * 100 : 0;
    $statut      = $gainTot > 0.01 ? 'gagnant' : ($gainTot < -0.01 ? 'perdant' : 'neutre');
    $prixMoyenAchat = $qteTot > 0
        ? array_sum(array_map(fn($l) => $l['quantite'] * $l['prixAchat'], $lignes)) / $qteTot
        : 0;

    $symbolsDetail[] = [
        'symbole'        => $sym,
        'nom'            => $grp['nom'],
        'nbLignes'       => count($lignes),
        'quantite'       => $qteTot,
        'prixMoyenAchat' => round($prixMoyenAchat, 2),
        'prixActuel'     => round($grp['prixActuel'], 2),
        'investi'        => round($invTot, 2),
        'valActuelle'    => round($valActuTot, 2),
        'gainNet'        => round($gainTot, 2),
        'gainPct'        => round($pctTot, 2),
        'statut'         => $statut,
    ];
}

// Trier : gagnants d'abord, puis par gain décroissant
usort($symbolsDetail, fn($a,$b) => $b['gainNet'] <=> $a['gainNet']);
usort($lignesDetail,  fn($a,$b) => $b['gainNet'] <=> $a['gainNet']);

// ── Performance globale ──────────────────────────────────────────────────────
$perfGlobale = $totalInvesti > 0 ? ($totalProfitNet / $totalInvesti) * 100 : 0;
$now = new DateTime('now', new DateTimeZone('Africa/Casablanca'));

echo json_encode([
    'success'       => true,
    'generatedAt'   => $now->format('d/m/Y à H:i'),
    'generatedTs'   => $now->getTimestamp(),
    'kpis' => [
        'totalInvesti'    => round($totalInvesti, 2),
        'valeurActuelle'  => round($totalValeurActu, 2),
        'profitNet'       => round($totalProfitNet, 2),
        'performance'     => round($perfGlobale, 2),
        'nbTransactions'  => count($stocks),
        'nbSymboles'      => count($bySymbol),
        'gagnantes'       => $gagnantes,
        'perdantes'       => $perdantes,
        'neutres'         => $neutres,
        'tauxReussite'    => count($stocks) > 0 ? round($gagnantes / count($stocks) * 100, 1) : 0,
    ],
    'symbols'       => $symbolsDetail,
    'lignes'        => $lignesDetail,
], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
