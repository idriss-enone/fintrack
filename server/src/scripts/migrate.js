import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import pool from "../db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DROP_ALL = `
DROP TABLE IF EXISTS ai_insights, goals, recurrents, budgets, transactions, categories, users CASCADE;
`;

const runMigration = async () => {
    const shouldReset = process.argv.includes('--reset');
    // __dirname = "src/scripts" -> ".." remonte dans "src", puis "sql/schema.sql"
    const schemaPath = path.join(__dirname, '..', 'sql', 'schema.sql');

    try {
        if (shouldReset) {
            if (process.env.NODE_ENV === 'production') {
                throw new Error("--reset is disabled when NODE_ENV=production");
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