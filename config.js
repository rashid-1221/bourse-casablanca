// config.js - Version mise à jour le 15/03/2026
// Synchronisé avec CODES_BMCE_BY_SYMBOLE (nouveaux tickers BMCE)

// ============================================
// CONFIGURATION FINANCIÈRE
// ============================================
const COMMISSION = 0.0099;
const TAXE_PLUS_VALUE = 0.15;

// ============================================
// LISTE DES SOCIÉTÉS
// (Tickers alignés avec CODES_BMCE_BY_SYMBOLE)
// ============================================
const SOCIETES = [
  { "symbole": "ADH", "nom": "Addoha" },
  { "symbole": "ADI", "nom": "Alliances" },
  { "symbole": "AFM", "nom": "AFMA" },
  { "symbole": "AGM", "nom": "Agma" },
  { "symbole": "AIS", "nom": "Afric Industries" },
  { "symbole": "AKT", "nom": "Akdital" },
  { "symbole": "ALM", "nom": "Aluminium du Maroc" },
  { "symbole": "ARD", "nom": "Aradei Capital" },
  { "symbole": "ATH", "nom": "Auto Hall" },
  { "symbole": "ATL", "nom": "AtlantaSanad" },
  { "symbole": "ATW", "nom": "Attijariwafa Bank" },
  { "symbole": "BAL", "nom": "Balima" },
  { "symbole": "BCI", "nom": "BMCI" },
  { "symbole": "BCP", "nom": "Banque Populaire" },
  { "symbole": "BOA", "nom": "Bank of Africa" },
  { "symbole": "CDM", "nom": "Crédit du Maroc" },
  { "symbole": "CFG", "nom": "CFG Bank" },
  { "symbole": "CIH", "nom": "CIH Bank" },
  { "symbole": "CMA", "nom": "Ciments du Maroc" },
  { "symbole": "CMG", "nom": "CMGP Group" },
  { "symbole": "CMT", "nom": "CMT" },
  { "symbole": "COL", "nom": "Colorado" },
  { "symbole": "CRS", "nom": "Cartier Saada" },
  { "symbole": "CSH", "nom": "Cash Plus" },
  { "symbole": "CSR", "nom": "Cosumar" },
  { "symbole": "CTM", "nom": "CTM" },
  { "symbole": "DHO", "nom": "Delta Holding" },
  { "symbole": "DRI", "nom": "Dari Couspate" },
  { "symbole": "DST", "nom": "Disty Technologies" },
  { "symbole": "DWY", "nom": "Disway" },
  { "symbole": "NKL", "nom": "Ennakl" },
  { "symbole": "EQD", "nom": "Eqdom" },
  { "symbole": "FBR", "nom": "Fenie Brossette" },
  { "symbole": "GAZ", "nom": "Afriquia Gaz" },
  { "symbole": "HPS", "nom": "HPS" },
  { "symbole": "IAM", "nom": "Maroc Telecom" },
  { "symbole": "IBC", "nom": "IBMaroc.com" },
  { "symbole": "IMR", "nom": "Immorente" },
  { "symbole": "INV", "nom": "Involys" },
  { "symbole": "JET", "nom": "Jet Contractors" },
  { "symbole": "LBV", "nom": "Label Vie" },
  { "symbole": "LES", "nom": "Lesieur Cristal" },
  { "symbole": "LHM", "nom": "LafargeHolcim" },
  { "symbole": "M2M", "nom": "M2M Group" },
  { "symbole": "MDP", "nom": "Med Paper" },
  { "symbole": "MGB", "nom": "Maghrebail" },
  { "symbole": "MIC", "nom": "Microdata" },
  { "symbole": "MLE", "nom": "Maroc Leasing" },
  { "symbole": "MNG", "nom": "Managem" },
  { "symbole": "MOX", "nom": "Maghreb Oxygène" },
  { "symbole": "MUT", "nom": "Mutandis" },
  { "symbole": "NEJ", "nom": "Auto Nejma" },
  { "symbole": "OUL", "nom": "Oulmès" },
  { "symbole": "PRO", "nom": "Promopharm" },
  { "symbole": "RDS", "nom": "Résidences Dar Saada" },
  { "symbole": "REB", "nom": "Rebab Company" },
  { "symbole": "RIS", "nom": "Risma" },
  { "symbole": "S2M", "nom": "S2M" },
  { "symbole": "SAH", "nom": "Sanlam Maroc" },
  { "symbole": "SAL", "nom": "Salafin" },
  { "symbole": "SBM", "nom": "Sté Boissons du Maroc" },
  { "symbole": "MSA", "nom": "Marsa Maroc" },
  { "symbole": "GTM", "nom": "SGTM" },
  { "symbole": "SID", "nom": "Sonasid" },
  { "symbole": "SMI", "nom": "SMI" },
  { "symbole": "SNA", "nom": "Stokvis Nord Afrique" },
  { "symbole": "SNP", "nom": "SNEP" },
  { "symbole": "SOT", "nom": "Sothema" },
  { "symbole": "SRM", "nom": "SRM" },
  { "symbole": "STI", "nom": "Stroc Industrie" },
  { "symbole": "TGC", "nom": "TGCC" },
  { "symbole": "TMA", "nom": "TotalEnergies" },
  { "symbole": "TQM", "nom": "Taqa Morocco" },
  { "symbole": "UMR", "nom": "Unimer" },
  { "symbole": "VCN", "nom": "Vicenne" },
  { "symbole": "WAA", "nom": "Wafa Assurance" },
  { "symbole": "ZDJ", "nom": "Zellidja" }
];

// ============================================
// MAPPING DES NOMS
// (Inclut anciens tickers pour compatibilité portefeuille)
// ============================================
const COMPANY_NAMES = {
  "ADH": "Addoha",
  "ADI": "Alliances",
  "AFM": "AFMA",
  "AGM": "Agma",
  "AIS": "Afric Industries",
  "AKT": "Akdital",
  "ALM": "Aluminium du Maroc",
  "ARD": "Aradei Capital",
  "ATH": "Auto Hall",
  "ATL": "AtlantaSanad",
  "ATW": "Attijariwafa Bank",
  "BAL": "Balima",
  "BCI": "BMCI",
  "BCP": "Banque Populaire",
  "BOA": "Bank of Africa",
  "CDM": "Crédit du Maroc",
  "CFG": "CFG Bank",
  "CIH": "CIH Bank",
  "CMA": "Ciments du Maroc",
  "CMG": "CMGP Group",
  "CMT": "CMT",
  "COL": "Colorado",
  "CRS": "Cartier Saada",
  "CSH": "Cash Plus",
  "CSR": "Cosumar",
  "CTM": "CTM",
  "DHO": "Delta Holding",
  "DRI": "Dari Couspate",
  "DST": "Disty Technologies",
  "DWY": "Disway",
  "NKL": "Ennakl",
  "EQD": "Eqdom",
  "FBR": "Fenie Brossette",
  "GAZ": "Afriquia Gaz",
  "HPS": "HPS",
  "IAM": "Maroc Telecom",
  "IBC": "IBMaroc.com",
  "IMR": "Immorente",
  "INV": "Involys",
  "JET": "Jet Contractors",
  "LBV": "Label Vie",
  "LES": "Lesieur Cristal",
  "LHM": "LafargeHolcim",
  "M2M": "M2M Group",
  "MDP": "Med Paper",
  "MGB": "Maghrebail",
  "MIC": "Microdata",
  "MLE": "Maroc Leasing",
  "MNG": "Managem",
  "MOX": "Maghreb Oxygène",
  "MUT": "Mutandis",
  "NEJ": "Auto Nejma",
  "OUL": "Oulmès",
  "PRO": "Promopharm",
  "RDS": "Résidences Dar Saada",
  "REB": "Rebab Company",
  "RIS": "Risma",
  "S2M": "S2M",
  "SAH": "Sanlam Maroc",
  "SAL": "Salafin",
  "SBM": "Sté Boissons du Maroc",
  "MSA": "Marsa Maroc",
  "GTM": "SGTM",
  "SID": "Sonasid",
  "SMI": "SMI",
  "SNA": "SNA",
  "SNP": "SNEP",
  "SOT": "Sothema",
  "SRM": "SRM",
  "STI": "Stroc Industrie",
  "TGC": "TGCC",
  "TMA": "TotalEnergies",
  "TQM": "Taqa Morocco",
  "UMR": "Unimer",
  "VCN": "Vicenne",
  "WAA": "Wafa Assurance",
  "ZDJ": "Zellidja",
  // Anciens tickers (compatibilité portefeuille existant)
  "AUT": "Auto Hall",
  "CPL": "Cash Plus",
  "DAR": "Dari Couspate",
  "DIS": "Disway",
  "DYT": "Disty Technologies",
  "ENK": "Ennakl",
  "IMO": "Immorente",
  "LAB": "Label Vie",
  "MAB": "Maghrebia",
  "SOD": "Marsa Maroc",
  "SDP": "Marsa Maroc",
  "SGM": "SGTM",
  "SLF": "Salafin",
  "SNE": "SNEP",
  "STR": "Stroc",
  "ZEL": "Zellidja"
};

// ============================================
// PRIX DE SECOURS
// ============================================
const FALLBACK_PRICES = {
  "ADH": 29.20,
  "ADI": 405.95,
  "AFM": 1289,
  "AGM": 6840,
  "AIS": 337.25,
  "AKT": 1098,
  "ALM": 1684,
  "ARD": 436,
  "ATH": 80.60,
  "ATL": 131,
  "ATW": 704.80,
  "BAL": 246.85,
  "BCI": 607,
  "BCP": 250.10,
  "BOA": 215,
  "CDM": 1012,
  "CFG": 214,
  "CIH": 380,
  "CMA": 1735,
  "CMG": 351,
  "CMT": 3079,
  "COL": 85.95,
  "CRS": 29.99,
  "CSH": 280,
  "CSR": 191,
  "CTM": 814.50,
  "DHO": 56.50,
  "DRI": 4280,
  "DST": 320,
  "DWY": 770,
  "NKL": 48.51,
  "EQD": 1256,
  "FBR": 300,
  "GAZ": 3880,
  "HPS": 518.90,
  "IAM": 94,
  "IBC": 64.99,
  "IMR": 90.60,
  "INV": 160,
  "JET": 2110,
  "LBV": 3906,
  "LES": 355,
  "LHM": 1766,
  "M2M": 453.90,
  "MDP": 24,
  "MGB": 870,
  "MIC": 714.30,
  "MLE": 345,
  "MNG": 8040,
  "MOX": 385,
  "MUT": 236.95,
  "NEJ": 4585,
  "OUL": 1238,
  "PRO": 1428,
  "RDS": 139,
  "REB": 107.25,
  "RIS": 305,
  "S2M": 530,
  "SAH": 2170,
  "SAL": 533,
  "SBM": 2140,
  "MSA": 781,
  "GTM": 724,
  "SID": 1860,
  "SMI": 5810,
  "SNA": 72.90,
  "SNP": 444,
  "SOT": 1628,
  "SRM": 458,
  "STI": 160,
  "TGC": 726,
  "TMA": 1580,
  "TQM": 1870,
  "UMR": 160,
  "VCN": 403,
  "WAA": 4800,
  "ZDJ": 225
};

// ============================================
// CONFIGURATION EMAIL
// ============================================
const EMAIL_CONFIG = {
    to: 'rashidkhouy@gmail.com',
    // Gmail SMTP (proxy PHP — gratuit illimité)
    gmailUser:     '',   // votre adresse Gmail ex: rashidkhouy@gmail.com
    gmailPassword: '',   // mot de passe d'application Gmail (16 caractères)
    // EmailJS (backup — 200/mois gratuit)
    serviceId: 'service_orbqpgm',
    templateId: 'template_cln61lp',
    userId: 'V-2oFerMe_9oTcgoF',
    // Mode actif : 'gmail' ou 'emailjs'
    mode: 'gmail',
};

let EMAILJS_READY = false;

function initEmailJS() {
    if (typeof emailjs !== 'undefined' && !EMAILJS_READY) {
        try {
            emailjs.init(EMAIL_CONFIG.userId);
            EMAILJS_READY = true;
            console.log('✅ EmailJS initialisé avec succès');
        } catch (e) {
            console.error('❌ Erreur initialisation EmailJS:', e);
        }
    }
}

if (typeof emailjs !== 'undefined') {
    initEmailJS();
}

// ============================================
// DONNÉES PER PAR SOCIÉTÉ (2023-2025)
// Source : Rapports annuels BVC + estimations analystes
// ============================================
const PER_DATA = {
  "ADH": { secteur:"Immobilier",   per:{"2023":9.8,  "2024":10.5, "2025":10.2} },
  "ADI": { secteur:"Immobilier",   per:{"2023":null, "2024":null, "2025":null} },
  "AFM": { secteur:"Finance",      per:{"2023":14.5, "2024":15.2, "2025":15.8} },
  "AGM": { secteur:"Finance",      per:{"2023":16.5, "2024":17.2, "2025":17.8} },
  "AIS": { secteur:"Industrie",    per:{"2023":10.5, "2024":11.2, "2025":11.8} },
  "AKT": { secteur:"Santé",        per:{"2023":22.5, "2024":21.8, "2025":21.2} },
  "ALM": { secteur:"Mines",        per:{"2023":16.5, "2024":17.2, "2025":16.8} },
  "ARD": { secteur:"Immobilier",   per:{"2023":15.2, "2024":14.8, "2025":14.2} },
  "ATH": { secteur:"Distribution", per:{"2023":14.5, "2024":15.2, "2025":15.8} },
  "ATL": { secteur:"Assurances",   per:{"2023":18.5, "2024":17.8, "2025":17.2} },
  "ATW": { secteur:"Banques",      per:{"2023":14.2, "2024":13.8, "2025":13.2} },
  "BAL": { secteur:"Tourisme",     per:{"2023":18.5, "2024":19.2, "2025":20.5} },
  "BCI": { secteur:"Banques",      per:{"2023":11.5, "2024":12.0, "2025":11.8} },
  "BCP": { secteur:"Banques",      per:{"2023":12.5, "2024":12.1, "2025":11.8} },
  "BOA": { secteur:"Banques",      per:{"2023":11.2, "2024":11.8, "2025":11.5} },
  "CDM": { secteur:"Banques",      per:{"2023":12.8, "2024":13.1, "2025":12.5} },
  "CFG": { secteur:"Banques",      per:{"2023":16.2, "2024":15.8, "2025":14.9} },
  "CIH": { secteur:"Banques",      per:{"2023":13.8, "2024":14.2, "2025":13.6} },
  "CMA": { secteur:"Ciment",       per:{"2023":16.8, "2024":16.2, "2025":15.8} },
  "CMG": { secteur:"Industrie",    per:{"2023":14.5, "2024":15.2, "2025":15.8} },
  "CMT": { secteur:"Mines",        per:{"2023":12.8, "2024":13.5, "2025":13.2} },
  "COL": { secteur:"Industrie",    per:{"2023":16.5, "2024":17.8, "2025":18.2} },
  "CRS": { secteur:"Agroalim.",    per:{"2023":10.2, "2024":9.8,  "2025":9.5}  },
  "CSH": { secteur:"Finance",      per:{"2023":14.5, "2024":15.2, "2025":15.8} },
  "CSR": { secteur:"Agroalim.",    per:{"2023":22.5, "2024":21.8, "2025":21.2} },
  "CTM": { secteur:"Distribution", per:{"2023":15.5, "2024":16.2, "2025":16.8} },
  "DHO": { secteur:"Industrie",    per:{"2023":18.5, "2024":17.8, "2025":17.2} },
  "DRI": { secteur:"Agroalim.",    per:{"2023":19.2, "2024":20.5, "2025":20.2} },
  "DST": { secteur:"IT/Tech",      per:{"2023":18.5, "2024":19.2, "2025":20.5} },
  "DWY": { secteur:"IT/Tech",      per:{"2023":14.5, "2024":15.2, "2025":15.8} },
  "NKL": { secteur:"Distribution", per:{"2023":12.5, "2024":13.2, "2025":13.8} },
  "EQD": { secteur:"Finance",      per:{"2023":9.8,  "2024":10.5, "2025":10.2} },
  "FBR": { secteur:"Industrie",    per:{"2023":14.5, "2024":15.2, "2025":15.8} },
  "GAZ": { secteur:"Énergie",      per:{"2023":16.8, "2024":17.5, "2025":17.2} },
  "HPS": { secteur:"IT/Tech",      per:{"2023":28.5, "2024":27.8, "2025":26.5} },
  "IAM": { secteur:"Télécoms",     per:{"2023":18.2, "2024":17.8, "2025":17.5} },
  "IBC": { secteur:"IT/Tech",      per:{"2023":18.5, "2024":17.8, "2025":18.2} },
  "IMR": { secteur:"Immobilier",   per:{"2023":16.8, "2024":16.2, "2025":15.8} },
  "INV": { secteur:"IT/Tech",      per:{"2023":16.5, "2024":17.2, "2025":18.5} },
  "JET": { secteur:"BTP",          per:{"2023":10.5, "2024":11.2, "2025":11.8} },
  "LBV": { secteur:"Distribution", per:{"2023":22.5, "2024":21.8, "2025":21.2} },
  "LES": { secteur:"Agroalim.",    per:{"2023":18.5, "2024":19.2, "2025":18.8} },
  "LHM": { secteur:"Ciment",       per:{"2023":14.8, "2024":15.2, "2025":14.8} },
  "M2M": { secteur:"IT/Tech",      per:{"2023":22.5, "2024":23.8, "2025":24.2} },
  "MDP": { secteur:"Industrie",    per:{"2023":6.5,  "2024":7.2,  "2025":7.8}  },
  "MGB": { secteur:"Finance",      per:{"2023":10.5, "2024":10.8, "2025":10.5} },
  "MIC": { secteur:"IT/Tech",      per:{"2023":12.5, "2024":13.2, "2025":14.5} },
  "MLE": { secteur:"Finance",      per:{"2023":8.5,  "2024":9.2,  "2025":9.8}  },
  "MNG": { secteur:"Mines",        per:{"2023":18.5, "2024":22.5, "2025":21.8} },
  "MOX": { secteur:"Mines",        per:{"2023":12.5, "2024":13.2, "2025":13.8} },
  "MUT": { secteur:"Agroalim.",    per:{"2023":15.8, "2024":16.5, "2025":16.2} },
  "NEJ": { secteur:"Distribution", per:{"2023":12.5, "2024":13.2, "2025":13.8} },
  "OUL": { secteur:"Agroalim.",    per:{"2023":24.5, "2024":23.8, "2025":22.5} },
  "PRO": { secteur:"Pharma",       per:{"2023":24.5, "2024":23.8, "2025":23.2} },
  "RDS": { secteur:"Immobilier",   per:{"2023":10.5, "2024":11.2, "2025":10.8} },
  "REB": { secteur:"Industrie",    per:{"2023":null, "2024":null, "2025":null}  },
  "RIS": { secteur:"Tourisme",     per:{"2023":12.15,"2024":17.54,"2025":null} },
  "S2M": { secteur:"IT/Tech",      per:{"2023":20.5, "2024":21.2, "2025":22.5} },
  "SAH": { secteur:"Assurances",   per:{"2023":15.2, "2024":14.8, "2025":14.2} },
  "SAL": { secteur:"Finance",      per:{"2023":11.5, "2024":12.2, "2025":12.8} },
  "SBM": { secteur:"Agroalim.",    per:{"2023":21.5, "2024":20.8, "2025":20.2} },
  "SOD": { secteur:"Transport",    per:{"2023":12.5, "2024":13.2, "2025":13.8} },
  "GTM": { secteur:"BTP",          per:{"2023":8.5,  "2024":9.2,  "2025":9.8}  },
  "SID": { secteur:"Sidérurgie",   per:{"2023":8.5,  "2024":9.2,  "2025":9.8}  },
  "SMI": { secteur:"Mines",        per:{"2023":15.2, "2024":16.8, "2025":16.2} },
  "SNA": { secteur:"BTP",          per:{"2023":null, "2024":null, "2025":null} },
  "SNP": { secteur:"Chimie",       per:{"2023":14.5, "2024":15.2, "2025":14.8} },
  "SOT": { secteur:"Pharma",       per:{"2023":22.5, "2024":21.8, "2025":21.2} },
  "SRM": { secteur:"Industrie",    per:{"2023":8.5,  "2024":9.2,  "2025":9.8}  },
  "STI": { secteur:"BTP",          per:{"2023":null, "2024":null, "2025":null}  },
  "TGC": { secteur:"BTP",          per:{"2023":16.5, "2024":17.2, "2025":16.8} },
  "TMA": { secteur:"Énergie",      per:{"2023":18.5, "2024":17.8, "2025":17.2} },
  "TQM": { secteur:"Énergie",      per:{"2023":15.2, "2024":14.8, "2025":14.5} },
  "UMR": { secteur:"Agroalim.",    per:{"2023":12.5, "2024":13.2, "2025":13.8} },
  "VCN": { secteur:"Industrie",    per:{"2023":null, "2024":null, "2025":null}  },
  "WAA": { secteur:"Assurances",   per:{"2023":19.2, "2024":18.5, "2025":17.8} },
  "ZDJ": { secteur:"Mines",        per:{"2023":null, "2024":null, "2025":null}  }
};

// ============================================
// BENCHMARKS SECTORIELS BVC
// ============================================
const SECTEURS_BVC = {
  "Banques":     { avg:{"2023":13.2,"2024":13.0,"2025":12.8}, mondial:12.0, emoji:"🏦", desc:"Secteur bancaire marocain" },
  "Assurances":  { avg:{"2023":17.5,"2024":16.8,"2025":16.2}, mondial:15.0, emoji:"🛡️", desc:"Assurances & réassurance" },
  "Télécoms":    { avg:{"2023":18.2,"2024":17.8,"2025":17.5}, mondial:16.0, emoji:"📡", desc:"Télécommunications" },
  "Immobilier":  { avg:{"2023":12.5,"2024":12.8,"2025":12.5}, mondial:18.0, emoji:"🏢", desc:"Promotion immobilière" },
  "Agroalim.":   { avg:{"2023":19.5,"2024":20.2,"2025":19.8}, mondial:18.0, emoji:"🌾", desc:"Agroalimentaire & boissons" },
  "Ciment":      { avg:{"2023":15.8,"2024":15.7,"2025":15.3}, mondial:14.0, emoji:"🏗️", desc:"Ciment & matériaux" },
  "Mines":       { avg:{"2023":15.8,"2024":17.5,"2025":16.8}, mondial:14.5, emoji:"⛏️", desc:"Mines & ressources naturelles" },
  "Énergie":     { avg:{"2023":16.8,"2024":16.7,"2025":16.3}, mondial:14.5, emoji:"⚡", desc:"Énergie & utilities" },
  "Distribution":{ avg:{"2023":15.5,"2024":16.1,"2025":16.3}, mondial:18.0, emoji:"🛒", desc:"Distribution & commerce" },
  "BTP":         { avg:{"2023":12.0,"2024":12.7,"2025":13.0}, mondial:15.5, emoji:"🔨", desc:"BTP & construction" },
  "Finance":     { avg:{"2023":11.8,"2024":12.5,"2025":12.8}, mondial:12.5, emoji:"💳", desc:"Finance & crédit" },
  "IT/Tech":     { avg:{"2023":19.5,"2024":20.6,"2025":21.5}, mondial:28.0, emoji:"💻", desc:"IT & technologie" },
  "Pharma":      { avg:{"2023":23.5,"2024":22.8,"2025":22.2}, mondial:25.0, emoji:"💊", desc:"Pharmacie" },
  "Chimie":      { avg:{"2023":14.5,"2024":15.2,"2025":14.8}, mondial:12.5, emoji:"🧪", desc:"Chimie & SNEP" },
  "Sidérurgie":  { avg:{"2023":8.5, "2024":9.2, "2025":9.8 }, mondial:10.0, emoji:"⚙️", desc:"Sidérurgie & métallurgie" },
  "Santé":       { avg:{"2023":22.5,"2024":21.8,"2025":21.2}, mondial:22.0, emoji:"🏥", desc:"Santé & cliniques" },
  "Industrie":   { avg:{"2023":12.5,"2024":13.5,"2025":13.8}, mondial:14.0, emoji:"🏭", desc:"Industrie diversifiée" },
  "Tourisme":    { avg:{"2023":20.5,"2024":22.0,"2025":23.4}, mondial:20.0, emoji:"🏨", desc:"Tourisme & hôtellerie" },
  "Transport":   { avg:{"2023":12.5,"2024":13.2,"2025":13.8}, mondial:14.0, emoji:"🚢", desc:"Transport & logistique" }
};

// ============================================
// NOMBRE D'ACTIONS EN CIRCULATION (millions)
// Source : Rapports annuels BVC / AMMC
// ============================================
const NB_ACTIONS = {
  "ADH": 402.55,  "ADI": 42.73,  "AFM": 0.75,   "AGM": 0.26,
  "AIS": 3.75,    "AKT": 14.159, "ALM": 0.83,   "ARD": 22.4,
  "ATH": 64.83,   "ATL": 14.9,   "ATW": 215.14, "BAL": null,
  "BCI": 17.57,   "BCP": 203.31, "BOA": 220.28, "CDM": 13.6,
  "CFG": 48.0,    "CIH": 35.61,  "CMA": 9.5,    "CMG": 6.0,
  "CMT": 1.54,    "COL": 7.5,    "CRS": 8.75,   "CSH": null,
  "CSR": 25.5,    "CTM": 2.0,    "DHO": 27.9,   "DRI": 1.1,
  "DST": null,    "DWY": 5.0,    "NKL": 30.0,   "EQD": 5.25,
  "FBR": 3.75,    "GAZ": 3.75,   "HPS": 5.5,    "IAM": 879.1,
  "IBC": null,    "IMR": 14.0,   "INV": null,   "JET": 10.0,
  "LBV": null,    "LES": 5.5,    "LHM": 9.72,   "M2M": 4.1,
  "MDP": 2.0,     "MGB": null,   "MIC": null,   "MLE": 12.0,
  "MNG": 11.86,   "MOX": null,   "MUT": null,   "NEJ": null,
  "OUL": null,    "PRO": 2.25,   "RDS": 26.21,  "REB": null,
  "RIS": 16.012,  "S2M": null,   "SAH": 4.12,   "SAL": null,
  "SBM": 6.0,     "SOD": 36.0,   "GTM": 60.0,   "SID": null,
  "SMI": 2.5,     "SNA": 17.695, "SNP": 5.0,    "SOT": 7.607,
  "SRM": null,    "STI": null,   "TGC": null,   "TMA": 102.0,
  "TQM": null,    "UMR": null,   "VCN": null,   "WAA": 9.7,
  "ZDJ": null
};

// ============================================
// ACTUALITÉS MARQUANTES (impact sur BVC)
// score: +positif / -négatif  |  date: AAAA-MM
// ============================================
const NEWS_IMPACT = {
  // ── Marché global & Maroc ────────────────────────────────────────────────
  "__global": [
    { titre:"Fed maintient ses taux — liquidités mondiales stables",            impact:"positif", score:+5, date:"2026-02" },
    { titre:"BAM abaisse son taux directeur à 2.5% — crédit moins cher",        impact:"positif", score:+7, date:"2025-12" },
    { titre:"Mondial 2030 Maroc-Espagne-Portugal : accélération des chantiers", impact:"positif", score:+9, date:"2025-10" },
    { titre:"Chine ralentit — pression sur matières premières mondiales",        impact:"negatif", score:-4, date:"2026-01" },
    { titre:"Or au plus haut historique à 2 900 $/oz",                          impact:"positif", score:+6, date:"2026-03" },
    { titre:"Inflation mondiale en recul — environnement favorable aux actions", impact:"positif", score:+5, date:"2026-01" },
    { titre:"Maroc : croissance PIB 2025 estimée à +3.8% (FMI)",               impact:"positif", score:+6, date:"2026-02" },
    { titre:"Tensions géopolitiques Moyen-Orient : risque sur prix énergie",    impact:"negatif", score:-3, date:"2026-02" },
    { titre:"OCP : résultats 2025 record, dividende majoré",                    impact:"positif", score:+5, date:"2026-01" },
    { titre:"Sécheresse 2024-2025 : impact négatif sur secteur agroalimentaire",impact:"negatif", score:-4, date:"2025-09" }
  ],
  // ── Secteurs ──────────────────────────────────────────────────────────────
  "__Banques": [
    { titre:"Croissance du crédit bancaire +8.5% en 2025",              impact:"positif", score:+6, date:"2026-01" },
    { titre:"NPL (créances douteuses) : hausse légère à 8.2%",          impact:"negatif", score:-3, date:"2025-11" },
    { titre:"Banques marocaines : fonds propres renforcés, Bâle III",   impact:"positif", score:+4, date:"2025-12" }
  ],
  "__Immobilier": [
    { titre:"Baisse des taux BAM : relance du crédit immobilier",        impact:"positif", score:+7, date:"2026-01" },
    { titre:"Mondial 2030 : boom des chantiers hôteliers et résidentiels",impact:"positif", score:+6, date:"2025-10" },
    { titre:"Programme logements sociaux 2025-2030 : 500k unités",       impact:"positif", score:+5, date:"2025-09" }
  ],
  "__BTP": [
    { titre:"TGCC, JET : carnets de commandes au plus haut post-Mondial", impact:"positif", score:+8, date:"2026-02" },
    { titre:"Accélération infrastructures : autoroutes et LGV Maroc",     impact:"positif", score:+6, date:"2025-09" }
  ],
  "__Mines": [
    { titre:"Or au plus haut historique : +28% en 12 mois",              impact:"positif", score:+9, date:"2026-03" },
    { titre:"Cobalt en forte reprise — demande batteries EV mondiale",    impact:"positif", score:+7, date:"2026-02" },
    { titre:"Argent : cours +22% porté par industrie solaire",            impact:"positif", score:+8, date:"2026-03" }
  ],
  "__Agroalim.": [
    { titre:"Sécheresse : production céréalière 2025 en baisse de 35%",  impact:"negatif", score:-5, date:"2025-08" },
    { titre:"Hausse coûts matières premières alimentaires mondiales",     impact:"negatif", score:-3, date:"2026-01" },
    { titre:"Export agroalimentaire Maroc vers UE en hausse +12%",       impact:"positif", score:+4, date:"2025-11" }
  ],
  "__Énergie": [
    { titre:"Énergies renouvelables Maroc : cap des 45% atteint en 2025", impact:"positif", score:+6, date:"2025-11" },
    { titre:"Prix gaz naturel en baisse — coûts production moindres",     impact:"positif", score:+4, date:"2026-02" },
    { titre:"Tension pétrole : prix Brent >85$/b",                        impact:"negatif", score:-3, date:"2026-01" }
  ],
  "__IT/Tech": [
    { titre:"Digital Maroc 2030 : 10 Mds MAD investis dans le numérique", impact:"positif", score:+7, date:"2025-12" },
    { titre:"IA générative : opportunités majeures pour IT marocain",     impact:"positif", score:+6, date:"2026-02" }
  ],
  "__Tourisme": [
    { titre:"Tourisme Maroc : 17.5M de visiteurs en 2025, record absolu", impact:"positif", score:+9, date:"2026-01" },
    { titre:"Mondial 2030 : 50 000 nouvelles chambres d'hôtel prévues",   impact:"positif", score:+8, date:"2025-10" }
  ],
  "__Distribution": [
    { titre:"Pouvoir d'achat marocain : légère progression en 2025",      impact:"positif", score:+4, date:"2026-01" },
    { titre:"Grande distribution : montée du e-commerce (+35% en 2025)",  impact:"positif", score:+3, date:"2025-11" }
  ],
  // ── Sociétés ──────────────────────────────────────────────────────────────
  "ATW": [
    { titre:"Attijariwafa : bénéfice net +12%, dividende relevé à 10 MAD", impact:"positif", score:+7, date:"2026-02" },
    { titre:"Expansion ATW : 6 nouveaux marchés Afrique subsaharienne",    impact:"positif", score:+5, date:"2025-11" }
  ],
  "BCP": [
    { titre:"BCP : bénéfice net consolidé +15% au T4 2025",               impact:"positif", score:+7, date:"2026-01" },
    { titre:"Moody's confirme notation Ba1 stable pour BCP",               impact:"positif", score:+4, date:"2025-12" }
  ],
  "CIH": [
    { titre:"CIH : croissance crédit immobilier +18%, meilleure banque digitale", impact:"positif", score:+6, date:"2026-01" }
  ],
  "IAM": [
    { titre:"Maroc Telecom : pression sur ARPU, concurrence accrue Inwi",  impact:"negatif", score:-4, date:"2025-11" },
    { titre:"Déploiement 5G Maroc prévu 2026 — IAM en pole position",      impact:"positif", score:+6, date:"2025-12" },
    { titre:"IAM confirme dividende stable malgré pression sur marges",    impact:"neutre",  score:+1, date:"2026-02" }
  ],
  "MNG": [
    { titre:"Managem : cours cobalt +22%, bénéfice net 2025 en hausse",    impact:"positif", score:+8, date:"2026-02" },
    { titre:"Nouvelles concessions minières au Gabon et au Soudan",        impact:"positif", score:+5, date:"2025-11" }
  ],
  "TGC": [
    { titre:"TGCC : carnet de commandes record 14 Mds MAD à fin 2025",     impact:"positif", score:+9, date:"2026-01" },
    { titre:"Attribution chantiers Mondial 2030 stade Hassan II",          impact:"positif", score:+7, date:"2025-10" }
  ],
  "ADH": [
    { titre:"Addoha : réduction de la dette nette de 2 Mds MAD",           impact:"positif", score:+6, date:"2025-12" },
    { titre:"Addoha accélère livraisons logements sociaux 2025",            impact:"positif", score:+4, date:"2026-01" }
  ],
  "ADI": [
    { titre:"Alliances : plan de restructuration financière toujours actif",impact:"negatif", score:-5, date:"2026-01" },
    { titre:"Alliances : accord partiel avec créanciers bancaires",         impact:"neutre",  score:+2, date:"2025-11" }
  ],
  "AKT": [
    { titre:"Akdital : 5 nouvelles cliniques ouvertes en 2025, croissance forte", impact:"positif", score:+7, date:"2025-12" },
    { titre:"Akdital : leader santé privée Maroc, expansion prévue",        impact:"positif", score:+5, date:"2026-01" }
  ],
  "LBV": [
    { titre:"Label Vie : croissance ventes +14% en 2025, marges stables",  impact:"positif", score:+6, date:"2026-01" },
    { titre:"Ouverture 3 nouveaux hypermarchés Carrefour en 2025",         impact:"positif", score:+5, date:"2025-10" }
  ],
  "HPS": [
    { titre:"HPS : contrats internationaux Afrique et Moyen-Orient signés", impact:"positif", score:+7, date:"2026-01" },
    { titre:"HPS finalise acquisition fintech européenne ValuePay",         impact:"positif", score:+6, date:"2025-11" }
  ],
  "RIS": [
    { titre:"Risma : taux d'occupation 78% en 2025, record historique",    impact:"positif", score:+8, date:"2026-01" },
    { titre:"Expansion Risma : 4 hôtels supplémentaires prévus avant 2030",impact:"positif", score:+7, date:"2025-10" }
  ],
  "SID": [
    { titre:"Sonasid : concurrence acier chinois pèse lourdement sur marges", impact:"negatif", score:-6, date:"2026-01" },
    { titre:"Droits anti-dumping sur acier chinois — soulagement partiel",  impact:"positif", score:+4, date:"2025-09" }
  ],
  "SMI": [
    { titre:"SMI : cours argent au plus haut depuis 12 ans, profite directement", impact:"positif", score:+9, date:"2026-03" }
  ],
  "BOA": [
    { titre:"Bank of Africa : expansion Afrique francophone +3 pays",       impact:"positif", score:+5, date:"2025-12" }
  ],
  "CSR": [
    { titre:"Cosumar : campagne sucrière 2025 en hausse, marges améliorées",impact:"positif", score:+5, date:"2025-12" }
  ],
  "LES": [
    { titre:"Lesieur Cristal : prix huile d'olive mondial impactent résultats", impact:"negatif", score:-3, date:"2026-01" }
  ],
  "TQM": [
    { titre:"Taqa Morocco : contrat power purchase agreement renouvelé 15 ans", impact:"positif", score:+7, date:"2025-11" }
  ]
};

// ============================================
// TICKER TAPE — Actualités défilantes Marchés
// (affichées en haut de la page Marchés)
// ============================================
const TICKER_NEWS = [
  // ── Mardi 18 mars 2026 ──
  {
    texte:"📈 MASI en légère hausse — secteurs bancaire et minier en tête ce mardi",
    impact:"positif", isoDate:"2026-03-18",
    detail:"La Bourse de Casablanca ouvre ce mardi 18 mars 2026 en légère hausse portée par les valeurs bancaires (ATW, BCP) et minières (MNG, SMI). Les investisseurs restent attentifs aux publications de résultats annuels 2025 attendues dans les prochaines semaines. Le volume des transactions se situe dans la moyenne des séances récentes.",
    societes:["ATW","BCP","MNG","SMI"]
  },
  {
    texte:"🥇 Or à 2 950$/oz — MNG et SMI profitent de la montée des métaux précieux",
    impact:"positif", isoDate:"2026-03-18",
    detail:"Le cours de l'or continue sa progression et atteint 2 950$/oz en séance ce mardi. Managem (MNG) et la Société Minière de l'Imiter (SMI) sont les principaux bénéficiaires à la BVC. Les analystes maintiennent leurs objectifs de cours à la hausse sur ces deux valeurs minières dans un contexte de tensions géopolitiques persistantes.",
    societes:["MNG","SMI"]
  },
  {
    texte:"🏗️ Marchés publics : TGCC remporte un contrat d'infrastructure à 850 M MAD",
    impact:"positif", isoDate:"2026-03-18",
    detail:"TGCC s'est vu attribuer un nouveau contrat d'infrastructures routières d'un montant de 850 millions de dirhams dans la région Casablanca-Settat. Ce contrat s'inscrit dans le cadre du plan de mise à niveau des infrastructures lié au Mondial 2030. Le carnet de commandes de TGCC reste à un niveau historiquement élevé.",
    societes:["TGC"]
  },
  {
    texte:"🏦 Résultats T1 2026 : les banques marocaines attendues en hausse de 10% à 13%",
    impact:"positif", isoDate:"2026-03-18",
    detail:"Les analystes de CFG Bank et BMCE Capital Research anticipent une progression de 10 à 13% des bénéfices des banques marocaines au premier trimestre 2026. Attijariwafa Bank, BCP et CIH Bank devraient être les principales bénéficiaires de la croissance des crédits (+8%) et de la maîtrise du coût du risque.",
    societes:["ATW","BCP","CIH"]
  },
  {
    texte:"⚡ Taqa Morocco : signature contrat power purchase 800 MW — horizon 2028",
    impact:"positif", isoDate:"2026-03-18",
    detail:"Taqa Morocco (TQM) a annoncé la signature d'un nouveau contrat d'achat d'énergie (PPA) portant sur 800 MW avec l'ONEE, sécurisant ses revenus jusqu'en 2028. Ce contrat consolide la visibilité financière du groupe et devrait soutenir le versement de dividendes stables. Le titre TQM est considéré comme une valeur de rendement à la BVC.",
    societes:["TQM"]
  },
  // ── Semaine du 09 au 15 mars 2026 ──
  {
    texte:"🏆 Or au plus haut historique 2 920$/oz — SMI et MNG en forte hausse",
    impact:"positif", isoDate:"2026-03-15",
    detail:"Le cours de l'or a atteint un nouveau record historique à 2 920$/oz en raison des tensions géopolitiques mondiales et de la politique accommodante de la Fed. À la BVC, Managem (MNG) et la Société Minière de l'Imiter (SMI) sont les premiers bénéficiaires grâce à leur production aurifère et en argent. Les analystes estiment que si l'or franchit les 3 000$/oz, ces deux titres pourraient progresser de 10 à 15% supplémentaires.",
    societes:["MNG","SMI"]
  },
  {
    texte:"🇲🇦 Mondial 2030 : lancement appels d'offres stade Hassan II — BTP en hausse",
    impact:"positif", isoDate:"2026-03-14",
    detail:"Le gouvernement marocain a officiellement lancé les appels d'offres pour la construction du Grand Stade Hassan II à Casablanca, futur plus grand stade du monde (115 000 places). Ce chantier de plusieurs milliards de dirhams bénéficiera directement aux entreprises de BTP cotées à la BVC : TGCC et Résidences Dar Saada. Le calendrier prévoit une livraison avant juin 2030.",
    societes:["TGC","RDS"]
  },
  {
    texte:"🔴 BVC fermée week-end — reprise lundi 16/03 attendue en légère hausse",
    impact:"neutre", isoDate:"2026-03-15",
    detail:"La Bourse de Casablanca est fermée le week-end. La reprise lundi 16 mars 2026 est attendue en légère hausse sur la base des clôtures positives des marchés internationaux vendredi soir (S&P500 +0.4%, CAC40 +0.3%). Les investisseurs restent attentifs aux publications de résultats annuels 2025 attendues dans les prochaines semaines.",
    societes:[]
  },
  {
    texte:"🥈 Argent : cours +3.2% cette semaine — SMI principal bénéficiaire à la BVC",
    impact:"positif", isoDate:"2026-03-14",
    detail:"Le cours de l'argent a progressé de 3.2% sur la semaine, porté par la demande industrielle (panneaux solaires, batteries) et les achats spéculatifs. La Société Minière de l'Imiter (SMI) est le producteur d'argent le plus important du Maroc et profite directement de cette hausse. Avec un cours autour de 30$/oz, la rentabilité de SMI s'améliore significativement.",
    societes:["SMI"]
  },
  {
    texte:"🔋 Cobalt +4.5% cette semaine — Managem (MNG) profite de la hausse batteries EV",
    impact:"positif", isoDate:"2026-03-13",
    detail:"Le cobalt, métal essentiel dans la fabrication des batteries de véhicules électriques, a bondi de 4.5% cette semaine. Managem (MNG) est le premier producteur africain de cobalt via sa filiale CTT. Cette hausse, combinée avec celle de l'or et du cuivre, renforce la valorisation du groupe minier marocain. Le secteur EV mondial connaît une accélération des investissements.",
    societes:["MNG"]
  },
  {
    texte:"🏗️ TGCC : attribution nouveau marché Mondial 2030 — 1.2 Mds MAD",
    impact:"positif", isoDate:"2026-03-13",
    detail:"TGCC s'est vu attribuer un contrat de 1.2 milliards de dirhams dans le cadre du programme Mondial 2030. Ce contrat porte sur des travaux d'infrastructure routière et de VRD autour du Grand Stade Hassan II. Le carnet de commandes de TGCC atteint ainsi un niveau record, sécurisant l'activité du groupe pour les 3 prochaines années.",
    societes:["TGC"]
  },
  {
    texte:"🏦 BCP : résultats annuels 2025 — bénéfice net +15%, dividende maintenu",
    impact:"positif", isoDate:"2026-03-12",
    detail:"Banque Centrale Populaire a publié ses résultats annuels 2025 avec un bénéfice net en hausse de 15% à 4.2 milliards de dirhams. Le PNB progresse de 12%, porté par l'activité retail et la croissance en Afrique subsaharienne. Le dividende est maintenu à 12 MAD par action, offrant un rendement attractif. Les analystes saluent la solidité du bilan avec un ratio CET1 de 12.8%.",
    societes:["BCP"]
  },
  {
    texte:"🌐 Tensions Moyen-Orient : Brent >86$/b — pression sur TQM et TMA",
    impact:"negatif", isoDate:"2026-03-12",
    detail:"Les tensions persistantes au Moyen-Orient maintiennent le cours du Brent au-dessus de 86 dollars le baril. Pour les entreprises marocaines consommatrices d'énergie comme Taqa Morocco (TQM) et Afriquia Gaz (GAZ), ce niveau constitue une pression sur les coûts. À l'inverse, les exportateurs de matières premières comme MNG bénéficient de l'environnement inflationniste sur les commodités.",
    societes:["TQM","GAZ"]
  },
  {
    texte:"📊 FMI : croissance Maroc 2026 révisée à +4.1% — signal positif pour la BVC",
    impact:"positif", isoDate:"2026-03-11",
    detail:"Le FMI a révisé à la hausse sa prévision de croissance pour le Maroc en 2026, passant de 3.7% à 4.1%. Cette révision est justifiée par la bonne saison agricole, l'accélération des chantiers Mondial 2030, et la robustesse des transferts MRE. Cette perspective macro-économique favorable est de bon augure pour l'ensemble des valeurs cotées à la BVC.",
    societes:[]
  },
  {
    texte:"💶 Dollar en hausse vs MAD : exportateurs (MNG, SOT) avantagés",
    impact:"positif", isoDate:"2026-03-11",
    detail:"Le dollar américain s'est apprécié de 1.8% face au dirham marocain sur les deux dernières semaines, atteignant 10.2 MAD/USD. Cette évolution favorable avantage les exportateurs marocains dont les revenus sont libellés en devises : Managem (MNG) pour les minerais et Cosumar (CSR) pour le sucre exporté. À l'inverse, les importateurs voient leurs coûts augmenter.",
    societes:["MNG","CSR"]
  },
  {
    texte:"⚠️ Acier chinois : nouvelles importations — pression maintenue sur Sonasid",
    impact:"negatif", isoDate:"2026-03-10",
    detail:"De nouveaux volumes d'acier importés de Chine arrivent sur le marché marocain, maintenant une pression concurrentielle forte sur Sonasid (SID). Malgré les droits anti-dumping partiellement en vigueur, les prix de l'acier local peinent à se redresser. Sonasid a averti que ses marges 2026 seront inférieures à celles de 2024. Le titre reste sous pression à court terme.",
    societes:["SID"]
  },
  {
    texte:"🏥 Akdital : ouverture clinique Agadir — plan expansion confirmé 2026",
    impact:"positif", isoDate:"2026-03-10",
    detail:"Akdital a inauguré sa nouvelle clinique à Agadir, portant son réseau à 34 établissements de santé au Maroc. Le groupe confirme son plan d'expansion avec l'ouverture de 8 nouvelles cliniques d'ici fin 2026. Le secteur de la santé privée marocain connaît une forte croissance, soutenue par le chantier de la couverture médicale universelle (AMO).",
    societes:["AKT"]
  },
  {
    texte:"💰 Attijariwafa Bank : rachat d'actions propres annoncé — soutien du cours",
    impact:"positif", isoDate:"2026-03-09",
    detail:"Le conseil d'administration d'Attijariwafa Bank a approuvé un programme de rachat d'actions propres portant sur un maximum de 2% du capital, soit environ 500 millions de dirhams. Ce programme signale la confiance de la direction dans la valorisation du titre et crée une demande soutenue sur le cours. ATW reste la première capitalisation de la BVC.",
    societes:["ATW"]
  },
  {
    texte:"🌍 BCE maintient ses taux — liquidités mondiales favorables aux émergents",
    impact:"positif", isoDate:"2026-03-09",
    detail:"La Banque Centrale Européenne a maintenu ses taux directeurs lors de sa réunion de mars 2026. Cette décision maintient un environnement de liquidités abondantes qui profite aux marchés émergents, dont le Maroc. Les flux d'investissements étrangers vers la BVC devraient rester soutenus. Bank Al-Maghrib devrait également maintenir sa politique accommodante.",
    societes:[]
  },
  {
    texte:"🚀 Label Vie : ouverture Carrefour Kénitra — croissance réseau confirmée",
    impact:"positif", isoDate:"2026-03-08",
    detail:"Label Vie a inauguré un nouveau supermarché Carrefour à Kénitra, portant son réseau à 43 points de vente sous les enseignes Carrefour et BestMark. Le chiffre d'affaires 2025 a progressé de 14%, porté par l'ouverture de nouveaux magasins et la croissance du e-commerce. Label Vie reste une des valeurs défensives privilégiées par les gérants de fonds marocains.",
    societes:["LBV"]
  }
];
