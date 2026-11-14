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
// Transactions — built fresh every load so dates are always relative to "today"
// -----------------------------------------------------------------------------
const buildMockTransactions = () => {
  const today = new Date();
  const catMap = Object.fromEntries(mockCategories.map((c) => [c.name, c]));
  let id = 1;
  const out = [];

  const dateNDaysAgo = (n) => {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - n);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const add = (daysAgo, categoryName, amount, type, description) => {
    const c = catMap[categoryName];
    out.push({
      id: id++,
      user_id: 1,
      category_id: c?.id || null,
      category_name: c?.name || null,
      category_icon: c?.icon || null,
      category_color: c?.color || null,
      amount: amount.toFixed(2),
      type,
      description,
      notes: null,
      transaction_date: dateNDaysAgo(daysAgo),
      created_at: new Date().toISOString(),
    });
  };

  // Revenus — Salaire bi-mensuel sur environ 3 mois
  [0, 14, 30, 44, 60, 74, 90].forEach((n) => add(n, 'Salaire', 2750, 'income', 'Dépôt de salaire'));
  add(15, 'Freelance', 800, 'income', 'Projet client');
  add(75, 'Freelance', 1200, 'income', 'Projet client');

  // Loyer (mensuel)
  [3, 33, 63, 93].forEach((n) => add(n, 'Loyer', 1800, 'expense', 'Loyer mensuel'));


  // Factures & Énergie (mensuel)
  [7, 37, 67].forEach((n) => add(n, 'Factures & Énergie', 95, 'expense', 'Électricité + Internet'));

  // Abonnements (Divertissement)
  [4, 34, 64, 94].forEach((n) => {
    add(n, 'Divertissement', 15.99, 'expense', 'Netflix');
    add(n, 'Divertissement', 10.99, 'expense', 'Spotify');
  });

  // Courses hebdomadaires
  [2, 9, 16, 23, 30, 37, 44, 51, 58, 65, 72, 79].forEach((n) =>
    add(n, 'Courses', 60 + (n % 35), 'expense', 'Courses hebdomadaires')
  );

  // Restaurants & Cafés — entrées fréquentes et régulières
  const foodDays = [1, 2, 5, 6, 8, 11, 13, 17, 19, 22, 25, 28, 31, 36, 41, 46, 52, 58, 67, 73, 81];
  foodDays.forEach((n, i) => {
    const amount = 8 + (n % 32);
    const desc = i % 4 === 0 ? 'Café' : i % 4 === 1 ? 'Déjeuner' : i % 4 === 2 ? 'Dîner au restaurant' : 'Plat à emporter';
    add(n, 'Restaurants & Cafés', amount, 'expense', desc);
  });

  // Transports
  [4, 11, 18, 25, 32, 39, 46, 53, 60, 67].forEach((n, i) =>
    add(n, 'Transports', 25 + (n % 30), 'expense', i % 2 === 0 ? 'Essence' : 'Uber')
  );

  // Sorties et loisirs (Divertissement)
  [12, 27, 49, 71].forEach((n) => add(n, 'Divertissement', 32 + (n % 40), 'expense', 'Cinéma / événement'));

  // Shopping
  add(11, 'Shopping', 120, 'expense', 'Nouvelles chaussures');
  add(48, 'Shopping', 85, 'expense', 'Décoration maison');
  add(83, 'Shopping', 65, 'expense', 'Commande Amazon');

  // Santé
  add(22, 'Santé', 75, 'expense', 'Pharmacie');
  add(55, 'Santé', 45, 'expense', 'Consultation médecin');

  // Soins personnels
  [8, 38, 68].forEach((n) => add(n, 'Soins personnels', 38, 'expense', 'Coiffeur'));

  // Voyages
  add(40, 'Voyages', 220, 'expense', 'Week-end escapade');

  return out.sort((a, b) => b.transaction_date.localeCompare(a.transaction_date));
};

export const mockTransactions = buildMockTransactions();

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


// -----------------------------------------------------------------------------
// Dashboard aggregates
// -----------------------------------------------------------------------------

export const mockDashboardSummary = {
  incomeThisMonth: 6300,
  expenseThisMonth: 2364,
  balance: 3936,
  savingsRate: 62.5,
  incomeDelta: 5.2,
  expenseDelta: -8.3,
};

const buildMonthlyTrend = () => {
  // Return last 6 months in YYYY-MM format with reasonable values
  const today = new Date();
  const months = [];
  const samples = [
    { income: 6700, expense: 2890 },
    { income: 5500, expense: 2680 },
    { income: 6300, expense: 2720 },
    { income: 5500, expense: 2540 },
    { income: 6300, expense: 2820 },
    { income: 6300, expense: 2364 },
  ];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const month = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const s = samples[5 - i];
    months.push({ month, income: s.income.toFixed(2), expense: s.expense.toFixed(2) });
  }
  return months;
};

export const mockMonthlyTrend = buildMonthlyTrend();

export const mockCategoryBreakdown = [
  { category_id: 9, category_name: 'Loyer', category_icon: 'home', category_color: '#F43F5E', total: '1800.00', transaction_count: 1 },
  { category_id: 6, category_name: 'Restaurants & Cafés', category_icon: 'utensils', category_color: '#F59E0B', total: '320.00', transaction_count: 8 },
  { category_id: 7, category_name: 'Courses', category_icon: 'shopping-cart', category_color: '#EAB308', total: '262.00', transaction_count: 4 },
  { category_id: 8, category_name: 'Transports', category_icon: 'car', category_color: '#EF4444', total: '139.00', transaction_count: 4 },
  { category_id: 11, category_name: 'Divertissement', category_icon: 'film', category_color: '#A855F7', total: '95.00', transaction_count: 3 },
];
