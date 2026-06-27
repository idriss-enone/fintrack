import { useState } from 'react';
import { useTransactions } from '../hooks/useTransactions';
import Badge from '../components/ui/Badge';

const  Transactions = () => {
  
  const {
    filteredTransactions,filters,setFilters,
    form,setForm,availableMonths,
    addTransaction,deleteTransaction,exportCSV,
    categories,getCat,fmt,
  } = useTransactions();
  
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');

  const catOptions = categories.filter(c => c.type === form.type || c.type === 'both');

  const handleAdd = () => {
    if (!form.desc.trim() || !form.amount || !form.date) {
      setError('Merci de remplir tous les champs obligatoires.')
      return;
    }
    
    addTransaction();
    setError('');
    setShowForm(false);
    
  }

  

  


  return (
    <div className="space-y-4 md:space-y-6">

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

          {/* Type */}
          <div className="flex gap-2">
            {['depense', 'revenu'].map(t => (
              <button
                key={t}
                onClick={() => setForm(prev => ({...prev, type: t, catId: ''}))}
                className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                  form.type === t
                  ? t === 'depense'
                    ? 'bg-red-50 text-red-700 border-red-300'
                    : 'bg-green-50 text-green-700 border-green-300'
                  : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-500'
                }`}
              >
                {t === 'depense' ? '💸 Dépense' : '💰 Revenu'}
              </button>
            ))}
          </div>


          {/* Champs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label 
                htmlFor="description" 
                className="block text-xs text-gray-500 mb-1"
                >Description *</label>
              <input
                type="text"
                id="description"
                placeholder="Ex: Courses alimentaires"
                value={form.desc}
                onChange={e => setForm(prev =>({...prev,desc:e.target.value}))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor='amount' className="block text-xs text-gray-500 mb-1">Montant (FCFA) *</label>
              <input
                type="number"
                id="amount"
                placeholder="0"
                min="0"
                value={form.amount}
                onChange={e => setForm(prev =>({...prev,amount:e.target.value}))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-xs text-gray-500 mb-1">Catégorie</label>
              <select
                id="category"
                value={form.catId}
                onChange={e => setForm(prev => ({ ...prev, catId: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sélectionner...</option>
                {
                  catOptions.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.emoji} {c.name}
                    </option>
                  ))
                }
              </select>
            </div>

            <div>
              <label htmlFor="date" className="block text-xs text-gray-500 mb-1">Date *</label>
              <input
                type="date"
                id="date"
                value={form.date}
                onChange={e => setForm(prev => ({ ...prev, date: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
          </div>
          {
            error && <p className="text-xs text-red-500">{error}</p>
          }

          

          <button
            onClick={handleAdd}
            className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >Ajouter la transaction ↗</button>

        </div>
      )}

      

      {/* Filtres */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 md:p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <select
          value={filters.type}
          onChange={e => setFilters(prev => ({ ...prev, type: e.target.value }))}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tous les types</option>
            <option value="depense">💸 Dépenses</option>
            <option value="revenu">💰 Revenus</option>
          </select>

           <select
           value={filters.catId}
           onChange={e =>setFilters(prev => ({ ...prev, catId: e.target.value }))}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Toutes catégories</option>
            {
              categories.map(c => (
                <option key={c.id} value={c.id}>
                  {c.emoji} {c.name}
                </option>
              ))
            }
          </select>

           <select
            value={filters.month}
            onChange={e => setFilters(prev => ({ ...prev, month: e.target.value }))}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tous les mois</option>
            {
              availableMonths.map(m => (
                <option key={m} value={m}>{m}</option>
              ))
            }
            
          </select>
        </div>

      </div>

      {/* Résumé filtré */}
      <div className='flex flex-wrap gap-3 text-sm text-gray-500'>
        <span>{filteredTransactions.length} transaction(s)</span>
        <span>·</span>
        <span className="text-green-600 font-medium"> 
          + {fmt(filteredTransactions.filter(t => t.type === 'revenu').reduce((s, t) => s + t.amount, 0))}
        </span>
        <span>·</span>
        <span className="text-red-500 font-medium"> 
          - {fmt(filteredTransactions.filter(t => t.type === 'depense').reduce((s, t) => s + t.amount, 0))}
        </span>
      </div>

      {/* Liste des transactions */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {
          filteredTransactions.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-3xl mb-2">🔍</p>
              <p className="text-sm text-gray-500">Aucune transaction trouvée</p>
            </div>
          ) :(
            <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Transaction</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Catégorie</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Date</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Type</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Montant</th>
                <th className="px-5 py-3"></th>
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
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-base flex-shrink-0">
                            {cat.emoji}
                          </div>
                          <span className="font-medium text-gray-800">{t.desc}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-gray-500">{cat.name}</td>
                      <td className="px-5 py-3.5 text-gray-500">{t.date}</td>
                      <td className="px-5 py-3.5">
                        <Badge
                            label={t.type === 'revenu' ? 'Revenu' : 'Dépense'}
                            color={t.type === 'revenu' ? 'green' : 'red'}
                        />
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <span className={`font-semibold ${t.type === 'revenu' ? 'text-green-600' : 'text-red-500'}`}>
                          {t.type === 'revenu' ? '+' : '-'}{fmt(t.amount)}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                          <button
                            onClick={() => deleteTransaction(t.id)}
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
        <div className="md:hidden divide-y divide-gray-50">
          {filteredTransactions.map(t =>{
            const cat = getCat(t.catId);

            return (
              <div key={t.id} className="flex items-center gap-3 p-4">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lg flex-shrink-0">
                  {cat.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{t.desc}</p>
                  <p className="text-xs text-gray-400">{cat.name} · {t.date}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={` text-sm font-semibold ${t.type === 'revenu' ? 'text-green-600' : 'text-red-500'}`}>
                    {t.type === 'revenu' ? '+' : '-'}{fmt(t.amount)}
                  </span>
                  <button
                    onClick={() => deleteTransaction(t.id)}
                    className="text-gray-300 hover:text-red-500 transition-colors"
                    aria-label="Supprimer"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            )
          } )}
        </div>
        </>
        )}
            
      </div>
    </div>
  )
}

export default Transactions ;
