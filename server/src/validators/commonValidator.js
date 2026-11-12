// Petites règles de validation partagées entre catégories et transactions.

export const VALID_TYPES = ['income', 'expense'];

// Convertit un id (d'URL ou de body) en entier positif, sinon null
export function parseId(value) {
    const id = Number(value);
    return Number.isInteger(id) && id > 0 ? id : null;
}

// undefined et null restent tels quels, le reste devient un nombre
export const toNumber = (value) => (value === undefined || value === null ? value : Number(value));


// Vrai si la valeur est une vraie date au format 'YYYY-MM-DD' (2026-02-30 est refusée)
export function isValidDate(value) {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return false;
    }
    const date = new Date(`${value}T00:00:00Z`);
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

const AMOUNT_REGEX = /^\d{1,10}(\.\d{1,2})?$/; // NUMERIC(12,2) : 10 chiffres max, 2 décimales max

const isNumberOrString = (value) => typeof value === 'number' || typeof value === 'string';

// Vrai si value est un id valide (entier positif, en nombre ou en texte numérique)
export const isId = (value) => isNumberOrString(value) && parseId(value) !== null;

// Vrai si value est un montant strictement positif avec 2 décimales maximum (nombre ou texte)
export const isAmount = (value) =>
    isNumberOrString(value) && AMOUNT_REGEX.test(String(value).trim()) && Number(value) > 0;

export const isIntegerString = (value) => typeof value === 'string' && /^\d+$/.test(value);


// "  Courses " -> "Courses", "" -> null ; undefined et null restent tels quels
export function normalizeText(value) {
    if (typeof value !== 'string') return value;
    const trimmed = value.trim();
    return trimmed === '' ? null : trimmed;
}
