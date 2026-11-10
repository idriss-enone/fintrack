// ============================================================
// CONNEXIONS D'UTILISATEURS (MOCK)
// ============================================================

export const mockUser = {
  id: 1,
  name: "Idriss",
  email: "idriss@test.com",
  password: "123456",
  currency: "XAF",
};


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

// -----------------------------------------------------------------------------
// Budgets : mois en cours, avec des dépenses couvrant les trois états
// -----------------------------------------------------------------------------
const toISODate = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const buildMockBudgets = () => {
  const today = new Date();
  const periodStart = toISODate(new Date(today.getFullYear(), today.getMonth(), 1));
  const periodEnd = toISODate(new Date(today.getFullYear(), today.getMonth() + 1, 0));

  const items = [
    { catId: 6, amount: 400, spent: 320 },
    { catId: 7, amount: 400, spent: 262 },
    { catId: 11, amount: 100, spent: 80 },
    { catId: 8, amount: 250, spent: 139 },
    { catId: 12, amount: 100, spent: 120 },
  ];
  const catMap = Object.fromEntries(mockCategories.map((c) => [c.id, c]));

  return items.map((b, i) => {
    const c = catMap[b.catId];
    return {
      id: i + 1,
      user_id: 1,
      category_id: c.id,
      category_name: c.name,
      category_icon: c.icon,
      category_color: c.color,
      amount: b.amount,
      spent: b.spent,
      remaining: b.amount - b.spent,
      period: "monthly",
      start_date: periodStart,
      period_start: periodStart,
      period_end: periodEnd,
    };
  });
};

export const mockBudgets = buildMockBudgets();


// -----------------------------------------------------------------------------
// Verdicts IA pour chaque budget du mock : les budgetId correspondent à mockBudgets
// -----------------------------------------------------------------------------
export const mockBudgetAnalyses = [
  { budgetId: 1, status: 'caution', message: "Restaurants & Cafés : 320 FCFA dépensés sur 400 FCFA. Vous approchez de la limite, privilégiez quelques repas à la maison." },
  { budgetId: 2, status: 'good', message: "Courses : 262 FCFA sur 400 FCFA. Un rythme régulier et bien maîtrisé, continuez ainsi." },
  { budgetId: 3, status: 'caution', message: "Divertissement : 80 FCFA sur 100 FCFA. La limite est proche, surveillez les nouveaux abonnements." },
  { budgetId: 4, status: 'good', message: "Transports : 139 FCFA sur 250 FCFA. Votre consommation reste confortable." },
  { budgetId: 5, status: 'concerning', message: "Shopping : la limite de 100 FCFA est dépassée de 20 FCFA. Mettez en pause les achats non essentiels." },
];
