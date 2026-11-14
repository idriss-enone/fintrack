const MONTH_NAMES = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Aoû", "Sep", "Oct", "Nov", "Déc"];

const pad = (n) => String(n).padStart(2, "0");

// Agrège les transactions en tranches (jours, mois ou années) pour la courbe
export function buildTrendData(transactions, timeRange, now = new Date()) {
    const buckets = [];
    let keyOf;

    if (timeRange === "30d" || timeRange === "3m") {
        const totalDays = timeRange === "30d" ? 30 : 90;
        for (let i = totalDays - 1; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
            buckets.push({
                key: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
                label: `${d.getDate()}/${d.getMonth() + 1}`,
                income: 0,
                expense: 0,
            });
        }
        keyOf = (date) => date; // AAAA-MM-JJ
    } else if (timeRange === "monthly") {
        for (let i = 11; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            buckets.push({
                key: `${d.getFullYear()}-${pad(d.getMonth() + 1)}`,
                label: `${MONTH_NAMES[d.getMonth()]} ${String(d.getFullYear()).slice(2)}`,
                income: 0,
                expense: 0,
            });
        }
        keyOf = (date) => date.slice(0, 7); // AAAA-MM
    } else if (timeRange === "yearly") {
        for (let i = 4; i >= 0; i--) {
            const y = String(now.getFullYear() - i);
            buckets.push({ key: y, label: y, income: 0, expense: 0 });
        }
        keyOf = (date) => date.slice(0, 4); // AAAA
    } else {
        return [];
    }

    const map = new Map(buckets.map((b) => [b.key, b]));
    for (const t of transactions) {
        const date = (t.transaction_date || "").slice(0, 10);
        const entry = map.get(keyOf(date));
        if (!entry) continue;
        const amount = parseFloat(t.amount) || 0;
        if (t.type === "income") entry.income += amount;
        else entry.expense += amount;
    }
    return buckets;
}