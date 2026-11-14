import Input from "@/components/ui/Input";
import FormField from "@/components/ui/FormField";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";

const TYPES = [
  { value: "expense", label: "Dépense", active: "bg-rose-500 text-white" },
  { value: "income", label: "Revenu", active: "bg-emerald-500 text-white" },
];

const TransactionForm = ({
  form,
  errors,
  saving,
  categories,
  setField,
  onSubmit,
  onCancel,
}) => {
  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <fieldset>
        <legend className="mb-2 text-sm font-semibold text-slate-700">
          Type
        </legend>
        <div className="grid grid-cols-2 gap-2">
          {TYPES.map(({ value, label, active }) => (
            <button
              key={value}
              type="button"
              aria-pressed={form.type === value}
              onClick={() => setField("type", value)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 ${
                form.type === value
                  ? active
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </fieldset>

      <FormField id="tx-amount" label="Montant" required error={errors.amount}>
        <Input
          id="tx-amount"
          type="number"
          inputMode="decimal"
          step="0.01"
          min="0.01"
          placeholder="Ex : 15000"
          value={form.amount}
          onChange={(e) => setField("amount", e.target.value)}
          error={errors.amount}
          autoFocus
        />
      </FormField>

      <FormField id="tx-category" label="Catégorie">
        <Select
          id="tx-category"
          value={form.categoryId}
          onChange={(e) => setField("categoryId", e.target.value)}
        >
          <option value="">Sans catégorie</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>
      </FormField>

      <FormField
        id="tx-description"
        label="Description"
        error={errors.description}
      >
        <Input
          id="tx-description"
          placeholder="Ex : Courses au supermarché"
          value={form.description}
          onChange={(e) => setField("description", e.target.value)}
          error={errors.description}
        />
      </FormField>

      <FormField
        id="tx-date"
        label="Date"
        required
        error={errors.transactionDate}
      >
        <Input
          id="tx-date"
          type="date"
          value={form.transactionDate}
          onChange={(e) => setField("transactionDate", e.target.value)}
          error={errors.transactionDate}
        />
      </FormField>

      <FormField id="tx-notes" label="Notes (facultatif)">
        <Textarea
          id="tx-notes"
          rows={3}
          value={form.notes}
          onChange={(e) => setField("notes", e.target.value)}
        />
      </FormField>

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

export default TransactionForm;
