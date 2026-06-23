import { createContext, useContext, useState } from 'react'
import {
  mockCategories,
  mockTransactions,
  mockBudgets,
  mockRecurrents,
  mockGoals,
} from '../data/mockData'

const AppContext = createContext()

export function AppProvider({ children }) {
  const [categories,  setCategories]  = useState(mockCategories)
  const [transactions, setTransactions] = useState(mockTransactions)
  const [budgets,     setBudgets]     = useState(mockBudgets)
  const [recurrents,  setRecurrents]  = useState(mockRecurrents)
  const [goals,       setGoals]       = useState(mockGoals)

  // Utilitaires
  const getCat = (id) => categories.find(c => c.id === id) || { name: 'Autre', emoji: '📦' }
  const fmt = (n) => new Intl.NumberFormat('fr-FR').format(Math.round(n)) + ' FCFA'

  return (
    <AppContext.Provider value={{
      categories,  setCategories,
      transactions, setTransactions,
      budgets,     setBudgets,
      recurrents,  setRecurrents,
      goals,       setGoals,
      getCat,
      fmt,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)