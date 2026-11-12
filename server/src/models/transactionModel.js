import pool from "../db.js";

// Chaque transaction est renvoyée avec les infos de sa catégorie (NULL si "sans catégorie").
// "t" désigne la transaction (table ou résultat d'un INSERT/UPDATE), "c" sa catégorie.
const SELECT_FIELDS = `
    t.id, t.category_id,
    c.name AS category_name, c.icon AS category_icon, c.color AS category_color,
    t.amount, t.type, t.description, t.notes, t.transaction_date`;

// Seules ces colonnes peuvent être modifiées (liste blanche, utilisée pour construire le UPDATE)
const UPDATABLE_COLUMNS = ['category_id', 'amount', 'type', 'description', 'notes', 'transaction_date'];

// Les transactions d'un utilisateur, de la plus récente à la plus ancienne, avec filtres optionnels.
// Astuce SQL : "($2::text IS NULL OR t.type = $2)" => si $2 est NULL, rien n'est filtré.
export async function findAllByUser(userId, { type = null, categoryId = null, from = null, to = null, search = null, limit = 50, offset = 0 } = {}) {
    const escapeLike = (value) => value.replace(/[\\%_]/g, "\\$&");
    const searchPattern = search ? `%${escapeLike(search)}%` : null;

    
    const result = await pool.query(
        `SELECT ${SELECT_FIELDS}
         FROM transactions t
         LEFT JOIN categories c ON c.id = t.category_id
         WHERE t.user_id = $1
           AND ($2::text IS NULL OR t.type = $2)
           AND ($3::int  IS NULL OR t.category_id = $3)
           AND ($4::date IS NULL OR t.transaction_date >= $4)
           AND ($5::date IS NULL OR t.transaction_date <= $5)
           AND ($6::text IS NULL OR (t.description ILIKE $6 OR t.notes ILIKE $6))
         ORDER BY t.transaction_date DESC, t.id DESC
         LIMIT $7 OFFSET $8`,
        [userId, type, categoryId, from, to, searchPattern, limit, offset]
    );
    return result.rows;
}


// Une transaction précise (seulement si elle appartient à l'utilisateur), sinon null
export async function findByIdAndUser(id, userId) {
    const result = await pool.query(
        `SELECT ${SELECT_FIELDS}
         FROM transactions t
         LEFT JOIN categories c 
         ON c.id = t.category_id
         WHERE t.id = $1 AND t.user_id = $2`,
        [id, userId]
    );
    return result.rows[0] ?? null;
}

// Crée une transaction et la renvoie (avec sa catégorie)
export async function create(userId, { category_id, amount, type, description, notes, transaction_date }) {
    const result = await pool.query(
        `WITH t AS (
           INSERT INTO transactions (user_id, category_id, amount, type, description, notes, transaction_date)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           RETURNING *
         )
         SELECT ${SELECT_FIELDS} 
         FROM t 
         LEFT JOIN categories c 
         ON c.id = t.category_id`,
        [userId, category_id, amount, type, description, notes, transaction_date]
    );
    return result.rows[0];
}

// Modifie uniquement les champs fournis (undefined = on ne touche pas, null = on vide la valeur).
// Renvoie la transaction modifiée, ou null si elle n'existe pas / n'appartient pas à l'utilisateur.
export async function update(id, userId, fields) {
    const columns = UPDATABLE_COLUMNS.filter((column) => fields[column] !== undefined);
    if (columns.length === 0) {
        throw new Error("update() called without any field to update");
    }
    const assignments = columns.map((column, index) => `${column} = $${index + 3}`).join(", ");
    const values = columns.map((column) => fields[column]);
    const result = await pool.query(
        `WITH t AS (
           UPDATE transactions
           SET ${assignments}
           WHERE id = $1 AND user_id = $2
           RETURNING *
         )
        SELECT ${SELECT_FIELDS} FROM t LEFT JOIN categories c ON c.id = t.category_id`,
        [id, userId, ...values],
    )
    return result.rows[0] ?? null;
}


// Supprime une transaction. Renvoie true si elle existait, false sinon.
export async function remove(id, userId) {
    const result = await pool.query(
        `DELETE FROM transactions WHERE id = $1 AND user_id = $2`,
        [id, userId]
    );
    return result.rowCount > 0;
}