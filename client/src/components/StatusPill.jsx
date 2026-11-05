const styles = {
  income: "bg-emerald-50 text-emerald-700",
  expense: "bg-rose-50 text-rose-700",
  warning: "bg-amber-50 text-amber-700",
  info: "bg-blue-50 text-blue-700",
  critical: "bg-red-50 text-red-700",
  neutral: "bg-slate-100 text-slate-700",
  green: "bg-green-100 text-green-700",
  red: "bg-red-100 text-red-700",
  amber: "bg-amber-100 text-amber-700",
  blue: "bg-blue-100 text-blue-700",
  gray: "bg-gray-100 text-gray-600",
};

const StatusPill = ({ variant = "neutral", children }) => {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium capitalize ${styles[variant] || styles.neutral}`}
    >
      {children}
    </span>
  );
};

export default StatusPill;
