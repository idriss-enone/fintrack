import pool from "../db.js";


// Utilisateur par email, AVEC son password_hash (pour la connexion), sinon null
export async function findByEmail(email) {
    const result = await pool.query(
        `SELECT id, name, email, password_hash, currency FROM users WHERE email = $1`,
        [email]
    );
    return result.rows[0] ?? null;
}

// Utilisateur par id, SANS password_hash, sinon null
export async function findById(id) {
    const result = await pool.query(
        `SELECT id, name, email, currency, created_at FROM users WHERE id = $1`,
        [id]
    );
    return result.rows[0] ?? null;
}

// Crée un utilisateur et le renvoie (sans password_hash).
// "db" peut être le pool (par défaut) ou un client de transaction.
export async function create({ name, email, passwordHash, currency }, db = pool) {
    const result = await db.query(
        `INSERT INTO users (name, email, password_hash, currency)
         VALUES ($1, $2, $3, $4)
         RETURNING id, name, email, currency, created_at`,
        [name, email, passwordHash, currency]
    );
    return result.rows[0];
}