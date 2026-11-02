/**
 * Convertit une valeur en objet Date à minuit, dans le fuseau horaire LOCAL de l'utilisateur.
 *
 * Pourquoi : `new Date("2026-10-23")` lit cette chaîne comme minuit en UTC, ce qui peut donner
 * la veille dans les fuseaux à l'ouest de l'UTC (Amériques). Ici, une chaîne "YYYY-MM-DD" est lue
 * comme minuit local, donc le jour ne bouge jamais.
 *
 * @param {Date|string|number} value - un objet Date, une chaîne "YYYY-MM-DD" (format du backend),
 *   une autre chaîne de date, ou un timestamp en millisecondes
 * @returns {Date} la date (un objet "Invalid Date" si la valeur n'est pas une date valide)
 */
const toLocalDate = (value) => {
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split("-").map(Number);
    // new Date(année, mois, jour) compte les mois de 0 (janvier) à 11 (décembre) : d'où "month - 1"
    return new Date(year, month - 1, day);
  }
  return new Date(value);
};


/**
 * Formate une date en toutes lettres, en français (ex: "vendredi 23 octobre 2026").
 *
 * @param {Date|string|number} [date=new Date()] - un objet Date, une chaîne "YYYY-MM-DD" du backend,
 *   un timestamp, ou rien pour la date du jour
 * @returns {string} la date formatée, ou une chaîne vide si la valeur est absente (null) ou invalide
 */
export const getFullDate = (date = new Date()) => {
  if (date === null) return "";
  const d = toLocalDate(date);
  if (Number.isNaN(d.getTime())) return ""; // on n'affiche rien plutôt que "Invalid Date"

  return d.toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Formate une date en "mois année", en français (ex: "octobre 2026").
 *
 * @param {Date|string|number} [date=new Date()] - un objet Date, une chaîne "YYYY-MM-DD" du backend,
 *   un timestamp, ou rien pour le mois en cours
 * @returns {string} le mois et l'année
 */
export const formatMonth = (date = new Date()) =>
  toLocalDate(date).toLocaleDateString("fr-FR", { month: "long", year: "numeric" });


/**
 * Retourne la date du jour au format YYYY-MM-DD, dans le fuseau horaire de l'utilisateur.
 *
 * N'utilise pas `new Date().toISOString()` : il donne la date en UTC, qui peut être celle de la
 * veille pendant quelques heures chaque jour selon le fuseau. Doit rester cohérente avec la date affichée.
 *
 * @param {Date} [now=new Date()] - l'instant à formater (utile pour les tests)
 * @returns {string} par exemple "2026-10-23"
 */
export function getTodayDate(now = new Date()) {
  const pad = (n) => String(n).padStart(2, "0");
  // getMonth() va de 0 (janvier) à 11 (décembre) : d'où "+ 1"
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

export const formatDate = (date = new Date()) => {
  return toLocalDate(date).toLocaleDateString("fr-FR", { month: 'short', day: 'numeric', year: "numeric" });
}




/**
 * Retourne une salutation selon l'heure de la journée.
 *
 * @param {Date} [date=new Date()] - l'instant à considérer
 * @returns {"Bonjour"|"Bon après-midi"|"Bonsoir"} "Bonjour" avant 12h, "Bon après-midi" de 12h à 17h59,
 *   "Bonsoir" à partir de 18h
 */
export const getGreeting = (date = new Date()) => {
  const hour = date.getHours();
  if (hour < 12) return "Bonjour";
  if (hour < 18) return "Bon après-midi";
  return "Bonsoir";
};



/**
 * Formate un montant en monnaie, selon les usages français.
 * @param {number} amount
 * @param {string} [currency="USD"] - code à 3 lettres (la devise choisie par l'utilisateur)
 * @param {object} [options]
 * @param {number} [options.decimals] - force le nombre de décimales (ex: 0 pour arrondir les totaux).
 *   Sans lui, chaque devise garde ses décimales habituelles (2 pour USD et EUR, 0 pour XAF).
 * @param {boolean} [options.showSign=false] - affiche "+" pour les montants positifs
 */
export const formatCurrency = (amount, currency = "USD", { decimals, showSign = false } = {}) =>
  new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
    currencyDisplay: "narrowSymbol", // "$" au lieu de "$US"
    signDisplay: showSign ? "exceptZero" : "auto",
    ...(decimals !== undefined && {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }),
  }).format(amount);







/**
 * Formate un nombre en chaîne de caractères au format monétaire USD (Dollar américain) selon les normes françaises
 * @param {number} n - Le montant numérique à formater
 * @returns {string} Le montant formaté en dollars, arrondi à l'entier (ex: "450 $US" ou "$450" selon les normes du navigateur)
 */
export const format = (n) =>
  n.toLocaleString("fr-FR", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

/**
 * Formate un montant en FCFA
 * @param {number} amount
 * @returns {string} Ex: "25 000 FCFA"
 */
export function formatAmount(amount) {
  return new Intl.NumberFormat('fr-FR').format(Math.round(amount)) + ' FCFA'
}

/**
 * Formate un montant en notation compacte pour les graphiques
 * @param {number} amount
 * @returns {string} Ex: "25k"
 */
export function formatAmountCompact(amount) {
  return new Intl.NumberFormat('fr-FR', { notation: 'compact' }).format(amount)
}

/**
 * Retourne le mois courant au format YYYY-MM
 * @returns {string}
 */
export function getCurrentMonth() {
  return new Date().toISOString().slice(0, 7)
}



/**
 * Génère un identifiant unique
 * @returns {string}
 */
export function generateId() {
  return crypto.randomUUID()
}




/**
 * Calcule le pourcentage entre deux nombres, plafonné à 100
 * @param {number} value
 * @param {number} total
 * @returns {number}
 */
export function calcPercent(value, total) {
  if (!total) return 0
  return Math.min((value / total) * 100, 100);
}

/**
 * Calcule la valeur proportionnelle exacte d'un nombre par rapport à un total sur une échelle donnée
 * @param {number} value
 * @param {number} total
 * @param {number} scale
 * @returns {number}
 */
export function calcRatio(value, total, scale) {
  if (!total) return 0;
  return (value / total) * scale;
}


/**
 * Extrait les mois uniques d'une liste de transactions, triés du plus récent
 * @param {Array} transactions
 * @returns {string[]}
 */
export function extractMonths(transactions) {
  const months = new Set(transactions.map(t => t.date.slice(0, 7)));
  return [...months].sort().reverse();
}

