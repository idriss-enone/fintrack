import fs from "fs/promises";
import path from "path";
import readline from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { fileURLToPath } from "url";
import pool from "../db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DROP_ALL = `
DROP TABLE IF EXISTS ai_insights, goals, recurrents, budgets, transactions, categories, users CASCADE;
`;

const getHost = () => {
    try {
        return new URL(process.env.DATABASE_URL).hostname;
    } catch {
        return "unknown";
    }
};

// Demande de taper le nom d'hôte de la base. "--yes" saute la question (scripts, CI).
const confirmReset = async (host) => {
    if (process.argv.includes('--yes')) return true;
    if (!stdin.isTTY) return false; // pas de terminal interactif : on refuse par sécurité

    const rl = readline.createInterface({ input: stdin, output: stdout });
    try {
        console.log(`\nWARNING: this will DELETE ALL TABLES on ${host}`);
        const answer = await rl.question("Type the database host to confirm: ");
        return answer.trim() === host;
    } finally {
        rl.close();
    }
};

const runMigration = async () => {
    const shouldReset = process.argv.includes('--reset');
    const host = getHost();
    // __dirname = "src/scripts" -> ".." remonte dans "src", puis "sql/schema.sql"
    const schemaPath = path.join(__dirname, '..', 'sql', 'schema.sql');

    try {
        console.log(`Target database: ${host}`);

        if (shouldReset) {
            if (process.env.NODE_ENV === 'production') {
                throw new Error("--reset is disabled when NODE_ENV=production");
            }
            if (!(await confirmReset(host))) {
                console.log("Reset cancelled. Nothing was changed.");
                return;
            }
            console.log("Dropping existing tables...");
            await pool.query(DROP_ALL);
        }

        console.log(`Reading schema from ${schemaPath}`);
        const schema = await fs.readFile(schemaPath, 'utf-8');

        console.log("Running migration...");
        await pool.query(schema);

        console.log("Migration complete. Tables created.");
    } catch (error) {
        console.error("Migration failed.", error.message);
        process.exitCode = 1;
    } finally {
        await pool.end();
    }
};

runMigration();