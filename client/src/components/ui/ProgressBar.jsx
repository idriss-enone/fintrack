export default function ProgressBar({ percent, color = 'bg-blue-500',...props }) {
  const pct = Math.min(100, Math.max(0, percent))
  const barColor = pct >= 100 ? 'bg-red-500' : pct >= 80 ? 'bg-amber-500' : color

  return (
    <div 
      role="progressbar"
      aria-valuenow={pct} 
      aria-valuemin={0} 
      aria-valuemax={100}
      className="w-full bg-gray-100 rounded-full h-2" 
      {...props}
    >
      <div
        className={`h-2 rounded-full transition-all duration-300 ${barColor}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}