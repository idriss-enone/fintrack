import { useState } from 'react';
import { CATEGORY_TYPES } from '../utils/constants';
import FormField from '../components/ui/FormField';
import Select from '../components/ui/Select';
import Input from '../components/ui/Input';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import Badge         from '../components/ui/Badge';
import { Trash2, Plus, X, Tag } from 'lucide-react';
import { useCategories } from '../hooks/useCategories';

// Labels lisibles pour les types
const TYPE_LABELS = {
  [CATEGORY_TYPES.DEPENSE]: { label: 'Dépense', color: 'red'   },
  [CATEGORY_TYPES.REVENU]:  { label: 'Revenu',  color: 'green' },
  [CATEGORY_TYPES.BOTH]:    { label: 'Les deux', color: 'blue' },
}

console.log(Object.entries(TYPE_LABELS));


// Emojis suggérés pour aider l'utilisateur
const EMOJI_SUGGESTIONS = [
  '🛒','🚌','🏠','💊','🎉','💼','💻','📦',
  '✈️','🍔','👗','📚','🎮','💡','🏋️','🐾',
  '🎓','💰','🏦','🛠️','🎵','🏥','🚿','🌿',
]

const Categories = () => {
  const {
    grouped,
    form, setForm, errors,
    addCategory,deleteCategory
  } = useCategories();
  const [showForm,  setShowForm]  = useState(false);
  const [confirmId, setConfirmId] = useState(null);

  const handleAdd = () => {
    const ok = addCategory();
    if (ok) setShowForm(false)
  }
console.log(confirmId); 
  return (
    <div className="space-y-4 md:space-y-6">

      {/* Dialog confirmation */}
      {confirmId && (
        <ConfirmDialog
          message="Cette catégorie sera définitivement supprimée. Les transactions associées ne seront pas supprimées."
          onConfirm={() => { deleteCategory(confirmId); setConfirmId(null) }}
          onCancel={() => setConfirmId(null)}
        />
      )}

      {/* En-tête */}
      <div 
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"
      >
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">Catégories</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {Object.values(grouped).flat().length} catégorie(s) au total
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
            : <><Plus size={15} aria-hidden="true" /> Nouvelle catégorie</>
          }
        </button>
      </div>
      {/* Formulaire d'ajout */}
      {showForm && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 md:p-5 space-y-4">
          <h2 className="text-sm font-semibold text-gray-700">Nouvelle catégorie</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <FormField id="cat-name" label="Nom" required error={errors.name}>
              <Input
                id="cat-name"
                placeholder="Ex: Santé"
                value={form.name}
                onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                error={errors.name}
              />
            </FormField>

            <FormField id="cat-emoji" label="Emoji" required error={errors.emoji}>
              <Input
                id="cat-emoji"
                placeholder="Ex: 💊"
                value={form.emoji}
                onChange={e => setForm(prev => ({ ...prev, emoji: e.target.value }))}
                error={errors.emoji}
              />
            </FormField>

            <FormField id="cat-type" label="Type">
              <Select
                id="cat-type"
                value={form.type}
                onChange={e => setForm(prev => ({ ...prev, type: e.target.value }))}
              >
                <option value={CATEGORY_TYPES.DEPENSE}>Dépense</option>
                <option value={CATEGORY_TYPES.REVENU}>Revenu</option>
                <option value={CATEGORY_TYPES.BOTH}>Les deux</option>
              </Select>
            </FormField>
          </div>

          {/* Suggestions d'emojis */}
          <div>
            <p className="text-xs text-gray-500 mb-2">Suggestions :</p>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Emojis suggérés">
              {EMOJI_SUGGESTIONS.map(emoji => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, emoji }))}
                  aria-label={`Sélectionner l'emoji ${emoji}`}
                  className={`w-9 h-9 rounded-lg text-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    form.emoji === emoji 
                    ? 'bg-blue-100 ring-2 ring-blue-400'
                    : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                    }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={handleAdd}
            className="
            w-full sm:w-auto inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white 
            text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors focus:outline-none 
            focus:ring-2 focus:ring-blue-500"
          >
            <Plus size={15} aria-hidden="true" />
            Ajouter la catégorie
          </button>
      </div>
      )}
      

          {/* Liste groupée par type */}

          {
            Object.entries(TYPE_LABELS).map(([type, { label, color }]) =>{
              const cats = grouped[type];
              if (!cats || cats.length === 0) return null
              return(
                <section key={type} aria-labelledby={`section-${type}`}>
                  <div className="flex items-center gap-2 mb-3">
                    <Tag size={15} className="text-gray-400" aria-hidden="true" />
                    <h2
                      id={`section-${type}`}
                      className="text-sm font-semibold text-gray-600 uppercase tracking-wide"
                    >
                      {label}
                    </h2>
                    <span className="text-xs text-gray-400">({cats.length})</span>
                  </div>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {cats.map(cat => (
                      <li
                        key={cat.id}
                        className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 
                        flex items-center gap-3 group"
                      >
                        {/* Emoji */}
                        <div
                          className="w-11 h-11 rounded-xl bg-gray-50 flex items-center 
                          justify-center text-2xl flex-shrink-0"
                          aria-hidden="true"
                        >
                          {cat.emoji}
                        </div>
                        {/* Infos */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">{cat.name}</p>
                          <Badge label={label} color={color} />
                        </div>

                        {/* Supprimer */}
                        <button
                        type="button"
                          onClick={() => setConfirmId(cat.id)}
                          aria-label={`Supprimer la catégorie ${cat.name}`}
                          className="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-400 rounded-md p-1"
                        >
                          <Trash2 size={16} aria-hidden="true" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>
              )
            })
          }

          {/* État vide */}
          {Object.values(grouped).flat().length === 0 && (
            <div className="text-center py-16 text-gray-400" role="status">
              <Tag size={40} className="mx-auto mb-3 text-gray-300" aria-hidden="true" />
              <p className="text-sm font-medium">Aucune catégorie</p>
              <p className="text-xs mt-1">Cliquez sur "Nouvelle catégorie" pour commencer</p>
            </div>
          )}
      
    </div>
  )
}

export default Categories
