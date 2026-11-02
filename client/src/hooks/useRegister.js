import { useState } from "react";
import useAuth from "./useAuth";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


function validate({ name, email, password }) {
    const errors = {};

    if (!name.trim()) errors.name = "Le nom est requis.";
    else if (name.trim().length > 100)
        errors.name = "Le nom ne doit pas dépasser 100 caractères.";

    if (!email.trim()) errors.email = "L'e-mail est requis.";
    else if (!EMAIL_REGEX.test(email.trim()))
        errors.email = "Saisissez un e-mail valide, par exemple nom@exemple.com.";

    if (!password) errors.password = "Le mot de passe est requis.";
    else if (password.length < 8)
        errors.password = "Le mot de passe doit contenir au moins 8 caractères.";
    else if (password.length > 72)
        errors.password = "Le mot de passe ne doit pas dépasser 72 caractères.";

    return errors;
}

export function useRegister() {
    const { register } = useAuth();
    const [form, setForm] = useState({ name: "", email: "", password: "", currency: "USD" });
    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((prev) => ({ ...prev, [name]: value }));
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
            await register({
                name: form.name.trim(),
                email: form.email.trim().toLowerCase(),
                password: form.password,
                currency: form.currency,
            });
        } catch (error) {
            if (error.response?.status === 409) {
                // e-mail déjà pris : l'erreur va sur le champ concerné, avec le focus dessus
                setErrors({ email: "Un compte existe déjà avec cet e-mail." });
                document.getElementById("email")?.focus();
            } else if (!error.response) {
                setSubmitError("Impossible de joindre le serveur. Vérifiez votre connexion et réessayez.");
            }
            else {
                setSubmitError("Inscription impossible pour le moment. Réessayez dans un instant.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return { form, errors, submitError, isSubmitting, handleChange, handleSubmit };
}