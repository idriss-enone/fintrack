import 'dotenv/config';
import { GoogleGenAI, Type } from '@google/genai';

// Coupe la requête proprement après 30 secondes (30000 ms) si Google est saturé
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
        timeout: 30000, // 30 secondes max par tentative
    },
});

const GEMINI_MODEL = 'gemini-3.5-flash-lite';

if (!process.env.GEMINI_API_KEY) {
    console.error("ATTENTION : GEMINI_API_KEY n'est pas définie. Les fonctionnalités IA ne fonctionneront pas.");
}

function stripMarkdown(text) {
    let cleaned = text.trim();
    if (cleaned.startsWith('```json')) {
        cleaned = cleaned.replace(/^```json\n?/g, '').replace(/```\n?\$/g, '');
    } else if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/^```\n?/g, '').replace(/```\n?$/g, '');
    }
    return cleaned.trim();
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Exécute l'appel Gemini avec réessai automatique en cas de surcharge temporaire (503/504).
 */
async function generateWithRetry(params, maxRetries = 3) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await ai.models.generateContent({
                model: GEMINI_MODEL,
                ...params,

            });
        } catch (error) {
            const isTransient = error?.status === 503 || error?.status === 504;
            if (isTransient && attempt < maxRetries) {
                const delayMs = attempt * 1500;
                console.warn(
                    `Gemini temporairement lent (${error?.status}). Nouvelle tentative ${attempt}/${maxRetries} dans ${delayMs}ms...`
                );
                await sleep(delayMs);
                continue;
            }
            throw error;
        }
    }
}

/**
 * Analyse une liste de transactions en français et dégage les tendances clés via Gemini.
 */
export async function analyzeTransactionList({
    transactions = [],
    currency = 'USD',
}) {
    const formatDate = (d) => {
        if (!d) return '';
        if (d instanceof Date) {
            const y = d.getFullYear();
            const m = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            return `${y}-${m}-${day}`;
        }
        return String(d).slice(0, 10);
    };

    const lines = transactions
        .slice(0, 50)
        .map((t) => {
            const date = formatDate(t.transaction_date);
            const amt = (parseFloat(t.amount) || 0).toFixed(2);
            const cat = t.category_name || 'Sans catégorie';
            const desc = t.description ? ` | ${t.description}` : '';
            return `- ${date} : ${t.type} ${amt} ${currency} | ${cat}${desc}`;
        })
        .join('\n');

    const prompt = `Analyse ces ${transactions.length} transactions et fournis une synthèse utile et concise en français. Concentre-toi sur les habitudes de consommation, les postes notables et les tendances récurrentes.

Transactions (50 plus récentes maximum) :
${lines}

Contraintes :
- Rédige toutes les valeurs textuelles en français naturel.
- "insight" : analyse de 2 à 4 phrases citant des montants et chiffres précis issus des transactions. Ton bienveillant et constructif.
- "highlight" : une seule expression courte résumant le point clé (ex. : "Forte dépense en restauration", "Revenus stables", "Pic d'achats loisirs").`;

    try {
        const response = await generateWithRetry({
            contents: prompt,
            config: {
                systemInstruction:
                    "Tu es un conseiller financier personnel bienveillant et précis. Tu analyses l'historique des transactions de l'utilisateur et tu réponds exclusivement en français avec des observations claires et chiffrées.",
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        insight: {
                            type: Type.STRING,
                            description: 'Analyse en français de 2 à 4 phrases citant des chiffres précis des transactions.',
                        },
                        highlight: {
                            type: Type.STRING,
                            description: 'Courte expression en français résumant le point principal à retenir.',
                        },
                    },
                    required: ['insight', 'highlight'],
                },
                temperature: 0.4,
            },
        });

        const cleanedJsonText = stripMarkdown(response.text);
        return JSON.parse(cleanedJsonText);
    } catch (error) {
        console.error("Erreur lors de l'analyse des transactions :", error);
        throw new Error("Impossible d'analyser la liste des transactions.");
    }
}
