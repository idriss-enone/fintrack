import { useState, useMemo } from 'react'
import { useApp } from '../context/AppContext';
import { 
    getTodayDate,
    extractMonths
} from '../utils/helpers';
import { TRANSACTION_TYPES } from '../utils/constants';

// Valeurs initiales du formulaire
const INITIAL_FORM = {
  desc:   '',
  amount: '',
  type:   TRANSACTION_TYPES.DEPENSE,
  catId:  '',
  date:   getTodayDate(),
}

// Valeurs initiales des filtres
const INITIAL_FILTERS = {
  type:  'all',
  catId: 'all',
  month: 'all',
}

export function useTransactions(){

    const { transactions, setTransactions, categories, getCat, fmt } = useApp();
    const [filters, setFilters] = useState(INITIAL_FILTERS);
    const [form, setForm] = useState(INITIAL_FORM);
    const [errors,  setErrors]  = useState({})
    
    // Mois disponibles dans les transactions
    const availableMonths = useMemo(
        () => extractMonths(transactions),
        [transactions]
    )

    // Transactions filtrées
    const filteredTransactions = useMemo(() => {
        return transactions.filter(t => {
            const matchType = filters.type === 'all' || t.type === filters.type;
            const matchCat = filters.catId === 'all' || t.catId === parseInt(filters.catId);
            const matchMonth = filters.month === 'all' || t.date.startsWith(filters.month);
            
            return matchType && matchCat && matchMonth;
        });
    }, [transactions, filters]);

    // Validation du formulaire
    const validate = () => {
        const newErrors = {};
        if (!form.desc.trim())  newErrors.desc   = 'La description est requise.';
        if (!form.amount || parseFloat(form.amount) <= 0)
                            newErrors.amount  = 'Le montant doit être supérieur à 0.';
        if (!form.date)         newErrors.date   = 'La date est requise.';

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    // Ajouter une transaction
    const addTransaction = () => {
        if (!validate()) return false

        const catId = form.catId
        ? parseInt(form.catId)
        : categories.filter(c => c.type === form.type || c.type === 'both')[0]?.id;

        const newTransaction = {
            id: Date.now(),
            desc: form.desc.trim(),
            amount: parseFloat(form.amount),
            type: form.type,
            catId,
            date: form.date,
        }

        setTransactions(prev => [newTransaction, ...prev]);
        setForm(prev => ({ ...prev, desc: '', amount: '', catId: '' }));
        return true
    }

    // Supprimer une transaction
    const deleteTransaction = (id) => {
        setTransactions(prev => prev.filter(t => t.id !== id));
    }

    // Export CSV
  const exportCSV = () => {
    const headers = ['Date', 'Description', 'Type', 'Catégorie', 'Montant']
    const rows = filteredTransactions.map(t => [
      t.date, t.desc, t.type, getCat(t.catId).name, t.amount
    ]);
     const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
     const a = document.createElement('a');
     a.href = 'data:text/csv;charset=utf-8,\uFEFF' + encodeURIComponent(csv);
     a.download = `transactions-${filters.month !== 'all' ? filters.month : 'tout'}.csv`
     a.click()
  }

    return {
        transactions,filteredTransactions , filters, setFilters,
        availableMonths,getCat,fmt,form,setForm,categories,
        addTransaction,deleteTransaction,exportCSV,errors

    }
}
