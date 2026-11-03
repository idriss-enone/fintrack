import "dotenv/config";
import pkg from "pg";

const { Pool, types } = pkg;

// Les colonnes DATE (OID 1082) sont renvoyées en 'YYYY-MM-DD' au lieu d'un objet Date JS,
// pour éviter les décalages de fuseau horaire à la sérialisation JSON.
types.setTypeParser(1082, (val) => val);

// Les colonnes NUMERIC (OID 1700) sont renvoyées en nombre au lieu d'une string ("12.50" -> 12.5).
types.setTypeParser(1700, (val) => parseFloat(val));

// DATABASE_URL (Neon) doit contenir ?sslmode=require
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 20,                        // nombre max de clients dans le pool
    idleTimeoutMillis: 30000,       // inactivité avant fermeture d'une connexion
    connectionTimeoutMillis: 30000, // temps max pour obtenir une connexion (réveil de Neon inclus)
});

pool.on('connect', (client) => {
    console.log('Connected to Neon Postgres');
});

// Neon ferme régulièrement les connexions inactives : on log, on ne tue pas le serveur.
pool.on('error', (err) => {
    console.error('Unexpected Postgres error', err);
    //process.exit(-1);
});

// Exécute callback(client) dans une transaction : COMMIT si tout réussit, ROLLBACK si une erreur survient.
// Le client est toujours rendu au pool, même en cas d'erreur.
export async function withTransaction(callback) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const result = await callback(client);
        await client.query('COMMIT');
        return result;
    } catch (error) {
        await client.query('ROLLBACK').catch(() => { });
        throw error;
    } finally {
        client.release();
    }
}

export default pool;