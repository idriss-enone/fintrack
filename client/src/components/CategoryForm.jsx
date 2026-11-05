//import { lucideIconByName } from "@/utils/icons.js";
import { CATEGORY_ICONS, DEFAULT_ICON } from "@/utils/icons.js";
import Input from "@/components/ui/Input";
import FormField from "@/components/ui/FormField";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";

const ICONS = [
  { value: "tag", label: "Étiquette" },
  { value: "utensils", label: "Restaurant" },
  { value: "shopping-cart", label: "Courses" },
  { value: "shopping-bag", label: "Shopping" },
  { value: "car", label: "Transport" },
  { value: "home", label: "Logement" },
  { value: "zap", label: "Énergie" },
  { value: "film", label: "Loisirs" },
  { value: "heart", label: "Santé" },
  { value: "book-open", label: "Éducation" },
  { value: "plane", label: "Voyage" },
  { value: "briefcase", label: "Travail" },
  { value: "gift", label: "Cadeaux" },
  { value: "laptop", label: "Informatique" },
  { value: "trending-up", label: "Investissement" },
  { value: "sparkles", label: "Divers" },
];

const COLORS = [
  { value: "#10B981", label: "Émeraude" },
  { value: "#22C55E", label: "Vert" },
  { value: "#14B8A6", label: "Turquoise" },
  { value: "#06B6D4", label: "Cyan" },
  { value: "#0EA5E9", label: "Bleu ciel" },
  { value: "#3B82F6", label: "Bleu" },
  { value: "#6366F1", label: "Indigo" },
  { value: "#8B5CF6", label: "Violet" },
  { value: "#A855F7", label: "Pourpre" },
  { value: "#D946EF", label: "Fuchsia" },
  { value: "#EC4899", label: "Rose" },
  { value: "#F43F5E", label: "Framboise" },
  { value: "#EF4444", label: "Rouge" },
  { value: "#F97316", label: "Orange" },
  { value: "#F59E0B", label: "Ambre" },
  { value: "#EAB308", label: "Jaune" },
  { value: "#64748B", label: "Ardoise" },
];

const CategoryForm = ({
  form,
  errors,
  saving,
  isEditing,
  setField,
  onSubmit,
  onCancel,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <FormField id="cat-name" label="Nom" required error={errors.name}>
        <Input
          id="cat-name"
          placeholder="Ex : Santé"
          value={form.name}
          onChange={(e) => setField("name", e.target.value)}
          error={errors.name}
        />
      </FormField>

      <FormField id="cat-type" label="Type">
        <Select
          id="cat-type"
          value={form.type}
          disabled={isEditing}
          onChange={(e) => setField("type", e.target.value)}
        >
          <option value="expense">Dépense</option>
          <option value="income">Revenu</option>
        </Select>
      </FormField>

      <fieldset>
        <legend className="mb-2 block text-sm font-medium text-slate-700">
          Icône
        </legend>
        <div className="grid grid-cols-8 gap-2">
          {ICONS.map(({ value, label }) => {
            const Icon = CATEGORY_ICONS[value] ?? DEFAULT_ICON;
            return (
              <label key={value} title={label} className="cursor-pointer">
                <input
                  type="radio"
                  name="icon"
                  value={value}
                  checked={form.icon === value}
                  onChange={() => setField("icon", value)}
                  className="peer sr-only"
                />
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-lg border
              border-slate-200 text-slate-600 transition hover:border-slate-300
              peer-checked:border-violet-500 peer-checked:bg-violet-50 peer-checked:text-violet-700
              peer-focus-visible:ring-2 peer-focus-visible:ring-violet-500 peer-focus-visible:ring-offset-2"
                >
                  <Icon size={18} aria-hidden="true" />
                </span>
                <span className="sr-only">{label}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-2 block text-sm font-medium text-slate-700">
          Couleur
        </legend>
        <div className="flex flex-wrap gap-2">
          {COLORS.map(({ value, label }) => (
            <label key={value} title={label} className="cursor-pointer">
              <input
                type="radio"
                name="color"
                value={value}
                checked={form.color === value}
                onChange={() => setField("color", value)}
                className="peer sr-only"
              />
              <span
                className="block h-8 w-8 rounded-full ring-offset-2 transition
            hover:scale-105 peer-checked:scale-105 peer-checked:ring-2 peer-checked:ring-slate-900
            peer-focus-visible:ring-2 peer-focus-visible:ring-violet-500"
                style={{ backgroundColor: value }}
              />
              <span className="sr-only">{label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </div>
    </form>
  );
};

export default CategoryForm;
