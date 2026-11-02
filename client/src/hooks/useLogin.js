import { useState } from "react";
import useAuth from "./useAuth.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate({ email, password }) {
    const errors = {};
    if (!email.trim()) errors.email = "L'e-mail est requis.";
    else if (!EMAIL_REGEX.test(email.trim()))
        errors.email = "Saisissez un e-mail valide, par exemple nom@exemple.com.";

    if (!password) errors.password = "Le mot de passe est requis.";
    return errors;
}

function getLoginErrorMessage(error) {
    if (error.response?.status === 401) return "E-mail ou mot de passe incorrect.";
    if (!error.response)
        return "Impossible de joindre le serveur. Vérifiez votre connexion et réessayez.";
    return "Connexion impossible pour le moment. Réessayez dans un instant.";
}

export function useLogin() {

    const { login } = useAuth();
    const [form, setForm] = useState({ email: "", password: "", remember: false });
    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (event) => {
        const { name, type, value, checked } = event.target;
        setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
        // l'erreur disparaît dès que l'utilisateur corrige le champ
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (isSubmitting) return;
        setSubmitError("");

        const newErrors = validate(form);
        setErrors(newErrors);

        const firstInvalid = Object.keys(newErrors)[0];
        if (firstInvalid) {
            document.getElementById(firstInvalid)?.focus(); // les id sont les noms des champs
            return;
        }

        try {
            setIsSubmitting(true);
            await login(form.email.trim().toLowerCase(), form.password, form.remember);
        } catch (error) {
            setSubmitError(getLoginErrorMessage(error));
        } finally {
            setIsSubmitting(false);
        }
    };

    return { form, errors, submitError, isSubmitting, handleChange, handleSubmit };

}