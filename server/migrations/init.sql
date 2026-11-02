-- ============================================================
-- Extensions
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLE : users
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id         UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  email      VARCHAR(255) NOT NULL UNIQUE,
  password   VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE : categories
-- ============================================================
CREATE TABLE IF NOT EXISTS categories (
  id         UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name       VARCHAR(100) NOT NULL,
  emoji      VARCHAR(10)  NOT NULL,
  type       VARCHAR(10)  NOT NULL CHECK (type IN ('depense', 'revenu', 'both')),
  created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE : transactions
-- ============================================================
CREATE TABLE IF NOT EXISTS transactions (
  id          UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id UUID         NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  description VARCHAR(255) NOT NULL,
  amount      NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  type        VARCHAR(10)  NOT NULL CHECK (type IN ('depense', 'revenu')),
  date        DATE         NOT NULL,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE : budgets
-- ============================================================
CREATE TABLE IF NOT EXISTS budgets (
  id          UUID          PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id UUID          NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  limit_amount NUMERIC(12,2) NOT NULL CHECK (limit_amount > 0),
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW(),

  -- Un seul budget par catégorie par utilisateur
  UNIQUE (user_id, category_id)
);

-- ============================================================
-- TABLE : recurrents
-- ============================================================
CREATE TABLE IF NOT EXISTS recurrents (
  id          UUID          PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id UUID          NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  description VARCHAR(255)  NOT NULL,
  amount      NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  type        VARCHAR(10)   NOT NULL CHECK (type IN ('depense', 'revenu')),
  frequency   VARCHAR(10)   NOT NULL CHECK (frequency IN ('mensuel', 'hebdo')),
  day_of_month INTEGER      CHECK (day_of_month BETWEEN 1 AND 28),
  day_of_week  INTEGER      CHECK (day_of_week  BETWEEN 0 AND 6),
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE : goals
-- ============================================================
CREATE TABLE IF NOT EXISTS goals (
  id         UUID          PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name       VARCHAR(255)  NOT NULL,
  target     NUMERIC(12,2) NOT NULL CHECK (target > 0),
  saved      NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (saved >= 0),
  created_at TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ   NOT NULL DEFAULT NOW()
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
-- TRIGGERS : updated_at sur chaque table
-- ============================================================
CREATE TRIGGER set_updated_at_users
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at_categories
  BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at_transactions
  BEFORE UPDATE ON transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at_budgets
  BEFORE UPDATE ON budgets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at_recurrents
  BEFORE UPDATE ON recurrents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at_goals
  BEFORE UPDATE ON goals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- INDEX : optimisation des requêtes fréquentes
-- ============================================================

-- Transactions par utilisateur et par date (dashboard, rapport)
CREATE INDEX IF NOT EXISTS idx_transactions_user_date
  ON transactions(user_id, date DESC);

-- Transactions par catégorie (budgets, rapport)
CREATE INDEX IF NOT EXISTS idx_transactions_category
  ON transactions(category_id);

-- Budgets par utilisateur
CREATE INDEX IF NOT EXISTS idx_budgets_user
  ON budgets(user_id);

-- Récurrents par utilisateur
CREATE INDEX IF NOT EXISTS idx_recurrents_user
  ON recurrents(user_id);

-- Goals par utilisateur
CREATE INDEX IF NOT EXISTS idx_goals_user
  ON goals(user_id);