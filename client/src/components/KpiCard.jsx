import { TrendingUp, TrendingDown } from "lucide-react";

const gradients = {
  violet: "from-violet-400 to-violet-600",
  orange: "from-orange-400 to-orange-600",
  emerald: "from-emerald-400 to-emerald-600",
  rose: "from-rose-400 to-rose-600",
  blue: "from-blue-400 to-blue-600",
  amber: "from-amber-400 to-amber-600",
  slate: "from-slate-400 to-slate-600",
};

const KpiCard = ({
  label,
  value,
  delta,
  icon: Icon,
  accent = "slate",
  invertDelta = false,
}) => {
  const hasDelta = delta != null && Number.isFinite(delta);
  const isUp = hasDelta && delta >= 0;
  const isGood = invertDelta ? !isUp : isUp;
  const gradient = gradients[accent] || gradients.slate;

  return (
    <article
      className="bg-white rounded-3xl border border-slate-100 p-5 flex items-center gap-4 shadow-sm"
      title={String(value)}
    >
      {Icon && (
        <div
          aria-hidden="true"
          className={`h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 bg-linear-to-br ${gradient}`}
        >
          <Icon size={26} className="text-white" strokeWidth={2} />
        </div>
      )}
      <dl className="min-w-0 flex-1">
        <dt className="text-sm text-slate-500 truncate">{label}</dt>
        <dd className="flex items-baseline gap-2 mt-0.5">
          <span className="text-2xl font-bold text-slate-900 tracking-tight truncate">
            {value}
          </span>
          {hasDelta && (
            <span
              className={`text-xs font-semibold shrink-0 inline-flex items-center gap-0.5 ${isGood ? "text-emerald-600" : "text-rose-600"}`}
            >
              {isUp ? (
                <TrendingUp size={12} aria-hidden="true" />
              ) : (
                <TrendingDown size={12} aria-hidden="true" />
              )}
              <span className="sr-only">
                {isUp ? "en hausse de" : "en baisse de"}
              </span>
              {Math.abs(delta).toFixed(1)}%
            </span>
          )}
        </dd>
      </dl>
    </article>
  );
};

export default KpiCard;
