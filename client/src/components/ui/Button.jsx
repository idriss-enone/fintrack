import { cn } from "@/lib/cn";

const variants = {
  primary:
    "bg-linear-to-b from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 text-white shadow-md shadow-violet-500/25",
  secondary: "bg-slate-100 hover:bg-slate-200 text-slate-900",
  ghost: "hover:bg-slate-100 text-slate-700",
  danger:
    "bg-linear-to-b from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white shadow-md shadow-rose-500/25",
  outline: "border border-slate-200 hover:bg-slate-50 text-slate-700",
};
const sizes = {
  sm: "px-4 py-1.5 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
};

const Button = ({
  variant = "primary",
  size = "md",
  type = "button",
  className = "",
  children,
  ...props
}) => {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-medium transition disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
