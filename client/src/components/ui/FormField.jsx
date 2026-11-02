export default function FormField({
  id,
  label,
  required = false,
  help,
  error,
  children,
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-slate-700">
        {label}
        {required && (
          <span className="ml-0.5 text-rose-500" aria-hidden="true">
            *
          </span>
        )}
      </label>

      <div>
        {children}
        {help && (
          <p id={`${id}-hint`} className="text-sm text-muted mt-1">
            {help}
          </p>
        )}
      </div>

      {error && (
        <p
          id={`${id}-error`}
          aria-live="assertive"
          className="text-xs font-medium text-rose-600"
        >
          {error}
        </p>
      )}
    </div>
  );
}
