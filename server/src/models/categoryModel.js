import pool from "../db.js";

const FIELDS = 'id, name, type, icon, color, is_default';

// Les catégories d'un utilisateur, avec un filtre optionnel sur le type.
// Astuce SQL : si $2 est NULL (pas de type demandé), "$2::text IS NULL" est vrai pour toutes
// les lignes donc rien n'est filtré ; sinon c'est "type = $2" qui filtre.
// Le "::text" précise à PostgreSQL que $2 est du texte.
export async function findAllByUser(userId, type = null) {
    const result = await pool.query(
        `SELECT ${FIELDS} FROM categories
         WHERE user_id = $1 AND ($2::text IS NULL OR type = $2)
         ORDER BY type, name`,
        [userId, type]
    );
    return result.rows;
}

// Une catégorie précise (seulement si elle appartient à l'utilisateur), sinon null
export async function findByIdAndUser(id, userId) {
    const result = await pool.query(
        `SELECT ${FIELDS} FROM categories
         WHERE id = $1 AND user_id = $2`,
        [id, userId]
    );
    return result.rows[0] ?? null;
}
// Crée une catégorie et la renvoie
export async function create(userId, { name, type, icon, color }) {
    const result = await pool.query(
        `INSERT INTO categories (user_id, name, type, icon, color)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING ${FIELDS}`,
        [userId, name, type, icon, color]
    );
    return result.rows[0];
}

// Copie les catégories par défaut pour un nouvel utilisateur, en une seule requête.
// "db" peut être le pool (par défaut) ou un client de transaction.
export async function createDefaults(userId, categories, db = pool) {
    await db.query(
        `INSERT INTO categories (user_id, name, type, icon, color, is_default)
         SELECT $1::int, name, type, icon, color, is_default
         FROM json_to_recordset($2::json)
           AS c(name text, type text, icon text, color text, is_default boolean)`,
        [userId, JSON.stringify(categories)]
    );
}

// Met à jour les champs fournis (null = on garde l'ancienne valeur). Renvoie la catégorie, ou null si introuvable.
export async function update(id, userId, { name, icon, color }) {
    const result = await pool.query(
        `UPDATE categories
         SET name  = COALESCE($1, name),
             icon  = COALESCE($2, icon),
             color = COALESCE($3, color)
         WHERE id = $4 AND user_id = $5
         RETURNING ${FIELDS}`,
        [name, icon, color, id, userId]
    );
    return result.rows[0] ?? null;
}

// Supprime une catégorie. Renvoie true si elle existait, false sinon.
export async function remove(id, userId) {
    const result = await pool.query(
        `DELETE FROM categories WHERE id = $1 AND user_id = $2`,
        [id, userId]
    );
    return result.rowCount > 0;
}