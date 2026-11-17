import pool from "../db.js";


// KPIs fixes : Ce mois-ci vs Mois dernier
export async function getSummary(userId) {
    const result = await pool.query(
        `WITH cte_monthly AS (
            SELECT 
                date_trunc('month', transaction_date)::date AS month,
                type,
                SUM(amount) AS total
            FROM transactions
            WHERE user_id = $1
              AND transaction_date >= (date_trunc('month', CURRENT_DATE) - INTERVAL '1 month')::date
              AND transaction_date < (date_trunc('month', CURRENT_DATE) + INTERVAL '1 month')::date
            GROUP BY 1, 2
        )
        SELECT 
            COALESCE(SUM(CASE WHEN month = date_trunc('month', CURRENT_DATE)::date AND type = 'income' THEN total END), 0) AS income_this_month,
            COALESCE(SUM(CASE WHEN month = date_trunc('month', CURRENT_DATE)::date AND type = 'expense' THEN total END), 0) AS expense_this_month,
            COALESCE(SUM(CASE WHEN month = (date_trunc('month', CURRENT_DATE) - INTERVAL '1 month')::date AND type = 'income' THEN total END), 0) AS income_last_month,
            COALESCE(SUM(CASE WHEN month = (date_trunc('month', CURRENT_DATE) - INTERVAL '1 month')::date AND type = 'expense' THEN total END), 0) AS expense_last_month
        FROM cte_monthly`,
        [userId]
    );

    return result.rows[0];
}

export async function getCategoryBreakdown(userId) {
    const result = await pool.query(
        `SELECT
            c.id AS category_id,
            COALESCE(c.name, 'Sans catégorie') AS category_name,
            COALESCE(c.icon, 'help-circle') AS category_icon,
            COALESCE(c.color, '#9ca3af') AS category_color,
            SUM(t.amount) AS total,
            COUNT(t.id)::int AS transaction_count
        FROM transactions t
        LEFT JOIN categories c ON c.id = t.category_id
        WHERE t.user_id = $1
          AND t.type = 'expense'
          AND t.transaction_date >= date_trunc('month', CURRENT_DATE)::date
          AND t.transaction_date <= (date_trunc('month', CURRENT_DATE) + INTERVAL '1 month - 1 day')::date
        GROUP BY c.id, c.name, c.icon, c.color
        ORDER BY total DESC`,
        [userId]
    );

    return result.rows;
}

// Ne renvoie que les mois ayant au moins une transaction (6 derniers mois)
export async function getMonthlyTrend(userId) {
    const result = await pool.query(
        `SELECT
            TO_CHAR(date_trunc('month', t.transaction_date), 'YYYY-MM') AS month,
            SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END) AS income,
            SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END) AS expense
        FROM transactions t
        WHERE t.user_id = $1
          AND t.transaction_date >= (date_trunc('month', CURRENT_DATE) - INTERVAL '5 months')::date
          AND t.transaction_date <= (date_trunc('month', CURRENT_DATE) + INTERVAL '1 month - 1 day')::date
        GROUP BY 1
        ORDER BY 1 ASC`,
        [userId]
    );

    return result.rows;
}


// Génère obligatoirement les 6 derniers mois et met 0 sur les mois vides
export async function getFullMonthlyTrend(userId) {
    const result = await pool.query(
        `WITH months AS (
            SELECT generate_series(
                date_trunc('month', CURRENT_DATE) - INTERVAL '5 months',
                date_trunc('month', CURRENT_DATE),
                INTERVAL '1 month'
            )::date AS month
        )
        SELECT
            TO_CHAR(m.month, 'YYYY-MM') AS month,
            COALESCE(SUM(t.amount) FILTER (WHERE t.type = 'income'), 0) AS income,
            COALESCE(SUM(t.amount) FILTER (WHERE t.type = 'expense'), 0) AS expense
        FROM months m
        LEFT JOIN transactions t
            ON t.user_id = $1
            AND date_trunc('month', t.transaction_date)::date = m.month
        GROUP BY m.month
        ORDER BY m.month ASC`,
        [userId]
    );
    return result.rows;
}

