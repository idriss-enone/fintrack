import { useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import useAuth from "@/hooks/useAuth";
import * as budgetApi from "@/api/budgetApi.js";
import * as categoryApi from "@/api/categoryApi.js";

const EMPTY_FORM = {
    categoryId: "",
    amount: "",
    period: "monthly",
};

export function useBudget() {
    const { user } = useAuth();
    const currency = user?.currency || "USD";
    const [budgets, setBudgets] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [analyses, setAnalyses] = useState({});
    const [analyzing, setAnalyzing] = useState(false);


    const [form, setForm] = useState(EMPTY_FORM);
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);

    const [budgetKey, setBudgetKey] = useState(0);
    const [analysisKey, setAnalysisKey] = useState(0);



    useEffect(() => {
        let ignore = false;

        const loadBudgets = async () => {
            try {
                const data = await budgetApi.list();
                if (!ignore) setBudgets(data);
            } catch {
                if (!ignore) toast.error("Impossible de charger les budgets");
            } finally {
                if (!ignore) setLoading(false);
            }
        };
        loadBudgets();
        return () => {
            ignore = true;
        };
    }, [budgetKey]);


    useEffect(() => {
        let ignore = false;

        const loadCategories = async () => {
            try {
                const data = await categoryApi.list();
                if (!ignore) setCategories(data);
            } catch {
                if (!ignore) toast.error("Impossible de charger les catégories");
            }
        };

        loadCategories();

        return () => {
            ignore = true;
        };
    }, []);

    // Analyse IA : relancée quand les budgets changent ou quand on clique sur le bouton
    useEffect(() => {
        //if (budgets.length === 0) return;
        let ignore = false;

        const runAnalysis = async () => {
            setAnalyzing(true);
            setAnalyses({});
            try {
                const data = await budgetApi.analyze();
                if (ignore) return;

                const map = {};
                (data?.analyses ?? []).forEach((a) => {
                    map[a.budgetId] = a;
                });
                setAnalyses(map);
            } catch (err) {
                console.error("Failed to analyze budgets", err);
                if (!ignore) toast.error("Impossible d'analyser les budgets");
            } finally {
                if (!ignore) setAnalyzing(false);
            }
        };

        runAnalysis();

        return () => {
            ignore = true;
        };
    }, [analysisKey]);

    const refresh = () => setBudgetKey((k) => k + 1);
    // Utilisé par le bouton « Analyser » : relance l'effet ci-dessus
    const analyzeAll = () => setAnalysisKey((k) => k + 1);
    // Modifie un champ du formulaire et efface son erreur
    const setField = (name, value) => {
        setForm((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
    };

    const onCreate = () => {
        setEditing(null);
        setForm(EMPTY_FORM);
        setErrors({});
        setModalOpen(true);
    };
    const onEdit = (budget) => {
        setEditing(budget);
        setForm({
            categoryId: budget?.category_id,
            amount: budget.amount,
            period: budget.period || "monthly",
        });
        setErrors({});
        setModalOpen(true);
    };

    const validate = () => {
        const newErrors = {};
        if (!form.categoryId) newErrors.categoryId = "Sélectionnez une catégorie.";
        if (!form.amount || parseFloat(form.amount) <= 0)
            newErrors.amount = "Le montant doit être supérieur à 0.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (saving || !validate()) return;
        setSaving(true);
        try {
            const payload = {
                amount: parseFloat(form.amount),
                period: form.period,
            };
            if (editing) {
                await budgetApi.update(editing.id, payload);
                toast.success("Budget mis à jour");
            } else {
                await budgetApi.create({ ...payload, categoryId: parseInt(form.categoryId, 10) });
                toast.success("Budget créé");
            }
            setModalOpen(false);
            refresh();
        } catch (err) {
            toast.error(err.response?.data?.message || "Échec de l'enregistrement");
        } finally {
            setSaving(false);
        }
    };

    const closeModal = () => setModalOpen(false);

    const expenseCategories = useMemo(
        () => categories.filter((c) => c.type === "expense"),
        [categories],
    );

    // Catégories qui n'ont pas encore de budget défini
    const availableCategories = useMemo(
        () => expenseCategories.filter(c => !budgets.some(b => b.category_id === c.id)),
        [expenseCategories, budgets]
    );
    const enrichedBudgets = useMemo(() => {
        return budgets.map((b) => {
            const spent = parseFloat(b.spent);
            const total = parseFloat(b.amount);
            const rawPct = total > 0 ? (spent / total) * 100 : 0;
            const over = spent > total;
            const analysis = analyses[b.id];
            return { ...b, spent, total, rawPct, over, analysis };
        });
    }, [budgets, analyses]);

    const onDelete = async (id) => {
        if (
            !confirm(
                "Voulez-vous vraiment supprimer ce budget ?",
            )
        )
            return;

        try {
            await budgetApi.remove(id);
            toast.success("Budget supprimé");
            refresh();
        } catch {
            toast.error("Échec de la suppression");
        }
    };

    const hasAnalyses = Object.keys(analyses).length > 0;

    return {
        currency,
        loading,
        budgets,
        analyzing,
        availableCategories,
        enrichedBudgets,
        hasAnalyses,

        modalOpen,
        closeModal,
        editing,

        form,
        errors,
        saving,
        setField,
        handleSubmit,

        analyzeAll,
        onCreate,
        onEdit,
        onDelete,
    }

}