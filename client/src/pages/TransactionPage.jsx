import {
  Plus,
  X,
  Pencil,
  Trash2,
  Search,
  Wallet,
  ChevronLeft,
  ChevronRight,
  Download,
  Sparkles,
} from "lucide-react";
import { useTransaction } from "@/hooks/useTransaction";
import { formatCurrency, formatDate } from "@/utils/helpers.js";
import Modal from "@/components/Modal.jsx";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/EmptyState";
import Spinner from "@/components/Spinner";
import StatusPill from "@/components/StatusPill";
import CategoryBadge from "@/components/CategoryBadge";
import TransactionForm from "@/components/TransactionForm";
import TransactionTrendChart from "@/components/charts/TransactionTrendChart";

const TIME_RANGES = [
  { value: "30d", label: "30J" },
  { value: "3m", label: "3M" },
  { value: "monthly", label: "Mensuel" },
  { value: "yearly", label: "Annuel" },
];

const TYPE_LABELS = { income: "Revenu", expense: "Dépense" };

const TransactionsPage = () => {
  const {
    currency,
    loading,
    categories,

    form,
    errors,
    saving,
    setField,
    formCategories,

    filters,
    setFilter,
    counts,
    transactions,
    paginated,
    page,
    setPage,
    totalPages,
    pageNumbers,
    startIdx,
    rangeEnd,
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
    handleSubmit,
    exportCSV,
  } = useTransaction();

  const tabs = [
    {
      value: "",
      label: "Tout",
      count: counts.all,
      badge: "bg-slate-200 text-slate-700",
    },
    {
      value: "income",
      label: "Revenus",
      count: counts.income,
      badge: "bg-emerald-100 text-emerald-700",
    },
    {
      value: "expense",
      label: "Dépenses",
      count: counts.expense,
      badge: "bg-rose-100 text-rose-700",
    },
  ];

  return (
    <div className="space-y-4 md:space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-3xl font-bold text-slate-900 tracking-tight">
            Transactions
          </h1>
          <p className="text-sm text-slate-500 mt-1.5">
            Tous vos revenus et dépenses
          </p>
        </div>
        <Button onClick={onCreate}>
          <Plus size={16} aria-hidden="true" /> Ajouter une transaction
        </Button>
      </div>

      {/* Tendance */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden p-6">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Tendance des transactions
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Revenus et dépenses au fil du temps
            </p>
          </div>
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-full shrink-0">
            {TIME_RANGES.map((r) => (
              <button
                key={r.value}
                type="button"
                aria-pressed={timeRange === r.value}
                onClick={() => setTimeRange(r.value)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                  timeRange === r.value
                    ? "bg-white shadow-sm text-slate-900"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
        <TransactionTrendChart
          data={trendData}
          currency={currency}
          interval={chartInterval}
        />
      </div>

      {/* Analyse IA */}
      <div className="bg-white rounded-3xl border border-slate-100 p-5">
        {!analysis ? (
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-10 w-10 rounded-xl bg-linear-to-br from-violet-400 to-violet-600 flex items-center justify-center shrink-0">
                <Sparkles size={18} className="text-white" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-slate-900">
                  Analyse IA des dépenses
                </h3>
                <p className="text-sm text-slate-500 truncate">
                  Obtenez une analyse rapide des {transactions.length}{" "}
                  transaction{transactions.length !== 1 ? "s" : ""} de cette vue
                </p>
              </div>
            </div>
            <Button
              type="submit"
              disabled={analysisLoading || transactions.length === 0}
              onClick={generateInsight}
              size="sm"
            >
              {analysisLoading ? (
                <>
                  <Spinner size="sm" tone="light" label="" />
                  Analyse en cours…
                </>
              ) : (
                <>
                  <Sparkles size={14} aria-hidden="true" />
                  Générer
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="flex gap-4">
            <div className="h-10 w-10 rounded-xl bg-linear-to-br from-violet-400 to-violet-600 flex items-center justify-center shrink-0">
              <Sparkles size={18} className="text-white" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-slate-900">
                  Analyse IA des dépenses
                </h3>
                {analysis.highlight && (
                  <span className="inline-flex items-center bg-violet-50 text-violet-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {analysis.highlight}
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">
                {analysis.insight}
              </p>
              <button
                type="button"
                onClick={generateInsight}
                disabled={analysisLoading}
                className="mt-3 text-xs font-medium text-violet-600 hover:text-violet-700 disabled:opacity-50"
              >
                {analysisLoading
                  ? "Nouvelle analyse en cours…"
                  : "Relancer l'analyse"}
              </button>
            </div>
            <button
              type="button"
              onClick={dismissAnalysis}
              aria-label="Fermer l'analyse"
              className="text-slate-400 hover:text-slate-600 shrink-0 p-1"
            >
              <X size={16} aria-hidden="true" />
            </button>
          </div>
        )}
      </div>

      {/* Liste */}
      <div className="bg-white rounded-3xl border border-slate-100 p-5">
        <div className="flex flex-col lg:flex-row lg:items-center gap-3 mb-5">
          <div className="relative flex-1">
            <Search
              size={16}
              aria-hidden="true"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="search"
              value={filters.search}
              onChange={(e) => setFilter("search", e.target.value)}
              aria-label="Rechercher une transaction"
              placeholder="Rechercher dans la description ou les notes…"
              className="w-full pl-10 pr-4 py-2 rounded-full border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-full self-start lg:self-auto">
            {tabs.map((tab) => (
              <button
                key={tab.value || "all"}
                type="button"
                aria-pressed={filters.type === tab.value}
                onClick={() => setFilter("type", tab.value)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition flex items-center gap-2 ${
                  filters.type === tab.value
                    ? "bg-white shadow-sm text-slate-900"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {tab.label}
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${tab.badge}`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          <select
            value={filters.categoryId}
            onChange={(e) => setFilter("categoryId", e.target.value)}
            aria-label="Filtrer par catégorie"
            className="px-4 py-2 rounded-full border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            <option value="">Toutes les catégories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={exportCSV}
            disabled={transactions.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-full hover:bg-slate-50 transition-colors text-sm bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download size={15} aria-hidden="true" /> Exporter en CSV
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Spinner label="Chargement des transactions..." />
          </div>
        ) : transactions.length === 0 ? (
          <EmptyState
            icon={Wallet}
            title="Aucune transaction"
            description="Modifiez les filtres ou ajoutez une nouvelle transaction."
            action={
              <Button onClick={onCreate}>
                <Plus size={16} aria-hidden="true" /> Ajouter une transaction
              </Button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                  <th scope="col" className="pb-4 pr-4">
                    Catégorie
                  </th>
                  <th scope="col" className="pb-4 pr-4">
                    Description
                  </th>
                  <th scope="col" className="pb-4 pr-4">
                    Date
                  </th>
                  <th scope="col" className="pb-4 pr-4">
                    Type
                  </th>
                  <th scope="col" className="pb-4 pr-4 text-right">
                    Montant
                  </th>
                  <th scope="col" className="pb-4">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginated.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-4 pr-4">
                      <CategoryBadge
                        name={t.category_name || "Sans catégorie"}
                        icon={t.category_icon}
                        color={t.category_color}
                        size="sm"
                      />
                    </td>
                    <td className="py-4 pr-4 text-sm text-slate-700">
                      {t.description || "—"}
                    </td>
                    <td className="py-4 pr-4 text-sm text-slate-500 whitespace-nowrap">
                      {formatDate(t.transaction_date)}
                    </td>
                    <td className="py-4 pr-4">
                      <StatusPill
                        variant={t.type === "income" ? "income" : "expense"}
                      >
                        {TYPE_LABELS[t.type] ?? t.type}
                      </StatusPill>
                    </td>
                    <td
                      className={`py-4 pr-4 text-sm font-semibold text-right whitespace-nowrap ${
                        t.type === "income"
                          ? "text-emerald-600"
                          : "text-rose-600"
                      }`}
                    >
                      {t.type === "income" ? "+" : "-"}
                      {formatCurrency(t.amount, currency)}
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => onEdit(t)}
                          aria-label={`Modifier la transaction ${t.description || ""}`.trim()}
                          className="p-1.5 hover:bg-slate-100 rounded-md text-slate-500 transition"
                        >
                          <Pencil size={14} aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(t.id)}
                          aria-label={`Supprimer la transaction ${t.description || ""}`.trim()}
                          className="p-1.5 hover:bg-rose-50 rounded-md text-rose-500 transition"
                        >
                          <Trash2 size={14} aria-hidden="true" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-5 pt-5 border-t border-slate-100">
                <div className="text-xs text-slate-500">
                  Affichage de{" "}
                  <span className="font-semibold text-slate-700">
                    {startIdx + 1}-{rangeEnd}
                  </span>{" "}
                  sur{" "}
                  <span className="font-semibold text-slate-700">
                    {transactions.length}
                  </span>
                </div>
                <nav
                  aria-label="Pagination"
                  className="flex items-center gap-1"
                >
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    aria-label="Page précédente"
                    className="h-8 w-8 flex items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    <ChevronLeft size={16} aria-hidden="true" />
                  </button>
                  {pageNumbers.map((p, i) =>
                    p === "…" ? (
                      <span
                        key={`gap-${i}`}
                        className="px-1.5 text-slate-400 text-sm"
                      >
                        {p}
                      </span>
                    ) : (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPage(p)}
                        aria-label={`Page ${p}`}
                        aria-current={page === p ? "page" : undefined}
                        className={`h-8 min-w-8 px-2.5 rounded-lg text-sm font-medium transition ${
                          page === p
                            ? "bg-violet-600 text-white shadow-sm shadow-violet-500/30"
                            : "text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {p}
                      </button>
                    ),
                  )}
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    aria-label="Page suivante"
                    className="h-8 w-8 flex items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    <ChevronRight size={16} aria-hidden="true" />
                  </button>
                </nav>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="bg-white rounded-3xl border border-slate-100 p-6">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Tendance des transactions
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Revenus et dépenses au fil du temps
            </p>
          </div>
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-full shrink-0">
            {TIME_RANGES.map((r) => (
              <button
                key={r.value}
                type="button"
                className={`px-3 py-1 rounded-full text-xs font-medium transition text-slate-600 hover:text-slate-900`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
        <TransactionTrendChart />
      </div>

      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={editing ? "Modifier la transaction" : "Nouvelle transaction"}
      >
        <TransactionForm
          form={form}
          errors={errors}
          saving={saving}
          categories={formCategories}
          setField={setField}
          onSubmit={handleSubmit}
          onCancel={closeModal}
        />
      </Modal>
    </div>
  );
};

export default TransactionsPage;
