import { cn } from "@/lib/cn";

export default function Checkbox({
  id,
  label,
  helperText,
  disabled = false,
  required = false,
  error,
  className,
  ...props
}) {
  const helperId = helperText ? `${id}-helper` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className="space-y-1">
      <div className="flex items-start gap-3">
        <input
          id={id}
          type="checkbox"
          disabled={disabled}
          required={required}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={errorId ?? helperId}
          className={cn(
            "mt-0.5 h-4 w-4 cursor-pointer rounded accent-violet-600 transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "ring-2 ring-rose-400",
            className,
          )}
          {...props}
        />
        {label && (
          <label
            htmlFor={id}
            className={cn(
              "cursor-pointer text-sm text-slate-600",
              disabled && "cursor-not-allowed opacity-60",
            )}
          >
            {label}
            {required && (
              <span className="ml-0.5 text-rose-500" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}
      </div>

      {!error && helperText && (
        <p id={helperId} className="ml-7 text-sm text-slate-500">
          {helperText}
        </p>
      )}

      {error && (
        <p
          id={errorId}
          role="alert"
          className="ml-7 text-sm font-medium text-rose-600"
        >
          {error}
        </p>
      )}
    </div>
  );
}
