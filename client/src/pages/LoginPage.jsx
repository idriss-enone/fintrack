import { useEffect } from "react";
import { Mail, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useLogin } from "@/hooks/useLogin";
import FormField from "@/components/ui/FormField";
import Input from "@/components/ui/Input";
import PasswordInput from "@/components/ui/PasswordInput";
import Checkbox from "@/components/ui/Checkbox";
import Button from "@/components/ui/Button";
import Spinner from "@/components/Spinner";
import AuthLayout from "@/components/layout/AuthLayout";

const LoginPage = () => {
  const {
    form,
    errors,
    submitError,
    isSubmitting,
    handleChange,
    handleSubmit,
  } = useLogin();

  useEffect(() => {
    document.title = "Connexion - FinTrack";
  }, []);

  return (
    <AuthLayout>
      <>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Connexion
        </h1>
        <p className="mt-1.5 text-sm text-slate-500">
          Connectez-vous à votre espace financier.
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

          {/* Email */}
          <div className="space-y-2">
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
          </div>

          {/* Password */}
          <FormField
            id="password"
            label="Mot de passe"
            required
            error={errors.password}
          >
            <PasswordInput
              id="password"
              name="password"
              autoComplete="current-password"
              placeholder="Votre mot de passe"
              required
              value={form.password}
              onChange={handleChange}
              error={errors.password}
            />
          </FormField>

          {/* Remember */}
          <Checkbox
            id="remember"
            name="remember"
            label="Se souvenir de moi"
            checked={form.remember}
            onChange={handleChange}
          />

          {/* Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
            className="group w-full bg-linear-to-br from-violet-400 to-violet-600 py-4 rounded-2xl font-semibold shadow-lg shadow-violet-500/30 hover:from-violet-500 hover:to-violet-700 active:from-violet-600 active:to-violet-800 disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Spinner size="sm" tone="light" label="" />
                Connexion en cours…
              </>
            ) : (
              <>
                Se connecter
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
          Vous n'avez pas de compte ?{" "}
          <Link
            to="/register"
            className="text-violet-600 font-semibold hover:text-violet-700 transition  underline underline-offset-2"
          >
            Créer un compte
          </Link>
        </p>
      </>
    </AuthLayout>
  );
};

export default LoginPage;
