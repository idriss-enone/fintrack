export default function Checkbox({
  id,
  label,
  helperText,
  disabled = false,
  required = false,
  error,
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
          aria-invalid={!!error}
          aria-describedby={error ? errorId : helperId}
          className={`h-4 w-4 mt-0.5 rounded-lg border accent-emerald-600 text-sm 
                    focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors 
                    ${error ? "border-red-400 bg-red-50" : "border-gray-200 bg-white"}
                    disabled:cursor-not-allowed disabled:opacity-50
                    `}
          {...props}
        />
        {label && (
          <label
            htmlFor={id}
            className={`cursor-pointer text-sm text-gray-600 mb-1
                        ${disabled && "cursor-not-allowed opacity-60"}
                    `}
          >
            {label}
            {required && (
              <span className="text-red-500 ml-0.5" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}
      </div>
      
      {!error && helperText && (
        <p id={helperId} className="ml-7 text-sm text-gray-500">
          {helperText}
        </p>
      )}

      {error && (
        <p
          id={errorId}
          role="alert"
          className="ml-7 text-sm font-medium text-red-600 "
        >
          {error}
        </p>
      )}
    </div>
  );
}
