import readline from "node:readline/promises";
import { stdin, stdout } from "node:process";

export const getDbHost = () => {
    try {
        return new URL(process.env.DATABASE_URL).hostname;
    } catch {
        return "unknown";
    }
};

// Demande de taper le nom d'hôte de la base. "--yes" saute la question (scripts, CI).
export const confirmHost = async (host, action) => {
    if (process.argv.includes("--yes")) return true;
    if (!stdin.isTTY) return false; // pas de terminal interactif : on refuse par sécurité

    const rl = readline.createInterface({ input: stdin, output: stdout });
    try {
        console.log(`\nWARNING: this will ${action} on ${host}`);
        const answer = await rl.question("Type the database host to confirm: ");
        return answer.trim() === host;
    } finally {
        rl.close();
    }
};