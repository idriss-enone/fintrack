import { useApp } from '../context/AppContext'
import { useState, useMemo } from 'react';
import { TRANSACTION_TYPES, CATEGORY_TYPES, FREQUENCIES } from '../utils/constants';
import { generateId,getCurrentMonth } from '../utils/helpers';

const INITIAL_FORM = {
  desc:  '',
  amount: '',
  type:  TRANSACTION_TYPES.DEPENSE,
  catId: '',
  freq:  FREQUENCIES.MENSUEL,
  day:   '1',
}

const INITIAL_ERRORS = {
  desc: '',
  amount: '',
  catId: '',
  day: ''
}

export function useRecurrents() {

    const {
        recurrents,setRecurrents,transactions,
        setTransactions,categories, getCat,
    } = useApp();

    const [form,   setForm]   = useState(INITIAL_FORM)
    const [errors, setErrors] = useState(INITIAL_ERRORS);

    const currentMonth = getCurrentMonth()


      // Catégories filtrées selon le type sélectionné
    const filteredCategories = useMemo(
        () => categories.filter(c => c.type === form.type || c.type === CATEGORY_TYPES.BOTH),
        [categories, form.type]
    )

    // Validation
    const validate = () => {
        const newErrors = {}
        console.log(newErrors)
        if (!form.desc.trim()) newErrors.desc = 'La description est requise.'
        if (!form.amount || parseFloat(form.amount) <= 0)
                            newErrors.amount  = 'Le montant doit être supérieur à 0.'
        if (!form.catId) newErrors.catId  = 'Sélectionnez une catégorie.'
        if (form.freq === FREQUENCIES.MENSUEL) {
            const day = parseInt(form.day)
            if (!day || day < 1 || day > 28) newErrors.day = 'Jour invalide (1-28).'
        }
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    // Ajouter un récurrent
    const addRecurrent = () =>{
        if (!validate()) return false;

        setRecurrents(prev => [
        ...prev,
        {
            id:     generateId(),
            desc:   form.desc.trim(),
            amount: parseFloat(form.amount),
            type:   form.type,
            catId:  parseInt(form.catId),
            freq:   form.freq,
            day:    parseInt(form.day) || 1,
        },
        ])
        setForm(INITIAL_FORM)
        setErrors(INITIAL_ERRORS)
        return true;
    }

    // Supprimer un récurrent
    const deleteRecurrent = (id) => {
        setRecurrents(prev => prev.filter(r => r.id !== id))
    }

    // Appliquer les récurrents du mois en cours
    const applyRecurrents = () => {
        let added = 0;
        const newTransactions = [];

        recurrents
            .filter(r => r.freq === FREQUENCIES.MENSUEL)
            .forEach(r => {
                const day = String(r.day).padStart(2, '0');
                const dateStr = `${currentMonth}-${day}`
                console.log(dateStr);

                // Vérifier si la transaction existe déjà ce mois
                const exists = transactions.some(
                    t => t.desc === r.desc && t.date === dateStr && t.type === r.type
                );
                if (!exists) {
                    newTransactions.push({
                        id: generateId(),
                        desc: r.desc,
                        amount: r.amount,
                        type:   r.type,
                        catId:  r.catId,
                        date: dateStr,
                    });
                    added++
                }
            })
        
        if (added > 0) {
            setTransactions(prev => [...newTransactions, ...prev])
        }

        return added
    }


    return {
        recurrents,filteredCategories,
        getCat,addRecurrent,deleteRecurrent,
        applyRecurrents,
        form, setForm, errors,
    }

}