import {
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Info,
  X,
} from "lucide-react";
import { cn } from "@/lib/cn";

const variants = {
  warn: {
    container: "bg-amber-50/80 border-amber-200/80 text-amber-900",
    iconBox: "bg-amber-100 text-amber-700",
    closeBtn: "text-amber-700 hover:bg-amber-100 focus-visible:ring-amber-500",
    icon: AlertTriangle,
    srLabel: "Avertissement :",
  },
  danger: {
    container: "bg-rose-50/80 border-rose-200/80 text-rose-900",
    iconBox: "bg-rose-100 text-rose-700",
    closeBtn: "text-rose-700 hover:bg-rose-100 focus-visible:ring-rose-500",
    icon: AlertCircle,
    srLabel: "Erreur :",
  },
  success: {
    container: "bg-emerald-50/80 border-emerald-200/80 text-emerald-900",
    iconBox: "bg-emerald-100 text-emerald-700",
    closeBtn:
      "text-emerald-700 hover:bg-emerald-100 focus-visible:ring-emerald-500",
    icon: CheckCircle2,
    srLabel: "Succès :",
  },
  info: {
    container: "bg-violet-50/80 border-violet-200/80 text-violet-900",
    iconBox: "bg-violet-100 text-violet-700",
    closeBtn:
      "text-violet-700 hover:bg-violet-100 focus-visible:ring-violet-500",
    icon: Info,
    srLabel: "Information :",
  },
};

/**
 * Alerte en ligne.
 * - title : phrase courte en gras (facultatif)
 * - message : détail (facultatif si children)
 * - action : un bouton, par exemple « Réessayer » (facultatif)
 * - onClose : si fourni, affiche le bouton de fermeture ; c'est le parent qui masque l'alerte
 */
export default function AlertBox({
  type = "info",
  title,
  message,
  children,
  action,
  onClose,
  className,
}) {
  if (!title && !message && !children) return null;

  const variant = variants[type] ?? variants.info;
  const Icon = variant.icon;
  // Seule une erreur interrompt le lecteur d'écran ; le reste est annoncé poliment
  const role = type === "danger" ? "alert" : "status";

  return (
    <div
      role={role}
      className={cn(
        "flex items-start justify-between gap-3 rounded-2xl border p-3 text-sm",
        variant.container,
        className,
      )}
    >
      <div className="flex min-w-0 items-start gap-3">
        <span
          aria-hidden="true"
          className={cn(
            "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl",
            variant.iconBox,
          )}
        >
          <Icon size={17} strokeWidth={2} />
        </span>

        <div className="min-w-0 pt-1">
          <p className="font-semibold leading-snug">
            <span className="sr-only">{variant.srLabel} </span>
            {title ?? message}
          </p>
          {title && message && (
            <p className="mt-0.5 leading-snug opacity-90">{message}</p>
          )}
          {children}
          {action && <div className="mt-3">{action}</div>}
        </div>
      </div>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer l'alerte"
          className={cn(
            "inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-xl transition",
            "focus-visible:outline-none focus-visible:ring-2",
            variant.closeBtn,
          )}
        >
          <X size={16} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
