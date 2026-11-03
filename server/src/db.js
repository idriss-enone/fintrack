import "dotenv/config";
import pkg from "pg";

const { Pool, types } = pkg;

// ÉTAPE A : Sécurité anti-écrasement
// On ne charge dotenv qu'en local pour éviter qu'il perturbe Railway

if (process.env.NODE_ENV !== 'production') {
    await import('dotenv/config');
}

// ÉTAPE B : Forcer un crash explicite si Railway ne donne pas la variable
// Cela évitera que le driver pg essaie discrètement d'utiliser 127.0.0.1
if (!process.env.DATABASE_URL) {
    throw new Error("❌ ERREUR CRITIQUE : DATABASE_URL est introuvable ou indéfinie par l'hébergeur (Railway) !");
}

<<<<<<< HEAD

=======
>>>>>>> d9547803920128e05741f49bc7c41afdb904c8f0
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
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
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