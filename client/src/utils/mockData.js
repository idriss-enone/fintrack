// ============================================================
// CONNEXIONS D'UTILISATEURS (MOCK)
// ============================================================

export const mockUser = [
  {
    id: 1,
    name: "Idriss",
    email: "idriss@test.com",
    password: "123456",
  },
];

// ============================================================
// CATÉGORIES
// ============================================================
export const mockCategories = [
  // Revenus (Income)
  { id: 1, name: 'Salaire', type: 'income', icon: 'briefcase', color: '#10B981', is_default: true },
  { id: 2, name: 'Freelance', type: 'income', icon: 'laptop', color: '#22C55E', is_default: true },
  { id: 3, name: 'Investissements', type: 'income', icon: 'trending-up', color: '#14B8A6', is_default: true },
  { id: 4, name: 'Cadeaux', type: 'income', icon: 'gift', color: '#06B6D4', is_default: true },
  { id: 5, name: 'Autres revenus', type: 'income', icon: 'tag', color: '#0EA5E9', is_default: true },
  // Dépenses (Expense)
  { id: 6, name: 'Restaurants & Cafés', type: 'expense', icon: 'utensils', color: '#F59E0B', is_default: true },
  { id: 7, name: 'Courses', type: 'expense', icon: 'shopping-cart', color: '#EAB308', is_default: true },
  { id: 8, name: 'Transports', type: 'expense', icon: 'car', color: '#EF4444', is_default: true },
  { id: 9, name: 'Loyer', type: 'expense', icon: 'home', color: '#F43F5E', is_default: true },
  { id: 10, name: 'Factures & Énergie', type: 'expense', icon: 'zap', color: '#EC4899', is_default: true },
  { id: 11, name: 'Divertissement', type: 'expense', icon: 'film', color: '#A855F7', is_default: true },
  { id: 12, name: 'Shopping', type: 'expense', icon: 'shopping-bag', color: '#8B5CF6', is_default: true },
  { id: 13, name: 'Santé', type: 'expense', icon: 'heart', color: '#3B82F6', is_default: true },
  { id: 14, name: 'Éducation', type: 'expense', icon: 'book-open', color: '#6366F1', is_default: true },
  { id: 15, name: 'Voyages', type: 'expense', icon: 'plane', color: '#F97316', is_default: true },
  { id: 16, name: 'Soins personnels', type: 'expense', icon: 'sparkles', color: '#D946EF', is_default: true },
  { id: 17, name: 'Autres dépenses', type: 'expense', icon: 'tag', color: '#64748B', is_default: true },
];
