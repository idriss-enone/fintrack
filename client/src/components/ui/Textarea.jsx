import { cn } from "@/lib/cn";
const Textarea = ({ id, error, className = '',  "aria-describedby": describedBy, ...props }) => {
    const ariaDescribedBy =
    [describedBy, error ? `${id}-error` : null].filter(Boolean).join(" ") || undefined;
    return (
            <textarea
                aria-invalid={error ? "true" : undefined}
                aria-describedby={ariaDescribedBy}
                className={cn(
                    "w-full px-3 py-2 rounded-lg border border-slate-400 text-sm focus:outline-none", 
                    "focus:ring-2 focus:ring-violet-500 focus:border-transparent",
                    className
                )}
                {...props}
            />
    );
};

export default Textarea;
