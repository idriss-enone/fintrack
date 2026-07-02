import { useState } from 'react';
import { useRecurrents } from '../hooks/useRecurrents';
import { Plus, X, Trash2, RefreshCw, Play } from 'lucide-react';
import { TRANSACTION_TYPES, FREQUENCIES } from '../utils/constants';
import {formatAmount} from '../utils/helpers'
import FormField from '../components/ui/FormField'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import Badge from '../components/ui/Badge'
import ConfirmDialog from '../components/ui/ConfirmDialog'

const FREQ_LABELS = {
  [FREQUENCIES.MENSUEL]:       'Mensuel',
  [FREQUENCIES.HEBDOMADAIRE]:  'Hebdomadaire',
}


const Recurrents = () => {

  const {
    recurrents,filteredCategories,
    form, setForm, errors, getCat,
    addRecurrent,deleteRecurrent,
    applyRecurrents,
  } = useRecurrents();

  const [showForm,   setShowForm] = useState(false);
  const [confirmId,setConfirmId] = useState(null);
  const [applyMsg,   setApplyMsg]   = useState(null)


  const handleAdd = () => {
    const ok = addRecurrent();
    if (ok) setShowForm(false);
  }

  const handleApply = () =>{
    const count = applyRecurrents();
    
    setApplyMsg(
      count > 0
        ? `✅ ${count} transaction(s) ajoutée(s) avec succès.`
        : `ℹ️ Toutes les récurrences de ce mois sont déjà enregistrées.`
    )
    setTimeout(() => setApplyMsg(null), 4000)
  }

  return (

    <div className="space-y-4 md:space-y-6">

      {/* Dialog confirmation */}
      {confirmId && (
        <ConfirmDialog
          message="Cette transaction récurrente sera définitivement supprimée."
          onConfirm={() => { deleteRecurrent(confirmId); setConfirmId(null) }}
          onCancel={() => setConfirmId(null)}
        />
      )}

      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">Récurrents</h1>
          <p className="text-sm text-gray-500 mt-0.5">
             {recurrents.length} transaction(s) récurrente(s)
          </p>
        </div>
        <div className="flex gap-2">
          {recurrents.length > 0 && (
            <button
            onClick={handleApply}
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-green-200 bg-green-50 text-green-700 hover:bg-green-100 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <Play size={14} aria-hidden="true" />
              Appliquer ce mois
            </button>
          )}
           

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
              : <><Plus size={15} aria-hidden="true" /> Ajouter</>
            }
          </button>
        </div>

      </div>
      {/* Message retour après application */}
      {applyMsg && (
        <div
          role="status"
          aria-live="polite"
          className="px-4 py-3 rounded-lg border text-sm bg-blue-50 border-blue-200 text-blue-700"
        >
          {applyMsg}
        </div>
      )}

       {/* Formulaire */}

       {showForm && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 md:p-5 space-y-4">
          <h2 className="text-sm font-semibold text-gray-700">Nouvelle transaction récurrente</h2>

          {/* Type */}
          <fieldset>
            <legend className="text-xs font-medium text-gray-500 mb-2 sr-only">Type</legend>
            <div className="flex gap-2">
              {
                [
                  { value: TRANSACTION_TYPES.DEPENSE, label: '💸 Dépense' },
                  { value: TRANSACTION_TYPES.REVENU,  label: '💰 Revenu'  },

                ].map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={form.type === value}
                    onClick={() => setForm(prev => ({ ...prev, type: value, catId: '' }))}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                      form.type === value
                        ?  value === TRANSACTION_TYPES.DEPENSE
                          ? 'bg-red-50 text-red-700 border-red-300'
                          : 'bg-green-50 text-green-700 border-green-300'
                        : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {label}
                  </button>
                ))}
            </div>
          </fieldset>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormField id="rec-desc" label="Description" required error={errors.desc}>
              <Input
                id="rec-desc"
                placeholder="Ex: Loyer"
                value={form.desc}
                onChange={e => setForm(prev => ({ ...prev, desc: e.target.value }))}
                error={errors.desc}
              />
            </FormField>

            <FormField id="rec-amount" label="Montant (FCFA)" required error={errors.amount}>
              <Input
                id="rec-amount"
                type="number"
                min="0"
                placeholder="Ex: 80000"
                value={form.amount}
                onChange={e => setForm(prev => ({ ...prev, amount: e.target.value }))}
                error={errors.amount}
              />
            </FormField>

            <FormField id="rec-cat" label="Catégorie" required error={errors.catId}>
              <Select
                id="rec-cat"
                value={form.catId}
                onChange={e => setForm(prev => ({ ...prev, catId: e.target.value }))}
                error={errors.catId}
              >
                <option value="">Sélectionner...</option>
                {filteredCategories.map(c => (
                  <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>
                ))}
              </Select>
            </FormField>

            <FormField id="rec-freq" label="Fréquence">
              <Select
                id="rec-freq"
                value={form.freq}
                onChange={e => setForm(prev => ({ ...prev, freq: e.target.value }))}
              >
                <option value={FREQUENCIES.MENSUEL}>Mensuel</option>
                <option value={FREQUENCIES.HEBDOMADAIRE}>Hebdomadaire</option>
              </Select>
            </FormField>

            {form.freq === FREQUENCIES.MENSUEL && (
              <FormField id="rec-day" label="Jour du mois (1-28)" required error={errors.day}>
                <Input
                  id="rec-day"
                  type="number"
                  min="1"
                  max="28"
                  placeholder="Ex: 1"
                  value={form.day}
                  onChange={e => setForm(prev => ({ ...prev, day: e.target.value }))}
                  error={errors.day}
                />
              </FormField>
            )}
          </div>

          <button
            onClick={handleAdd}
            className="w-full sm:w-auto inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Plus size={15} aria-hidden="true" />
            Ajouter le récurrent
          </button>
          
        </div>
       )}

       {/* Liste */}
       {recurrents.length === 0 ? (
        <div className="text-center py-16 text-gray-400" role="status">
          <RefreshCw size={40} className="mx-auto mb-3 text-gray-300" aria-hidden="true" />
          <p className="text-sm font-medium">Aucune transaction récurrente</p>
          <p className="text-xs mt-1">Ajoutez votre loyer, salaire ou abonnements pour les appliquer en un clic</p>
        </div>
      ):(
        <ul className="space-y-3">
          {recurrents.map(r => {
            const cat = getCat(r.catId)

            return (
              <li
                key={r.id}
                className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-3 group"
              >
                {/* Emoji catégorie */}
                <div
                  className="w-11 h-11 rounded-xl bg-gray-50 flex items-center justify-center text-2xl flex-shrink-0"
                  aria-hidden="true"
                >
                  {cat.emoji}
                </div>

                {/* Infos */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <p className="text-sm font-medium text-gray-800 truncate">{r.desc}</p>

                    <Badge
                      label={r.type === TRANSACTION_TYPES.REVENU ? 'Revenu' : 'Dépense'}
                      color={r.type === TRANSACTION_TYPES.REVENU ? 'green' : 'red'}
                    />
                    <Badge
                      label={FREQ_LABELS[r.freq]}
                      color="blue"
                    />
                  </div>
                  <p className="text-xs text-gray-400">
                    {cat.name}
                    {r.freq === FREQUENCIES.MENSUEL && ` · Le ${r.day} de chaque mois`}
                  </p>
                </div>

                  {/* Montant */}
                  <span className={`text-sm font-semibold flex-shrink-0 ${
                  r.type === TRANSACTION_TYPES.REVENU ? 'text-green-600' : 'text-red-500'
                  }`}>
                    {r.type === TRANSACTION_TYPES.REVENU ? '+' : '-'}{formatAmount(r.amount)}
                  </span>
                {/* Supprimer */}
                <button
                  onClick={() => setConfirmId(r.id)}
                  aria-label={`Supprimer le récurrent ${r.desc}`}
                  className="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-400 rounded-md p-1 flex-shrink-0"
                >
                  <Trash2 size={16} aria-hidden="true" />
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
      
  )
}

export default Recurrents
