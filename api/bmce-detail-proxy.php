<?php
// api/bmce-detail-proxy.php — v4
// Proxy BMCE Capital : scrape Historique, Cotation/Carnet, Graphique, Santé
//
// Usage : bmce-detail-proxy.php?code=2585582%2C102%2C608&tab=historique|cotation|graphique|sante
//
// URLs BMCE par onglet :
//   - Historique  : /bkbbourse/details/hiku/CODE
//   - Cotation    : /bkbbourse/details/CODE  (page principale)
//   - Graphique   : /bkbbourse/details/chartNew/CODE
//   - Stats/Santé : /bkbbourse/details/CODE  (page principale)

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Cache-Control: no-cache, must-revalidate');

$code = isset($_GET['code']) ? trim($_GET['code']) : '';
$tab  = isset($_GET['tab'])  ? strtolower(trim($_GET['tab'])) : 'historique';

if (empty($code)) {
    echo json_encode(['success'=>false,'error'=>'Paramètre code manquant']); exit;
}

// Décoder %2C → virgule pour les URLs de type /details/xxx/CODE
$codeClean = str_replace('%2C', ',', $code);

$tabUrls = [
    'historique' => "https://www.bmcecapitalbourse.com/bkbbourse/details/hiku/{$codeClean}",
    'cotation'   => "https://www.bmcecapitalbourse.com/bkbbourse/details/{$codeClean}",
    'carnet'     => "https://www.bmcecapitalbourse.com/bkbbourse/details/{$codeClean}",
    'graphique'  => "https://www.bmcecapitalbourse.com/bkbbourse/details/chartNew/{$codeClean}",
    'sante'      => "https://www.bmcecapitalbourse.com/bkbbourse/details/{$codeClean}",
];

$url = $tabUrls[$tab] ?? $tabUrls['historique'];
$cookieFile = sys_get_temp_dir() . '/bmce_' . md5($code . $tab) . '.txt';

// ── Fetch générique ──────────────────────────────────────────────────────────
function bmceFetch($url, $cookieFile) {
    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL             => $url,
        CURLOPT_RETURNTRANSFER  => true,
        CURLOPT_FOLLOWLOCATION  => true,
        CURLOPT_SSL_VERIFYPEER  => false,
        CURLOPT_SSL_VERIFYHOST  => false,
        CURLOPT_COOKIEJAR       => $cookieFile,
        CURLOPT_COOKIEFILE      => $cookieFile,
        CURLOPT_USERAGENT       => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        CURLOPT_TIMEOUT         => 30,
        CURLOPT_ENCODING        => '',
        CURLOPT_HTTPHEADER      => [
            'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language: fr-FR,fr;q=0.9',
            'Cache-Control: no-cache',
            'Connection: keep-alive',
        ],
    ]);
    $html = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $finalUrl = curl_getinfo($ch, CURLINFO_EFFECTIVE_URL);
    $err  = curl_error($ch);
    curl_close($ch);
    return ['html'=>($html?:''), 'code'=>$httpCode, 'final'=>$finalUrl, 'err'=>$err];
}

function cellText($html) {
    return trim(preg_replace('/\s+/', ' ', strip_tags($html)));
}

function cleanNum($s) {
    $s = str_replace([' ', "\xc2\xa0", '&nbsp;'], '', $s);
    $s = str_replace(',', '.', $s);
    $s = preg_replace('/[^0-9.\-+]/', '', trim($s));
    return is_numeric($s) ? floatval($s) : null;
}

// ── Parse l'historique (hiku) ─────────────────────────────────────────────────
// Retourne un tableau ['dernier', 'date', 'variation', 'volume', 'quantite', ...]
function parseHistorique($html) {
    $historique = [];

    // Méthode 1 : classes CSS BMCE (datetime, last, high, low, open, volume, nc2_pr)
    preg_match_all('/<tr[^>]*>(.*?)<\/tr>/is', $html, $allRows);
    foreach ($allRows[1] as $row) {
        preg_match_all('/<td[^>]*class="([^"]*)"[^>]*>(.*?)<\/td>/is', $row, $cellM, PREG_SET_ORDER);
        if (count($cellM) < 4) continue;
        $rd = [];
        foreach ($cellM as $cell) {
            $cls = $cell[1];
            $val = cellText($cell[2]);
            if (strpos($cls, 'datetime') !== false) $rd['date']     = $val;
            elseif (strpos($cls, 'last')     !== false) $rd['dernier']  = cleanNum($val);
            elseif (strpos($cls, 'high')     !== false) $rd['haut']     = cleanNum($val);
            elseif (strpos($cls, 'low')      !== false) $rd['bas']      = cleanNum($val);
            elseif (strpos($cls, 'open')     !== false) $rd['ouverture']= cleanNum($val);
            elseif (strpos($cls, 'nc2_pr')   !== false) $rd['variation']= cleanNum(str_replace(['%','+'], '', $val));
            elseif (strpos($cls, 'volume')   !== false) {
                if (!isset($rd['quantite'])) $rd['quantite'] = cleanNum($val);
                else $rd['volume'] = cleanNum($val);
            }
        }
        if (!empty($rd['date']) && preg_match('/\d{2}[.\/-]\d{2}[.\/-]\d{4}/', $rd['date'])) {
            $historique[] = [
                'date'      => $rd['date'],
                'ouverture' => $rd['ouverture'] ?? null,
                'dernier'   => $rd['dernier']   ?? null,
                'haut'      => $rd['haut']       ?? null,
                'bas'       => $rd['bas']         ?? null,
                'quantite'  => $rd['quantite']   ?? null,
                'volume'    => $rd['volume']     ?? null,
                'variation' => $rd['variation']  ?? null,
            ];
        }
    }

    // Méthode 2 fallback : thead/tbody classique
    if (empty($historique)) {
        preg_match_all('/<table[^>]*>(.*?)<\/table>/is', $html, $tables);
        foreach ($tables[1] as $tContent) {
            $up = strtoupper($tContent);
            if (strpos($up,'DATE')===false) continue;
            if (strpos($up,'VARIATION')===false && strpos($up,'DERNIER')===false && strpos($up,'LAST')===false) continue;

            preg_match('/<thead[^>]*>(.*?)<\/thead>/is', $tContent, $thM);
            $headers = [];
            if (!empty($thM[1])) {
                preg_match_all('/<th[^>]*>(.*?)<\/th>/is', $thM[1], $thC);
                $headers = array_map('cellText', $thC[1]);
            }
            $idx = ['date'=>0,'ouv'=>3,'der'=>1,'haut'=>2,'bas'=>3,'qte'=>4,'vol'=>5,'var'=>6];
            foreach ($headers as $i => $h) {
                $hu = strtoupper($h);
                if (strpos($hu,'DATE')!==false)                            $idx['date']=$i;
                elseif (strpos($hu,'OUVERTURE')!==false||strpos($hu,'OPEN')!==false)  $idx['ouv']=$i;
                elseif (strpos($hu,'DERNIER')!==false||strpos($hu,'LAST')!==false)    $idx['der']=$i;
                elseif (strpos($hu,'HAUT')!==false||strpos($hu,'HIGH')!==false)       $idx['haut']=$i;
                elseif (strpos($hu,'BAS')!==false||strpos($hu,'LOW')!==false)         $idx['bas']=$i;
                elseif (strpos($hu,'QUANTIT')!==false||strpos($hu,'CUM_VOL')!==false) $idx['qte']=$i;
                elseif (strpos($hu,'VOLUME')!==false||strpos($hu,'CUM_TUR')!==false)  $idx['vol']=$i;
                elseif (strpos($hu,'VARIATION')!==false||strpos($hu,'VAR')!==false)   $idx['var']=$i;
            }
            preg_match('/<tbody[^>]*>(.*?)<\/tbody>/is', $tContent, $tbM);
            $tbStr = $tbM[1] ?? $tContent;
            preg_match_all('/<tr[^>]*>(.*?)<\/tr>/is', $tbStr, $rows);
            foreach ($rows[1] as $row) {
                preg_match_all('/<td[^>]*>(.*?)<\/td>/is', $row, $cellM2);
                $c = array_map('cellText', $cellM2[1]);
                if (count($c) < 4) continue;
                $date = $c[$idx['date']] ?? '';
                if (!preg_match('/\d{2}[.\/-]\d{2}[.\/-]\d{4}/', $date)) continue;
                $historique[] = [
                    'date'      => $date,
                    'ouverture' => cleanNum($c[$idx['ouv']] ?? ''),
                    'dernier'   => cleanNum($c[$idx['der']] ?? ''),
                    'haut'      => cleanNum($c[$idx['haut']] ?? ''),
                    'bas'       => cleanNum($c[$idx['bas']] ?? ''),
                    'quantite'  => cleanNum(str_replace(' ','',$c[$idx['qte']]??'')),
                    'volume'    => cleanNum(str_replace(' ','',$c[$idx['vol']]??'')),
                    'variation' => cleanNum($c[$idx['var']] ?? ''),
                ];
            }
            if (!empty($historique)) break;
        }
    }
    return $historique;
}

// ── Extraire le cours actuel d'une page HTML ─────────────────────────────────
function extractCoursFromHtml($html) {
    $patterns = [
        '/<[^>]*class="[^"]*\blast\b[^"]*"[^>]*>\s*([\d\s,]+(?:[.,]\d+)?)\s*</i',
        '/<span[^>]*data-s="[^"]*LVAL_NORM[^"]*"[^>]*>\s*([\d\s,]+(?:[.,]\d+)?)\s*<\/span>/i',
        '/<[^>]*class="[^"]*cours[^"]*"[^>]*>\s*([\d\s,]+(?:[.,]\d+)?)\s*</i',
        '/class="[^"]*price[^"]*"[^>]*>\s*([\d\s,]+(?:[.,]\d+)?)\s*</i',
    ];
    foreach ($patterns as $p) {
        if (preg_match($p, $html, $m)) {
            $v = cleanNum($m[1]);
            if ($v && $v > 10) return $v;  // filtre les valeurs trop petites (indices)
        }
    }
    return null;
}

$res = bmceFetch($url, $cookieFile);
if ($res['code'] !== 200 || empty($res['html'])) {
    echo json_encode(['success'=>false,'error'=>'HTTP '.$res['code'].': '.$res['err'],'url'=>$url]); exit;
}
$html = preg_replace('/[\r\n\t]/', ' ', $res['html']);
$html = preg_replace('/  +/', ' ', $html);


// ══════════════════════════════════════════════════════════
//  HISTORIQUE — /bkbbourse/details/hiku/CODE
// ══════════════════════════════════════════════════════════
if ($tab === 'historique') {
    $historique = parseHistorique($html);

    $cours = array_filter(array_column($historique, 'dernier'));
    $hauts = array_filter(array_column($historique, 'haut'));
    $bas   = array_filter(array_column($historique, 'bas'));
    $vols  = array_filter(array_column($historique, 'volume'));

    echo json_encode([
        'success'    => true,
        'tab'        => 'historique',
        'historique' => $historique,
        'count'      => count($historique),
        'stats'      => [
            'plus_haut' => $hauts ? max($hauts)       : null,
            'plus_bas'  => $bas   ? min($bas)          : null,
            'cours_max' => $cours ? max($cours)        : null,
            'cours_min' => $cours ? min($cours)        : null,
            'vol_total' => $vols  ? array_sum($vols)   : null,
        ],
        'url'        => $res['final'],
        'timestamp'  => time(),
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    exit;
}


// ══════════════════════════════════════════════════════════
//  COTATION / CARNET D'ORDRES — /bkbbourse/details/CODE
//
//  Stratégie "dernier" cours :
//    1. Extraire depuis la page principale (spans/classes CSS)
//    2. Fallback → première entrée de l'historique hiku (séance fermée)
// ══════════════════════════════════════════════════════════
if ($tab === 'cotation' || $tab === 'carnet') {
    $achats = []; $ventes = []; $variation = null;
    $debugTables = [];  // pour diagnostics si debug=1

    // ── 1. Cours actuel depuis la page principale ──
    $coursActuel = extractCoursFromHtml($html);

    // ── Variation ──
    if (preg_match('/<[^>]*class="[^"]*nc2_pr[^"]*"[^>]*>\s*([+\-]?[\d\s,]+(?:[.,]\d+)?)\s*%?\s*</i', $html, $m)) {
        $variation = cleanNum(str_replace(['%', '+'], '', $m[1]));
    }

    // ── Carnet d'ordres BMCE Capital ──────────────────────────────────────────
    // Structure BMCE réelle :
    //   Table ACHATS  : thead → [NOMBRE | QTÉ | ACHAT | (barchart)]
    //                   tbody → [nombre | quantite | prix.lval_norm | barchart]
    //   Table VENTES  : thead → [(barchart) | VENTE | QTÉ | NOMBRE]
    //                   tbody → [barchart | prix.lval_norm | quantite | nombre]
    preg_match_all('/<table[^>]*>(.*?)<\/table>/is', $html, $tables);

    foreach ($tables[1] as $tContent) {
        $up = strtoupper($tContent);

        // ── Lire les headers (thead ou première <tr>) ──
        $headers = [];
        preg_match('/<thead[^>]*>(.*?)<\/thead>/is', $tContent, $thM);
        if (!empty($thM[1])) {
            preg_match_all('/<t[dh][^>]*>(.*?)<\/t[dh]>/is', $thM[1], $thCells);
            $headers = array_map('cellText', $thCells[1]);
        }
        if (empty($headers)) {
            preg_match('/<tr[^>]*>(.*?)<\/tr>/is', $tContent, $fr);
            if (!empty($fr[1])) {
                preg_match_all('/<t[dh][^>]*>(.*?)<\/t[dh]>/is', $fr[1], $frc);
                $cands = array_map('cellText', $frc[1]);
                foreach ($cands as $cv) { if (preg_match('/[a-zA-Z]/', $cv)) { $headers = $cands; break; } }
            }
        }
        $headStr = strtoupper(implode('|', $headers));

        // ── Détecter le type de table ──
        $isAchat = strpos($headStr,'ACHAT')!==false;
        $isVente = strpos($headStr,'VENTE')!==false;

        // Table non-carnet : skip
        if (!$isAchat && !$isVente) continue;

        // ── Trouver les indices de colonnes ──
        $colPrix = -1; $colQte = -1; $colNombre = -1;
        foreach ($headers as $i => $h) {
            $hu = strtoupper(trim($h));
            if (strpos($hu,'ACHAT')!==false || strpos($hu,'VENTE')!==false) $colPrix = $i;
            elseif (strpos($hu,'QT')!==false || strpos($hu,'QUANTIT')!==false) $colQte = $i;
            elseif (strpos($hu,'NOMBRE')!==false || strpos($hu,'NB ')!==false || $hu==='N' || $hu==='NB') $colNombre = $i;
        }

        // Fallback BMCE :
        //   ACHATS : col[0]=NOMBRE, col[1]=QTÉ, col[2]=ACHAT(prix), col[3]=barchart
        //   VENTES : col[0]=barchart, col[1]=VENTE(prix), col[2]=QTÉ, col[3]=NOMBRE
        if ($colPrix   < 0) $colPrix   = ($isAchat ? 2 : 1);
        if ($colQte    < 0) $colQte    = ($isAchat ? 1 : 2);
        if ($colNombre < 0) $colNombre = ($isAchat ? 0 : 3);

        // ── Extraire les lignes tbody ──
        preg_match('/<tbody[^>]*>(.*?)<\/tbody>/is', $tContent, $tbM);
        $tbStr = $tbM[1] ?? $tContent;
        preg_match_all('/<tr[^>]*>(.*?)<\/tr>/is', $tbStr, $rowM);

        $rows = [];
        foreach ($rowM[1] as $row) {
            preg_match_all('/<td[^>]*>(.*?)<\/td>/is', $row, $cellM);
            $c = array_map('cellText', $cellM[1]);
            if (count($c) < 3) continue;

            // Extraire prix depuis la cellule lval_norm si dispo (plus fiable)
            $prixVal = null;
            if (preg_match('/<td[^>]*class="[^"]*lval_norm[^"]*"[^>]*>(.*?)<\/td>/is', $row, $lv)) {
                $prixVal = cleanNum(cellText($lv[1]));
            }
            // Fallback : colonne détectée par header
            if (!$prixVal && isset($c[$colPrix])) $prixVal = cleanNum($c[$colPrix]);

            $qteVal    = isset($c[$colQte])    ? cleanNum(str_replace([' ', "\xc2\xa0"], '', $c[$colQte]))    : null;
            $nombreVal = isset($c[$colNombre]) ? cleanNum(str_replace([' ', "\xc2\xa0"], '', $c[$colNombre])) : null;

            if ($prixVal && $prixVal > 0 && $qteVal && $qteVal > 0) {
                $rows[] = [
                    'nombre'   => ($nombreVal && $nombreVal > 0) ? intval($nombreVal) : null,
                    'quantite' => intval($qteVal),
                    'prix'     => round($prixVal, 2),
                ];
            }
        }

        $debugTables[] = [
            'headers' => $headers, 'type' => ($isAchat ? 'ACHAT' : 'VENTE'),
            'colPrix' => $colPrix, 'colQte' => $colQte,
            'count' => count($rows), 'sample' => array_slice($rows, 0, 2)
        ];

        if ($isAchat && empty($achats))  $achats = $rows;
        elseif ($isVente && empty($ventes)) $ventes = $rows;
    }

    // ── Extraire données du jour depuis data-ticker spans ──────────────────
    $tickerData = [];
    // Utiliser un pattern large pour capturer le contenu de chaque span data-ticker
    preg_match_all('/<span[^>]+class="[^"]*data-ticker[^"]*"[^>]*>([\s\S]*?)<\/span>/i', $html, $tickerM);
    foreach ($tickerM[1] as $t) {
        $t = html_entity_decode(trim(preg_replace('/\s+/', ' ', $t)), ENT_QUOTES | ENT_HTML5, 'UTF-8');
        // Quantité — match "Quantit" suivi de tout jusqu'au ":"
        if (preg_match('/Quantit[^:]*:\s*([\d][^\r\n<]+)/iu', $t, $m)) {
            $raw = preg_replace('/[^\d,.]/', '', trim($m[1]));
            $tickerData['quantite_jour'] = cleanNum(str_replace(',', '.', $raw));
        } elseif (preg_match('/Ouverture\s*:\s*([\d][^\r\n<]+)/iu', $t, $m)) {
            $raw = preg_replace('/[^\d,.]/', '', trim($m[1]));
            $tickerData['ouverture_jour'] = cleanNum(str_replace(',', '.', $raw));
        } elseif (preg_match('/Haut\s*:\s*([\d][^\r\n<]+)/iu', $t, $m)) {
            $raw = preg_replace('/[^\d,.]/', '', trim($m[1]));
            $tickerData['haut_jour'] = cleanNum(str_replace(',', '.', $raw));
        } elseif (preg_match('/Bas\s*:\s*([\d][^\r\n<]+)/iu', $t, $m)) {
            $raw = preg_replace('/[^\d,.]/', '', trim($m[1]));
            $tickerData['bas_jour'] = cleanNum(str_replace(',', '.', $raw));
        }
    }
    // Volume (quantité en titres) depuis td.vol
    if (preg_match('/<td[^>]*class="[^"]*\bvol\b[^"]*"[^>]*>[\s\S]*?<span[^>]*>([\d][^<]+)<\/span>/i', $html, $volM)) {
        $raw = preg_replace('/[^\d]/', '', trim($volM[1]));
        if ($raw) $tickerData['volume_jour'] = (float)$raw;
    }

    // ── 2. Fallback dernier : historique hiku (fonctionne séance fermée) ──
    $dernierHistorique = null;
    $variationHistorique = null;
    $dateHistorique = null;
    if (!$coursActuel || $coursActuel <= 0) {
        $hikuUrl = "https://www.bmcecapitalbourse.com/bkbbourse/details/hiku/{$codeClean}";
        $resH = bmceFetch($hikuUrl, $cookieFile . '_hiku');
        if ($resH['code'] === 200 && !empty($resH['html'])) {
            $htmlH = preg_replace('/[\r\n\t]/', ' ', $resH['html']);
            $htmlH = preg_replace('/  +/', ' ', $htmlH);
            $hist  = parseHistorique($htmlH);
            if (!empty($hist)) {
                // La première entrée = séance la plus récente
                $dernierHistorique   = $hist[0]['dernier']   ?? null;
                $variationHistorique = $hist[0]['variation'] ?? null;
                $dateHistorique      = $hist[0]['date']      ?? null;
            }
        }
    }

    $coursSource = 'page';
    if (!$coursActuel || $coursActuel <= 0) {
        $coursActuel = $dernierHistorique;
        $coursSource = 'historique';  // indique que le cours vient de l'historique
        if (!$variation && $variationHistorique !== null) {
            $variation = $variationHistorique;
        }
    }

    $response = [
        'success'       => true,
        'tab'           => 'cotation',
        'cours_actuel'  => $coursActuel,
        'cours_source'  => $coursSource,   // 'page' = temps réel | 'historique' = séance précédente
        'date_dernier'  => $dateHistorique, // date de la séance si cours vient de l'historique
        'variation'     => $variation,
        'achats'        => array_slice($achats, 0, 10),
        'ventes'        => array_slice($ventes, 0, 10),
        'jour'          => $tickerData,
        'url'           => $res['final'],
        'timestamp'     => time(),
    ];
    // Mode debug : retourner les tables brutes pour diagnostic
    if (!empty($_GET['debug'])) {
        $response['debug_tables'] = $debugTables;
        $response['html_snippet'] = substr(strip_tags($html), 0, 2000);
    }
    echo json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    exit;
}


// ══════════════════════════════════════════════════════════
//  GRAPHIQUE — /bkbbourse/details/chartNew/CODE
// ══════════════════════════════════════════════════════════
if ($tab === 'graphique') {
    $series = [];

    // Highcharts inline : data:[[timestamp_ms, valeur], ...]
    if (preg_match_all('/\[\s*(\d{13})\s*,\s*([\d.]+)\s*\]/', $html, $pts)) {
        if (count($pts[1]) > 5) {
            for ($i = 0; $i < count($pts[1]); $i++) {
                $ts = intdiv(intval($pts[1][$i]), 1000);
                $series[] = [
                    'date'      => date('d/m/Y', $ts),
                    'timestamp' => intval($pts[1][$i]),
                    'cours'     => floatval($pts[2][$i]),
                ];
            }
        }
    }

    // Fallback : historique hiku
    if (empty($series)) {
        $hikuUrl = "https://www.bmcecapitalbourse.com/bkbbourse/details/hiku/{$codeClean}";
        $resH = bmceFetch($hikuUrl, $cookieFile . '_hiku');
        if ($resH['code'] === 200 && !empty($resH['html'])) {
            $htmlH = preg_replace('/[\r\n\t]/', ' ', $resH['html']);
            $htmlH = preg_replace('/  +/', ' ', $htmlH);
            $hist  = parseHistorique($htmlH);
            if (!empty($hist)) {
                $series = array_map(function($h) {
                    return ['date' => $h['date'], 'cours' => $h['dernier']];
                }, array_reverse($hist));
            }
        }
    }

    echo json_encode([
        'success'   => true,
        'tab'       => 'graphique',
        'series'    => $series,
        'count'     => count($series),
        'url'       => $res['final'],
        'timestamp' => time(),
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    exit;
}


// ══════════════════════════════════════════════════════════
//  SANTÉ FINANCIÈRE — indicateurs clés de la fiche valeur
// ══════════════════════════════════════════════════════════
if ($tab === 'sante') {
    $metrics = [];

    preg_match_all('/<table[^>]*>(.*?)<\/table>/is', $html, $tables);
    foreach ($tables[1] as $tContent) {
        preg_match_all('/<tr[^>]*>(.*?)<\/tr>/is', $tContent, $rowM);
        foreach ($rowM[1] as $row) {
            preg_match_all('/<t[dh][^>]*>(.*?)<\/t[dh]>/is', $row, $cellM);
            $cells = array_map('cellText', $cellM[1]);
            if (count($cells) < 2) continue;
            $lbl = strtoupper(trim($cells[0]));
            $val = trim($cells[1]);
            if      (strpos($lbl,'COURS')!==false && strpos($lbl,'DER')!==false) $metrics['cours_dernier']       = cleanNum($val);
            elseif  (strpos($lbl,'VARIATION')!==false && strpos($lbl,'%')!==false) $metrics['variation']         = cleanNum(str_replace('%','',$val));
            elseif  (strpos($lbl,'CAPITALIS')!==false)  $metrics['capitalisation']   = cleanNum($val);
            elseif  (strpos($lbl,'VOLUME')!==false && strpos($lbl,'CHAN')!==false) $metrics['volume_echange']    = cleanNum($val);
            elseif  (strpos($lbl,'HAUT')!==false && strpos($lbl,'52')!==false)   $metrics['plus_haut_52s']      = cleanNum($val);
            elseif  (strpos($lbl,'BAS')!==false  && strpos($lbl,'52')!==false)   $metrics['plus_bas_52s']       = cleanNum($val);
            elseif  (strpos($lbl,'PER')===0 || $lbl==='P/E' || strpos($lbl,'RATIO COURS')!==false) $metrics['per'] = cleanNum($val);
            elseif  (strpos($lbl,'RENDEMENT')!==false || (strpos($lbl,'DIVID')!==false && strpos($lbl,'%')!==false)) $metrics['rendement_dividende'] = cleanNum(str_replace('%','',$val));
            elseif  (strpos($lbl,'P/B')!==false || strpos($lbl,'PRICE/BOOK')!==false) $metrics['price_book']   = cleanNum($val);
            elseif  (strpos($lbl,'FLOTTANT')!==false)   $metrics['flottant']         = cleanNum(str_replace('%','',$val));
            elseif  (strpos($lbl,'NOMBRE TITRES')!==false || strpos($lbl,'NB TITRES')!==false) $metrics['nb_titres'] = cleanNum($val);
            elseif  (strpos($lbl,'OUVERTURE')!==false && strpos($lbl,'COURS')!==false) $metrics['ouverture']   = cleanNum($val);
            elseif  (strpos($lbl,'PLUS HAUT')!==false && strpos($lbl,'JOURN')!==false) $metrics['haut_jour']   = cleanNum($val);
            elseif  (strpos($lbl,'PLUS BAS')!==false  && strpos($lbl,'JOURN')!==false) $metrics['bas_jour']    = cleanNum($val);
        }
    }

    // Fallback cours depuis spans CSS
    if (empty($metrics['cours_dernier'])) {
        $v = extractCoursFromHtml($html);
        if ($v) $metrics['cours_dernier'] = $v;
    }

    // Fallback cours depuis historique hiku si toujours vide
    if (empty($metrics['cours_dernier'])) {
        $hikuUrl = "https://www.bmcecapitalbourse.com/bkbbourse/details/hiku/{$codeClean}";
        $resH = bmceFetch($hikuUrl, $cookieFile . '_hiku');
        if ($resH['code'] === 200 && !empty($resH['html'])) {
            $htmlH = preg_replace('/[\r\n\t]/', ' ', $resH['html']);
            $hist  = parseHistorique($htmlH);
            if (!empty($hist) && !empty($hist[0]['dernier'])) {
                $metrics['cours_dernier'] = $hist[0]['dernier'];
                $metrics['variation']     = $hist[0]['variation'] ?? null;
                $metrics['source_cours']  = 'historique';
            }
        }
    }

    // 52 semaines depuis historique hiku si toujours manquant
    if (empty($metrics['plus_haut_52s']) || empty($metrics['plus_bas_52s'])) {
        if (!isset($hist)) {
            $hikuUrl = "https://www.bmcecapitalbourse.com/bkbbourse/details/hiku/{$codeClean}";
            $resH2 = bmceFetch($hikuUrl, $cookieFile . '_hiku52');
            if ($resH2['code'] === 200) {
                $htmlH2 = preg_replace('/[\r\n\t]/', ' ', $resH2['html']);
                $hist = parseHistorique($htmlH2);
            }
        }
        if (!empty($hist)) {
            $hauts = array_filter(array_column($hist, 'haut'));
            $bas   = array_filter(array_column($hist, 'bas'));
            if (!empty($hauts) && empty($metrics['plus_haut_52s'])) $metrics['plus_haut_52s'] = max($hauts);
            if (!empty($bas)   && empty($metrics['plus_bas_52s']))  $metrics['plus_bas_52s']  = min($bas);
        }
    }

    echo json_encode([
        'success'   => true,
        'tab'       => 'sante',
        'metrics'   => $metrics,
        'url'       => $res['final'],
        'timestamp' => time(),
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    exit;
}

echo json_encode(['success'=>false,'error'=>'Tab inconnu: '.htmlspecialchars($tab)]);
