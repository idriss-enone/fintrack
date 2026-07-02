import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { generateId, calcPercent,formatAmount } from '../utils/helpers'

const INITIAL_FORM = {
  name:   '',
  target: '',
  saved:  '',
}
const INITIAL_ERRORS = {
  name:  '',
  target: '',
  saved: '',
   
}


export function useGoals() {

     const { goals, setGoals } = useApp();
     const [form,   setForm]   = useState(INITIAL_FORM);
     const [errors, setErrors] = useState(INITIAL_ERRORS);

      // Validation
  const validate = () => {
    const newErrors = {}
    if (!form.name.trim()) newErrors.name = 'Le nom est requis.'
    if (!form.target || parseFloat(form.target) <= 0)
      newErrors.target = 'Le montant cible doit être supérieur à 0.'
    if (form.saved && parseFloat(form.saved) > parseFloat(form.target))
      newErrors.saved = 'Le montant épargné ne peut pas dépasser la cible.'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

    // Ajouter un objectif
  const addGoal = () => {
    if (!validate()) return false
    setGoals(prev => [
      ...prev,
      {
        id:     generateId(),
        name:   form.name.trim(),
        target: parseFloat(form.target),
        saved:  parseFloat(form.saved) || 0,
      },
    ])
    setForm(INITIAL_FORM)
    setErrors({})
    return true
  }

    // Supprimer un objectif
  const deleteGoal = (id) => {
    setGoals(prev => prev.filter(g => g.id !== id))
  }

  // Mettre à jour le montant épargné
  const updateSaved = (id, amount) => {
    setGoals(prev => prev.map(g => {
      if (g.id !== id) return g
      const newSaved = Math.min(g.target, Math.max(0, g.saved + amount))
      return { ...g, saved: Math.round(newSaved) }
    }))
  }
  // Objectifs enrichis avec % et statut
  const enrichedGoals = goals.map(g => ({
    ...g,
    percent:   calcPercent(g.saved, g.target),
    remaining: g.target - g.saved,
    completed: g.saved >= g.target,
  }))

   return {
    enrichedGoals,
    form, setForm, errors,
    addGoal, deleteGoal,
    formatAmount,updateSaved
    
  }
}