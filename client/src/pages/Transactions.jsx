import { useState } from 'react';
import { useTransactions } from '../hooks/useTransactions';
import Badge from '../components/ui/Badge';
import FormField from '../components/ui/FormField';
import Select from '../components/ui/Select';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import Input         from '../components/ui/Input'

import { TRANSACTION_TYPES } from '../utils/constants';
import { formatAmount } from '../utils/helpers';




const  Transactions = () => {
  
  const {
    filteredTransactions,filters,setFilters,
    form,setForm,availableMonths,
    addTransaction,deleteTransaction,exportCSV,
    categories,getCat,errors
  } = useTransactions();
  
  const [showForm, setShowForm] = useState(false);
  const [confirmId,  setConfirmId]  = useState(null);

  const catOptions = categories.filter(c => c.type === form.type || c.type === 'both');

  const handleAdd = () => {
    
    const ok = addTransaction();
    if (ok) setShowForm(false);
    
  }
  const handleDelete = () => {
    deleteTransaction(confirmId)
    setConfirmId(null)
  }

  

  


  return (
    <div className="space-y-4 md:space-y-6">

      {/* Dialog de confirmation */}
      {confirmId && (
        <ConfirmDialog
          message="Cette transaction sera définitivement supprimée. Continuer ?"
          onConfirm={handleDelete}
          onCancel={() => setConfirmId(null)}
        />
      )}
      

      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">Transactions</h1>
        <div className="flex gap-2">
          <button
            onClick={exportCSV}
            className="flex items-center px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            📤 Export CSV
          </button>
          <button
            onClick={() => { setShowForm(prev => !prev)}}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >{showForm ? '✕ Annuler' : '+ Ajouter'}</button>
        </div>
      </div>

      {/* Formulaire d'ajout */}

      {showForm && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 md:p-5 space-y-4">
          <h2 className="text-sm font-semibold text-gray-700">Nouvelle transaction</h2>

          {/* Sélecteur de type */}
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
                    onClick={() => setForm(prev => ({...prev, type: value, catId: ''}))}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                      form.type === value
                      ? value === TRANSACTION_TYPES.DEPENSE
                        ? 'bg-red-50 text-red-700 border-red-300'
                        : 'bg-green-50 text-green-700 border-green-300'
                      : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-500'
                    }`}
                  >
                {label}
              </button>
              ))}
              
            </div>
          </fieldset>
          


          {/* Champs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormField id="description" label="Description" required error={errors.desc}>
              <Input
                id="description"
                type="text"
                placeholder="Ex: Courses alimentaires"
                value={form.desc}
                onChange={e => setForm(prev => ({ ...prev, desc: e.target.value }))}
                error={errors.desc}
              />
            </FormField>
            <FormField id="amount" label="Montant (FCFA)" required error={errors.amount}>
              <Input
                id="amount"
                type="number"
                placeholder="0"
                min="0"
                value={form.amount}
                onChange={e => setForm(prev =>({...prev,amount:e.target.value}))}
                error={errors.amount}
              />
            </FormField>
            <FormField id="category" label="Catégorie">
              <Select
                id="category"
                value={form.catId}
                onChange={e => setForm(prev => ({ ...prev, catId: e.target.value }))}
              >
                <option value="">Sélectionner...</option>
                {
                  catOptions.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.emoji} {c.name}
                    </option>
                  ))
                }
              </Select>
            </FormField>

            <FormField id="date" label="Date" required error={errors.date}>
              <Input
                id="date"
                type="date"
                value={form.date}
                onChange={e => setForm(prev => ({ ...prev, date: e.target.value }))}
                error={errors.date}
              />
            </FormField>
            
          </div>
          
          <button
            onClick={handleAdd}
            className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >Ajouter la transaction ↗</button>

        </div>
      )}

      

      {/* Filtres */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 md:p-4">
        <fieldset>
          <legend className="text-xs font-medium text-gray-500 mb-2 sr-only">Filtres</legend>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Select
              id="filter-type"
              value={filters.type}
              onChange={e => setFilters(prev => ({ ...prev, type: e.target.value }))}
              aria-label="Filtrer par type"
            >
              <option value="all">Tous les types</option>
              <option value={TRANSACTION_TYPES.DEPENSE}>💸 Dépenses</option>
              <option value={TRANSACTION_TYPES.REVENU}>💰 Revenus</option>
            </Select>
            <Select
              id="filter-cat"
              value={filters.catId}
              onChange={e =>setFilters(prev => ({ ...prev, catId: e.target.value }))}
              aria-label="Filtrer par catégorie"
            >
              <option value="all">Toutes catégories</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>
              ))}
            </Select>
            <Select
              id="filter-month"
              value={filters.month}
              onChange={e => setFilters(prev => ({ ...prev, month: e.target.value }))}
              aria-label="Filtrer par mois"
            >
              <option value="all">Tous les mois</option>
              {availableMonths.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}

            </Select>
          </div>
        </fieldset>

      </div>

      {/* Résumé filtré */}
      <div className="flex flex-wrap gap-3 text-sm text-gray-500" aria-live="polite">
        <span>{filteredTransactions.length} transaction(s)</span>
        <span aria-hidden="true">·</span>
        <span className="text-green-600 font-medium"> 
          + {formatAmount(filteredTransactions.filter(t => t.type === TRANSACTION_TYPES.REVENU).reduce((s, t) => s + t.amount, 0))}
        </span>
        <span aria-hidden="true">·</span>
        <span className="text-red-500 font-medium"> 
          - {formatAmount(filteredTransactions.filter(t => t.type === TRANSACTION_TYPES.DEPENSE).reduce((s, t) => s + t.amount, 0))}
        </span>
      </div>

      {/* Liste des transactions */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {
          filteredTransactions.length === 0 ? (
            <div className="text-center py-12 text-gray-400" role="status">
              <p className="text-3xl mb-2" aria-hidden="true">🔍</p>
              <p className="text-sm text-gray-500">Aucune transaction trouvée</p>
            </div>
          ) :(
            <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm" role="table">
                <caption className="sr-only">Liste des transactions</caption>
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                <th scope="col" className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Transaction</th>
                <th scope="col" className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Catégorie</th>
                <th scope="col" className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Date</th>
                <th scope="col" className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Type</th>
                <th scope="col" className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Montant</th>
                <th scope="col" className="px-5 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {
                filteredTransactions.map(t => {
                  const cat = getCat(t.catId);
                  
                  return(
                    <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <span 
                            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-base flex-shrink-0" 
                            aria-hidden="true"
                          >
                            {cat.emoji}
                          </span>
                          <span className="font-medium text-gray-800">{t.desc}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-gray-500">{cat.name}</td>
                      <td className="px-5 py-3.5 text-gray-500">{t.date}</td>
                      <td className="px-5 py-3.5">
                        <Badge
                            label={t.type === TRANSACTION_TYPES.REVENU ? 'Revenu' : 'Dépense'}
                            color={t.type === TRANSACTION_TYPES.REVENU ? 'green' : 'red'}
                        />
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <span className={`font-semibold ${t.type === TRANSACTION_TYPES.REVENU ? 'text-green-600' : 'text-red-500'}`}>
                          {t.type === TRANSACTION_TYPES.REVENU ? '+' : '-'}{formatAmount(t.amount)}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                          <button
                            onClick={() => setConfirmId(t.id)}
                            className="text-gray-300 hover:text-red-500 transition-colors text-lg"
                            aria-label="Supprimer"
                          >
                            🗑️
                          </button>
                      </td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
        </div>


        {/* Vue mobile — cartes */}
        <ul className="md:hidden divide-y divide-gray-50" aria-label="Liste des transactions">
          {filteredTransactions.map(t =>{
            const cat = getCat(t.catId);

            return (
              <li key={t.id} className="flex items-center gap-3 p-4">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lg flex-shrink-0">
                  {cat.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{t.desc}</p>
                  <p className="text-xs text-gray-400">{cat.name} · {t.date}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={` text-sm font-semibold ${t.type === 'revenu' ? 'text-green-600' : 'text-red-500'}`}>
                    {t.type === TRANSACTION_TYPES.REVENU ? '+' : '-'}{formatAmount(t.amount)}
                  </span>
                  <button
                    onClick={() => setConfirmId(t.id)}
                    className="text-gray-300 hover:text-red-500 transition-colors"
                    aria-label={`Supprimer ${t.desc}`}
                  >
                    🗑️
                  </button>
                </div>
              </li>
            )
          } )}
        </ul>
        </>
        )}
            
      </div>
    </div>
  )
}

export default Transactions ;
