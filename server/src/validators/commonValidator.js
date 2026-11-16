// Petites règles de validation partagées entre catégories et transactions.

const MAX_INT4 = 2147483647; // valeur maximale d'un SERIAL dans PostgreSQL
const AMOUNT_REGEX = /^\d{1,10}(\.\d{1,2})?$/; // NUMERIC(12,2) : 10 chiffres max, 2 décimales max

export const VALID_TYPES = ['income', 'expense'];


export const isString = (value) => typeof value === 'string';
export const isNumber = (value) => typeof value === 'number';
export const isNull = (value) => value === null;
export const isUndefined = (value) => value === undefined;

export const isEmptyString = (value) => isString(value) && value.trim() === ''
export const isNumberOrString = (value) => typeof value === 'number' || typeof value === 'string';

const isIdString = (value) => isString(value) && /^[1-9]\d*$/.test(value);

export const isMissing = (value) => isUndefined(value) || isNull(value) || isEmptyString(value);


// Convertit un id (d'URL ou de body) en entier positif, sinon null
export function parseId(value) {
    const id = isNumber(value) ? value : isIdString(value) ? Number(value) : null;
    return Number.isInteger(id) && id > 0 && id <= MAX_INT4 ? id : null;
}

// undefined et null restent tels quels, le reste devient un nombre
export const toNumber = (value) => (value === undefined || value === null ? value : Number(value));


// Vrai si la valeur est une vraie date au format 'YYYY-MM-DD' (2026-02-30 est refusée)
export function isValidDate(value) {
    if (!isString(value) || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return false;
    }
    const date = new Date(`${value}T00:00:00Z`);
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}


export const normalizeAmount = (value) => String(value).trim().replace(",", ".");

// Vrai si value est un id valide (entier positif, en nombre ou en texte numérique)
export const isId = (value) => isNumberOrString(value) && parseId(value) !== null;

// Vrai si value est un montant strictement positif avec 2 décimales maximum (nombre ou texte)
export const isAmount = (value) => {
    if (!isNumberOrString(value)) return false;
    const normalized = normalizeAmount(value);
    return AMOUNT_REGEX.test(normalized) && Number(normalized) > 0;
}

export const isIntegerString = (value) => isString(value) && /^\d+$/.test(value);

// "  Courses " -> "Courses", "" -> null ; undefined et null restent tels quels
export function normalizeText(value) {
    if (typeof value !== 'string') return value;
    const trimmed = value.trim();
    return trimmed === '' ? null : trimmed;
}
