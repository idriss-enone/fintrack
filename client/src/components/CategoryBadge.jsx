import { CATEGORY_ICONS, DEFAULT_ICON } from "@/utils/icons.js";

const dimensionMap = {
  sm: { box: "h-8 w-8", icon: 14 },
  md: { box: "h-9 w-9", icon: 16 },
  lg: { box: "h-12 w-12", icon: 22 },
};

const CategoryBadge = ({ name, icon, color, size = "md", ariaLabel }) => {
  const Icon = CATEGORY_ICONS[icon] ?? DEFAULT_ICON;
  const { box, icon: iconSize } = dimensionMap[size] || dimensionMap.md;
  const baseColor = color || "#64748B";

  return (
    <span
      className="inline-flex items-center gap-3 min-w-0"
      aria-label={!name && ariaLabel ? ariaLabel : undefined}
    >
      <span
        className={`${box} rounded-lg inline-flex items-center justify-center shrink-0`}
        aria-hidden="true"
        style={{ backgroundColor: `${baseColor}1A` }}
      >
        <Icon size={iconSize} style={{ color: baseColor }} />
      </span>

      {name && (
        <span className="font-medium text-slate-900 truncate">{name}</span>
      )}
    </span>
  );
};

export default CategoryBadge;
