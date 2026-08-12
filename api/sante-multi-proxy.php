<?php
// api/sante-multi-proxy.php — Santé Financière multi-sources v2 (cache + timeouts réduits)
// Sources parallèles :
//   A. BMCE Capital Bourse   — scraping fiche valeur (cours, PER, P/B, capi, dividende, flottant)
//   B. Yahoo Finance v8/chart — cours temps réel, 52s high/low, volume
//   C. Yahoo Finance v10/quoteSummary — fondamentaux complets (PER fwd, ROE, ROA, marges, dette, cash, analystes)

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Cache-Control: no-cache, must-revalidate');

$symbole  = isset($_GET['symbole'])   ? strtoupper(trim($_GET['symbole']))   : '';
$bmceCode = isset($_GET['bmce_code']) ? trim($_GET['bmce_code'])             : '';

if (empty($symbole)) {
    echo json_encode(['success'=>false,'error'=>'Paramètre symbole manquant']); exit;
}

// ══════════════════════════════════════════════════════════════════════════════
//  CACHE FICHIER — retour immédiat si données fraîches
// ══════════════════════════════════════════════════════════════════════════════
$cacheDir  = sys_get_temp_dir() . '/bvc_sante_cache';
if (!is_dir($cacheDir)) @mkdir($cacheDir, 0755, true);

// Le nom du cache inclut la date de modification du fichier PHP :
// si le fichier PHP change (nouvelles données statiques), l'ancien cache est ignoré automatiquement.
$phpVersion = substr(md5((string)filemtime(__FILE__)), 0, 8);
$cacheFile  = $cacheDir . '/sante_' . preg_replace('/[^A-Z0-9]/', '', $symbole) . '_' . $phpVersion . '.json';

// Nettoyer les anciens caches de ce symbole (versions précédentes)
foreach (glob($cacheDir . '/sante_' . preg_replace('/[^A-Z0-9]/', '', $symbole) . '_*.json') as $old) {
    if ($old !== $cacheFile) @unlink($old);
}

// Vider le cache si ?nocache=1 ou ?refresh=1
$noCache = !empty($_GET['nocache']) || !empty($_GET['refresh']);
if ($noCache && file_exists($cacheFile)) @unlink($cacheFile);

// TTL : 10 min en séance (lun–ven 09:30–15:30 heure Maroc), 60 min sinon
$heure = (int)gmdate('H') + 1; // UTC+1 Maroc
$jour  = (int)gmdate('N');    // 1=lun … 7=dim
$enSeance = ($jour >= 1 && $jour <= 5 && $heure >= 9 && ($heure < 15 || ($heure === 15 && (int)gmdate('i') <= 30)));
$cacheTTL  = $enSeance ? 600 : 3600; // 10 min en séance, 1h hors séance

if (!$noCache && file_exists($cacheFile)) {
    $age = time() - filemtime($cacheFile);
    if ($age < $cacheTTL) {
        $cached = file_get_contents($cacheFile);
        if ($cached) {
            $data = json_decode($cached, true);
            if ($data && ($data['success'] ?? false)) {
                $data['from_cache'] = true;
                $data['cache_age_s'] = $age;
                echo json_encode($data, JSON_UNESCAPED_UNICODE);
                exit;
            }
        }
    }
}

function cleanNum($s): ?float {
    if (is_float($s) || is_int($s)) return (float)$s;
    $s = str_replace([' ', "\xc2\xa0", '&nbsp;', "\u{00A0}"], '', (string)$s);
    $s = str_replace(',', '.', $s);
    $s = preg_replace('/[^0-9.\-]/', '', trim($s));
    return is_numeric($s) ? round((float)$s, 6) : null;
}
function cellText(string $html): string {
    return trim(preg_replace('/\s+/', ' ', strip_tags($html)));
}
function fmtBig(?float $v): ?string {
    if ($v === null) return null;
    if (abs($v) >= 1e9)  return round($v/1e9, 2) . ' Mds';
    if (abs($v) >= 1e6)  return round($v/1e6, 2) . ' M';
    if (abs($v) >= 1e3)  return round($v/1e3, 1) . ' K';
    return (string)round($v, 2);
}

// ══════════════════════════════════════════════════════════════════════════════
//  DONNÉES VÉRIFIÉES (rapports officiels BVC — override si Yahoo incomplet)
//  Dernière mise à jour : mars 2026 — sources : rapports annuels 2023/2024 +
//  communiqués T4 2025 + semestriels S1 2025 publiés sur BVC
// ══════════════════════════════════════════════════════════════════════════════
$STATIC_FUNDAMENTALS = [

    // ─────────────────────────────────────────────────────────────────────────
    'ADH' => [
        'nom'    => 'Groupe Addoha',
        'source' => 'CP annuel T4 2025 (mars 2026) — boursenews.ma / financialafrik.com',
        'note'   => 'CA 2025 sous nouveau référentiel comptable CGNC. '
                  . 'Sous l\'ancienne méthode le CA 2025 = 3 500 MMAD (+36%). '
                  . 'RNPG 2025 = 499 MMAD (+64% vs 304 MMAD en 2024). Dépasse 500 MMAD pour la 1ère fois.',
        'historique' => [
            ['annee'=>2023, 'ca'=>2134,  'rnpg'=>174.7, 'endettement_net'=>4300, 'gearing'=>30.0],
            ['annee'=>2024, 'ca'=>2595,  'rnpg'=>304.0, 'endettement_net'=>4100, 'gearing'=>28.8],
            ['annee'=>2025, 'ca'=>2709,  'rnpg'=>499.0, 'endettement_net'=>4100, 'gearing'=>30.0,
             's1_ca'=>1297, 's1_rnpg'=>280.0,
             'notes'=>'CA 2025 = 2 709 MMAD (nouveau réf.). RNPG = 499 MMAD (+64%). Marge brute = 730 MMAD (27%).'],
        ],
        'revenue'       => 2595e6,   // CA 2024 en MAD
        'profit_margin' => 11.71,    // RNPG 304 / CA 2595 ≈ 11.71%
        'total_debt'    => 4100e6,   // Endettement net 2024
    ],

    // ─────────────────────────────────────────────────────────────────────────
    'AKT' => [
        'nom'    => 'Groupe Akdital',
        'source' => 'CP T4 2025 (2026) — boursenews.ma / medias24.com',
        'note'   => 'Comptes consolidés. CA 2025 = 4 413 MMAD (+49%). '
                  . 'RNPG 2025 = 444 MMAD (+42%). EBITDA = 1 214 MMAD (+45%). '
                  . 'Endettement net en forte hausse liée au déploiement international (Dubaï, Riyad, Tunisie).',
        'historique' => [
            ['annee'=>2023, 'ca'=>1907,  'rnpg'=>174.7, 'endettement_net'=>null],
            ['annee'=>2024, 'ca'=>2954,  'rnpg'=>314.6, 'endettement_net'=>1753],
            ['annee'=>2025, 'ca'=>4413,  'rnpg'=>444.0, 'endettement_net'=>4246,
             'notes'=>'CA 2025 = 4 413 MMAD (+49%). RNPG = 444 MMAD (+42%). EBITDA = 1 214 MMAD (+45%).'],
        ],
        'revenue'       => 2954e6,   // CA 2024 en MAD
        'profit_margin' => 10.65,    // RNPG 314.6 / CA 2954 ≈ 10.65%
        'total_debt'    => 1753e6,   // Endettement net 2024
    ],

    // ─────────────────────────────────────────────────────────────────────────
    'ADI' => [
        'nom'    => 'Groupe Alliances Développement Immobilier',
        'source' => 'CP S1 2025 (AMMC) + CP T4 2025',
        'note'   => 'Comptes consolidés IFRS. S1 2025 : RNPG = 216 MMAD (+30%), CA = 1 333 MMAD (+10%). '
                  . 'Résultats annuels 2025 complets non encore publiés (PDFs scannés). '
                  . 'EN S1 2025 = 939 MMAD (-32% vs 1 376 MMAD au S1 2024).',
        'historique' => [
            ['annee'=>2023, 'ca'=>2017,  'rnpg'=>238.9, 'endettement_net'=>null],
            ['annee'=>2024, 'ca'=>2363,  'rnpg'=>301.9, 'endettement_net'=>1713],
            ['annee'=>2025, 'ca'=>2432,  'rnpg'=>null,  'endettement_net'=>939,
             's1_ca'=>1333, 's1_rnpg'=>216.0,
             'notes'=>'S1 2025 : RNPG = 216 MMAD (+30%), CA = 1 333 MMAD. EN = 939 MMAD (-32%). Annuel non encore publié.'],
        ],
        'revenue'       => 2363e6,   // CA 2024 en MAD (comptes consolidés)
        'profit_margin' => 12.77,    // RNPG 301.9 / CA 2363 ≈ 12.77%
        'total_debt'    => 1713e6,   // Endettement net 2024
    ],

    // ─────────────────────────────────────────────────────────────────────────
    'COL' => [
        'nom'    => 'Colorado',
        'source' => 'Résultats annuels 2025 (CP officiel)',
        'note'   => 'Société de peintures et revêtements. '
                  . 'CA 2025 = 624 MDH (+3,1% vs 2024). '
                  . 'Résultat d\'Exploitation 2025 = 112 MDH (+20,3% vs 2024). '
                  . 'Résultat Net 2025 = 65,5 MDH (+44,4% vs 2024). '
                  . 'Endettement quasi nul.',
        'historique' => [
            ['annee'=>2023, 'ca'=>null,  'rnpg'=>null, 'endettement_net'=>null,
             'notes'=>'Données annuelles 2023 non disponibles.'],
            ['annee'=>2024, 'ca'=>null,  'rnpg'=>45.3, 'endettement_net'=>7,
             'notes'=>'RN 2024 = 45,3 MDH (extrait bilan S1 2025). CA annuel 2024 non disponible.'],
            ['annee'=>2025, 'ca'=>624,   'rnpg'=>65.5, 'endettement_net'=>7,
             'rex'=>112,
             'notes'=>'CA 2025 = 624 MDH (+3,1%). Rex = 112 MDH (+20,3%). RN 2025 = 65,5 MDH (+44,4%).'],
        ],
        'revenue'       => 624e6,        // CA 2025 en MAD
        'profit_margin' => 10.50,        // RN 65.5 / CA 624 ≈ 10.50%
        'total_debt'    => 7e6,          // Dettes de financement quasi nulles
    ],

    // ─────────────────────────────────────────────────────────────────────────
    'CSR' => [
        'nom'    => 'Cosumar',
        'source' => 'CP RFA 2024 (IFRS) + CP T4 2025 + Semestriel S1 2025',
        'note'   => 'Comptes IFRS consolidés. RNPG 2024 baisse vs 2023 '
                  . '(hausse des charges exceptionnelles et IS). '
                  . 'Endettement net 2025 = 206 MMAD en forte amélioration.',
        'historique' => [
            ['annee'=>2023, 'ca'=>10233, 'rnpg'=>1009.2, 'endettement_net'=>556],
            ['annee'=>2024, 'ca'=>10239, 'rnpg'=>850.4,  'endettement_net'=>556],
            ['annee'=>2025, 'ca'=>10487, 'rnpg'=>704.0,  'endettement_net'=>206,
             's1_ca'=>null, 's1_rnpg'=>387.4,
             'notes'=>'CA 2025 = 10 487 MMAD (+2,4%). RNPG = 704 MMAD (-17%) impacté redressement fiscal. EN = 206 MMAD.'],
        ],
        'revenue'       => 10239e6,  // CA 2024 en MAD
        'profit_margin' => 8.31,     // RNPG 850.4 / CA 10239 ≈ 8.31%
        'total_debt'    => 556e6,    // Endettement net 2024
    ],

    // ─────────────────────────────────────────────────────────────────────────
    'DHO' => [
        'nom'    => 'Delta Holding',
        'source' => 'Avis AGO 2024 (mai 2025) + CP T4 2025',
        'note'   => 'Comptes consolidés normes marocaines. RNPG 2024 en hausse de 56% '
                  . 'grâce à plus-value de cession ISOSIGN. '
                  . 'Endettement net négatif = trésorerie nette positive.',
        'historique' => [
            ['annee'=>2023, 'ca'=>3133, 'rnpg'=>188.9, 'endettement_net'=>-234,
             'notes'=>'Endettement net négatif = trésorerie nette de 234 MMAD.'],
            ['annee'=>2024, 'ca'=>3138, 'rnpg'=>295.4, 'endettement_net'=>-234,
             'notes'=>'RNPG inclut plus-value cession ISOSIGN. EN consolidé amélioré de 327%.'],
            ['annee'=>2025, 'ca'=>3054, 'rnpg'=>307.0, 'endettement_net'=>-446,
             'notes'=>'CA 2025 = 3 054 MMAD (-2,7%). RNPG = 307 MMAD (+4%). REX = 454 MMAD (+15%). Trésorerie nette = 446 MMAD.'],
        ],
        'revenue'       => 3138e6,   // CA 2024 en MAD
        'profit_margin' => 9.41,     // RNPG 295.4 / CA 3138 ≈ 9.41%
        'total_debt'    => -234e6,   // Endettement net 2024 (négatif = trésorerie nette)
    ],

    // ─────────────────────────────────────────────────────────────────────────
    'ENK' => [
        'nom'    => 'Ennakl Automobiles',
        'source' => 'Rapport financier 2023 (IFRS, individuel)',
        'note'   => 'Société tunisienne cotée à la Bourse de Tunis. '
                  . 'Chiffres en DINAR TUNISIEN (TND). '
                  . 'PDFs 2024 et S1 2025 sont en format image — non extractibles. '
                  . 'Taux de change indicatif : 1 TND ≈ 0,33 MAD (mars 2026).',
        'historique' => [
            ['annee'=>2023, 'ca'=>645.5, 'rnpg'=>35.5, 'endettement_net'=>null,
             'devise'=>'TND', 'notes'=>'Comptes individuels IFRS en TND. CA inclut ventes véhicules neufs = 606.6 MTND.'],
            ['annee'=>2024, 'ca'=>null,  'rnpg'=>null,  'endettement_net'=>null,
             'notes'=>'PDF 2024 scanné — données non disponibles.'],
            ['annee'=>2025, 'ca'=>null,  'rnpg'=>null,  'endettement_net'=>null,
             'notes'=>'PDFs S1 2025 et T4 2025 scannés — données non disponibles.'],
        ],
        'revenue'       => null,   // Données TND non converties en MAD
        'profit_margin' => 5.5,    // RN 35.5 / CA 645.5 TND ≈ 5.5%
        'total_debt'    => null,
    ],

    // ─────────────────────────────────────────────────────────────────────────
    'IAM' => [
        'nom'    => 'Maroc Telecom',
        'source' => 'RFA 2024 (IFRS) + CP résultats 31 déc. 2025',
        'note'   => 'Comptes IFRS consolidés en MAD. '
                  . 'RNPG 2025 = 6 969 MMAD (inclut recettes exceptionnelles accord Wana/dégroupage) ; '
                  . 'RNPG ajusté 2025 = 5 649 MMAD. '
                  . 'RNPG 2024 = 1 801 MMAD (rapport) / 6 132 MMAD ajusté (hors exceptionnel). '
                  . 'Dette nette 2025 = 0,9x EBITDA.',
        'historique' => [
            ['annee'=>2023, 'ca'=>36786, 'rnpg'=>5283,  'endettement_net'=>16367],
            ['annee'=>2024, 'ca'=>36699, 'rnpg'=>1801,  'endettement_net'=>22436,
             'rnpg_ajuste'=>6132, 'notes'=>'RNPG rapporté 1 801 MMAD (impacté par éléments exceptionnels). RNPG ajusté = 6 132 MMAD.'],
            ['annee'=>2025, 'ca'=>36681, 'rnpg'=>6969,  'endettement_net'=>17610,
             'rnpg_ajuste'=>5649, 'notes'=>'RNPG inclut recettes accord Wana (dégroupage). Dividende proposé : 4,00 MAD/action = 3,5 Mds MAD.'],
        ],
        'revenue'       => 36699e6,  // CA 2024 en MAD
        'profit_margin' => 16.74,    // RNPG ajusté 6132 / CA 36699 ≈ 16.74%
        'total_debt'    => 22436e6,  // Dette nette 2024
    ],

    // ─────────────────────────────────────────────────────────────────────────
    'RDS' => [
        'nom'    => 'Résidences Dar Saada',
        'source' => 'Communication financière annuelle 2023 (texte extractible) + CP RFA 2024/S1 2025/T4 2025 (scannés)',
        'note'   => 'Comptes IFRS consolidés. Stratégie 2023 axée sur le déstockage produits finis. '
                  . 'CA 2022 = 543 MMAD → CA 2023 = 421 MMAD (-22%) suite au déstockage. '
                  . 'Endettement net 2023 = 1 749 MMAD (y compris IFRS 16, gearing 32%). '
                  . 'Données 2024 et 2025 non disponibles (PDFs scannés).',
        'historique' => [
            ['annee'=>2022, 'ca'=>543,  'rnpg'=>-61.5, 'endettement_net'=>1855,  'gearing'=>null,
             'notes'=>'Données comparatif 2022 extraites du rapport 2023.'],
            ['annee'=>2023, 'ca'=>421,  'rnpg'=>-67.1, 'endettement_net'=>1749,  'gearing'=>32.0,
             'notes'=>'CA 421 MMAD (-22%). RNPG -67 MMAD (perte). EN net 1 749 MMAD y compris IFRS 16. Gearing = 32%.'],
            ['annee'=>2024, 'ca'=>null, 'rnpg'=>null,  'endettement_net'=>null,
             'notes'=>'PDF 2024 scanné — données non disponibles.'],
            ['annee'=>2025, 'ca'=>null, 'rnpg'=>null,  'endettement_net'=>null,
             'notes'=>'PDFs S1 et T4 2025 scannés — données non disponibles.'],
        ],
        'revenue'       => null,          // CA 2024 non disponible
        'profit_margin' => null,
        'total_debt'    => 1749e6,        // Endettement net 2023 (IFRS 16 inclus)
    ],

    // ─────────────────────────────────────────────────────────────────────────
    'RIS' => [
        'nom'    => 'Risma',
        'source' => 'CP RFA 2024 (IFRS) + CP RFA 2023 + Semestriel S1 2025',
        'note'   => 'Comptes IFRS consolidés. '
                  . 'RNPG 2023 = 244 MMAD incluait la cession d\'AGM et impôts différés. '
                  . 'RNPG récurrent 2023 = 138 MMAD. '
                  . 'Dette nette 2025 = 1 184 MMAD (30 juin 2025).',
        'historique' => [
            ['annee'=>2023, 'ca'=>1175, 'rnpg'=>244.1, 'endettement_net'=>1675,
             'rnpg_courant'=>138.0, 'notes'=>'RNPG inclut cession AGM + impôts différés. RNPG récurrent = 138 MMAD.'],
            ['annee'=>2024, 'ca'=>1264, 'rnpg'=>183.0, 'endettement_net'=>1086],
            ['annee'=>2025, 'ca'=>1634, 'rnpg'=>270.0, 'endettement_net'=>1968,
             's1_ca'=>653, 's1_rnpg'=>117.0,
             'notes'=>'CA 2025 = 1 634 MMAD (+29%). RNPG = 270 MMAD (+48%). EBE = 631 MMAD (+37%). TO moyen = 64%.'],
        ],
        'revenue'       => 1264e6,   // CA 2024 en MAD
        'profit_margin' => 14.48,    // RNPG 183 / CA 1264 ≈ 14.48%
        'total_debt'    => 1086e6,   // Dette nette 2024
    ],

    // ─────────────────────────────────────────────────────────────────────────
    'SGM' => [
        'nom'    => 'SGTM (Société Générale des Travaux du Maroc)',
        'source' => 'CP T4 2025 + Indicateurs annuels 31 déc. 2025',
        'note'   => 'Introduction en Bourse réussie en déc. 2025 (4,8 Mds MAD levés). '
                  . 'Résultats 2024 extraits de la comparaison publiée dans le CP 2025. '
                  . 'Endettement net 2024 = 156,1 + 675,9 = 832 MMAD (calculé à partir '
                  . 'de la baisse de 675,9 MMAD annoncée). Résultats 2025 non audités.',
        'historique' => [
            ['annee'=>2024, 'ca'=>11099, 'rnpg'=>590, 'endettement_net'=>832,
             'notes'=>'Données 2024 extraites du comparatif CP 2025. EBITDA 2024 = 1 890 MMAD.'],
            ['annee'=>2025, 'ca'=>15165, 'rnpg'=>1342, 'endettement_net'=>156,
             'notes'=>'CA +36,6%. EBITDA = 2 489 MMAD (+31,7%). Carnet commandes = 35,1 Mds MAD (+113%). Dividende : 12 MAD/action.'],
        ],
        'revenue'       => 11099e6,  // CA 2024 en MAD
        'profit_margin' => 5.32,     // RNPG 590 / CA 11099 ≈ 5.32%
        'total_debt'    => 832e6,    // Endettement net 2024 (calculé)
    ],

    // ─────────────────────────────────────────────────────────────────────────
    'SNA' => [
        'nom'    => 'Stokvis Nord Afrique (SNA)',
        'source' => 'CP RFA 2024 + CP T4 2025',
        'note'   => 'CP RFA 2024 PDF image (non extractible). '
                  . 'Données 2024 extraites du CP T4 2025 (CA 2024 = 334 MMAD, '
                  . 'endettement financier 2024 = 269 MMAD). '
                  . 'CA 2025 = 219 MMAD (-34%) suite à glissement opérationnel '
                  . '(commandes majeures en cours de facturation). '
                  . 'Rapport 2023 PDF scanné (non extractible).',
        'historique' => [
            ['annee'=>2023, 'ca'=>null, 'rnpg'=>null, 'endettement_net'=>null,
             'notes'=>'PDF 2023 scanné — données non disponibles.'],
            ['annee'=>2024, 'ca'=>334,  'rnpg'=>null, 'endettement_net'=>269,
             'notes'=>'CA 2024 = 334 MMAD. Endettement financier = 269 MMAD. PDF image — RNPG non disponible.'],
            ['annee'=>2025, 'ca'=>219,  'rnpg'=>null, 'endettement_net'=>167,
             'notes'=>'CA 2025 = 219 MMAD (-34%) — glissement opérationnel. Endettement = 167 MMAD (-38%).'],
        ],
        'revenue'       => 334e6,    // CA 2024 en MAD
        'profit_margin' => null,
        'total_debt'    => 269e6,    // Endettement financier 2024
    ],

    // ─────────────────────────────────────────────────────────────────────────
    'SDP' => [
        'nom'    => 'Marsa Maroc (SODEP)',
        'source' => 'CP RFA 2024 + CP RFA 2023 + Communication annuelle 31 déc. 2025',
        'note'   => 'Comptes consolidés normes marocaines. '
                  . 'Résultats 2025 présentés le 17 mars 2026 par le CA. '
                  . 'Programme investissement 2025-2030 : 21 Mds MAD. '
                  . 'Dividende 2025 proposé : 11 MAD/action (+16%).',
        'historique' => [
            ['annee'=>2023, 'ca'=>4320,  'rnpg'=>852.2,  'endettement_net'=>null,
             'notes'=>'CA 2023 = 4 320 MMAD. RNPG = 852 MMAD. Dettes financement = 2 032 MMAD.'],
            ['annee'=>2024, 'ca'=>5008,  'rnpg'=>1267.0, 'endettement_net'=>null,
             'notes'=>'CA 2024 = 5 008 MMAD (+16%). RNPG = 1 267 MMAD (+49%). Dettes financement = 1 598 MMAD.'],
            ['annee'=>2025, 'ca'=>5785,  'rnpg'=>1589.0, 'endettement_net'=>null,
             'notes'=>'CA 2025 = 5 785 MMAD (+16%). RNPG = 1 589 MMAD (+25%). EBE = 3 192 MMAD (+22%).'],
        ],
        'revenue'       => 5008e6,   // CA 2024 en MAD
        'profit_margin' => 25.30,    // RNPG 1267 / CA 5008 ≈ 25.30%
        'total_debt'    => 1598e6,   // Dettes de financement 2024
    ],

    // ─────────────────────────────────────────────────────────────────────────
    'PRO' => [
        'nom'    => 'Promopharm (filiale Hikma)',
        'source' => 'CP RFA 2024 (comptes sociaux) + CP RFA 2023',
        'note'   => 'Comptes SOCIAUX (non consolidés) — Promopharm est une filiale '
                  . 'de Hikma Pharmaceuticals, elle-même cotée à Londres. '
                  . 'Note : Sothema SA et Promopharm sont deux sociétés distinctes cotées. '
                  . 'CA 2024 = 898.7 MMAD (ventes biens = 722.6 MMAD + marchandises = 176.1 MMAD). '
                  . 'Résultat net 2024 = 55.2 MMAD. Résultat net 2023 = 57.1 MMAD.',
        'historique' => [
            ['annee'=>2023, 'ca'=>805.5, 'rnpg'=>57.1, 'endettement_net'=>null,
             'notes'=>'Comptes sociaux. CA = 805,5 MMAD. RN = 57,1 MMAD.'],
            ['annee'=>2024, 'ca'=>898.7, 'rnpg'=>55.2, 'endettement_net'=>null,
             'notes'=>'Comptes sociaux. CA = 898,7 MMAD (+11,6%). RN = 55,2 MMAD.'],
            ['annee'=>2025, 'ca'=>null,  'rnpg'=>null,  'endettement_net'=>null,
             'notes'=>'CP T4 2025 scanné — données non disponibles.'],
        ],
        'revenue'       => 899e6,    // CA 2024 en MAD (arrondi)
        'profit_margin' => 6.14,     // RN 55.2 / CA 898.7 ≈ 6.14%
        'total_debt'    => null,
    ],


    // ─────────────────────────────────────────────────────────────────────────
    'ATW' => [
        'nom'    => 'Attijariwafa Bank',
        'source' => 'CP résultats annuels 2025 — innovantmagazine.ma / lereporter.ma (fév. 2026)',
        'note'   => 'Comptes consolidés IFRS. Premier groupe bancaire du Maroc. '
                  . 'RNPG 2025 = 10 600 MMAD (+16,2%). PNB = 34,9 MMDH (+5,6%). '
                  . 'RoTE = 22,8%. Dividende proposé : 22 MAD/action.',
        'historique' => [
            ['annee'=>2022, 'ca'=>null, 'rnpg'=>6200,   'endettement_net'=>null,
             'notes'=>'RNPG estimé (base historique publique).'],
            ['annee'=>2023, 'ca'=>null, 'rnpg'=>7504,   'endettement_net'=>null,
             'notes'=>'RNPG 2023 reconstitué à partir de la variation +26,6%.'],
            ['annee'=>2024, 'ca'=>null, 'rnpg'=>9500,   'endettement_net'=>null,
             'notes'=>'RNPG 2024 = 9 500 MMAD (+26,6%). Source : CP annuel fév. 2025.'],
            ['annee'=>2025, 'ca'=>null, 'rnpg'=>10600,  'endettement_net'=>null,
             'notes'=>'RNPG 2025 = 10 600 MMAD (+16,2%). PNB = 34,9 MMDH. Dividende : 22 MAD/action.'],
        ],
        'revenue'       => null,
        'profit_margin' => null,
        'total_debt'    => null,
    ],

    // ─────────────────────────────────────────────────────────────────────────
    'BCP' => [
        'nom'    => 'Banque Centrale Populaire',
        'source' => 'CP résultats annuels 2025 — boursenews.ma (2026)',
        'note'   => 'Comptes consolidés. RNPG 2025 = 4 500 MMAD (+8,6%). '
                  . 'RNC = 5,6 MMDH (+13,2%). PNB = 27 MMDH (+5,4%).',
        'historique' => [
            ['annee'=>2023, 'ca'=>null, 'rnpg'=>3482,  'endettement_net'=>null,
             'notes'=>'RNPG 2023 reconstitué à partir de la variation +19,2%.'],
            ['annee'=>2024, 'ca'=>null, 'rnpg'=>4150,  'endettement_net'=>null,
             'notes'=>'RNPG 2024 = 4 150 MMAD (+19,2%).'],
            ['annee'=>2025, 'ca'=>null, 'rnpg'=>4500,  'endettement_net'=>null,
             'notes'=>'RNPG 2025 = 4 500 MMAD (+8,6%). RNC = 5,6 MMDH. PNB = 27 MMDH (+5,4%).'],
        ],
        'revenue'       => null,
        'profit_margin' => null,
        'total_debt'    => null,
    ],

    // ─────────────────────────────────────────────────────────────────────────
    'BOA' => [
        'nom'    => 'Bank of Africa (BMCE)',
        'source' => 'CP résultats annuels 2025 — leseco.ma / financialafrik.com (mars 2026)',
        'note'   => 'Comptes consolidés. RNPG 2025 = 3 800 MMAD (+11%). '
                  . 'RN social = 2 200 MMAD (+15%). PNB = 20,3 MMDH (+9%).',
        'historique' => [
            ['annee'=>2023, 'ca'=>null, 'rnpg'=>2072,  'endettement_net'=>null,
             'notes'=>'RNPG 2023 reconstitué à partir de la variation +11%.'],
            ['annee'=>2024, 'ca'=>null, 'rnpg'=>2300,  'endettement_net'=>null,
             'notes'=>'RNPG 2024 = 2 300 MMAD (+11%).'],
            ['annee'=>2025, 'ca'=>null, 'rnpg'=>3800,  'endettement_net'=>null,
             'notes'=>'RNPG 2025 = 3 800 MMAD (+11%). RN social = 2 200 MMAD. PNB = 20,3 MMDH (+9%).'],
        ],
        'revenue'       => null,
        'profit_margin' => null,
        'total_debt'    => null,
    ],

    // ─────────────────────────────────────────────────────────────────────────
    'CIH' => [
        'nom'    => 'CIH Bank',
        'source' => 'CP résultats annuels 2025 — boursenews.ma / medias24.com (mars 2026)',
        'note'   => 'Comptes consolidés. RNPG 2025 = 1 089 MMAD (+24,4%). '
                  . 'PNB = 5 423 MMAD (+14,4%). RN social = 919 MMAD (+22,5%). '
                  . 'Dépôts = 99,5 MMDH (+17,8%). Dividende : 14 MAD/action.',
        'historique' => [
            ['annee'=>2023, 'ca'=>null, 'rnpg'=>710,   'endettement_net'=>null,
             'notes'=>'RNPG 2023 reconstitué à partir de la variation +23,3%.'],
            ['annee'=>2024, 'ca'=>null, 'rnpg'=>875.9, 'endettement_net'=>null,
             'notes'=>'RNPG 2024 = 875,9 MMAD (+23,3%).'],
            ['annee'=>2025, 'ca'=>null, 'rnpg'=>1089.4,'endettement_net'=>null,
             'notes'=>'RNPG 2025 = 1 089 MMAD (+24,4%). PNB = 5 423 MMAD. Dépôts = 99,5 MMDH.'],
        ],
        'revenue'       => null,
        'profit_margin' => null,
        'total_debt'    => null,
    ],

    // ─────────────────────────────────────────────────────────────────────────
    'WAA' => [
        'nom'    => 'Wafa Assurance',
        'source' => 'CP résultats annuels 2025 — boursenews.ma (2026)',
        'note'   => 'Comptes consolidés. RNPG 2025 = 1 026 MMAD (+11,2%). '
                  . 'Primes émises = 15 MMDH. Vie : +8,5%. Non-Vie : +14%.',
        'historique' => [
            ['annee'=>2023, 'ca'=>null, 'rnpg'=>671,  'endettement_net'=>null,
             'notes'=>'RNPG 2023 reconstitué à partir de la variation +27,3%.'],
            ['annee'=>2024, 'ca'=>null, 'rnpg'=>854,  'endettement_net'=>null,
             'notes'=>'RNPG 2024 = 854 MMAD (+27,3%).'],
            ['annee'=>2025, 'ca'=>null, 'rnpg'=>1026, 'endettement_net'=>null,
             'notes'=>'RNPG 2025 = 1 026 MMAD (+11,2%). Primes émises = 15 MMDH. Non-vie = 6 867 MMAD (+14%).'],
        ],
        'revenue'       => null,
        'profit_margin' => null,
        'total_debt'    => null,
    ],

    // ─────────────────────────────────────────────────────────────────────────
    'MNG' => [
        'nom'    => 'Managem',
        'source' => 'CP résultats annuels 2025 — boursenews.ma / allafrica.com (mars 2026)',
        'note'   => 'Comptes consolidés. RNPG 2025 = 3 002 MMAD (+384% !). '
                  . 'CA 2025 = 13 694 MMAD (+55%). EBE = 5 982 MMAD (+125%). '
                  . 'Porté par or (Boto, Sénégal) + cuivre (Tizert, Maroc).',
        'historique' => [
            ['annee'=>2023, 'ca'=>null, 'rnpg'=>517,  'endettement_net'=>null,
             'notes'=>'RNPG 2023 reconstitué.'],
            ['annee'=>2024, 'ca'=>null, 'rnpg'=>620,  'endettement_net'=>null,
             'notes'=>'RNPG 2024 = 620 MMAD (+20%).'],
            ['annee'=>2025, 'ca'=>13694,'rnpg'=>3002, 'endettement_net'=>null,
             'notes'=>'CA 2025 = 13 694 MMAD (+55%). RNPG = 3 002 MMAD (+384%). EBE = 5 982 MMAD. Marge EBE = 44%.'],
        ],
        'revenue'       => null,
        'profit_margin' => null,
        'total_debt'    => null,
    ],

    // ─────────────────────────────────────────────────────────────────────────
    'LHM' => [
        'nom'    => 'LafargeHolcim Maroc',
        'source' => 'CP résultats annuels 2025 — boursenews.ma / financialafrik.com (mars 2026)',
        'note'   => 'Comptes consolidés IFRS. RN 2025 = 2 166 MMAD (+18,6%). '
                  . 'CA 2025 = 8 936 MMAD (+9,6%). REX = 3 815 MMAD (+15,8%). '
                  . 'Dividende : 96 MAD/action. Futur renommage en Holcim Maroc.',
        'historique' => [
            ['annee'=>2023, 'ca'=>null, 'rnpg'=>1548, 'endettement_net'=>null,
             'notes'=>'RN 2023 reconstitué.'],
            ['annee'=>2024, 'ca'=>null, 'rnpg'=>1826, 'endettement_net'=>null,
             'notes'=>'RN 2024 = 1 826 MMAD (+18%).'],
            ['annee'=>2025, 'ca'=>8936, 'rnpg'=>2166, 'endettement_net'=>null,
             'notes'=>'CA 2025 = 8 936 MMAD (+9,6%). RN = 2 166 MMAD (+18,6%). REX = 3 815 MMAD.'],
        ],
        'revenue'       => null,
        'profit_margin' => null,
        'total_debt'    => null,
    ],

    // ─────────────────────────────────────────────────────────────────────────
    'LES' => [
        'nom'    => 'Lesieur Cristal',
        'source' => 'CP résultats annuels 2025 — ecoactu.ma / libe.ma (mars 2026)',
        'note'   => 'Comptes consolidés. RNPG 2025 = 8 MMAD (-67% vs 2024). '
                  . 'CA 2025 = 5 370 MMAD (-1%). EBITDA = 287 MMAD (-39%). '
                  . 'Pression sur marges et hausse matières premières.',
        'historique' => [
            ['annee'=>2023, 'ca'=>null, 'rnpg'=>2.4,  'endettement_net'=>null,
             'notes'=>'RNPG 2023 très faible (impact redressement fiscal).'],
            ['annee'=>2024, 'ca'=>null, 'rnpg'=>24,   'endettement_net'=>null,
             'notes'=>'RNPG 2024 = 24 MMAD (×10 vs 2023).'],
            ['annee'=>2025, 'ca'=>5370, 'rnpg'=>8.0,  'endettement_net'=>null,
             'notes'=>'CA 2025 = 5 370 MMAD (-1%). RNPG = 8 MMAD (-67%). EBITDA = 287 MMAD (-39%).'],
        ],
        'revenue'       => null,
        'profit_margin' => null,
        'total_debt'    => null,
    ],

    // ─────────────────────────────────────────────────────────────────────────
    'LBV' => [
        'nom'    => 'Label Vie',
        'source' => 'CP résultats annuels 2025 — boursenews.ma / zonebourse.com (2026)',
        'note'   => 'Comptes consolidés. RNPG 2025 = 578,8 MMAD (+3,5%). '
                  . 'CA 2025 = 18 534 MMAD (+13,7%). 141 ouvertures de magasins en 2025.',
        'historique' => [
            ['annee'=>2023, 'ca'=>null,  'rnpg'=>524,   'endettement_net'=>null,
             'notes'=>'RN 2023 reconstitué.'],
            ['annee'=>2024, 'ca'=>null,  'rnpg'=>559,   'endettement_net'=>null,
             'notes'=>'RN 2024 = 559 MMAD (+6,7%).'],
            ['annee'=>2025, 'ca'=>18534, 'rnpg'=>578.8, 'endettement_net'=>null,
             'notes'=>'CA 2025 = 18 534 MMAD (+13,7%). RNPG = 578,8 MMAD (+3,5%). 141 ouvertures.'],
        ],
        'revenue'       => null,
        'profit_margin' => null,
        'total_debt'    => null,
    ],

    // ─────────────────────────────────────────────────────────────────────────
    'ATH' => [
        'nom'    => 'Auto Hall',
        'source' => 'CP résultats annuels 2025 — ecoactu.ma / boursenews.ma (2026)',
        'note'   => 'Comptes consolidés. RN 2025 = 100 MMAD (+446% vs 17 MMAD en 2024 !). '
                  . 'CA 2025 = 5 910 MMAD (+18%). 22 612 véhicules vendus (+20%).',
        'historique' => [
            ['annee'=>2023, 'ca'=>null, 'rnpg'=>170,  'endettement_net'=>null,
             'notes'=>'RN 2023 reconstitué.'],
            ['annee'=>2024, 'ca'=>null, 'rnpg'=>17,   'endettement_net'=>null,
             'notes'=>'RN 2024 = 17 MMAD (faible — éléments exceptionnels).'],
            ['annee'=>2025, 'ca'=>5910, 'rnpg'=>100,  'endettement_net'=>null,
             'notes'=>'CA 2025 = 5 910 MMAD (+18%). RN = 100 MMAD (+446%). 22 612 véhicules vendus.'],
        ],
        'revenue'       => null,
        'profit_margin' => null,
        'total_debt'    => null,
    ],

    // ─────────────────────────────────────────────────────────────────────────
    'DWY' => [
        'nom'    => 'Disway',
        'source' => 'CP résultats annuels 2025 — boursenews.ma / financialafrik.com (fév. 2026)',
        'note'   => 'Comptes consolidés. RNPG 2025 = 85 MMAD (+8,4%). '
                  . 'CA 2025 = 2 070 MMAD (+9%). EBITDA en progression. '
                  . 'Dividende proposé : 44 MAD/action.',
        'historique' => [
            ['annee'=>2023, 'ca'=>null, 'rnpg'=>65.7, 'endettement_net'=>null,
             'notes'=>'RNPG 2023 reconstitué.'],
            ['annee'=>2024, 'ca'=>null, 'rnpg'=>79,   'endettement_net'=>null,
             'notes'=>'RNPG 2024 = 79 MMAD (+20,3%).'],
            ['annee'=>2025, 'ca'=>2070, 'rnpg'=>85,   'endettement_net'=>null,
             'notes'=>'CA 2025 = 2 070 MMAD (+9%). RNPG = 85 MMAD (+8,4%). Dividende : 44 MAD/action.'],
        ],
        'revenue'       => null,
        'profit_margin' => null,
        'total_debt'    => null,
    ],

    // ─────────────────────────────────────────────────────────────────────────
    'HPS' => [
        'nom'    => 'HPS',
        'source' => 'CP résultats annuels 2025 — leseco.ma / lavieeco.com (2026)',
        'note'   => 'Comptes consolidés. RNPG 2025 = 106 MMAD (+40,5%). '
                  . 'CA 2025 = 1 550 MMAD (+22,3%). EBITDA = 268 MMAD (+30%). '
                  . 'Leader mondial solutions paiement électronique (PowerCARD, BankWorld).',
        'historique' => [
            ['annee'=>2023, 'ca'=>809,  'rnpg'=>null, 'endettement_net'=>null,
             'notes'=>'CA 2023 reconstitué.'],
            ['annee'=>2024, 'ca'=>904,  'rnpg'=>75,   'endettement_net'=>null,
             'notes'=>'CA 2024 = 904 MMAD. RNPG 2024 = 75 MMAD (reconstitué depuis +40,5%).'],
            ['annee'=>2025, 'ca'=>1550, 'rnpg'=>106,  'endettement_net'=>null,
             'notes'=>'CA 2025 = 1 550 MMAD (+22,3%). RNPG = 106 MMAD (+40,5%). EBITDA = 268 MMAD (+30%).'],
        ],
        'revenue'       => 904e6,
        'profit_margin' => null,
        'total_debt'    => null,
    ],

];

$STATIC = $STATIC_FUNDAMENTALS[$symbole] ?? null;

$tStart = microtime(true);
$mh     = curl_multi_init();
$chs    = [];

// ── A : BMCE Capital ─────────────────────────────────────────────────────────
if (!empty($bmceCode)) {
    $codeClean = str_replace('%2C', ',', $bmceCode);
    $bmceUrl   = "https://www.bmcecapitalbourse.com/bkbbourse/details/{$codeClean}";
    $cookie    = sys_get_temp_dir().'/bmce_sm_'.md5($bmceCode).'.txt';
    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL            => $bmceUrl,
        CURLOPT_RETURNTRANSFER => true, CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_SSL_VERIFYPEER => false, CURLOPT_SSL_VERIFYHOST => false,
        CURLOPT_COOKIEJAR      => $cookie, CURLOPT_COOKIEFILE    => $cookie,
        CURLOPT_USERAGENT      => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        CURLOPT_TIMEOUT        => 7,  CURLOPT_ENCODING        => '',
        CURLOPT_CONNECTTIMEOUT => 4,
        CURLOPT_HTTPHEADER     => ['Accept-Language: fr-FR,fr;q=0.9','Cache-Control: no-cache'],
    ]);
    curl_multi_add_handle($mh, $ch);
    $chs['bmce'] = $ch;
}

// ── B : Yahoo Finance v8/chart ────────────────────────────────────────────────
$yS   = urlencode($symbole.'.CS');
$chYC = curl_init();
curl_setopt_array($chYC, [
    CURLOPT_URL            => "https://query1.finance.yahoo.com/v8/finance/chart/{$yS}?interval=1d&range=1y&includePrePost=false",
    CURLOPT_RETURNTRANSFER => true, CURLOPT_SSL_VERIFYPEER => false,
    CURLOPT_TIMEOUT        => 6, CURLOPT_CONNECTTIMEOUT => 3,
    CURLOPT_USERAGENT      => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    CURLOPT_HTTPHEADER     => ['Accept: application/json','Accept-Language: en-US,en;q=0.5'],
]);
curl_multi_add_handle($mh, $chYC);
$chs['yc'] = $chYC;

// ── C : Yahoo Finance v10/quoteSummary ────────────────────────────────────────
$chYS = curl_init();
curl_setopt_array($chYS, [
    CURLOPT_URL            => "https://query2.finance.yahoo.com/v10/finance/quoteSummary/{$yS}?modules=summaryDetail,defaultKeyStatistics,financialData,price",
    CURLOPT_RETURNTRANSFER => true, CURLOPT_SSL_VERIFYPEER => false,
    CURLOPT_TIMEOUT        => 6, CURLOPT_CONNECTTIMEOUT => 3,
    CURLOPT_USERAGENT      => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    CURLOPT_HTTPHEADER     => ['Accept: application/json','Accept-Language: en-US,en;q=0.5'],
]);
curl_multi_add_handle($mh, $chYS);
$chs['ys'] = $chYS;

// ── D : casablanca-bourse.com — API Drupal JSON ───────────────────────────────
// Plusieurs endpoints tentés en parallèle ; on garde le premier qui répond 200
$casaUrls = [
    "https://api.casablanca-bourse.com/fr/api/cours/{$symbole}",
    "https://api.casablanca-bourse.com/fr/api/emetteur/{$symbole}",
    "https://api.casablanca-bourse.com/fr/api/node/emetteur?filter[title]={$symbole}&page[limit]=1",
];
$chCasa = curl_init();
curl_setopt_array($chCasa, [
    CURLOPT_URL            => $casaUrls[0],
    CURLOPT_RETURNTRANSFER => true, CURLOPT_SSL_VERIFYPEER => false,
    CURLOPT_TIMEOUT        => 6,    CURLOPT_CONNECTTIMEOUT => 3,
    CURLOPT_USERAGENT      => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    CURLOPT_HTTPHEADER     => [
        'Accept: application/vnd.api+json, application/json',
        'Referer: https://www.casablanca-bourse.com/',
        'Accept-Language: fr-FR,fr;q=0.9',
    ],
]);
curl_multi_add_handle($mh, $chCasa);
$chs['casa'] = $chCasa;

// Exécution parallèle — deadline 9s max
$running  = null;
$deadline = microtime(true) + 9;
do {
    curl_multi_exec($mh, $running);
    if ($running) curl_multi_select($mh, 0.1);
} while ($running > 0 && microtime(true) < $deadline);

$raw = [];
foreach ($chs as $k => $ch) {
    $raw[$k] = ['body' => curl_multi_getcontent($ch), 'code' => curl_getinfo($ch, CURLINFO_HTTP_CODE)];
    curl_multi_remove_handle($mh, $ch); curl_close($ch);
}
curl_multi_close($mh);

// ══════════════════════════════════════════════════════════════════════════════
//  Parse A — BMCE Capital
// ══════════════════════════════════════════════════════════════════════════════
$bmce = ['ok' => false, 'data' => []];
if (!empty($raw['bmce']) && $raw['bmce']['code'] === 200 && strlen($raw['bmce']['body']) > 500) {
    $h = preg_replace('/[\r\n\t]+/', ' ', $raw['bmce']['body']);
    $h = preg_replace('/  +/', ' ', $h);
    $m = [];

    preg_match_all('/<table[^>]*>(.*?)<\/table>/is', $h, $tables);
    foreach ($tables[1] as $tc) {
        preg_match_all('/<tr[^>]*>(.*?)<\/tr>/is', $tc, $rowM);
        foreach ($rowM[1] as $row) {
            preg_match_all('/<t[dh][^>]*>(.*?)<\/t[dh]>/is', $row, $cellM);
            $c = array_map('cellText', $cellM[1]);
            if (count($c) < 2) continue;
            $lbl = strtoupper($c[0]);
            $val = $c[1];
            if      (strpos($lbl,'COURS')!==false && strpos($lbl,'DER')!==false)            $m['cours']       = cleanNum($val);
            elseif  (strpos($lbl,'VARIATION')!==false && strpos($lbl,'%')!==false)           $m['variation']   = cleanNum(str_replace(['%','+'],'',$val));
            elseif  (strpos($lbl,'CAPITALIS')!==false)                                       $m['capitalisation']= cleanNum($val);
            elseif  (strpos($lbl,'VOLUME')!==false && strpos($lbl,'CHAN')!==false)            $m['volume']      = cleanNum($val);
            elseif  (strpos($lbl,'HAUT')!==false && strpos($lbl,'52')!==false)               $m['haut_52s']    = cleanNum($val);
            elseif  (strpos($lbl,'BAS')!==false  && strpos($lbl,'52')!==false)               $m['bas_52s']     = cleanNum($val);
            elseif  (strpos($lbl,'PER')===0 || $lbl==='P/E' || strpos($lbl,'RATIO COURS')!==false) $m['per']  = cleanNum($val);
            elseif  (strpos($lbl,'RENDEMENT')!==false || (strpos($lbl,'DIVID')!==false && strpos($lbl,'%')!==false)) $m['div_yield'] = cleanNum(str_replace(['%','+'],'',$val));
            elseif  (strpos($lbl,'P/B')!==false || strpos($lbl,'PRICE/BOOK')!==false || strpos($lbl,'PRICE / BOOK')!==false) $m['pbv'] = cleanNum($val);
            elseif  (strpos($lbl,'FLOTTANT')!==false)                                        $m['flottant']    = cleanNum(str_replace(['%','+'],'',$val));
            elseif  (strpos($lbl,'NOMBRE TITRES')!==false || strpos($lbl,'NB TITRES')!==false) $m['nb_titres'] = cleanNum($val);
            elseif  (strpos($lbl,'OUVERTURE')!==false && strpos($lbl,'COURS')!==false)       $m['ouverture']   = cleanNum($val);
            elseif  (strpos($lbl,'PLUS HAUT')!==false && strpos($lbl,'JOURN')!==false)       $m['haut_jour']   = cleanNum($val);
            elseif  (strpos($lbl,'PLUS BAS')!==false  && strpos($lbl,'JOURN')!==false)       $m['bas_jour']    = cleanNum($val);
        }
    }
    // Fallback cours CSS
    if (empty($m['cours'])) {
        foreach ([
            '/<[^>]*class="[^"]*\blast\b[^"]*"[^>]*>\s*([\d\s,]+(?:[.,]\d+)?)\s*</i',
            '/<span[^>]*data-s="[^"]*LVAL_NORM[^"]*"[^>]*>\s*([\d\s,]+(?:[.,]\d+)?)\s*<\/span>/i',
        ] as $p) {
            if (preg_match($p, $h, $pm)) { $v = cleanNum($pm[1]); if ($v && $v > 5) { $m['cours'] = $v; break; } }
        }
    }
    $bmce = ['ok' => !empty($m['cours']), 'data' => $m];
}

// ══════════════════════════════════════════════════════════════════════════════
//  Parse B — Yahoo Chart v8
// ══════════════════════════════════════════════════════════════════════════════
$yc = ['ok' => false, 'data' => []];
if ($raw['yc']['code'] === 200 && !empty($raw['yc']['body'])) {
    $j = json_decode($raw['yc']['body'], true);
    if (isset($j['chart']['result'][0])) {
        $res   = $j['chart']['result'][0];
        $meta  = $res['meta'] ?? [];
        $price = $meta['regularMarketPrice'] ?? null;
        $prev  = $meta['chartPreviousClose'] ?? $meta['previousClose'] ?? null;
        $var   = ($prev > 0 && $price) ? round(($price - $prev) / $prev * 100, 2) : null;
        $closes = array_values(array_filter($res['indicators']['quote'][0]['close'] ?? [], fn($v) => $v !== null && $v > 0));
        $yc = [
            'ok' => ($price > 0),
            'data' => [
                'cours'      => $price ? round($price, 2) : null,
                'variation'  => $var,
                'prev_close' => $prev  ? round($prev, 2)  : null,
                'volume'     => $meta['regularMarketVolume'] ?? null,
                'haut_jour'  => isset($meta['regularMarketDayHigh']) ? round($meta['regularMarketDayHigh'], 2) : null,
                'bas_jour'   => isset($meta['regularMarketDayLow'])  ? round($meta['regularMarketDayLow'],  2) : null,
                'haut_52s'   => $closes ? round(max($closes), 2) : null,
                'bas_52s'    => $closes ? round(min($closes), 2) : null,
            ],
        ];
    }
}

// ══════════════════════════════════════════════════════════════════════════════
//  Parse C — Yahoo QuoteSummary v10
// ══════════════════════════════════════════════════════════════════════════════
$yf = ['ok' => false, 'data' => []];
if ($raw['ys']['code'] === 200 && !empty($raw['ys']['body'])) {
    $j  = json_decode($raw['ys']['body'], true);
    $qs = $j['quoteSummary']['result'][0] ?? null;
    if ($qs) {
        $sd = $qs['summaryDetail']        ?? [];
        $ks = $qs['defaultKeyStatistics'] ?? [];
        $fd = $qs['financialData']        ?? [];
        $pr = $qs['price']                ?? [];

        $gv  = function($arr, $key): ?float {
            $v = $arr[$key] ?? null;
            if (is_array($v)) return isset($v['raw']) && is_numeric($v['raw']) ? (float)$v['raw'] : null;
            return is_numeric($v) ? (float)$v : null;
        };
        $pct = function($arr, $key) use ($gv): ?float {
            $v = $gv($arr, $key); return $v !== null ? round($v * 100, 2) : null;
        };

        $yf = [
            'ok' => true,
            'data' => [
                // Prix
                'cours'          => $gv($pr,'regularMarketPrice'),
                'variation'      => $pct($pr,'regularMarketChangePercent'),
                'market_cap'     => $gv($pr,'marketCap'),
                'volume'         => $gv($pr,'regularMarketVolume'),
                'prev_close'     => $gv($sd,'previousClose'),
                'ouverture'      => $gv($sd,'open'),
                'haut_jour'      => $gv($sd,'dayHigh'),
                'bas_jour'       => $gv($sd,'dayLow'),
                'haut_52s'       => $gv($sd,'fiftyTwoWeekHigh'),
                'bas_52s'        => $gv($sd,'fiftyTwoWeekLow'),
                // Valorisation
                'per_trailing'   => $gv($sd,'trailingPE'),
                'per_forward'    => $gv($sd,'forwardPE'),
                'pbv'            => $gv($ks,'priceToBook'),
                'beta'           => $gv($ks,'beta') ?? $gv($sd,'beta'),
                'eps_trailing'   => $gv($ks,'trailingEps'),
                'eps_forward'    => $gv($ks,'forwardEps'),
                'book_value'     => $gv($ks,'bookValue'),
                'shares_out'     => $gv($ks,'sharesOutstanding'),
                'float_shares'   => $gv($ks,'floatShares'),
                // Dividende
                'div_yield'      => $pct($sd,'dividendYield'),
                'div_rate'       => $gv($sd,'dividendRate'),
                'payout_ratio'   => $pct($sd,'payoutRatio'),
                // Fondamentaux
                'revenue'        => $gv($fd,'totalRevenue'),
                'ebitda'         => $gv($fd,'ebitda'),
                'gross_margin'   => $pct($fd,'grossMargins'),
                'profit_margin'  => $pct($fd,'profitMargins'),
                'roe'            => $pct($fd,'returnOnEquity'),
                'roa'            => $pct($fd,'returnOnAssets'),
                'total_debt'     => $gv($fd,'totalDebt'),
                'total_cash'     => $gv($fd,'totalCash'),
                'current_ratio'  => $gv($fd,'currentRatio'),
                'debt_to_eq'     => $gv($fd,'debtToEquity'),
                'revenue_growth' => $pct($fd,'revenueGrowth'),
                'earnings_growth'=> $pct($fd,'earningsGrowth'),
                // Analystes
                'target_price'   => $gv($fd,'targetMeanPrice'),
                'target_high'    => $gv($fd,'targetHighPrice'),
                'target_low'     => $gv($fd,'targetLowPrice'),
                'rec_mean'       => $gv($fd,'recommendationMean'),
                'rec_key'        => $fd['recommendationKey'] ?? null,
                'nb_analysts'    => $gv($fd,'numberOfAnalystOpinions'),
            ],
        ];
    }
}

// ══════════════════════════════════════════════════════════════════════════════
//  Parse D — casablanca-bourse.com (API Drupal JSON ou HTML)
// ══════════════════════════════════════════════════════════════════════════════
$casa = ['ok' => false, 'data' => []];
if (!empty($raw['casa']) && in_array($raw['casa']['code'], [200,201]) && !empty($raw['casa']['body'])) {
    $jcasa = json_decode($raw['casa']['body'], true);
    if ($jcasa) {
        $cd = [];
        // Structure JSON:API Drupal { data: [{attributes:{...}}] } ou réponse plate
        $items = $jcasa['data'] ?? (isset($jcasa['attributes']) ? [$jcasa] : []);
        if (empty($items) && is_array($jcasa)) {
            // Réponse plate : chercher directement les champs
            $items = [$jcasa];
        }
        foreach ($items as $item) {
            $attrs = $item['attributes'] ?? $item;
            if (!is_array($attrs)) continue;
            array_walk_recursive($attrs, function($v, $k) use (&$cd) {
                if (!is_numeric($v) || (float)$v <= 0) return;
                $fv = (float)$v; $kl = strtolower((string)$k);
                if (preg_match('/cours|last|close|price/', $kl) && empty($cd['cours']) && $fv > 1) $cd['cours'] = $fv;
                elseif (preg_match('/variation|change/', $kl) && empty($cd['variation'])) $cd['variation'] = $fv;
                elseif (preg_match('/capi/', $kl) && empty($cd['capitalisation'])) $cd['capitalisation'] = $fv;
                elseif (preg_match('/^per$|^p_e$|^pe$/', $kl) && empty($cd['per']) && $fv < 500) $cd['per'] = $fv;
                elseif (preg_match('/rendement|yield|divid/', $kl) && empty($cd['div_yield'])) $cd['div_yield'] = $fv;
                elseif (preg_match('/flottant/', $kl) && empty($cd['flottant'])) $cd['flottant'] = $fv;
                elseif (preg_match('/haut.*52|52.*haut|year.*high/', $kl) && empty($cd['haut_52s'])) $cd['haut_52s'] = $fv;
                elseif (preg_match('/bas.*52|52.*bas|year.*low/', $kl) && empty($cd['bas_52s'])) $cd['bas_52s'] = $fv;
                elseif (preg_match('/nb.*titre|nombre.*titre|shares/', $kl) && empty($cd['nb_titres'])) $cd['nb_titres'] = $fv;
            });
            if (!empty($cd)) break;
        }
        $casa = ['ok' => !empty($cd['cours']), 'data' => $cd, 'maintenance' => false];
    }
} elseif (!empty($raw['casa']) && $raw['casa']['code'] === 500) {
    // Site en maintenance — on le note mais ce n'est pas une erreur fatale
    $casa = ['ok' => false, 'data' => [], 'maintenance' => true];
}

// ══════════════════════════════════════════════════════════════════════════════
//  Consolidation — meilleure valeur par métrique
// ══════════════════════════════════════════════════════════════════════════════
$B  = $bmce['data'];
$YC = $yc['data'];
$YF = $yf['data'];
$CA = $casa['data']; // casablanca-bourse.com

// Cours de référence : Yahoo Chart > Yahoo Fund > Casablanca BVC > BMCE
$coursRef = $YC['cours'] ?? $YF['cours'] ?? $CA['cours'] ?? $B['cours'] ?? null;
$varRef   = $YC['variation'] ?? $YF['variation'] ?? $CA['variation'] ?? $B['variation'] ?? null;

// Capitalisation : Yahoo Fund > Casablanca BVC > calculé
$capiRef = $YF['market_cap'] ?? $CA['capitalisation'] ?? null;
if (!$capiRef && $coursRef) {
    $nb = $YF['shares_out'] ?? $CA['nb_titres'] ?? $B['nb_titres'] ?? null;
    if ($nb) $capiRef = round($coursRef * $nb);
}

// Comparaison cours entre sources
$coursComp = array_filter([
    'BMCE Capital'       => $B['cours']  ?? null,
    'Yahoo Finance'      => $YC['cours'] ?? ($YF['cours'] ?? null),
    'Casablanca Bourse'  => $CA['cours'] ?? null,
], fn($v) => $v !== null);
$ecartPct = null;
if (count($coursComp) >= 2) {
    $hi = max($coursComp); $lo = min($coursComp);
    $ecartPct = ($lo > 0) ? round(($hi - $lo) / $lo * 100, 2) : null;
}

// ── Calcul croissances RNPG/CA depuis données statiques officielles ─────────
// Utilisé en priorité sur Yahoo (qui peut renvoyer RN consolidé ≠ RNPG)
$staticEarningsGrowth = null;
$staticRevenueGrowth  = null;
if ($STATIC && !empty($STATIC['historique'])) {
    // RNPG — prend les deux dernières années avec valeur non-nulle
    $hRN = array_values(array_filter($STATIC['historique'],
        fn($h) => isset($h['rnpg']) && $h['rnpg'] !== null));
    usort($hRN, fn($a,$b) => $a['annee'] - $b['annee']);
    if (count($hRN) >= 2) {
        $prev = $hRN[count($hRN)-2]; $last = $hRN[count($hRN)-1];
        if ($prev['rnpg'] != 0)
            $staticEarningsGrowth = round(($last['rnpg'] - $prev['rnpg']) / abs($prev['rnpg']) * 100, 2);
    }
    // CA — même logique
    $hCA = array_values(array_filter($STATIC['historique'],
        fn($h) => isset($h['ca']) && $h['ca'] !== null));
    usort($hCA, fn($a,$b) => $a['annee'] - $b['annee']);
    if (count($hCA) >= 2) {
        $pCA = $hCA[count($hCA)-2]; $lCA = $hCA[count($hCA)-1];
        if ($pCA['ca'] != 0)
            $staticRevenueGrowth = round(($lCA['ca'] - $pCA['ca']) / abs($pCA['ca']) * 100, 2);
    }
}

$cons = [
    // Marché
    'cours'          => $coursRef,
    'variation'      => $varRef,
    'prev_close'     => $YC['prev_close']  ?? $YF['prev_close']  ?? null,
    'ouverture'      => $YF['ouverture']   ?? $B['ouverture']    ?? null,
    'haut_jour'      => $YF['haut_jour']   ?? $YC['haut_jour']   ?? $B['haut_jour']  ?? null,
    'bas_jour'       => $YF['bas_jour']    ?? $YC['bas_jour']    ?? $B['bas_jour']   ?? null,
    'haut_52s'       => $YF['haut_52s']    ?? $YC['haut_52s']    ?? $CA['haut_52s']  ?? $B['haut_52s']   ?? null,
    'bas_52s'        => $YF['bas_52s']     ?? $YC['bas_52s']     ?? $CA['bas_52s']   ?? $B['bas_52s']    ?? null,
    'capitalisation' => $capiRef,
    'volume'         => $YC['volume']      ?? $YF['volume']      ?? $B['volume']     ?? null,
    // Valorisation
    'per_trailing'   => $YF['per_trailing'] ?? $CA['per']        ?? $B['per']         ?? null,
    'per_forward'    => $YF['per_forward']  ?? null,
    'pbv'            => $YF['pbv']          ?? $B['pbv']         ?? null,
    'beta'           => $YF['beta']         ?? null,
    'eps_trailing'   => $YF['eps_trailing'] ?? null,
    'eps_forward'    => $YF['eps_forward']  ?? null,
    'book_value'     => $YF['book_value']   ?? null,
    'shares_out'     => $YF['shares_out']   ?? $CA['nb_titres']  ?? $B['nb_titres']   ?? null,
    'flottant_pct'   => $CA['flottant']     ?? $B['flottant']    ?? null,
    'float_shares'   => $YF['float_shares'] ?? null,
    // Dividende
    'div_yield'      => $YF['div_yield']    ?? $CA['div_yield']  ?? $B['div_yield']   ?? null,
    'div_rate'       => $YF['div_rate']     ?? null,
    'payout_ratio'   => $YF['payout_ratio'] ?? null,
    // Fondamentaux — données statiques (RNPG officiel) prioritaires sur Yahoo pour croissance
    'revenue'        => $YF['revenue']       ?? ($STATIC ? $STATIC['revenue']       ?? null : null),
    'ebitda'         => $YF['ebitda']        ?? null,
    'gross_margin'   => $YF['gross_margin']  ?? null,
    'profit_margin'  => ($STATIC ? $STATIC['profit_margin'] ?? null : null) ?? $YF['profit_margin'] ?? null,
    'roe'            => $YF['roe']           ?? null,
    'roa'            => $YF['roa']           ?? null,
    'total_debt'     => ($STATIC ? $STATIC['total_debt'] ?? null : null) ?? $YF['total_debt'] ?? null,
    'total_cash'     => $YF['total_cash']    ?? null,
    'current_ratio'  => $YF['current_ratio'] ?? null,
    'debt_to_eq'     => $YF['debt_to_eq']    ?? null,
    'revenue_growth' => $staticRevenueGrowth  ?? $YF['revenue_growth'] ?? null,
    'earnings_growth'=> $staticEarningsGrowth ?? $YF['earnings_growth'] ?? null,
    // Analystes
    'target_price'   => $YF['target_price'] ?? null,
    'target_high'    => $YF['target_high']  ?? null,
    'target_low'     => $YF['target_low']   ?? null,
    'rec_mean'       => $YF['rec_mean']     ?? null,
    'rec_key'        => $YF['rec_key']      ?? null,
    'nb_analysts'    => $YF['nb_analysts']  ?? null,
];

$output = [
    'success'     => true,
    'symbole'     => $symbole,
    'elapsed_ms'  => round((microtime(true) - $tStart) * 1000),
    'timestamp'   => time(),
    'from_cache'  => false,
    'consolidated'=> $cons,
    'sources'     => [
        'bmce'              => ['ok' => $bmce['ok'], 'data' => $B],
        'yahoo_chart'       => ['ok' => $yc['ok'],   'data' => $YC],
        'yahoo_fund'        => ['ok' => $yf['ok'],   'data' => $YF],
        'casablanca_bourse' => ['ok' => $casa['ok'], 'data' => $CA, 'maintenance' => $casa['maintenance'] ?? false],
    ],
    'comparaison_cours' => [
        'valeurs'  => $coursComp,
        'ecart_pct'=> $ecartPct,
        'coherent' => $ecartPct !== null ? ($ecartPct < 1.5) : true,
    ],
    'static_data' => $STATIC ? [
        'disponible'  => true,
        'nom'         => $STATIC['nom']        ?? $symbole,
        'historique'  => $STATIC['historique'] ?? [],
        'note'        => $STATIC['note']       ?? null,
        'source'      => $STATIC['source']     ?? null,
    ] : ['disponible' => false],
];

// Sauvegarder dans le cache si au moins une source a répondu
$hasData = $bmce['ok'] || $yc['ok'] || $yf['ok'] || $casa['ok'];
if ($hasData) {
    @file_put_contents($cacheFile, json_encode($output, JSON_UNESCAPED_UNICODE));
} elseif (file_exists($cacheFile)) {
    // Aucune source ne répond → retourner le cache périmé plutôt que rien
    $stale = json_decode(file_get_contents($cacheFile), true);
    if ($stale && ($stale['success'] ?? false)) {
        $stale['from_cache'] = true;
        $stale['stale_cache'] = true;
        $stale['cache_age_s'] = time() - filemtime($cacheFile);
        echo json_encode($stale, JSON_UNESCAPED_UNICODE);
        exit;
    }
}

echo json_encode($output, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
