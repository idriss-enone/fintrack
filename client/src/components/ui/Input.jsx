/**
 * Input stylisé accessible
 */
export default function Input({
  id,
  type = 'text',
  value,
  onChange,
  placeholder,
  min,
  error,
  ...props
}) {
  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      min={min}
      aria-describedby={error ? `${id}-error` : undefined}
      aria-invalid={error ? 'true' : 'false'}
      className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
        error ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white'
      }`}
      {...props}
    />
  )
}