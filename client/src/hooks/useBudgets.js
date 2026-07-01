import { useState,useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORY_TYPES, TRANSACTION_TYPES } from '../utils/constants'
import { generateId, getCurrentMonth,calcPercent } from '../utils/helpers'



const INITIAL_ERRORS = {}
const INITIAL_FORM = { catId: '', limit: '' }

export function useBudgets() {
    const { budgets,setBudgets,categories,transactions,getCat } = useApp();
   
    const [form,   setForm]   = useState(INITIAL_FORM)
    const [errors, setErrors] = useState(INITIAL_ERRORS);

     const currentMonth = getCurrentMonth();

    // Catégories de type dépense uniquement (un budget ne concerne que les dépenses)
    const expenseCategories = useMemo(
        () => categories.filter(c => c.type === CATEGORY_TYPES.DEPENSE || c.type === CATEGORY_TYPES.BOTH),
        [categories]
    );
    

    // Catégories qui n'ont pas encore de budget défini
    const availableCategories = useMemo(
        () => expenseCategories.filter(c => !budgets.some(b => b.catId === c.id)),
    [expenseCategories, budgets]);

    // Budgets enrichis avec le montant dépensé ce mois-ci et le %

    const enrichedBudgets = useMemo(() => {
        return budgets.map(b => {
            const spent = transactions
            .filter(t =>
                t.type === TRANSACTION_TYPES.DEPENSE &&
                t.catId === b.catId &&
                t.date.startsWith(currentMonth)
            ).reduce((sum, t) => sum + t.amount, 0);

            const percent = calcPercent(spent, b.limit)
            const status  = percent >= 100 ? 'danger' : percent >= 80 ? 'warn' : 'ok';
            return { ...b, spent,percent, status, category: getCat(b.catId) }
        })
    },[budgets,transactions,currentMonth,getCat]);

     // Validation
  const validate = () => {
    const newErrors = {};
    if (!form.catId) newErrors.catId = 'Sélectionnez une catégorie.';
    if (!form.limit || parseFloat(form.limit) <= 0) newErrors.limit = 'Le plafond doit être supérieur à 0.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }
      // Ajouter un budget
  const addBudget = () => {
    if (!validate()) return false;

    setBudgets(prev => [
      ...prev,
      { id: generateId(), catId: parseInt(form.catId), limit: parseFloat(form.limit) },
    ]);

    setForm(INITIAL_FORM);
    setErrors(INITIAL_ERRORS);
    return true;
  }
  
  // Supprimer un budget
  const deleteBudget = (id) => {
    setBudgets(prev => prev.filter(b => b.id !== id))
  }

    return {
    form, setForm, errors,
    addBudget,deleteBudget,
    availableCategories,enrichedBudgets
  }
}