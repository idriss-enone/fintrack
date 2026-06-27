import { useState, useMemo } from 'react'
import { useApp } from '../context/AppContext'

export function useTransactions(){

    const { transactions, setTransactions, categories, getCat, fmt } = useApp();
    const [filters, setFilters] = useState({ type: 'all', catId: 'all', month: 'all' });
    const [form, setForm] = useState({
        desc: '', amount: '', type: 'depense', catId: '', date: new Date().toISOString().split('T')[0],
    });
    
    // Mois disponibles dans les transactions
    const availableMonths = useMemo(() => {
        const months = [...new Set(transactions.map(t => t.date.slice(0, 7)))]
        return months.sort().reverse()
    },[transactions])

    // Transactions filtrées
    const filteredTransactions = useMemo(() => {
        return transactions.filter(t => {
            const matchType = filters.type === 'all' || t.type === filters.type;
            const matchCat = filters.catId === 'all' || t.catId === parseInt(filters.catId);
            const matchMonth = filters.month === 'all' || t.date.startsWith(filters.month);
            
            return matchType && matchCat && matchMonth;
        });
    }, [transactions, filters]);

    // Ajouter une transaction
    const addTransaction = () => {
        if (!form.desc.trim() || !form.amount || !form.date) return false

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
        addTransaction,deleteTransaction,exportCSV

    }
}
