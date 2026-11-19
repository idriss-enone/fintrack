import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import useAuth from "@/hooks/useAuth";
import { useDebounce } from "@/hooks/useDebounce";
import * as transactionApi from "@/api/transactionApi.js";
import * as categoryApi from "@/api/categoryApi.js";
import { toISODateString } from "@/utils/format";
import { buildTrendData } from "@/utils/transactionTrend";

const PAGE_SIZE = 20;
const EMPTY_FILTERS = { search: "", type: "", categoryId: "" };

const EMPTY_FORM = {
    type: "expense",
    amount: "",
    categoryId: "",
    description: "",
    notes: "",
    transactionDate: "",
};
const AMOUNT_REGEX = /^\d{1,10}(\.\d{1,2})?$/;

// Numéros de pages à afficher, avec "…" pour les trous
const getPageNumbers = (page, totalPages) => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (page <= 4) return [1, 2, 3, 4, 5, "…", totalPages];
    if (page >= totalPages - 3) {
        return [1, "…", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, "…", page - 1, page, page + 1, "…", totalPages];
};
// Échappe une cellule CSV (virgules, guillemets, retours à la ligne, formules)
const csvCell = (value) => {
    let s = String(value ?? "");
    if (/^[=+\-@]/.test(s)) s = `'${s}`; // évite l'exécution de formules dans Excel
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export function useTransaction() {

    const { user } = useAuth();
    const currency = user?.currency || "USD";

    // Données
    const [allTransactions, setAllTransactions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshKey, setRefreshKey] = useState(0);


    const [filters, setFilters] = useState(EMPTY_FILTERS);
    const [page, setPage] = useState(1);
    const [timeRange, setTimeRange] = useState("monthly");

    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);



    // Analyse IA
    const [analysis, setAnalysis] = useState(null);
    const [analysisLoading, setAnalysisLoading] = useState(false);

    const [form, setForm] = useState(EMPTY_FORM);
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);

    const debouncedSearch = useDebounce(filters.search, 400);
    // Transactions : rechargées quand la recherche, la catégorie ou refreshKey changent
    useEffect(() => {
        let ignore = false;

        const loadTransactions = async () => {
            const params = { limit: 2000 };
            if (debouncedSearch) params.search = debouncedSearch;
            if (filters.categoryId) params.categoryId = filters.categoryId;

            try {
                const data = await transactionApi.list(params);
                if (!ignore) setAllTransactions(data);
            } catch {
                if (!ignore) toast.error("Impossible de charger les transactions");
            } finally {
                if (!ignore) setLoading(false);
            }
        };

        loadTransactions();
        return () => {
            ignore = true;
        };
    }, [debouncedSearch, filters.categoryId, refreshKey]);

    // Catégories : chargées une seule fois
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


    const refresh = () => setRefreshKey((k) => k + 1);

    // Un changement de filtre revient à la page 1 et efface l'analyse devenue périmée
    const setFilter = (name, value) => {
        setFilters((prev) => ({ ...prev, [name]: value }));
        setPage(1);
        setAnalysis(null);
    };


    // Dérivés
    const transactions = useMemo(
        () => (filters.type ? allTransactions.filter((t) => t.type === filters.type) : allTransactions),
        [allTransactions, filters.type],
    );

    const counts = useMemo(
        () => ({
            all: allTransactions.length,
            income: allTransactions.filter((t) => t.type === "income").length,
            expense: allTransactions.filter((t) => t.type === "expense").length,
        }),
        [allTransactions],
    );

    const trendData = useMemo(
        () => buildTrendData(allTransactions, timeRange),
        [allTransactions, timeRange],
    );
    const chartInterval = timeRange === "30d" ? 3 : timeRange === "3m" ? 10 : 0;


    const totalPages = Math.max(1, Math.ceil(transactions.length / PAGE_SIZE));
    const safePage = Math.min(page, totalPages);
    const startIdx = (safePage - 1) * PAGE_SIZE;
    const paginated = transactions.slice(startIdx, startIdx + PAGE_SIZE);
    const pageNumbers = getPageNumbers(safePage, totalPages);
    const rangeEnd = Math.min(startIdx + PAGE_SIZE, transactions.length);


    // Modifie un champ ; changer le type remet la catégorie à zéro (elle doit avoir le même type)
    const setField = (name, value) => {
        setForm((prev) => ({
            ...prev,
            [name]: value,
            ...(name === "type" ? { categoryId: "" } : {}),
        }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
    };

    const onCreate = () => {
        setEditing(null);
        setForm({ ...EMPTY_FORM, transactionDate: toISODateString() });
        setErrors({});
        setModalOpen(true);
    };
    const onEdit = (t) => {
        setEditing(t);
        setForm({
            type: t.type,
            amount: t.amount,
            categoryId: t.category_id ?? "",
            description: t.description ?? "",
            notes: t.notes ?? "",
            transactionDate: (t.transaction_date || "").slice(0, 10),
        });
        setErrors({});
        setModalOpen(true);
    };

    const closeModal = () => setModalOpen(false);

    const validate = () => {
        const newErrors = {};
        if (!AMOUNT_REGEX.test(String(form.amount).trim()) || Number(form.amount) <= 0) {
            newErrors.amount = "Saisissez un montant supérieur à 0 (2 décimales maximum).";
        }
        if (!form.transactionDate) newErrors.transactionDate = "La date est requise.";
        if (form.description.length > 255) newErrors.description = "255 caractères maximum.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (saving || !validate()) return;

        setSaving(true);
        try {
            const payload = {
                type: form.type,
                amount: Number(form.amount),
                category_id: form.categoryId === "" ? null : Number(form.categoryId),
                description: form.description.trim() || null,
                notes: form.notes.trim() || null,
                transaction_date: form.transactionDate,
            };

            if (editing) {
                await transactionApi.update(editing.id, payload);
                toast.success("Transaction mise à jour");
            } else {
                await transactionApi.create(payload);
                toast.success("Transaction ajoutée");
            }
            setModalOpen(false);
            refresh();
        } catch (err) {
            toast.error(err.response?.data?.message || "Échec de l'enregistrement");
        } finally {
            setSaving(false);
        }
    };

    // Catégories proposées dans le formulaire : seulement celles du type choisi
    const formCategories = useMemo(
        () => categories.filter((c) => c.type === form.type),
        [categories, form.type],
    );

    // Suppression
    const onDelete = async (id) => {
        if (!confirm("Voulez-vous supprimer cette transaction ?")) return;
        try {
            await transactionApi.remove(id);
            toast.success("Transaction supprimée");
            refresh();
        } catch {
            toast.error("Impossible de supprimer la transaction");
        }
    }

    // Analyse IA des transactions affichées
    const generateInsight = async () => {
        if (transactions.length === 0) {
            toast.error("Aucune transaction à analyser");
            return;
        }

        setAnalysisLoading(true);
        try {
            const selectedIds = transactions.slice(0, 50).map((t) => t.id);
            const result = await transactionApi.analyze(selectedIds);
            setAnalysis(result);

            if (transactions.length > 50) {
                toast("Analyse basée sur les 50 premières transactions affichées");
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Échec de l'analyse");
        } finally {
            setAnalysisLoading(false);
        }
    }
    const dismissAnalysis = () => setAnalysis(null);




    // Export CSV des transactions affichées
    const exportCSV = () => {
        const headers = ["Date", "Description", "Type", "Catégorie", "Montant"];
        const rows = transactions.map((t) => [
            t.transaction_date,
            t.description,
            t.type === "income" ? "Revenu" : "Dépense",
            t.category_name || "Sans catégorie",
            t.amount,
        ]);
        const csv = [headers, ...rows].map((r) => r.map(csvCell).join(",")).join("\n");

        const a = document.createElement("a");
        a.href = "data:text/csv;charset=utf-8,\uFEFF" + encodeURIComponent(csv);
        a.download = `transactions-${toISODateString()}.csv`;
        a.click();
    };

    return {
        currency,
        loading,
        categories,

        form,
        errors,
        saving,
        setField,
        handleSubmit,
        formCategories,


        filters,
        setFilter,
        counts,
        transactions,
        paginated,


        page: safePage,
        setPage,
        totalPages,
        pageNumbers,
        startIdx,
        rangeEnd,
        pageSize: PAGE_SIZE,


        timeRange,
        setTimeRange,
        trendData,
        chartInterval,

        analysis,
        analysisLoading,
        generateInsight,
        dismissAnalysis,


        modalOpen,
        closeModal,
        editing,

        onCreate,
        onEdit,
        onDelete,
        exportCSV,

    }

}