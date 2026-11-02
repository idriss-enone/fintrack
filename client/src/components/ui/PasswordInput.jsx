import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import Input from "./Input";

export default function PasswordInput({ id, error, ...props }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Input
        id={id}
        type={showPassword ? "text" : "password"}
        error={error}
        icon={<Lock size={20} aria-hidden="true" />}
        className="pr-12"
        {...props}
      />
      <button
        type="button"
        onClick={() => setShowPassword((v) => !v)}
        aria-label={`${showPassword ? "Masquer" : "Afficher"} le mot de passe`}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md text-slate-400  hover:text-slate-900"
      >
        {showPassword ? (
          <EyeOff size={20} aria-hidden="true" />
        ) : (
          <Eye size={20} aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
