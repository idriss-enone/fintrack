import Input from "@/components/ui/Input";
import FormField from "@/components/ui/FormField";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";

const PERIODS = [
  { value: "monthly", label: "Mensuel" },
  { value: "weekly", label: "Hebdomadaire" },
];

const BudgetForm = ({
  form,
  errors,
  saving,
  isEditing,
  setField,
  categories = [],
  onSubmit,
  onCancel,
}) => {
  const noCategoryLeft = !isEditing && categories.length === 0;
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {!isEditing && (
        <FormField
          id="b_category"
          label="Catégorie"
          required
          error={errors.categoryId}
          help={
            noCategoryLeft
              ? "Toutes vos catégories de dépenses ont déjà un budget."
              : undefined
          }
        >
          <Select
            id="b_category"
            value={form.categoryId}
            disabled={noCategoryLeft}
            onChange={(e) => setField("categoryId", e.target.value)}
            error={errors.categoryId}
            aria-describedby={noCategoryLeft ? "b_category-help" : undefined}
          >
            <option value="">Sélectionner une catégorie</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </FormField>
      )}
      <FormField id="b_amount" label="Montant" required error={errors.amount}>
        <Input
          id="b_amount"
          type="number"
          step="0.01"
          min="0.01"
          placeholder="Ex: 50000"
          value={form.amount}
          onChange={(e) => setField("amount", e.target.value)}
          error={errors.amount}
        />
      </FormField>
      <FormField id="b_period" label="Période" required error={errors.period}>
        <Select
          id="b_period"
          value={form.period}
          onChange={(e) => setField("period", e.target.value)}
          error={errors.period}
        >
          {PERIODS.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
      </FormField>
      <div className="flex gap-2 justify-end pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" disabled={saving || noCategoryLeft}>
          {saving ? "Enregistrement..." : "Définir le budget"}
        </Button>
      </div>
    </form>
  );
};

export default BudgetForm;
