import bcrypt from "bcryptjs";
import pool, { withTransaction } from "../db.js";
import { getDbHost, confirmHost } from "../utils/confirmHost.js";

const DEMO_EMAIL = "demo@fintrack.test";
const DEMO_PASSWORD = "Demo1234!";

const CATEGORIES = [
  { name: "Salaire", type: "income", icon: "briefcase", color: "#10B981" },
  { name: "Freelance", type: "income", icon: "laptop", color: "#06B6D4" },
  { name: "Courses", type: "expense", icon: "shopping-cart", color: "#F97316" },
  { name: "Restaurant", type: "expense", icon: "utensils", color: "#EF4444" },
  { name: "Transport", type: "expense", icon: "car", color: "#3B82F6" },
  { name: "Logement", type: "expense", icon: "home", color: "#8B5CF6" },
  { name: "Loisirs", type: "expense", icon: "film", color: "#EC4899" },
];

const daysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
};

const runSeed = async () => {
  if (process.env.NODE_ENV === "production") {
    console.error("Seed is disabled when NODE_ENV=production");
    process.exitCode = 1;
    await pool.end();
    return;
  }

  const host = getDbHost();

  try {
     console.log(`Target database: ${host}`);

     if (!(await confirmHost(host, "delete and recreate the demo user's data"))) {
      console.log("Seed cancelled. Nothing was changed.");
      return;
    }

    
    await withTransaction(async (client) => {
      // Repart de zéro pour l'utilisateur de démo (CASCADE supprime ses données)
      await client.query("DELETE FROM users WHERE email = $1", [DEMO_EMAIL]);

      const hash = await bcrypt.hash(DEMO_PASSWORD, 10);
      const { rows: [user] } = await client.query(
        `INSERT INTO users (name, email, password_hash, currency)
         VALUES ($1, $2, $3, 'XAF') RETURNING id`,
        ["Utilisateur Démo", DEMO_EMAIL, hash],
      );

      const ids = {};
      for (const c of CATEGORIES) {
        const { rows: [row] } = await client.query(
          `INSERT INTO categories (user_id, name, type, icon, color, is_default)
           VALUES ($1, $2, $3, $4, $5, TRUE) RETURNING id`,
          [user.id, c.name, c.type, c.icon, c.color],
        );
        ids[c.name] = { id: row.id, type: c.type };
      }

      const transactions = [
        ["Salaire", 450000, "Salaire du mois", 60],
        ["Salaire", 450000, "Salaire du mois", 30],
        ["Salaire", 450000, "Salaire du mois", 2],
        ["Freelance", 120000, "Mission web", 20],
        ["Logement", 150000, "Loyer", 58],
        ["Logement", 150000, "Loyer", 28],
        ["Courses", 35000, "Supermarché", 45],
        ["Courses", 42000, "Supermarché", 15],
        ["Courses", 28000, "Marché", 5],
        ["Restaurant", 18000, "Dîner", 40],
        ["Restaurant", 12000, "Déjeuner", 10],
        ["Transport", 15000, "Carburant", 33],
        ["Transport", 15000, "Carburant", 3],
        ["Loisirs", 20000, "Cinéma", 25],
      ];

      for (const [cat, amount, description, ago] of transactions) {
        await client.query(
          `INSERT INTO transactions
             (user_id, category_id, amount, type, description, transaction_date)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [user.id, ids[cat].id, amount, ids[cat].type, description, daysAgo(ago)],
        );
      }

      const budgets = [["Courses", 100000], ["Restaurant", 40000], ["Transport", 40000]];
      for (const [cat, amount] of budgets) {
        await client.query(
          `INSERT INTO budgets (user_id, category_id, amount, period, start_date)
           VALUES ($1, $2, $3, 'monthly', $4)`,
          [user.id, ids[cat].id, amount, daysAgo(30)],
        );
      }

      await client.query(
        `INSERT INTO recurrents
           (user_id, category_id, amount, type, description, frequency, day_of_month)
         VALUES ($1, $2, 150000, 'expense', 'Loyer', 'monthly', 1)`,
        [user.id, ids["Logement"].id],
      );

      await client.query(
        `INSERT INTO goals (user_id, name, target, saved, deadline)
         VALUES ($1, 'Fonds d''urgence', 500000, 120000, $2)`,
        [user.id, daysAgo(-180)],
      );
    });

    console.log(`Seed complete. Login: ${DEMO_EMAIL} / ${DEMO_PASSWORD}`);
  } catch (error) {
    console.error("Seed failed.", error.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
};

runSeed();