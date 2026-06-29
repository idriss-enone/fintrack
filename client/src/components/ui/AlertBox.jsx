import { 
  AlertTriangle, 
  AlertCircle, 
  CheckCircle2, 
  Info 
} from 'lucide-react';
const styles = {
    warn : 'bg-amber-50 border-amber-300 text-amber-800',
    danger : 'bg-red-50 border-red-300 text-red-800',
    success: 'bg-green-50 border-green-300 text-green-800',
    info: 'bg-blue-50 border-blue-300 text-blue-800'
}
const icons = {
  warn:    AlertTriangle,
  danger:  AlertCircle,
  success: CheckCircle2,
  info:    Info,
}
const srLabels = {
  warn:    'Avertissement :',
  danger:  'Erreur :',
  success: 'Succès :',
  info:    'Information :',
}

export default function AlertBox({type="info",message}){
  const alertRole = (type === 'danger' || type === 'warn') ? 'alert' : 'status';
  const Icon = icons[type];
  return (
    <div 
      role={alertRole}
      className={`flex items-start gap-2 px-4 py-3 rounded-lg border text-sm ${styles[type]}`}>
        <Icon size={18} className="flex-shrink-0 mt-0.5" aria-hidden="true" />
        <span className="sr-only">{srLabels[type]}</span>
        <span className="font-medium">{message}</span>
    </div>
  )
}
