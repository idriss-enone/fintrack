import { toISODateString } from "../utils/format";
import { mockUser, mockCategories, mockBudgets, mockBudgetAnalyses } from "../utils/mockData";
//import { getAccessToken } from "./storage";

const delay = (ms = 2500) => new Promise((resolve) => setTimeout(resolve, ms));
let nextId = 1000;
const newId = () => nextId++;

const DEMO_PASSWORD = "Demo1234!";

// Utilisateurs connus du mock (le compte de démo + ceux créés pendant la session)
const users = [{ ...mockUser, password: DEMO_PASSWORD }];
const categories = [...mockCategories]
let budgets = [...mockBudgets];
const analyses = [...mockBudgetAnalyses];

const publicUser = ({ password, ...user }) => user;

// Même forme qu'une erreur axios, pour que le code de l'app la traite pareil
const httpError = (status, message) =>
    Object.assign(new Error(message), { response: { status, data: { message } } });

const tokenFor = (user) => `mock-token-${user.id}`;


// Début et fin de la période en cours (semaine : lundi à dimanche, comme date_trunc('week'))
const getPeriodBounds = (period) => {
    const today = new Date();
    if (period === "weekly") {
        const daysSinceMonday = (today.getDay() + 6) % 7;
        const start = new Date(today.getFullYear(), today.getMonth(), today.getDate() - daysSinceMonday);
        const end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 6);
        return { start: toISODateString(start), end: toISODateString(end) };
    }
    return {
        start: toISODateString(new Date(today.getFullYear(), today.getMonth(), 1)),
        end: toISODateString(new Date(today.getFullYear(), today.getMonth() + 1, 0)),
    };
};

const api = {
    get: async (url) => {
        // Simulation d'un appel réseau
        await delay();

        if (url === '/auth/me') {
            return { data: mockUser }
        }

        if (url === '/categories') return { data: mockCategories };
        if (url === "/budgets") return { data: budgets };

        return { data: null };
    },
    post: async (url, body = {}) => {
        // Simulation d'un appel réseau
        await delay();
        if (url === '/auth/login') {
            const email = String(body.email ?? "").trim().toLowerCase();
            const user = users.find((u) => u.email === email);
            if (!user || user.password !== body.password) {
                throw httpError(401, "Invalid credentials");
            }
            return { data: { user: publicUser(user), token: tokenFor(user) } };
        }
        if (url === '/auth/register') {
            const email = String(body.email ?? "").trim().toLowerCase();
            if (users.some((u) => u.email === email)) {
                throw httpError(409, "Email already registered");
            }
            const user = {
                id: newId(),
                name: body.name,
                email,
                currency: body.currency || "USD",
                password: body.password,
            };
            users.push(user);
            return { data: { user: publicUser(user), token: tokenFor(user) } };
        }
        if (url === '/categories') return { data: { id: newId(), is_default: false, ...body } };
        if (url === "/budgets") {
            const category = categories.find((c) => c.id === body.categoryId);
            if (!category) throw httpError(404, "Category not found");

            // Même règle que UNIQUE (user_id, category_id, period)
            if (budgets.some((b) => b.category_id === body.categoryId && b.period === body.period)) {
                throw httpError(409, "A budget already exists for this category and period");
            }
            const { start, end } = getPeriodBounds(body.period);

            const budget = {
                id: newId(),
                user_id: 1,
                category_id: category.id,
                category_name: category.name,
                category_icon: category.icon,
                category_color: category.color,
                amount: body.amount,
                spent: 0,
                remaining: body.amount,
                period: body.period,
                start_date: toISODateString(),
                period_start: start,
                period_end: end,
            };
            budgets = [...budgets, budget];
            return { data: budget };
        };

        if (url === "/budgets/analyze") {
            return { data: { analyses } };
        }

        return { data: null }
    },
    patch: async (url, body = {}) => {
        await delay();
        const id = parseInt(url.match(/\/(\d+)$/)?.[1], 10);

        if (url.startsWith("/budgets/")) {
            const budget = budgets.find((b) => b.id === id);
            if (!budget) throw httpError(404, "Budget not found");

            const period = body.period ?? budget.period;
            if (budgets.some((b) => b.id !== id && b.category_id === budget.category_id && b.period === period)) {
                throw httpError(409, "A budget already exists for this category and period");
            }

            const { start, end } = getPeriodBounds(period);
            const amount = body.amount ?? budget.amount;
            const updated = {
                ...budget,
                amount,
                period,
                remaining: amount - budget.spent,
                period_start: start,
                period_end: end,
            };
            budgets = budgets.map((b) => (b.id === id ? updated : b));
            return { data: updated };
        }

        return { data: { id, ...body } }
    },

    delete: async (url) => {
        await delay();
        const id = parseInt(url.match(/\/(\d+)$/)?.[1], 10);

        if (url.startsWith("/budgets/")) {
            budgets = budgets.filter((b) => b.id !== id);
        }
        return { data: { message: "deleted" } };
    }

}

export default api