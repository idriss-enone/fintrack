-- ============================================================
-- TABLE : users
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE, -- toujours stocké en minuscules (normalisé côté backend)
  password_hash VARCHAR(255) NOT NULL,
  currency VARCHAR(3) NOT NULL DEFAULT 'USD',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE : categories
-- ============================================================
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(10) NOT NULL CHECK (type IN ('income', 'expense')),
  icon VARCHAR(50),
  color VARCHAR(7),
  is_default BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, name, type)
);

-- ============================================================
-- TABLE : transactions
-- ============================================================
-- category_id est optionnel : une transaction peut exister "sans catégorie".
-- La cohérence du type et du propriétaire de la catégorie est vérifiée dans le contrôleur.
CREATE TABLE IF NOT EXISTS transactions (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id INT REFERENCES categories(id) ON DELETE SET NULL, -- NULL = sans catégorie
  amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  type VARCHAR(10) NOT NULL CHECK (type IN ('income', 'expense')),
  description VARCHAR(255),
  notes TEXT,
  transaction_date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE : budgets
-- ============================================================
CREATE TABLE IF NOT EXISTS budgets (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id INT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  period VARCHAR(10) NOT NULL DEFAULT 'monthly' CHECK (period IN ('monthly', 'weekly')),
  start_date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, category_id, period)
);

-- ============================================================
-- TABLE : recurrents
-- ============================================================
CREATE TABLE IF NOT EXISTS recurrents (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id INT REFERENCES categories(id) ON DELETE SET NULL, -- NULL = sans catégorie
  amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  type VARCHAR(10) NOT NULL CHECK (type IN ('income', 'expense')),
  description VARCHAR(255) NOT NULL,
  frequency VARCHAR(10) NOT NULL CHECK (frequency IN ('monthly', 'weekly')),
  day_of_month INTEGER CHECK (day_of_month BETWEEN 1 AND 28),
  day_of_week INTEGER CHECK (day_of_week BETWEEN 0 AND 6),
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  last_run_date DATE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (
    (frequency = 'monthly' AND day_of_month IS NOT NULL AND day_of_week IS NULL) OR
    (frequency = 'weekly'  AND day_of_week  IS NOT NULL AND day_of_month IS NULL)
  )
);

-- ============================================================
-- TABLE : goals
-- ============================================================
CREATE TABLE IF NOT EXISTS goals (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  target NUMERIC(12,2) NOT NULL CHECK (target > 0),
  saved NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (saved >= 0),
  deadline DATE, -- optionnel
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE : ai_insights
-- ============================================================
CREATE TABLE IF NOT EXISTS ai_insights (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  insight_type VARCHAR(255) NOT NULL,
  period_start DATE,
  period_end DATE,
  content_json JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- FONCTION : mise à jour automatique de updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- TRIGGERS : updated_at sur chaque table (re-exécutable)
-- CREATE OR REPLACE TRIGGER nécessite PostgreSQL 14+ (Neon OK)
-- ============================================================
DO $$
DECLARE
  t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['users','categories','transactions','budgets','recurrents','goals','ai_insights']
  LOOP
    EXECUTE format(
      'CREATE OR REPLACE TRIGGER set_updated_at_%1$s
         BEFORE UPDATE ON %1$I
         FOR EACH ROW EXECUTE FUNCTION update_updated_at()', t);
  END LOOP;
END $$;

-- ============================================================
-- INDEX : optimisation des requêtes fréquentes
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_transactions_user_date
  ON transactions(user_id, transaction_date DESC);

CREATE INDEX IF NOT EXISTS idx_transactions_category
  ON transactions(category_id);

CREATE INDEX IF NOT EXISTS idx_budgets_user
  ON budgets(user_id);

CREATE INDEX IF NOT EXISTS idx_recurrents_user
  ON recurrents(user_id);

CREATE INDEX IF NOT EXISTS idx_goals_user
  ON goals(user_id);

CREATE INDEX IF NOT EXISTS idx_insights_user_created
  ON ai_insights(user_id, created_at DESC);