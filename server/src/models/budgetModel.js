import pool from "../db.js";


// Chaque budget est renvoyé avec :
//  - les infos de sa catégorie (nom, icône, couleur)
//  - la période EN COURS : le mois civil (monthly) ou la semaine du lundi au dimanche (weekly)
//  - spent     : total des dépenses de cette catégorie sur la période en cours
//                (on ne compte pas avant start_date si elle tombe pendant la période)
//  - remaining : amount - spent (négatif = budget dépassé)
// "b" = budget, "c" = catégorie, "p" = bornes de la période, "s" = montant dépensé.
const SELECT_BUDGETS = `
    SELECT
        b.id, 
        b.category_id,
        b.amount,
        b.period,
        b.start_date,
        c.name AS category_name, 
        c.icon AS category_icon, 
        c.color AS category_color,
        p.period_start, 
        p.period_end,
        COALESCE(s.spent, 0) AS spent,
        b.amount - COALESCE(s.spent, 0) AS remaining
    FROM budgets b
    JOIN categories c ON c.id = b.category_id
    CROSS JOIN LATERAL (
        SELECT
            CASE b.period 
                WHEN 'weekly' THEN date_trunc('week', CURRENT_DATE)::date
                ELSE date_trunc('month', CURRENT_DATE)::date 
            END AS period_start,
            CASE b.period 
                WHEN 'weekly' THEN (date_trunc('week', CURRENT_DATE) + interval '6 days')::date
                ELSE (date_trunc('month', CURRENT_DATE) + interval '1 month - 1 day')::date 
            END AS period_end
    ) p
    LEFT JOIN LATERAL (
        SELECT SUM(t.amount) AS spent
        FROM transactions t
        WHERE t.user_id = b.user_id
          AND t.category_id = b.category_id
          AND t.type = 'expense'
          AND t.transaction_date BETWEEN GREATEST(p.period_start, b.start_date) AND p.period_end
    ) s ON TRUE`;

// Tous les budgets d'un utilisateur
export async function findAllByUser(userId) {
    const result = await pool.query(
        `${SELECT_BUDGETS}
         WHERE b.user_id = $1
         ORDER BY c.name, b.period`,
        [userId]
    );
    return result.rows;
}

// Un budget précis (seulement s'il appartient à l'utilisateur), sinon null
export async function findByIdAndUser(id, userId) {
    const result = await pool.query(
        `${SELECT_BUDGETS}
         WHERE b.id = $1 AND b.user_id = $2`,
        [id, userId]
    );
    return result.rows[0] ?? null;
}

// Crée un budget et le renvoie.
// Si start_date est NULL, elle vaut le début de la période en cours (1er du mois ou lundi de la semaine),
// pour que les dépenses déjà faites ce mois-ci / cette semaine soient comptées.
export async function create(userId, { category_id, amount, period, start_date }) {
    const result = await pool.query(
        `INSERT INTO budgets (user_id, category_id, amount, period, start_date)
         VALUES ($1, $2, $3, $4::text, COALESCE($5::date, date_trunc(
                 CASE WHEN $4::text = 'weekly' THEN 'week' 
                 ELSE 'month' END, CURRENT_DATE)::date))
         RETURNING id`,
        [userId, category_id, amount, period, start_date]
    );
    return findByIdAndUser(result.rows[0].id, userId);
}


// Modifie les champs fournis (null = on garde l'ancienne valeur). Renvoie le budget, ou null si introuvable.
export async function update(id, userId, { amount, period, start_date }) {
    const result = await pool.query(
        `UPDATE budgets
        SET amount = COALESCE($1, amount),
            period = COALESCE($2, period),
            start_date = CASE
                WHEN $3::date IS NOT NULL THEN $3::date
                WHEN $2::text IS NOT NULL AND $2::text <> period THEN
                    date_trunc(CASE WHEN $2::text = 'weekly' THEN 'week' ELSE 'month' END, CURRENT_DATE)::date
                ELSE start_date
            END
        WHERE id = $4 AND user_id = $5
        RETURNING id`,
        [amount, period, start_date, id, userId]
    );
    if (result.rowCount === 0) return null;
    return findByIdAndUser(id, userId);
}


export async function remove(id, userId) {
    const result = await pool.query(
        `DELETE FROM budgets WHERE id = $1 AND user_id = $2`,
        [id, userId]
    );
    return result.rowCount > 0;
}