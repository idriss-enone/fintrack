import { useEffect, useMemo, useState } from "react";
import * as dashboardApi from "@/api/dashboardApi.js";
import * as transactionApi from "@/api/transactionApi.js";
import * as budgetApi from "@/api/budgetApi.js";
import useAuth from "@/hooks/useAuth";
import { formatMonth } from '@/utils/format.js';


export function useDashboard() {
    const { user } = useAuth();
    const currency = user?.currency || 'USD';

    const [summary, setSummary] = useState(null);
    const [trend, setTrend] = useState([]);
    const [breakdown, setBreakdown] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [budgets, setBudgets] = useState([]);
    const [loading, setLoading] = useState(true);

    const [error, setError] = useState(false);
    const [retrying, setRetrying] = useState(false);
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        let ignore = false;

        const load = async () => {
            try {
                const [s, t, b, tx, bd] = await Promise.all([
                    dashboardApi.getSummary(),
                    dashboardApi.getMonthlyTrend(),
                    dashboardApi.getCategoryBreakdown(),
                    transactionApi.list({ limit: 5 }),
                    budgetApi.list(),
                ])
                if (ignore) return;
                setSummary(s);
                setTrend(t);
                setBreakdown(b);
                setTransactions(tx)
                setBudgets(bd)
            }
            catch (err) {
                console.error(err);
                if (!ignore) setError(true);
            }
            finally {
                if (!ignore) {
                setLoading(false);
                setRetrying(false);
            }
            }
        }
        load();
        return () => {
            ignore = true;
        };
    }, [reloadKey])

    const retry = () => {
        setError(false);
        setLoading(true);
        setReloadKey((k) => k + 1);
    };
    const totalSpent = useMemo(
        () =>
            budgets.reduce((s, b) => s + parseFloat(b.spent), 0),
        [budgets],
    );

    const totalBudget = useMemo(
        () =>
            budgets.reduce((s, b) => s + parseFloat(b.amount), 0),
        [budgets],
    );

    const aggPct = useMemo(
        () =>
            totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0,
        [totalSpent, totalBudget],
    );

    const aggColor = aggPct >= 100 ? '#F43F5E' : aggPct >= 70 ? '#F59E0B' : '#10B981';

    const enrichedBudgets = useMemo(() => {
        return budgets.slice(0, 4).map((b) => {
            const spent = parseFloat(b.spent);
            const total = parseFloat(b.amount);
            const pct = total > 0 ? (spent / total) * 100 : 0;
            const color = pct >= 100 ? '#F43F5E' : pct >= 70 ? '#F59E0B' : '#10B981';
            return { ...b, spent, total, pct, color };
        });
    }, [budgets]);


    const barData = useMemo(
        () => {
            return trend.map((d) => ({
                month: formatMonth(d.month),
                income: parseFloat(d.income),
                expense: parseFloat(d.expense),
            }));
        },
        [trend],
    );




    return {
        currency,
        loading,
        summary,
        barData,
        breakdown,
        transactions,
        budgets,

        totalSpent,
        totalBudget,
        aggPct,
        aggColor,

        enrichedBudgets,
        error,
        retrying,
        retry
    }

}