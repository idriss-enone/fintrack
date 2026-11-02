/**
 * Input stylisé accessible
 */
export default function Input({
  id,
  type = "text",
  error,
  icon,
  className = "",
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
      className={` w-full rounded-md border bg-white px-3 py-2 text-base text-slate-900
        placeholder:text-slate-400 transition-colors
        disabled:cursor-not-allowed disabled:opacity-60
        focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent
        ${icon ? "pl-10" : ""}
        ${error ? "border-rose-300 bg-rose-50/30" : "border-slate-400"} 
        ${className}`}
      {...props}
    />
  );
  if (!icon) return input;
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
        {icon}
      </span>
      {input}
    </div>
  );
}

/**
 * className={`min-h-11 w-full rounded-md border bg-surface px-3 text-base text-text
        placeholder:text-text-muted transition-colors
        disabled:cursor-not-allowed disabled:opacity-60
        ${icon ? "pl-10" : ""}
        ${error ? "border-danger-text" : "border-field-border"} ${className}`}
 */
