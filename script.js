// script.js - Version complète avec proxy PHP pour les vrais cours

// ── Formateur monétaire global (séparateurs de milliers fr-FR) ───────────────
function fmtMAD(val, decimals = 2) {
    return (+val).toLocaleString('fr-FR', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    });
}

// ============================================
// CODES BMCE EXACTS (depuis votre script Python)
// ============================================
const CODES_BMCE = {
    "Addoha": "2585582%2C102%2C608",
    "Attijariwafa Bank": "2585582%2C102%2C1",
    "Maroc Telecom": "2585582%2C102%2C30",
    "Managem": "2585582%2C102%2C54",
    "Marsa Maroc": "2585582%2C102%2C123",
    "BCP": "2585582%2C102%2C6",
    "TAQA Morocco": "2585582%2C102%2C135",
    "LafargeHolcim Maroc": "2585582%2C102%2C47",
    "TGCC": "2585582%2C102%2C129",
    "Ciments du Maroc": "2585582%2C102%2C21",
    "Cosumar": "2585582%2C102%2C24",
    "Akdital": "2585582%2C102%2C147",
    "Wafa Assurance": "2585582%2C102%2C140",
    "TotalEnergies Marketing Maroc": "2585582%2C102%2C133",
    "CIH Bank": "2585582%2C102%2C20",
    "Afriquia Gaz": "2585582%2C102%2C5",
    "Label Vie": "2585582%2C102%2C159",
    "Alliances": "2585582%2C102%2C8",
    "SMI": "2585582%2C102%2C96",
    "HPS": "2585582%2C102%2C41",
    "Mutandis": "2585582%2C102%2C166",
    "Oulmès": "2585582%2C102%2C70",
    "SOTHEMA": "2585582%2C102%2C99",
    "Disway": "2585582%2C102%2C151",
    "CTM": "2585582%2C102%2C25",
    "Aluminium du Maroc": "2585582%2C102%2C9",
    "S2M": "2585582%2C102%2C122",
    "Auto Hall": "2585582%2C102%2C13",
    "Auto Nejma": "2585582%2C102%2C14",
    "Risma": "2585582%2C102%2C88",
    "Résidences Dar Saada": "2585582%2C102%2C86",
    "Stroc Industrie": "2585582%2C102%2C114",
    "Microdata": "2585582%2C102%2C167",
    "M2M Group": "2585582%2C102%2C168",
    "Cartier Saada": "2585582%2C102%2C18",
    "SRM": "2585582%2C102%2C112",
    "SGTM": "2585582%2C102%2C90",
    "Cash Plus": "2585582%2C102%2C150",
    "Rebab Company": "2585582%2C102%2C85",
    "SALAFIN": "2585582%2C102%2C92",
    "SNEP": "2585582%2C102%2C97",
    "Sanlam Maroc": "2585582%2C102%2C164",
    "Sonasid": "2585582%2C102%2C106",
    "Sta Raisons": "2585582%2C102%2C108",
    "AFMA": "2585582%2C102%2C2",
    "Agma": "2585582%2C102%2C3",
    "Aradei Capital": "2585582%2C102%2C10",
    "AtlantaSanad": "2585582%2C102%2C11",
    "Balima": "2585582%2C102%2C15",
    "BMCI": "2585582%2C102%2C16",
    "Bank of Africa": "2585582%2C102%2C17",
    "CDM": "2585582%2C102%2C19",
    "CFG Bank": "2585582%2C102%2C22",
    "CMGP Group": "2585582%2C102%2C26",
    "CMT": "2585582%2C102%2C27",
    "Colorado": "2585582%2C102%2C28",
    "Dari Couspate": "2585582%2C102%2C31",
    "Delta Holding": "2585582%2C102%2C32",
    "Disty Technologies": "2585582%2C102%2C33",
    "Ennakl": "2585582%2C102%2C34",
    "Eqdom": "2585582%2C102%2C35",
    "Fenie Brossette": "2585582%2C102%2C36",
    "HPS": "2585582%2C102%2C41",
    "Immorente": "2585582%2C102%2C42",
    "INVOLYS": "2585582%2C102%2C43",
    "Jet Contractors": "2585582%2C102%2C44",
    "LafargeHolcim Maroc": "2585582%2C102%2C47",
    "Lesieur Cristal": "2585582%2C102%2C48",
    "Maghreb Oxygène": "2585582%2C102%2C52",
    "Maghrebail": "2585582%2C102%2C51",
    "Maroc Leasing": "2585582%2C102%2C55",
    "Marsa Maroc": "2585582%2C102%2C123",
    "Med Paper": "2585582%2C102%2C57",
    "Mutandis": "2585582%2C102%2C166",
    "Oulmès": "2585582%2C102%2C70",
    "Promopharm": "2585582%2C102%2C77",
    "Risma": "2585582%2C102%2C88",
    "S2M": "2585582%2C102%2C122",
    "Sanlam Maroc": "2585582%2C102%2C164",
    "SMI": "2585582%2C102%2C96",
    "SNA": "2585582%2C102%2C100",
    "SNEP": "2585582%2C102%2C97",
    "Sonasid": "2585582%2C102%2C106",
    "SOTHEMA": "2585582%2C102%2C99",
    "SRM": "2585582%2C102%2C112",
    "Stroc Industrie": "2585582%2C102%2C114",
    "TGCC": "2585582%2C102%2C129",
    "TotalEnergies": "2585582%2C102%2C133",
    "Unimer": "2585582%2C102%2C136",
    "Vicenne": "2585582%2C102%2C138",
    "Wafa Assurance": "2585582%2C102%2C140",
    "Zellidja": "2585582%2C102%2C142"
};

// ============================================
// CLASSE STOCK - Avec calculs exacts
// ============================================
class Stock {
    constructor(id, symbole, nom, quantite, prixAchat, prixActuel, frais = 0, dateAjout = null) {
        this.id = id;
        this.symbole = symbole;
        this.nom = nom;
        this.quantite = parseInt(quantite);
        this.prixAchat = parseFloat(prixAchat);
        this.prixActuel = parseFloat(prixActuel);
        this.frais = parseFloat(frais);
        this.dateAjout = dateAjout || new Date().toLocaleString('fr-FR', {
            day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });
        this.lastUpdate = new Date().toISOString();
        this.alertSent = false;
    }

    getPrixTotalHT() {
        return this.quantite * this.prixAchat;
    }

    getCommissionAchat() {
        return this.getPrixTotalHT() * COMMISSION;
    }

    getPrixTotalTTC() {
        return this.getPrixTotalHT() + this.getCommissionAchat();
    }

    getPrixUnitaireTTC() {
        return this.getPrixTotalTTC() / this.quantite;
    }

    getPrixVenteHT() {
        return this.quantite * this.prixActuel;
    }

    getCommissionVente() {
        return this.getPrixVenteHT() * COMMISSION;
    }

    getPrixVenteTTC() {
        return this.getPrixVenteHT() - this.getCommissionVente();
    }

    getProfitBrut() {
        return this.getPrixVenteTTC() - this.getPrixTotalTTC();
    }

    getTaxe() {
        const profitBrut = this.getProfitBrut();
        return profitBrut > 0 ? profitBrut * TAXE_PLUS_VALUE : 0;
    }

    getProfitNet() {
        const profitBrut = this.getProfitBrut();
        return profitBrut > 0 ? profitBrut - this.getTaxe() : profitBrut;
    }

    getPourcentage() {
        const prixTotalTTC = this.getPrixTotalTTC();
        return prixTotalTTC > 0 ? (this.getProfitNet() / prixTotalTTC) * 100 : 0;
    }

    isAlert() {
        const p = this.getPourcentage();
        return p > 0;
    }

    getAlertType() {
        const p = this.getPourcentage();
        if (p > 0) return 'profit';
        return null;
    }

    getFormattedDate() {
        // Retourne la vraie date d'ajout de la transaction (pas la date du jour)
        return this.dateAjout || '—';
    }
}

// ============================================
// SERVICE DE RÉCUPÉRATION DES PRIX BMCE - AVEC PROXY PHP
// ============================================
class PriceService {
    constructor() {
        this.prixBMCE = {}; // Stocke { symbole: { price, variation } }
        this.lastUpdate = null;
        
        // Mapping des noms BMCE vers les symboles (nouveaux tickers BMCE 2026)
        this.bmceToSymbol = {
            'Addoha': 'ADH',
            'AFMA': 'AFM',
            'Afric Indus.': 'AIS',
            'Afriquia Gaz': 'GAZ',
            'Agma': 'AGM',
            'Akdital': 'AKT',
            'Alliances': 'ADI',
            'Aluminium Maroc': 'ALM',
            'Aradei Capital': 'ARD',
            'ATLANTASANAD': 'ATL',
            'Attijariwafa Bank': 'ATW',
            'Auto Hall': 'ATH',
            'Auto Nejma': 'NEJ',
            'Balima': 'BAL',
            'BCP': 'BCP',
            'BMCI': 'BCI',
            'BoA': 'BOA',
            'Cartier Saada': 'CRS',
            'Cash Plus': 'CSH',
            'CDM': 'CDM',
            'CFG Bank': 'CFG',
            'CIH': 'CIH',
            'Ciments Maroc': 'CMA',
            'CMGP GROUP': 'CMG',
            'CMT': 'CMT',
            'Colorado': 'COL',
            'COSUMAR': 'CSR',
            'CTM': 'CTM',
            'Dari Couspate': 'DRI',
            'Delta Holding': 'DHO',
            'Disty Technolog': 'DST',
            'DISWAY': 'DWY',
            'Ennakl': 'NKL',
            'EQDOM': 'EQD',
            'FENIE BROSSETTE': 'FBR',
            'HPS': 'HPS',
            'IBMaroc.com': 'IBC',
            'Immorente': 'IMR',
            'INVOLYS': 'INV',
            'Jet Contractors': 'JET',
            'LABEL VIE': 'LBV',
            'LafargeHolcim': 'LHM',
            'Lesieur Cristal': 'LES',
            'M2M Group': 'M2M',
            'Maghreb Oxygene': 'MOX',
            'Maghrebail': 'MGB',
            'Managem': 'MNG',
            'Maroc Leasing': 'MLE',
            'Maroc Telecom': 'IAM',
            'Med Paper': 'MDP',
            'Microdata': 'MIC',
            'Mutandis': 'MUT',
            'Oulmes': 'OUL',
            'PROMOPHARM': 'PRO',
            'Rebab Company': 'REB',
            'Resid Dar Saada': 'RDS',
            'Risma': 'RIS',
            'S2M': 'S2M',
            'SALAFIN': 'SAL',
            'Sanlam Maroc': 'SAH',
            'SGTM': 'GTM',
            'SMI': 'SMI',
            'SNA': 'SNA',
            'SNEP': 'SNP',
            'Marsa Maroc': 'MSA',
            'SODEP': 'MSA',
            'Sonasid': 'SID',
            'SOTHEMA': 'SOT',
            'SRM': 'SRM',
            'Ste Boissons': 'SBM',
            'STROC Indus.': 'STI',
            'TAQA Morocco': 'TQM',
            'TGCC': 'TGC',
            'TotalEnergie MM': 'TMA',
            'Unimer': 'UMR',
            'Vicenne': 'VCN',
            'Wafa Assur': 'WAA',
            'Zellidja': 'ZDJ'
        };

        // Mapping anciens tickers → nouveaux tickers (pour compatibilité portefeuille)
        this.ancienVersNouveau = {
            'AUT': 'ATH',   // Auto Hall
            'CPL': 'CSH',   // Cash Plus
            'DAR': 'DRI',   // Dari Couspate
            'DIS': 'DWY',   // Disway
            'DYT': 'DST',   // Disty Technologies
            'GTM': 'SGM',   // SGTM
            'IMO': 'IMR',   // Immorente
            'LAB': 'LBV',   // Label Vie
            'MAB': 'MGB',   // Maghrebail
            'NKL': 'ENK',   // Ennakl
            'SLF': 'SAL',   // Salafin
            'SNE': 'SNP',   // SNEP
            'SOD': 'MSA',   // Ancien ticker Marsa Maroc → MSA
            'SDP': 'MSA',   // Ancien ticker Marsa Maroc → MSA
            'STR': 'STI',   // Stroc Industrie
            'ZEL': 'ZDJ',   // Zellidja
            'AFI': 'AIS',   // Afric Industries
            'IBM': 'IBC',   // IBMaroc.com
            'INV': 'INV',   // Involys (inchangé)
        };
    }

    // Charger via proxy PHP — essaie plusieurs hôtes (Python, MAMP port 80, MAMP port 8080)
    async fetchViaProxy() {
        const phpPath = 'api/bvc-proxy.php?_=' + Date.now();
        const candidates = [];

        // 1. Hôte courant (fonctionne si MAMP sert la page)
        candidates.push('');
        // 2. MAMP port 80
        candidates.push('http://localhost/bourse%20de%20casablanca/Claude/');
        // 3. MAMP port 8080
        candidates.push('http://localhost:8080/bourse%20de%20casablanca/Claude/');

        let result = null;
        for (const base of candidates) {
            try {
                const resp = await fetch(base + phpPath, { signal: AbortSignal.timeout(8000) });
                if (!resp.ok) continue;
                const text = await resp.text();
                // Si PHP non exécuté (Python server), le fichier commence par "<?php"
                if (text.trimStart().startsWith('<')) continue;
                result = JSON.parse(text);
                if (result.success && result.data) break;
                result = null;
            } catch(e) { /* essayer le prochain */ }
        }
        if (!result) return false;

        try {
            if (result.success && result.data) {
                const s = result.sources || {};
                const src = result.sources ? `BVC:${s.bvc||0} Yahoo:${s.yahoo||0} Wafa:${s.wafa||0} CDG:${s.cdg||0} BN:${s.boursenews||0} BMCE:${s.bmce||0}` : '';
                console.log(`✅ Proxy: ${result.count} cours reçus (${src})`);

                // ── Alerte données périmées ──────────────────────────────
                const staleEl = document.getElementById('stale-data-banner');
                if (result.stale) {
                    const msg = result.stale_reason || 'Données potentiellement périmées';
                    if (staleEl) {
                        staleEl.textContent = `⚠️ ${msg}. Rechargez dans quelques minutes.`;
                        staleEl.style.display = 'block';
                    } else {
                        const banner = document.createElement('div');
                        banner.id = 'stale-data-banner';
                        banner.style.cssText = 'background:#b94040;color:#fff;text-align:center;padding:8px 16px;font-size:0.85em;font-weight:600;position:sticky;top:0;z-index:9999;border-radius:6px;margin:8px 0;';
                        banner.textContent = `⚠️ ${msg}. Rechargez dans quelques minutes.`;
                        const marcheView = document.getElementById('view-marches');
                        if (marcheView) marcheView.prepend(banner);
                    }
                } else if (staleEl) {
                    staleEl.style.display = 'none';
                }

                this.prixBMCE = {};
                let compteur = 0, nonTrouves = [];

                result.data.forEach(item => {
                    // Symbole direct depuis bvc-proxy (Yahoo Finance .CS)
                    let symboleTrouve = item.symbole || null;

                    // Fallback mapping par nom si symbole absent
                    if (!symboleTrouve) {
                        symboleTrouve = this.bmceToSymbol[item.name];
                        if (!symboleTrouve) {
                            for (let s of SOCIETES) {
                                if (item.name.toLowerCase().includes(s.nom.toLowerCase()) ||
                                    s.nom.toLowerCase().includes(item.name.toLowerCase())) {
                                    symboleTrouve = s.symbole; break;
                                }
                            }
                        }
                    }

                    if (symboleTrouve) {
                        this.prixBMCE[symboleTrouve] = {
                            price: item.price,
                            variation: item.variation,
                            source: item.source || 'yahoo'
                        };
                        compteur++;
                    } else {
                        nonTrouves.push(item.name);
                    }
                });

                console.log(`🎯 ${compteur} cours mis à jour`);
                if (nonTrouves.length > 0) console.log('📋 Non reconnus:', nonTrouves);

                this.lastUpdate = new Date().toLocaleString('fr-FR');
                // Sauvegarder dans localStorage pour fallback offline
                this.saveCachedPrices(this.prixBMCE);
                return true;
            }
        } catch (error) {
            console.error('❌ Erreur proxy:', error);
        }
        return false;
    }

    // Méthode principale d'extraction
    async getAllPrices() {
        // Essayer d'abord le proxy PHP
        const proxySuccess = await this.fetchViaProxy();
        if (proxySuccess) {
            return this.prixBMCE;
        }
        
        // Proxy échoué — essayer le cache localStorage (dernières données connues)
        const cached = this.getCachedPrices();
        if (cached && Object.keys(cached).length > 0) {
            const age = Math.round((Date.now() - (this._cacheTs || 0)) / 60000);
            console.log(`⚠️ Proxy indisponible — utilisation cache local (${age} min)`);
            return cached;
        }
        console.log('⚠️ Proxy indisponible, utilisation des prix de secours');
        return this.getFallbackPrices();
    }

    // Sauvegarder les données proxy dans localStorage
    saveCachedPrices(data) {
        try {
            localStorage.setItem('bvc_prix_cache', JSON.stringify({ ts: Date.now(), data }));
        } catch(e) {}
    }

    // Lire le cache localStorage (valide 4h max)
    getCachedPrices() {
        try {
            const raw = localStorage.getItem('bvc_prix_cache');
            if (!raw) return null;
            const { ts, data } = JSON.parse(raw);
            this._cacheTs = ts;
            const age = Date.now() - ts;
            if (age > 4 * 3600 * 1000) return null; // expiré après 4h
            return data;
        } catch(e) { return null; }
    }

    getFallbackPrices() {
        // Convertir FALLBACK_PRICES au même format { price, variation }
        const fallback = {};
        for (let [symbole, prix] of Object.entries(FALLBACK_PRICES)) {
            fallback[symbole] = {
                price: prix,
                variation: 0
            };
        }
        return fallback;
    }

    // Résoudre un ticker (ancien→nouveau si nécessaire)
    resolveSymbole(symbole) {
        return this.ancienVersNouveau[symbole] || symbole;
    }

    async getPrice(symbole) {
        const allPrices = await this.getAllPrices();
        // Essayer d'abord le symbole direct, puis le nouveau ticker
        const resolved = this.resolveSymbole(symbole);
        return allPrices[symbole]?.price || allPrices[resolved]?.price || FALLBACK_PRICES[symbole] || FALLBACK_PRICES[resolved] || 100;
    }

    // Obtenir les données (prix + variation) en gérant les anciens tickers
    getData(symbole) {
        const resolved = this.resolveSymbole(symbole);
        return this.prixBMCE[symbole] || this.prixBMCE[resolved] || null;
    }
}

// ============================================
// GESTIONNAIRE DU PORTEFEUILLE
// ============================================
class PortfolioManager {
    constructor() {
        this.stocks = [];
        this._filtreProfit = false;
        this._filtreTx     = null;   // null | 'trading' | 'investissement'
        this._filtreSens   = null;   // null | 'positif' | 'negatif'
        this._sortCol      = null;
        this._sortDir      = 'asc';
        this.priceService = new PriceService();
        this.load();
        this.setupEvents();
        this.initEmail();
        this.render();
        
        const iframe = document.getElementById('bmceFrame');
        if (iframe) {
            iframe.onload = () => {
                console.log('✅ Iframe BMCE chargé');
                setTimeout(() => {
                    this.priceService.getAllPrices().then(() => {
                        this.updatePrixFormulaire();
                        this.updateEmailStatus();
                        this.afficherSocietesCotees();
                    });
                }, 2000);
            };
        }

        setTimeout(() => this.updateEmailStatus(), 1000);
        this.populateCompanySelect();
        
        // Charger les prix au démarrage
        setTimeout(() => {
            this.priceService.getAllPrices().then(() => {
                this.afficherSocietesCotees();
            });
        }, 1000);
    }

    populateCompanySelect() {
        const select = document.getElementById('symbol');
        if (!select) return;
        
        select.innerHTML = '<option value="">Sélectionnez...</option>';
        
        SOCIETES.sort((a, b) => a.nom.localeCompare(b.nom)).forEach(s => {
            const option = document.createElement('option');
            option.value = s.symbole;
            option.textContent = `${s.symbole} - ${s.nom}`;
            select.appendChild(option);
        });
    }

    updateEmailStatus() {
        const statusEl = document.getElementById('emailStatus');
        if (!statusEl) return;

        if (typeof emailjs === 'undefined') {
            statusEl.className = 'pill error';
            statusEl.innerHTML = '❌ EmailJS non chargé';
        } else if (!EMAILJS_READY) {
            statusEl.className = 'pill warn';
            statusEl.innerHTML = '⏳ Initialisation EmailJS...';
            if (typeof initEmailJS === 'function') {
                initEmailJS();
            }
        } else {
            statusEl.className = 'pill ok';
            statusEl.innerHTML = '✅ Alertes email actives';
        }
    }

    updatePrixFormulaire() {
        const symbolSelect = document.getElementById('symbol');
        const priceInput = document.getElementById('currentPrice');
        
        if (symbolSelect && priceInput) {
            const symbole = symbolSelect.value;
            if (symbole) {
                const data = this.priceService.getData(symbole);
                if (data) priceInput.value = data.price;
            }
        }
    }

    // Corrections de tickers obsolètes (anciens → nouveaux)
    static migrateTickeur(symbole) {
        const corrections = {
            'AKD': 'AKT', 'COS': 'CSR',
            'SOD': 'MSA', 'SDP': 'MSA'  // Marsa Maroc : anciens tickers → MSA
        };
        return corrections[symbole] || symbole;
    }

    load() {
        const saved = localStorage.getItem('portfolio_casa');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                let migrated = false;
                this.stocks = data.map(s => {
                    const symbole = PortfolioManager.migrateTickeur(s.symbole);
                    if (symbole !== s.symbole) migrated = true;
                    const nom = (typeof COMPANY_NAMES !== 'undefined' && COMPANY_NAMES[symbole]) || s.nom;
                    return new Stock(s.id, symbole, nom, s.quantite, s.prixAchat, s.prixActuel, s.frais, s.dateAjout);
                });
                if (migrated) {
                    this.save();
                    console.log('🔄 Tickers migrés et sauvegardés');
                }
                console.log(`📂 ${this.stocks.length} transactions chargées`);
            } catch (e) {
                console.error('Erreur chargement', e);
                this.stocks = [];
            }
        } else {
            // localStorage vide (mobile / IP changée) → restaurer depuis le serveur
            this._tryRestoreFromServer();
        }
    }

    async _tryRestoreFromServer() {
        const tok = localStorage.getItem('auth_token');
        const url = tok
            ? 'api/portfolio-sync.php?token=' + encodeURIComponent(tok)
            : 'api/portfolio-sync.php';
        try {
            const r = await fetch(url);
            const d = await r.json();
            if (d.ok && Array.isArray(d.data) && d.data.length > 0) {
                this.stocks = d.data.map(s => {
                    const symbole = PortfolioManager.migrateTickeur(s.symbole);
                    const nom = (typeof COMPANY_NAMES !== 'undefined' && COMPANY_NAMES[symbole]) || s.nom;
                    return new Stock(s.id, symbole, nom, s.quantite, s.prixAchat, s.prixActuel, s.frais, s.dateAjout);
                });
                localStorage.setItem('portfolio_casa', JSON.stringify(this.stocks));
                // Restaurer les tags depuis le serveur
                if (d.tags && typeof d.tags === 'object' && Object.keys(d.tags).length > 0) {
                    localStorage.setItem('portfolio_tags', JSON.stringify(d.tags));
                    console.log(`🏷️ ${Object.keys(d.tags).length} tags restaurés depuis le serveur`);
                }
                // Restaurer l'historique de performance depuis le serveur
                if (d.history && Array.isArray(d.history) && d.history.length > 0) {
                    localStorage.setItem('portfolio_history', JSON.stringify(d.history));
                    console.log(`📈 ${d.history.length} entrées historique restaurées depuis le serveur`);
                }
                if (d.historySym && typeof d.historySym === 'object' && Object.keys(d.historySym).length > 0) {
                    localStorage.setItem('portfolio_history_sym', JSON.stringify(d.historySym));
                }
                this.render();
                this.showNotification('📥 Portefeuille, tags et historique restaurés', 'info');
                console.log(`☁️ ${this.stocks.length} transactions restaurées depuis le serveur`);
            }
        } catch(e) {
            console.warn('⚠️ Impossible de restaurer le portefeuille depuis le serveur');
        }
    }

    save() {
        localStorage.setItem('portfolio_casa', JSON.stringify(this.stocks));
        // Synchroniser avec le serveur (stocks + tags + historique ensemble)
        const tok = localStorage.getItem('auth_token');
        const url = tok
            ? 'api/portfolio-sync.php?token=' + encodeURIComponent(tok)
            : 'api/portfolio-sync.php';
        let history = [], historySym = {};
        try { history    = JSON.parse(localStorage.getItem('portfolio_history')     || '[]'); } catch(e) {}
        try { historySym = JSON.parse(localStorage.getItem('portfolio_history_sym') || '{}'); } catch(e) {}
        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                data:       this.stocks,
                tags:       this._loadTags(),
                history:    history,
                historySym: historySym,
            })
        }).catch(() => {});
    }

    // Charger le portefeuille depuis le serveur (après connexion)
    async loadFromServer() {
        const tok = localStorage.getItem('auth_token');
        if (!tok) return;
        try {
            const r = await fetch('api/portfolio-sync.php?token=' + encodeURIComponent(tok));
            const d = await r.json();
            if (d.ok && Array.isArray(d.data) && d.data.length > 0) {
                let migrated = false;
                this.stocks = d.data.map(s => {
                    const symbole = PortfolioManager.migrateTickeur(s.symbole);
                    if (symbole !== s.symbole) migrated = true;
                    const nom = (typeof COMPANY_NAMES !== 'undefined' && COMPANY_NAMES[symbole]) || s.nom;
                    return new Stock(s.id, symbole, nom, s.quantite, s.prixAchat, s.prixActuel, s.frais, s.dateAjout);
                });
                if (migrated) this.save();
                localStorage.setItem('portfolio_casa', JSON.stringify(this.stocks));
                // Restaurer les tags depuis le serveur
                if (d.tags && typeof d.tags === 'object' && Object.keys(d.tags).length > 0) {
                    localStorage.setItem('portfolio_tags', JSON.stringify(d.tags));
                    console.log(`🏷️ ${Object.keys(d.tags).length} tags restaurés depuis le serveur`);
                }
                // Restaurer l'historique de performance depuis le serveur
                if (d.history && Array.isArray(d.history) && d.history.length > 0) {
                    localStorage.setItem('portfolio_history', JSON.stringify(d.history));
                    console.log(`📈 ${d.history.length} entrées historique restaurées depuis le serveur`);
                }
                if (d.historySym && typeof d.historySym === 'object' && Object.keys(d.historySym).length > 0) {
                    localStorage.setItem('portfolio_history_sym', JSON.stringify(d.historySym));
                }
                this.render();
                console.log(`☁️ ${this.stocks.length} transactions chargées depuis le serveur`);
            }
        } catch(e) {
            console.warn('⚠️ Impossible de charger le portefeuille depuis le serveur');
        }
    }

    initEmail() {
        try {
            if (typeof emailjs !== 'undefined' && EMAIL_CONFIG && EMAIL_CONFIG.userId) {
                emailjs.init(EMAIL_CONFIG.userId);
                EMAILJS_READY = true;
                console.log('✅ EmailJS initialisé');
            } else if (typeof initEmailJS === 'function') {
                initEmailJS();
            }
        } catch (e) {
            console.warn('⚠️ EmailJS non configuré');
        }
    }

    async refreshAllPrices() {
        if (this.stocks.length === 0) {
            this.showNotification('ℹ️ Aucune action dans le portefeuille', 'info');
            return;
        }

        this.showNotification('🔄 Mise à jour des cours depuis le tableau des marchés…', 'info');

        // Si prixBMCE est vide (marchés pas encore chargés), on récupère d'abord
        const nbPrixDispo = Object.keys(this.priceService.prixBMCE).length;
        if (nbPrixDispo === 0) {
            await this.priceService.getAllPrices();
            // Rafraîchir aussi l'affichage des marchés
            await this.afficherSocietesCotees();
        }

        let count = 0;
        let nonTrouves = [];

        this.stocks.forEach(stock => {
            const data = this.priceService.getData(stock.symbole);
            if (data && data.price > 0) {
                stock.prixActuel = data.price;
                stock.lastUpdate = new Date().toISOString();
                stock.alertSent = false;
                count++;
            } else {
                nonTrouves.push(stock.symbole);
            }
        });

        this.save();
        this.render();
        this.updateTimestamp();

        if (count > 0) {
            this.showNotification(`✅ ${count} cours synchronisés depuis les marchés`, 'success');
        }
        if (nonTrouves.length > 0) {
            setTimeout(() => {
                this.showNotification(`⚠️ Cours non trouvés : ${nonTrouves.join(', ')}`, 'warning');
            }, 1000);
        }

        this.checkAlertesSuivi();
    }

    async addStock(stock) {
        if (!stock.prixActuel || isNaN(stock.prixActuel) || stock.prixActuel === 0) {
            const prixBMCE = await this.priceService.getPrice(stock.symbole);
            stock.prixActuel = prixBMCE;
        }
        
        this.stocks.push(stock);
        this.save();
        this.render();
        this.showNotification(`✅ ${stock.nom} ajouté au portefeuille`, 'success');
        this.checkAlert(stock);
    }

    updatePrice(id, newPrice) {
        const stock = this.stocks.find(s => s.id === id);
        if (stock) {
            stock.prixActuel = parseFloat(newPrice);
            stock.lastUpdate = new Date().toISOString();
            stock.alertSent = false;
            this.save();
            this.render();
            this.checkAlert(stock);
            this.showNotification(`✅ Prix ${stock.symbole} mis à jour`, 'success');
        }
    }

    editCell(td, type, id, field) {
        // Éviter double déclenchement si déjà en édition
        if (td.querySelector('input')) return;

        const stock = this.stocks.find(s => s.id === id);
        if (!stock) return;

        // Valeur brute selon le champ
        let rawValue;
        if (field === 'nom')       rawValue = stock.nom;
        else if (field === 'quantite')  rawValue = stock.quantite;
        else if (field === 'prixAchat') rawValue = stock.prixAchat;
        else if (field === 'prixActuel') rawValue = stock.prixActuel;

        // Mémoriser le contenu original pour annulation
        const originalHTML = td.innerHTML;
        td.classList.add('editing');

        const input = document.createElement('input');
        input.type = type;
        input.value = rawValue;
        input.className = 'cell-edit-input';
        if (type === 'number') { input.step = '0.01'; input.min = '0'; }
        td.innerHTML = '';
        td.appendChild(input);
        input.focus();
        input.select();

        const save = () => {
            const val = input.value.trim();
            if (val === '' || (type === 'number' && (isNaN(val) || parseFloat(val) <= 0))) {
                cancel();
                return;
            }
            if (field === 'nom')        stock.nom = val;
            else if (field === 'quantite')   stock.quantite = parseInt(val);
            else if (field === 'prixAchat')  stock.prixAchat = parseFloat(val);
            else if (field === 'prixActuel') {
                stock.prixActuel = parseFloat(val);
                stock.lastUpdate = new Date().toISOString();
                stock.alertSent = false;
            }
            this.save();
            this.render();
            this.checkAlert(stock);
            this.showNotification(`✅ ${field === 'nom' ? 'Nom' : field === 'quantite' ? 'Quantité' : field === 'prixAchat' ? 'Prix d\'achat' : 'Cours'} mis à jour`, 'success');
        };

        const cancel = () => {
            td.classList.remove('editing');
            td.innerHTML = originalHTML;
        };

        input.addEventListener('keydown', e => {
            if (e.key === 'Enter')  { e.preventDefault(); save(); }
            if (e.key === 'Escape') { e.preventDefault(); cancel(); }
        });
        input.addEventListener('blur', () => setTimeout(save, 150));
    }

    removeStock(id) {
        if (confirm('Supprimer cette transaction ?')) {
            this.stocks = this.stocks.filter(s => s.id !== id);
            this.save();
            this.render();
            this.showNotification('✅ Transaction supprimée', 'success');
        }
    }

    checkAlert(stock) {
        // Unused per-stock check — kept for compatibility
    }

    // ── ALERTES PERSONNALISÉES PAR LIGNE ─────────────────────────────────────
    static LS_ALERTE = 'portfolio_alertes_perso_v1';

    getAlertesPerso() {
        try { return JSON.parse(localStorage.getItem(PortfolioManager.LS_ALERTE) || '{}'); } catch { return {}; }
    }

    saveAlertePerso(key, data) {
        const all = this.getAlertesPerso();
        if (data === null) { delete all[key]; }
        else { all[key] = { ...all[key], ...data, updatedAt: Date.now() }; }
        localStorage.setItem(PortfolioManager.LS_ALERTE, JSON.stringify(all));
    }

    ouvrirAlertePerso(key, nom, currentProfit, currentPct) {
        const all    = this.getAlertesPerso();
        const cfg    = all[key] || {};
        const modal  = document.getElementById('modal-alerte-perso');
        if (!modal) return;
        document.getElementById('alp-nom').textContent     = nom;
        document.getElementById('alp-actuel').textContent  =
            `Actuel : ${currentProfit >= 0 ? '+' : ''}${currentProfit.toFixed(2)} MAD  /  ${currentPct >= 0 ? '+' : ''}${currentPct.toFixed(2)}%`;
        document.getElementById('alp-profit').value        = cfg.profitMAD  ?? '';
        document.getElementById('alp-pct').value           = cfg.variationPct ?? '';
        document.getElementById('alp-key').value           = key;
        modal.style.display = 'flex';
    }

    sauvegarderAlertePerso() {
        const key    = document.getElementById('alp-key').value;
        const profit = parseFloat(document.getElementById('alp-profit').value);
        const pct    = parseFloat(document.getElementById('alp-pct').value);
        if (isNaN(profit) && isNaN(pct)) { this.supprimerAlertePerso(key); return; }
        this.saveAlertePerso(key, {
            profitMAD:    isNaN(profit) ? null : profit,
            variationPct: isNaN(pct)    ? null : pct,
            sentToday:    null,
        });
        document.getElementById('modal-alerte-perso').style.display = 'none';
        this.render();
        this.showNotification(`🔔 Alerte configurée`, 'success');
    }

    supprimerAlertePerso(key) {
        this.saveAlertePerso(key, null);
        document.getElementById('modal-alerte-perso').style.display = 'none';
        this.render();
        this.showNotification('🔕 Alerte supprimée', 'info');
    }

    async checkAlertesPerso() {
        // Remplacé par checkAlertesTag() — alertes maintenant basées sur les tags
        return;
        const all   = this.getAlertesPerso();
        if (Object.keys(all).length === 0) return;
        const today = new Date().toISOString().slice(0, 10);

        for (const [key, cfg] of Object.entries(all)) {
            if (!cfg) continue;
            if (cfg.sentToday === today) continue; // déjà envoyé avec succès aujourd'hui

            let currentProfit = null, currentPct = null, nom = key;

            if (key.startsWith('sym_')) {
                // Ligne consolidée par symbole
                const sym = key.slice(4);
                const txs = this.stocks.filter(s => s.symbole === sym);
                if (!txs.length) continue;
                const totalTTC = txs.reduce((s, t) => s + t.getPrixTotalTTC(), 0);
                const commVente = txs.reduce((s, t) => s + t.quantite * t.prixActuel * COMMISSION, 0);
                const valVente  = txs.reduce((s, t) => s + t.quantite * t.prixActuel, 0) - commVente;
                const profitBrut = valVente - totalTTC;
                const taxe = profitBrut > 0 ? profitBrut * TAXE_PLUS_VALUE : 0;
                currentProfit = profitBrut > 0 ? profitBrut - taxe : profitBrut;
                currentPct    = totalTTC > 0 ? (currentProfit / totalTTC) * 100 : 0;
                nom = (typeof COMPANY_NAMES !== 'undefined' && COMPANY_NAMES[sym]) || sym;
            } else if (key.startsWith('tx_')) {
                // Transaction individuelle
                const txId = key.slice(3);
                const tx   = this.stocks.find(s => s.id === txId);
                if (!tx) continue;
                currentProfit = tx.getProfitNet();
                currentPct    = tx.getPourcentage();
                nom = `${(typeof COMPANY_NAMES !== 'undefined' && COMPANY_NAMES[tx.symbole]) || tx.symbole} (${tx.getFormattedDate()})`;
            }
            if (currentProfit === null) continue;

            // Vérifier seuils — chaque critère déclenche indépendamment (OR)
            const hasProfitTarget = cfg.profitMAD    !== null && cfg.profitMAD    !== undefined;
            const hasPctTarget    = cfg.variationPct !== null && cfg.variationPct !== undefined;
            const profitOK = hasProfitTarget && currentProfit >= cfg.profitMAD;
            const pctOK    = hasPctTarget    && currentPct    >= cfg.variationPct;
            // Déclencher si AU MOINS UN critère défini est atteint
            const triggered = profitOK || pctOK;
            if (!hasProfitTarget && !hasPctTarget) continue;
            if (!triggered) continue;

            // Construire email HTML
            const now  = new Date().toLocaleString('fr-FR', {day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit',second:'2-digit'});
            const cond = [
                cfg.profitMAD    != null ? `Profit ≥ ${cfg.profitMAD} MAD` : null,
                cfg.variationPct != null ? `Variation ≥ ${cfg.variationPct}%`  : null,
            ].filter(Boolean).join(' OU ');

            const html = `<div style="font-family:Arial,sans-serif;max-width:500px;background:#0d1117;color:#e6edf3;padding:24px;border-radius:10px;">
                <h2 style="color:#3fb950;margin:0 0 16px;">🔔 Alerte seuil atteint</h2>
                <table style="width:100%;border-collapse:collapse;font-size:14px;">
                    <tr><td style="color:#8b949e;padding:6px 0;">Ligne</td><td style="font-weight:bold;">${nom}</td></tr>
                    <tr><td style="color:#8b949e;padding:6px 0;">Seuil</td><td style="color:#f0b429;">${cond}</td></tr>
                    <tr><td style="color:#8b949e;padding:6px 0;">Profit actuel</td><td style="color:#3fb950;font-weight:bold;">${currentProfit >= 0 ? '+' : ''}${currentProfit.toFixed(2)} MAD</td></tr>
                    <tr><td style="color:#8b949e;padding:6px 0;">Variation</td><td style="color:#3fb950;font-weight:bold;">${currentPct >= 0 ? '+' : ''}${currentPct.toFixed(2)}%</td></tr>
                    <tr><td style="color:#8b949e;padding:6px 0;">Heure</td><td>${now}</td></tr>
                </table>
            </div>`;
            const subject = `🔔 Alerte seuil — ${nom} : ${currentProfit >= 0 ? '+' : ''}${currentProfit.toFixed(2)} MAD / ${currentPct >= 0 ? '+' : ''}${currentPct.toFixed(2)}%`;
            const ejsP = { to_email: EMAIL_CONFIG.to, from_name:'Bourse Casa', stock_name:nom, alert_type:'🔔 SEUIL ATTEINT', percentage:`${currentPct >= 0 ? '+' : ''}${currentPct.toFixed(2)}%`, profit_loss:`${currentProfit >= 0 ? '+' : ''}${currentProfit.toFixed(2)} MAD`, current_price:cond, buy_price:'—', quantity:'—', total_value:'—', alert_time:now };

            this.showNotification(`🔔 ${nom} — seuil atteint ! Envoi email…`, 'profit');
            const sent = await this._envoyerEmail(subject, html, ejsP);
            // Marquer "envoyé aujourd'hui" SEULEMENT si l'email a réussi
            if (sent) {
                this.saveAlertePerso(key, { sentToday: today });
                this.showNotification(`✅ ${nom} — alerte email envoyée`, 'success');
            } else {
                this.showNotification(`⚠️ ${nom} — seuil atteint mais email échoué (vérifiez config email)`, 'error');
            }
        }
    }

    // Indicateur visuel 🔔 / 🔕 par clé d'alerte
    _bellBtn(key, nom, currentProfit, currentPct) {
        const all    = this.getAlertesPerso();
        const hasA   = !!all[key];
        const col    = hasA ? '#f0b429' : 'var(--text3)';
        const icon   = hasA ? '🔔' : '🔕';
        const safeNom = (nom || '').replace(/\\/g,'\\\\').replace(/'/g,"\\'").replace(/"/g,'&quot;');
        const p = isNaN(currentProfit) ? 0 : parseFloat(currentProfit).toFixed(4);
        const v = isNaN(currentPct)    ? 0 : parseFloat(currentPct).toFixed(4);
        return `<button onclick="event.stopPropagation();portfolioManager.ouvrirAlertePerso('${key}','${safeNom}',${p},${v})"
            title="${hasA ? 'Modifier alerte' : 'Définir une alerte'}"
            style="background:none;border:1px solid ${col};border-radius:6px;color:${col};
                   cursor:pointer;font-size:0.8em;padding:2px 6px;line-height:1.4;white-space:nowrap;">${icon}</button>`;
    }

    // ── Alertes automatiques par TAG ─────────────────────────────────────────
    // • tag "liquider"  → 1 email consolidé par jour regroupant toutes les positions en profit
    // • tag "trading"   → alerte dès que profitNet ≥ seuil configurable (localStorage)
    checkAlertesSuivi() { this.checkAlertesTag(); } // alias pour compat appels existants

    // ── Alerte "À liquider" consolidée — 1 seul email par jour ───────────────
    async checkAlertesLiquider(force = false) {
        if (this.stocks.length === 0) {
            this.showNotification('ℹ️ Aucune transaction dans le portefeuille', 'info');
            return;
        }
        const tags  = this._loadTags();
        const today = new Date().toISOString().slice(0, 10);
        const stKey = 'alertes_liquider_daily_' + today;

        if (!force && localStorage.getItem(stKey)) {
            this.showNotification('ℹ️ Alerte "À liquider" déjà envoyée aujourd\'hui', 'info');
            return;
        }

        // Collecter toutes les positions "À liquider" en profit positif
        const symbols  = [...new Set(this.stocks.map(s => s.symbole))];
        const enProfit = [];

        symbols.forEach(symbole => {
            const companyTag = tags[symbole] || '';
            const txsForSym  = this.stocks.filter(s => s.symbole === symbole);
            const nom = (typeof COMPANY_NAMES !== 'undefined' && COMPANY_NAMES[symbole]) || txsForSym[0]?.nom || symbole;

            if (companyTag === 'liquider') {
                // Tag société → profit consolidé
                const profitNet = txsForSym.reduce((s, tx) => s + tx.getProfitNet(), 0);
                const investi   = txsForSym.reduce((s, tx) => s + tx.getPrixTotalTTC(), 0);
                const qte       = txsForSym.reduce((s, tx) => s + tx.quantite, 0);
                if (profitNet > 0) enProfit.push({
                    nom, symbole, qte,
                    prixActuel : txsForSym[0]?.prixActuel || 0,
                    investi, profitNet,
                    pct : investi > 0 ? profitNet / investi * 100 : 0,
                    niveau : 'société',
                });
            } else {
                // Tags individuels
                txsForSym.forEach(tx => {
                    if ((tags['tx_' + tx.id] || '') !== 'liquider') return;
                    const profitNet = tx.getProfitNet();
                    if (profitNet <= 0) return;
                    const investi = tx.getPrixTotalTTC();
                    enProfit.push({
                        nom, symbole,
                        qte        : tx.quantite,
                        prixActuel : tx.prixActuel,
                        investi, profitNet,
                        pct        : investi > 0 ? profitNet / investi * 100 : 0,
                        niveau     : 'transaction',
                    });
                });
            }
        });

        if (enProfit.length === 0) {
            this.showNotification('ℹ️ Aucune position "À liquider" en profit positif pour l\'instant', 'info');
            return;
        }

        // Trier par profit décroissant
        enProfit.sort((a, b) => b.profitNet - a.profitNet);

        // Construire l'email consolidé
        const now     = new Date().toLocaleString('fr-FR', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' });
        const totalPL = enProfit.reduce((s, p) => s + p.profitNet, 0);

        const lignesHtml = enProfit.map(p => `
            <tr style="border-bottom:1px solid #30363d;">
                <td style="padding:8px 6px;font-weight:700;">${p.nom}</td>
                <td style="padding:8px 6px;font-family:monospace;color:#8b949e;">${p.symbole}</td>
                <td style="padding:8px 6px;font-family:monospace;text-align:right;">${p.qte}</td>
                <td style="padding:8px 6px;font-family:monospace;text-align:right;">${fmtMAD(p.prixActuel)} MAD</td>
                <td style="padding:8px 6px;font-family:monospace;text-align:right;">${fmtMAD(p.investi)} MAD</td>
                <td style="padding:8px 6px;font-family:monospace;text-align:right;color:#3fb950;font-weight:700;">+${fmtMAD(p.profitNet)} MAD</td>
                <td style="padding:8px 6px;font-family:monospace;text-align:right;color:#3fb950;">+${p.pct.toFixed(2)}%</td>
            </tr>`).join('');

        const html = `
        <div style="font-family:Arial,sans-serif;max-width:680px;background:#0d1117;color:#e6edf3;padding:24px;border-radius:10px;">
            <div style="border-left:4px solid #f85149;padding-left:16px;margin-bottom:20px;">
                <div style="font-size:0.75em;color:#8b949e;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:4px;">🔴 Alerte Portefeuille · ${now}</div>
                <div style="font-size:1.3em;font-weight:700;color:#f85149;">À LIQUIDER — ${enProfit.length} position${enProfit.length > 1 ? 's' : ''} en profit</div>
            </div>
            <table style="width:100%;border-collapse:collapse;font-size:0.88em;">
                <thead>
                    <tr style="color:#8b949e;border-bottom:1px solid #30363d;font-size:0.8em;text-transform:uppercase;letter-spacing:0.05em;">
                        <th style="padding:6px;text-align:left;">Société</th>
                        <th style="padding:6px;text-align:left;">Ticker</th>
                        <th style="padding:6px;text-align:right;">Qté</th>
                        <th style="padding:6px;text-align:right;">Cours</th>
                        <th style="padding:6px;text-align:right;">Investi TTC</th>
                        <th style="padding:6px;text-align:right;">Profit net</th>
                        <th style="padding:6px;text-align:right;">%</th>
                    </tr>
                </thead>
                <tbody>${lignesHtml}</tbody>
                <tfoot>
                    <tr style="border-top:2px solid #3fb950;background:#0a2014;">
                        <td colspan="5" style="padding:10px 6px;font-weight:700;color:#3fb950;">TOTAL PROFIT NET</td>
                        <td style="padding:10px 6px;font-family:monospace;font-weight:800;font-size:1.1em;color:#3fb950;">+${fmtMAD(totalPL)} MAD</td>
                        <td></td>
                    </tr>
                </tfoot>
            </table>
            <div style="margin-top:16px;font-size:0.78em;color:#8b949e;border-top:1px solid #30363d;padding-top:12px;">
                Bourse de Casablanca · Rapport automatique quotidien
            </div>
        </div>`;

        console.log(`📧 Envoi alerte consolidée "À liquider" — ${enProfit.length} positions…`);
        const ok = await this._envoyerEmail(
            `🔴 [BVC] À LIQUIDER — ${enProfit.length} position${enProfit.length > 1 ? 's' : ''} en profit · +${fmtMAD(totalPL)} MAD`,
            html
        );

        if (ok) {
            localStorage.setItem(stKey, '1');
            this.showNotification(
                `🔴 Alerte envoyée — ${enProfit.length} position${enProfit.length > 1 ? 's' : ''} à liquider · Profit total : +${fmtMAD(totalPL)} MAD`,
                'warning'
            );
        } else {
            this.showNotification('❌ Échec envoi email — vérifiez la config Gmail dans Paramètres', 'error');
        }
        return enProfit; // pour usage console
    }

    // ── Force-test alertes (efface le cache "déjà envoyé" du jour et relance) ──
    forceCheckAlertes() {
        const today = new Date().toISOString().slice(0, 10);
        localStorage.removeItem('alertes_tag_sent_' + today);
        console.log('🗑️ Cache alertes du jour effacé — relance de la vérification…');
        this.checkAlertesTag();
    }

    // ── Bouton manuel "À liquider" : efface uniquement le cache liquider du jour ──
    forceLiquiderAlertes() {
        if (this.stocks.length === 0) {
            this.showNotification('ℹ️ Aucune transaction dans le portefeuille', 'info');
            return;
        }
        const today = new Date().toISOString().slice(0, 10);
        const stKey = 'alertes_tag_sent_' + today;
        let sent = {};
        try { sent = JSON.parse(localStorage.getItem(stKey) || '{}'); } catch(e) {}

        const tags    = this._loadTags();
        const symbols = [...new Set(this.stocks.map(s => s.symbole))];
        let cleared   = 0;
        symbols.forEach(symbole => {
            if ((tags[symbole] || '') === 'liquider') {
                const key = 'sym_' + symbole;
                if (sent[key]) { delete sent[key]; cleared++; }
            }
            this.stocks.filter(s => s.symbole === symbole).forEach(tx => {
                if ((tags['tx_' + tx.id] || '') === 'liquider') {
                    if (sent[tx.id]) { delete sent[tx.id]; cleared++; }
                }
            });
        });
        localStorage.setItem(stKey, JSON.stringify(sent));
        console.log(`🗑️ Cache "À liquider" effacé (${cleared} entrée(s)) — relance…`);
        this.showNotification('🔄 Vérification alertes "À liquider" en cours…', 'info');
        this.checkAlertesTag();
    }

    // ── Seuils par transaction (trading) ────────────────────────────────────
    _loadTradingSeuilx() {
        try { return JSON.parse(localStorage.getItem('portfolio_trading_seuilx') || '{}'); } catch { return {}; }
    }
    getTxTradingSeuil(txId) {
        const all = this._loadTradingSeuilx();
        const v   = parseFloat(all[txId]);
        return isNaN(v) || v <= 0 ? null : v; // null = non défini
    }
    saveTxTradingSeuil(txId, val) {
        const v = parseFloat(val);
        if (isNaN(v) || v <= 0) {
            this.showNotification('⚠️ Seuil invalide', 'error');
            return;
        }
        const all = this._loadTradingSeuilx();
        all[txId] = v;
        localStorage.setItem('portfolio_trading_seuilx', JSON.stringify(all));
        this.showNotification(`✅ Seuil fixé à ${fmtMAD(v)} MAD`, 'success');

        // ── Alerte immédiate si le profit actuel atteint déjà le seuil ─────────
        this._alerteTradingImmediate(txId, v);
    }

    // ── Alerte trading immédiate (appelée au set du seuil ou au cycle vers trading) ──
    _alerteTradingImmediate(entityId, seuil) {
        // entityId = symbole société OU id de transaction
        const matchedTx = this.stocks.find(s => s.id === entityId);
        const isCompany  = !matchedTx;
        let profitNet = 0, stockForAlert = null, nom = '';

        if (isCompany) {
            const txsForSym = this.stocks.filter(s => s.symbole === entityId);
            if (!txsForSym.length) return;
            nom       = (typeof COMPANY_NAMES !== 'undefined' && COMPANY_NAMES[entityId]) || txsForSym[0]?.nom || entityId;
            profitNet = txsForSym.reduce((s, tx) => s + tx.getProfitNet(), 0);
            if (profitNet >= seuil) {
                const totalInvesti = txsForSym.reduce((s, tx) => s + tx.getPrixTotalTTC(), 0);
                stockForAlert = {
                    symbole         : entityId, nom,
                    quantite        : txsForSym.reduce((s, tx) => s + tx.quantite, 0),
                    prixAchat       : 0,
                    prixActuel      : txsForSym[0]?.prixActuel || 0,
                    getPrixTotalTTC : () => totalInvesti,
                    getProfitNet    : () => profitNet,
                    dateAjout       : '(consolidé)',
                };
            }
        } else {
            profitNet = matchedTx.getProfitNet();
            nom       = (typeof COMPANY_NAMES !== 'undefined' && COMPANY_NAMES[matchedTx.symbole]) || matchedTx.nom || matchedTx.symbole;
            if (profitNet >= seuil) stockForAlert = matchedTx;
        }

        if (!stockForAlert) return; // profit pas encore au seuil — rien à faire

        // Forcer le re-envoi : effacer uniquement cette entrée dans le cache du jour
        const today   = new Date().toISOString().slice(0, 10);
        const stKey   = 'alertes_tag_sent_' + today;
        const sentKey = isCompany ? ('sym_' + entityId) : entityId;
        let sent = {};
        try { sent = JSON.parse(localStorage.getItem(stKey) || '{}'); } catch(e) {}
        delete sent[sentKey];
        localStorage.setItem(stKey, JSON.stringify(sent));

        this._sendAlerteTag(
            stockForAlert, nom, 'trading', profitNet,
            '📈', `TRADING — Objectif ${fmtMAD(seuil)} MAD atteint · Alerte immédiate`
        ).then(ok => {
            if (ok) {
                let s2 = {};
                try { s2 = JSON.parse(localStorage.getItem(stKey) || '{}'); } catch(e) {}
                s2[sentKey] = true;
                localStorage.setItem(stKey, JSON.stringify(s2));
            }
            this.showNotification(
                `📈 ${nom} — Seuil ${fmtMAD(seuil)} MAD atteint · Profit : +${fmtMAD(profitNet)} MAD · ${ok ? 'Email ✅' : 'Échec email ⚠️'}`,
                'success'
            );
        });
    }

    async checkAlertesTag() {
        if (this.stocks.length === 0) return;
        const tags  = this._loadTags();
        const today = new Date().toISOString().slice(0, 10);
        const stKey = 'alertes_tag_sent_' + today;
        let sent = {};
        try { sent = JSON.parse(localStorage.getItem(stKey) || '{}'); } catch(e) {}

        console.log('🔔 checkAlertesTag — vérification des alertes tags...', { nbStocks: this.stocks.length, tags });

        // Grouper les transactions par symbole
        const symbols = [...new Set(this.stocks.map(s => s.symbole))];

        for (const symbole of symbols) {
            const companyTag = tags[symbole] || ''; // tag au niveau société
            const txsForSym  = this.stocks.filter(s => s.symbole === symbole);
            const nom        = (typeof COMPANY_NAMES !== 'undefined' && COMPANY_NAMES[symbole]) || txsForSym[0]?.nom || symbole;

            if (companyTag) {
                // ── Tag société défini → prime sur les tags des transactions ──────
                if (companyTag !== 'liquider' && companyTag !== 'trading') continue;

                const consolidatedProfit = txsForSym.reduce((s, tx) => s + tx.getProfitNet(), 0);
                const sentKey = 'sym_' + symbole;
                let shouldAlert = false, label = '', icon = '';

                console.log(`  🏢 ${symbole} | tag société: ${companyTag} | profit consolidé: ${consolidatedProfit.toFixed(2)} | déjà envoyé: ${!!sent[sentKey]}`);

                if (companyTag === 'liquider' && consolidatedProfit > 0) {
                    shouldAlert = true;
                    icon  = '🔴';
                    label = `À LIQUIDER — Profit consolidé positif`;
                } else if (companyTag === 'trading') {
                    const seuil = this.getTxTradingSeuil(symbole);
                    console.log(`    📈 seuil trading société: ${seuil}, profit: ${consolidatedProfit.toFixed(2)}`);
                    if (seuil !== null && consolidatedProfit >= seuil) {
                        shouldAlert = true;
                        icon  = '📈';
                        label = `TRADING — Objectif ${fmtMAD(seuil)} MAD atteint (consolidé)`;
                    }
                }

                if (!shouldAlert || sent[sentKey]) continue;

                // Objet synthétique pour _sendAlerteTag
                const totalInvesti = txsForSym.reduce((s, tx) => s + tx.getPrixTotalTTC(), 0);
                const fakeStock = {
                    symbole,
                    nom,
                    quantite        : txsForSym.reduce((s, tx) => s + tx.quantite, 0),
                    prixAchat       : 0,
                    prixActuel      : txsForSym[0]?.prixActuel || 0,
                    getPrixTotalTTC : () => totalInvesti,
                    getProfitNet    : () => consolidatedProfit,
                    dateAjout       : '(consolidé)',
                };
                console.log(`  📧 Envoi alerte société ${symbole}…`);
                const ok = await this._sendAlerteTag(fakeStock, nom, companyTag, consolidatedProfit, icon, label);
                if (ok) {
                    sent[sentKey] = true;
                    localStorage.setItem(stKey, JSON.stringify(sent));
                }
                this.showNotification(
                    `${icon} ${nom} (${symbole}) — ${label} : ${consolidatedProfit >= 0 ? '+' : ''}${fmtMAD(consolidatedProfit)} MAD — ${ok ? 'Email envoyé ✅' : 'Échec email ⚠️'}`,
                    companyTag === 'liquider' ? 'warning' : 'success'
                );

            } else {
                // ── Pas de tag société → les tags des transactions individuelles s'appliquent ──
                for (const stock of txsForSym) {
                    const tag = tags['tx_' + stock.id] || '';
                    if (tag !== 'liquider' && tag !== 'trading') continue;

                    const profitNet = stock.getProfitNet();
                    let shouldAlert = false, label = '', icon = '';

                    console.log(`  💰 tx ${stock.id} (${symbole}) | tag: ${tag} | profit: ${profitNet.toFixed(2)} | déjà envoyé: ${!!sent[stock.id]}`);

                    if (tag === 'liquider' && profitNet > 0) {
                        shouldAlert = true;
                        icon  = '🔴';
                        label = `À LIQUIDER — Profit devenu positif`;
                    } else if (tag === 'trading') {
                        const seuil = this.getTxTradingSeuil(stock.id);
                        console.log(`    📈 seuil trading: ${seuil}, profit: ${profitNet.toFixed(2)}`);
                        if (seuil !== null && profitNet >= seuil) {
                            shouldAlert = true;
                            icon  = '📈';
                            label = `TRADING — Objectif ${fmtMAD(seuil)} MAD atteint`;
                        }
                    }

                    if (!shouldAlert || sent[stock.id]) continue;

                    console.log(`  📧 Envoi alerte tx ${stock.id} (${symbole})…`);
                    const ok = await this._sendAlerteTag(stock, nom, tag, profitNet, icon, label);
                    if (ok) {
                        sent[stock.id] = true;
                        localStorage.setItem(stKey, JSON.stringify(sent));
                    }
                    this.showNotification(
                        `${icon} ${nom} (${stock.symbole}) — ${label} : ${profitNet >= 0 ? '+' : ''}${fmtMAD(profitNet)} MAD — ${ok ? 'Email envoyé ✅' : 'Échec email ⚠️'}`,
                        tag === 'liquider' ? 'warning' : 'success'
                    );
                }
            }
        }
        console.log('🔔 checkAlertesTag — terminé.');
    }

    async _sendAlerteTag(stock, nom, tag, profitNet, icon, label) {
        const inv  = stock.getPrixTotalTTC();
        const pct  = inv > 0 ? (profitNet / inv * 100).toFixed(2) : '—';
        const now  = new Date().toLocaleString('fr-FR', {day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'});
        const tagColor = tag === 'liquider' ? '#f85149' : '#e3b341';
        const tagLabel = tag === 'liquider' ? '🔴 À Liquider' : '📈 Trading';

        const html = `<div style="font-family:Arial,sans-serif;max-width:520px;background:#0d1117;color:#e6edf3;padding:24px;border-radius:10px;">
            <div style="border-left:4px solid ${tagColor};padding-left:16px;margin-bottom:20px;">
                <div style="font-size:0.75em;color:#8b949e;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:4px;">${icon} Alerte Portefeuille · ${now}</div>
                <div style="font-size:1.3em;font-weight:700;color:${tagColor};">${label}</div>
            </div>
            <table style="width:100%;border-collapse:collapse;font-size:0.9em;">
                <tr><td style="padding:6px 0;color:#8b949e;">Société</td><td style="text-align:right;font-weight:700;">${nom} (${stock.symbole})</td></tr>
                <tr><td style="padding:6px 0;color:#8b949e;">Statut</td><td style="text-align:right;"><span style="background:${tagColor}33;color:${tagColor};padding:2px 8px;border-radius:12px;font-size:0.85em;">${tagLabel}</span></td></tr>
                <tr><td style="padding:6px 0;color:#8b949e;">Quantité</td><td style="text-align:right;font-family:monospace;">${stock.quantite}</td></tr>
                <tr><td style="padding:6px 0;color:#8b949e;">Prix achat</td><td style="text-align:right;font-family:monospace;">${fmtMAD(stock.prixAchat)} MAD</td></tr>
                <tr><td style="padding:6px 0;color:#8b949e;">Cours actuel</td><td style="text-align:right;font-family:monospace;">${fmtMAD(stock.prixActuel)} MAD</td></tr>
                <tr><td style="padding:6px 0;color:#8b949e;">Investi TTC</td><td style="text-align:right;font-family:monospace;">${fmtMAD(inv)} MAD</td></tr>
                <tr style="border-top:1px solid #30363d;">
                    <td style="padding:10px 0;font-weight:700;color:#3fb950;">Profit net</td>
                    <td style="text-align:right;font-family:monospace;font-weight:700;font-size:1.1em;color:#3fb950;">+${fmtMAD(profitNet)} MAD (+${pct}%)</td>
                </tr>
            </table>
            <div style="margin-top:16px;font-size:0.78em;color:#8b949e;border-top:1px solid #30363d;padding-top:12px;">
                Transaction du ${stock.dateAjout || '—'} · Bourse de Casablanca
            </div>
        </div>`;

        const ok = await this._envoyerEmail(
            `${icon} [BVC] ${label} — ${nom} (${stock.symbole}) +${fmtMAD(profitNet)} MAD`,
            html
        );
        return ok === true;
    }

    // ── Envoi email unifié : Gmail PHP proxy (priorité) ou EmailJS (fallback) ──
    async _envoyerEmail(subject, htmlBody, templateParamsEmailJS = null) {
        // Recharger les credentials depuis localStorage si EMAIL_CONFIG vide
        if (!EMAIL_CONFIG.gmailUser) {
            try {
                const saved = JSON.parse(localStorage.getItem('emailConfig') || '{}');
                if (saved.gmailUser)     EMAIL_CONFIG.gmailUser     = saved.gmailUser;
                if (saved.gmailPassword) EMAIL_CONFIG.gmailPassword = saved.gmailPassword;
                if (saved.to)            EMAIL_CONFIG.to            = saved.to;
            } catch(e) {}
        }

        // Envoi via proxy PHP Gmail SMTP
        try {
            const resp = await fetch('api/send-email.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    to:             EMAIL_CONFIG.to,
                    subject:        subject,
                    html:           htmlBody,
                    gmail_user:     EMAIL_CONFIG.gmailUser     || '',
                    gmail_password: EMAIL_CONFIG.gmailPassword || '',
                })
            });
            const data = await resp.json();
            if (data.ok) { console.log('✅ Email envoyé via', data.via || 'proxy'); return true; }
            console.warn('⚠️ Proxy email échoué:', data.error);
        } catch(e) { console.warn('⚠️ Proxy PHP inaccessible (êtes-vous sur MAMP ?):', e.message); }
        console.error('❌ Email non envoyé — configurez Gmail dans Paramètres → Alertes Email');
        return false;
    }

    async _sendAlerteLigne(societe, pct) {
        try {
            const now = new Date().toLocaleString('fr-FR', {day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit',second:'2-digit'});
            const valeur = (societe.quantite * societe.prixActuel).toFixed(2);
            const html = `<div style="font-family:Arial,sans-serif;max-width:500px;background:#0d1117;color:#e6edf3;padding:24px;border-radius:10px;">
                <h2 style="color:#3fb950;margin:0 0 16px;">🟢 Ligne en profit — ${societe.nom}</h2>
                <table style="width:100%;border-collapse:collapse;font-size:14px;">
                    <tr><td style="color:#8b949e;padding:6px 0;">Société</td><td style="font-weight:bold;">${societe.nom} (${societe.symbole})</td></tr>
                    <tr><td style="color:#8b949e;padding:6px 0;">Profit net</td><td style="color:#3fb950;font-weight:bold;">+${societe.pl.toFixed(2)} MAD (+${pct.toFixed(2)}%)</td></tr>
                    <tr><td style="color:#8b949e;padding:6px 0;">Prix achat</td><td>${societe.prixAchat.toFixed(2)} MAD</td></tr>
                    <tr><td style="color:#8b949e;padding:6px 0;">Cours actuel</td><td>${societe.prixActuel.toFixed(2)} MAD</td></tr>
                    <tr><td style="color:#8b949e;padding:6px 0;">Quantité</td><td>${societe.quantite} titres</td></tr>
                    <tr><td style="color:#8b949e;padding:6px 0;">Valeur actuelle</td><td>${valeur} MAD</td></tr>
                    <tr><td style="color:#8b949e;padding:6px 0;">Date transaction</td><td>${societe.dateAjout}</td></tr>
                    <tr><td style="color:#8b949e;padding:6px 0;">Heure alerte</td><td>${now}</td></tr>
                </table>
            </div>`;
            const subject = `🟢 ${societe.nom} — ligne en profit +${pct.toFixed(2)}%`;
            const ejsParams = { to_email: EMAIL_CONFIG.to, from_name:'Bourse Casa', stock_name:`${societe.nom} (${societe.symbole})`, alert_type:'🟢 LIGNE EN PROFIT', percentage:'+'+pct.toFixed(2)+'%', profit_loss:'+'+societe.pl.toFixed(2)+' MAD', current_price:societe.prixActuel.toFixed(2)+' MAD', buy_price:societe.prixAchat.toFixed(2)+' MAD', quantity:societe.quantite+' titres', total_value:valeur+' MAD', alert_time:now };
            console.log('📧 Envoi email alerte ligne →', societe.symbole);
            await this._envoyerEmail(subject, html, ejsParams);
        } catch(e) { console.error('❌ Erreur envoi email alerte ligne:', e); }
    }

    async _sendAlerteSuivi(societe, pct) {
        try {
            const now = new Date().toLocaleString('fr-FR', {day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit',second:'2-digit'});
            const html = `<div style="font-family:Arial,sans-serif;max-width:500px;background:#0d1117;color:#e6edf3;padding:24px;border-radius:10px;">
                <h2 style="color:#3fb950;margin:0 0 16px;">🎯 Position positive — ${societe.nom}</h2>
                <table style="width:100%;border-collapse:collapse;font-size:14px;">
                    <tr><td style="color:#8b949e;padding:6px 0;">Profit net</td><td style="color:#3fb950;font-weight:bold;">+${societe.pl.toFixed(2)} MAD (+${pct.toFixed(2)}%)</td></tr>
                    <tr><td style="color:#8b949e;padding:6px 0;">Investi</td><td>${societe.investi.toFixed(2)} MAD</td></tr>
                    <tr><td style="color:#8b949e;padding:6px 0;">Heure alerte</td><td>${now}</td></tr>
                </table>
            </div>`;
            const subject = `🎯 ${societe.nom} — profit positif +${pct.toFixed(2)}%`;
            const ejsParams = { to_email: EMAIL_CONFIG.to, from_name:'Bourse Casa', stock_name:`${societe.nom} (${societe.symbole})`, alert_type:'🎯 PROFIT NET POSITIF', percentage:'+'+pct.toFixed(2)+'%', profit_loss:'+'+societe.pl.toFixed(2)+' MAD', current_price:'—', buy_price:societe.investi.toFixed(2)+' MAD', quantity:'—', total_value:(societe.investi+societe.pl).toFixed(2)+' MAD', alert_time:now };
            await this._envoyerEmail(subject, html, ejsParams);
        } catch(e) { console.error('❌ Erreur envoi email alerte suivi:', e); }
    }

    async _sendPortfolioEmail(totalPL, pctGlobal, totalInvesti, societe) {
        try {
            const now = new Date().toLocaleString('fr-FR', {day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit',second:'2-digit'});
            const nom = societe ? `${societe.nom} (${societe.symbole})` : 'Portefeuille';
            const html = `<div style="font-family:Arial,sans-serif;max-width:500px;background:#0d1117;color:#e6edf3;padding:24px;border-radius:10px;">
                <h2 style="color:#3fb950;margin:0 0 16px;">📈 Société en profit — ${nom}</h2>
                <table style="width:100%;border-collapse:collapse;font-size:14px;">
                    <tr><td style="color:#8b949e;padding:6px 0;">Profit</td><td style="color:#3fb950;font-weight:bold;">+${totalPL.toFixed(2)} MAD (+${pctGlobal.toFixed(2)}%)</td></tr>
                    <tr><td style="color:#8b949e;padding:6px 0;">Investi</td><td>${totalInvesti.toFixed(2)} MAD</td></tr>
                    <tr><td style="color:#8b949e;padding:6px 0;">Heure</td><td>${now}</td></tr>
                </table>
            </div>`;
            const subject = `📈 ${nom} en profit +${pctGlobal.toFixed(2)}%`;
            const ejsParams = { to_email: EMAIL_CONFIG.to, from_name:'Bourse Casa', stock_name:nom, alert_type:'SOCIÉTÉ EN PROFIT', percentage:'+'+pctGlobal.toFixed(2)+'%', profit_loss:'+'+totalPL.toFixed(2)+' MAD', current_price:totalInvesti.toFixed(2)+' MAD', buy_price:nom, quantity:societe?this.stocks.filter(s=>s.symbole===societe.symbole).length:1, total_value:(totalInvesti+totalPL).toFixed(2)+' MAD', alert_time:now };
            await this._envoyerEmail(subject, html, ejsParams);
            this.showNotification('📧 Alerte portefeuille envoyée par email', 'success');
        } catch(e) { console.error('❌ Erreur envoi email portefeuille:', e); }
    }

    async sendEmail(stock, type, percentage) {
        try {
            if (typeof emailjs === 'undefined') {
                console.warn('⚠️ EmailJS non disponible');
                return;
            }

            if (!EMAIL_CONFIG || !EMAIL_CONFIG.serviceId || !EMAIL_CONFIG.templateId) {
                console.warn('⚠️ Configuration EmailJS incomplète');
                return;
            }

            if (!EMAILJS_READY) {
                emailjs.init(EMAIL_CONFIG.userId);
                EMAILJS_READY = true;
            }
            
            const templateParams = {
                to_email: EMAIL_CONFIG.to,
                from_name: 'Bourse Casa',
                stock_name: `${stock.nom} (${stock.symbole})`,
                alert_type: 'TRANSACTION POSITIVE',
                percentage: percentage.toFixed(2) + '%',
                profit_loss: (type === 'profit' ? '+' : '') + stock.getProfitNet().toFixed(2) + ' MAD',
                current_price: stock.prixActuel.toFixed(2) + ' MAD',
                buy_price: stock.prixAchat.toFixed(2) + ' MAD',
                quantity: stock.quantite,
                total_value: stock.getPrixTotalTTC().toFixed(2) + ' MAD',
                alert_time: new Date().toLocaleString('fr-FR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                })
            };
            
            console.log('📧 Envoi email...');
            
            const response = await emailjs.send(
                EMAIL_CONFIG.serviceId,
                EMAIL_CONFIG.templateId,
                templateParams,
                EMAIL_CONFIG.userId
            );
            
            console.log('✅ Email envoyé:', response);
            this.showNotification(`📧 Alerte envoyée pour ${stock.symbole}`, 'success');
            
        } catch (e) {
            console.error('❌ Erreur envoi email:', e);
        }
    }

    async testEmail() {
        if (this.stocks.length === 0) {
            this.showNotification('ℹ️ Ajoutez d\'abord une action pour tester', 'info');
            return;
        }

        let totalInvesti = 0, totalPL = 0;
        this.stocks.forEach(s => {
            totalInvesti += s.getPrixTotalTTC();
            totalPL += s.getProfitNet();
        });
        const pctGlobal = totalInvesti > 0 ? (totalPL / totalInvesti) * 100 : 0;

        this.showNotification('📧 Envoi d\'un email de test (alerte portefeuille)...', 'info');
        await this._sendPortfolioEmail(totalPL, pctGlobal, totalInvesti);
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = 'notif';
        const bgMap = { success: '#1a4731', profit: '#1a4731', loss: '#5a1a1a', warning: '#3a2e00', info: '#0c2d6b' };
        const borderMap = { success: '#3fb950', profit: '#3fb950', loss: '#f85149', warning: '#e3b341', info: '#58a6ff' };
        notification.style.background = bgMap[type] || bgMap.info;
        notification.style.borderColor = borderMap[type] || borderMap.info;
        notification.style.color = 'var(--text, #e6edf3)';
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3500);
    }

    updateTimestamp() {
        const el = document.getElementById('lastUpdate');
        if (el) {
            el.textContent = new Date().toLocaleString('fr-FR');
        }
    }

    // ── Formateur monétaire avec séparateurs de milliers (fr-FR) ─────────────
    _fmtMAD(val, decimals = 2) {
        return (+val).toLocaleString('fr-FR', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
        });
    }

    getTotaux() {
        let totalInvesti = 0;
        let totalProfitNet = 0;

        this.stocks.forEach(s => {
            totalInvesti += s.getPrixTotalTTC();
            totalProfitNet += s.getProfitNet();
        });

        const pourcentageGlobal = totalInvesti > 0 ? (totalProfitNet / totalInvesti) * 100 : 0;

        return { totalInvesti, totalProfitNet, pourcentageGlobal };
    }

    saveHistorySnapshot() {
        const { totalInvesti, totalProfitNet, pourcentageGlobal } = this.getTotaux();
        if (totalInvesti <= 0) return;   // jamais négatif ni zéro
        const today = new Date().toLocaleDateString('fr-FR', {day:'2-digit', month:'2-digit', year:'numeric'});

        // ── Calcul du total profits positifs (pour variation badge) ──────────
        // Consolider par symbole, puis sommer : positifs consolidés + tx individuelles positives dans groupes négatifs
        const grouped2 = {};
        this.stocks.forEach(s => {
            if (!grouped2[s.symbole]) grouped2[s.symbole] = 0;
            grouped2[s.symbole] += s.getProfitNet();
        });
        let profitPos = 0;
        Object.entries(grouped2).forEach(([sym, consol]) => {
            if (consol > 0) {
                profitPos += consol;
            } else {
                this.stocks.filter(s => s.symbole === sym && s.getProfitNet() > 0)
                    .forEach(s => { profitPos += s.getProfitNet(); });
            }
        });

        let history = JSON.parse(localStorage.getItem('portfolio_history') || '[]');
        history = history.filter(h => h.date !== today);
        history.push({
            date:         today,
            totalInvesti: Math.round(totalInvesti * 100) / 100,
            profitNet:    Math.round(totalProfitNet * 100) / 100,
            performance:  Math.round(pourcentageGlobal * 100) / 100,
            profitPos:    Math.round(profitPos * 100) / 100,
        });
        if (history.length > 365) history = history.slice(-365);
        localStorage.setItem('portfolio_history', JSON.stringify(history));

        // ── Historique par symbole (pour graphique par position) ──────────────
        const symHistory = JSON.parse(localStorage.getItem('portfolio_history_sym') || '{}');
        const groups = {};
        this.stocks.forEach(s => {
            if (!groups[s.symbole]) groups[s.symbole] = { profitNet: 0, investi: 0 };
            groups[s.symbole].profitNet += s.getProfitNet();
            groups[s.symbole].investi   += s.getPrixTotalTTC();
        });
        Object.entries(groups).forEach(([sym, g]) => {
            if (!symHistory[sym]) symHistory[sym] = [];
            symHistory[sym] = symHistory[sym].filter(h => h.date !== today);
            symHistory[sym].push({
                date:   today,
                profit: Math.round(g.profitNet * 100) / 100,
                pct:    g.investi > 0 ? Math.round((g.profitNet / g.investi) * 10000) / 100 : 0,
            });
            if (symHistory[sym].length > 365) symHistory[sym] = symHistory[sym].slice(-365);
        });
        localStorage.setItem('portfolio_history_sym', JSON.stringify(symHistory));

        // ── Sync serveur : une seule fois par jour pour ne pas surcharger ─────
        const syncKey = 'portfolio_history_sync_' + today;
        if (!localStorage.getItem(syncKey)) {
            localStorage.setItem(syncKey, '1');
            this.save(); // inclut history + historySym dans le payload (voir save())
        }
    }

    getHistory() {
        const raw = JSON.parse(localStorage.getItem('portfolio_history') || '[]');
        return raw;
    }

    // ── Système de tags (Investissement / Trading / À liquider) ──────────────
    static _TAGS = [
        { key: '',               label: 'Tag…',          icon: '🏷️',  color: 'rgba(139,148,158,0.25)', text: '#8b949e' },
        { key: 'investissement', label: 'Investissement', icon: '💼',  color: 'rgba(68,147,248,0.18)',  text: '#4493f8' },
        { key: 'trading',        label: 'Trading',        icon: '📈',  color: 'rgba(227,179,65,0.18)',  text: '#e3b341' },
        { key: 'liquider',       label: 'À liquider',     icon: '🔴',  color: 'rgba(248,81,73,0.18)',   text: '#f85149' },
    ];

    _loadTags() {
        try { return JSON.parse(localStorage.getItem('portfolio_tags') || '{}'); } catch { return {}; }
    }
    _saveTags(tags) {
        localStorage.setItem('portfolio_tags', JSON.stringify(tags));
    }
    getTag(key) {   // key = symbole ou "tx_"+id
        return this._loadTags()[key] || '';
    }
    cycleTag(key, btn) { // fait tourner le tag EN PLACE (sans re-render du tableau)
        const tags   = this._loadTags();
        const cur    = tags[key] || '';
        const keys   = PortfolioManager._TAGS.map(t => t.key);
        const idx    = keys.indexOf(cur);
        const next   = keys[(idx + 1) % keys.length];
        if (next === '') { delete tags[key]; } else { tags[key] = next; }
        this._saveTags(tags);
        // ─ Sync immédiat vers serveur pour que le rechargement ne perde pas le tag ─
        this.save();

        // Mise à jour visuelle du bouton
        if (btn) {
            const def       = PortfolioManager._TAGS.find(t => t.key === next) || PortfolioManager._TAGS[0];
            const isCompany = !key.startsWith('tx_');
            btn.style.borderColor = def.text;
            btn.style.background  = def.color;
            btn.style.color       = def.text;
            btn.textContent       = (next === '' && isCompany) ? '🏷️ Rien' : `${def.icon} ${def.label}`;
        }

        // Afficher / masquer le champ seuil si tag = trading
        const container = document.getElementById('tag-cnt-' + key);
        if (container) {
            const isCompany = !key.startsWith('tx_');
            const entityId  = isCompany ? key : key.slice(3);
            let seuilDiv = container.querySelector('.tx-seuil-div');
            if (next === 'trading') {
                if (!seuilDiv) {
                    seuilDiv = document.createElement('div');
                    seuilDiv.className = 'tx-seuil-div';
                    seuilDiv.style.cssText = 'display:flex;align-items:center;gap:4px;margin-top:5px;';
                    const sv = this.getTxTradingSeuil(entityId) || '';
                    seuilDiv.innerHTML = `<span style="font-size:0.75em;color:#e3b341;white-space:nowrap;">🎯 Seuil :</span>
                        <input type="number" min="1" step="100" value="${sv}" placeholder="ex: 1000"
                            style="width:80px;padding:2px 6px;background:var(--bg);border:1px solid #e3b341;
                                   border-radius:4px;color:#e3b341;font-size:0.8em;font-family:'JetBrains Mono',monospace;outline:none;"
                            onclick="event.stopPropagation();"
                            onkeydown="event.stopPropagation();if(event.key==='Enter'){event.preventDefault();portfolioManager.saveTxTradingSeuil('${entityId}',this.value);this.style.borderColor='#3fb950';setTimeout(()=>this.style.borderColor='#e3b341',1200);}"
                            onblur="portfolioManager.saveTxTradingSeuil('${entityId}',this.value);this.style.borderColor='#e3b341';" />
                        <span style="font-size:0.75em;color:var(--text3);">MAD</span>`;
                    container.appendChild(seuilDiv);
                    // Focus automatique sur le champ seuil quand on passe en mode trading
                    setTimeout(() => seuilDiv.querySelector('input')?.focus(), 50);
                } else {
                    seuilDiv.style.display = 'flex';
                    setTimeout(() => seuilDiv.querySelector('input')?.focus(), 50);
                }
            } else if (seuilDiv) {
                seuilDiv.style.display = 'none';
            }
        }

        // ── Alerte immédiate si le nouveau tag est "à liquider" et profit > 0 ──
        if (next === 'liquider') {
            const isCompany = !key.startsWith('tx_');
            let profitNet = 0, stockForAlert = null, nom = '';

            if (isCompany) {
                // Clé société → profit consolidé de toutes les transactions
                const txsForSym = this.stocks.filter(s => s.symbole === key);
                nom = (typeof COMPANY_NAMES !== 'undefined' && COMPANY_NAMES[key]) || txsForSym[0]?.nom || key;
                profitNet = txsForSym.reduce((s, tx) => s + tx.getProfitNet(), 0);
                if (profitNet > 0) {
                    const totalInvesti = txsForSym.reduce((s, tx) => s + tx.getPrixTotalTTC(), 0);
                    stockForAlert = {
                        symbole         : key,
                        nom,
                        quantite        : txsForSym.reduce((s, tx) => s + tx.quantite, 0),
                        prixAchat       : 0,
                        prixActuel      : txsForSym[0]?.prixActuel || 0,
                        getPrixTotalTTC : () => totalInvesti,
                        getProfitNet    : () => profitNet,
                        dateAjout       : '(consolidé)',
                    };
                }
            } else {
                // Clé transaction individuelle
                const entityId = key.slice(3);
                const tx = this.stocks.find(s => s.id === entityId);
                if (tx) {
                    profitNet = tx.getProfitNet();
                    nom = (typeof COMPANY_NAMES !== 'undefined' && COMPANY_NAMES[tx.symbole]) || tx.nom || tx.symbole;
                    if (profitNet > 0) stockForAlert = tx;
                }
            }

            if (stockForAlert && profitNet > 0) {
                // Envoi immédiat — bypass du cache quotidien (tag vient d'être défini manuellement)
                this._sendAlerteTag(
                    stockForAlert, nom, 'liquider', profitNet,
                    '🔴', 'À LIQUIDER — Profit positif · Alerte immédiate'
                ).then(ok => {
                    // Mettre à jour le cache pour éviter un doublon dans les 5 min suivantes
                    if (ok) {
                        const today   = new Date().toISOString().slice(0, 10);
                        const stKey   = 'alertes_tag_sent_' + today;
                        const sentKey = isCompany ? ('sym_' + key) : stockForAlert.id;
                        let sent = {};
                        try { sent = JSON.parse(localStorage.getItem(stKey) || '{}'); } catch(e) {}
                        sent[sentKey] = true;
                        localStorage.setItem(stKey, JSON.stringify(sent));
                    }
                    this.showNotification(
                        `🔴 ${nom} — À liquider · +${fmtMAD(profitNet)} MAD · ${ok ? 'Email envoyé ✅' : 'Échec email ⚠️'}`,
                        'warning'
                    );
                });
            }
        }

        // ── Alerte immédiate si le nouveau tag est "trading" et seuil déjà défini ──
        if (next === 'trading') {
            const isCompany = !key.startsWith('tx_');
            const entityId  = isCompany ? key : key.slice(3);
            const seuilExistant = this.getTxTradingSeuil(entityId);
            // S'il y a déjà un seuil enregistré, vérifier immédiatement
            if (seuilExistant !== null) {
                this._alerteTradingImmediate(entityId, seuilExistant);
            }
            // Si pas de seuil, l'utilisateur va le saisir → saveTxTradingSeuil() prendra le relais
        }
    }

    _tagBadge(key, small = false) { // génère le badge + champ seuil si trading
        const isCompany = !key.startsWith('tx_'); // clé société (symbole) vs transaction (tx_id)
        const cur       = this.getTag(key);
        const def       = PortfolioManager._TAGS.find(t => t.key === cur) || PortfolioManager._TAGS[0];
        const sz        = small ? 'font-size:0.72em;padding:1px 7px;' : 'font-size:0.78em;padding:2px 9px;';
        const entityId  = isCompany ? key : key.slice(3); // SOT → 'SOT', tx_abc → 'abc'
        const sv        = cur === 'trading' ? (this.getTxTradingSeuil(entityId) || '') : null;
        // Pour les badges société : état vide = "Rien" (les tags des transactions prennent effet)
        const btnLabel  = (cur === '' && isCompany) ? '🏷️ Rien' : `${def.icon} ${def.label}`;

        const seuilHtml = cur === 'trading' ? `
            <div class="tx-seuil-div" style="display:flex;align-items:center;gap:4px;margin-top:5px;">
                <span style="font-size:0.75em;color:#e3b341;white-space:nowrap;">🎯 Seuil :</span>
                <input type="number" min="1" step="100" value="${sv}" placeholder="ex: 1000"
                    style="width:80px;padding:2px 6px;background:var(--bg);border:1px solid #e3b341;
                           border-radius:4px;color:#e3b341;font-size:0.8em;font-family:'JetBrains Mono',monospace;outline:none;"
                    onclick="event.stopPropagation();"
                    onkeydown="event.stopPropagation();if(event.key==='Enter'){event.preventDefault();portfolioManager.saveTxTradingSeuil('${entityId}',this.value);this.style.borderColor='#3fb950';setTimeout(()=>this.style.borderColor='#e3b341',1200);}"
                    onblur="portfolioManager.saveTxTradingSeuil('${entityId}',this.value);this.style.borderColor='#e3b341';" />
                <span style="font-size:0.75em;color:var(--text3);">MAD</span>
            </div>` : '';

        return `<div id="tag-cnt-${key}" style="display:inline-flex;flex-direction:column;align-items:flex-start;">
            <button onclick="event.stopPropagation();portfolioManager.cycleTag('${key}', this)"
                title="${isCompany ? 'Tag société — prime sur les tags des transactions individuelles (Rien = tags tx actifs)' : 'Cliquer pour changer le statut'}"
                style="${sz}border:1px solid ${def.text};border-radius:20px;background:${def.color};
                       color:${def.text};cursor:pointer;font-weight:600;white-space:nowrap;
                       transition:all .2s;font-family:inherit;"
                onmouseover="this.style.opacity='0.8'"
                onmouseout="this.style.opacity='1'">${btnLabel}</button>
            ${seuilHtml}
        </div>`;
    }

    getSymHistory(symbole) {
        const all = JSON.parse(localStorage.getItem('portfolio_history_sym') || '{}');
        return all[symbole] || [];
    }

    showPositionChart(symbole, nom) {
        const history = this.getSymHistory(symbole);
        const modal   = document.getElementById('modal-metric-history');
        const title   = document.getElementById('modal-metric-history-title');
        const tableEl = document.getElementById('metric-history-table');
        if (!modal) return;

        title.textContent = `📊 Évolution profit — ${nom}`;

        if (!history.length) {
            tableEl.innerHTML = '<p style="color:var(--text3);text-align:center;padding:20px;">Aucun historique disponible — les données sont enregistrées quotidiennement lors du chargement du portefeuille.</p>';
            modal.classList.add('active');
            return;
        }

        const labels = history.map(h => h.date);
        const profits = history.map(h => h.profit ?? 0);
        const pcts    = history.map(h => h.pct   ?? 0);

        // Graphique profit MAD
        const canvas = document.getElementById('metric-history-chart');
        const ctx    = canvas.getContext('2d');
        if (window._metricHistoryChart instanceof Chart) window._metricHistoryChart.destroy();

        const pointColors = profits.map(v => v >= 0 ? '#3fb950' : '#f85149');
        window._metricHistoryChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels,
                datasets: [{
                    label: 'Profit net (MAD)',
                    data: profits,
                    borderColor: '#3fb950',
                    backgroundColor: 'rgba(63,185,80,0.12)',
                    pointBackgroundColor: pointColors,
                    pointRadius: history.length <= 30 ? 4 : 2,
                    borderWidth: 2,
                    fill: true,
                    tension: 0.35,
                    yAxisID: 'yMAD',
                }, {
                    label: 'Variation %',
                    data: pcts,
                    borderColor: '#d29922',
                    backgroundColor: 'transparent',
                    pointBackgroundColor: pcts.map(v => v >= 0 ? '#d29922' : '#f85149'),
                    pointRadius: history.length <= 30 ? 3 : 1,
                    borderWidth: 1.5,
                    borderDash: [4, 3],
                    fill: false,
                    tension: 0.35,
                    yAxisID: 'yPct',
                }],
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                interaction: { mode: 'index', intersect: false },
                plugins: {
                    legend: { labels: { color: '#8b949e', font: { size: 11 } } },
                    tooltip: {
                        callbacks: {
                            label: ctx => {
                                const v = ctx.parsed.y;
                                return ctx.datasetIndex === 0
                                    ? ` ${v >= 0 ? '+' : ''}${v.toFixed(2)} MAD`
                                    : ` ${v >= 0 ? '+' : ''}${v.toFixed(2)}%`;
                            }
                        }
                    }
                },
                scales: {
                    x: { ticks: { color: '#8b949e', maxTicksLimit: 8, font: { size: 10 } }, grid: { color: '#21262d' } },
                    yMAD: {
                        position: 'left',
                        ticks: { color: '#3fb950', font: { size: 10 }, callback: v => v.toLocaleString('fr-FR') + ' MAD' },
                        grid: { color: '#21262d' },
                    },
                    yPct: {
                        position: 'right',
                        ticks: { color: '#d29922', font: { size: 10 }, callback: v => v.toFixed(2) + '%' },
                        grid: { drawOnChartArea: false },
                    },
                },
            },
        });

        // Tableau des données
        const rows = [...history].reverse().map(h => {
            const cls = h.profit >= 0 ? 'color:#3fb950' : 'color:#f85149';
            return `<tr>
                <td class="mono" style="color:var(--text2);font-size:0.85em;">${h.date}</td>
                <td class="mono" style="${cls};font-weight:600;">${h.profit >= 0 ? '+' : ''}${fmtMAD(h.profit)} MAD</td>
                <td class="mono" style="${cls};">${h.pct >= 0 ? '+' : ''}${h.pct.toFixed(2)}%</td>
            </tr>`;
        }).join('');
        tableEl.innerHTML = `
            <div style="max-height:220px;overflow-y:auto;">
                <table style="width:100%;border-collapse:collapse;font-size:0.88em;">
                    <thead><tr style="color:var(--text3);border-bottom:1px solid var(--border);">
                        <th style="padding:6px 8px;text-align:left;">Date</th>
                        <th style="padding:6px 8px;text-align:right;">Profit net</th>
                        <th style="padding:6px 8px;text-align:right;">Variation %</th>
                    </tr></thead>
                    <tbody>${rows}</tbody>
                </table>
            </div>`;
        modal.classList.add('active');
    }

    showMetricHistory(metricKey) {
        const history = this.getHistory();
        const modal   = document.getElementById('modal-metric-history');
        const title   = document.getElementById('modal-metric-history-title');
        const tableEl = document.getElementById('metric-history-table');
        if (!modal) return;

        const cfg = {
            totalInvesti: { label: '💰 Historique — Total investi',     field: 'totalInvesti', unit: 'MAD', color: '#4493f8' },
            profitNet:    { label: '📊 Historique — Profit / Perte net', field: 'profitNet',    unit: 'MAD', color: '#3fb950', negColor: '#f85149' },
            performance:  { label: '📈 Historique — Performance globale',field: 'performance',  unit: '%',   color: '#d29922', negColor: '#f85149' },
        };
        const c = cfg[metricKey];
        if (!c) return;

        title.textContent = c.label;

        if (!history.length) {
            tableEl.innerHTML = '<p style="color:var(--text3);text-align:center;padding:20px;">Aucun historique disponible — les données sont enregistrées quotidiennement.</p>';
            modal.classList.add('active');
            return;
        }

        const labels = history.map(h => h.date);
        const values = history.map(h => h[c.field] ?? 0);

        // ── Graphique Chart.js ──────────────────────────────────────────────
        const canvas  = document.getElementById('metric-history-chart');
        const ctx     = canvas.getContext('2d');
        if (window._metricHistoryChart instanceof Chart) {
            window._metricHistoryChart.destroy();
        }
        const pointColors = values.map(v => (v < 0 && c.negColor) ? c.negColor : c.color);
        window._metricHistoryChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels,
                datasets: [{
                    label: c.label,
                    data: values,
                    borderColor: c.color,
                    backgroundColor: c.color + '22',
                    pointBackgroundColor: pointColors,
                    pointRadius: history.length <= 30 ? 4 : 2,
                    borderWidth: 2,
                    fill: true,
                    tension: 0.35,
                }],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: ctx => {
                                const v = ctx.parsed.y;
                                const sign = v > 0 ? '+' : '';
                                return ` ${sign}${v.toLocaleString('fr-FR', {minimumFractionDigits:2, maximumFractionDigits:2})} ${c.unit}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: { color: '#8b949e', font: { size: 10 }, maxTicksLimit: 10 },
                        grid:  { color: '#30363d' },
                    },
                    y: {
                        ticks: {
                            color: '#8b949e',
                            font: { size: 10 },
                            callback: v => {
                                const sign = v > 0 ? '+' : '';
                                return `${sign}${v.toLocaleString('fr-FR')} ${c.unit}`;
                            }
                        },
                        grid: { color: '#30363d' },
                    }
                }
            }
        });

        // ── Tableau ─────────────────────────────────────────────────────────
        const rows = [...history].reverse().map(h => {
            const v   = h[c.field] ?? 0;
            const cls = v > 0 ? 'color:var(--green)' : v < 0 ? 'color:var(--red)' : 'color:var(--text2)';
            const sign = v > 0 ? '+' : '';
            const fmt  = `${sign}${v.toLocaleString('fr-FR', {minimumFractionDigits:2,maximumFractionDigits:2})} ${c.unit}`;
            return `<tr>
                <td class="mono" style="padding:6px 10px;">${h.date}</td>
                <td class="mono" style="padding:6px 10px;font-weight:600;text-align:right;${cls}">${fmt}</td>
            </tr>`;
        }).join('');

        tableEl.innerHTML = `
            <div class="table-wrap" style="max-height:260px;overflow-y:auto;">
                <table style="width:100%;">
                    <thead><tr>
                        <th style="padding:6px 10px;text-align:left;">Date</th>
                        <th style="padding:6px 10px;text-align:right;">Valeur</th>
                    </tr></thead>
                    <tbody>${rows}</tbody>
                </table>
            </div>
            <div style="margin-top:8px;font-size:0.75em;color:var(--text3);">${history.length} entrée(s) · Enregistrement quotidien automatique</div>`;

        modal.classList.add('active');
    }

    renderEvolutionCharts() {
        const section = document.getElementById('portfolio-evolution-section');
        if (!section) return;
        const history = this.getHistory();
        if (!history.length) { section.style.display = 'none'; return; }

        // Mettre en cache pour le rendu lazy
        this._evoHistory = history;
        this._evoCfgs = [
            { id: 'evo-chart-investi', field: 'totalInvesti', label: '💰 Total investi',    color: '#4493f8', unit: 'MAD' },
            { id: 'evo-chart-profit',  field: 'profitNet',    label: '📊 Profit / Perte',   color: '#3fb950', negColor: '#f85149', unit: 'MAD' },
            { id: 'evo-chart-perf',    field: 'performance',  label: '📈 Performance',       color: '#d29922', negColor: '#f85149', unit: '%'   },
        ];

        // Reconstruire à chaque render pour mettre les valeurs à jour
        section.innerHTML = `
        <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:4px;">
            ${this._evoCfgs.map(c => {
                const values  = history.map(h => h[c.field] ?? 0);
                const lastVal = values[values.length - 1] ?? 0;
                const color   = (c.negColor && lastVal < 0) ? c.negColor : c.color;
                const sign    = lastVal > 0 ? '+' : '';
                const fmtVal  = lastVal.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                const valColor = lastVal < 0 ? 'var(--red)' : lastVal > 0 ? color : 'var(--text)';
                return `
                <div style="flex:1;min-width:160px;background:var(--bg2);border:1px solid var(--border);border-radius:10px;padding:10px 12px;">
                    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px;">
                        <span style="font-size:0.74em;color:var(--text3);">${c.label}</span>
                        <button id="${c.id}-btn" onclick="toggleEvoChart('${c.id}')"
                            title="Afficher / masquer le graphique"
                            style="background:none;border:none;cursor:pointer;font-size:1em;opacity:0.4;padding:0 2px;line-height:1;transition:opacity 0.2s;">📈</button>
                    </div>
                    <div style="font-size:1.1em;font-weight:700;color:${valColor};">${sign}${fmtVal} ${c.unit}</div>
                    <div id="${c.id}-wrap" style="display:none;position:relative;height:75px;margin-top:8px;">
                        <canvas id="${c.id}"></canvas>
                    </div>
                </div>`;
            }).join('')}
        </div>
        <div style="text-align:right;margin-top:2px;">
            <span style="font-size:0.72em;color:var(--text3);">${history.length} point${history.length>1?'s':''} enregistré${history.length>1?'s':''}</span>
            &nbsp;
            <button onclick="portfolioManager.resetHistorique()" style="background:none;border:none;cursor:pointer;font-size:0.72em;color:var(--text3);">🗑 Réinitialiser</button>
        </div>`;

        section.style.display = 'block';
    }

    // Rendu lazy d'un seul graphique (appelé par toggleEvoChart)
    _renderOneEvoChart(cfgId) {
        const history = this._evoHistory || this.getHistory();
        const cfgs    = this._evoCfgs || [
            { id: 'evo-chart-investi', field: 'totalInvesti', label: '💰 Total investi',  color: '#4493f8', unit: 'MAD' },
            { id: 'evo-chart-profit',  field: 'profitNet',    label: '📊 Profit / Perte', color: '#3fb950', negColor: '#f85149', unit: 'MAD' },
            { id: 'evo-chart-perf',    field: 'performance',  label: '📈 Performance',    color: '#d29922', negColor: '#f85149', unit: '%'   },
        ];
        const cfg = cfgs.find(c => c.id === cfgId);
        if (!cfg) return;
        const canvas = document.getElementById(cfg.id);
        if (!canvas) return;

        const values  = history.map(h => h[cfg.field] ?? 0);
        const labels  = history.map(h => h.date);
        const lastVal = values[values.length - 1] ?? 0;
        const color   = (cfg.negColor && lastVal < 0) ? cfg.negColor : cfg.color;

        const existing = Chart.getChart(canvas);
        if (existing) existing.destroy();

        new Chart(canvas, {
            type: 'line',
            data: {
                labels,
                datasets: [{
                    data: values,
                    borderColor: color,
                    backgroundColor: color + '22',
                    pointBackgroundColor: values.map(v => (cfg.negColor && v < 0) ? cfg.negColor : cfg.color),
                    pointRadius: history.length <= 7 ? 4 : (history.length <= 30 ? 2 : 1),
                    borderWidth: 2,
                    fill: true,
                    tension: 0.35,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            title: () => '',
                            label: ctx => {
                                const v = ctx.parsed.y;
                                const s = v > 0 ? '+' : '';
                                return ` ${s}${v.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${cfg.unit}`;
                            }
                        }
                    }
                },
                scales: {
                    x: { ticks: { display: false }, grid: { display: false } },
                    y: {
                        ticks: {
                            color: '#8b949e', font: { size: 9 }, maxTicksLimit: 4,
                            callback: v => {
                                if (Math.abs(v) >= 1000) return (v/1000).toFixed(0)+'k';
                                return v.toFixed(0) + (cfg.unit === '%' ? '%' : '');
                            }
                        },
                        grid: { color: '#ffffff10' }
                    }
                }
            }
        });
    }

    resetHistorique() {
        if (!confirm('Effacer tout l\'historique d\'évolution du portefeuille ?')) return;
        localStorage.removeItem('portfolio_history');
        const section = document.getElementById('portfolio-evolution-section');
        if (section) section.style.display = 'none';
        this.showNotification('🗑 Historique effacé', 'info');
    }

    confirmerViderPortefeuille() {
        if (this.stocks.length === 0) {
            this.showNotification('ℹ️ Portefeuille déjà vide', 'info');
            return;
        }

        if (confirm('⚠️ Êtes-vous sûr de vouloir vider tout le portefeuille ? Cette action est irréversible.')) {
            this.stocks = [];
            this.save();
            this.render();
            this.showNotification('🗑️ Portefeuille vidé', 'success');
        }
    }

    setupEvents() {
        const form = document.getElementById('stockForm');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const symbole = document.getElementById('symbol').value;
                if (!symbole) {
                    alert('Veuillez sélectionner une société');
                    return;
                }
                
                const quantite = document.getElementById('quantity').value;
                const prixAchat = document.getElementById('buyPrice').value;
                const prixActuel = document.getElementById('currentPrice').value;
                const frais = document.getElementById('fees').value || 0;
                const dateInput = document.getElementById('dateAjoutInput');
                let dateAjout = null;
                if (dateInput && dateInput.value) {
                    const d = new Date(dateInput.value);
                    dateAjout = d.toLocaleString('fr-FR', {
                        day:'2-digit', month:'2-digit', year:'numeric',
                        hour:'2-digit', minute:'2-digit'
                    });
                }

                if (!quantite || quantite <= 0) {
                    alert('Veuillez entrer une quantité valide');
                    return;
                }
                
                if (!prixAchat || prixAchat <= 0) {
                    alert('Veuillez entrer un prix d\'achat valide');
                    return;
                }
                
                const stock = new Stock(
                    Date.now().toString(),
                    symbole,
                    COMPANY_NAMES[symbole],
                    quantite,
                    prixAchat,
                    prixActuel || 0,
                    frais,
                    dateAjout
                );
                
                await this.addStock(stock);
                form.reset();
                this.updatePrixFormulaire();
                // Fermer le modal après ajout
                if (typeof fermerModalTransaction === 'function') fermerModalTransaction();
                // Si cette transaction venait d'une "en cours" → la supprimer automatiquement
                if (typeof pendingManager !== 'undefined') pendingManager.onTransactionAdded();
            });
        }

        const symbolSelect = document.getElementById('symbol');
        if (symbolSelect) {
            symbolSelect.addEventListener('change', () => {
                const s = symbolSelect.value;
                const nameInput = document.getElementById('companyName');
                const priceInput = document.getElementById('currentPrice');
                
                if (s && COMPANY_NAMES[s]) {
                    nameInput.value = COMPANY_NAMES[s];
                    const pData = this.priceService.getData(s);
                    if (pData) {
                        priceInput.value = pData.price;
                    }
                } else {
                    nameInput.value = '';
                }
            });
        }
    }

    render() {
        const container = document.getElementById('stocksList');
        if (!container) return;
        
        if (this.stocks.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="icon">💼</div>
                    <p>Aucune action dans le portefeuille. Ajoutez-en une !</p>
                </div>
            `;
            const bottomBar = document.getElementById('portfolio-bottom-actions');
            if (bottomBar) bottomBar.style.display = 'none';
        } else {

            // ── Consolidation par symbole ──────────────────────
            // Regroupe toutes les lignes d'une même société en une seule
            // Prix de revient = moyenne pondérée par les quantités
            const grouped = {};
            this.stocks.forEach(s => {
                const sym = s.symbole;
                if (!grouped[sym]) {
                    grouped[sym] = {
                        symbole: sym,
                        nom: (typeof COMPANY_NAMES !== 'undefined' && COMPANY_NAMES[sym]) || s.nom,
                        quantiteTotale: 0,
                        totalHT: 0,          // somme(qté × prixAchat HT)
                        totalTTC: 0,         // somme(prixTotalTTC)
                        prixActuel: s.prixActuel,
                        lastUpdate: s.lastUpdate,
                        ids: []
                    };
                }
                const g = grouped[sym];
                g.quantiteTotale += s.quantite;
                g.totalHT        += s.quantite * s.prixAchat;
                g.totalTTC       += s.getPrixTotalTTC();
                // Prendre le cours le plus récent
                if (new Date(s.lastUpdate) > new Date(g.lastUpdate)) {
                    g.prixActuel  = s.prixActuel;
                    g.lastUpdate  = s.lastUpdate;
                }
                g.ids.push(s.id);
            });

            // Calculs dérivés pour chaque groupe
            const lignes = Object.values(grouped).map(g => {
                // Prix de revient unitaire HT (moyenne pondérée)
                const prixRevientHT  = g.totalHT / g.quantiteTotale;
                // Commission sur la vente
                const commVente      = g.quantiteTotale * g.prixActuel * COMMISSION;
                const valeurVenteTTC = g.quantiteTotale * g.prixActuel - commVente;
                const profitBrut     = valeurVenteTTC - g.totalTTC;
                const taxe           = profitBrut > 0 ? profitBrut * TAXE_PLUS_VALUE : 0;
                const profitNet      = profitBrut > 0 ? profitBrut - taxe : profitBrut;
                const variation      = g.totalTTC > 0 ? (profitNet / g.totalTTC) * 100 : 0;
                const alerte         = Math.abs(variation) >= 5 ? (variation >= 5 ? 'profit' : 'loss') : null;
                return { ...g, prixRevientHT, profitNet, variation, alerte };
            });

            // ── Total profits positifs (badge à côté du bouton filtre) ──────────
            // 1) Lignes consolidées positives (société globalement en profit)
            const lignesPositives  = lignes.filter(l => l.profitNet > 0);
            const totalConsolPos   = lignesPositives.reduce((s, l) => s + l.profitNet, 0);
            // 2) Transactions partiellement positives (société globalement en perte)
            const symbConsolPos    = new Set(lignesPositives.map(l => l.symbole));
            const txPartielsPos    = this.stocks.filter(tx => !symbConsolPos.has(tx.symbole) && tx.getProfitNet() > 0);
            const totalPartielsPos = txPartielsPos.reduce((s, tx) => s + tx.getProfitNet(), 0);
            // 3) Grand total
            const grandTotalPos    = totalConsolPos + totalPartielsPos;
            const grandNbPos       = lignesPositives.length + txPartielsPos.length;
            const badgeProfits = document.getElementById('total-profits-positifs');
            if (badgeProfits) {
                if (grandNbPos > 0) {
                    // ── Variation vs veille ──────────────────────────────────
                    let varHTML = '';
                    try {
                        const histData = JSON.parse(localStorage.getItem('portfolio_history') || '[]');
                        const todayStr = new Date().toLocaleDateString('fr-FR', {day:'2-digit',month:'2-digit',year:'numeric'});
                        const prevEntry = [...histData].reverse().find(h => h.date !== todayStr && h.profitPos != null);
                        if (prevEntry != null) {
                            const delta    = grandTotalPos - prevEntry.profitPos;
                            const sign     = delta >= 0 ? '+' : '';
                            const arrow    = delta >= 0 ? '▲' : '▼';
                            const varColor = delta >= 0 ? '#3fb950' : '#f85149';
                            const fmtDelta = Math.abs(delta).toLocaleString('fr-FR', {minimumFractionDigits:2, maximumFractionDigits:2});
                            varHTML = ` <span style="font-size:0.88em;color:${varColor};margin-left:4px;">${arrow} ${sign}${sign===''?'-':''}${fmtDelta} MAD</span>`;
                        }
                    } catch(e) {}
                    badgeProfits.innerHTML = `✅ +${grandTotalPos.toLocaleString('fr-FR', {minimumFractionDigits:2, maximumFractionDigits:2})} MAD${varHTML}`;
                    badgeProfits.style.display = 'flex';
                } else {
                    badgeProfits.style.display = 'none';
                }
            }

            // Filtre : profits uniquement
            const lignesFiltrees = this._filtreProfit ? lignes.filter(l => l.profitNet > 0) : lignes;
            if (this._filtreProfit && lignesFiltrees.length === 0) {
                document.getElementById('stocksList').innerHTML =
                    '<div style="text-align:center;padding:40px;color:var(--text3);font-size:0.9em;">Aucune ligne en profit pour le moment.</div>';
                return;
            }
            let lignesAffichees = this._filtreProfit ? lignesFiltrees : lignes;

            // Filtre : Trading ou Investissement
            if (this._filtreTx) {
                const tagsAll = this._loadTags();
                lignesAffichees = lignesAffichees.filter(g => {
                    // 1) tag au niveau de la société
                    if ((tagsAll[g.symbole] || '') === this._filtreTx) return true;
                    // 2) au moins une transaction individuelle avec ce tag
                    return this.stocks
                        .filter(s => s.symbole === g.symbole)
                        .some(tx => (tagsAll['tx_' + tx.id] || '') === this._filtreTx);
                });
                if (lignesAffichees.length === 0) {
                    const label = this._filtreTx === 'trading' ? '📊 Trading' : '💼 Investissement';
                    document.getElementById('stocksList').innerHTML =
                        `<div style="text-align:center;padding:40px;color:var(--text3);font-size:0.9em;">Aucune transaction étiquetée « ${label} » pour le moment.<br><span style="font-size:0.85em;opacity:0.7;">Utilisez le badge de statut sur chaque ligne pour étiqueter vos transactions.</span></div>`;
                    return;
                }
            }

            // Sous-filtre : positif / négatif (actif seulement si _filtreTx est défini)
            if (this._filtreTx && this._filtreSens) {
                lignesAffichees = lignesAffichees.filter(g =>
                    this._filtreSens === 'positif' ? g.profitNet > 0 : g.profitNet < 0
                );
                // Mettre à jour le compteur dans la barre
                const cntEl = document.getElementById('subfilter-count');
                if (cntEl) cntEl.textContent = lignesAffichees.length + ' titre' + (lignesAffichees.length > 1 ? 's' : '');
                if (lignesAffichees.length === 0) {
                    const sens = this._filtreSens === 'positif' ? 'en profit positif' : 'en profit négatif';
                    document.getElementById('stocksList').innerHTML =
                        `<div style="text-align:center;padding:40px;color:var(--text3);font-size:0.9em;">Aucune transaction ${sens} dans cette catégorie.</div>`;
                    return;
                }
            } else {
                const cntEl = document.getElementById('subfilter-count');
                if (cntEl) cntEl.textContent = '';
            }

            // Tri
            const tri = this._sortCol || 'societe';
            const dir = this._sortDir || 'asc';
            lignesAffichees.sort((a, b) => {
                let va, vb;
                if (tri === 'variation') { va = a.variation; vb = b.variation; }
                else if (tri === 'profit') { va = a.profitNet; vb = b.profitNet; }
                else { va = a.nom.toLowerCase(); vb = b.nom.toLowerCase(); }
                if (va < vb) return dir === 'asc' ? -1 : 1;
                if (va > vb) return dir === 'asc' ? 1 : -1;
                return 0;
            });

            const arrow = (col) => {
                if (this._sortCol !== col) return '<span style="opacity:0.3">↕</span>';
                return this._sortDir === 'asc' ? '↑' : '↓';
            };
            const thS = 'cursor:pointer;user-select:none;';

            let html = '<div class="nav-table-outer" id="nav-outer-portfolio" tabindex="0" onclick="tableNav.activate(\'nav-outer-portfolio\',\'tw-portfolio\')" title="Cliquez puis flèches clavier pour naviguer" style="position:relative;outline:none;">';
            html += '<div id="tw-portfolio" style="overflow-x:auto;max-height:65vh;overflow-y:auto;border-radius:8px;border:1px solid var(--border);width:100%;">';
            html += '<table class="stocks-table" style="table-layout:fixed;width:100%;min-width:1220px;border-collapse:collapse;"><thead><tr style="position:sticky;top:0;z-index:4;background:var(--bg3);">';
            html += `<th style="${thS}position:sticky;left:0;top:0;z-index:5;background:var(--bg3);width:180px;min-width:180px;" onclick="portfolioManager.sortBy('societe')">Société / Ticker ${arrow('societe')}</th>`;
            html += '<th style="width:145px;min-width:145px;text-align:center;white-space:nowrap;" title="Tag société — prime sur les tags des transactions individuelles">Statut société</th>';
            html += '<th style="width:100px;min-width:100px;white-space:nowrap;">Qté totale</th>';
            html += '<th style="width:140px;min-width:140px;white-space:nowrap;">Prix revient HT</th>';
            html += '<th style="width:145px;min-width:145px;white-space:nowrap;">Total investi TTC</th>';
            html += '<th style="width:125px;min-width:125px;white-space:nowrap;">Cours actuel</th>';
            html += `<th style="${thS}width:135px;min-width:135px;white-space:nowrap;" onclick="portfolioManager.sortBy('profit')">Profit net ${arrow('profit')}</th>`;
            html += `<th style="${thS}width:115px;min-width:115px;white-space:nowrap;" onclick="portfolioManager.sortBy('variation')">Variation % ${arrow('variation')}</th>`;
            html += '<th style="width:140px;min-width:140px;text-align:center;white-space:nowrap;">Actions</th>';
            html += '</tr></thead><tbody>';

            // ── Transactions individuelles non couvertes par le consolidé ─────────
            // Cas 1 : filtre "Profits uniquement" → lignes positives dans groupes négatifs
            // Cas 2 : filtre Trading/Invest + Positif → idem, mais restreint au tag
            // Cas 3 : filtre Trading/Invest + Négatif → lignes négatives dans groupes positifs
            let txPartielles = [];
            const _tagsForPartiel = this._loadTags();

            const _txMatchTag = (tx) => {
                // Vrai si cette transaction correspond au filtre _filtreTx actif
                if (!this._filtreTx) return true;
                const compTag = _tagsForPartiel[tx.symbole] || '';
                const txTag   = _tagsForPartiel['tx_' + tx.id] || '';
                return compTag === this._filtreTx || txTag === this._filtreTx;
            };

            if (this._filtreProfit) {
                // Cas 1 : groupe consolidé négatif mais tx individuelle positive
                const symbPositifs = new Set(lignesAffichees.map(l => l.symbole));
                this.stocks.forEach(tx => {
                    if (symbPositifs.has(tx.symbole)) return;
                    if (tx.getProfitNet() > 0) txPartielles.push(tx);
                });
                txPartielles.sort((a, b) => b.getProfitNet() - a.getProfitNet());

            } else if (this._filtreTx && this._filtreSens) {
                const symbDejaAffich = new Set(lignesAffichees.map(l => l.symbole));
                this.stocks.forEach(tx => {
                    if (!_txMatchTag(tx)) return;          // mauvais tag → ignorer
                    if (symbDejaAffich.has(tx.symbole)) return; // groupe déjà visible → ignorer
                    const pn = tx.getProfitNet();
                    if (this._filtreSens === 'positif' && pn > 0) txPartielles.push(tx);
                    if (this._filtreSens === 'negatif' && pn < 0) txPartielles.push(tx);
                });
                // Tri : positif → décroissant, négatif → croissant (pire en tête)
                txPartielles.sort((a, b) =>
                    this._filtreSens === 'positif'
                        ? b.getProfitNet() - a.getProfitNet()
                        : a.getProfitNet() - b.getProfitNet()
                );
            }

            lignesAffichees.forEach(g => {
                const colorProfit = g.profitNet >= 0 ? 'up' : 'down';
                const colorVar    = g.variation  >= 0 ? 'up' : 'down';
                // Couleur du cours actuel = variation journalière du marché (comme tableau Marchés)
                const mktData     = this.priceService.getData(g.symbole);
                const colorCours  = mktData && mktData.variation != null
                    ? (mktData.variation >= 0 ? 'up' : 'down')
                    : colorVar;
                const detailId    = 'detail-' + g.symbole;
                const nbTx        = g.ids.length;
                // Clé du badge société : si 1 seule tx ET pas de tag société défini → utilise la clé tx
                // (rétrocompatibilité : les tags déjà posés sur la transaction restent visibles)
                const txUnique      = nbTx === 1 ? this.stocks.find(s => s.symbole === g.symbole) : null;
                const companyTagSet = !!this.getTag(g.symbole);
                const companyBadgeKey = (!companyTagSet && txUnique)
                    ? ('tx_' + txUnique.id)   // 1 tx, pas de tag société → affiche le tag tx
                    : g.symbole;              // multi-tx OU tag société défini → affiche le tag société

                html += `<tr class="${g.alerte ? 'row-' + g.alerte : ''}" data-symbole="${g.symbole}" data-prix="${g.prixActuel}" style="cursor:context-menu;">`;
                html += `<td style="position:sticky;left:0;z-index:2;background:var(--bg2);min-width:160px;border-right:1px solid var(--border);">
                    <div style="display:flex;align-items:center;gap:6px;">
                        <div><strong>${g.nom}</strong> <span style="font-size:0.75em;color:var(--text3);cursor:pointer;" onclick="document.getElementById('${detailId}').style.display=document.getElementById('${detailId}').style.display==='none'?'table-row':'none'" title="Voir les ${nbTx} transaction(s)">(${nbTx} tx)</span><br><span class="mono" style="font-size:0.8em;color:var(--text2);">${g.symbole}</span></div>
                    </div>
                </td>`;
                html += `<td style="text-align:center;vertical-align:middle;">${this._tagBadge(companyBadgeKey, true)}</td>`;
                html += `<td class="mono cell-editable" title="Double-clic pour modifier la quantité totale" style="cursor:cell;"
                            ondblclick="event.stopPropagation();portfolioManager.editGroupeCell('${g.symbole}','quantite',this)">${g.quantiteTotale}</td>`;
                html += `<td class="mono cell-editable" title="Double-clic pour modifier le prix de revient" style="cursor:cell;"
                            ondblclick="event.stopPropagation();portfolioManager.editGroupeCell('${g.symbole}','prixRevient',this)">${this._fmtMAD(g.prixRevientHT)} MAD</td>`;
                html += `<td class="mono">${this._fmtMAD(g.totalTTC)} MAD</td>`;
                html += `<td class="mono" title="Double-clic pour modifier"
                            ondblclick="portfolioManager.editCours('${g.symbole}', this)">
                            ${this._fmtMAD(g.prixActuel)} MAD</td>`;
                html += `<td class="mono ${colorProfit}">${g.profitNet >= 0 ? '+' : ''}${this._fmtMAD(g.profitNet)} MAD</td>`;
                html += `<td class="mono ${colorVar}">${g.variation >= 0 ? '+' : ''}${g.variation.toFixed(2)}%</td>`;
                const safeNomG = g.nom.replace(/'/g,"\\'");
                html += `<td style="white-space:nowrap;text-align:center;vertical-align:middle;">
                    <div style="display:flex;align-items:center;justify-content:center;gap:4px;flex-wrap:nowrap;">
                        <button onclick="event.stopPropagation();portfolioManager.showPositionChart('${g.symbole}','${safeNomG}')"
                            title="Graphique évolution profit — ${g.nom}"
                            style="background:none;border:1px solid var(--border);border-radius:6px;color:var(--text3);
                                   cursor:pointer;font-size:0.85em;padding:2px 6px;line-height:1.4;white-space:nowrap;
                                   transition:all .2s;"
                            onmouseover="this.style.borderColor='#3fb950';this.style.color='#3fb950'"
                            onmouseout="this.style.borderColor='var(--border)';this.style.color='var(--text3)'">📈</button>
                        <button class="btn btn-sm" style="background:var(--accent2);color:#fff;" title="Modifier le ticker/nom de ${g.nom}"
                                onclick="event.stopPropagation();portfolioManager.editSymboleNom('${g.symbole}')">✏️</button>
                        <button class="btn btn-danger btn-sm" title="Supprimer toutes les lignes ${g.nom}"
                                onclick="portfolioManager.removeGroupe('${g.symbole}')">🗑️</button>
                        <a href="https://clients.wafabourse.com/user/login?redirect=%2Fordres%2F" target="_blank" rel="noopener"
                           class="btn btn-sm" style="background:#c47d0e;color:#fff;text-decoration:none;" title="Passer un ordre ${g.nom} via Wafabourse">Wafa</a>
                        <a href="https://www.bmcedirect.ma/fr/identification/authentification.html" target="_blank" rel="noopener"
                           class="btn btn-sm" style="background:#1a3f6e;color:#fff;text-decoration:none;" title="Passer un ordre via BMCE Direct">BMCE</a>
                    </div>
                </td>`;
                html += '</tr>';

                // Ligne détail avec les transactions individuelles (filtrées si mode tx actif)
                const tagsForDetail = this._loadTags();
                const txListAll = this.stocks.filter(s => s.symbole === g.symbole);
                const txList = this._filtreTx
                    ? txListAll.filter(tx => {
                        const compTag = tagsForDetail[tx.symbole] || '';
                        const txTag   = tagsForDetail['tx_' + tx.id] || '';
                        // Inclure si le tag société correspond OU le tag individuel correspond
                        return compTag === this._filtreTx || txTag === this._filtreTx;
                      })
                    : txListAll;
                html += `<tr id="${detailId}" style="display:none;"><td colspan="9" style="padding:8px 16px;background:var(--bg);">`;
                html += '<table style="width:100%;font-size:0.88em;"><thead><tr style="color:var(--text2);"><th>Statut</th><th title="Double-clic pour modifier">Date ✎</th><th title="Double-clic pour modifier">Qté ✎</th><th title="Double-clic pour modifier">Prix achat ✎</th><th>Total TTC</th><th>Profit net</th><th>%</th><th></th></tr></thead><tbody>';
                txList.forEach(tx => {
                    const txProfit = tx.getProfitNet();
                    const txPct = tx.getPourcentage();
                    const txCls = txProfit >= 0 ? 'up' : 'down';
                    html += `<tr>`;
                    html += `<td style="text-align:center;">${this._tagBadge('tx_' + tx.id, true)}</td>`;
                    html += `<td class="mono cell-editable" title="Double-clic pour modifier la date"
                                ondblclick="event.stopPropagation();portfolioManager.editTxCell('${tx.id}','date',this)"
                                style="cursor:cell;">${tx.getFormattedDate()}</td>`;
                    html += `<td class="mono cell-editable" title="Double-clic pour modifier la quantité"
                                ondblclick="event.stopPropagation();portfolioManager.editTxCell('${tx.id}','quantite',this)"
                                style="cursor:cell;">${tx.quantite}</td>`;
                    html += `<td class="mono cell-editable" title="Double-clic pour modifier le prix d'achat"
                                ondblclick="event.stopPropagation();portfolioManager.editTxCell('${tx.id}','prixAchat',this)"
                                style="cursor:cell;">${fmtMAD(tx.prixAchat)} MAD</td>`;
                    html += `<td class="mono">${fmtMAD(tx.getPrixTotalTTC())} MAD</td>`;
                    html += `<td class="mono ${txCls}">${txProfit >= 0 ? '+' : ''}${fmtMAD(txProfit)} MAD</td>`;
                    html += `<td class="mono ${txCls}">${txPct >= 0 ? '+' : ''}${txPct.toFixed(2)}%</td>`;
                    const safeNomTx = g.nom.replace(/'/g,"\\'");
                    html += `<td style="white-space:nowrap;">
                        <button onclick="event.stopPropagation();portfolioManager.showPositionChart('${tx.symbole}','${safeNomTx}')"
                            title="Graphique évolution profit"
                            style="background:none;border:1px solid var(--border);border-radius:6px;color:var(--text3);
                                   cursor:pointer;font-size:0.75em;padding:2px 5px;line-height:1.4;
                                   transition:all .2s;"
                            onmouseover="this.style.borderColor='#3fb950';this.style.color='#3fb950'"
                            onmouseout="this.style.borderColor='var(--border)';this.style.color='var(--text3)'">📈</button>
                        <button class="btn btn-danger btn-sm" style="font-size:0.75em;padding:2px 6px;margin-left:4px;" title="Retirer cette transaction" onclick="event.stopPropagation();portfolioManager.removeStock('${tx.id}')">✕</button>
                    </td>`;
                    html += `</tr>`;
                });
                html += '</tbody></table></td></tr>';
            });

            // ── Lignes partielles (transactions individuelles hors consolidé) ────
            const _showPartiel = (this._filtreProfit || (this._filtreTx && this._filtreSens)) && txPartielles.length > 0;
            if (_showPartiel) {
                const isPos = this._filtreProfit || this._filtreSens === 'positif';
                const bgHeader  = isPos ? '#0d2318'  : '#2a0a0a';
                const colHeader = isPos ? '#3fb950'  : '#f85149';
                const borderHdr = isPos ? '#238636'  : '#6e1a1a';
                const bgRow     = isPos ? '#091a0f'  : '#1a0909';
                const labelHdr  = isPos
                    ? '🟡 Transactions individuellement positives (groupe globalement en perte)'
                    : '🟠 Transactions individuellement négatives (groupe globalement en profit)';

                html += `<tr style="background:${bgHeader};"><td colspan="9" style="padding:6px 14px;font-size:0.8em;color:${colHeader};font-weight:700;border-top:2px solid ${borderHdr};">
                    ${labelHdr}
                </td></tr>`;

                txPartielles.forEach(tx => {
                    const txProfit = tx.getProfitNet();
                    const txPct    = tx.getPourcentage();
                    const txCls    = txProfit >= 0 ? 'up' : 'down';
                    const sign     = txProfit >= 0 ? '+' : '';
                    const nom      = (typeof COMPANY_NAMES !== 'undefined' && COMPANY_NAMES[tx.symbole]) || tx.nom;
                    html += `<tr data-symbole="${tx.symbole}" data-prix="${tx.prixActuel}" style="background:${bgRow};opacity:0.95;cursor:context-menu;">`;
                    html += `<td style="position:sticky;left:0;z-index:2;background:${bgRow};min-width:160px;border-right:1px solid var(--border);">
                        <strong style="font-size:0.9em;">${nom}</strong><br>
                        <span class="mono" style="font-size:0.75em;color:var(--text3);">${tx.symbole} · ${tx.getFormattedDate()}</span>
                    </td>`;
                    html += `<td style="text-align:center;">${this._tagBadge('tx_' + tx.id, true)}</td>`;
                    html += `<td class="mono cell-editable" title="Double-clic pour modifier la quantité" style="cursor:cell;"
                                ondblclick="event.stopPropagation();portfolioManager.editTxCell('${tx.id}','quantite',this)">${tx.quantite}</td>`;
                    html += `<td class="mono cell-editable" title="Double-clic pour modifier le prix d'achat" style="cursor:cell;"
                                ondblclick="event.stopPropagation();portfolioManager.editTxCell('${tx.id}','prixAchat',this)">${fmtMAD(tx.prixAchat)} MAD</td>`;
                    html += `<td class="mono">${fmtMAD(tx.getPrixTotalTTC())} MAD</td>`;
                    html += `<td class="mono">${fmtMAD(tx.prixActuel)} MAD</td>`;
                    html += `<td class="mono ${txCls}">${sign}${fmtMAD(txProfit)} MAD</td>`;
                    html += `<td class="mono ${txCls}">${sign}${txPct.toFixed(2)}%</td>`;
                    const safeNomPartiel = nom.replace(/'/g,"\\'");
                    html += `<td style="white-space:nowrap;">
                        <button onclick="event.stopPropagation();portfolioManager.showPositionChart('${tx.symbole}','${safeNomPartiel}')"
                            title="Graphique évolution profit"
                            style="background:none;border:1px solid var(--border);border-radius:6px;color:var(--text3);cursor:pointer;font-size:0.75em;padding:2px 5px;line-height:1.4;transition:all .2s;margin-right:4px;"
                            onmouseover="this.style.borderColor='${colHeader}';this.style.color='${colHeader}'"
                            onmouseout="this.style.borderColor='var(--border)';this.style.color='var(--text3)'">📈</button>
                        <button class="btn btn-danger btn-sm" style="font-size:0.75em;padding:2px 6px;" title="Retirer cette transaction" onclick="event.stopPropagation();portfolioManager.removeStock('${tx.id}')">✕</button>
                    </td></tr>`;
                });
            }

            // ── Ligne total (mode filtre actif) ──────────────────────────────────
            const _showTotal = this._filtreProfit || (this._filtreTx && this._filtreSens);
            if (_showTotal) {
                const totalConsolide = lignesAffichees.reduce((s, l) => s + l.profitNet, 0);
                const totalPartiel   = txPartielles.reduce((s, tx) => s + tx.getProfitNet(), 0);
                const totalGlobal    = totalConsolide + totalPartiel;
                const nbLignes       = lignesAffichees.length + txPartielles.length;
                const isPos2         = totalGlobal >= 0;
                const totalCls       = isPos2 ? 'up' : 'down';
                const totalBg        = isPos2 ? '#0a2014'  : '#1a0808';
                const totalBorder    = isPos2 ? '#3fb950'  : '#f85149';
                const totalColor     = isPos2 ? '#3fb950'  : '#f85149';
                const totalLabel     = isPos2 ? '🟢 TOTAL GAINS' : '🔴 TOTAL PERTES';
                const sign           = totalGlobal >= 0 ? '+' : '';
                html += `<tr style="background:${totalBg};border-top:2px solid ${totalBorder};position:sticky;bottom:0;">`;
                html += `<td style="position:sticky;left:0;z-index:2;background:${totalBg};font-weight:800;color:${totalColor};font-size:0.92em;border-right:1px solid var(--border);">
                    ${totalLabel} (${nbLignes} ligne${nbLignes>1?'s':''})
                </td>`;
                html += `<td colspan="5"></td>`;
                html += `<td class="mono ${totalCls}" style="font-weight:800;font-size:1em;">${sign}${fmtMAD(totalGlobal)} MAD</td>`;
                html += `<td colspan="2"></td>`;
                html += `</tr>`;
            }

            html += '</tbody></table></div>';
            // Flèches de navigation portefeuille
            html += '<div class="nav-arrows-overlay">';
            html += '<button class="nav-arrow-btn nav-up"    onclick="event.stopPropagation();tableNav.scroll(\'tw-portfolio\',\'up\')"    title="Haut">▲</button>';
            html += '<button class="nav-arrow-btn nav-down"  onclick="event.stopPropagation();tableNav.scroll(\'tw-portfolio\',\'down\')"  title="Bas">▼</button>';
            html += '<button class="nav-arrow-btn nav-left"  onclick="event.stopPropagation();tableNav.scroll(\'tw-portfolio\',\'left\')"  title="Gauche">◀</button>';
            html += '<button class="nav-arrow-btn nav-right" onclick="event.stopPropagation();tableNav.scroll(\'tw-portfolio\',\'right\')" title="Droite">▶</button>';
            html += '</div></div>'; // ferme nav-arrows-overlay + nav-table-outer
            container.innerHTML = html;
            // Ré-attacher le menu contextuel portefeuille
            if (typeof attacherContextMenuPortefeuille === 'function') { _ctxPortefeuilleAttached = false; attacherContextMenuPortefeuille(); }

            const bottomBar = document.getElementById('portfolio-bottom-actions');
            if (bottomBar) bottomBar.style.display = 'flex';

            // Date de dernière mise à jour
            const lastDates = this.stocks.map(s => new Date(s.lastUpdate)).filter(d => !isNaN(d));
            if (lastDates.length > 0) {
                const latest = new Date(Math.max(...lastDates));
                const el = document.getElementById('portfolio-last-update');
                if (el) el.textContent = '🕒 Mis à jour : ' + latest.toLocaleString('fr-FR', {
                    day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit'
                });
            }
        }
        
        const totaux = this.getTotaux();
        document.getElementById('totalValue').textContent = this._fmtMAD(totaux.totalInvesti) + ' MAD';
        document.getElementById('totalProfitLoss').textContent =
            (totaux.totalProfitNet >= 0 ? '+' : '') + this._fmtMAD(totaux.totalProfitNet) + ' MAD';
        
        const pctEl = document.getElementById('totalPercentage');
        pctEl.textContent = (totaux.pourcentageGlobal >= 0 ? '+' : '') + totaux.pourcentageGlobal.toFixed(2) + '%';
        pctEl.className = 'value ' + (totaux.pourcentageGlobal >= 0 ? 'up' : 'down');

        const plEl = document.getElementById('totalProfitLoss');
        if (plEl) plEl.className = 'value ' + (totaux.totalProfitNet >= 0 ? 'up' : 'down');

        // ── Auto-snapshot quotidien (historique en arrière-plan) ─────────────
        if (this.stocks.some(s => s.prixActuel > 0)) {
            this.saveHistorySnapshot();
        }
    }

    // Modifier le cours actuel de toutes les lignes d'un symbole
    editCours(symbole, td) {
        if (td.querySelector('input')) return;
        const stock0 = this.stocks.find(s => s.symbole === symbole);
        if (!stock0) return;
        const original = td.innerHTML;
        td.classList.add('editing');
        const input = document.createElement('input');
        input.type = 'number'; input.step = '0.01'; input.min = '0';
        input.value = stock0.prixActuel.toFixed(2);
        input.className = 'cell-edit-input';
        td.innerHTML = ''; td.appendChild(input);
        input.focus(); input.select();
        const save = () => {
            const val = parseFloat(input.value);
            if (isNaN(val) || val <= 0) { cancel(); return; }
            this.stocks.filter(s => s.symbole === symbole).forEach(s => {
                s.prixActuel = val;
                s.lastUpdate = new Date().toISOString();
                s.alertSent  = false;
            });
            this.save(); this.render();
            this.showNotification(`✅ Cours ${symbole} mis à jour`, 'success');
        };
        const cancel = () => { td.classList.remove('editing'); td.innerHTML = original; };
        input.addEventListener('keydown', e => {
            if (e.key === 'Enter')  { e.preventDefault(); save(); }
            if (e.key === 'Escape') { e.preventDefault(); cancel(); }
        });
        input.addEventListener('blur', () => setTimeout(save, 150));
    }

    // ── Édition inline d'une cellule de transaction (Date, Qté, Prix achat) ──
    editTxCell(txId, field, td) {
        if (td.querySelector('input')) return; // déjà en cours d'édition
        const tx = this.stocks.find(s => s.id === txId);
        if (!tx) return;

        const original = td.innerHTML;
        td.classList.add('editing');

        const input = document.createElement('input');
        input.className = 'cell-edit-input';

        if (field === 'quantite') {
            input.type = 'number'; input.step = '1'; input.min = '1';
            input.value = tx.quantite;
        } else if (field === 'prixAchat') {
            input.type = 'number'; input.step = '0.01'; input.min = '0.01';
            input.value = tx.prixAchat.toFixed(2);
        } else if (field === 'date') {
            input.type = 'date';
            input.style.minWidth = '130px';
            // dateAjout format : "23/04/2026 14:20" ou "23/04/2026"
            const raw   = (tx.dateAjout || '').split(' ')[0];
            const parts = raw.split('/');
            if (parts.length === 3) {
                input.value = `${parts[2]}-${parts[1].padStart(2,'0')}-${parts[0].padStart(2,'0')}`;
            }
        }

        td.innerHTML = '';
        td.appendChild(input);
        input.focus();
        if (input.type !== 'date') input.select();

        const save = () => {
            if (field === 'quantite') {
                const val = parseInt(input.value, 10);
                if (isNaN(val) || val <= 0) { cancel(); return; }
                tx.quantite = val;
            } else if (field === 'prixAchat') {
                const val = parseFloat(input.value);
                if (isNaN(val) || val <= 0) { cancel(); return; }
                tx.prixAchat = val;
            } else if (field === 'date') {
                const val = input.value; // format YYYY-MM-DD
                if (!val) { cancel(); return; }
                const [y, m, d] = val.split('-');
                const timePart = (tx.dateAjout || '').split(' ')[1] || '';
                tx.dateAjout = `${d}/${m}/${y}${timePart ? ' ' + timePart : ''}`;
            }
            this.save();
            this.render();
            this.showNotification('✅ Transaction mise à jour', 'success');
        };
        const cancel = () => { td.classList.remove('editing'); td.innerHTML = original; };

        input.addEventListener('keydown', e => {
            if (e.key === 'Enter')  { e.preventDefault(); save(); }
            if (e.key === 'Escape') { e.preventDefault(); cancel(); }
        });
        input.addEventListener('blur', () => setTimeout(save, 150));
    }

    // ── Édition inline des colonnes consolidées (Qté totale / Prix revient HT) ──
    editGroupeCell(symbole, field, td) {
        if (td.querySelector('input')) return;
        const txList = this.stocks.filter(s => s.symbole === symbole);
        if (!txList.length) return;

        const original = td.innerHTML;
        td.classList.add('editing');

        const input = document.createElement('input');
        input.className = 'cell-edit-input';
        input.type  = 'number';
        input.step  = '0.01';
        input.min   = '0.01';

        if (field === 'quantite') {
            // Quantité totale = somme des transactions
            const qtyTotale = txList.reduce((s, t) => s + t.quantite, 0);
            input.step  = '1';
            input.value = qtyTotale;
        } else {
            // Prix de revient HT = moyenne pondérée
            const totalHT  = txList.reduce((s, t) => s + t.quantite * t.prixAchat, 0);
            const qtyTotal = txList.reduce((s, t) => s + t.quantite, 0);
            input.value = (totalHT / qtyTotal).toFixed(2);
        }

        td.innerHTML = '';
        td.appendChild(input);
        input.focus();
        input.select();

        const save = () => {
            const val = parseFloat(input.value);
            if (isNaN(val) || val <= 0) { cancel(); return; }

            if (field === 'quantite') {
                // Redistribuer proportionnellement sur chaque transaction
                const qtyAncienne = txList.reduce((s, t) => s + t.quantite, 0);
                const ratio = val / qtyAncienne;
                txList.forEach(t => {
                    t.quantite = Math.round(t.quantite * ratio * 10000) / 10000;
                });
                // Correction d'arrondi : ajuster la dernière tx pour que le total soit exact
                const diff = val - txList.reduce((s, t) => s + t.quantite, 0);
                if (Math.abs(diff) > 0.00001) txList[txList.length - 1].quantite += diff;
            } else {
                // Prix de revient : appliquer le nouveau prix à toutes les transactions
                txList.forEach(t => { t.prixAchat = val; });
            }

            this.save();
            this.render();
            this.showNotification(`✅ ${field === 'quantite' ? 'Quantité' : 'Prix de revient'} ${symbole} mis à jour`, 'success');
        };
        const cancel = () => { td.classList.remove('editing'); td.innerHTML = original; };

        input.addEventListener('keydown', e => {
            if (e.key === 'Enter')  { e.preventDefault(); save(); }
            if (e.key === 'Escape') { e.preventDefault(); cancel(); }
        });
        input.addEventListener('blur', () => setTimeout(save, 150));
    }

    // Modifier le ticker et/ou le nom d'une société dans le portefeuille
    editSymboleNom(ancienSymbole) {
        const stocks = this.stocks.filter(s => s.symbole === ancienSymbole);
        if (stocks.length === 0) return;
        const ancienNom = stocks[0].nom;

        // Créer un dialog modal
        const overlay = document.createElement('div');
        overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);z-index:10000;display:flex;align-items:center;justify-content:center;';
        const dialog = document.createElement('div');
        dialog.style.cssText = 'background:var(--bg2,#161b22);border:1px solid var(--border,#30363d);border-radius:12px;padding:24px;min-width:340px;max-width:90vw;color:var(--text,#e6edf3);font-family:Outfit,sans-serif;';
        dialog.innerHTML = `
            <h3 style="margin-bottom:16px;font-size:1.1em;">✏️ Modifier la société</h3>
            <div style="margin-bottom:12px;">
                <label style="display:block;font-size:0.85em;color:var(--text2,#8b949e);margin-bottom:4px;">Ticker (symbole)</label>
                <input id="edit-sym-ticker" type="text" value="${ancienSymbole}"
                    style="width:100%;padding:8px 12px;background:var(--bg3,#21262d);border:1px solid var(--border,#30363d);border-radius:6px;color:var(--text,#e6edf3);font-family:'JetBrains Mono',monospace;font-size:1em;text-transform:uppercase;" />
            </div>
            <div style="margin-bottom:16px;">
                <label style="display:block;font-size:0.85em;color:var(--text2,#8b949e);margin-bottom:4px;">Nom de la société</label>
                <input id="edit-sym-nom" type="text" value="${ancienNom}"
                    style="width:100%;padding:8px 12px;background:var(--bg3,#21262d);border:1px solid var(--border,#30363d);border-radius:6px;color:var(--text,#e6edf3);font-size:1em;" />
            </div>
            <div style="display:flex;gap:10px;justify-content:flex-end;">
                <button id="edit-sym-cancel" style="padding:8px 16px;border:1px solid var(--border,#30363d);background:transparent;color:var(--text2,#8b949e);border-radius:6px;cursor:pointer;">Annuler</button>
                <button id="edit-sym-save" style="padding:8px 16px;border:none;background:var(--accent,#58a6ff);color:#fff;border-radius:6px;cursor:pointer;font-weight:600;">Enregistrer</button>
            </div>
        `;
        overlay.appendChild(dialog);
        document.body.appendChild(overlay);

        const inputTicker = dialog.querySelector('#edit-sym-ticker');
        const inputNom = dialog.querySelector('#edit-sym-nom');
        inputTicker.focus();
        inputTicker.select();

        const close = () => document.body.removeChild(overlay);
        overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
        dialog.querySelector('#edit-sym-cancel').addEventListener('click', close);
        dialog.querySelector('#edit-sym-save').addEventListener('click', () => {
            const newSym = inputTicker.value.trim().toUpperCase();
            const newNom = inputNom.value.trim();
            if (!newSym || !newNom) { alert('Le ticker et le nom ne peuvent pas être vides.'); return; }

            // Mettre à jour toutes les transactions de cet ancien symbole
            this.stocks.forEach(s => {
                if (s.symbole === ancienSymbole) {
                    s.symbole = newSym;
                    s.nom = newNom;
                }
            });
            this.save();
            this.render();
            close();
            this.showNotification(`✅ ${ancienSymbole} → ${newSym} (${newNom})`, 'success');
        });

        // Enter pour sauvegarder, Escape pour annuler
        [inputTicker, inputNom].forEach(inp => {
            inp.addEventListener('keydown', e => {
                if (e.key === 'Enter') dialog.querySelector('#edit-sym-save').click();
                if (e.key === 'Escape') close();
            });
        });
    }

    // Supprimer toutes les lignes d'un symbole
    removeGroupe(symbole) {
        const nom = (typeof COMPANY_NAMES !== 'undefined' && COMPANY_NAMES[symbole]) || symbole;
        const nb = this.stocks.filter(s => s.symbole === symbole).length;
        if (confirm(`Supprimer les ${nb} transaction(s) de ${nom} ?`)) {
            this.stocks = this.stocks.filter(s => s.symbole !== symbole);
            this.save(); this.render();
            this.showNotification(`✅ ${nom} retiré du portefeuille`, 'success');
        }
    }

    sortBy(col) {
        if (this._sortCol === col) {
            this._sortDir = this._sortDir === 'asc' ? 'desc' : 'asc';
        } else {
            this._sortCol = col;
            this._sortDir = col === 'societe' ? 'asc' : 'desc';
        }
        this.render();
    }

    toggleFiltreProfit() {
        this._filtreProfit = !this._filtreProfit;
        // Désactiver les filtres tx et sous-filtre si on active le filtre profit
        if (this._filtreProfit) {
            this._filtreTx   = null;
            this._filtreSens = null;
            this._setFiltreTxUI(null);
            this._setFiltreSensUI(null);
        }
        const btn = document.getElementById('btn-filter-profit');
        if (btn) {
            if (this._filtreProfit) {
                btn.style.background    = '#0f2a1e';
                btn.style.borderColor   = '#3fb950';
                btn.style.color         = '#3fb950';
                btn.textContent         = '🟢 Profits uniquement ✓';
            } else {
                btn.style.background    = 'var(--bg2)';
                btn.style.borderColor   = 'var(--border)';
                btn.style.color         = 'var(--text3)';
                btn.textContent         = '🟢 Profits uniquement';
            }
        }
        this.render();
    }

    setFiltreTx(type) {
        // Toggle : cliquer une 2e fois sur le même bouton = tout afficher
        const nouveau = this._filtreTx === type ? null : type;
        this._filtreTx  = nouveau;
        this._filtreSens = null; // reset sous-filtre à chaque changement de catégorie

        // Désactiver le filtre profits pour éviter double filtrage
        if (nouveau) {
            this._filtreProfit = false;
            const btnP = document.getElementById('btn-filter-profit');
            if (btnP) {
                btnP.style.background  = 'var(--bg2)';
                btnP.style.borderColor = 'var(--border)';
                btnP.style.color       = 'var(--text3)';
                btnP.textContent       = '🟢 Profits uniquement';
            }
        }
        this._setFiltreTxUI(nouveau);
        this._setFiltreSensUI(null);  // reset visuellement le sous-filtre
        this.render();
    }

    setFiltreSens(sens) {
        // Toggle : recliquer = tout montrer
        this._filtreSens = this._filtreSens === sens ? null : sens;
        this._setFiltreSensUI(this._filtreSens);
        this.render();
    }

    _setFiltreTxUI(actif) {
        // Bouton Trading
        const btnT = document.getElementById('btn-filter-trading');
        if (btnT) {
            const on = actif === 'trading';
            btnT.style.background  = on ? '#0d1b2f' : 'var(--bg2)';
            btnT.style.borderColor = on ? '#58a6ff' : 'var(--border)';
            btnT.style.color       = on ? '#58a6ff' : 'var(--text3)';
            btnT.textContent       = on ? '📊 Trading ✓' : '📊 Trading';
        }
        // Bouton Investissement
        const btnI = document.getElementById('btn-filter-invest');
        if (btnI) {
            const on = actif === 'investissement';
            btnI.style.background  = on ? '#1a2a3a' : 'var(--bg2)';
            btnI.style.borderColor = on ? '#4493f8' : 'var(--border)';
            btnI.style.color       = on ? '#4493f8' : 'var(--text3)';
            btnI.textContent       = on ? '💼 Investissement ✓' : '💼 Investissement';
        }
        // Afficher / masquer la barre de sous-filtres
        const bar = document.getElementById('tx-subfilter-bar');
        if (bar) bar.style.display = actif ? 'flex' : 'none';
    }

    _setFiltreSensUI(actif) {
        const styles = {
            tous: {
                on:  { bg: 'var(--accent)22', border: 'var(--accent)', color: 'var(--accent)' },
                off: { bg: 'var(--bg2)',       border: 'var(--border)', color: 'var(--text3)' },
            },
            positif: {
                on:  { bg: '#0f2a1e', border: '#3fb950', color: '#3fb950' },
                off: { bg: 'var(--bg2)', border: 'var(--border)', color: 'var(--text3)' },
            },
            negatif: {
                on:  { bg: '#2a0f0f', border: '#f85149', color: '#f85149' },
                off: { bg: 'var(--bg2)', border: 'var(--border)', color: 'var(--text3)' },
            },
        };
        const apply = (id, s) => {
            const b = document.getElementById(id);
            if (!b) return;
            b.style.background  = s.bg;
            b.style.borderColor = s.border;
            b.style.color       = s.color;
        };
        // "Tous" est actif quand _filtreSens est null
        apply('btn-subfilter-tous',     actif === null    ? styles.tous.on     : styles.tous.off);
        apply('btn-subfilter-positif',  actif === 'positif' ? styles.positif.on : styles.positif.off);
        apply('btn-subfilter-negatif',  actif === 'negatif' ? styles.negatif.on : styles.negatif.off);
        // Mettre à jour le texte du bouton Tous
        const btnTous = document.getElementById('btn-subfilter-tous');
        if (btnTous) btnTous.textContent = actif === null ? 'Tous ✓' : 'Tous';
        // Vider le compteur si on revient à "Tous"
        if (actif === null) {
            const cntEl = document.getElementById('subfilter-count');
            if (cntEl) cntEl.textContent = '';
        }
    }

    // MÉTHODES POUR L'AFFICHAGE DES SOCIÉTÉS COTÉES
    async getToutesSocietes() {
    await this.priceService.getAllPrices();
    
    const societes = [];
    
    // Parcourir toutes les sociétés de la liste
    SOCIETES.forEach(s => {
        // Vérifier si cette société existe dans les données BMCE
        const data = this.priceService.getData(s.symbole);
        
        // Utiliser les données BMCE si disponibles, sinon FALLBACK_PRICES
        const fallback = (typeof FALLBACK_PRICES !== 'undefined' && FALLBACK_PRICES[s.symbole]) || null;
        const prix     = (data && data.price > 0) ? data.price : fallback;
        if (prix) {
            societes.push({
                symbole:   s.symbole,
                nom:       s.nom,
                secteur:   this.getSecteurParSymbole(s.symbole),
                prix:      prix,
                variation: (data && data.price > 0) ? data.variation : null,
                source:    (data && data.price > 0) ? (data.source || 'yahoo') : 'fallback',
                dateMaj:   (data && data.price > 0) ? new Date().toLocaleString('fr-FR', {
                    day: '2-digit', month: '2-digit', year: 'numeric',
                    hour: '2-digit', minute: '2-digit'
                }) : '—'
            });
        } else {
            console.log(`ℹ️ Société ignorée (pas de prix disponible): ${s.nom} (${s.symbole})`);
        }
    });
    
    societes.sort((a, b) => a.nom.localeCompare(b.nom));
    return societes;
}

    getSecteurParSymbole(symbole) {
        const secteurs = {
            'ATW': 'Banques', 'BCP': 'Banques', 'BOA': 'Banques', 'CIH': 'Banques',
            'CDM': 'Banques', 'CFG': 'Banques', 'BCI': 'Banques',
            'IAM': 'Télécom',
            'WAA': 'Assurances', 'SAH': 'Assurances', 'ATL': 'Assurances', 'AGM': 'Assurances',
            'MNG': 'Mines', 'SMI': 'Mines', 'CMT': 'Mines', 'ZEL': 'Mines',
            'LHM': 'Matériaux', 'CMA': 'Matériaux',
            'ADH': 'Immobilier', 'ADI': 'Immobilier', 'ARD': 'Immobilier', 'RDS': 'Immobilier',
            'IMO': 'Immobilier', 'CRS': 'Immobilier',
            'TQM': 'Énergie', 'GAZ': 'Énergie', 'TMA': 'Énergie',
            'CSR': 'Agroalimentaire', 'LES': 'Agroalimentaire', 'OUL': 'Agroalimentaire',
            'UMR': 'Agroalimentaire', 'DAR': 'Agroalimentaire',
            'SOT': 'Pharmacie', 'PRO': 'Pharmacie',
            'AKT': 'Santé',
            'LAB': 'Distribution', 'COL': 'Distribution',
            'MSA': 'Transport', 'CTM': 'Transport',
            'TGC': 'BTP', 'JET': 'BTP',
            'HPS': 'Technologie', 'M2M': 'Technologie', 'MIC': 'Technologie',
            'S2M': 'Technologie', 'DWY': 'Technologie', 'DYT': 'Technologie',
            'SNA': 'Industrie', 'MUT': 'Industrie', 'SID': 'Industrie',
            'ALM': 'Industrie', 'FBR': 'Industrie', 'SRM': 'Industrie',
            'STR': 'Industrie', 'SNP': 'Industrie', 'MDP': 'Industrie',
            'DHO': 'Industrie', 'CMG': 'Industrie',
            'RIS': 'Tourisme', 'BAL': 'Tourisme',
            'VCN': 'Services', 'EQD': 'Finance', 'SLF': 'Finance',
            'SAL': 'Finance', 'MAB': 'Finance', 'MLE': 'Finance',
            'AFM': 'Finance', 'SBM': 'Agroalimentaire',
            'SNE': 'Industrie', 'SOD': 'Transport',
            'REB': 'Services', 'CPL': 'Finance',
            'AUT': 'Automobile', 'NEJ': 'Automobile', 'NKL': 'Automobile',
            'GTM': 'Transport'
        };
        
        return secteurs[symbole] || 'Autre';
    }

    // ── Filtre recherche tableau marchés ──────────────────────────────────────
    filtrerMarches(query) {
        this._marchesFiltreQuery = query ? query.toLowerCase().trim() : '';
        this._renderMarchesTable(this._marchesLastSocietes || []);
    }

    async afficherSocietesCotees() {
        const tbody = document.getElementById('societes-cotees-body');
        if (!tbody) return;

        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 30px;"><div class="loader"></div> Chargement des sociétés...</td></tr>';

        try {
            let societes = await this.getToutesSocietes();
            // Lancer la validation Yahoo en arrière-plan (sans bloquer l'affichage)
            this._validatePricesYahoo(societes);

            // Tri du tableau marchés
            const col = this._marketSortCol || 'nom';
            const dir = this._marketSortDir || 'asc';
            societes = [...societes].sort((a, b) => {
                let va, vb;
                if (col === 'variation') { va = a.variation; vb = b.variation; }
                else if (col === 'cours') { va = a.prix; vb = b.prix; }
                else { va = a.nom.toLowerCase(); vb = b.nom.toLowerCase(); }
                if (va < vb) return dir === 'asc' ? -1 : 1;
                if (va > vb) return dir === 'asc' ? 1 : -1;
                return 0;
            });

            const mArrow = (c) => {
                if (this._marketSortCol !== c) return '<span style="opacity:0.3;font-size:0.8em">↕</span>';
                return this._marketSortDir === 'asc' ? ' ↑' : ' ↓';
            };
            const thS = 'cursor:pointer;user-select:none;';

            // Mettre à jour les en-têtes cliquables
            const thead = document.querySelector('#marches-table thead tr');
            if (thead) {
                thead.innerHTML = `
                    <th style="${thS}" onclick="portfolioManager.marketSortBy('nom')">Société / Ticker ${mArrow('nom')}</th>
                    <th style="${thS}" onclick="portfolioManager.marketSortBy('cours')">Cours (MAD) ${mArrow('cours')}</th>
                    <th style="${thS};white-space:nowrap;" onclick="portfolioManager.marketSortBy('variation')">
                        <span style="display:inline-flex;align-items:center;gap:5px;">
                            <span style="background:var(--accent);color:#fff;font-size:0.68em;font-weight:700;padding:2px 6px;border-radius:4px;letter-spacing:0.04em;">LIVE</span>
                            Var. aujourd'hui ${mArrow('variation')}
                        </span>
                    </th>
                    <th id="th-j1" style="font-size:0.85em;color:var(--text2);">Variation J-1</th>
                    <th id="th-j2" style="font-size:0.85em;color:var(--text2);">Variation J-2</th>
                    <th style="text-align:center;color:#e3b341;font-size:0.82em;white-space:nowrap;cursor:default;">🔔 Alerte bas</th>
                `;
            }

            // Sauvegarder pour filtrage
            this._marchesLastSocietes = societes;
            this._renderMarchesTable(societes);

            // Badge et compteur
            const n = societes.length;
            const badgeCount = document.getElementById('badge-count');
            if (badgeCount) badgeCount.textContent = n + ' sociétés';
            const countLabel = document.getElementById('count-label');
            if (countLabel) countLabel.textContent = n + ' sociétés';

            // Top 5 Hausses / Baisses : géré exclusivement par loadTopMovers() (casablancabourse.com API)
            // this._renderTopMovers(societes);  // supprimé — écrasait le top 5 marché complet

            // Vérifier les alertes de cours après affichage
            this.checkMarchesAlertes();

        } catch (error) {
            console.error('Erreur affichage sociétés:', error);
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 30px; color: #dc3545;">Erreur de chargement des sociétés</td></tr>';
        }
    }

    // ── Chargement J-1 / J-2 en arrière-plan ─────────────────────────────────
    async _loadJ1J2(societes) {
        this._j1j2DatesSet = false;   // reset à chaque rechargement
        const BATCH = 8;
        for (let i = 0; i < societes.length; i += BATCH) {
            const batch = societes.slice(i, i + BATCH);
            await Promise.all(batch.map(s => this._fetchJ1J2(s.symbole)));
        }
    }

    async _fetchJ1J2(symbole) {
        try {
            // ── 1. Réutiliser le cache analyseManager si disponible ──────────
            let histo = null;
            if (typeof analyseManager !== 'undefined' &&
                analyseManager._cache?.[symbole]?.variation?.historique?.length) {
                histo = analyseManager._cache[symbole].variation.historique;
            }

            // ── 2. Sinon, charger depuis le proxy et stocker en cache ────────
            if (!histo) {
                const codes = (typeof CODES_BMCE_BY_SYMBOLE !== 'undefined') ? CODES_BMCE_BY_SYMBOLE : {};
                const code  = codes[symbole];
                if (!code) return;
                const r = await fetch(`api/bmce-detail-proxy.php?code=${code}&tab=historique&_=${Date.now()}`);
                const d = await r.json();
                if (!d.success || !d.historique?.length) return;
                histo = d.historique;
                // Mettre en cache pour l'onglet Analyse des sociétés
                if (typeof analyseManager !== 'undefined') {
                    if (!analyseManager._cache[symbole])
                        analyseManager._cache[symbole] = { carnet: null, variation: null, ts: null };
                    if (!analyseManager._cache[symbole].variation)
                        analyseManager._cache[symbole].variation = { success: true, historique: histo };
                }
            }

            if (!histo?.length) return;

            // ── 3. Récupération par index (histo trié décroissant : [0]=dernière séance clôturée)
            // La colonne "Var. Aujourd'hui" (LIVE) couvre déjà la séance en cours.
            // histo[0] = J-1 (dernière séance clôturée, colonne th-j1)
            // histo[1] = J-2 (colonne th-j2)
            const entry1 = histo[0] || null;
            const entry2 = histo[1] || null;

            // ── Mise à jour dynamique des 2 en-têtes (une seule fois) ─────────
            if (!this._j1j2DatesSet && histo.length >= 2) {
                this._j1j2DatesSet = true;
                const fmtDate = (raw) => raw ? raw.replace(/\./g, '/') : raw;
                const thJ1 = document.getElementById('th-j1');
                const thJ2 = document.getElementById('th-j2');
                if (thJ1 && histo[0]?.date) thJ1.textContent = 'Variation ' + fmtDate(histo[0].date);
                if (thJ2 && histo[1]?.date) thJ2.textContent = 'Variation ' + fmtDate(histo[1].date);
            }

            // ── 4. Afficher les variations dans les cellules ─────────────────
            const fmt = (v) => {
                if (v == null || v === '' || isNaN(parseFloat(v))) return '—';
                const n    = parseFloat(v);
                const cls  = n >= 0 ? 'up' : 'down';
                const sign = n >= 0 ? '+' : '';
                return `<span class="mono ${cls}">${sign}${n.toFixed(2)}%</span>`;
            };
            const el1 = document.getElementById('j1-' + symbole);
            const el2 = document.getElementById('j2-' + symbole);
            if (el1) el1.innerHTML = fmt(entry1?.variation ?? null);
            if (el2) el2.innerHTML = fmt(entry2?.variation ?? null);
        } catch(e) { /* silencieux */ }
    }

    // ── Rendu tableau marchés avec filtre ─────────────────────────────────────
    _renderMarchesTable(societes) {
        const tbody = document.getElementById('societes-cotees-body');
        if (!tbody) return;

        // Appliquer filtre recherche
        const q = (this._marchesFiltreQuery || '').toLowerCase().trim();
        const filtered = q
            ? societes.filter(s => s.nom.toLowerCase().includes(q) || s.symbole.toLowerCase().includes(q))
            : societes;

        if (filtered.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:30px;color:var(--text3);">
                Aucune société trouvée pour "<strong>${q}</strong>"</td></tr>`;
            return;
        }

        const alertes = this._loadMarchesAlertes();

        let html = '';
        filtered.forEach(s => {
            const hasVar = s.variation !== null && s.variation !== undefined;
            const v = hasVar ? parseFloat(s.variation) : null;
            const isUp   = v !== null && v > 0;
            const isFlat = v === null || v === 0;
            const arrow  = v === null ? '—' : (isFlat ? '▬' : (isUp ? '▲' : '▼'));
            const bgColor  = v === null ? 'rgba(150,150,150,0.08)' : (isFlat ? 'rgba(150,150,150,0.15)' : (isUp ? 'rgba(46,160,67,0.15)' : 'rgba(248,81,73,0.15)'));
            const txtColor = v === null ? 'var(--text3)' : (isFlat ? 'var(--text2)' : (isUp ? 'var(--green)' : 'var(--red)'));
            const sign     = (v !== null && isUp) ? '+' : '';
            const varLabel = v === null ? '—' : `${sign}${v.toFixed(2)}%`;

            // Cellule alerte
            const seuil     = alertes[s.symbole] || '';
            const seuilNum  = parseFloat(seuil);
            const alerteActive = seuil !== '' && !isNaN(seuilNum) && seuilNum > 0;
            // Déclenchée si cours actuel ≤ seuil
            const alerteDecl = alerteActive && s.prix > 0 && s.prix <= seuilNum;
            const borderClr  = alerteDecl ? '#f85149' : (alerteActive ? '#e3b341' : 'var(--border)');
            const inputClr   = alerteDecl ? '#f85149' : (alerteActive ? '#e3b341' : 'var(--text3)');
            const delBtn     = alerteActive
                ? `<button onclick="event.stopPropagation();portfolioManager.saveMarcheAlerteSeuil('${s.symbole}','',this)"
                       title="Supprimer alerte" style="background:none;border:none;color:#8b949e;cursor:pointer;
                       font-size:1em;padding:0 2px;line-height:1;" onmouseover="this.style.color='#f85149'"
                       onmouseout="this.style.color='#8b949e'">×</button>`
                : '';

            html += `
                <tr data-symbole="${s.symbole}" data-prix="${s.prix}" style="cursor:context-menu;">
                    <td><strong style="font-size:0.9em;">${s.nom}</strong> <span class="mono" style="font-size:0.75em;color:var(--text2);">${s.symbole}</span></td>
                    <td class="mono" style="text-align:center;font-size:0.88em;">${s.prix.toFixed(2)}</td>
                    <td style="text-align:center;">
                        <span class="mono" style="display:inline-flex;align-items:center;gap:3px;background:${bgColor};color:${txtColor};font-weight:600;padding:2px 7px;border-radius:20px;font-size:0.85em;">
                            ${arrow} ${varLabel}
                        </span>
                    </td>
                    <td id="j1-${s.symbole}" class="mono" style="text-align:center;color:var(--text3);font-size:0.82em;">…</td>
                    <td id="j2-${s.symbole}" class="mono" style="text-align:center;color:var(--text3);font-size:0.82em;">…</td>
                    <td style="text-align:center;white-space:nowrap;">
                        <div style="display:inline-flex;align-items:center;gap:2px;">
                            <input type="number" min="0" step="0.01" value="${seuil}"
                                placeholder="seuil…"
                                title="Entrez le cours minimum — alerte email si le cours descend en dessous"
                                style="width:68px;padding:2px 5px;background:var(--bg);
                                       border:1px solid ${borderClr};border-radius:4px;
                                       color:${inputClr};font-size:0.78em;
                                       font-family:'JetBrains Mono',monospace;
                                       text-align:right;outline:none;"
                                onclick="event.stopPropagation();"
                                onkeydown="event.stopPropagation();if(event.key==='Enter'){event.preventDefault();portfolioManager.saveMarcheAlerteSeuil('${s.symbole}',this.value,this);this.blur();}"
                                onblur="portfolioManager.saveMarcheAlerteSeuil('${s.symbole}',this.value,this);"/>
                            <span style="font-size:0.7em;color:var(--text3);">MAD</span>
                            ${delBtn}
                        </div>
                    </td>
                </tr>`;
        });
        tbody.innerHTML = html;
        if (typeof attacherContextMenuMarches === 'function') { _ctxMarchesAttached = false; attacherContextMenuMarches(); }

        const now = new Date().toLocaleString('fr-FR', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' });
        const updateEl = document.getElementById('marches-last-update');
        if (updateEl && !q) updateEl.textContent = '🕒 Mis à jour : ' + now;

        // Charger J-1 et J-2 en arrière-plan (seulement si pas de filtre actif)
        if (!q) this._loadJ1J2(filtered);
    }

    // ── Alertes marchés : seuil bas par société ────────────────────────────────
    _loadMarchesAlertes() {
        try { return JSON.parse(localStorage.getItem('marches_alertes_seuil') || '{}'); } catch { return {}; }
    }
    _saveMarchesAlertes(obj) {
        localStorage.setItem('marches_alertes_seuil', JSON.stringify(obj));
    }

    saveMarcheAlerteSeuil(symbole, val, inputEl) {
        const alertes = this._loadMarchesAlertes();
        const v = parseFloat(val);
        if (val === '' || isNaN(v) || v <= 0) {
            // Supprimer l'alerte
            delete alertes[symbole];
            this._saveMarchesAlertes(alertes);
            if (inputEl) {
                const el = inputEl.tagName === 'INPUT' ? inputEl : inputEl.closest('td')?.querySelector('input');
                if (el) { el.style.borderColor = 'var(--border)'; el.style.color = 'var(--text3)'; el.value = ''; }
                // Supprimer le bouton ×
                const btn = inputEl.closest?.('div')?.querySelector('button');
                if (btn) btn.remove();
            }
            this.showNotification(`🔕 Alerte supprimée pour ${symbole}`, 'info');
            return;
        }
        alertes[symbole] = v;
        this._saveMarchesAlertes(alertes);

        // Feedback visuel immédiat sur l'input
        const el = inputEl && inputEl.tagName === 'INPUT' ? inputEl : inputEl?.closest?.('td')?.querySelector('input');
        if (el) {
            const prix = parseFloat(this._marchesLastSocietes?.find(s => s.symbole === symbole)?.prix || 0);
            const declenche = prix > 0 && prix <= v;
            const clr = declenche ? '#f85149' : '#e3b341';
            el.style.borderColor = clr;
            el.style.color       = clr;
            // Ajouter bouton × si pas déjà présent
            const parent = el.parentElement;
            if (parent && !parent.querySelector('button')) {
                const btn = document.createElement('button');
                btn.textContent = '×';
                btn.title = 'Supprimer alerte';
                btn.style.cssText = 'background:none;border:none;color:#8b949e;cursor:pointer;font-size:1em;padding:0 2px;line-height:1;';
                btn.onmouseover = () => btn.style.color = '#f85149';
                btn.onmouseout  = () => btn.style.color = '#8b949e';
                btn.onclick = (e) => { e.stopPropagation(); this.saveMarcheAlerteSeuil(symbole, '', el); };
                parent.insertBefore(btn, parent.querySelector('span'));
            }
        }

        this.showNotification(`🔔 Alerte fixée à ${fmtMAD(v)} MAD pour ${symbole}`, 'success');
        // Vérification immédiate
        this.checkMarchesAlertes();
    }

    async checkMarchesAlertes() {
        const alertes = this._loadMarchesAlertes();
        if (Object.keys(alertes).length === 0) return;

        const today  = new Date().toISOString().slice(0, 10);
        const stKey  = 'marches_alertes_sent_' + today;
        let sent = {};
        try { sent = JSON.parse(localStorage.getItem(stKey) || '{}'); } catch(e) {}

        const societes = this._marchesLastSocietes || [];

        for (const [symbole, seuil] of Object.entries(alertes)) {
            if (sent[symbole]) continue; // déjà alerté aujourd'hui
            const soc = societes.find(s => s.symbole === symbole);
            if (!soc || soc.prix <= 0) continue;

            if (soc.prix <= seuil) {
                const nom = soc.nom || symbole;
                console.log(`🔔 Alerte marché ${symbole} : cours ${soc.prix} ≤ seuil ${seuil}`);
                const ok = await this._envoyerEmailMarcheAlerte(symbole, nom, soc.prix, seuil);
                if (ok) {
                    sent[symbole] = true;
                    localStorage.setItem(stKey, JSON.stringify(sent));
                }
                this.showNotification(
                    `🔔 ${nom} (${symbole}) — Cours ${fmtMAD(soc.prix)} MAD ≤ seuil ${fmtMAD(seuil)} MAD · ${ok ? 'Email ✅' : 'Échec ⚠️'}`,
                    'warning'
                );
            }
        }
    }

    async _envoyerEmailMarcheAlerte(symbole, nom, prix, seuil) {
        const now      = new Date().toLocaleString('fr-FR', {day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'});
        const ecart    = prix > 0 ? ((prix - seuil) / seuil * 100).toFixed(2) : '—';
        const ecartClr = '#f85149';

        const html = `
        <div style="font-family:Arial,sans-serif;max-width:520px;background:#0d1117;color:#e6edf3;padding:24px;border-radius:10px;">
            <div style="border-left:4px solid #e3b341;padding-left:16px;margin-bottom:20px;">
                <div style="font-size:0.75em;color:#8b949e;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:4px;">🔔 Alerte Marchés · ${now}</div>
                <div style="font-size:1.3em;font-weight:700;color:#e3b341;">SEUIL BAS ATTEINT</div>
            </div>
            <table style="width:100%;border-collapse:collapse;font-size:0.9em;">
                <tr><td style="padding:6px 0;color:#8b949e;">Société</td>
                    <td style="text-align:right;font-weight:700;">${nom}</td></tr>
                <tr><td style="padding:6px 0;color:#8b949e;">Ticker</td>
                    <td style="text-align:right;font-family:monospace;color:#8b949e;">${symbole}</td></tr>
                <tr><td style="padding:6px 0;color:#8b949e;">Cours actuel</td>
                    <td style="text-align:right;font-family:monospace;font-weight:700;color:${ecartClr};">${fmtMAD(prix)} MAD</td></tr>
                <tr><td style="padding:6px 0;color:#8b949e;">Seuil d'alerte</td>
                    <td style="text-align:right;font-family:monospace;">${fmtMAD(seuil)} MAD</td></tr>
                <tr style="border-top:1px solid #30363d;">
                    <td style="padding:10px 0;color:#8b949e;">Écart / seuil</td>
                    <td style="text-align:right;font-family:monospace;font-weight:700;color:${ecartClr};">${ecart}%</td></tr>
            </table>
            <div style="margin-top:16px;font-size:0.78em;color:#8b949e;border-top:1px solid #30363d;padding-top:12px;">
                Bourse de Casablanca · Alerte automatique quotidienne
            </div>
        </div>`;

        const ok = await this._envoyerEmail(
            `🔔 [BVC] Alerte cours bas — ${nom} (${symbole}) : ${fmtMAD(prix)} MAD ≤ seuil ${fmtMAD(seuil)} MAD`,
            html
        );
        return ok === true;
    }

    // ── Validation automatique des prix via Yahoo Finance (côté browser) ───────
    async _validatePricesYahoo(societes) {
        const badge = document.getElementById('yahoo-validation-badge');
        // Valider les prix avec variation != 0 (les plus susceptibles d'être erronés)
        const aVerifier = societes
            .filter(s => s.variation !== null && s.variation !== 0)
            .sort((a, b) => Math.abs(b.variation) - Math.abs(a.variation))
            .slice(0, 20); // vérifier les 20 plus grands mouvements

        if (aVerifier.length === 0) return;
        if (badge) badge.style.display = 'inline';

        const corrections = {};
        await Promise.allSettled(aVerifier.map(async s => {
            try {
                const url = `https://query1.finance.yahoo.com/v8/finance/chart/${s.symbole}.CS?interval=1d&range=2d&includePrePost=false`;
                const r = await fetch(url, {
                    headers: { 'Accept': 'application/json', 'Accept-Language': 'en-US,en;q=0.5' },
                    signal: AbortSignal.timeout(8000)
                });
                if (!r.ok) return;
                const d = await r.json();
                const meta = d?.chart?.result?.[0]?.meta;
                if (!meta) return;
                const yPrice = meta.regularMarketPrice;
                if (!yPrice || yPrice <= 0) return;

                // Variation Yahoo : utiliser regularMarketChangePercent
                const cp = meta.regularMarketChangePercent;
                const yVar = cp != null ? (Math.abs(cp) <= 2 ? +(cp * 100).toFixed(2) : +cp.toFixed(2)) : null;

                // Écart de prix > 2% → correction nécessaire
                const ecart = Math.abs(yPrice - s.prix) / s.prix * 100;
                if (ecart > 2) {
                    corrections[s.symbole] = { price: +yPrice.toFixed(2), variation: yVar, source: 'yahoo_browser' };
                    console.log(`🔧 Correction ${s.symbole}: BMCE=${s.prix} Yahoo=${yPrice.toFixed(2)} (écart ${ecart.toFixed(1)}%)`);
                }
            } catch(e) { /* silencieux */ }
        }));

        if (badge) badge.style.display = 'none';

        if (Object.keys(corrections).length === 0) {
            console.log('✅ Yahoo valide : tous les cours BMCE sont corrects');
            return;
        }

        console.log(`⚠️ ${Object.keys(corrections).length} correction(s) Yahoo appliquée(s)`);
        // Appliquer les corrections dans prixBMCE
        for (const [sym, corr] of Object.entries(corrections)) {
            if (this.priceService.prixBMCE[sym]) {
                this.priceService.prixBMCE[sym].price  = corr.price;
                // Garder la variation BMCE officielle — Yahoo peut avoir un décalage de date
                // On écrase la variation Yahoo uniquement si BMCE n'en a pas fourni
                if (this.priceService.prixBMCE[sym].variation == null ||
                    this.priceService.prixBMCE[sym].variation === 0) {
                    this.priceService.prixBMCE[sym].variation = corr.variation;
                }
                this.priceService.prixBMCE[sym].source = corr.source;
            }
        }
        // Re-render le tableau et top5 avec les prix corrigés
        const societesMaj = await this.getToutesSocietes();
        this._marchesLastSocietes = societesMaj;
        this._renderMarchesTable(societesMaj);
        // this._renderTopMovers(societesMaj);  // supprimé — géré par loadTopMovers() (casablancabourse.com)
    }

    marketSortBy(col) {
        if (this._marketSortCol === col) {
            this._marketSortDir = this._marketSortDir === 'asc' ? 'desc' : 'asc';
        } else {
            this._marketSortCol = col;
            this._marketSortDir = col === 'variation' ? 'desc' : 'asc';
        }
        this.afficherSocietesCotees();
    }

    _renderTopMovers(societes) {
        const haussesEl = document.getElementById('top-hausses');
        const baissesEl = document.getElementById('top-baisses');
        if (!haussesEl || !baissesEl) return;

        // Filtrer : variation non nulle, non null (pas de plafond — BVC n'a pas de limite fixe)
        const avecVar = societes.filter(s =>
            s.variation !== null &&
            s.variation !== undefined &&
            s.variation !== 0
        );
        const hausses = [...avecVar].sort((a, b) => b.variation - a.variation).slice(0, 5);
        const baisses = [...avecVar].sort((a, b) => a.variation - b.variation).slice(0, 5);

        const renderList = (items, cls) => {
            if (items.length === 0) return '<span style="color:var(--text3);font-size:0.85em;">Aucune</span>';
            return items.map(s => {
                const sign    = s.variation > 0 ? '+' : '';
                const fullNom = s.nom || s.symbole;
                const display = fullNom.length > 16 ? s.symbole : fullNom;
                return `<div style="display:grid;grid-template-columns:minmax(0,1fr) auto auto;gap:0 10px;
                             align-items:center;padding:5px 0;border-bottom:1px solid var(--border);cursor:context-menu;"
                             data-symbole="${s.symbole}" data-prix="${s.prix}" title="${fullNom}">
                    <div style="min-width:0;overflow:hidden;">
                        <span style="font-size:0.88em;font-weight:600;display:block;
                              white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${display}</span>
                        ${display !== fullNom ? '' : `<span class="mono" style="font-size:0.72em;color:var(--text3);">${s.symbole}</span>`}
                    </div>
                    <span class="mono" style="font-size:0.85em;text-align:right;white-space:nowrap;">
                        ${s.prix.toFixed(2)}
                    </span>
                    <span class="mono ${cls}" style="font-size:0.85em;font-weight:700;text-align:right;
                          white-space:nowrap;min-width:56px;">
                        ${sign}${s.variation.toFixed(2)}%
                    </span>
                </div>`;
            }).join('');
        };

        haussesEl.innerHTML = renderList(hausses, 'up');
        baissesEl.innerHTML = renderList(baisses, 'down');
    }

    ajouterDepuisSociete(symbole, prix) {
        // Délègue à la fonction globale qui gère aussi le changement d'onglet
        if (typeof ouvrirFormulaireAjout === 'function') {
            ouvrirFormulaireAjout(symbole, prix);
        }
    }

    async refreshSocietesCotees() {
        const tbody = document.getElementById('societes-cotees-body');
        if (!tbody) return;
        
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 30px;"><div class="loader"></div> Mise à jour des cours...</td></tr>';
        
        await this.priceService.getAllPrices();
        await this.afficherSocietesCotees();
        if (typeof loadMASI === 'function') loadMASI();

        // Synchronisation automatique du portefeuille
        if (this.stocks.length > 0) {
            let count = 0;
            this.stocks.forEach(stock => {
                const data = this.priceService.getData(stock.symbole);
                if (data && data.price > 0) {
                    stock.prixActuel = data.price;
                    stock.lastUpdate = new Date().toISOString();
                    stock.alertSent = false;
                    count++;
                }
            });
            if (count > 0) {
                this.save();
                this.render();
                this.showNotification(`✅ Cours mis à jour · ${count} position(s) du portefeuille synchronisées`, 'success');
                this.checkAlertesSuivi();
                this.checkAlertesPerso();
                return;
            }
        }
        
        this.showNotification('✅ Cours des sociétés mis à jour', 'success');
    }

    // MÉTHODES D'IMPORT/EXPORT
    importerCSV() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.csv';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            this.showNotification(`🔄 Lecture de ${file.name}...`, 'info');
            
            const reader = new FileReader();
            reader.onload = (e) => {
                const contenu = e.target.result;
                const count = this.traiterCSVStructureExacte(contenu);
                
                if (count > 0) {
                    this.save();
                    this.render();
                    this.showNotification(`✅ ${count} transaction(s) importée(s) avec succès!`, 'success');
                } else {
                    this.showNotification('⚠️ Aucune transaction trouvée dans le fichier', 'warning');
                }
            };
            reader.readAsText(file, 'UTF-8');
        };
        
        input.click();
    }

    traiterCSVStructureExacte(contenu) {
        // Supprimer le BOM UTF-8 s'il est présent
        contenu = contenu.replace(/^\uFEFF/, '');

        const lignes = contenu.split('\n');
        let count = 0;

        console.log('📄 Import CSV -', lignes.length, 'lignes');

        lignes.forEach((ligne, index) => {
            ligne = ligne.trim();
            if (!ligne) return;

            // Ignorer l'en-tête (ligne 0 ou contenant 'Date')
            if (index === 0 && ligne.toLowerCase().includes('date')) return;

            // Ignorer les lignes de résumé ou totaux
            if (ligne.toUpperCase().startsWith('RÉSUMÉ') ||
                ligne.toUpperCase().startsWith('RESUME') ||
                ligne.toUpperCase().startsWith('TOTAL')) return;

            // Détecter le séparateur
            const colonnes = ligne.includes(';')
                ? ligne.split(';').map(c => c.trim())
                : ligne.split(',').map(c => c.trim());

            // Accepter 10 ou 11 colonnes (avec ou sans "Dernière mise à jour")
            if (colonnes.length < 10) return;

            const dateAjout  = colonnes[0];
            const societe    = colonnes[1];
            const ticker     = PortfolioManager.migrateTickeur(colonnes[2].toUpperCase());

            // Normaliser les décimales (virgule → point)
            const toFloat = v => parseFloat(v.replace(',', '.').replace(/\s/g, ''));

            const quantite   = toFloat(colonnes[3]);
            const prixAchat  = toFloat(colonnes[4]);
            const coursActuel = toFloat(colonnes[7]);

            // Valider les données essentielles
            if (!ticker || !dateAjout) return;
            if (isNaN(quantite) || quantite <= 0) return;
            if (isNaN(prixAchat) || prixAchat <= 0) return;

            // Éviter les doublons exacts
            const existe = this.stocks.some(s =>
                s.symbole === ticker &&
                s.quantite === quantite &&
                Math.abs(s.prixAchat - prixAchat) < 0.1 &&
                s.dateAjout === dateAjout
            );

            if (!existe) {
                const nom = COMPANY_NAMES[ticker] || societe || ticker;
                const stock = new Stock(
                    Date.now().toString() + Math.random(),
                    ticker,
                    nom,
                    quantite,
                    prixAchat,
                    isNaN(coursActuel) ? 0 : coursActuel,
                    0,
                    dateAjout
                );
                this.stocks.push(stock);
                count++;
                console.log(`✅ Importé: ${ticker} - ${nom} (${quantite} × ${prixAchat})`);
            } else {
                console.log(`⏭️ Doublon ignoré: ${ticker} (${dateAjout})`);
            }
        });

        return count;
    }

    telechargerModeleCSV() {
        const contenu = 'Date d\'ajout,Société,Ticker,Qté,Prix d\'achat HT,Prix d\'achat TTC,Prix d\'achat global TTC,Cours HT actuel,Profit,Variation %,Date de cours\n' +
                       '16/11/2025 20:48,akdital,AKT,3,1535.00,1550.20,4650.59,1080.00,-1442.67,-31.02%,11/03/2026 19:03\n' +
                       '16/11/2025 20:52,akdital,AKT,3,1533.00,1548.18,4644.53,1080.00,-1436.61,-30.93%,11/03/2026 19:03';
        
        const blob = new Blob(['\uFEFF' + contenu], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'modele_portefeuille_complet.csv';
        a.click();
        this.showNotification('📋 Modèle CSV téléchargé', 'info');
    }

    exporterPortefeuille() {
        if (this.stocks.length === 0) {
            this.showNotification('ℹ️ Aucune donnée à exporter', 'info');
            return;
        }
        const csv = this.genererCSVPortefeuille();
        const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `portefeuille_${new Date().toISOString().slice(0,10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        this.showNotification(`✅ ${this.stocks.length} transactions exportées en CSV`, 'success');
    }

    // MÉTHODES DE SAUVEGARDE
    sauvegarderSiteComplet() {
        const now = new Date();
        const dateStr = now.toLocaleDateString('fr-FR').replace(/\//g, '-');
        const timeStr = now.toLocaleTimeString('fr-FR').replace(/:/g, '-');
        const dossierName = `sauvegarde_${dateStr}_${timeStr}`;

        // ── Détecter si on est en file:// (MAMP non démarré) ─────────────────
        const isFile = window.location.protocol === 'file:';
        if (isFile) {
            const msg = [
                '⚠️ Sauvegarde partielle : vous avez ouvert le site en file://',
                '',
                'Pour sauvegarder TOUS les fichiers (script.js, config.js, etc.),',
                'ouvrez le site via MAMP avec cette URL :',
                '',
                'http://localhost/bourse de casablanca/Claude/index.html',
                '',
                '(ou http://localhost:8888/... si MAMP utilise le port 8888)',
                '',
                'Pour l\instant, seuls index.html et le portefeuille seront sauvegardés.'
            ].join('\n');
            alert(msg);
            // Sauvegarde partielle : uniquement les fichiers en mémoire
            const fichiersDirect = [
                { nom: 'index.html',              contenu: document.documentElement.outerHTML },
                { nom: 'portefeuille_export.csv',  contenu: this.genererCSVPortefeuille() },
                { nom: 'portefeuille_export.json', contenu: this.genererJSONPortefeuille() }
            ];
            this.showNotification('📦 Sauvegarde partielle (3 fichiers)', 'warning');
            this.compresserEtTelecharger(fichiersDirect, dossierName);
            return;
        }

        this.showNotification('📦 Création de la sauvegarde complète…', 'info');

        // ── URL de base absolue (http://localhost/...) ────────────────────────
        const baseUrl = window.location.href.replace(/\/[^\/]*$/, '/');
        console.log('📁 Base URL:', baseUrl);

        // Fetch avec URL absolue + XMLHttpRequest synchrone en fallback
        const fetchFichier = (filename) => {
            const url = baseUrl + filename + '?_=' + Date.now();
            return fetch(url)
                .then(r => {
                    if (!r.ok) throw new Error('HTTP ' + r.status);
                    return r.text();
                })
                .then(t => {
                    const ext = filename.split('.').pop();
                    if (['js','php','css'].includes(ext) && t.trim().startsWith('<!')) {
                        throw new Error('Réponse HTML inattendue');
                    }
                    return { nom: filename, contenu: t };
                })
                .catch(err => {
                    // Fallback XMLHttpRequest synchrone
                    try {
                        const xhr = new XMLHttpRequest();
                        xhr.open('GET', url, false); // synchrone
                        xhr.send();
                        if (xhr.status === 200 && !xhr.responseText.trim().startsWith('<!')) {
                            return { nom: filename, contenu: xhr.responseText };
                        }
                    } catch(e) {}
                    console.warn('⚠️ ' + filename + ' : ' + err.message);
                    return null;
                });
        };

        const fichiersDirect = [
            { nom: 'index.html',              contenu: document.documentElement.outerHTML },
            { nom: 'portefeuille_export.csv',  contenu: this.genererCSVPortefeuille() },
            { nom: 'portefeuille_export.json', contenu: this.genererJSONPortefeuille() }
        ];

        const fichiersAFetch = [
            'script.js',
            'config.js',
            'style.css',
            'api/bmce-proxy.php',
            'api/bmce-detail-proxy.php',
            'api/sante-proxy.php'
        ];

        Promise.all(fichiersAFetch.map(fetchFichier)).then(extras => {
            const trouves   = extras.filter(Boolean);
            const manquants = fichiersAFetch.filter((_, i) => !extras[i]);

            if (manquants.length > 0) {
                console.warn('⚠️ Fichiers non inclus:', manquants);
                this.showNotification('⚠️ Non trouvés: ' + manquants.join(', '), 'warning');
            }

            const tous = [...fichiersDirect, ...trouves];
            console.log('📦 Sauvegarde:', tous.map(f => f.nom).join(', '));
            this.showNotification('✅ ' + tous.length + ' fichiers sauvegardés', 'success');
            this.compresserEtTelecharger(tous, dossierName);
        });
    }

    genererCSVPortefeuille() {
        if (this.stocks.length === 0) {
            return "Aucune transaction dans le portefeuille";
        }
        
        let csv = 'Date;Société;Symbole;Quantité;Prix d\'achat HT;Prix d\'achat TTC;Prix d\'achat global TTC;Cours HT actuel;Profit/Perte;Variation %;Dernière mise à jour\n';
        
        this.stocks.forEach(s => {
            csv += `${s.dateAjout};${s.nom};${s.symbole};${s.quantite};${s.prixAchat.toFixed(2)};${s.getPrixUnitaireTTC().toFixed(2)};${s.getPrixTotalTTC().toFixed(2)};${s.prixActuel.toFixed(2)};${s.getProfitNet().toFixed(2)};${s.getPourcentage().toFixed(2)}%;${s.getFormattedDate()}\n`;
        });
        
        return csv;
    }

    genererJSONPortefeuille() {
        const exportData = {
            metadata: {
                date_export: new Date().toLocaleString('fr-FR'),
                nombre_transactions: this.stocks.length,
                commission: COMMISSION,
                taxe: TAXE_PLUS_VALUE
            },
            transactions: this.stocks.map(s => ({
                id:             s.id,           // ← ID préservé pour conserver les tags
                date:           s.dateAjout,
                societe:        s.nom,
                symbole:        s.symbole,
                quantite:       s.quantite,
                prix_achat_ht:  s.prixAchat,
                prix_achat_ttc: s.getPrixUnitaireTTC(),
                prix_total_ttc: s.getPrixTotalTTC(),
                cours_actuel:   s.prixActuel,
                profit_net:     s.getProfitNet(),
                variation:      s.getPourcentage(),
                derniere_maj:   s.getFormattedDate()
            })),
            tags:         this._loadTags(),     // ← Tags inclus dans la sauvegarde
            statistiques: this.getTotaux()
        };

        return JSON.stringify(exportData, null, 2);
    }

    compresserEtTelecharger(fichiers, dossierName) {
        if (typeof JSZip === 'undefined') {
            this.chargerJSZip().then(() => {
                this.creerArchiveZip(fichiers, dossierName);
            }).catch(() => {
                this.telechargerFichiersIndividuels(fichiers, dossierName);
            });
        } else {
            this.creerArchiveZip(fichiers, dossierName);
        }
    }

    chargerJSZip() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    async creerArchiveZip(fichiers, dossierName) {
        // ── Essayer d'abord le sélecteur de dossier natif (Chrome/Edge) ──
        if (window.showDirectoryPicker) {
            try {
                this.showNotification('📁 Choisissez le dossier de destination…', 'info');
                const dirHandle = await window.showDirectoryPicker({
                    mode: 'readwrite',
                    startIn: 'documents'
                });
                // Créer un sous-dossier de sauvegarde
                const subDir = await dirHandle.getDirectoryHandle(dossierName, { create: true });
                let nbEcrits = 0;
                for (const f of fichiers) {
                    try {
                        // Créer les sous-dossiers si nécessaire (ex: api/proxy.php)
                        const parts = f.nom.split('/');
                        let currentDir = subDir;
                        for (let i = 0; i < parts.length - 1; i++) {
                            currentDir = await currentDir.getDirectoryHandle(parts[i], { create: true });
                        }
                        const fileHandle = await currentDir.getFileHandle(parts[parts.length - 1], { create: true });
                        const writable = await fileHandle.createWritable();
                        await writable.write(f.contenu);
                        await writable.close();
                        nbEcrits++;
                    } catch(e) {
                        console.warn('⚠️ Fichier ignoré:', f.nom, e.message);
                    }
                }
                this.showNotification(`✅ ${nbEcrits} fichiers sauvegardés dans "${dossierName}"`, 'success');
                return;
            } catch(e) {
                if (e.name === 'AbortError') {
                    this.showNotification('⚠️ Sauvegarde annulée', 'warning');
                    return;
                }
                console.warn('showDirectoryPicker indisponible, fallback ZIP:', e.message);
            }
        }
        // ── Fallback : téléchargement ZIP ──
        const zip = new JSZip();
        fichiers.forEach(f => { zip.file(f.nom, f.contenu); });
        zip.generateAsync({ type: 'blob' }).then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${dossierName}.zip`;
            a.click();
            window.URL.revokeObjectURL(url);
            this.showNotification(`✅ Sauvegarde téléchargée : ${dossierName}.zip`, 'success');
        });
    }

    telechargerFichiersIndividuels(fichiers, dossierName) {
        this.showNotification('📦 Création des fichiers individuels...', 'info');
        
        fichiers.forEach((f, index) => {
            setTimeout(() => {
                const blob = new Blob([f.contenu], { type: 'text/plain;charset=utf-8' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${dossierName}_${f.nom}`;
                a.click();
                window.URL.revokeObjectURL(url);
            }, index * 500);
        });
        
        this.showNotification(`✅ ${fichiers.length} fichiers en cours de téléchargement`, 'success');
    }

    restaurerSauvegarde() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.zip';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            this.showNotification('📦 Restauration en cours...', 'info');
            
            if (typeof JSZip === 'undefined') {
                this.chargerJSZip().then(() => {
                    this.lireEtRestaurerZip(file);
                });
            } else {
                this.lireEtRestaurerZip(file);
            }
        };
        
        input.click();
    }

    lireEtRestaurerZip(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            JSZip.loadAsync(e.target.result).then(zip => {
                const fichiersZip = Object.keys(zip.files);
                this.showNotification(`📦 Archive lue : ${fichiersZip.length} fichier(s) trouvé(s)`, 'info');

                // Restaurer les transactions depuis le JSON si présent
                const jsonFile = zip.file('portefeuille_export.json');
                if (jsonFile) {
                    jsonFile.async('string').then(content => {
                        try {
                            const data = JSON.parse(content);
                            if (confirm(`Restaurer les ${data.transactions?.length || 0} transactions du portefeuille ?`)) {
                                this.restaurerTransactionsDepuisJSON(data);
                            }
                        } catch (err) {
                            console.error('Erreur lecture JSON:', err);
                        }
                    });
                }

                // Lister les fichiers sources trouvés dans l'archive
                const sourcesFichiersConnus = ['script.js', 'config.js', 'style.css', 'index.html', 'api/bmce-proxy.php', 'api/bmce-detail-proxy.php'];
                const sourcesPresents = sourcesFichiersConnus.filter(f => zip.file(f));
                if (sourcesPresents.length > 0) {
                    setTimeout(() => {
                        this.showNotification(`✅ Fichiers sources présents : ${sourcesPresents.join(', ')}`, 'success');
                    }, 500);
                    // Proposer le téléchargement individuel des sources
                    setTimeout(() => {
                        if (confirm(`📁 ${sourcesPresents.length} fichier(s) source(s) trouvé(s) dans l'archive :\n${sourcesPresents.join('\n')}\n\nVoulez-vous les télécharger individuellement pour les remplacer sur votre serveur ?`)) {
                            sourcesPresents.forEach((f, i) => {
                                zip.file(f).async('blob').then(blob => {
                                    setTimeout(() => {
                                        const url = URL.createObjectURL(blob);
                                        const a = document.createElement('a');
                                        a.href = url; a.download = f.split('/').pop(); a.click();
                                        URL.revokeObjectURL(url);
                                    }, i * 400);
                                });
                            });
                        }
                    }, 800);
                }
            }).catch(err => {
                this.showNotification('❌ Erreur lecture de l\'archive ZIP', 'loss');
                console.error(err);
            });
        };
        reader.readAsArrayBuffer(file);
    }

    restaurerTransactionsDepuisJSON(data) {
        if (data.transactions && Array.isArray(data.transactions)) {
            this.stocks = data.transactions.map(t => {
                const symbole = PortfolioManager.migrateTickeur(t.symbole);
                const nom = (typeof COMPANY_NAMES !== 'undefined' && COMPANY_NAMES[symbole]) || t.societe || symbole;
                // Préserver l'ID d'origine pour ne pas perdre les tags associés
                const id = t.id || (Date.now().toString() + Math.random());
                return new Stock(id, symbole, nom, t.quantite, t.prix_achat_ht, t.cours_actuel || 100, 0, t.date);
            });
            // Restaurer aussi les tags s'ils sont inclus dans la sauvegarde
            if (data.tags && typeof data.tags === 'object') {
                localStorage.setItem('portfolio_tags', JSON.stringify(data.tags));
            }
            this.save();
            this.render();
            this.showNotification(`✅ ${this.stocks.length} transactions restaurées`, 'success');
        }
    }

    ouvrirDossierSauvegarde() {
        try {
            const chemin = `C:\\Bourse\\Sauvegarde`;
            this.showNotification(`📁 Pour ouvrir le dossier : ${chemin}`, 'info');
        } catch (e) {
            this.showNotification('📁 Pour ouvrir le dossier : C:\\Bourse\\Sauvegarde', 'info');
        }
    }
}

// ============================================
// GESTIONNAIRE DES CRITÈRES D'INVESTISSEMENT
// ============================================
class CriteresManager {
    constructor() {
        this.criteres = [
            { id: 'per',        label: 'PER (cours/bénéfice)',     desc: 'Faible = moins cher' },
            { id: 'dividende',  label: 'Rendement dividende',       desc: '% dividende / cours' },
            { id: 'croissance', label: 'Croissance CA',             desc: 'Évolution du chiffre d\'affaires' },
            { id: 'dette',      label: 'Niveau d\'endettement',     desc: 'Faible dette = favorable' },
            { id: 'liquidite',  label: 'Liquidité du titre',        desc: 'Volume échangé quotidien' },
            { id: 'gouvernance',label: 'Gouvernance',               desc: 'Qualité du management' },
            { id: 'secteur',    label: 'Perspectives secteur',      desc: 'Attractivité du secteur' },
            { id: 'technique',  label: 'Analyse technique',         desc: 'Tendance graphique' },
        ];
        this.evaluations = JSON.parse(localStorage.getItem('criteres_evaluations') || '{}');
        this.societeActive = null;
        this.init();
    }

    init() {
        // Peupler le select des sociétés
        const sel = document.getElementById('criteres-societe');
        if (!sel) return;
        sel.innerHTML = '<option value="">Sélectionnez une société…</option>';
        const liste = (typeof SOCIETES !== 'undefined') ? [...SOCIETES].sort((a,b) => a.nom.localeCompare(b.nom)) : [];
        liste.forEach(s => {
            const o = document.createElement('option');
            o.value = s.symbole;
            o.textContent = `${s.symbole} — ${s.nom}`;
            sel.appendChild(o);
        });

        // Construire la grille de critères
        this.renderGrille();
        this.renderTableau();
    }

    renderGrille() {
        const grid = document.getElementById('criteres-grid');
        if (!grid) return;
        grid.innerHTML = this.criteres.map(c => `
            <div style="background:var(--bg);border:1px solid var(--border);border-radius:var(--radius);padding:14px;">
                <div style="font-size:0.82em;color:var(--text2);margin-bottom:4px;">${c.label}</div>
                <div style="font-size:0.75em;color:var(--text3);margin-bottom:8px;">${c.desc}</div>
                <div style="display:flex;align-items:center;gap:8px;">
                    <input type="range" id="crit-${c.id}" min="0" max="10" step="1" value="5"
                        style="flex:1;accent-color:var(--accent);"
                        oninput="criteresManager.updateScore('${c.id}', this.value)">
                    <span id="crit-val-${c.id}" style="font-family:'JetBrains Mono',monospace;font-size:0.95em;font-weight:600;min-width:20px;color:var(--accent);">5</span>
                    <span style="font-size:0.75em;color:var(--text3)">/10</span>
                </div>
            </div>
        `).join('');
    }

    updateScore(id, val) {
        const el = document.getElementById(`crit-val-${id}`);
        if (el) el.textContent = val;
        this.calculerScoreGlobal();
    }

    calculerScoreGlobal() {
        const vals = this.criteres.map(c => {
            const el = document.getElementById(`crit-${c.id}`);
            return el ? parseInt(el.value) : 5;
        });
        const moy = vals.reduce((a,b) => a+b, 0) / vals.length;
        const el = document.getElementById('criteres-score-global');
        if (!el) return moy;
        const color = moy >= 7 ? 'var(--green)' : moy >= 4 ? 'var(--orange)' : 'var(--red)';
        el.style.color = color;
        el.textContent = moy.toFixed(1) + ' / 10';
        return moy;
    }

    chargerSociete(symbole) {
        this.societeActive = symbole;
        if (!symbole) return;
        const eval_ = this.evaluations[symbole];
        this.criteres.forEach(c => {
            const slider = document.getElementById(`crit-${c.id}`);
            const label  = document.getElementById(`crit-val-${c.id}`);
            const val = eval_ ? (eval_.scores[c.id] ?? 5) : 5;
            if (slider) slider.value = val;
            if (label)  label.textContent = val;
        });
        const notes = document.getElementById('criteres-notes');
        if (notes) notes.value = eval_ ? (eval_.notes || '') : '';
        this.calculerScoreGlobal();
    }

    sauvegarderSociete() {
        const symbole = document.getElementById('criteres-societe')?.value;
        if (!symbole) {
            if (typeof portfolioManager !== 'undefined')
                portfolioManager.showNotification('⚠️ Sélectionnez une société', 'warning');
            return;
        }
        const scores = {};
        this.criteres.forEach(c => {
            const el = document.getElementById(`crit-${c.id}`);
            scores[c.id] = el ? parseInt(el.value) : 5;
        });
        const notes = document.getElementById('criteres-notes')?.value || '';
        const scoreGlobal = this.calculerScoreGlobal();
        this.evaluations[symbole] = { symbole, scores, notes, scoreGlobal: parseFloat(scoreGlobal.toFixed(1)), date: new Date().toLocaleDateString('fr-FR') };
        this.sauvegarder();
        this.renderTableau();
        if (typeof portfolioManager !== 'undefined')
            portfolioManager.showNotification(`✅ Évaluation ${symbole} enregistrée`, 'success');
    }

    sauvegarder() {
        localStorage.setItem('criteres_evaluations', JSON.stringify(this.evaluations));
    }

    renderTableau() {
        const thead = document.getElementById('criteres-thead');
        const tbody = document.getElementById('criteres-tbody');
        if (!thead || !tbody) return;

        thead.innerHTML = `
            <th>Société</th>
            ${this.criteres.map(c => `<th style="font-size:0.8em">${c.label}</th>`).join('')}
            <th>Score</th>
            <th>Date</th>
            <th></th>
        `;

        const evals = Object.values(this.evaluations).sort((a,b) => b.scoreGlobal - a.scoreGlobal);
        if (evals.length === 0) {
            tbody.innerHTML = '<tr><td colspan="12" style="text-align:center;padding:40px;color:var(--text2);">Aucune évaluation enregistrée.</td></tr>';
            return;
        }
        tbody.innerHTML = evals.map(e => {
            const nom = (typeof COMPANY_NAMES !== 'undefined' && COMPANY_NAMES[e.symbole]) || e.symbole;
            const scoreColor = e.scoreGlobal >= 7 ? 'var(--green)' : e.scoreGlobal >= 4 ? 'var(--orange)' : 'var(--red)';
            return `<tr>
                <td><strong>${nom}</strong><br><span class="mono" style="font-size:0.8em;color:var(--text2)">${e.symbole}</span></td>
                ${this.criteres.map(c => `<td class="mono" style="text-align:center">${e.scores[c.id] ?? '—'}</td>`).join('')}
                <td class="mono" style="font-weight:700;color:${scoreColor}">${e.scoreGlobal}</td>
                <td style="color:var(--text2);font-size:0.85em">${e.date}</td>
                <td>
                    <button class="btn btn-ghost btn-sm" onclick="criteresManager.editer('${e.symbole}')">✏️</button>
                    <button class="btn btn-danger btn-sm" onclick="criteresManager.supprimer('${e.symbole}')">🗑️</button>
                </td>
            </tr>`;
        }).join('');
    }

    editer(symbole) {
        const sel = document.getElementById('criteres-societe');
        if (sel) { sel.value = symbole; this.chargerSociete(symbole); }
        document.querySelector('#view-criteres .panel')?.scrollIntoView({ behavior: 'smooth' });
    }

    supprimer(symbole) {
        if (confirm(`Supprimer l'évaluation de ${symbole} ?`)) {
            delete this.evaluations[symbole];
            this.sauvegarder();
            this.renderTableau();
        }
    }

    exporter() {
        const evals = Object.values(this.evaluations);
        if (evals.length === 0) {
            if (typeof portfolioManager !== 'undefined')
                portfolioManager.showNotification('ℹ️ Aucune évaluation à exporter', 'info');
            return;
        }
        let csv = 'Société;Symbole;' + this.criteres.map(c => c.label).join(';') + ';Score Global;Date;Notes\n';
        evals.forEach(e => {
            const nom = (typeof COMPANY_NAMES !== 'undefined' && COMPANY_NAMES[e.symbole]) || e.symbole;
            csv += `${nom};${e.symbole};${this.criteres.map(c => e.scores[c.id] ?? '').join(';')};${e.scoreGlobal};${e.date};"${(e.notes||'').replace(/"/g,'""')}"\n`;
        });
        const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `criteres_investissement_${new Date().toISOString().slice(0,10)}.csv`;
        a.click();
        if (typeof portfolioManager !== 'undefined')
            portfolioManager.showNotification('📤 Export critères téléchargé', 'success');
    }
}

const criteresManager = new CriteresManager();

// ============================================
// GESTIONNAIRE D'ANALYSE DES SOCIÉTÉS
// ============================================
class AnalyseManager {
    constructor() {
        this.societeActive = null;
        this.sousMenuActif = 'sante';
        this.chartInstance = null;
        this.init();
    }

    init() {
        // Peupler la liste au démarrage
        setTimeout(() => this.filtrerSocietes(''), 0);
    }

    filtrerSocietes(val) {
        const listeDiv = document.getElementById('analyse-liste');
        const clear    = document.getElementById('analyse-search-clear');
        if (!listeDiv) return;
        const q = (val || '').trim().toLowerCase();
        if (clear) clear.style.display = q ? 'block' : 'none';

        const toutes = (typeof SOCIETES !== 'undefined') ?
            [...SOCIETES].sort((a, b) => a.nom.localeCompare(b.nom)) : [];
        const filtre = q
            ? toutes.filter(s => s.nom.toLowerCase().includes(q) || s.symbole.toLowerCase().includes(q))
            : toutes;

        const esc = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const re  = q ? new RegExp(`(${esc})`, 'gi') : null;
        const hl  = t => re ? t.replace(re, '<mark style="background:var(--accent)30;color:var(--accent);">$1</mark>') : t;

        const cur = this.societeActuelle || '';
        listeDiv.innerHTML = filtre.length ? filtre.map(s =>
            `<div data-sym="${s.symbole}"
                onclick="analyseManager._selectListeItem(this,'${s.symbole}')"
                style="padding:5px 10px;cursor:pointer;display:flex;gap:8px;align-items:center;
                    border-bottom:1px solid var(--border)22;
                    background:${s.symbole===cur?'var(--accent)18':''};"
                onmouseover="if(this.dataset.sym!==analyseManager.societeActuelle)this.style.background='var(--bg3)'"
                onmouseout="this.style.background=this.dataset.sym===analyseManager.societeActuelle?'var(--accent)18':''">
                <span style="color:var(--accent);font-weight:700;min-width:36px;font-size:0.85em;">${hl(s.symbole)}</span>
                <span style="color:var(--text);font-size:0.88em;">${hl(s.nom)}</span>
            </div>`
        ).join('') : `<div style="padding:10px;color:var(--text3);font-size:0.85em;">Aucune société trouvée</div>`;

        // Auto-sélection si un seul résultat
        if (filtre.length === 1) this._selectListeItem(null, filtre[0].symbole);
    }

    _selectListeItem(el, symbole) {
        // Mettre à jour highlight
        const listeDiv = document.getElementById('analyse-liste');
        if (listeDiv) listeDiv.querySelectorAll('[data-sym]').forEach(d => {
            d.style.background = d.dataset.sym === symbole ? 'var(--accent)18' : '';
        });
        this.changerSociete(symbole);
    }

    searchKeyNav(e) {
        const listeDiv = document.getElementById('analyse-liste');
        if (!listeDiv) return;
        const items = [...listeDiv.querySelectorAll('[data-sym]')];
        if (!items.length) return;
        const cur = items.findIndex(d => d.dataset.sym === this.societeActuelle);
        let next = cur;
        if (e.key === 'ArrowDown')  { e.preventDefault(); next = Math.min(cur + 1, items.length - 1); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); next = Math.max(cur - 1, 0); }
        else if (e.key === 'Enter')   { e.preventDefault(); if (items[cur >= 0 ? cur : 0]) this._selectListeItem(null, items[cur >= 0 ? cur : 0].dataset.sym); return; }
        else return;
        if (items[next]) { this._selectListeItem(null, items[next].dataset.sym); items[next].scrollIntoView({ block:'nearest' }); }
    }

    clearSearch() {
        const inp   = document.getElementById('analyse-search');
        const clear = document.getElementById('analyse-search-clear');
        if (inp)   { inp.value = ''; inp.focus(); }
        if (clear) clear.style.display = 'none';
        this.filtrerSocietes('');
    }

    initQuickSelect() {
        const sel = document.getElementById('analyses-societe-quick');
        if (!sel || sel.options.length > 1) return;
        const liste = (typeof SOCIETES !== 'undefined') ?
            [...SOCIETES].sort((a, b) => a.nom.localeCompare(b.nom)) : [];
        liste.forEach(s => {
            const o = document.createElement('option');
            o.value = s.symbole;
            o.textContent = `${s.symbole} — ${s.nom}`;
            sel.appendChild(o);
        });
    }

    getBMCECode(symbole) {
        if (typeof CODES_BMCE === 'undefined') return null;
        const nom = (typeof COMPANY_NAMES !== 'undefined' && COMPANY_NAMES[symbole]) || symbole;
        if (CODES_BMCE[nom]) return CODES_BMCE[nom];
        // Partial match
        for (const [key, val] of Object.entries(CODES_BMCE)) {
            const kl = key.toLowerCase(), nl = nom.toLowerCase();
            if (kl.includes(nl) || nl.includes(kl) || kl.startsWith(nl.slice(0,5))) return val;
        }
        return null;
    }

    switchSousMenu(menu) {
        this.sousMenuActif = menu;
        document.querySelectorAll('.aview').forEach(v => { v.style.display = 'none'; v.classList.remove('active'); });
        document.querySelectorAll('[id^="atab-"]').forEach(b => b.classList.remove('active'));
        const view = document.getElementById(`aview-${menu}`);
        const tab  = document.getElementById(`atab-${menu}`);
        if (view) { view.style.display = 'block'; view.classList.add('active'); }
        if (tab)  tab.classList.add('active');
        if (this.societeActive) this.chargerDonnees(this.societeActive, menu);
    }

    changerSociete(symbole) {
        this.societeActive = symbole;
        if (!symbole) return;
        this.chargerDonnees(symbole, this.sousMenuActif);
    }

    chargerDonnees(symbole, menu) {
        const bmceCode = this.getBMCECode(symbole);
        switch (menu) {
            case 'sante':     this.chargerSante(symbole, bmceCode);    break;
            case 'carnet':    this.chargerCarnet(symbole, bmceCode);   break;
            case 'variation': this.chargerVariation(symbole, bmceCode); break;
            case 'graphique': this.chargerGraphique(symbole, bmceCode); break;
            case 'per':       this.renderPER(symbole);                 break;
            case 'decision':  this.renderDecision(symbole);            break;
            case 'rapports':  this.renderRapports(symbole);            break;
        }
    }

    // ── SANTÉ FINANCIÈRE MULTI-SOURCES ───────────────────────────────────
    async chargerSante(symbole, bmceCode) {
        const el = document.getElementById('sante-content');
        if (!el) return;
        el.innerHTML = `
            <div style="text-align:center;padding:48px 20px;">
                <span class="loader"></span>
                <div style="margin-top:14px;color:var(--text2);font-size:0.9em;">Comparaison en cours — BMCE Capital + Yahoo Finance…</div>
            </div>`;
        const params = new URLSearchParams({ symbole });
        if (bmceCode) params.set('bmce_code', bmceCode);
        try {
            const r = await fetch(`api/sante-multi-proxy.php?${params}&_=${Date.now()}`);
            const d = await r.json();
            if (d.success) el.innerHTML = this._renderSanteMulti(symbole, d);
            else           el.innerHTML = this._renderSanteFallback(symbole);
        } catch(e) { el.innerHTML = this._renderSanteFallback(symbole); }
    }

    _renderSanteMulti(symbole, d) {
        const nom  = (typeof COMPANY_NAMES !== 'undefined' && COMPANY_NAMES[symbole]) || symbole;
        const c    = d.consolidated || {};
        const src  = d.sources     || {};
        const comp = d.comparaison_cours || {};

        const fmtMAD = v => v != null ? (+v).toLocaleString('fr-FR', {minimumFractionDigits:2, maximumFractionDigits:2}) + ' MAD' : '—';
        const fmtPct = v => v != null ? (v > 0 ? '+' : '') + (+v).toFixed(2) + '%' : '—';
        const fmtX   = v => v != null ? (+v).toFixed(2) + 'x' : '—';
        const fmtBig = v => {
            if (v == null) return '—';
            if (Math.abs(v) >= 1e9) return (v/1e9).toLocaleString('fr-FR',{maximumFractionDigits:2}) + ' Mds MAD';
            if (Math.abs(v) >= 1e6) return (v/1e6).toLocaleString('fr-FR',{maximumFractionDigits:1}) + ' M MAD';
            return v.toLocaleString('fr-FR') + ' MAD';
        };
        const fmtVol = v => v != null ? (+v).toLocaleString('fr-FR') + ' titres' : '—';
        const fmtShares = v => {
            if (v == null) return '—';
            if (v >= 1e6) return (v/1e6).toLocaleString('fr-FR',{maximumFractionDigits:2}) + ' M';
            if (v >= 1e3) return (v/1e3).toLocaleString('fr-FR',{maximumFractionDigits:1}) + ' K';
            return v.toLocaleString('fr-FR');
        };

        const varCls  = (c.variation || 0) >= 0 ? 'up' : 'down';

        // Icône recommandation analystes
        const recLabels = {
            'strongBuy':'Fort achat', 'buy':'Achat', 'hold':'Conserver',
            'sell':'Vendre', 'strongSell':'Fort vendre'
        };
        const recColors = {
            'strongBuy':'var(--green)', 'buy':'var(--green)', 'hold':'var(--orange)',
            'sell':'var(--red)', 'strongSell':'var(--red)'
        };
        const recKey   = c.rec_key || '';
        const recLabel = recLabels[recKey] || recKey || '—';
        const recColor = recColors[recKey] || 'var(--text2)';

        // Badge de cohérence entre sources
        const coherent    = comp.coherent !== false;
        const ecartAffiche= comp.ecart_pct != null ? comp.ecart_pct.toFixed(2) + '%' : null;
        const badgeComp   = comp.valeurs && Object.keys(comp.valeurs).length >= 2
            ? `<span style="font-size:0.75em;padding:3px 10px;border-radius:12px;font-weight:700;
                background:${coherent ? 'rgba(35,197,94,.15)' : 'rgba(220,50,50,.15)'};
                color:${coherent ? 'var(--green)' : 'var(--red)'};">
                ${coherent ? '✓ Sources cohérentes' : `⚠️ Écart ${ecartAffiche}`}
               </span>`
            : '';

        // Sources disponibles
        const srcBMCE  = src.bmce?.ok       ? '🏦 BMCE Capital' : null;
        const srcYC    = src.yahoo_chart?.ok ? '📊 Yahoo (cours)' : null;
        const srcYF    = src.yahoo_fund?.ok  ? '📈 Yahoo (fond.)' : null;
        const srcList  = [srcBMCE, srcYC, srcYF].filter(Boolean).join(' · ') || '—';

        // ── Section helper ──
        const section = (title, icon, rows) => {
            const cells = rows.filter(r => r.val !== '—');
            if (!cells.length) return '';
            return `
            <div style="margin-bottom:14px;">
                <div style="font-size:0.78em;font-weight:800;letter-spacing:.08em;text-transform:uppercase;
                    color:var(--text3);margin-bottom:8px;padding-left:2px;">${icon} ${title}</div>
                <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(175px,1fr));gap:8px;">
                    ${rows.map(r => `
                    <div style="background:var(--bg);border:1px solid var(--border);border-radius:var(--radius);padding:11px 13px;">
                        <div style="font-size:0.74em;color:var(--text2);margin-bottom:4px;">${r.label}</div>
                        <div class="mono ${r.cls||''}" style="font-size:1.0em;font-weight:700;">${r.val}</div>
                        ${r.sub ? `<div style="font-size:0.7em;color:var(--text3);margin-top:2px;">${r.sub}</div>` : ''}
                    </div>`).join('')}
                </div>
            </div>`;
        };

        // ── Comparaison cours entre sources ──
        const sourcesComp = comp.valeurs ? Object.entries(comp.valeurs).map(([src, v]) =>
            `<div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid var(--border);">
                <span style="font-size:0.82em;color:var(--text2);">${src}</span>
                <span class="mono" style="font-weight:700;">${v != null ? (+v).toLocaleString('fr-FR',{minimumFractionDigits:2}) + ' MAD' : '—'}</span>
             </div>`
        ).join('') : '';

        // Temps de réponse + indicateur cache
        const fromCache  = d.from_cache === true;
        const staleCache = d.stale_cache === true;
        const cacheAgeMin = d.cache_age_s != null ? Math.round(d.cache_age_s / 60) : null;
        const elapsed = fromCache
            ? (staleCache
                ? `<span style="color:var(--orange);">⚠️ Cache périmé (${cacheAgeMin}min)</span>`
                : `<span style="color:var(--green);">⚡ Cache (${cacheAgeMin}min)</span>`)
            : (d.elapsed_ms ? `${d.elapsed_ms} ms` : '');

        return `
        <!-- En-tête -->
        <div style="display:flex;align-items:flex-start;gap:16px;margin-bottom:18px;flex-wrap:wrap;">
            <div style="flex:1;min-width:200px;">
                <div style="font-size:1.18em;font-weight:800;margin-bottom:2px;">${nom}</div>
                <div class="mono" style="font-size:0.8em;color:var(--text2);">${symbole} · Bourse de Casablanca</div>
                <div style="margin-top:6px;font-size:0.75em;color:var(--text3);">${srcList} ${elapsed ? '· ' + elapsed : ''}</div>
            </div>
            <div style="text-align:right;">
                ${c.cours != null ? `<div class="mono" style="font-size:1.8em;font-weight:800;color:var(--accent);">${(+c.cours).toLocaleString('fr-FR',{minimumFractionDigits:2})} MAD</div>` : ''}
                ${c.variation != null ? `<div class="mono ${varCls}" style="font-size:1.05em;">${fmtPct(c.variation)}</div>` : ''}
                <div style="margin-top:6px;">${badgeComp}</div>
            </div>
        </div>

        <!-- Comparaison cours entre sources -->
        ${sourcesComp ? `
        <div style="background:var(--bg);border:1px solid var(--border);border-radius:var(--radius);padding:12px 14px;margin-bottom:14px;">
            <div style="font-size:0.75em;font-weight:800;letter-spacing:.07em;text-transform:uppercase;color:var(--text3);margin-bottom:8px;">🔍 Comparaison cours entre sources</div>
            ${sourcesComp}
            ${ecartAffiche ? `<div style="margin-top:8px;font-size:0.78em;color:${coherent?'var(--green)':'var(--orange)'};">Écart maximal entre sources : <b>${ecartAffiche}</b>${coherent ? ' — données cohérentes ✓' : ' — vérifier BMCE Capital'}</div>` : ''}
        </div>` : ''}

        ${section('Marché du jour', '📊', [
            { label:'Cours',            val: fmtMAD(c.cours),       cls: varCls },
            { label:'Variation',        val: fmtPct(c.variation),   cls: varCls },
            { label:'Ouverture',        val: fmtMAD(c.ouverture),   cls:'' },
            { label:'Clôture préc.',    val: fmtMAD(c.prev_close),  cls:'' },
            { label:'Plus haut séance', val: fmtMAD(c.haut_jour),   cls:'up' },
            { label:'Plus bas séance',  val: fmtMAD(c.bas_jour),    cls:'down' },
            { label:'Volume',           val: fmtVol(c.volume),      cls:'' },
        ])}

        ${section('52 semaines & Capitalisation', '📅', [
            { label:'Plus haut 52 sem.', val: fmtMAD(c.haut_52s),     cls:'up' },
            { label:'Plus bas 52 sem.',  val: fmtMAD(c.bas_52s),      cls:'down' },
            { label:'Capitalisation',    val: fmtBig(c.capitalisation),cls:'' },
            { label:'Nb titres',         val: fmtShares(c.shares_out), cls:'' },
            { label:'Flottant',          val: c.flottant_pct != null ? c.flottant_pct.toFixed(1)+'%' : '—', cls:'' },
        ])}

        ${section('Valorisation', '💹', [
            { label:'PER (historique)',  val: fmtX(c.per_trailing),   cls:'', sub: src.bmce?.ok && src.bmce.data?.per ? `BMCE: ${(+src.bmce.data.per).toFixed(1)}x` : '' },
            { label:'PER (prévisionnel)',val: fmtX(c.per_forward),    cls:'' },
            { label:'Price / Book',      val: fmtX(c.pbv),            cls:'' },
            { label:'Bêta (volatilité)', val: c.beta != null ? (+c.beta).toFixed(2) : '—', cls:'' },
            { label:'EPS (hist.)',       val: c.eps_trailing != null ? (+c.eps_trailing).toFixed(2)+' MAD' : '—', cls:'' },
            { label:'EPS (prev.)',       val: c.eps_forward  != null ? (+c.eps_forward).toFixed(2)+' MAD'  : '—', cls:'' },
            { label:'Valeur comptable',  val: c.book_value   != null ? (+c.book_value).toFixed(2)+' MAD'   : '—', cls:'' },
        ])}

        ${section('Dividende', '💰', [
            { label:'Rendement dividende', val: c.div_yield != null ? c.div_yield.toFixed(2)+'%' : '—',
              sub: src.bmce?.ok && src.bmce.data?.div_yield ? `BMCE: ${(+src.bmce.data.div_yield).toFixed(2)}%` : '' },
            { label:'Dividende/action', val: c.div_rate != null ? (+c.div_rate).toFixed(2)+' MAD' : '—', cls:'up' },
            { label:'Taux distribution',val: c.payout_ratio != null ? c.payout_ratio.toFixed(1)+'%' : '—', cls:'' },
        ])}

        ${section('Rentabilité & Croissance', '📈', [
            { label:'ROE (rentab. cap.)', val: c.roe != null ? c.roe.toFixed(1)+'%' : '—',
              cls: c.roe != null ? (c.roe >= 0 ? 'up' : 'down') : '' },
            { label:'ROA (rentab. actifs)',val: c.roa != null ? c.roa.toFixed(1)+'%' : '—',
              cls: c.roa != null ? (c.roa >= 0 ? 'up' : 'down') : '' },
            { label:'Marge brute',        val: c.gross_margin  != null ? c.gross_margin.toFixed(1)+'%'  : '—', cls:'' },
            { label:'Marge nette',        val: c.profit_margin != null ? c.profit_margin.toFixed(1)+'%' : '—', cls:'' },
            { label:'Croissance CA',      val: c.revenue_growth != null ? fmtPct(c.revenue_growth)    : '—',
              cls: c.revenue_growth != null ? (c.revenue_growth >= 0 ? 'up' : 'down') : '' },
            { label:'Croissance bénéf.',  val: c.earnings_growth != null ? fmtPct(c.earnings_growth) : '—',
              cls: c.earnings_growth != null ? (c.earnings_growth >= 0 ? 'up' : 'down') : '' },
            { label:'Chiffre d\'affaires',val: fmtBig(c.revenue), cls:'' },
            { label:'EBITDA',             val: fmtBig(c.ebitda),  cls:'' },
        ])}

        ${section('Bilan financier', '🏛️', [
            { label:'Trésorerie',         val: fmtBig(c.total_cash), cls:'up' },
            { label:'Dette totale',       val: fmtBig(c.total_debt), cls:'down' },
            { label:'Ratio courant',      val: c.current_ratio != null ? (+c.current_ratio).toFixed(2) : '—', cls:'' },
            { label:'Dette / Fonds prop.',val: c.debt_to_eq   != null ? (+c.debt_to_eq).toFixed(2)+'x' : '—', cls:'' },
        ])}

        ${c.target_price || c.rec_key ? `
        ${section('Consensus analystes', '🎯', [
            { label:'Objectif moyen',    val: fmtMAD(c.target_price),
              sub: c.nb_analysts ? `${c.nb_analysts} analyste${c.nb_analysts > 1 ? 's' : ''}` : '' },
            { label:'Objectif haut',     val: fmtMAD(c.target_high),  cls:'up' },
            { label:'Objectif bas',      val: fmtMAD(c.target_low),   cls:'down' },
            { label:'Recommandation',
              val: `<span style="color:${recColor};font-weight:700;">${recLabel}</span>`,
              cls:'' },
            { label:'Upside potentiel',
              val: c.cours && c.target_price
                  ? fmtPct(((c.target_price - c.cours) / c.cours) * 100)
                  : '—',
              cls: c.cours && c.target_price
                  ? (c.target_price > c.cours ? 'up' : 'down') : '' },
        ])}` : ''}

        <!-- ── Historique financier vérifié (données rapports officiels) ── -->
        ${(() => {
            const sd = d.static_data;
            if (!sd?.disponible || !sd.historique?.length) return '';
            const fmtM = v => v != null ? (+v).toLocaleString('fr-FR', {minimumFractionDigits:0}) + ' MMAD' : '—';
            const fmtG = v => v != null ? (+v).toFixed(1) + '%' : '—';
            const fmtCA = h => {
                if (h.ca != null) return fmtM(h.ca);
                if (h.s1_ca != null) return `<span style="color:var(--text3);font-size:0.85em;">S1: ${(+h.s1_ca).toLocaleString('fr-FR')} MMAD</span>`;
                return '—';
            };
            const fmtRN = h => {
                if (h.rnpg != null) return `<span style="color:${+h.rnpg < 0 ? 'var(--red)' : 'var(--green)'};">${fmtM(h.rnpg)}</span>`;
                if (h.resultat_net != null) return `<span style="color:${+h.resultat_net < 0 ? 'var(--red)' : 'var(--green)'};">${fmtM(h.resultat_net)}</span>`;
                if (h.s1_rnpg != null) return `<span style="color:var(--text3);font-size:0.85em;">S1: ${(+h.s1_rnpg).toLocaleString('fr-FR')} MMAD</span>`;
                return '—';
            };
            const rows = sd.historique.map(h => {
                const isLast = h.annee === sd.historique[sd.historique.length-1].annee;
                return `<tr style="${isLast ? 'background:rgba(88,166,255,.06);' : ''}">
                    <td style="font-weight:700;padding:8px 10px;">${h.annee}${isLast ? ' *' : ''}</td>
                    <td class="mono" style="padding:8px 10px;color:var(--accent);">${fmtCA(h)}</td>
                    <td class="mono" style="padding:8px 10px;">${fmtRN(h)}</td>
                    <td class="mono" style="padding:8px 10px;color:${h.endettement_net != null && +h.endettement_net < 0 ? 'var(--green)' : 'var(--red)'};">${fmtM(h.endettement_net)}</td>
                    <td class="mono" style="padding:8px 10px;">${fmtG(h.gearing)}</td>
                    ${h.notes ? `<td style="font-size:0.74em;color:var(--text3);padding:8px 10px;">${h.notes}</td>` : '<td></td>'}
                </tr>`;
            }).join('');
            // Mini graphique RNPG (barres CSS)
            const rnYears = sd.historique.filter(h => h.rnpg != null);
            const maxRN   = Math.max(...rnYears.map(h => Math.abs(+h.rnpg)), 1);
            const rnBars  = rnYears.map(h => {
                const v   = +h.rnpg;
                const pct = Math.abs(v) / maxRN * 100;
                const col = v < 0 ? 'var(--red)' : 'var(--green)';
                const lbl = v >= 1000 ? (v/1000).toFixed(1)+'Md' : v.toFixed(0);
                return `<div style="display:flex;flex-direction:column;align-items:center;gap:3px;flex:1;min-width:36px;">
                    <span class="mono" style="font-size:0.7em;color:${col};font-weight:700;">${lbl}</span>
                    <div style="width:28px;background:${col};border-radius:3px 3px 0 0;height:${pct.toFixed(1)}%;min-height:4px;transition:height 0.4s;"></div>
                    <span style="font-size:0.7em;color:var(--text3);">${h.annee}</span>
                </div>`;
            }).join('');

            const rnChart = rnYears.length >= 2 ? `
            <div style="margin-bottom:12px;">
                <div style="font-size:0.72em;color:var(--text3);margin-bottom:6px;padding-left:2px;">📊 RNPG — Résultat Net Part du Groupe (MMAD)</div>
                <div style="display:flex;align-items:flex-end;gap:6px;height:80px;padding:0 4px;background:var(--bg);border:1px solid var(--border);border-radius:var(--radius);padding:10px 12px 8px;">
                    ${rnBars}
                </div>
            </div>` : '';

            return `
            <div style="margin-bottom:14px;">
                <div style="font-size:0.78em;font-weight:800;letter-spacing:.08em;text-transform:uppercase;
                    color:var(--text3);margin-bottom:8px;padding-left:2px;">📋 HISTORIQUE FINANCIER VÉRIFIÉ</div>
                ${rnChart}
                <div style="background:var(--bg);border:1px solid var(--border);border-radius:var(--radius);overflow:auto;">
                    <table style="width:100%;border-collapse:collapse;font-size:0.84em;">
                        <thead>
                            <tr style="background:var(--bg2);border-bottom:1px solid var(--border);">
                                <th style="padding:8px 10px;text-align:left;color:var(--text2);font-weight:700;">Année</th>
                                <th style="padding:8px 10px;text-align:left;color:var(--text2);font-weight:700;">Chiffre d'affaires</th>
                                <th style="padding:8px 10px;text-align:left;color:var(--text2);font-weight:700;">RNPG</th>
                                <th style="padding:8px 10px;text-align:left;color:var(--text2);font-weight:700;">Endettement net</th>
                                <th style="padding:8px 10px;text-align:left;color:var(--text2);font-weight:700;">Gearing</th>
                                <th style="padding:8px 10px;text-align:left;color:var(--text2);font-weight:700;">Notes</th>
                            </tr>
                        </thead>
                        <tbody>${rows}</tbody>
                    </table>
                </div>
                ${sd.note ? `<div style="margin-top:7px;font-size:0.74em;color:var(--text3);padding:0 4px;">* ${sd.note}</div>` : ''}
                ${sd.source ? `<div style="margin-top:3px;font-size:0.72em;color:var(--text3);padding:0 4px;">Source : ${sd.source}</div>` : ''}
            </div>`;
        })()}

        <!-- Pied de page sources -->
        <div style="margin-top:10px;padding:9px 14px;background:var(--bg);border:1px solid var(--border);
            border-radius:var(--radius);font-size:0.77em;color:var(--text3);
            display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
            <span>🕐 ${new Date().toLocaleString('fr-FR')}</span>
            <span style="color:var(--border);">|</span>
            ${src.bmce?.ok       ? '<span style="color:var(--accent);">✓ BMCE Capital</span>' : '<span>✗ BMCE indisponible</span>'}
            ${src.yahoo_chart?.ok? '<span style="color:var(--accent);">✓ Yahoo Cours</span>'  : '<span>✗ Yahoo cours indisponible</span>'}
            ${src.yahoo_fund?.ok ? '<span style="color:var(--accent);">✓ Yahoo Fondamentaux</span>' : '<span>✗ Yahoo fond. indisponible</span>'}
            ${d.static_data?.disponible ? `<span style="color:#d2a520;">✓ Données officielles vérifiées</span>` : ''}
            <a href="https://finance.yahoo.com/quote/${symbole}.CS" target="_blank"
               style="color:var(--accent);text-decoration:none;margin-left:auto;">Yahoo Finance →</a>
            <a href="https://www.bmcecapitalbourse.com" target="_blank"
               style="color:var(--accent);text-decoration:none;">BMCE Capital →</a>
        </div>`;
    }

    _renderSanteFallback(symbole) {
        const nom = (typeof COMPANY_NAMES !== 'undefined' && COMPANY_NAMES[symbole]) || symbole;
        return `
            <div style="margin-bottom:16px;">
                <h3 style="font-size:1.1em;font-weight:700;">${nom} <span class="mono" style="font-size:0.7em;color:var(--text2);">(${symbole})</span></h3>
            </div>
            <div style="text-align:center;padding:32px 20px;background:var(--bg);border:1px solid var(--border);border-radius:var(--radius);">
                <div style="font-size:2.5em;margin-bottom:12px;">🔗</div>
                <p style="color:var(--text2);margin-bottom:18px;">Données temporairement indisponibles. Accédez directement aux plateformes :</p>
                <div style="display:flex;flex-wrap:wrap;gap:10px;justify-content:center;">
                    <a href="https://finance.yahoo.com/quote/${symbole}.CS" target="_blank" class="btn btn-primary btn-sm">📊 Yahoo Finance</a>
                    <a href="https://www.bmcecapitalbourse.com/bkbbourse/lists/TK" target="_blank" class="btn btn-ghost btn-sm">🏦 BMCE Capital Bourse</a>
                    <a href="https://www.casablanca-bourse.com" target="_blank" class="btn btn-ghost btn-sm">🏛️ Bourse de Casablanca</a>
                </div>
            </div>`;
    }

    // ── CARNET D'ORDRES ──────────────────────────────────────────────────
    async chargerCarnet(symbole, bmceCode) {
        const el = document.getElementById('carnet-content');
        if (!el) return;
        el.innerHTML = '<div style="text-align:center;padding:40px;"><span class="loader"></span> Chargement du carnet d\'ordres…</div>';
        try {
            // Source 1 : Wafabourse (carnet en temps réel)
            const r1 = await fetch(`api/wafabourse-proxy.php?ticker=${encodeURIComponent(symbole)}`);
            const d1 = await r1.json();
            if (d1.success && (d1.achats?.length > 0 || d1.ventes?.length > 0)) {
                el.innerHTML = this._renderCarnet(symbole, d1);
                return;
            }
        } catch(e) { /* fallback BMCE */ }
        // Source 2 : BMCE Capital (fallback)
        if (!bmceCode) {
            el.innerHTML = '<div class="empty-state"><div class="icon">📒</div><p>Carnet d\'ordres indisponible (marché fermé ou données non disponibles).</p></div>';
            return;
        }
        try {
            const r2 = await fetch(`api/bmce-detail-proxy.php?code=${bmceCode}&tab=cotation`);
            const d2 = await r2.json();
            el.innerHTML = d2.success ? this._renderCarnet(symbole, d2) : `<div class="empty-state"><div class="icon">⚠️</div><p>${d2.error || 'Données indisponibles'}</p></div>`;
        } catch(e) { el.innerHTML = `<div class="empty-state"><div class="icon">❌</div><p>Erreur réseau : ${e.message}</p></div>`; }
    }

    _renderCarnet(symbole, data) {
        const nom    = (typeof COMPANY_NAMES !== 'undefined' && COMPANY_NAMES[symbole]) || symbole;
        const has    = (data.achats && data.achats.length > 0) || (data.ventes && data.ventes.length > 0);
        const source = data.source || 'bmce';
        const showNb = data.achats?.some(o => o.nombre != null) || data.ventes?.some(o => o.nombre != null);
        const rows = (arr, cls) => arr && arr.length > 0
            ? arr.map(o => `<tr>
                ${showNb ? `<td class="mono" style="color:var(--text3);font-size:0.8em;text-align:center;">${o.nombre ?? '—'}</td>` : ''}
                <td class="mono" style="color:var(--text2);">${o.quantite ? o.quantite.toLocaleString('fr-FR') : '—'}</td>
                <td class="mono ${cls}" style="font-weight:600;">${o.prix ? o.prix.toLocaleString('fr-FR') + ' MAD' : '—'}</td>
              </tr>`).join('')
            : `<tr><td colspan="${showNb?3:2}" style="text-align:center;color:var(--text2);padding:12px;">Aucun ordre</td></tr>`;
        const thNb = showNb ? '<th style="color:var(--text3);font-size:0.8em;">N°</th>' : '';
        const varHtml = data.variation != null
            ? `<span class="mono" style="font-size:0.95em;color:${data.variation>0?'var(--green)':data.variation<0?'var(--red)':'var(--text2)'};">${data.variation>0?'+':''}${data.variation.toFixed(2)}%</span>`
            : '';
        const jourHtml = data.jour ? [
            data.jour.ouverture_jour != null ? `<span>Ouverture <strong>${data.jour.ouverture_jour.toLocaleString('fr-FR')}</strong></span>` : '',
            data.jour.haut_jour     != null ? `<span style="color:var(--green);">+Haut <strong>${data.jour.haut_jour.toLocaleString('fr-FR')}</strong></span>` : '',
            data.jour.bas_jour      != null ? `<span style="color:var(--red);">+Bas <strong>${data.jour.bas_jour.toLocaleString('fr-FR')}</strong></span>` : '',
            data.jour.quantite_jour != null ? `<span style="color:var(--text2);">Qté <strong>${Number(data.jour.quantite_jour).toLocaleString('fr-FR')}</strong></span>` : '',
        ].filter(Boolean).join(' · ') : '';
        return `
            <div style="display:flex;align-items:center;gap:12px;margin-bottom:10px;flex-wrap:wrap;">
                <h3 style="font-size:1.05em;font-weight:700;margin:0;">${nom}</h3>
                ${data.cours_actuel ? `<span class="mono" style="font-size:1.15em;font-weight:700;color:var(--accent);">${data.cours_actuel.toLocaleString('fr-FR')} MAD</span>` : ''}
                ${varHtml}
                ${!has ? '<span style="font-size:0.82em;color:var(--orange);">⚠️ Marché fermé ou données indisponibles</span>' : ''}
            </div>
            ${jourHtml ? `<div style="font-size:0.8em;color:var(--text2);margin-bottom:14px;display:flex;flex-wrap:wrap;gap:10px;">${jourHtml}</div>` : ''}
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
                <div>
                    <div style="font-weight:600;color:var(--green);margin-bottom:6px;font-size:0.85em;letter-spacing:0.04em;">🟢 ACHATS (BID)</div>
                    <div class="table-wrap"><table><thead><tr>${thNb}<th>Quantité</th><th>Cours</th></tr></thead><tbody>${rows(data.achats,'up')}</tbody></table></div>
                </div>
                <div>
                    <div style="font-weight:600;color:var(--red);margin-bottom:6px;font-size:0.85em;letter-spacing:0.04em;">🔴 VENTES (ASK)</div>
                    <div class="table-wrap"><table><thead><tr>${thNb}<th>Quantité</th><th>Cours</th></tr></thead><tbody>${rows(data.ventes,'down')}</tbody></table></div>
                </div>
            </div>
            <div style="margin-top:10px;font-size:0.75em;color:var(--text3);">Source: ${source === 'wafabourse.com' ? 'Wafa Bourse' : 'BMCE Capital Bourse'} · ${new Date().toLocaleString('fr-FR')}</div>`;
    }

    // ── VARIATION DES COURS (HISTORIQUE 1 MOIS) ──────────────────────────
    async chargerVariation(symbole, bmceCode) {
        const el = document.getElementById('variation-content');
        if (!el) return;
        el.innerHTML = '<div style="text-align:center;padding:40px;"><span class="loader"></span> Chargement de l\'historique…</div>';
        if (!bmceCode) { el.innerHTML = '<div class="empty-state"><div class="icon">📊</div><p>Code BMCE introuvable pour cette société.</p></div>'; return; }
        try {
            const r = await fetch(`api/bmce-detail-proxy.php?code=${bmceCode}&tab=historique`);
            const d = await r.json();
            if (d.success && d.historique && d.historique.length > 0)
                el.innerHTML = this._renderVariation(symbole, d);
            else
                el.innerHTML = '<div class="empty-state"><div class="icon">📊</div><p>Aucun historique disponible pour ce titre.</p></div>';
        } catch(e) { el.innerHTML = `<div class="empty-state"><div class="icon">❌</div><p>Erreur : ${e.message}</p></div>`; }
    }

    _renderVariation(symbole, data) {
        const nom   = (typeof COMPANY_NAMES !== 'undefined' && COMPANY_NAMES[symbole]) || symbole;
        const histo = data.historique || [];
        const s     = data.stats || {};
        const cellPad  = `padding:9px 14px;white-space:nowrap;font-size:0.9em;`;
        const stickyTh = `position:sticky;left:0;z-index:2;background:var(--bg2);${cellPad}border-right:2px solid var(--border);text-transform:none;font-weight:600;`;
        const stickyTd = `position:sticky;left:0;z-index:1;background:var(--bg);${cellPad}border-right:2px solid var(--border);`;
        const thStyle  = `${cellPad}text-align:right;text-transform:none;font-weight:600;`;
        const tdBase   = `${cellPad}text-align:right;`;
        const rows  = histo.map(r => {
            const vc = r.variation > 0 ? 'up' : r.variation < 0 ? 'down' : 'neutral';
            const vs = r.variation > 0 ? '+' : '';
            return `<tr>
                <td class="mono" style="${stickyTd}">${r.date}</td>
                <td class="mono" style="${tdBase}font-weight:600;">${r.dernier != null ? r.dernier.toLocaleString('fr-FR') : '—'}</td>
                <td class="mono" style="${tdBase}color:var(--text2);">${r.quantite != null ? r.quantite.toLocaleString('fr-FR') : '—'}</td>
                <td class="mono" style="${tdBase}color:var(--text2);">${r.volume != null ? (r.volume/1000).toFixed(0) + '\u202fK' : '—'}</td>
                <td class="mono ${vc}" style="${tdBase}font-weight:700;">${r.variation != null ? vs + r.variation.toFixed(2) + '%' : '—'}</td>
            </tr>`;
        }).join('');
        return `
            <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;margin-bottom:14px;">
                <h3 style="font-size:1.1em;font-weight:700;">${nom} — Historique ${histo.length} séances</h3>
                <div style="display:flex;gap:16px;flex-wrap:wrap;font-size:0.85em;">
                    ${s.plus_haut ? `<span style="color:var(--green);">⬆️ Max <strong>${s.plus_haut.toLocaleString('fr-FR')} MAD</strong></span>` : ''}
                    ${s.plus_bas  ? `<span style="color:var(--red);">⬇️ Min <strong>${s.plus_bas.toLocaleString('fr-FR')} MAD</strong></span>`  : ''}
                    ${s.vol_total ? `<span style="color:var(--text2);">Volume total <strong>${(s.vol_total/1000).toFixed(0)} K MAD</strong></span>` : ''}
                </div>
            </div>
            <div style="width:100%;overflow-x:auto;overflow-y:auto;max-height:60vh;border-radius:8px;border:1px solid var(--border);-webkit-overflow-scrolling:touch;">
                <table style="min-width:520px;width:100%;border-collapse:collapse;">
                    <thead>
                        <tr style="background:var(--bg2);">
                            <th style="${stickyTh}text-align:left;">Date</th>
                            <th style="${thStyle}">Dernier</th>
                            <th style="${thStyle}">Quantité</th>
                            <th style="${thStyle}">Volume</th>
                            <th style="${thStyle}">Variation %</th>
                        </tr>
                    </thead>
                    <tbody>${rows}</tbody>
                </table>
            </div>
            <div style="margin-top:10px;font-size:0.8em;color:var(--text3);">Source: BMCE Capital Bourse · ${new Date().toLocaleString('fr-FR')}</div>`;
    }

    // ── ANALYSE PER ────────────────────────────────────────────────────────
    renderPER(symbole) {
        const el = document.getElementById('per-content');
        if (!el) return;
        const nom = (typeof COMPANY_NAMES !== 'undefined' && COMPANY_NAMES[symbole]) || symbole;
        if (typeof PER_DATA === 'undefined' || !PER_DATA[symbole]) {
            el.innerHTML = `<div class="empty-state"><div class="icon">📐</div><p>Données PER non disponibles pour ${nom}.</p></div>`;
            return;
        }
        const pd  = PER_DATA[symbole];
        const sd  = (typeof SECTEURS_BVC !== 'undefined') ? SECTEURS_BVC[pd.secteur] : null;
        const yrs = ['2023','2024','2025'];
        const per2025 = pd.per['2025'];
        const avg2025 = sd?.avg['2025'];

        // Évaluation
        let vColor, vLabel, vIcon, vDetail;
        if (per2025 == null) {
            vColor='var(--text3)'; vLabel='Non calculable'; vIcon='—'; vDetail='Résultats négatifs ou données insuffisantes';
        } else if (!avg2025) {
            vColor='var(--accent)'; vLabel='Comparaison indisponible'; vIcon='?'; vDetail='';
        } else if (per2025 < avg2025 * 0.80) {
            vColor='var(--green)'; vLabel='Fortement sous-évalué'; vIcon='⬇️'; vDetail=`PER ${per2025}x vs secteur ${avg2025}x — décote de ${((1-per2025/avg2025)*100).toFixed(0)}%`;
        } else if (per2025 < avg2025 * 0.92) {
            vColor='#3fb950'; vLabel='Sous-évalué'; vIcon='📉'; vDetail=`PER ${per2025}x vs secteur ${avg2025}x — décote de ${((1-per2025/avg2025)*100).toFixed(0)}%`;
        } else if (per2025 <= avg2025 * 1.08) {
            vColor='#d2a520'; vLabel='Correctement valorisé'; vIcon='↔️'; vDetail=`PER ${per2025}x proche de la moyenne sectorielle ${avg2025}x`;
        } else if (per2025 <= avg2025 * 1.20) {
            vColor='#f0883e'; vLabel='Légèrement sur-évalué'; vIcon='📈'; vDetail=`PER ${per2025}x vs secteur ${avg2025}x — prime de ${((per2025/avg2025-1)*100).toFixed(0)}%`;
        } else {
            vColor='var(--red)'; vLabel='Sur-évalué'; vIcon='⬆️'; vDetail=`PER ${per2025}x vs secteur ${avg2025}x — prime de ${((per2025/avg2025-1)*100).toFixed(0)}%`;
        }

        // Tableau PER par année
        const rows = yrs.map(y => {
            const v = pd.per[y];
            const a = sd?.avg[y];
            let badge = '';
            if (v != null && a != null) {
                if (v < a * 0.92)      badge = `<span style="font-size:0.75em;color:var(--green);margin-left:6px;">▼ sous-évalué</span>`;
                else if (v > a * 1.08) badge = `<span style="font-size:0.75em;color:var(--red);margin-left:6px;">▲ sur-évalué</span>`;
                else                   badge = `<span style="font-size:0.75em;color:var(--text3);margin-left:6px;">= marché</span>`;
            }
            return `<tr>
                <td class="mono" style="font-weight:600;">${y}</td>
                <td class="mono" style="color:var(--accent);">${v != null ? v.toFixed(1)+'x' : '<span style="color:var(--text3)">N/A</span>'}</td>
                <td class="mono" style="color:var(--text2);">${a != null ? a.toFixed(1)+'x' : '—'}</td>
                <td class="mono" style="color:var(--text3);">${sd?.mondial != null ? sd.mondial+'x' : '—'}</td>
                <td>${badge}</td>
            </tr>`;
        }).join('');

        // Mini bar chart (CSS)
        const maxVal = Math.max(...yrs.map(y => pd.per[y] || 0).concat(yrs.map(y => sd?.avg[y] || 0)), 1);
        const bars = yrs.map(y => {
            const v = pd.per[y];
            const a = sd?.avg[y];
            const hp = v ? ((v/maxVal)*100).toFixed(1) : 0;
            const ha = a ? ((a/maxVal)*100).toFixed(1) : 0;
            return `<div style="display:flex;flex-direction:column;align-items:center;gap:4px;flex:1;">
                <div style="display:flex;align-items:flex-end;gap:3px;height:80px;">
                    <div title="${nom} PER ${y}: ${v||'N/A'}x" style="width:22px;background:var(--accent);border-radius:3px 3px 0 0;height:${hp}%;min-height:${v?'4px':'0'};"></div>
                    <div title="Secteur PER ${y}: ${a||'—'}x"  style="width:22px;background:var(--bg3);border:1px solid var(--border);border-radius:3px 3px 0 0;height:${ha}%;min-height:${a?'4px':'0'};"></div>
                </div>
                <span style="font-size:0.75em;color:var(--text2);">${y}</span>
            </div>`;
        }).join('');

        el.innerHTML = `
            <div style="display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:16px;margin-bottom:20px;">
                <div>
                    <h3 style="font-size:1.1em;font-weight:700;margin-bottom:4px;">${nom} <span class="mono" style="font-size:0.75em;color:var(--text2);">${symbole}</span></h3>
                    <span style="font-size:0.82em;color:var(--text2);">${sd ? sd.emoji+' Secteur : '+pd.secteur+' — '+sd.desc : pd.secteur}</span>
                </div>
                <div style="background:${vColor}18;border:1px solid ${vColor};border-radius:10px;padding:12px 20px;text-align:center;">
                    <div style="font-size:1.8em;">${vIcon}</div>
                    <div style="font-size:0.95em;font-weight:700;color:${vColor};">${vLabel}</div>
                    ${vDetail ? `<div style="font-size:0.75em;color:var(--text2);margin-top:4px;">${vDetail}</div>` : ''}
                </div>
            </div>

            <!-- Bar chart -->
            <div style="display:flex;align-items:flex-end;gap:12px;margin-bottom:6px;padding:16px;background:var(--bg3);border-radius:8px;">
                ${bars}
                <div style="font-size:0.72em;color:var(--text3);margin-left:8px;line-height:1.6;">
                    <span style="display:block;"><span style="display:inline-block;width:12px;height:12px;background:var(--accent);border-radius:2px;margin-right:4px;"></span>${symbole}</span>
                    <span style="display:block;"><span style="display:inline-block;width:12px;height:12px;background:var(--bg2);border:1px solid var(--border);border-radius:2px;margin-right:4px;"></span>Secteur</span>
                </div>
            </div>

            <!-- Tableau -->
            <div class="table-wrap" style="margin-top:16px;">
                <table>
                    <thead><tr><th>Année</th><th>${symbole} PER</th><th>Secteur moy.</th><th>Mondial</th><th>Évaluation</th></tr></thead>
                    <tbody>${rows}</tbody>
                </table>
            </div>

            ${sd ? `<div style="margin-top:16px;padding:12px;background:var(--bg2);border-radius:8px;font-size:0.82em;color:var(--text2);">
                <strong>💡 Interprétation :</strong> Un PER inférieur à la moyenne sectorielle (${avg2025}x) indique une possible décote. Un PER supérieur peut refléter une croissance attendue plus forte ou une survalorisation. Comparer avec le PER mondial (${sd.mondial}x) pour le contexte international.
            </div>` : ''}
            <div style="margin-top:8px;font-size:0.72em;color:var(--text3);">Source : Rapports annuels BVC · Estimations analystes · Mise à jour mars 2026</div>
        `;
    }

    // ── DÉCISION FINALE D'INVESTISSEMENT ───────────────────────────────────
    renderDecision(symbole) {
        const el = document.getElementById('decision-content');
        if (!el) return;
        const nom = (typeof COMPANY_NAMES !== 'undefined' && COMPANY_NAMES[symbole]) || symbole;
        el.innerHTML = `<div style="text-align:center;padding:30px;"><span class="loader"></span> Analyse en cours…</div>`;

        // ── 1. Score SANTÉ FINANCIÈRE (0-30) ──────────────────────────────
        let scoreSante = 0, detailSante = [];
        const sd = (typeof SANTE_DATA !== 'undefined') ? SANTE_DATA[symbole] : null;
        if (sd) {
            const ca = sd.ca || [];
            const rn = sd.rn || [];
            // CA growth score
            const caGrowth = ca.length >= 2 ? ((ca[ca.length-1]-ca[0])/Math.abs(ca[0])*100/ca.length) : null;
            if (caGrowth != null) {
                if (caGrowth > 10)      { scoreSante += 10; detailSante.push({l:'Croissance CA',v:'Forte (+'+caGrowth.toFixed(1)+'%/an)',c:'var(--green)'}); }
                else if (caGrowth > 3)  { scoreSante += 7;  detailSante.push({l:'Croissance CA',v:'Modérée (+'+caGrowth.toFixed(1)+'%/an)',c:'#d2a520'}); }
                else if (caGrowth > 0)  { scoreSante += 4;  detailSante.push({l:'Croissance CA',v:'Faible (+'+caGrowth.toFixed(1)+'%/an)',c:'#f0883e'}); }
                else                    { scoreSante += 1;  detailSante.push({l:'Croissance CA',v:'Négative ('+caGrowth.toFixed(1)+'%/an)',c:'var(--red)'}); }
            } else { scoreSante += 5; detailSante.push({l:'Croissance CA',v:'Données insuffisantes',c:'var(--text3)'}); }
            // RN growth score
            const rnGrowth = rn.length >= 2 ? ((rn[rn.length-1]-rn[0])/Math.abs(rn[0])*100/rn.length) : null;
            if (rnGrowth != null) {
                if (rnGrowth > 10)      { scoreSante += 10; detailSante.push({l:'Croissance RN',v:'Forte (+'+rnGrowth.toFixed(1)+'%/an)',c:'var(--green)'}); }
                else if (rnGrowth > 3)  { scoreSante += 7;  detailSante.push({l:'Croissance RN',v:'Modérée (+'+rnGrowth.toFixed(1)+'%/an)',c:'#d2a520'}); }
                else if (rnGrowth > 0)  { scoreSante += 4;  detailSante.push({l:'Croissance RN',v:'Faible (+'+rnGrowth.toFixed(1)+'%/an)',c:'#f0883e'}); }
                else                    { scoreSante += 1;  detailSante.push({l:'Croissance RN',v:'Négative ('+rnGrowth.toFixed(1)+'%/an)',c:'var(--red)'}); }
            } else { scoreSante += 5; }
            // Endettement
            const detteMot = (sd.endettement || []).join(' ').toLowerCase();
            if (detteMot.includes('faible') || detteMot.includes('nette'))   { scoreSante += 10; detailSante.push({l:'Endettement',v:'Faible / Net positif',c:'var(--green)'}); }
            else if (detteMot.includes('maîtrisé') || detteMot.includes('maitrisé')) { scoreSante += 7; detailSante.push({l:'Endettement',v:'Maîtrisé',c:'#d2a520'}); }
            else if (detteMot.includes('modéré') || detteMot.includes('stable'))    { scoreSante += 5; detailSante.push({l:'Endettement',v:'Modéré',c:'#f0883e'}); }
            else if (detteMot.includes('élevé') || detteMot.includes('important'))  { scoreSante += 2; detailSante.push({l:'Endettement',v:'Élevé',c:'var(--red)'}); }
            else { scoreSante += 5; detailSante.push({l:'Endettement',v:'Non précisé',c:'var(--text3)'}); }
        } else {
            scoreSante = 15;
            detailSante.push({l:'Santé financière',v:'Données non disponibles (score neutre)',c:'var(--text3)'});
        }

        // ── 2. Score PER (0-25) ────────────────────────────────────────────
        let scorePER = 0, detailPER = '', perLabel = '';
        const pd  = (typeof PER_DATA !== 'undefined') ? PER_DATA[symbole] : null;
        const svd = pd && (typeof SECTEURS_BVC !== 'undefined') ? SECTEURS_BVC[pd.secteur] : null;
        const per2025 = pd?.per?.['2025'];
        const avg2025 = svd?.avg?.['2025'];
        if (per2025 == null) {
            scorePER = 12; perLabel = 'Non calculable'; detailPER = 'Résultats indisponibles';
        } else if (!avg2025) {
            scorePER = 12; perLabel = 'PER '+per2025+'x'; detailPER = '';
        } else if (per2025 < avg2025 * 0.80) {
            scorePER = 25; perLabel = 'Fortement sous-évalué'; detailPER = `PER ${per2025}x vs secteur ${avg2025}x (−${((1-per2025/avg2025)*100).toFixed(0)}%)`;
        } else if (per2025 < avg2025 * 0.92) {
            scorePER = 20; perLabel = 'Sous-évalué'; detailPER = `PER ${per2025}x vs secteur ${avg2025}x (−${((1-per2025/avg2025)*100).toFixed(0)}%)`;
        } else if (per2025 <= avg2025 * 1.08) {
            scorePER = 15; perLabel = 'Correctement valorisé'; detailPER = `PER ${per2025}x ≈ secteur ${avg2025}x`;
        } else if (per2025 <= avg2025 * 1.20) {
            scorePER = 8;  perLabel = 'Légèrement sur-évalué'; detailPER = `PER ${per2025}x vs secteur ${avg2025}x (+${((per2025/avg2025-1)*100).toFixed(0)}%)`;
        } else {
            scorePER = 3;  perLabel = 'Sur-évalué'; detailPER = `PER ${per2025}x vs secteur ${avg2025}x (+${((per2025/avg2025-1)*100).toFixed(0)}%)`;
        }

        // ── 3. Score TENDANCE TECHNIQUE (0-25) ────────────────────────────
        let scoreTech = 12, detailTech = 'Historique non chargé (score neutre)';
        const histo = this._cache?.[symbole]?.variation?.historique;
        if (histo && histo.length >= 3) {
            const recent = histo.slice(0, Math.min(5, histo.length));
            const avgVar = recent.reduce((s, h) => s + (h.variation || 0), 0) / recent.length;
            if (avgVar > 1.0)       { scoreTech = 25; detailTech = `Tendance très haussière (moy. ${avgVar.toFixed(2)}%/séance)`; }
            else if (avgVar > 0.3)  { scoreTech = 20; detailTech = `Tendance haussière (moy. +${avgVar.toFixed(2)}%/séance)`; }
            else if (avgVar > -0.3) { scoreTech = 13; detailTech = `Tendance neutre (moy. ${avgVar.toFixed(2)}%/séance)`; }
            else if (avgVar > -1.0) { scoreTech = 6;  detailTech = `Tendance baissière (moy. ${avgVar.toFixed(2)}%/séance)`; }
            else                    { scoreTech = 2;  detailTech = `Tendance très baissière (moy. ${avgVar.toFixed(2)}%/séance)`; }
        }

        // ── 4. Score CARNET D'ORDRES (0-20) ───────────────────────────────
        let scoreCarnet = 10, detailCarnet = 'Carnet non chargé (score neutre)';
        const carnet = this._cache?.[symbole]?.carnet;
        if (carnet && carnet.achat && carnet.vente) {
            const volAchat = (carnet.achat || []).reduce((s,r) => s + (r.quantite || 0), 0);
            const volVente = (carnet.vente || []).reduce((s,r) => s + (r.quantite || 0), 0);
            const ratio = volVente > 0 ? volAchat / volVente : (volAchat > 0 ? 5 : 1);
            if (ratio > 2.0)       { scoreCarnet = 20; detailCarnet = `Forte pression acheteuse (×${ratio.toFixed(1)} vs vendeurs)`; }
            else if (ratio > 1.2)  { scoreCarnet = 16; detailCarnet = `Pression acheteuse (×${ratio.toFixed(1)} vs vendeurs)`; }
            else if (ratio > 0.8)  { scoreCarnet = 11; detailCarnet = `Équilibre acheteurs/vendeurs`; }
            else if (ratio > 0.5)  { scoreCarnet = 6;  detailCarnet = `Pression vendeuse (×${(1/ratio).toFixed(1)} vs acheteurs)`; }
            else                   { scoreCarnet = 2;  detailCarnet = `Forte pression vendeuse (×${(1/ratio).toFixed(1)} vs acheteurs)`; }
        }

        // ── 5. Impact Actualités (−15 → +15) ─────────────────────────────
        let scoreNews = 0, newsItems = [];
        if (typeof NEWS_IMPACT !== 'undefined') {
            const secteurKey = pd ? '__' + pd.secteur : null;
            const sources = [
                ...(NEWS_IMPACT['__global'] || []),
                ...(secteurKey ? (NEWS_IMPACT[secteurKey] || []) : []),
                ...(NEWS_IMPACT[symbole] || [])
            ];
            sources.forEach(n => {
                scoreNews += (n.score || 0);
                newsItems.push(n);
            });
            scoreNews = Math.max(-15, Math.min(15, Math.round(scoreNews / Math.max(sources.length, 1) * 3)));
        }

        // ── SCORE TOTAL ────────────────────────────────────────────────────
        const total = Math.min(100, scoreSante + scorePER + scoreTech + scoreCarnet);
        const totalAvecNews = Math.max(0, Math.min(100, total + scoreNews));

        let decision, decColor, decIcon, decBg, conseil;
        if (totalAvecNews >= 68) {
            decision='ACHETER'; decColor='var(--green)'; decIcon='📈'; decBg='#3fb95022';
            conseil = 'Les fondamentaux, la valorisation et le momentum technique sont favorables. Opportunité d\'entrée identifiée.';
        } else if (totalAvecNews >= 45) {
            decision='CONSERVER'; decColor='#d2a520'; decIcon='⏸️'; decBg='#d2a52022';
            conseil = 'Profil risque/rendement équilibré. Maintenir la position existante, surveiller les prochains résultats.';
        } else {
            decision='ALLÉGER / VENDRE'; decColor='var(--red)'; decIcon='📉'; decBg='#f8514922';
            conseil = 'Signaux défavorables sur plusieurs critères. Réduire l\'exposition ou attendre un meilleur point d\'entrée.';
        }

        // Jauges HTML
        const jauge = (score, max, color) => {
            const pct = (score / max * 100).toFixed(0);
            return `<div style="flex:1;height:6px;background:var(--bg3);border-radius:3px;overflow:hidden;">
                <div style="width:${pct}%;height:100%;background:${color};border-radius:3px;transition:width 0.6s;"></div>
            </div>`;
        };

        const criteresRows = [
            { label:'Santé financière',    score:scoreSante,  max:30, detail: detailSante.map(d=>`<span style="color:${d.c}">${d.l}: ${d.v}</span>`).join(' · ') || '' },
            { label:'Valorisation (PER)',  score:scorePER,    max:25, detail: detailPER },
            { label:'Tendance technique',  score:scoreTech,   max:25, detail: detailTech },
            { label:'Carnet d\'ordres',    score:scoreCarnet, max:20, detail: detailCarnet },
        ].map(c => `
            <div style="padding:12px 0;border-bottom:1px solid var(--border);">
                <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;">
                    <span style="flex:0 0 170px;font-size:0.88em;font-weight:600;color:var(--text);">${c.label}</span>
                    <div style="display:flex;align-items:center;gap:8px;flex:1;">
                        ${jauge(c.score, c.max, c.score/c.max > 0.65 ? 'var(--green)' : c.score/c.max > 0.4 ? '#d2a520' : 'var(--red)')}
                        <span class="mono" style="font-size:0.82em;color:var(--text2);white-space:nowrap;">${c.score}/${c.max}</span>
                    </div>
                </div>
                ${c.detail ? `<div style="font-size:0.78em;color:var(--text3);padding-left:4px;">${c.detail}</div>` : ''}
            </div>`).join('');

        const newsSign = scoreNews >= 0 ? '+' : '';
        const newsRows = newsItems.slice(0,6).map(n => {
            const ic = n.impact === 'positif' ? '🟢' : n.impact === 'negatif' ? '🔴' : '🟡';
            return `<div style="display:flex;gap:8px;padding:6px 0;border-bottom:1px solid var(--border);font-size:0.8em;">
                <span>${ic}</span>
                <span style="flex:1;color:var(--text2);">${n.titre}</span>
                <span style="color:var(--text3);white-space:nowrap;">${n.date || ''}</span>
            </div>`;
        }).join('');

        // Score circle
        const deg = (totalAvecNews / 100 * 360).toFixed(0);
        const circColor = totalAvecNews >= 68 ? 'var(--green)' : totalAvecNews >= 45 ? '#d2a520' : 'var(--red)';

        el.innerHTML = `
            <!-- VERDICT -->
            <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:16px;margin-bottom:24px;">
                <div>
                    <h3 style="font-size:1.15em;font-weight:700;margin-bottom:4px;">${nom} <span class="mono" style="font-size:0.75em;color:var(--text2);">${symbole}</span></h3>
                    ${pd ? `<span style="font-size:0.82em;color:var(--text2);">${SECTEURS_BVC?.[pd.secteur]?.emoji||''} ${pd.secteur}</span>` : ''}
                </div>
                <div style="background:${decBg};border:2px solid ${decColor};border-radius:14px;padding:16px 28px;text-align:center;min-width:180px;">
                    <div style="font-size:2em;margin-bottom:4px;">${decIcon}</div>
                    <div style="font-size:1.4em;font-weight:900;color:${decColor};letter-spacing:1px;">${decision}</div>
                    <div style="font-size:0.78em;color:var(--text2);margin-top:4px;">Score : <strong style="color:${circColor};">${totalAvecNews}/100</strong></div>
                </div>
            </div>

            <!-- CONSEIL -->
            <div style="padding:12px 16px;background:${decBg};border-left:3px solid ${decColor};border-radius:6px;font-size:0.88em;color:var(--text);margin-bottom:20px;">
                💬 <strong>Analyse :</strong> ${conseil}
            </div>

            <!-- CRITÈRES -->
            <div style="margin-bottom:20px;">
                <div style="font-weight:700;font-size:0.9em;margin-bottom:8px;color:var(--text2);">DÉTAIL DES CRITÈRES</div>
                ${criteresRows}
                <!-- Ligne news -->
                <div style="padding:12px 0;">
                    <div style="display:flex;align-items:center;gap:10px;">
                        <span style="flex:0 0 170px;font-size:0.88em;font-weight:600;color:var(--text);">Impact actualités</span>
                        <span class="mono" style="font-size:0.88em;color:${scoreNews>=0?'var(--green)':'var(--red)'};">${newsSign}${scoreNews} pts</span>
                    </div>
                </div>
            </div>

            <!-- ACTUALITÉS IMPACTANTES -->
            ${newsItems.length > 0 ? `
            <div style="margin-bottom:16px;">
                <div style="font-weight:700;font-size:0.9em;margin-bottom:8px;color:var(--text2);">ACTUALITÉS CLÉS INFLUENÇANT CE TITRE</div>
                <div style="background:var(--bg2);border-radius:8px;padding:8px 12px;">
                    ${newsRows}
                    ${newsItems.length > 6 ? `<div style="font-size:0.75em;color:var(--text3);padding-top:6px;">+ ${newsItems.length-6} autres actualités</div>` : ''}
                </div>
            </div>` : ''}

            <!-- DISCLAIMER -->
            <div style="margin-top:16px;padding:10px 14px;background:var(--bg3);border-radius:8px;font-size:0.75em;color:var(--text3);line-height:1.5;">
                ⚠️ <strong>Avertissement :</strong> Cette analyse est générée automatiquement à partir de données financières publiques et d'actualités. Elle ne constitue pas un conseil en investissement. Les performances passées ne préjugent pas des résultats futurs. Consultez un conseiller financier avant toute décision.
            </div>
            <div style="margin-top:6px;font-size:0.72em;color:var(--text3);">Analyse générée le ${new Date().toLocaleDateString('fr-FR',{day:'2-digit',month:'long',year:'numeric'})} · Données BVC & analystes</div>
        `;
    }

    // ── VARIATION TOUTES SOCIÉTÉS (1 SEMAINE) ──────────────────────────
    async chargerToutesVariations() {
        const el = document.getElementById('variation-content');
        if (!el) return;

        // Récupérer la liste des symboles avec codes BMCE
        const codes = (typeof CODES_BMCE_BY_SYMBOLE !== 'undefined') ? CODES_BMCE_BY_SYMBOLE : {};
        const symboles = Object.keys(codes);
        if (symboles.length === 0) {
            el.innerHTML = '<div class="empty-state"><p>Aucun code BMCE disponible.</p></div>';
            return;
        }

        el.innerHTML = `<div style="text-align:center;padding:40px;"><span class="loader"></span> Chargement des variations pour ${symboles.length} sociétés...<br><span id="variation-progress" style="font-size:0.85em;color:var(--text2);">0 / ${symboles.length}</span></div>`;

        const resultats = [];
        let done = 0;

        // Charger par lots de 5 pour ne pas surcharger le serveur
        for (let i = 0; i < symboles.length; i += 5) {
            const batch = symboles.slice(i, i + 5);
            const promises = batch.map(async sym => {
                try {
                    const r = await fetch(`api/bmce-detail-proxy.php?code=${codes[sym]}&tab=historique`);
                    const d = await r.json();
                    if (d.success && d.historique && d.historique.length > 0) {
                        // Filtrer pour 1 semaine max (5 séances de bourse)
                        const histo = d.historique.slice(0, 5);
                        const nom = (typeof COMPANY_NAMES !== 'undefined' && COMPANY_NAMES[sym]) || sym;
                        const dernierCours = histo[0]?.dernier || null;
                        const premierCours = histo[histo.length - 1]?.dernier || null;
                        const varSemaine = (dernierCours && premierCours && premierCours > 0)
                            ? ((dernierCours - premierCours) / premierCours * 100) : null;
                        resultats.push({
                            symbole: sym, nom, histo, dernierCours, varSemaine,
                            stats: d.stats || {}
                        });
                    }
                } catch(e) { /* skip */ }
                done++;
                const prog = document.getElementById('variation-progress');
                if (prog) prog.textContent = `${done} / ${symboles.length}`;
            });
            await Promise.all(promises);
        }

        // Trier par variation décroissante
        resultats.sort((a, b) => (b.varSemaine || 0) - (a.varSemaine || 0));

        // Rendre le tableau
        let html = `<div style="margin-bottom:14px;font-size:0.95em;font-weight:600;">${resultats.length} sociétés — Variation sur 1 semaine</div>`;
        html += '<div class="table-wrap"><table><thead><tr><th>Société / Ticker</th><th>Dernier cours</th><th>Var. semaine</th><th>Séances</th></tr></thead><tbody>';
        resultats.forEach(r => {
            const vc = (r.varSemaine || 0) > 0 ? 'up' : (r.varSemaine || 0) < 0 ? 'down' : 'neutral';
            const vs = (r.varSemaine || 0) > 0 ? '+' : '';
            html += `<tr style="cursor:pointer;" onclick="document.getElementById('analyse-societe').value='${r.symbole}';analyseManager.changerSociete('${r.symbole}')">`;
            html += `<td><strong>${r.nom}</strong><br><span class="mono" style="font-size:0.8em;color:var(--text2);">${r.symbole}</span></td>`;
            html += `<td class="mono">${r.dernierCours ? r.dernierCours.toLocaleString('fr-FR') + ' MAD' : '—'}</td>`;
            html += `<td class="mono ${vc}" style="font-weight:600;">${r.varSemaine != null ? vs + r.varSemaine.toFixed(2) + '%' : '—'}</td>`;
            html += `<td class="mono" style="color:var(--text2);">${r.histo.length}</td>`;
            html += `</tr>`;
        });
        html += '</tbody></table></div>';
        html += `<div style="margin-top:10px;font-size:0.8em;color:var(--text3);">Source: BMCE Capital Bourse · ${new Date().toLocaleString('fr-FR')} · Cliquez sur une ligne pour voir le détail</div>`;
        el.innerHTML = html;
    }

    // ── GRAPHIQUE DE COURS ────────────────────────────────────────────────
    async chargerGraphique(symbole, bmceCode) {
        const el = document.getElementById('graphique-content');
        if (!el) return;
        el.innerHTML = '<div style="text-align:center;padding:40px;"><span class="loader"></span> Chargement du graphique…</div>';
        if (!bmceCode) { el.innerHTML = '<div class="empty-state"><div class="icon">📈</div><p>Code BMCE introuvable pour cette société.</p></div>'; return; }
        try {
            const r = await fetch(`api/bmce-detail-proxy.php?code=${bmceCode}&tab=historique`);
            const d = await r.json();
            if (d.success && d.historique && d.historique.length > 0) {
                this._buildChart(el, symbole, [...d.historique].reverse());
                return;
            }
            // Fallback: try graphique tab
            const r2 = await fetch(`api/bmce-detail-proxy.php?code=${bmceCode}&tab=graphique`);
            const d2 = await r2.json();
            if (d2.success && d2.series && d2.series.length > 0) {
                this._buildChartSeries(el, symbole, d2.series);
            } else {
                el.innerHTML = '<div class="empty-state"><div class="icon">📈</div><p>Aucune donnée disponible pour le graphique.</p></div>';
            }
        } catch(e) { el.innerHTML = `<div class="empty-state"><div class="icon">❌</div><p>Erreur : ${e.message}</p></div>`; }
    }

    _buildChart(container, symbole, data) {
        const nom    = (typeof COMPANY_NAMES !== 'undefined' && COMPANY_NAMES[symbole]) || symbole;
        const labels = data.map(d => d.date);
        const values = data.map(d => d.dernier).filter(v => v != null);
        this._drawChart(container, nom, labels, values);
    }

    _buildChartSeries(container, symbole, series) {
        const nom    = (typeof COMPANY_NAMES !== 'undefined' && COMPANY_NAMES[symbole]) || symbole;
        const labels = series.map(d => d.date);
        const values = series.map(d => d.cours);
        this._drawChart(container, nom, labels, values);
    }

    _drawChart(container, nom, labels, values) {
        if (typeof Chart === 'undefined') {
            container.innerHTML = '<div class="empty-state"><div class="icon">⚠️</div><p>Chart.js non disponible. Vérifiez votre connexion internet.</p></div>';
            return;
        }
        if (this.chartInstance) { this.chartInstance.destroy(); this.chartInstance = null; }

        const isUp    = values.length > 1 && values[values.length - 1] >= values[0];
        const color   = isUp ? '#3fb950' : '#f85149';
        const colorBg = isUp ? 'rgba(63,185,80,0.08)' : 'rgba(248,81,73,0.08)';

        container.innerHTML = `
            <div style="margin-bottom:10px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;">
                <strong style="font-size:1.05em;">${nom} — Graphique de cours</strong>
                ${values.length > 0 ? `<span class="mono" style="font-size:0.88em;color:var(--text2);">${values.length} séances · ${values[values.length-1].toLocaleString('fr-FR')} MAD</span>` : ''}
            </div>
            <div class="chart-wrapper"><canvas id="canvas-cours"></canvas></div>
            <div style="margin-top:10px;font-size:0.8em;color:var(--text3);">Source: BMCE Capital Bourse · ${new Date().toLocaleString('fr-FR')}</div>`;

        const canvas = document.getElementById('canvas-cours');
        if (!canvas) return;

        this.chartInstance = new Chart(canvas, {
            type: 'line',
            data: {
                labels,
                datasets: [{
                    label: `${nom} (MAD)`,
                    data: values,
                    borderColor: color,
                    backgroundColor: colorBg,
                    borderWidth: 2,
                    pointRadius: labels.length > 20 ? 0 : 3,
                    pointHoverRadius: 5,
                    fill: true,
                    tension: 0.25,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: { mode: 'index', intersect: false },
                plugins: {
                    legend: { labels: { color: '#8b949e', font: { family: 'Outfit', size: 12 } } },
                    tooltip: { callbacks: { label: ctx => `${ctx.parsed.y.toLocaleString('fr-FR')} MAD` } }
                },
                scales: {
                    x: { ticks: { color: '#8b949e', maxTicksLimit: 10, font: { size: 11 } }, grid: { color: '#21262d' } },
                    y: { ticks: { color: '#8b949e', callback: v => v.toLocaleString('fr-FR'), font: { size: 11 } }, grid: { color: '#21262d' } }
                }
            }
        });
    }

    // ── ACCÈS RAPIDE AUX FICHES SOCIÉTÉS ────────────────────────────────
    ouvrirFicheSociete() {
        const sel = document.getElementById('analyses-societe-quick');
        if (!sel || !sel.value) return;
        const symbole = sel.value;
        const nom     = (typeof COMPANY_NAMES !== 'undefined' && COMPANY_NAMES[symbole]) || symbole;
        const bmce    = this.getBMCECode(symbole);

        const linksDiv = document.getElementById('analyses-quick-links');
        const btnsDiv  = document.getElementById('analyses-quick-btns');
        if (!linksDiv || !btnsDiv) return;

        const links = [
            { label:'🏦 BMCE Capital',       url: bmce ? `https://www.bmcecapitalbourse.com/bkbbourse/details/${bmce}` : 'https://www.bmcecapitalbourse.com', cls:'btn-primary' },
            { label:'🏛️ Casablanca Bourse', url: `https://www.casablanca-bourse.com/bourseweb/Societe-Cote.aspx?codeValeur=${symbole}`, cls:'btn-ghost' },
            { label:'📈 Bourse-Valeurs',     url: `https://www.bourse-valeurs.ma/ticker/${symbole}`,                                      cls:'btn-ghost' },
            { label:'🌍 Investing.com',      url: `https://fr.investing.com/search/?q=${encodeURIComponent(nom)}`,                         cls:'btn-ghost' },
            { label:'📉 TradingView',        url: `https://www.tradingview.com/symbols/XCAS-${symbole}/`,                                  cls:'btn-ghost' },
        ];

        btnsDiv.innerHTML = links.map(l =>
            `<a href="${l.url}" target="_blank" class="btn ${l.cls} btn-sm">${l.label}</a>`
        ).join('');
        linksDiv.style.display = 'block';
    }

    // ── RAPPORTS FINANCIERS ───────────────────────────────────────────────
    _getRapportsKey(symbole) { return `rapports_${symbole}`; }

    _getRapports(symbole) {
        try {
            const raw = localStorage.getItem(this._getRapportsKey(symbole));
            return raw ? JSON.parse(raw) : { '2026': [], '2025': [], '2024': [] };
        } catch(e) { return { '2026': [], '2025': [], '2024': [] }; }
    }

    _saveRapports(symbole, data) {
        localStorage.setItem(this._getRapportsKey(symbole), JSON.stringify(data));
    }

    renderRapports(symbole) {
        const el = document.getElementById('rapports-content');
        if (!el) return;
        if (!symbole) {
            el.innerHTML = '<div class="empty-state"><div class="icon">📄</div><p>Sélectionnez une société pour gérer ses rapports.</p></div>';
            return;
        }
        const nom  = (typeof COMPANY_NAMES !== 'undefined' && COMPANY_NAMES[symbole]) || symbole;
        const data = this._getRapports(symbole);
        const years = ['2026', '2025', '2024'];

        const yearBlocks = years.map(yr => {
            const files = data[yr] || [];
            const fileList = files.length > 0
                ? files.map((f, i) => `
                    <div style="display:flex;align-items:center;gap:10px;padding:8px 12px;
                        background:var(--bg3);border-radius:6px;border:1px solid var(--border);margin-bottom:6px;">
                        <span style="font-size:1.1em;flex-shrink:0;">📄</span>
                        <div style="flex:1;min-width:0;">
                            <div style="font-size:0.88em;font-weight:600;color:var(--text);
                                overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${f.name}</div>
                            <div style="font-size:0.75em;color:var(--text3);">Ajouté le ${f.date}</div>
                        </div>
                        <button onclick="analyseManager._supprimerRapport('${symbole}','${yr}',${i})"
                            style="background:none;border:1px solid rgba(248,81,73,0.3);color:var(--red);
                                cursor:pointer;border-radius:6px;padding:3px 9px;font-size:0.78em;flex-shrink:0;
                                transition:all 0.15s;"
                            onmouseover="this.style.background='rgba(248,81,73,0.1)'"
                            onmouseout="this.style.background='none'">🗑️</button>
                    </div>`).join('')
                : `<div style="font-size:0.82em;color:var(--text3);padding:8px 0;">Aucun rapport pour cette année.</div>`;

            return `
            <div style="margin-bottom:20px;">
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
                    <div style="display:flex;align-items:center;gap:8px;">
                        <span style="background:var(--accent2);color:#fff;font-size:0.7em;font-weight:700;
                            padding:2px 10px;border-radius:20px;">${yr}</span>
                        <span style="font-size:0.9em;font-weight:600;color:var(--text);">
                            ${files.length > 0 ? files.length + ' rapport(s)' : 'Aucun rapport'}
                        </span>
                    </div>
                    <label style="cursor:pointer;">
                        <input type="file" accept=".pdf,.xlsx,.xls,.doc,.docx,.csv,.ppt,.pptx"
                            multiple style="display:none;"
                            onchange="analyseManager._ajouterRapports('${symbole}','${yr}',this)">
                        <span style="display:inline-flex;align-items:center;gap:5px;
                            padding:5px 12px;border-radius:6px;border:1px solid var(--border);
                            background:var(--bg3);color:var(--text2);font-size:0.82em;font-weight:500;
                            cursor:pointer;transition:all 0.15s;"
                            onmouseover="this.style.borderColor='var(--accent)';this.style.color='var(--text)'"
                            onmouseout="this.style.borderColor='var(--border)';this.style.color='var(--text2)'">
                            ➕ Ajouter rapport
                        </span>
                    </label>
                </div>
                <div id="rapports-list-${symbole}-${yr}">${fileList}</div>
            </div>`;
        }).join('<hr style="border:none;border-top:1px solid var(--border);margin:4px 0 20px;">');

        el.innerHTML = `
        <div class="panel">
            <div class="panel-title" style="margin-bottom:20px;">
                📄 Rapports financiers — <span style="color:var(--accent);">${nom}</span>
                <span class="mono" style="font-size:0.75em;color:var(--text3);margin-left:6px;">${symbole}</span>
            </div>
            <div style="font-size:0.82em;color:var(--text3);margin-bottom:18px;padding:10px 14px;
                background:var(--bg3);border-radius:8px;border-left:3px solid var(--accent);">
                📌 Les fichiers ne sont pas stockés sur le serveur — seuls les noms et dates sont sauvegardés localement dans votre navigateur (localStorage).
            </div>
            ${yearBlocks}
        </div>`;
    }

    _ajouterRapports(symbole, year, input) {
        if (!input.files || input.files.length === 0) return;
        const data = this._getRapports(symbole);
        if (!data[year]) data[year] = [];
        const today = new Date().toLocaleDateString('fr-FR', { day:'2-digit', month:'2-digit', year:'numeric' });
        Array.from(input.files).forEach(f => {
            data[year].push({ name: f.name, date: today, size: f.size });
        });
        this._saveRapports(symbole, data);
        this.renderRapports(symbole);
    }

    _supprimerRapport(symbole, year, idx) {
        const data = this._getRapports(symbole);
        if (!data[year] || idx < 0 || idx >= data[year].length) return;
        const name = data[year][idx].name;
        if (!confirm(`🗑️ Supprimer "${name}" de la liste ?`)) return;
        data[year].splice(idx, 1);
        this._saveRapports(symbole, data);
        this.renderRapports(symbole);
    }
}


// AnalyseManager class defined above; instantiated in index.html inline script

// ════════════════════════════════════════════════════════════════
//  GESTIONNAIRE DES TRANSACTIONS EN COURS
// ════════════════════════════════════════════════════════════════
const pendingManager = {
    _validatingId : null,
    STORAGE_KEY   : 'portfolio_pending_tx',

    load()         { try { return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]'); } catch { return []; } },
    save(items)    { localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items)); },

    add(data) {
        const items = this.load();
        items.unshift({
            id          : Date.now().toString(36) + Math.random().toString(36).slice(2),
            symbole     : data.symbole,
            nom         : data.nom || data.symbole,
            quantite    : parseFloat(data.quantite)  || 0,
            prixCible   : parseFloat(data.prixCible)  || 0,
            frais       : parseFloat(data.frais)      || 0,
            dateEstimee : data.dateEstimee || '',
            note        : data.note        || '',
            createdAt   : new Date().toISOString(),
        });
        this.save(items);
        this.render();
    },

    remove(id) {
        if (!confirm('Supprimer cette transaction en cours ?')) return;
        this.save(this.load().filter(i => i.id !== id));
        this.render();
    },

    // Lance la validation : ouvre le modal principal pré-rempli
    valider(id) {
        const item = this.load().find(i => i.id === id);
        if (!item) return;
        this._validatingId = id;
        if (typeof ouvrirModalTransaction === 'function') ouvrirModalTransaction(item.symbole, item.prixCible || undefined);
        setTimeout(() => {
            const qty  = document.getElementById('quantity');
            const buy  = document.getElementById('buyPrice');
            const fees = document.getElementById('fees');
            if (qty  && item.quantite)  qty.value  = item.quantite;
            if (buy  && item.prixCible) buy.value  = item.prixCible;
            if (fees && item.frais)     fees.value = item.frais;
            if (buy) { buy.focus(); buy.select(); }
        }, 200);
    },

    // Appelé par setupEvents() après addStock() réussi
    onTransactionAdded() {
        if (!this._validatingId) return;
        const id = this._validatingId;
        this._validatingId = null;
        this.save(this.load().filter(i => i.id !== id));
        this.render();
    },

    render() {
        const container = document.getElementById('pending-list');
        const badge     = document.getElementById('pending-count-badge');
        if (!container) return;
        const items = this.load();

        if (badge) { badge.textContent = items.length; badge.style.display = items.length > 0 ? 'inline-flex' : 'none'; }

        if (items.length === 0) {
            container.innerHTML = `<div style="text-align:center;color:var(--text3);padding:18px;
                font-size:0.85em;background:var(--bg2);border-radius:var(--radius);
                border:1px dashed var(--border);">
                Aucune transaction en cours — cliquez <strong>➕ Ajouter en cours</strong>
            </div>`;
            return;
        }

        const rows = items.map(item => {
            const nom = (typeof COMPANY_NAMES !== 'undefined' && COMPANY_NAMES[item.symbole]) || item.nom || item.symbole;
            const px  = item.prixCible  ? fmtMAD(item.prixCible) + ' MAD' : '—';
            const fr  = item.frais      ? fmtMAD(item.frais)     + ' MAD' : '—';
            const dt  = item.dateEstimee
                ? new Date(item.dateEstimee).toLocaleDateString('fr-FR', {day:'2-digit',month:'2-digit',year:'numeric'})
                : '—';
            return `<tr style="border-bottom:1px solid var(--border);">
                <td style="padding:9px 12px;font-weight:600;white-space:nowrap;">${nom}</td>
                <td style="padding:9px 6px;color:var(--text3);font-family:'JetBrains Mono',monospace;font-size:0.8em;">${item.symbole}</td>
                <td style="padding:9px 6px;font-family:'JetBrains Mono',monospace;text-align:right;">${item.quantite}</td>
                <td style="padding:9px 6px;font-family:'JetBrains Mono',monospace;text-align:right;">${px}</td>
                <td style="padding:9px 6px;font-family:'JetBrains Mono',monospace;text-align:right;color:var(--text3);">${fr}</td>
                <td style="padding:9px 6px;text-align:center;color:var(--text3);font-size:0.85em;">${dt}</td>
                <td style="padding:9px 6px;color:var(--text3);font-size:0.82em;max-width:150px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;"
                    title="${item.note || ''}">${item.note || '—'}</td>
                <td style="padding:9px 12px;text-align:center;white-space:nowrap;">
                    <button onclick="pendingManager.valider('${item.id}')" title="Transaction passée → ajouter au portefeuille"
                        style="background:rgba(63,185,80,0.15);border:1px solid #3fb950;border-radius:5px;
                               color:#3fb950;cursor:pointer;font-size:0.8em;padding:4px 9px;font-weight:600;margin-right:4px;"
                        onmouseover="this.style.background='rgba(63,185,80,0.3)'"
                        onmouseout="this.style.background='rgba(63,185,80,0.15)'">✅ Valider</button>
                    <button onclick="pendingManager.remove('${item.id}')" title="Supprimer"
                        style="background:rgba(248,81,73,0.12);border:1px solid #f85149;border-radius:5px;
                               color:#f85149;cursor:pointer;font-size:0.8em;padding:4px 8px;"
                        onmouseover="this.style.background='rgba(248,81,73,0.28)'"
                        onmouseout="this.style.background='rgba(248,81,73,0.12)'">🗑️</button>
                </td>
            </tr>`;
        }).join('');

        container.innerHTML = `<div class="table-wrap">
            <table style="width:100%;border-collapse:collapse;font-size:0.87em;">
                <thead>
                    <tr style="background:var(--bg3);color:var(--text3);font-size:0.76em;
                                text-transform:uppercase;letter-spacing:0.05em;">
                        <th style="padding:8px 12px;text-align:left;">Société</th>
                        <th style="padding:8px 6px;text-align:left;">Ticker</th>
                        <th style="padding:8px 6px;text-align:right;">Qté</th>
                        <th style="padding:8px 6px;text-align:right;">Prix cible</th>
                        <th style="padding:8px 6px;text-align:right;">Frais</th>
                        <th style="padding:8px 6px;text-align:center;">Date est.</th>
                        <th style="padding:8px 6px;text-align:left;">Note</th>
                        <th style="padding:8px 12px;text-align:center;">Actions</th>
                    </tr>
                </thead>
                <tbody>${rows}</tbody>
            </table>
        </div>`;
    },

    ouvrirModal() {
        const modal = document.getElementById('modal-pending-tx');
        if (!modal) return;
        // Peupler le select sociétés depuis COMPANY_NAMES
        const sel = document.getElementById('pending-form-symbole');
        if (sel && sel.options.length <= 1 && typeof COMPANY_NAMES !== 'undefined') {
            const sorted = Object.entries(COMPANY_NAMES).sort((a, b) => a[1].localeCompare(b[1], 'fr'));
            sorted.forEach(([sym, nom]) => {
                const o = document.createElement('option');
                o.value = sym; o.textContent = nom + ' (' + sym + ')';
                sel.appendChild(o);
            });
        }
        modal.classList.add('active');
        setTimeout(() => document.getElementById('pending-form-symbole')?.focus(), 100);
    },

    fermerModal() {
        document.getElementById('modal-pending-tx')?.classList.remove('active');
        document.getElementById('form-pending-tx')?.reset();
    },

    soumettre() {
        const symbole = document.getElementById('pending-form-symbole').value;
        if (!symbole) { alert('Sélectionnez une société'); return; }
        const quantite = parseFloat(document.getElementById('pending-form-qty').value);
        if (!quantite || quantite <= 0) { alert('Quantité invalide'); return; }
        this.add({
            symbole,
            nom         : (typeof COMPANY_NAMES !== 'undefined' && COMPANY_NAMES[symbole]) || symbole,
            quantite,
            prixCible   : parseFloat(document.getElementById('pending-form-prix').value)  || 0,
            frais       : parseFloat(document.getElementById('pending-form-frais').value) || 0,
            dateEstimee : document.getElementById('pending-form-date').value  || '',
            note        : document.getElementById('pending-form-note').value.trim() || '',
        });
        this.fermerModal();
    },

    init() { this.render(); },
};

// ============================================
// INITIALISATION
// ============================================
const portfolioManager = new PortfolioManager();

// ── Helper console : purger une entrée d'historique par date ─────────────────
// Usage dans la console : purgerEntreeHistorique('21/04/2026')
function purgerEntreeHistorique(date) {
    let h = JSON.parse(localStorage.getItem('portfolio_history') || '[]');
    const avant = h.length;
    h = h.filter(e => e.date !== date);
    localStorage.setItem('portfolio_history', JSON.stringify(h));
    const supprimees = avant - h.length;
    console.log(supprimees > 0
        ? `✅ ${supprimees} entrée(s) supprimée(s) pour le ${date}. Rechargez la page.`
        : `⚠️ Aucune entrée trouvée pour le ${date}.`);
    return h;
}

// ── Séance BVC : lun-ven 09h30–15h30 heure locale (PC en heure Maroc UTC+1) ──
function isSeanceOuverte() {
    const now = new Date();                              // heure locale du PC
    const jour = now.getDay();                           // 0=dim, 6=sam
    if (jour === 0 || jour === 6) return false;
    const minutes = now.getHours() * 60 + now.getMinutes();
    return minutes >= 9 * 60 + 30 && minutes < 15 * 60 + 30;
}

function majIndicateurSeance() {
    const dot   = document.getElementById('seance-dot');
    const label = document.getElementById('seance-label');
    if (!dot || !label) return;
    if (isSeanceOuverte()) {
        dot.style.background  = '#dc3232';
        dot.style.animation   = 'liveBlink 1.4s ease-in-out infinite';
        label.textContent     = 'EN DIRECT';
        label.style.color     = '#dc3232';
    } else {
        dot.style.background  = '#555';
        dot.style.animation   = 'none';
        label.textContent     = 'SÉANCE FERMÉE';
        label.style.color     = 'var(--text3)';
    }
}
// Mettre à jour l'indicateur au chargement et toutes les minutes
document.addEventListener('DOMContentLoaded', () => {
    majIndicateurSeance();
    setInterval(majIndicateurSeance, 60 * 1000);
});

// Actualisation automatique des cours toutes les 5 min en séance uniquement
setInterval(() => {
    if (!isSeanceOuverte()) {
        console.log('⏸️ Séance BVC fermée — mise à jour suspendue.');
        return;
    }
    console.log('🔄 Auto-refresh des cours (séance ouverte)...');
    portfolioManager.refreshSocietesCotees();
}, 5 * 60 * 1000);

// Vérification des alertes par tag toutes les 5 min (per-transaction, 1 email/jour/tx)
setInterval(() => {
    if (typeof portfolioManager !== 'undefined') {
        portfolioManager.checkAlertesTag();
    }
}, 5 * 60 * 1000);

// Nettoyage unique des anciennes alertes perso (remplacées par les alertes par tag)
(function purgeOldAlerts() {
    localStorage.removeItem('portfolio_alertes_perso_v1');
    // Supprimer les anciennes clés "alertes_suivi_ligne_*"
    Object.keys(localStorage)
        .filter(k => k.startsWith('alertes_suivi_ligne_'))
        .forEach(k => localStorage.removeItem(k));
})();

// Vérification initiale des alertes au chargement (après 4 secondes)
setTimeout(() => {
    if (typeof portfolioManager !== 'undefined') {
        portfolioManager.checkAlertesTag();
    }
}, 4000);

const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
`;
document.head.appendChild(style);

// ============================================================
// GESTIONNAIRE D'ACTUALITÉS (RSS via news-proxy.php)
// ============================================================
const newsManager = {
    _type:    'marches',
    _loading: false,

    switchType(type) {
        this._type = type;
        // Activer/désactiver les boutons
        ['marches','bourse','monde','tendances'].forEach(t => {
            const btn = document.getElementById('news-tab-' + t);
            if (!btn) return;
            btn.className = t === type
                ? 'btn btn-primary btn-sm'
                : 'btn btn-ghost btn-sm';
        });
        this.load();
    },

    reload() {
        this.load();
    },

    async load() {
        if (this._loading) return;
        this._loading = true;
        const el = document.getElementById('news-content');
        if (!el) { this._loading = false; return; }

        el.innerHTML = `<div style="text-align:center;padding:50px;color:var(--text2);">
            <div class="loader"></div><br>Chargement des actualités…</div>`;

        try {
            const r = await fetch(`api/news-articles.php?type=${this._type}&_=${Date.now()}`);
            const d = await r.json();
            if (!d.success || !d.articles || d.articles.length === 0) {
                el.innerHTML = `<div class="empty-state"><div class="icon">📭</div>
                    <p>Aucune actualité disponible pour le moment.<br>
                    <span style="font-size:0.85em;color:var(--text3);">Vérifiez votre connexion ou réessayez dans quelques minutes.</span></p></div>`;
                this._loading = false;
                return;
            }
            this._render(el, d.articles);
            const upd = document.getElementById('news-last-update');
            if (upd) upd.textContent = '🕒 Mis à jour : ' + new Date().toLocaleString('fr-FR', {
                day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit'
            });
        } catch(e) {
            el.innerHTML = `<div class="empty-state"><div class="icon">⚠️</div>
                <p>Erreur de chargement des actualités.<br>
                <span style="font-size:0.85em;color:var(--text3);">${e.message}</span></p></div>`;
        }
        this._loading = false;
    },

    _render(el, articles) {
        const sourceColors = {
            // ── BVC / Maroc ──────────────────────────────
            '🇲🇦 BourseNews Marchés': '#0d7a3e',
            'BourseNews':         '#1f6feb',
            'LeBOURSIER':         '#58a6ff',
            'InfoMédiaire':       '#3fb950',
            'LesEco':             '#f0883e',
            'Médias24 Éco':       '#a371f7',
            'Challenge':          '#d2a520',
            "L'Économiste":       '#e36209',
            // ── Marchés Mondiaux ─────────────────────────
            'Reuters':            '#e36209',
            'CNBC Markets':       '#1f6feb',
            'MarketWatch':        '#3fb950',
            'Investing.com':      '#f85149',
            'Les Echos':          '#a371f7',
            'BBC Business':       '#d29922',
            // ── Tendances ────────────────────────────────
            'Pétrole · Google News':    '#f0883e',
            'Or · Google News':         '#d2a520',
            'Minéraux · Google News':   '#3fb950',
            'Bourses Mondiales':        '#58a6ff',
            'Économie Mondiale':        '#a371f7',
            'Maroc Finance':            '#1f6feb',
        };

        // Source initials for the image placeholder
        const sourceInitials = src => {
            if (!src) return '?';
            const words = src.replace(/[^a-zA-ZÀ-ÿ0-9 ]/g,' ').trim().split(/\s+/);
            if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
            return src.substring(0,2).toUpperCase();
        };

        const rows = articles.map((a, i) => {
            const color = sourceColors[a.source] || '#58a6ff';
            const date  = a.date ? (() => {
                try {
                    const d = new Date(a.date);
                    const now = new Date();
                    const diff = Math.floor((now - d) / 60000); // minutes
                    const exactDate = d.toLocaleDateString('fr-FR', { day:'2-digit', month:'2-digit', year:'numeric' });
                    const exactTime = d.toLocaleTimeString('fr-FR', { hour:'2-digit', minute:'2-digit' });
                    const exact = `${exactDate} à ${exactTime}`;
                    if (diff < 60)   return `il y a ${diff} min · ${exact}`;
                    if (diff < 1440) return `il y a ${Math.floor(diff/60)}h · ${exact}`;
                    return exact;
                } catch(e) { return ''; }
            })() : '';

            // Image: use article image if provided, otherwise colored initials block
            const imgHtml = a.image
                ? `<img src="${a.image}" alt="" loading="lazy" onerror="this.style.display='none';this.nextSibling.style.display='flex';"
                       style="flex-shrink:0;width:48px;height:48px;object-fit:cover;border-radius:8px;border:1px solid var(--border);">
                   <span style="display:none;flex-shrink:0;width:48px;height:48px;border-radius:8px;
                       background:${color}22;border:1px solid ${color}44;
                       align-items:center;justify-content:center;font-size:1em;font-weight:800;color:${color};">
                       ${sourceInitials(a.source)}</span>`
                : `<span style="flex-shrink:0;width:48px;height:48px;border-radius:8px;
                       background:${color}22;border:1px solid ${color}44;
                       display:flex;align-items:center;justify-content:center;
                       font-size:1em;font-weight:800;color:${color};">
                       ${sourceInitials(a.source)}</span>`;

            return `
            <a href="${a.link}" target="_blank" rel="noopener noreferrer"
               style="display:flex;align-items:center;gap:14px;padding:12px 16px;
                      border-bottom:1px solid var(--border);text-decoration:none;color:inherit;
                      transition:background 0.15s;"
               onmouseover="this.style.background='var(--bg3)'"
               onmouseout="this.style.background='transparent'">
                ${imgHtml}
                <div style="flex:1;min-width:0;">
                    <div style="font-size:0.92em;font-weight:600;line-height:1.4;color:var(--text);
                        overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;">${a.title}</div>
                    <div style="margin-top:5px;display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
                        <span style="font-size:0.72em;font-weight:600;padding:2px 8px;border-radius:20px;
                                     background:${color}20;color:${color};white-space:nowrap;">${a.source}</span>
                        ${date ? `<span style="font-size:0.72em;color:var(--text3);white-space:nowrap;">${date}</span>` : ''}
                    </div>
                </div>
            </a>`;
        }).join('');

        el.innerHTML = `
            <div style="background:var(--bg2);border:1px solid var(--border);border-radius:10px;overflow:hidden;">
                ${rows}
            </div>
            <p style="margin-top:10px;font-size:0.75em;color:var(--text3);text-align:right;">
                ${articles.length} articles · Sources RSS publiques
            </p>`;
    }
};

// ── TICKER TAPE — Actualités défilantes ──────────────────────────────────
function initTickerTape() {
    const el       = document.getElementById('ticker-inner');
    const tape     = document.getElementById('ticker-tape');
    const dotEl    = document.getElementById('ticker-dot');
    const progress = null; // barre de progression supprimée
    if (!el || typeof TICKER_NEWS === 'undefined') return;

    // Filtrer : uniquement les news d'aujourd'hui
    const todayStr = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const items = TICKER_NEWS.filter(n => n.isoDate && n.isoDate === todayStr);

    if (items.length === 0) { if (tape) tape.style.display = 'none'; return; }

    const DISPLAY_MS = 9000;  // 9s de lecture par actu
    const SLIDE_MS   = 320;   // 320ms pour le glissement rapide
    let idx = 0;
    let timer = null;

    // overflow:hidden sur le conteneur parent pour masquer le slide
    if (tape) tape.style.overflow = 'hidden';

    const fmt = iso => new Date(iso).toLocaleDateString('fr-FR', { day:'2-digit', month:'short' });

    let paused = false;

    function showItem(i, fromRight = true) {
        const n     = items[i];
        const color = n.impact === 'positif' ? 'var(--green)' : n.impact === 'negatif' ? 'var(--red)' : '#d2a520';
        const icon  = n.impact === 'positif' ? '▲' : n.impact === 'negatif' ? '▼' : '●';

        // Point indicateur coloré
        if (dotEl) { dotEl.style.background = color; dotEl.style.boxShadow = `0 0 8px ${color}`; }

        // Contenu centré
        el.innerHTML = `
            <span style="font-size:1.05em;color:${color};">${icon}</span>
            <span style="font-size:0.9em;font-weight:700;color:var(--text);line-height:1.3;">${n.texte}</span>
            <span style="
                font-size:0.72em;font-weight:600;color:var(--accent);
                border:1px solid var(--accent);border-radius:20px;
                padding:2px 9px;white-space:nowrap;
                letter-spacing:0.03em;">ℹ lire +</span>
            <span style="font-size:0.75em;color:var(--text3);background:var(--bg3);
                         padding:2px 8px;border-radius:12px;white-space:nowrap;">${fmt(n.isoDate)}</span>
            <span style="font-size:0.7em;color:var(--text3);white-space:nowrap;opacity:0.6;">${i+1}/${items.length}</span>`;

        // Entrée : glisse depuis la droite (ou gauche si retour)
        el.style.transition = 'none';
        el.style.transform = fromRight ? 'translateX(120%)' : 'translateX(-120%)';
        el.style.opacity = '0';
        requestAnimationFrame(() => requestAnimationFrame(() => {
            el.style.transition = `transform ${SLIDE_MS}ms cubic-bezier(0.25,0.8,0.25,1), opacity ${SLIDE_MS}ms ease`;
            el.style.transform  = 'translateX(0)';
            el.style.opacity    = '1';
        }));

        // Sortie : glisse rapidement vers la gauche, puis actu suivante entre par la droite
        clearTimeout(timer);
        timer = setTimeout(() => {
            if (paused) return; // ne pas avancer si modal ouvert
            el.style.transition = `transform ${SLIDE_MS}ms cubic-bezier(0.55,0,1,0.45), opacity ${SLIDE_MS}ms ease`;
            el.style.transform  = 'translateX(-120%)';
            el.style.opacity    = '0';
            setTimeout(() => { idx = (idx + 1) % items.length; showItem(idx, true); }, SLIDE_MS + 60);
        }, DISPLAY_MS);
    }

    // Clic pour ouvrir le détail
    el.addEventListener('click', () => {
        paused = true;
        clearTimeout(timer);
        openNewsModal(items, idx, () => {
            paused = false;
            idx = (idx + 1) % items.length;
            showItem(idx, true);
        });
    });

    showItem(0, true);
}
document.addEventListener('DOMContentLoaded', initTickerTape);

// ── Modal détail actualité ────────────────────────────────────────────────
let _newsModalItems = [];
let _newsModalIdx   = 0;
let _newsModalOnClose = null;

function openNewsModal(items, idx, onClose) {
    _newsModalItems   = items;
    _newsModalIdx     = idx;
    _newsModalOnClose = onClose;
    _renderNewsModal();
    document.getElementById('modal-news-overlay').style.display = 'block';
    document.getElementById('modal-news').style.display = 'block';
}

function closeNewsModal() {
    document.getElementById('modal-news-overlay').style.display = 'none';
    document.getElementById('modal-news').style.display = 'none';
    if (_newsModalOnClose) _newsModalOnClose();
    _newsModalOnClose = null;
}

function newsModalNav(dir) {
    _newsModalIdx = (_newsModalIdx + dir + _newsModalItems.length) % _newsModalItems.length;
    _renderNewsModal();
}

function _renderNewsModal() {
    const n      = _newsModalItems[_newsModalIdx];
    const color  = n.impact === 'positif' ? 'var(--green)' : n.impact === 'negatif' ? 'var(--red)' : '#d2a520';
    const icon   = n.impact === 'positif' ? '▲' : n.impact === 'negatif' ? '▼' : '●';
    const label  = n.impact === 'positif' ? 'POSITIF' : n.impact === 'negatif' ? 'NÉGATIF' : 'NEUTRE';
    const bgBadge = n.impact === 'positif' ? 'var(--green)' : n.impact === 'negatif' ? 'var(--red)' : '#d2a520';
    const fmt    = iso => new Date(iso).toLocaleDateString('fr-FR', { weekday:'long', day:'2-digit', month:'long', year:'numeric' });

    document.getElementById('news-modal-bar').style.background    = color;
    document.getElementById('news-modal-icon').textContent         = icon;
    document.getElementById('news-modal-icon').style.color         = color;
    document.getElementById('news-modal-date').textContent         = fmt(n.isoDate);
    document.getElementById('news-modal-badge').textContent        = label;
    document.getElementById('news-modal-badge').style.background   = bgBadge;
    document.getElementById('news-modal-badge').style.color        = n.impact === 'neutre' ? '#000' : '#fff';
    document.getElementById('news-modal-titre').textContent        = n.texte;
    document.getElementById('news-modal-detail').textContent       = n.detail || 'Aucun détail disponible pour cette actualité.';
    document.getElementById('news-modal-counter').textContent      = `${_newsModalIdx + 1} / ${_newsModalItems.length}`;

    // Sociétés concernées
    const socDiv  = document.getElementById('news-modal-societes');
    const socList = document.getElementById('news-modal-societes-list');
    if (n.societes && n.societes.length > 0) {
        socDiv.style.display = 'block';
        socList.innerHTML = n.societes.map(s =>
            `<span style="background:var(--bg3);border:1px solid var(--border);
                          padding:3px 10px;border-radius:20px;font-size:0.8em;
                          font-weight:600;color:var(--accent);">${s}</span>`
        ).join('');
    } else {
        socDiv.style.display = 'none';
    }
}

// ── TICKER MARCHÉS MONDIAUX (défilement lent continu) ───────────────────
async function initMarketsTicker() {
    const el   = document.getElementById('markets-inner');
    const tape = document.getElementById('markets-tape');
    if (!el) return;

    try {
        const r = await fetch('api/markets-proxy.php');
        const d = await r.json();
        if (!d.success || !d.data || d.data.length === 0) {
            if (tape) tape.style.display = 'none';
            return;
        }

        const fmt = (v, decimals) => v != null
            ? v.toLocaleString('fr-FR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
            : '—';

        const buildItem = m => {
            const v     = m.variation;
            const col   = v == null ? 'var(--text2)' : v >= 0 ? 'var(--green)' : 'var(--red)';
            const sign  = v != null && v > 0 ? '+' : '';
            const dec   = (m.unite === 'pts') ? 0 : 2;
            const prix  = fmt(m.prix, dec);
            return `<span style="display:inline-flex;align-items:center;gap:7px;margin-right:32px;">
                <span style="font-size:1em;">${m.emoji}</span>
                <span style="font-size:0.82em;font-weight:700;color:var(--text);">${m.nom}</span>
                <span class="mono" style="font-size:0.82em;color:var(--accent);">${prix}${m.unite ? ' '+m.unite : ''}</span>
                ${v != null ? `<span class="mono" style="font-size:0.78em;color:${col};">${sign}${v.toFixed(2)}%</span>` : ''}
                <span style="color:var(--border);opacity:0.5;">│</span>
            </span>`;
        };

        // Doubler pour boucle continue sans saut
        const half  = d.data.map(buildItem).join('');
        el.innerHTML = half + half;

        // Vitesse : ~6s par item (accéléré)
        const duration = d.data.length * 6;
        el.style.animationDuration = duration + 's';

        // Rafraîchir toutes les 5 minutes
        setTimeout(initMarketsTicker, 5 * 60 * 1000);

    } catch(e) {
        if (tape) tape.style.display = 'none';
    }
}
document.addEventListener('DOMContentLoaded', initMarketsTicker);

// ── AUTH MANAGER ─────────────────────────────────────────────────────────
const authManager = {
    currentUser: null,

    // Vérifier le token au chargement
    async init() {
        const tok = localStorage.getItem('auth_token');
        if (!tok) { this._setGuest(); return; }
        try {
            const r = await fetch('api/auth.php?action=check&token=' + encodeURIComponent(tok));
            const d = await r.json();
            if (d.loggedIn) {
                this._setUser(d.user);
                localStorage.setItem('auth_user_cache', JSON.stringify(d.user));
            } else {
                localStorage.removeItem('auth_token');
                localStorage.removeItem('auth_user_cache');
                this._setGuest();
            }
        } catch(e) {
            // Serveur indisponible : restaurer la session depuis le cache local
            const cached = localStorage.getItem('auth_user_cache');
            if (cached) {
                try { this._setUser(JSON.parse(cached)); return; } catch(_) {}
            }
            this._setGuest();
        }
    },

    // Ouvrir une modale (login | register | guard)
    openModal(type) {
        this.closeModal();
        const overlay = document.getElementById('auth-overlay');
        const modal   = document.getElementById('modal-' + type);
        if (!overlay || !modal) return;
        overlay.style.display = 'flex';
        modal.style.display   = 'block';
        // Focus premier champ
        setTimeout(() => {
            const first = modal.querySelector('input');
            if (first) first.focus();
        }, 80);
    },

    closeModal() {
        document.getElementById('auth-overlay').style.display = 'none';
        ['login','register','guard'].forEach(id => {
            const m = document.getElementById('modal-' + id);
            if (m) m.style.display = 'none';
        });
        // Vider erreurs
        ['login-error','register-error'].forEach(id => {
            const e = document.getElementById(id);
            if (e) { e.style.display = 'none'; e.textContent = ''; }
        });
    },

    // Guard : accès portefeuille
    guardTab(tab) {
        if (this.currentUser) {
            switchTab(tab);
        } else {
            this.openModal('guard');
        }
    },

    // Connexion
    async login() {
        const email = document.getElementById('login-email')?.value.trim();
        const pass  = document.getElementById('login-pass')?.value;
        const btn   = document.getElementById('btn-login-submit');
        const errEl = document.getElementById('login-error');

        if (!email || !pass) { this._showErr('login', 'Veuillez remplir tous les champs.'); return; }

        btn.disabled = true; btn.textContent = 'Connexion…';
        try {
            const fd = new URLSearchParams();
            fd.append('action', 'login');
            fd.append('email', email);
            fd.append('password', pass);
            const r = await fetch('api/auth.php', { method: 'POST', body: fd });
            const d = await r.json();
            if (d.success) {
                if (d.token) localStorage.setItem('auth_token', d.token);
                localStorage.setItem('auth_user_cache', JSON.stringify(d.user));
                this._setUser(d.user);
                this.closeModal();
            } else {
                this._showErr('login', d.error || 'Erreur inconnue.');
            }
        } catch(e) { this._showErr('login', 'Erreur de connexion au serveur.'); }
        btn.disabled = false; btn.textContent = 'Se connecter';
    },

    // Inscription
    async register() {
        const prenom = document.getElementById('reg-prenom')?.value.trim();
        const nom    = document.getElementById('reg-nom')?.value.trim();
        const email  = document.getElementById('reg-email')?.value.trim();
        const pass   = document.getElementById('reg-pass')?.value;
        const pass2  = document.getElementById('reg-pass2')?.value;
        const btn    = document.getElementById('btn-reg-submit');

        if (!prenom || !nom || !email || !pass || !pass2) {
            this._showErr('register', 'Tous les champs sont obligatoires.'); return;
        }
        if (pass !== pass2) {
            this._showErr('register', 'Les mots de passe ne correspondent pas.'); return;
        }

        btn.disabled = true; btn.textContent = 'Création…';
        try {
            const fd = new URLSearchParams();
            fd.append('action',    'register');
            fd.append('prenom',    prenom);
            fd.append('nom',       nom);
            fd.append('email',     email);
            fd.append('password',  pass);
            fd.append('password2', pass2);
            const r = await fetch('api/auth.php', { method: 'POST', body: fd });
            const d = await r.json();
            if (d.success) {
                if (d.token) localStorage.setItem('auth_token', d.token);
                localStorage.setItem('auth_user_cache', JSON.stringify(d.user));
                this._setUser(d.user);
                this.closeModal();
            } else {
                this._showErr('register', d.error || 'Erreur inconnue.');
            }
        } catch(e) { this._showErr('register', 'Erreur de connexion au serveur.'); }
        btn.disabled = false; btn.textContent = 'Créer mon compte';
    },

    // Déconnexion
    async logout() {
        const tok = localStorage.getItem('auth_token');
        if (tok) await fetch('api/auth.php?action=logout&token=' + encodeURIComponent(tok)).catch(()=>{});
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user_cache');
        this._setGuest();
        // Si on est sur le portefeuille, revenir aux marchés
        if (document.getElementById('view-portefeuille')?.classList.contains('active')) {
            switchTab('marches');
        }
    },

    // Mettre à jour l'UI après connexion
    _setUser(user) {
        this.currentUser = user;
        document.getElementById('auth-guest').style.display = 'none';
        const authUser = document.getElementById('auth-user');
        authUser.style.display = 'flex';
        document.getElementById('auth-user-name').textContent = `👤 ${user.prenom} ${user.nom}`;
        // Charger le portefeuille du compte depuis le serveur
        if (typeof portfolioManager !== 'undefined') {
            portfolioManager.loadFromServer();
        }
        // Paramètres et section admin : visibles uniquement pour l'admin
        const isAdmin = user.email === 'rashidkhouy@gmail.com';
        const settingsMenu = document.getElementById('settingsMenu');
        if (settingsMenu) settingsMenu.style.display = isAdmin ? '' : 'none';
        const adminSection = document.getElementById('admin-backup-section');
        if (adminSection) adminSection.style.display = isAdmin ? 'block' : 'none';
    },

    // Mettre à jour l'UI après déconnexion
    _setGuest() {
        this.currentUser = null;
        document.getElementById('auth-guest').style.display = 'flex';
        document.getElementById('auth-user').style.display  = 'none';
        const settingsMenu = document.getElementById('settingsMenu');
        if (settingsMenu) settingsMenu.style.display = 'none';
        const adminSection = document.getElementById('admin-backup-section');
        if (adminSection) adminSection.style.display = 'none';
    },

    _showErr(type, msg) {
        const el = document.getElementById(type + '-error');
        if (!el) return;
        el.textContent    = msg;
        el.style.display  = 'block';
    }
};

document.addEventListener('DOMContentLoaded', () => authManager.init());

// ── MASI ─────────────────────────────────────────────────────────────────
async function loadMASI() {
    try {
        const r = await fetch('api/masi-proxy.php?_=' + Date.now());
        const d = await r.json();

        const elVal  = document.getElementById('masi-valeur');
        const elVar  = document.getElementById('masi-variation');
        const elUpd  = document.getElementById('masi-update');

        if (d.success && d.valeur) {
            const v    = parseFloat(d.variation) || 0;
            const isUp = v >= 0;
            const sign = isUp ? '+' : '';
            const arrow = v === 0 ? '▬' : (isUp ? '▲' : '▼');
            const bg  = v === 0 ? 'rgba(150,150,150,0.2)' : (isUp ? 'rgba(46,160,67,0.2)' : 'rgba(248,81,73,0.2)');
            const col = v === 0 ? 'var(--text2)' : (isUp ? 'var(--green)' : 'var(--red)');

            if (elVal) elVal.textContent = Number(d.valeur).toLocaleString('fr-FR', {minimumFractionDigits:2, maximumFractionDigits:2}) + ' pts';
            if (elVar) {
                const ytdVal   = d.ytd != null ? d.ytd : null;
                const ytdColor = ytdVal != null ? (ytdVal < 0 ? 'var(--red)' : ytdVal > 0 ? 'var(--green)' : 'var(--text2)') : '';
                const ytdSign  = ytdVal != null && ytdVal > 0 ? '+' : '';
                const ytdHtml  = ytdVal != null
                    ? ` <span style="color:${ytdColor};font-size:0.85em;margin-left:6px;">YTD ${ytdSign}${ytdVal.toFixed(2)}%</span>`
                    : '';
                elVar.innerHTML        = `<span>${arrow} ${sign}${v.toFixed(2)}%</span>${ytdHtml}`;
                elVar.style.background = bg;
                elVar.style.color      = col;
            }

            // Vérifier les alertes MASI
            checkMasiAlerte(v, parseFloat(d.valeur) || 0);
        } else {
            if (elVal) elVal.textContent = 'N/D';
            if (elVar) { elVar.textContent = '—'; elVar.style.color = 'var(--text3)'; }
            setTimeout(loadMASI, 2 * 60 * 1000);
        }

        const now = new Date().toLocaleTimeString('fr-FR', {hour:'2-digit', minute:'2-digit'});
        if (elUpd) elUpd.textContent = 'Mis à jour : ' + now;
        // Charger les seuils sauvegardés dans les inputs
        _initMasiAlerteInputs();
    } catch(e) {
        const elVal = document.getElementById('masi-valeur');
        if (elVal) elVal.textContent = 'N/D';
        console.warn('MASI fetch error:', e);
        setTimeout(loadMASI, 2 * 60 * 1000);
    }
}

// ── Alertes MASI ─────────────────────────────────────────────────────────
function _loadMasiSeuilsConfig() {
    try { return JSON.parse(localStorage.getItem('masi_alerte_seuil') || '{}'); } catch { return {}; }
}
function _initMasiAlerteInputs() {
    const cfg    = _loadMasiSeuilsConfig();
    const inpH   = document.getElementById('masi-seuil-hausse');
    const inpB   = document.getElementById('masi-seuil-baisse');
    const status = document.getElementById('masi-alerte-status');
    if (inpH && cfg.hausse) inpH.value = cfg.hausse;
    if (inpB && cfg.baisse) inpB.value = cfg.baisse;
    if (status) {
        const parts = [];
        if (cfg.hausse) parts.push(`▲ ≥ +${cfg.hausse}%`);
        if (cfg.baisse) parts.push(`▼ ≥ -${cfg.baisse}%`);
        status.textContent = parts.length ? parts.join('  |  ') : 'Aucune alerte configurée';
        status.style.color = parts.length ? '#e3b341' : 'var(--text3)';
    }
}
function saveMasiAlerteSeuil() {
    const vH = parseFloat(document.getElementById('masi-seuil-hausse')?.value) || 0;
    const vB = parseFloat(document.getElementById('masi-seuil-baisse')?.value) || 0;
    const cfg = {};
    if (vH > 0) cfg.hausse = vH;
    if (vB > 0) cfg.baisse = vB;
    localStorage.setItem('masi_alerte_seuil', JSON.stringify(cfg));
    // Effacer le cache du jour pour réévaluer immédiatement
    const today = new Date().toISOString().slice(0, 10);
    localStorage.removeItem('masi_alerte_sent_' + today);
    _initMasiAlerteInputs();
    if (typeof portfolioManager !== 'undefined') {
        portfolioManager.showNotification(
            cfg.hausse || cfg.baisse
                ? `🔔 Alertes MASI : ${cfg.hausse ? '▲ ≥ +' + cfg.hausse + '%' : ''} ${cfg.baisse ? '▼ ≥ -' + cfg.baisse + '%' : ''}`
                : '🔕 Alertes MASI supprimées',
            'success'
        );
    }
}
async function checkMasiAlerte(variation, valeur) {
    const cfg   = _loadMasiSeuilsConfig();
    if (!cfg.hausse && !cfg.baisse) return;

    const today = new Date().toISOString().slice(0, 10);
    const stKey = 'masi_alerte_sent_' + today;
    let sent    = {};
    try { sent = JSON.parse(localStorage.getItem(stKey) || '{}'); } catch(e) {}

    const now = new Date().toLocaleString('fr-FR', {day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'});

    // Alerte hausse
    if (cfg.hausse && variation >= cfg.hausse && !sent.hausse) {
        const ok = await _envoyerEmailMasiAlerte('hausse', variation, valeur, cfg.hausse, now);
        if (ok) { sent.hausse = true; localStorage.setItem(stKey, JSON.stringify(sent)); }
        if (typeof portfolioManager !== 'undefined') {
            portfolioManager.showNotification(
                `📈 MASI +${variation.toFixed(2)}% — Seuil hausse ≥ +${cfg.hausse}% atteint · ${ok ? 'Email ✅' : 'Échec ⚠️'}`,
                'success'
            );
        }
    }

    // Alerte baisse
    if (cfg.baisse && variation <= -cfg.baisse && !sent.baisse) {
        const ok = await _envoyerEmailMasiAlerte('baisse', variation, valeur, cfg.baisse, now);
        if (ok) { sent.baisse = true; localStorage.setItem(stKey, JSON.stringify(sent)); }
        if (typeof portfolioManager !== 'undefined') {
            portfolioManager.showNotification(
                `📉 MASI ${variation.toFixed(2)}% — Seuil baisse ≥ -${cfg.baisse}% atteint · ${ok ? 'Email ✅' : 'Échec ⚠️'}`,
                'warning'
            );
        }
    }
}
async function _envoyerEmailMasiAlerte(sens, variation, valeur, seuil, now) {
    if (typeof portfolioManager === 'undefined') return false;
    const isHausse = sens === 'hausse';
    const col      = isHausse ? '#3fb950' : '#f85149';
    const arrow    = isHausse ? '▲' : '▼';
    const sign     = isHausse ? '+' : '';
    const titre    = isHausse ? `MASI EN HAUSSE ≥ +${seuil}%` : `MASI EN BAISSE ≥ -${seuil}%`;

    const html = `
    <div style="font-family:Arial,sans-serif;max-width:520px;background:#0d1117;color:#e6edf3;padding:24px;border-radius:10px;">
        <div style="border-left:4px solid ${col};padding-left:16px;margin-bottom:20px;">
            <div style="font-size:0.75em;color:#8b949e;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:4px;">📊 Alerte MASI · ${now}</div>
            <div style="font-size:1.3em;font-weight:700;color:${col};">${titre}</div>
        </div>
        <table style="width:100%;border-collapse:collapse;font-size:0.9em;">
            <tr><td style="padding:7px 0;color:#8b949e;">Indice</td>
                <td style="text-align:right;font-weight:700;">MASI — Moroccan All Shares Index</td></tr>
            <tr><td style="padding:7px 0;color:#8b949e;">Valeur actuelle</td>
                <td style="text-align:right;font-family:monospace;font-weight:700;">${Number(valeur).toLocaleString('fr-FR',{minimumFractionDigits:2,maximumFractionDigits:2})} pts</td></tr>
            <tr><td style="padding:7px 0;color:#8b949e;">Variation du jour</td>
                <td style="text-align:right;font-family:monospace;font-weight:800;color:${col};font-size:1.1em;">${arrow} ${sign}${variation.toFixed(2)}%</td></tr>
            <tr style="border-top:1px solid #30363d;">
                <td style="padding:10px 0;color:#8b949e;">Seuil d'alerte</td>
                <td style="text-align:right;font-family:monospace;color:#e3b341;">${arrow} ${isHausse ? '+' : '-'}${seuil}%</td></tr>
        </table>
        <div style="margin-top:16px;font-size:0.78em;color:#8b949e;border-top:1px solid #30363d;padding-top:12px;">
            Bourse de Casablanca · Alerte automatique quotidienne
        </div>
    </div>`;

    const ok = await portfolioManager._envoyerEmail(
        `📊 [BVC] Alerte MASI — ${titre} (${sign}${variation.toFixed(2)}%)`,
        html
    );
    return ok === true;
}

// ── TOP 5 HAUSSES / BAISSES (TradingView Scanner + casablancabourse.com) ──────
async function loadTopMovers() {
    const haussesEl = document.getElementById('top-hausses');
    const baissesEl = document.getElementById('top-baisses');
    if (!haussesEl && !baissesEl) return;

    // Afficher loader
    const loader = '<span style="color:var(--text3);font-size:0.82em;">⏳ Chargement...</span>';
    if (haussesEl) haussesEl.innerHTML = loader;
    if (baissesEl) baissesEl.innerHTML = loader;

    try {
        const r = await fetch('api/top-movers-proxy.php?_=' + Date.now());
        const d = await r.json();

        if (!d.success || !d.hausses) throw new Error(d.error || 'Réponse invalide');

        const renderList = (items, cls) => {
            if (!items || items.length === 0)
                return '<span style="color:var(--text3);font-size:0.85em;">Aucune donnée</span>';
            return items.map(s => {
                const sign    = s.variation > 0 ? '+' : '';
                const fullNom = (s.nom || s.ticker).replace(/^(BMCE\s+)/i, '');
                // Noms longs → ticker seul pour ne pas casser l'alignement
                const display = fullNom.length > 16 ? s.ticker : fullNom;
                return `<div style="display:grid;grid-template-columns:minmax(0,1fr) auto auto;gap:0 10px;
                             align-items:center;padding:5px 0;border-bottom:1px solid var(--border);cursor:context-menu;"
                             data-symbole="${s.ticker}" data-prix="${s.cours}" title="${fullNom}">
                    <div style="min-width:0;overflow:hidden;">
                        <span style="font-size:0.88em;font-weight:600;display:block;
                              white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${display}</span>
                        ${display !== fullNom ? '' : `<span class="mono" style="font-size:0.72em;color:var(--text3);">${s.ticker}</span>`}
                    </div>
                    <span class="mono" style="font-size:0.85em;text-align:right;white-space:nowrap;">
                        ${Number(s.cours).toFixed(2)}
                    </span>
                    <span class="mono ${cls}" style="font-size:0.85em;font-weight:700;text-align:right;
                          white-space:nowrap;min-width:56px;">
                        ${sign}${Number(s.variation).toFixed(2)}%
                    </span>
                </div>`;
            }).join('');
        };

        if (haussesEl) haussesEl.innerHTML = renderList(d.hausses, 'up');
        if (baissesEl) baissesEl.innerHTML = renderList(d.baisses, 'down');
        // ── Sync prix top-movers → priceService + DOM tableau Marchés ────────
        // Les top-movers sont sans cache (temps réel) alors que bvc-proxy a 10 min
        // de cache → on propage les prix frais pour cohérence
        const allMovers = [...(d.hausses || []), ...(d.baisses || [])];
        const ps = typeof portfolioManager !== 'undefined' ? portfolioManager.priceService : null;
        allMovers.forEach(s => {
            if (!s.ticker || !s.cours) return;
            const newPrice = parseFloat(s.cours);
            const newVar   = parseFloat(s.variation);
            if (isNaN(newPrice) || newPrice <= 0) return;

            // 1) Mettre à jour prixBMCE
            if (ps && ps.prixBMCE) {
                ps.prixBMCE[s.ticker] = { price: newPrice, variation: newVar, source: 'top-movers' };
            }

            // 2) Mettre à jour la ligne dans le tableau Marchés si visible
            const row = document.querySelector(`#societes-cotees-body tr[data-symbole="${s.ticker}"]`);
            if (!row) return;
            const cells = row.querySelectorAll('td');
            if (cells.length < 3) return;

            // Attribut data-prix
            row.setAttribute('data-prix', newPrice);

            // Cellule prix (index 1)
            cells[1].textContent = newPrice.toFixed(2);

            // Cellule variation (index 2)
            const isUp   = newVar > 0;
            const isFlat = newVar === 0;
            const arrow  = isFlat ? '▬' : (isUp ? '▲' : '▼');
            const bg     = isFlat ? 'rgba(150,150,150,0.15)' : (isUp ? 'rgba(46,160,67,0.15)' : 'rgba(248,81,73,0.15)');
            const col    = isFlat ? 'var(--text2)' : (isUp ? 'var(--green)' : 'var(--red)');
            const lbl    = `${isUp ? '+' : ''}${newVar.toFixed(2)}%`;
            cells[2].innerHTML = `<span class="mono" style="display:inline-flex;align-items:center;gap:3px;
                background:${bg};color:${col};font-weight:600;padding:2px 7px;
                border-radius:20px;font-size:0.85em;">${arrow} ${lbl}</span>`;
        });

        console.log(`✅ Top Movers chargés (${d.source}) — ${d.total ?? '?'} valeurs · ${allMovers.length} prix synchronisés`);
    } catch(e) {
        console.warn('Top Movers error:', e);
        // Fallback : utiliser les données déjà affichées dans _renderTopMovers
        const errMsg = '<span style="color:var(--text3);font-size:0.82em;">⚠️ Données indisponibles</span>';
        if (haussesEl && haussesEl.innerHTML.includes('Chargement')) haussesEl.innerHTML = errMsg;
        if (baissesEl && baissesEl.innerHTML.includes('Chargement')) baissesEl.innerHTML = errMsg;
        // Ré-essayer dans 3 min
        setTimeout(loadTopMovers, 3 * 60 * 1000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadMASI();
    loadTopMovers();
    // Rafraîchir MASI toutes les 5 min
    setInterval(() => { loadMASI(); }, 5 * 60 * 1000);
    // Rafraîchir Top Movers toutes les 3 min en séance
    setInterval(() => {
        if (isSeanceOuverte()) loadTopMovers();
    }, 3 * 60 * 1000);
});

// ── TOGGLE GRAPHIQUE ÉVOLUTION (global) ──────────────────────────────────
function toggleEvoChart(id) {
    const wrap = document.getElementById(id + '-wrap');
    const btn  = document.getElementById(id + '-btn');
    if (!wrap) return;
    const show = wrap.style.display === 'none';
    wrap.style.display = show ? 'block' : 'none';
    if (btn) btn.style.opacity = show ? '1' : '0.4';
    if (show && typeof portfolioManager !== 'undefined') {
        portfolioManager._renderOneEvoChart(id);
    }
}
