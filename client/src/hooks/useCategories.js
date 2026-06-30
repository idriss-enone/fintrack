import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORY_TYPES } from '../utils/constants'
import { generateId } from '../utils/helpers';

const INITIAL_FORM = {
  name:  '',
  emoji: '',
  type:  CATEGORY_TYPES.DEPENSE,
}

const INITIAL_ERRORS = {
  name:  '',
  emoji: '',
}

export function useCategories() {
    const { categories, setCategories } = useApp();
    const [form,   setForm]   = useState(INITIAL_FORM)
    const [errors, setErrors] = useState(INITIAL_ERRORS);

    // Validation
    const validate = () => {
        const newErrors = {}
        if (!form.name.trim())  newErrors.name  = 'Le nom est requis.'
        if (!form.emoji.trim()) newErrors.emoji = 'Un emoji est requis.'
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    // Ajouter une catégorie
    const addCategory = () => {
        if (!validate()) return false;
        setCategories(prev => [
            ...prev,
            {
                id:    generateId(),
                name:  form.name.trim(),
                emoji: form.emoji.trim(),
                type:  form.type,
            },
        ])
        setForm(INITIAL_FORM)
        setErrors(INITIAL_ERRORS)
        return true
    }

    // Supprimer une catégorie
    const deleteCategory = (id) => {
        setCategories(prev => prev.filter(c => c.id !== id))
    }

    // Catégories groupées par type
    const grouped = {
        [CATEGORY_TYPES.DEPENSE]: categories.filter(c => c.type === CATEGORY_TYPES.DEPENSE),
        [CATEGORY_TYPES.REVENU]:  categories.filter(c => c.type === CATEGORY_TYPES.REVENU),
        [CATEGORY_TYPES.BOTH]:    categories.filter(c => c.type === CATEGORY_TYPES.BOTH),
    }

    return {
    categories,grouped,
    form, setForm, errors,
    addCategory,deleteCategory
  }
}