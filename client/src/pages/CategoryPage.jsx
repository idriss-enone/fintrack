import { Plus, Folder, Pencil, Trash2 } from "lucide-react";
import { useCategory } from "@/hooks/useCategory";
import Button from "@/components/ui/Button";
import Modal from "@/components/Modal";
import CategoryBadge from "@/components/CategoryBadge";
import EmptyState from "@/components/EmptyState";
import Spinner from "@/components/Spinner";
import StatusPill from "@/components/StatusPill";
import CategoryForm from "@/components/CategoryForm";

const CategoryPage = () => {
  const {
    modalOpen,
    closeModal,
    editing,
    form,
    errors,
    saving,
    setField,
    handleSubmit,
    loading,
    categories,
    grouped,
    onCreate,
    onEdit,
    onDelete,
  } = useCategory();

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Catégories
          </h1>
          <p className="text-sm text-slate-500 mt-1.5">
            Organisez vos transactions par catégorie
          </p>
        </div>
        <Button onClick={onCreate}>
          <Plus size={16} /> Nouvelle catégorie
        </Button>
      </div>
      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner label="Chargement des catégories..." />
        </div>
      ) : categories.length === 0 ? (
        <EmptyState
          icon={Folder}
          title="Aucune catégorie"
          description="Ajoutez une catégorie pour organiser vos transactions."
        />
      ) : (
        <>
          {grouped.map((group) => (
            <div key={group.label}>
              <h2 className="font-semibold text-slate-900 mb-3">
                {group.label}{" "}
                <span className="text-slate-400 font-normal">
                  ({group.items.length})
                </span>
              </h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {group.items.map((c) => {
                  return (
                    <li
                      key={c.id}
                      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center justify-between group"
                    >
                      <CategoryBadge
                        name={c.name}
                        icon={c.icon}
                        color={c.color}
                      />
                      <div className="flex items-center gap-1.5">
                        {c.is_default && (
                          <StatusPill variant="neutral">défaut</StatusPill>
                        )}
                        <button
                          type="button"
                          onClick={() => onEdit(c)}
                          aria-label={`Modifier la catégorie ${c.name}`}
                          className="p-1.5 hover:bg-slate-100 rounded-md text-slate-500 transition"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(c.id)}
                          aria-label={`Supprimer la catégorie ${c.name}`}
                          className="p-1.5 hover:bg-rose-50 rounded-md text-rose-500 transition "
                        >
                          <Trash2 size={16} aria-hidden="true" />
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </>
      )}
      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={editing ? "Modifier la catégorie" : "Nouvelle catégorie"}
      >
        <CategoryForm
          form={form}
          errors={errors}
          saving={saving}
          isEditing={Boolean(editing)}
          setField={setField}
          onSubmit={handleSubmit}
          onCancel={closeModal}
        />
      </Modal>
    </div>
  );
};

export default CategoryPage;
