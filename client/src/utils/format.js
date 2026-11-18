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
    if (typeof value === "string" && /^\d{4}-\d{2}(-\d{2})?$/.test(value)) {
        const [year, month, day = 1] = value.split("-").map(Number);
        // new Date(année, mois, jour) compte les mois de 0 (janvier) à 11 (décembre) : d'où "month - 1"
        return new Date(year, month - 1, day);
    }
    return new Date(value);
};


export const formatDate = (date = new Date()) => {
    return toLocalDate(date).toLocaleDateString("fr-FR", {
        month: 'short',
        day: 'numeric',
        year: "numeric"
    });
}

/**
 * Formate une date en "mois année", en français (ex: "octobre 26").
 *
 * @param {Date|string|number} [date=new Date()] - un objet Date, une chaîne "YYYY-MM-DD" du backend,
 *   un timestamp, ou rien pour le mois en cours
 * @returns {string} le mois et l'année
 */
export const formatMonth = (date = new Date()) =>
    toLocalDate(date).toLocaleDateString("fr-FR", { month: "long", year: "2-digit" });



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
 * Formate un montant en notation compacte pour les graphiques
 * @param {number} amount
 * @returns {string} Ex: "25k"
 */
export function formatAmountCompact(amount) {
  return new Intl.NumberFormat('fr-FR', { notation: 'compact' }).format(amount)
}


/**
* Retourne la date du jour au format YYYY-MM-DD, dans le fuseau horaire de l'utilisateur.
*
* N'utilise pas `new Date().toISOString()` : il donne la date en UTC, qui peut être celle de la
* veille pendant quelques heures chaque jour selon le fuseau. Doit rester cohérente avec la date affichée.
*
* @param {Date} [now=new Date()] - l'instant à formater (utile pour les tests)
* @returns {string} par exemple "2026-10-23"
*/
export const toISODateString = (date = new Date()) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const pad = (n) => String(n).padStart(2, "0");
    return `${year}-${pad(month)}-${pad(day)}`;
}



