import { Link } from "react-router-dom";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  ArrowRight,
  Target,
} from "lucide-react";
import { useDashboard } from "@/hooks/useDashboard";
import { formatCurrency, formatDate } from "@/utils/format.js";
import Button from "@/components/ui/Button";
import AlertBox from "@/components/AlertBox";
import KpiCard from "@/components/KpiCard";
import CategoryBadge from "../components/CategoryBadge";
import MonthlyTrendChart from "@/components/charts/MonthlyTrendChart";
import CategoryBreakdownChart from "@/components/charts/CategoryBreakdownChart";
import EmptyState from "@/components/EmptyState";
import ProgressBar from "@/components/ProgressBar";
import Spinner from "@/components/Spinner";

const Home = () => {
  const {
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
    retry,
  } = useDashboard();

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size="lg" label="Chargement du tableau de bord..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          Tableau de bord
        </h1>
        <p className="text-sm text-slate-500 mt-1.5">
          Vue d'ensemble de vos finances pour ce mois.
        </p>
      </header>
      {!error && (
        <AlertBox
          type="danger"
          title="Impossible de charger le tableau de bord"
          message="Vérifiez votre connexion, puis réessayez."
          action={
            <Button
              size="sm"
              variant="outline"
              onClick={retry}
              disabled={retrying}
            >
              {retrying ? "Nouvelle tentative…" : "Réessayer"}
            </Button>
          }
        />
      )}
      <section aria-labelledby="stats-heading">
        <h2 id="stats-heading" className="sr-only">
          Statistiques
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            label="Solde net"
            value={formatCurrency(summary?.balance ?? 0, currency)}
            icon={Wallet}
            accent="violet"
          />
          <KpiCard
            label="Total revenus"
            value={formatCurrency(summary?.incomeThisMonth ?? 0, currency)}
            delta={summary?.incomeDelta}
            icon={TrendingUp}
            accent="orange"
          />
          <KpiCard
            label="Total dépenses"
            value={formatCurrency(summary?.expenseThisMonth ?? 0, currency)}
            delta={summary?.expenseDelta}
            icon={TrendingDown}
            accent="rose"
            invertDelta
          />
          <KpiCard
            label="Taux d'épargne"
            value={`${(summary?.savingsRate ?? 0)?.toFixed(1)}%`}
            icon={PiggyBank}
            accent="blue"
          />
        </div>
      </section>

      {/* Section Graphiques */}
      <section aria-labelledby="charts-heading">
        <h2 id="charts-heading" className="sr-only">
          Analyse graphique
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Graphique en barres */}
          <article className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 p-6">
            <header className="mb-5">
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                Tendance mensuelle
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Revenus vs Dépenses, des 6 derniers mois
              </p>
            </header>
            <MonthlyTrendChart data={barData} currency={currency} />
          </article>

          {/* Graphique Donut */}
          <article className="bg-white rounded-3xl border border-slate-100 p-6">
            <header className="mb-5">
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                Top catégories
              </h3>
              <p className="text-xs text-slate-500 mt-1">Dépenses de ce mois</p>
            </header>
            <CategoryBreakdownChart data={breakdown} currency={currency} />
          </article>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Dernières transactions */}
        <section
          aria-labelledby="recent-transactions-heading"
          className="lg:col-span-7 bg-white rounded-3xl border border-slate-100 p-6"
        >
          <header className="mb-5 flex items-center justify-between">
            <h2
              id="recent-transactions-heading"
              className="text-lg font-bold text-slate-900 tracking-tight"
            >
              Transactions récentes
            </h2>
            {transactions.length > 0 && (
              <Link
                to="/transactions"
                aria-label="Voir toutes les transactions"
                className="inline-flex items-center gap-1 text-sm font-medium text-violet-600 hover:text-violet-700 transition"
              >
                Voir tout
                <ArrowRight size={14} aria-hidden="true" />
              </Link>
            )}
          </header>

          {transactions.length === 0 ? (
            <EmptyState
              icon={Target}
              title="Aucune transaction trouvée."
              action={
                <Link
                  to="/transactions"
                  className="text-xs text-violet-600 font-medium hover:text-violet-700"
                >
                  En créer une
                </Link>
              }
            />
          ) : (
            <ul className="space-y-2">
              {transactions.slice(0, 6).map((t) => (
                <li
                  key={t.id}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <CategoryBadge
                      icon={t.category_icon}
                      color={t.category_color}
                      size="sm"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {t.description || t.category_name || "Sans titre"}
                      </p>
                      <p className="text-xs text-slate-500">
                        {t.category_name || "Non catégorisé"} ·{" "}
                        <time dateTime={t.transaction_date}>
                          {formatDate(t.transaction_date)}
                        </time>
                      </p>
                    </div>
                  </div>
                  <data
                    value={t.type === "income" ? t.amount : -t.amount}
                    className={`text-sm font-bold shrink-0 ${
                      t.type === "income"
                        ? "text-emerald-600"
                        : "text-orange-500"
                    }`}
                  >
                    <span className="sr-only">
                      {t.type === "income" ? "Revenu de " : "Dépense de "}
                    </span>
                    {t.type === "income" ? "+" : "-"}
                    {formatCurrency(t.amount, currency)}
                  </data>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Status Budgets */}
        <section
          aria-labelledby="budgets-status-heading"
          className="lg:col-span-5 bg-white rounded-3xl border border-slate-100 p-6"
        >
          <header className="mb-5 flex items-center justify-between">
            <h2
              id="budgets-status-heading"
              className="text-lg font-bold text-slate-900 tracking-tight"
            >
              État des budgets
            </h2>
            {budgets.length > 0 && (
              <Link
                to="/budgets"
                aria-label="Voir tous les budgets"
                className="inline-flex items-center gap-1 text-sm font-medium text-violet-600 hover:text-violet-700 transition"
              >
                Voir tout
                <ArrowRight size={14} aria-hidden="true" />
              </Link>
            )}
          </header>

          {budgets.length === 0 ? (
            <EmptyState
              icon={Target}
              title="Aucun budget trouvé."
              action={
                <Link
                  to="/budgets"
                  className="text-xs text-violet-600 font-medium hover:text-violet-700"
                >
                  En créer un
                </Link>
              }
            />
          ) : (
            <>
              <div className="mb-5">
                <div className="flex items-baseline justify-between mb-2">
                  <div>
                    <data
                      value={totalSpent}
                      className="block text-2xl font-bold tracking-tight text-slate-900"
                    >
                      {formatCurrency(totalSpent, currency)}
                    </data>
                    <p className="text-xs text-slate-500 mt-0.5">
                      de {formatCurrency(totalBudget, currency)} total
                    </p>
                  </div>
                  <div className="text-right">
                    <data
                      value={aggPct}
                      className="block text-sm font-bold"
                      style={{ color: aggColor }}
                    >
                      {aggPct.toFixed(0)}%
                    </data>
                    <span className="text-[10px] text-slate-500">utilisé</span>
                  </div>
                </div>
                {/* Barre de progression */}
                <ProgressBar
                  percent={aggPct}
                  aria-label={`Budget global : ${Math.round(aggPct)} % utilisé`}
                />
              </div>

              <ul
                className="space-y-3"
                aria-label="Détail des budgets par catégorie"
              >
                {enrichedBudgets.map((b) => (
                  <li key={b.id}>
                    <div className="flex justify-between items-center text-xs mb-1.5">
                      <span className="text-slate-700 font-medium truncate">
                        {b.category_name}
                      </span>
                      <span className="text-slate-500 shrink-0 ml-2 text-[11px]">
                        {formatCurrency(b.spent, currency)} /{" "}
                        {formatCurrency(b.total, currency)}
                      </span>
                    </div>
                    <ProgressBar
                      percent={b.pct}
                      aria-label={`Budget ${b.category_name} : ${Math.round(b.pct)} % utilisé`}
                    />
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default Home;
