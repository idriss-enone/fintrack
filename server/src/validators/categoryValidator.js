// Ce fichier ne contient que de la validation : pas de base de données, pas de res.
// Chaque fonction renvoie un message d'erreur (string), ou null si tout est valide.

const VALID_TYPES = ['income', 'expense'];
const HEX_COLOR = /^#[0-9A-Fa-f]{6}$/;

// Convertit un id d'URL en entier positif, sinon null
export function parseId(value) {
    const id = Number(value);
    return Number.isInteger(id) && id > 0 ? id : null;
}

// Filtre ?type=... de la liste (optionnel)
export function validateTypeFilter(type) {
    if (type !== undefined && !VALID_TYPES.includes(type)) {
        return "Type must be 'income' or 'expense'";
    }
    return null;
}

// Création : name et type obligatoires, icon et color optionnels
export function validateCreate({ name, type, icon = null, color = null }) {
    if (typeof name !== 'string' || !name.trim()) {
        return "Name is required";
    }
    if (name.trim().length > 100) { // VARCHAR(100)
        return "Name must be 100 characters or less";
    }
    if (!VALID_TYPES.includes(type)) {
        return "Type must be 'income' or 'expense'";
    }
    if (icon !== null && (typeof icon !== 'string' || icon.length > 50)) { // VARCHAR(50)
        return "Icon must be a string of 50 characters or less";
    }
    if (color !== null && (typeof color !== 'string' || !HEX_COLOR.test(color))) {
        return "Color must be a hex value like #10B981";
    }
    return null;
}

// Modification : tous les champs sont optionnels, on ne valide que ceux envoyés
// ("!= null" = envoyé, c'est-à-dire ni undefined ni null). Le type n'est pas modifiable.
export function validateUpdate({ name, icon, color }) {
    if (name != null && (typeof name !== 'string' || !name.trim() || name.trim().length > 100)) {
        return "Name must be between 1 and 100 characters";
    }
    if (icon != null && (typeof icon !== 'string' || icon.length > 50)) {
        return "Icon must be a string of 50 characters or less";
    }
    if (color != null && (typeof color !== 'string' || !HEX_COLOR.test(color))) {
        return "Color must be a hex value like #10B981";
    }
    if (name == null && icon == null && color == null) {
        return "Nothing to update";
    }
    return null;
}