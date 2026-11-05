const defaultCategories = [
    // Revenus (income)
    { name: 'Salaire', type: 'income', icon: 'briefcase', color: '#10B981', is_default: true },
    { name: 'Freelance', type: 'income', icon: 'laptop', color: '#3B82F6', is_default: true },
    { name: 'Investissements', type: 'income', icon: 'trending-up', color: '#8B5CF6', is_default: true },
    { name: 'Cadeaux & Primes', type: 'income', icon: 'gift', color: '#EC4899', is_default: true },
    { name: 'Autres revenus', type: 'income', icon: 'plus-circle', color: '#0EA5E9', is_default: true },

    // Dépenses (expense)
    { name: 'Alimentation', type: 'expense', icon: 'shopping-cart', color: '#F59E0B', is_default: true },
    { name: 'Abonnements', type: 'expense', icon: 'credit-card', color: '#6B7280', is_default: true },
    { name: 'Transports', type: 'expense', icon: 'car', color: '#06B6D4', is_default: true },
    { name: 'Loyer', type: 'expense', icon: 'home', color: '#EF4444', is_default: true },
    { name: 'Factures', type: 'expense', icon: 'zap', color: '#EC4899', is_default: true },
    { name: 'Divertissement', type: 'expense', icon: 'film', color: '#8B5CF6', is_default: true },
    { name: 'Shopping', type: 'expense', icon: 'shopping-bag', color: '#EC4899', is_default: true },
    { name: 'Santé', type: 'expense', icon: 'heart', color: '#10B981', is_default: true },
    { name: 'Éducation', type: 'expense', icon: 'book-open', color: '#6366F1', is_default: true },
    { name: 'Voyages', type: 'expense', icon: 'plane', color: '#F97316', is_default: true },
    { name: 'Soins personnels', type: 'expense', icon: 'sparkles', color: '#D946EF', is_default: true },
    { name: 'Autres dépenses', type: 'expense', icon: 'more-horizontal', color: '#64748B', is_default: true },

];

export default defaultCategories;