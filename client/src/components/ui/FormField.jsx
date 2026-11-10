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
          <p id={`${id}-help`} className="text-sm text-slate-400 mt-1">
            {help}
          </p>
        )}
      </div>

      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="text-xs font-medium text-rose-600"
        >
          {error}
        </p>
      )}
    </div>
  );
}
