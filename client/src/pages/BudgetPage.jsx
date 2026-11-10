import {
  Plus,
  Target,
  Pencil,
  Trash2,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
} from "lucide-react";
import { formatCurrency } from "@/utils/format.js";
import { useBudget } from "@/hooks/useBudget";
import Button from "@/components/ui/Button";
import Spinner from "@/components/Spinner";
import EmptyState from "@/components/EmptyState";
import ProgressBar from "@/components/ProgressBar";
import CategoryBadge from "@/components/CategoryBadge";
import Modal from "@/components/Modal";
import BudgetForm from "@/components/BudgetForm";

const statusStyles = {
  good: {
    Icon: CheckCircle2,
    label: "Dans les clous",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    iconColor: "text-emerald-600",
  },
  caution: {
    Icon: AlertTriangle,
    label: "À surveiller",
    bg: "bg-amber-50",
    text: "text-amber-700",
    iconColor: "text-amber-600",
  },
  concerning: {
    Icon: AlertOctagon,
    label: "Dépassé",
    bg: "bg-rose-50",
    text: "text-rose-700",
    iconColor: "text-rose-600",
  },
};

const PERIOD_LABELS = { monthly: "Mensuel", weekly: "Hebdomadaire" };

const AnalysisSkeleton = () => (
  <div className="mt-4 pt-4 border-t border-slate-100 animate-pulse">
    <div className="flex items-start gap-2.5">
      <div className="shrink-0 h-6 w-6 rounded-full bg-slate-200" />
      <div className="flex-1 space-y-2">
        <div className="h-3.5 w-20 bg-slate-200 rounded-full" />
        <div className="h-2.5 bg-slate-200 rounded w-full" />
        <div className="h-2.5 bg-slate-200 rounded w-4/5" />
      </div>
    </div>
  </div>
);

const BudgetPage = () => {
  const {
    currency,
    modalOpen,
    closeModal,
    editing,
    loading,
    budgets,
    analyzing,
    availableCategories,
    enrichedBudgets,

    form,
    errors,
    saving,
    setField,
    handleSubmit,

    hasAnalyses,
    analyzeAll,
    onCreate,
    onEdit,
    onDelete,
  } = useBudget();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Budgets
          </h1>
          <p className="text-sm text-slate-500 mt-1.5">
            Définissez des limites de dépenses par catégorie — l'IA évalue
            chacune automatiquement
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={analyzeAll}
            disabled={analyzing || budgets.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border border-violet-200 bg-violet-50 text-violet-700 hover:bg-violet-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {analyzing ? <Spinner size="sm" /> : <Sparkles size={14} />}
            {analyzing
              ? "Analyse en cours…"
              : hasAnalyses
                ? "Relancer l’analyse"
                : "Analyser"}
          </button>
          <Button onClick={onCreate}>
            <Plus size={16} /> Ajouter un budget
          </Button>
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner label="Chargement des budgets..." />
        </div>
      ) : budgets.length === 0 ? (
        <EmptyState
          icon={Target}
          title="Aucun budget pour le moment"
          description="Créez un budget pour suivre vos limites de dépenses."
        />
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {enrichedBudgets.map((b) => {
            const style = b.analysis ? statusStyles[b.analysis.status] : null;
            return (
              <li
                key={b.id}
                className="bg-white rounded-3xl border border-slate-100 p-6 hover:border-slate-200 transition"
              >
                <div className="flex items-start justify-between mb-5">
                  <CategoryBadge
                    name={b.category_name}
                    icon={b.category_icon}
                    color={b.category_color}
                  />
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      aria-label={`Modifier le budget ${b.category_name}`}
                      onClick={() => onEdit(b)}
                      className="p-1.5 hover:bg-slate-100 rounded-md text-slate-500 transition"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      type="button"
                      aria-label={`Supprimer le budget ${b.category_name}`}
                      onClick={() => onDelete(b.id)}
                      className="p-1.5 hover:bg-rose-50 rounded-md text-rose-500 transition"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                {/* Détail montants */}
                <div className="mb-3 flex items-baseline justify-between">
                  <span className="text-3xl font-bold tracking-tight text-slate-900">
                    {formatCurrency(b.spent, currency)}
                  </span>
                  <span className="text-sm text-slate-500">
                    de {formatCurrency(b.total, currency)}
                  </span>
                </div>
                {/* Barre de progression */}
                <ProgressBar
                  percent={b.rawPct}
                  aria-label={`Budget ${b.category_name} : ${Math.round(b.rawPct)} % utilisé`}
                />
                <div className="mt-2.5 flex items-center justify-between text-xs">
                  <span className="text-slate-500 capitalize">
                    {PERIOD_LABELS[b.period]} · {b.rawPct.toFixed(0)}% utilisé
                  </span>
                  <span
                    className={
                      b.over ? "text-rose-600 font-medium" : "text-slate-500"
                    }
                  >
                    {b.over
                      ? ` Dépassé de ${formatCurrency(b.spent - b.total, currency)}`
                      : `${formatCurrency(b.total - b.spent, currency)}  restant`}
                  </span>
                </div>
                {b.analysis && style ? (
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <div className="flex items-start gap-2.5">
                      <div
                        className={`shrink-0 h-6 w-6 rounded-full flex items-center justify-center ${style.bg}`}
                      >
                        <style.Icon size={14} className={style.iconColor} />
                      </div>
                      <div className="min-w-0">
                        <span
                          className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${style.bg} ${style.text} mb-1`}
                        >
                          {style.label}
                        </span>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {b.analysis.message}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : analyzing ? (
                  <AnalysisSkeleton />
                ) : null}
              </li>
            );
          })}
        </ul>
      )}

      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={editing ? "Modifier le budget" : "Nouveau budget"}
      >
        <BudgetForm
          form={form}
          errors={errors}
          saving={saving}
          categories={availableCategories}
          isEditing={Boolean(editing)}
          setField={setField}
          onSubmit={handleSubmit}
          onCancel={closeModal}
        />
      </Modal>
    </div>
  );
};

export default BudgetPage;
