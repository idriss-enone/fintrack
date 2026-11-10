export default function ProgressBar({
  percent,
  color = "bg-emerald-500",
  ...props
}) {
  const pct = Math.min(100, Math.max(0, Number(percent) || 0));
  const barColor =
    pct >= 100 ? "bg-rose-500" : pct >= 70 ? "bg-amber-500" : color;

  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      className=" h-2 rounded-full bg-slate-100 overflow-hidden w-full "
      {...props}
    >
      <div
        className={`h-full transition-[width] duration-300 motion-reduce:transition-none ${barColor}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
