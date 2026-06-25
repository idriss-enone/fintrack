const styles = {
    warn : 'bg-amber-50 border-amber-300 text-amber-800',
    danger : 'bg-red-50 border-red-300 text-red-800',
    success: 'bg-green-50 border-green-300 text-green-800',
    info: 'bg-blue-50 border-blue-300 text-blue-800'
}
const icons = {
  warn:    '⚠️',
  danger:  '🚨',
  success: '✅',
  info:    'ℹ️',
}
export default function AlertBox({type="info",message}){
  return (
    <div className={`flex items-start gap-2 px-4 py-3 rounded-lg border text-sm ${styles[type]}`}>
        <span>{icons[type]}</span>
        <span>{message}</span>
    </div>
  )
}
