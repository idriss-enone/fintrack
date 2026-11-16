import { isMissing, isString, isValidDate, isId, isAmount } from "./commonValidator.js";

const VALID_PERIODS = ['monthly', 'weekly'];

// Création : categoryId et amount obligatoires ; period (défaut 'monthly') et startDate optionnels
export function validateCreate({ categoryId, amount, period, startDate }) {
    const errors = {}

    // categoryId (obligatoire)
    if (isMissing(categoryId)) {
        errors.categoryId = 'categoryId is required';
    } else if (!isId(categoryId)) {
        errors.categoryId = 'categoryId must be a positive integer';
    }

    // amount (obligatoire)
    if (isMissing(amount)) {
        errors.amount = 'amount is required';
    } else if (!isAmount(amount)) {
        errors.amount = 'amount must be a positive number with at most 2 decimals';
    }

    // period (optionnel : absent ou vide = valeur par défaut 'monthly')
    if (!isMissing(period)) {
        if (!isString(period) || !VALID_PERIODS.includes(String(period).trim())) {
            errors.period = "period must be 'monthly' or 'weekly'";
        }
    }

    // startDate (optionnel : absent ou vide = début de la période en cours)
    if (!isMissing(startDate)) {
        if (!isValidDate(startDate)) {
            errors.startDate = 'startDate must be a valid date (YYYY-MM-DD)';
        }
    }

    return Object.keys(errors).length > 0 ? errors : null;
}

// Modification : tous les champs sont optionnels, on ne valide que ceux envoyés
// ("!= null" = envoyé, c'est-à-dire ni undefined, ni le vide ni null). La catégorie n'est pas modifiable.
export function validateUpdate({ amount, period, startDate }) {
    const errors = {}
    const hasAmount = !isMissing(amount);
    const hasPeriod = !isMissing(period);
    const hasStartDate = !isMissing(startDate);

    // 1. Vérifier qu'au moins un champ est fourni
    if (!hasAmount && !hasPeriod && !hasStartDate) {
        return { _global: 'At least one field (amount, period, startDate) must be provided' };
    }
    // Valider chaque champ présent
    if (hasAmount && !isAmount(amount)) {
        errors.amount = 'amount must be a positive number with at most 2 decimals';
    }

    if (hasPeriod && (!isString(period) || !VALID_PERIODS.includes(String(period).trim()))) {
        errors.period = "period must be 'monthly' or 'weekly'";
    }

    if (hasStartDate && !isValidDate(startDate)) {
        errors.startDate = 'startDate must be a valid date (YYYY-MM-DD)';
    }

    return Object.keys(errors).length > 0 ? errors : null;
}