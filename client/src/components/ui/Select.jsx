import { cn } from "@/lib/cn";
import { ChevronDown } from "lucide-react";
/**
 * Select stylisé accessible
 */
export default function Select({
  id,
  className = "",
  error,
  children,
  "aria-describedby": describedBy,
  ...props
}) {
  const ariaDescribedBy =
    [describedBy, error ? `${id}-error` : null].filter(Boolean).join(" ") ||
    undefined;
  return (
    <div className="relative">
      <select
        id={id}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={ariaDescribedBy}
        className={cn(
          "w-full appearance-none rounded-md border bg-white py-2 pl-3 pr-10 text-base text-slate-900 transition-colors",
          "focus:border-transparent focus:outline-none focus:ring-2 focus:ring-violet-500",
          "disabled:cursor-not-allowed disabled:opacity-60",
          error ? "border-rose-300 bg-rose-50/30" : "border-slate-400",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        size={20}
        aria-hidden="true"
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
      />
    </div>
  );
}
