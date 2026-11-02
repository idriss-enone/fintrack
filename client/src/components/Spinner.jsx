const sizeMap = {
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-8 w-8 border-[3px]",
};

const toneMap = {
  default: "border-slate-200 border-t-violet-500",
  light: "border-white/30 border-t-white",
};

const Spinner = ({
  size = "md",
  tone = "default",
  label = "Chargement en cours...",
}) => {
  return (
    <span role="status" aria-live="polite" className="inline-flex">
      <span
        aria-hidden="true"
        className={`${sizeMap[size]} ${toneMap[tone]} animate-spin rounded-full motion-reduce:animate-pulse`}
      />
      <span className="sr-only">{label}</span>
    </span>
  );
};

export default Spinner;
