/**
 * Select stylisé accessible
 */
export default function Select({ id, value, onChange, children, error, ...props }) {
  return (
    <select
      id={id}
      value={value}
      onChange={onChange}
      aria-describedby={error ? `${id}-error` : undefined}
      aria-invalid={error ? 'true' : 'false'}
      className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors bg-white ${
        error ? 'border-red-400 bg-red-50' : 'border-gray-200'
      }`}
      {...props}
    >
      {children}
    </select>
  )
}