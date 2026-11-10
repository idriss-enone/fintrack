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
