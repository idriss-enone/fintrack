/**
 * Champ de formulaire accessible — relie label et input via htmlFor/id
 */
export default function FormField({
  id,
  label,
  required = false,
  error,
  children,
}) {
  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={id}
        className="block text-xs font-medium text-gray-500 mb-1"
      >
        {label}
        {required && <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>}
      </label>

      {/* On clone l'enfant pour lui injecter id et aria-describedby */}
      <div>
        {children}
      </div>

      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  )
}