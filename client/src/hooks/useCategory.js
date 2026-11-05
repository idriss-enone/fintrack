import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import * as categoryApi from "@/api/categoryApi.js";

const EMPTY_FORM = {
    name: "",
    type: "expense",
    icon: "tag",
    color: "#10B981",
};

export function useCategory() {
    // Données
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categoriesKey, setCategoriesKey] = useState(0);

    // Modal
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);

    // Formulaire
    const [form, setForm] = useState(EMPTY_FORM);
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);

    // Chargement (relancé quand categoriesKey change)
    useEffect(() => {
        let ignore = false;

        const loadCategories = async () => {
            try {
                const data = await categoryApi.list();
                if (!ignore) setCategories(data);
            } catch {
                if (!ignore) toast.error("Impossible de charger les catégories");
            } finally {
                if (!ignore) setLoading(false);
            }
        };

        loadCategories();

        return () => {
            ignore = true;
        };
    }, [categoriesKey]);

    const refresh = () => setCategoriesKey((k) => k + 1);

    // Modifie un champ du formulaire et efface son erreur
    const setField = (name, value) => {
        setForm((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
    };

    // Ouvrir / fermer la modal
    const onCreate = () => {
        setEditing(null);
        setForm(EMPTY_FORM);
        setErrors({});
        setModalOpen(true);
    };

    const onEdit = (category) => {
        setEditing(category);
        setForm({
            name: category.name,
            type: category.type,
            icon: category.icon || "tag",
            color: category.color || "#10B981",
        });
        setErrors({});
        setModalOpen(true);
    };

    const closeModal = () => setModalOpen(false);

    // Validation
    const validate = () => {
        const newErrors = {};
        if (!form.name.trim()) newErrors.name = "Le nom est requis.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Enregistrement (création ou modification)
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (saving || !validate()) return;

        setSaving(true);
        try {
            const payload = {
                name: form.name.trim(),
                icon: form.icon,
                color: form.color,
            };

            if (editing) {
                await categoryApi.update(editing.id, payload);
                toast.success("Catégorie mise à jour");
            } else {
                await categoryApi.create({ ...payload, type: form.type });
                toast.success("Catégorie créée");
            }

            setModalOpen(false);
            refresh();
        } catch (err) {
            toast.error(err.response?.data?.message || "Échec de l'enregistrement");
        } finally {
            setSaving(false);
        }
    };

    // Suppression
    const onDelete = async (id) => {
        if (
            !confirm(
                "Supprimer cette catégorie ? Les transactions associées deviendront « sans catégorie ».",
            )
        )
            return;

        try {
            await categoryApi.remove(id);
            toast.success("Catégorie supprimée");
            refresh();
        } catch {
            toast.error("Échec de la suppression");
        }
    };

    // Catégories groupées par type
    const grouped = [
        { label: "Revenus", items: categories.filter((c) => c.type === "income") },
        { label: "Dépenses", items: categories.filter((c) => c.type === "expense") },
    ];

    return {
        // données
        categories,
        grouped,
        loading,
        // modal
        modalOpen,
        closeModal,
        editing,
        // formulaire
        form,
        errors,
        saving,
        setField,
        handleSubmit,
        // actions
        onCreate,
        onEdit,
        onDelete,
    };
}

