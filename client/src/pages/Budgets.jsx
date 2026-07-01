import { useState } from "react";
import FormField from "../components/ui/FormField";
import Select from "../components/ui/Select";
import Input from "../components/ui/Input";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import ProgressBar from "../components/ui/ProgressBar";
import { Plus, X, Trash2, Target, AlertTriangle } from 'lucide-react'
import { useBudgets } from "../hooks/useBudgets";
import { formatAmount } from '../utils/helpers'

const STATUS_TEXT = {
  ok:     'text-green-600',
  warn:   'text-amber-600',
  danger: 'text-red-600',
}

const STATUS_BG = {
  ok:     'bg-green-50 border-green-100',
  warn:   'bg-amber-50 border-amber-200',
  danger: 'bg-red-50 border-red-200',
}

const Budgets = () => {
  const { 
    availableCategories,enrichedBudgets,
    addBudget,deleteBudget,
    form, setForm, errors 
  } = useBudgets();

  const [showForm, setShowForm] = useState(false);
  const [confirmId, setConfirmId] = useState(null);

  const handleAdd = () => {
    const ok = addBudget();
    if (ok) setShowForm(false);
  };
  
  return (
    <div className="space-y-4 md:space-y-6">

      {confirmId && (
        <ConfirmDialog
          message="Ce budget sera définitivement supprimé."
          onConfirm={() => { deleteBudget(confirmId); setConfirmId(null) }}
          onCancel={() => setConfirmId(null)}
        />
      )}
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">
            Budgets
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Plafonds mensuels par catégorie — {enrichedBudgets.length} défini(s)
          </p>
        </div>
        {availableCategories.length > 0 && (
          <button
            onClick={() => setShowForm((prev) => !prev)}
            className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              showForm
                ? "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                : "bg-blue-600 text-white border-transparent hover:bg-blue-700"
            }`}
          >
            {showForm ? (
              <>
                <X size={15} aria-hidden="true" /> Annuler
              </>
            ) : (
              <>
                <Plus size={15} aria-hidden="true" /> Nouvelle catégorie
              </>
            )}
          </button>
        )}
      </div>

      {/* Formulaire d'ajout */}

      {showForm && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 md:p-5 space-y-4">
          <h2 className="text-sm font-semibold text-gray-700">
            Nouveau budget mensuel
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormField
              id="bud-cat"
              label="Catégorie"
              required
              error={errors.catId}
            >
              <Select
                id="bud-cat"
                value={form.catId}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, catId: e.target.value }))
                }
                error={errors.catId}
              >
                <option value="">Sélectionner...</option>
                {availableCategories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.emoji} {c.name}
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField
              id="bud-limit"
              label="Plafond mensuel (FCFA)"
              required
              error={errors.limit}
            >
              <Input
                id="bud-limit"
                type="number"
                min="0"
                placeholder="Ex: 50000"
                value={form.limit}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, limit: e.target.value }))
                }
                error={errors.limit}
              />
            </FormField>
          </div>
          <button
            onClick={handleAdd}
            className="w-full sm:w-auto inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Plus size={15} aria-hidden="true" />
            Définir le budget
          </button>
        </div>
      )}

      {/* Liste des budgets */}
      {enrichedBudgets.length === 0 ? (
        <div className="text-center py-16 text-gray-400" role="status">
          <Target size={40} className="mx-auto mb-3 text-gray-300" aria-hidden="true" />
          <p className="text-sm font-medium">Aucun budget défini</p>
          <p className="text-xs mt-1">Définissez un plafond mensuel pour suivre vos dépenses par catégorie</p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {enrichedBudgets.map(b => (
            <li
              key={b.id}
              className={`rounded-xl border shadow-sm p-4 space-y-3 ${STATUS_BG[b.status]}`}
            >
              {/* En-tête de la carte */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xl flex-shrink-0" aria-hidden="true">{b.category.emoji}</span>
                  <span className="text-sm font-medium text-gray-800 truncate">{b.category.name}</span>
                </div>
                <button
                  onClick={() => setConfirmId(b.id)}
                  aria-label={`Supprimer le budget ${b.category.name}`}
                  className="text-gray-400 hover:text-red-500 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400 rounded-md p-0.5 flex-shrink-0"
                >
                  <Trash2 size={15} aria-hidden="true" />
                </button>
              </div>

              {/* Pourcentage + alerte */}
              <div className="flex items-center justify-between">
                <span className={`text-2xl font-bold ${STATUS_TEXT[b.status]}`}>
                  {b.percent}%
                </span>
                {b.status === 'danger' && (
                  <span className="flex items-center gap-1 text-xs font-medium text-red-600">
                    <AlertTriangle size={13} aria-hidden="true" />
                    Dépassé
                  </span>
                )}
                {b.status === 'warn' && (
                  <span className="flex items-center gap-1 text-xs font-medium text-amber-600">
                    <AlertTriangle size={13} aria-hidden="true" />
                    Attention
                  </span>
                )}
              </div>
              {/* Barre de progression */}
              <div>
                <ProgressBar 
                  percent={b.percent} 
                  aria-label={`Budget ${b.category.name} : ${b.percent}% utilisé`}
                />
              </div>

              {/* Détail montants */}
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{formatAmount(b.spent)} dépensés</span>
                <span>Plafond : {formatAmount(b.limit)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
      {/* État vide */}
    </div>
  );
};

export default Budgets;
