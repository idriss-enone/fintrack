const styles = {
  green:  'bg-green-100 text-green-700',
  red:    'bg-red-100 text-red-700',
  amber:  'bg-amber-100 text-amber-700',
  blue:   'bg-blue-100 text-blue-700',
  gray:   'bg-gray-100 text-gray-600',
}

export default function Badge({ label, color = 'gray' }) {
  return (
    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${styles[color]}`}>
      {label}
    </span>
  )
}