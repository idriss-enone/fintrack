import { isValidDate, isId, isAmount } from "./commonValidator.js";


const VALID_PERIODS = ['monthly', 'weekly'];

// Création : category_id et amount obligatoires ; period (défaut 'monthly') et start_date optionnels
export function validateCreate({ category_id, amount, period, start_date }) {
    if (!isId(category_id)) {
        return "Category id is required";
    }
    if (!isAmount(amount)) {
        return "Amount must be a positive number with at most 2 decimals";
    }
    if (period != null && !VALID_PERIODS.includes(period)) {
        return "Period must be 'monthly' or 'weekly'";
    }
    if (start_date != null && !isValidDate(start_date)) {
        return "Start date must be a valid date (YYYY-MM-DD)";
    }
    return null;
}

// Modification : tous les champs sont optionnels, on ne valide que ceux envoyés
// ("!= null" = envoyé, c'est-à-dire ni undefined ni null). La catégorie n'est pas modifiable.
export function validateUpdate({ amount, period, start_date }) {
    if (amount != null && !isAmount(amount)) {
        return "Amount must be a positive number with at most 2 decimals";
    }
    if (period != null && !VALID_PERIODS.includes(period)) {
        return "Period must be 'monthly' or 'weekly'";
    }
    if (start_date != null && !isValidDate(start_date)) {
        return "Start date must be a valid date (YYYY-MM-DD)";
    }
    if (amount == null && period == null && start_date == null) {
        return "Nothing to update";
    }
    return null;
}