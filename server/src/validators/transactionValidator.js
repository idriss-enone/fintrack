import { isAmount, isValidDate, VALID_TYPES, isId, isIntegerString } from "./commonValidator.js";

export const MAX_LIMIT = 2000;


// Création : amount, type et transaction_date obligatoires ; le reste est optionnel
export function validateCreate({ category_id, amount, type, description, notes, transaction_date }) {
    if (!isAmount(amount)) {
        return "Amount must be a positive number with at most 2 decimals";
    }
    if (!VALID_TYPES.includes(type)) {
        return "Type must be 'income' or 'expense'";
    }
    if (!isValidDate(transaction_date)) {
        return "Date must be a valid date (YYYY-MM-DD)";
    }
    if (category_id != null && !isId(category_id)) {
        return "Invalid category id";
    }
    if (description != null && (typeof description !== 'string' || description.length > 255)) { // VARCHAR(255)
        return "Description must be a string of 255 characters or less";
    }
    if (notes != null && typeof notes !== 'string') {
        return "Notes must be a string";
    }
    return null;
}

// Modification : tous les champs sont optionnels, on ne valide que ceux envoyés.
// category_id: null est autorisé (retirer la catégorie), de même que description/notes: null.
export function validateUpdate({ category_id, amount, type, description, notes, transaction_date }) {
    if (amount !== undefined && !isAmount(amount)) {
        return "Amount must be a positive number with at most 2 decimals";
    }
    if (type !== undefined && !VALID_TYPES.includes(type)) {
        return "Type must be 'income' or 'expense'";
    }
    if (transaction_date !== undefined && !isValidDate(transaction_date)) {
        return "Date must be a valid date (YYYY-MM-DD)";
    }
    if (category_id != null && !isId(category_id)) {
        return "Invalid category id";
    }
    if (description != null && (typeof description !== 'string' || description.length > 255)) {
        return "Description must be a string of 255 characters or less";
    }
    if (notes != null && typeof notes !== 'string') {
        return "Notes must be a string";
    }
    const nothingSent = [category_id, amount, type, description, notes, transaction_date]
        .every((value) => value === undefined);
    if (nothingSent) {
        return "Nothing to update";
    }
    return null;
}

// Filtres de la liste : ?type=&categoryId=&from=&to=&search=&limit=&offset= (tous optionnels)
export function validateListFilters({ type, categoryId, from, to, search, limit, offset }) {
    if (type !== undefined && !VALID_TYPES.includes(type)) {
        return "Type must be 'income' or 'expense'";
    }
    if (categoryId !== undefined && !isId(categoryId)) {
        return "Invalid category id";
    }
    if (from !== undefined && !isValidDate(from)) {
        return "'from' must be a valid date (YYYY-MM-DD)";
    }
    if (to !== undefined && !isValidDate(to)) {
        return "'to' must be a valid date (YYYY-MM-DD)";
    }
    if (from !== undefined && to !== undefined && from > to) {
        return "'from' must not be after 'to'";
    }
    if (search !== undefined && (typeof search !== "string" || search.length > 100)) {
        return "Search must be a string of 100 characters or less";
    }
    if (limit !== undefined && !(isIntegerString(limit) && Number(limit) >= 1 && Number(limit) <= MAX_LIMIT)) {
        return `Limit must be an integer between 1 and ${MAX_LIMIT}`;
    }
    if (offset !== undefined && !isIntegerString(offset)) {
        return "Offset must be an integer 0 or greater";
    }
    return null;
}