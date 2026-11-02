const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CURRENCY_REGEX = /^[A-Z]{3}$/;

export const normalizeEmail = (value) =>
    typeof value === 'string' ? value.trim().toLowerCase() : '';


export const normalizeCurrency = (value) =>
    String(value ?? 'USD').trim().toUpperCase();

// Inscription : email et currency doivent déjà être normalisés
export function validateRegister({ name, email, password, currency }) {
    if (typeof name !== 'string' || !name.trim()) {
        return "Name is required";
    }
    if (name.trim().length > 100) {
        return "Name must be 100 characters or less";
    }
    if (!email) {
        return "Email is required";
    }
    if (email.length > 255 || !EMAIL_REGEX.test(email)) {
        return "Invalid email format";
    }
    if (typeof password !== 'string' || !password) {
        return "Password is required";
    }
    if (password.length < 8 || password.length > 72) { // bcrypt ignore au-delà de 72 caractères
        return "Password must be between 8 and 72 characters";
    }
    if (!CURRENCY_REGEX.test(currency)) {
        return "Currency must be a 3-letter code (e.g. USD)";
    }
    return null;
}

// Connexion : email déjà normalisé
export function validateLogin({ email, password }) {
    if (!email || typeof password !== 'string' || !password) {
        return "Email and password are required";
    }
    return null;
}