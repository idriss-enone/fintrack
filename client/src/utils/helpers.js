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
 * Retourne la date du jour au format YYYY-MM-DD
 * @returns {string}
 */
export function getTodayDate() {
  return new Date().toISOString().split('T')[0]
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