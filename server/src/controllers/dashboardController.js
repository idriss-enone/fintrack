import * as dashboardModel from "../models/dashboardModel.js";

const pctChange = (current, previous) => {
    if (previous === 0) return current === 0 ? 0 : 100;
    return ((current - previous) / previous) * 100;
};

export async function getSummary(req, res) {
    try {
        const summary = await dashboardModel.getSummary(req.userId);

        const incomeThisMonth = parseFloat(summary.income_this_month);
        const expenseThisMonth = parseFloat(summary.expense_this_month);
        const incomeLastMonth = parseFloat(summary.income_last_month);
        const expenseLastMonth = parseFloat(summary.expense_last_month);

        const balance = incomeThisMonth - expenseThisMonth;
        const savingRate = incomeThisMonth > 0 ? (balance / incomeThisMonth) * 100 : 0;

        return res.json({
            incomeThisMonth,
            expenseThisMonth,
            incomeLastMonth,
            expenseLastMonth,
            balance,
            savingRate,
            incomeDelta: pctChange(incomeThisMonth, incomeLastMonth),
            expenseDelta: pctChange(expenseThisMonth, expenseLastMonth),
        });
    } catch (error) {
        console.error('GetSummary error', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}


export async function getCategoryBreakdown(req, res) {
    try {
        const rows = await dashboardModel.getCategoryBreakdown(req.userId);

        const totalExpenses = rows.reduce((sum, row) => sum + parseFloat(row.total), 0);

        const categories = rows.map((row) => {
            const total = parseFloat(row.total);
            return {
                categoryId: row.category_id,
                categoryName: row.category_name,
                categoryIcon: row.category_icon,
                categoryColor: row.category_color,
                total,
                transactionCount: row.transaction_count,
                percentage: totalExpenses > 0 ? (total / totalExpenses) * 100 : 0,
            };
        });

        return res.json({
            totalExpenses,
            categories,
        });
    } catch (error) {
        console.error('GetCategoryBreakdown error', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export async function getMonthlyTrend(req, res) {
    try {
        const rows = await dashboardModel.getMonthlyTrend(req.userId);

        const trend = rows.map((row) => {
            const income = parseFloat(row.income);
            const expense = parseFloat(row.expense);
            return {
                month: row.month,
                income,
                expense,
                balance: income - expense,
            };
        });

        return res.json(trend);
    } catch (error) {
        console.error('GetMonthlyTrend error', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export async function getFullMonthlyTrend(req, res) {
    try {
        const rows = await dashboardModel.getFullMonthlyTrend(req.userId);

        const trend = rows.map((row) => {
            const income = parseFloat(row.income);
            const expense = parseFloat(row.expense);
            return {
                month: row.month,
                income,
                expense,
                balance: income - expense,
            };
        });

        return res.json(trend);
    } catch (error) {
        console.error('GetFullMonthlyTrend error', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}