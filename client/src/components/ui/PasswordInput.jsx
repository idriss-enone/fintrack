import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { cn } from "@/lib/cn";
import Input from "./Input";

export default function PasswordInput({
  id,
  error,
  className,
  disabled,
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Input
        id={id}
        type={showPassword ? "text" : "password"}
        error={error}
        disabled={disabled}
        icon={<Lock size={20} aria-hidden="true" />}
        className={cn("pr-12", className)}
        {...props}
      />
      <button
        type="button"
        onClick={() => setShowPassword((v) => !v)}
        disabled={disabled}
        aria-label={`${showPassword ? "Masquer" : "Afficher"} le mot de passe`}
        aria-controls={id}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-0.5 text-slate-400 transition-colors hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
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
