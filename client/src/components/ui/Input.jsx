import { cn } from "@/lib/cn";

export default function Input({
  id,
  type = "text",
  error,
  icon,
  className,
  "aria-describedby": describedBy,
  ...props
}) {
  const ariaDescribedBy =
    [describedBy, error ? `${id}-error` : null].filter(Boolean).join(" ") ||
    undefined;

  const input = (
    <input
      id={id}
      type={type}
      aria-invalid={error ? "true" : undefined}
      aria-describedby={ariaDescribedBy}
      className={cn(
        "w-full rounded-md border bg-white px-3 py-2 text-base text-slate-900 transition-colors",
        "placeholder:text-slate-400",
        "focus:border-transparent focus:outline-none focus:ring-2 focus:ring-violet-500",
        "disabled:cursor-not-allowed disabled:opacity-60",
        icon && "pl-10",
        error ? "border-rose-300 bg-rose-50/30" : "border-slate-400",
        className,
      )}
      {...props}
    />
  );

  if (!icon) return input;

  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
        {icon}
      </span>
      {input}
    </div>
  );
}
