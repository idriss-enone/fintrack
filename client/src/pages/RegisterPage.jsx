import { useEffect } from "react";
import { User, Mail, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useRegister } from "@/hooks/useRegister";
import FormField from "@/components/ui/FormField";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import PasswordInput from "@/components/ui/PasswordInput";
import Select from "@/components/ui/Select";
import Spinner from "@/components/Spinner";
import AuthLayout from "@/components/layout/AuthLayout";

// Adapte la liste aux devises de tes utilisateurs (3 lettres, comme le backend)
const CURRENCIES = [
  { code: "USD", label: "Dollar américain (USD)" },
  { code: "EUR", label: "Euro (EUR)" },
  { code: "GBP", label: "Livre sterling (GBP)" },
  { code: "CAD", label: "Dollar canadien (CAD)" },
  { code: "CHF", label: "Franc suisse (CHF)" },
  { code: "XAF", label: "Franc CFA – Afrique centrale (XAF)" },
  { code: "XOF", label: "Franc CFA – Afrique de l'Ouest (XOF)" },
  { code: "MAD", label: "Dirham marocain (MAD)" },
];

export default function RegisterPage() {
  const {
    form,
    errors,
    submitError,
    isSubmitting,
    handleChange,
    handleSubmit,
  } = useRegister();

  useEffect(() => {
    document.title = "Créer un compte - FinTrack";
  }, []);

  return (
    <AuthLayout>
      <>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Créer un compte
        </h1>
        <p className="mt-1.5 text-sm text-slate-500">
          Commencez à suivre vos dépenses et vos budgets.
        </p>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="mt-8 flex flex-col gap-5"
        >
          {submitError && (
            <p
              role="alert"
              className="rounded-xl border border-rose-200 bg-rose-50/50 p-3 text-sm font-medium text-rose-700"
            >
              {submitError}
            </p>
          )}

          {/* Nom */}
          <FormField id="name" label="Nom complet" required error={errors.name}>
            <Input
              id="name"
              name="name"
              icon={<User size={20} aria-hidden="true" />}
              autoComplete="name"
              autoCapitalize="words"
              required
              placeholder="Votre nom"
              value={form.name}
              onChange={handleChange}
              error={errors.name}
            />
          </FormField>

          {/* Email */}
          <FormField
            id="email"
            label="Adresse email"
            required
            error={errors.email}
          >
            <Input
              id="email"
              name="email"
              type="email"
              icon={<Mail size={20} aria-hidden="true" />}
              inputMode="email"
              autoComplete="email"
              autoCapitalize="none"
              spellCheck={false}
              required
              placeholder="nom@exemple.com"
              value={form.email}
              onChange={handleChange}
              error={errors.email}
            />
          </FormField>

          {/* Mot de passe */}
          <FormField
            id="password"
            label="Mot de passe"
            required
            help=" Au moins 8 caractères."
            error={errors.password}
          >
            <PasswordInput
              id="password"
              name="password"
              autoComplete="new-password"
              aria-describedby="password-help"
              required
              placeholder="Choisissez un mot de passe"
              value={form.password}
              onChange={handleChange}
              error={errors.password}
            />
          </FormField>

          {/* Devise */}
          <FormField
            id="currency"
            label="Devise"
            hint="Utilisée pour afficher vos montants. Elle ne convertit rien."
          >
            <Select
              id="currency"
              name="currency"
              aria-describedby="currency-help"
              value={form.currency}
              onChange={handleChange}
            >
              {CURRENCIES.map(({ code, label }) => (
                <option key={code} value={code}>
                  {label}
                </option>
              ))}
            </Select>
          </FormField>

          {/* Bouton */}
          <Button
            type="submit"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
            className="group w-full bg-linear-to-br from-violet-400 to-violet-600 py-4 rounded-2xl font-semibold shadow-lg shadow-violet-500/30 hover:from-violet-500 hover:to-violet-700 active:from-violet-600 active:to-violet-800 disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Spinner size="sm" tone="light" label="" />
                Création du compte…
              </>
            ) : (
              <>
                Créer mon compte
                <ArrowRight
                  size={20}
                  aria-hidden="true"
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </>
            )}
          </Button>
          
        </form>

        <p className="mt-8 text-center text-sm text-slate-500">
          Vous avez déjà un compte ?{" "}
          <Link
            to="/login"
            className="text-violet-600 font-semibold hover:text-violet-700 transition  underline underline-offset-2"
          >
            Se connecter
          </Link>
        </p>
      </>
    </AuthLayout>
  );
}
