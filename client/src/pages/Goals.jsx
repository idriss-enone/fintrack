import { useState } from 'react';
import { CATEGORY_TYPES } from '../utils/constants';
import FormField from '../components/ui/FormField';
import ProgressBar from '../components/ui/ProgressBar';
import Input from '../components/ui/Input';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import Badge         from '../components/ui/Badge';
import { Trash2, Plus, X, Trophy,CheckCircle2,ArrowUpCircle,ArrowDownCircle } from 'lucide-react';
import { useGoals } from '../hooks/useGoals';

// Labels lisibles pour les types
const TYPE_LABELS = {
  [CATEGORY_TYPES.DEPENSE]: { label: 'Dépense', color: 'red'   },
  [CATEGORY_TYPES.REVENU]:  { label: 'Revenu',  color: 'green' },
  [CATEGORY_TYPES.BOTH]:    { label: 'Les deux', color: 'blue' },
}

console.log(Object.entries(TYPE_LABELS));



const Goals = () => {
  const {
    enrichedGoals,
    form, setForm, errors,
    addGoal,deleteGoal,
    formatAmount,updateSaved,
  } = useGoals();
  const [showForm,  setShowForm]  = useState(false);
  const [confirmId, setConfirmId] = useState(null);
  // Montant saisi pour chaque objectif { [id]: amount }
  const [amounts,setAmounts] = useState({})

  
  const handleAdd = () => {
    const ok = addGoal();
    if (ok) setShowForm(false)
  }

  const handleUpdate = (id, delta) => {
    const amount = parseFloat(amounts[id]) || 0
    if (amount <= 0) return
    updateSaved(id, amount * delta)
    setAmounts(prev => ({ ...prev, [id]: '' }))
  }

  return (
    <div className="space-y-4 md:space-y-6">

      {/* Dialog confirmation */}
      {confirmId && (
        <ConfirmDialog
          message="Cette catégorie sera définitivement supprimée. Les transactions associées ne seront pas supprimées."
          onConfirm={() => { deleteGoal(confirmId); setConfirmId(null) }}
          onCancel={() => setConfirmId(null)}
        />
      )}

      {/* En-tête */}
      <div 
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"
      >
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">Objectifs d'épargne</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {enrichedGoals.filter(g => g.completed).length} /  {enrichedGoals.length} objectif(s) atteint(s)
          </p>
        </div>
        <button
          onClick={() => setShowForm(prev => !prev)}
          className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            showForm
              ? 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              : 'bg-blue-600 text-white border-transparent hover:bg-blue-700'
          }`}
        >
          {showForm
            ? <><X size={15} aria-hidden="true" /> Annuler</>
            : <><Plus size={15} aria-hidden="true" /> Nouvel objectif</>
          }
        </button>
      </div>
      {/* Formulaire d'ajout */}
      {showForm && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 md:p-5 space-y-4">
          <h2 className="text-sm font-semibold text-gray-700">Nouvelle catégorie</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <FormField id="goal-name" label="Nom de l'objectif" required error={errors.name}>
              <Input
                id="goal-name"
                placeholder="Ex: Acheter un terrain au Cameroun"
                value={form.name}
                onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                error={errors.name}
              />
            </FormField>

            <FormField id="goal-target" label="Montant cible (FCFA)" required error={errors.target}>
              <Input
                id="goal-target"
                type='number'
                min="0"
                placeholder="Ex:  5000000"
                value={form.target}
                onChange={e => setForm(prev => ({ ...prev, target: e.target.value }))}
                error={errors.target}
              />
            </FormField>

            <FormField id="goal-saved" label="Déjà épargné (FCFA)" required error={errors.saved}>
              <Input
                id="goal-saved"
                type='number'
                min="0"
                placeholder="Ex: 0"
                value={form.saved}
                onChange={e => setForm(prev => ({ ...prev, saved: e.target.value }))}
                error={errors.saved}
              />
            </FormField>
          </div>

          <button
            onClick={handleAdd}
            className="
            w-full sm:w-auto inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white 
            text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors focus:outline-none 
            focus:ring-2 focus:ring-blue-500"
          >
            <Plus size={15} aria-hidden="true" />
            Créer l'objectif
          </button>
      </div>
      )}

      {/* Liste */}
          {enrichedGoals.length === 0 ? (
            <div className="text-center py-16 text-gray-400" role="status">
              <Trophy size={40} className="mx-auto mb-3 text-gray-300" aria-hidden="true" />
              <p className="text-sm font-medium">Aucun objectif défini</p>
              <p className="text-xs mt-1">Créez un objectif pour suivre votre épargne</p>
            </div>
          ):(
            <ul className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {enrichedGoals.map(g => (
                <li
                  key={g.id}
                  className={`bg-white rounded-xl border shadow-sm p-5 space-y-4 ${
                    g.completed ? 'border-green-200' : 'border-gray-100'
                  }`}
                >

                  {/* En-tête */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      {g.completed
                        ? <CheckCircle2 size={20} className="text-green-500 flex-shrink-0" aria-hidden="true" />
                        : <Trophy size={20} className="text-amber-400 flex-shrink-0" aria-hidden="true" />
                      }
                        <h2 className="text-sm font-semibold text-gray-800 truncate">{g.name}</h2>
                    </div>
                    <button
                      onClick={() => setConfirmId(g.id)}
                      aria-label={`Supprimer l'objectif ${g.name}`}
                      className="text-gray-300 hover:text-red-500 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400 rounded-md p-0.5 flex-shrink-0"
                    >
                      <Trash2 size={15} aria-hidden="true" />
                    </button>
                  </div>

                  {/* Progression */}
                  <div>
                    <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                      <span>{formatAmount(g.saved)} épargnés</span>
                      <span className="font-medium text-gray-700">{g.percent}%</span>
                    </div>
                    
                      <ProgressBar
                        percent={g.percent}
                        color={g.completed ? 'bg-green-500' : 'bg-blue-500'}
                        aria-label={`Objectif ${g.name} : ${g.percent}% atteint`}
                      />
                    
                    <div className="flex justify-between text-xs text-gray-400 mt-1.5">
                       <span>
                        {g.completed
                          ? '🎉 Objectif atteint !'
                          : `Reste ${formatAmount(g.remaining)}`
                        }
                      </span>
                      <span>Cible : {formatAmount(g.target)}</span>
                    </div>
                  </div>

                  {/* Actions — masquées si objectif atteint */}

                  {!g.completed && (
                    <div className="flex items-center gap-2 pt-1 border-t border-gray-50">
                       <Input
                        id={`goal-amount-${g.id}`}
                        type="number"
                        min="0"
                        placeholder="Montant"
                        value={amounts[g.id] || ''}
                        onChange={e => setAmounts(prev => ({ ...prev, [g.id]: e.target.value }))}
                        aria-label={`Montant à ajouter ou retirer pour ${g.name}`}
                      />
                       <button
                        onClick={() => handleUpdate(g.id, 1)}
                        aria-label={`Ajouter à l'objectif ${g.name}`}
                        className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 flex-shrink-0"
                      >
                        <ArrowUpCircle size={14} aria-hidden="true" />
                        Ajouter
                      </button>
                      <button
                        onClick={() => handleUpdate(g.id, -1)}
                        aria-label={`Retirer de l'objectif ${g.name}`}
                        className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 flex-shrink-0"
                      >
                        <ArrowDownCircle size={14} aria-hidden="true" />
                        Retirer
                      </button>
                    </div>
                  )}

                  {/* Badge objectif atteint */}
                  {g.completed && (
                    <div className="flex items-center justify-center gap-2 py-2 bg-green-50 rounded-lg border border-green-100">
                      <CheckCircle2 size={15} className="text-green-500" aria-hidden="true" />
                      <span className="text-xs font-medium text-green-700">Objectif atteint !</span>
                    </div>
                  )}

                </li>
              ))}
            </ul>
          )}
      
    </div>
  )
}

export default Goals
