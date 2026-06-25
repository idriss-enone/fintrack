// ============================================================
// CATÉGORIES
// ============================================================
export const mockCategories = [
  { id: 1, name: 'Alimentation', emoji: '🛒', type: 'depense' },
  { id: 2, name: 'Transport',    emoji: '🚌', type: 'depense' },
  { id: 3, name: 'Logement',     emoji: '🏠', type: 'depense' },
  { id: 4, name: 'Santé',        emoji: '💊', type: 'depense' },
  { id: 5, name: 'Loisirs',      emoji: '🎉', type: 'depense' },
  { id: 6, name: 'Salaire',      emoji: '💼', type: 'revenu'  },
  { id: 7, name: 'Freelance',    emoji: '💻', type: 'revenu'  },
  { id: 8, name: 'Autre',        emoji: '📦', type: 'both'    },
]

// ============================================================
// TRANSACTIONS
// ============================================================
export const mockTransactions = [
  { id: 1,  desc: 'Salaire mars',      amount: 350000, type: 'revenu',  catId: 6, date: '2025-03-01' },
  { id: 2,  desc: 'Loyer',             amount: 80000,  type: 'depense', catId: 3, date: '2025-03-02' },
  { id: 3,  desc: 'Courses marché',    amount: 25000,  type: 'depense', catId: 1, date: '2025-03-05' },
  { id: 4,  desc: 'Taxi',              amount: 5000,   type: 'depense', catId: 2, date: '2025-03-06' },
  { id: 5,  desc: 'Freelance design',  amount: 75000,  type: 'revenu',  catId: 7, date: '2025-03-10' },
  { id: 6,  desc: 'Pharmacie',         amount: 12000,  type: 'depense', catId: 4, date: '2025-03-12' },
  { id: 7,  desc: 'Restaurant',        amount: 18000,  type: 'depense', catId: 5, date: '2025-03-14' },
  { id: 8,  desc: 'Salaire avril',     amount: 350000, type: 'revenu',  catId: 6, date: '2025-04-01' },
  { id: 9,  desc: 'Loyer',             amount: 80000,  type: 'depense', catId: 3, date: '2025-04-02' },
  { id: 10, desc: 'Courses',           amount: 30000,  type: 'depense', catId: 1, date: '2025-04-08' },
  { id: 11, desc: 'Transport taxi',    amount: 8000,   type: 'depense', catId: 2, date: '2025-04-10' },
  { id: 12, desc: 'Salaire mai',       amount: 350000, type: 'revenu',  catId: 6, date: '2025-05-01' },
  { id: 13, desc: 'Loyer',             amount: 80000,  type: 'depense', catId: 3, date: '2025-05-02' },
  { id: 14, desc: 'Alimentation',      amount: 42000,  type: 'depense', catId: 1, date: '2025-05-07' },
  { id: 15, desc: 'Clinique',          amount: 35000,  type: 'depense', catId: 4, date: '2025-05-15' },
  { id: 16, desc: 'Clinique',          amount: 35000,  type: 'depense', catId: 4, date: '2026-06-25' },
  { id: 17,  desc: 'Salaire juin',     amount: 350000, type: 'revenu',  catId: 6, date: '2026-06-25' },
]

// ============================================================
// BUDGETS MENSUELS
// ============================================================
export const mockBudgets = [
  { id: 1, catId: 1, limit: 40000  },
  { id: 2, catId: 3, limit: 85000  },
  { id: 3, catId: 2, limit: 15000  },
  { id: 4, catId: 4, limit: 20000  },
]

// ============================================================
// TRANSACTIONS RÉCURRENTES
// ============================================================
export const mockRecurrents = [
  { id: 1, desc: 'Loyer',   amount: 80000,  type: 'depense', catId: 3, freq: 'mensuel', day: 2 },
  { id: 2, desc: 'Salaire', amount: 350000, type: 'revenu',  catId: 6, freq: 'mensuel', day: 1 },
]

// ============================================================
// OBJECTIFS D'ÉPARGNE
// ============================================================
export const mockGoals = [
  { id: 1, name: 'Vacances à Kribi',  target: 500000, saved: 150000 },
  { id: 2, name: 'Nouveau téléphone', target: 120000, saved: 80000  },
]