import {
  Wallet,
  TrendingUp,
  Sparkles,
  Utensils,
  Plane,
  Calendar,
  Receipt,
  Briefcase,
  ShoppingCart,
  CreditCard,
} from "lucide-react";
import {
  formatCurrency,
  calcPercent,
  formatMonth,
  format
} from "@/utils/helpers";

const SPENT = 320;
const LIMIT = 400;
const PERCENT = calcPercent(SPENT, LIMIT);
const MONTH = formatMonth();

const SPENDING = [
  { name: "Alimentation", value: 310, color: "#7C3AED" },
  { name: "Transports", value: 140, color: "#2563EB" },
  { name: "Logement", value: 450, color: "#EA580C" },
];
const TRANSACTIONS = [
  {
    icon: Briefcase,
    color: "bg-emerald-50 text-emerald-600",
    name: "Salaire d'octobre",
    amount: 1250,
    positive: true,
  },
  {
    icon: ShoppingCart,
    color: "bg-amber-50 text-amber-600",
    name: "Courses du marché",
    amount: -45.5,
    positive: false,
  },
  {
    icon: CreditCard,
    color: "bg-slate-50 text-slate-600",
    name: "Abonnement musique",
    amount: -9.99,
    positive: false,
  },
];

const RADIUS = 14;
const CENTER = 18;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const TOTAL = SPENDING.reduce((sum, item) => sum + item.value, 0);

const SEGMENTS = SPENDING.reduce((acc, item) => {
  const start = acc.length ? acc[acc.length - 1].end : 0;
  const length = (item.value / TOTAL) * CIRCUMFERENCE; 
  return [...acc, { ...item, start, end: start + length, length }];
}, []);

const BalanceCard = () => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-violet-600 via-violet-700 to-violet-800 p-5 text-white shadow-xl shadow-violet-300/40">
      <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-white/10 blur-2xl" />

      <div className="relative mb-4 flex items-center justify-between">
        <div className="text-xs font-medium opacity-80">Solde total</div>
        <Wallet size={16} className="opacity-80" />
      </div>

      <div className="relative text-3xl font-bold tracking-tight">
        {formatCurrency(12547.3, "USD")}
      </div>

      <div className="relative mt-2 flex items-center gap-1.5 text-xs">
        <TrendingUp size={11} />
        <span className="font-semibold">+8,2&nbsp;%</span>
        <span className="opacity-70">ce mois-ci</span>
      </div>
    </div>
  );
};

const AIInsightCard = () => {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-lg shadow-violet-100 border border-slate-100">
      <div className="flex items-start gap-2.5">
        <div className="h-9 w-9 rounded-xl bg-linear-to-br from-violet-400 to-violet-600 flex items-center justify-center shrink-0">
          <Sparkles size={16} className="text-white" />
        </div>
        <div className="min-w-0">
          <div className="text-[10px] uppercase tracking-wider font-bold text-violet-600 mb-0.5">
            Conseil IA
          </div>
          <div className="text-xs font-semibold text-slate-900 mb-0.5">
            Alerte budget café
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            Deux cafés de moins par semaine, et vous économisez{" "}
            {formatCurrency(32, "USD", { decimals: 0 })} par mois.
          </p>
        </div>
      </div>
    </div>
  );
};

const BudgetProgressCard = () => {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-md border border-slate-100">
      <div className="flex items-center gap-2 mb-3">
        <div className="h-8 w-8 rounded-lg bg-amber-50 flex items-center justify-center">
          <Utensils size={14} className="text-amber-600" />
        </div>
        <div>
          <div className="text-xs font-semibold text-slate-900">
            Alimentation
          </div>
          <div className="text-[10px] text-slate-500">{MONTH}</div>
        </div>
      </div>
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="text-base font-bold text-slate-900">
          {formatCurrency(SPENT, "USD", { decimals: 0 })}
        </span>
        <span className="text-[10px] text-slate-500">
          sur {formatCurrency(LIMIT, "USD", { decimals: 0 })}
        </span>
      </div>
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-amber-500 rounded-full"
          style={{ width: `${PERCENT}%` }}
        />
      </div>
      <div className="text-[10px] text-amber-600 font-medium mt-1.5">
        {PERCENT}&nbsp;% utilisé
      </div>
    </div>
  );
};

const SubscriptionsCard = () => {
  return (
    <div className="bg-white rounded-2xl p-4 show-md border border-slate-100">
      <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-3">
        Subscriptions
      </div>
      <div className="space-y-2.5">
        {[
          {
            name: "Netflix",
            cost: "$15.99",
            initial: "N",
            color: "bg-rose-500",
          },
          {
            name: "Spotify",
            cost: "$10.99",
            initial: "S",
            color: "bg-emerald-500",
          },
          {
            name: "iCloud+",
            cost: "$2.99",
            initial: "i",
            color: "bg-blue-500",
          },
        ].map((s) => (
          <div key={s.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className={`h-7 w-7 rounded-lg ${s.color} flex items-center justify-center text-white text-[11px] font-bold`}
              >
                {s.initial}
              </div>
              <span className="text-[11px] font-medium text-slate-900">
                {s.name}
              </span>
            </div>
            <span className="text-[11px] font-semibold text-slate-700">
              {s.cost}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const IncomeExpenseCard = () => {
  return (
    <div className="bg-white rounded-2xl p-4 show-md border border-slate-100">
      <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-2">
        Income vs Expense
      </div>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <div className="text-[10px] text-slate-500">Income</div>
          <div className="text-base font-bold text-violet-600">$6.3k</div>
        </div>
        <div>
          <div className="text-[10px] text-slate-500">Expense</div>
          <div className="text-base font-bold text-orange-600">$2.4k</div>
        </div>
      </div>
      <div className="flex items-end gap-1 h-10">
        {[55, 70, 45, 80, 65, 75].map((h, i) => (
          <div key={i} className="flex-1 flex flex-col gap-0.5 justify-end">
            <div
              className="bg-violet-400 rounded-sm"
              style={{ height: `${h}%`, minHeight: "4px" }}
            />
            <div
              className="bg-orange-400 rounded-sm"
              style={{ height: `${h * 0.45}%`, minHeight: "2px" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const MonthlySummaryCard = () => {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-lg shadow-violet-100 border border-slate-100">
      <div className="flex items-center justify-between mb-3">
        <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
          May 2026
        </div>
        <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full font-bold">
          Healthy
        </span>
      </div>
      <div className="text-2xl font-bold trancking-tight text-slate-900 mb-1">
        $3,936
      </div>
      <div className="text-[10px]  text-slate-500 ">Net this month</div>
      <div className="mt-3 h-1.5 bg-slate-500 rounded-full overflow-hidden">
        <div
          className="h-full bg-linear-to-r from-violet-500 to-violet-700 rounded-full"
          style={{ width: "62%" }}
        />
      </div>
      <div className="text-[10px] text-slate-500 mt-1.5">62% savings rate</div>
    </div>
  );
};

const RecentTransactionsCard = () => (
  <div className="bg-white rounded-2xl p-4 shadow-md border border-slate-100">
    <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-3">
      Transactions Récentes
    </div>
    <div className="space-y-2.5">
      {TRANSACTIONS.map((t, i) => {
        const Icon = t.icon;
        return (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <div
                className={`h-7 w-7 rounded-lg ${t.color} flex items-center justify-center shrink-0`}
              >
                <Icon size={12} />
              </div>
              <span className="text-[11px] font-medium text-slate-900 truncate">
                {t.name}
              </span>
            </div>
            <span
              className={`text-[11px] font-semibold ${t.positive ? "text-emerald-600" : "text-slate-700"}`}
            >
              {formatCurrency(t.amount, "USD", { showSign: true })}
            </span>
          </div>
        );
      })}
    </div>
  </div>
);

const CategoryDonutCard = () => (
  <div className="bg-white rounded-2xl p-4 shadow-md border border-slate-100">
    <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-3">
      Top Catégories
    </div>
    <div className="flex items-center gap-3">
      <div className="relative h-24 w-24 shrink-0">
        <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
          <circle
            cx={CENTER}
            cy={CENTER}
            r={RADIUS}
            fill="none"
            stroke="#E2E8F0"
            strokeWidth="5"
          />
          {SEGMENTS.map((s) => (
            <circle
              key={s.name}
              cx={CENTER}
              cy={CENTER}
              r={RADIUS}
              fill="none"
              stroke={s.color}
              strokeWidth="5"
              // s.length - 2 permet de créer un petit espace de 2 unités entre les segments arrondis
              strokeDasharray={`${Math.max(s.length - 2, 0)} ${CIRCUMFERENCE}`}
              strokeDashoffset={-s.start}
              strokeLinecap="round"
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xs font-bold text-slate-900 leading-tight">
            {TOTAL} $
          </span>
          <span className="text-[8px] text-slate-400">Total</span>
        </div>
      </div>
      <div className="space-y-2 flex-1 min-w-0">
        {SPENDING.map((c) => (
          <div
            key={c.name}
            className="flex items-center justify-between text-[10px]"
          >
            <div className="flex items-center gap-1.5 min-w-0">
              <div
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: c.color }}
              />
              <span className="text-slate-600 font-medium truncate">
                {c.name}
              </span>
            </div>
            <span className="text-slate-900 font-semibold ml-2">
              {format(c.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const SavingsGoalCard = () => (
  <div className="bg-linear-to-br from-emerald-50 via-white to-blue-50 rounded-2xl p-4 shadow-md border border-slate-100">
    <div className="flex items-center gap-2 mb-3">
      <div className="h-8 w-8 rounded-lg bg-linear-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
        <Plane size={14} className="text-white" />
      </div>
      <div>
        <div className="text-xs font-semibold text-slate-900">
          Vacation Fund
        </div>
        <div className="text-[10px] text-slate-500">Goal: $5,000</div>
      </div>
    </div>
    <div className="flex items-baseline justify-between mb-1.5">
      <span className="text-lg font-bold tracking-tight text-slate-900">
        $3,240
      </span>
      <span className="text-[10px] text-emerald-600 font-bold">65%</span>
    </div>
    <div className="h-1.5 bg-white rounded-full overflow-hidden">
      <div
        className="h-full bg-linear-to-r from-emerald-400 to-blue-500 rounded-full"
        style={{ width: "65%" }}
      />
    </div>
  </div>
);

const UpcomingBillCard = () => (
  <div className="bg-white rounded-2xl p-4 shadow-md border border-slate-100">
    <div className="flex items-center gap-3">
      <div className="h-10 w-10 rounded-xl bg-rose-50 flex items-center justify-center shrink-0">
        <Calendar size={16} className="text-rose-600" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[10px] uppercase tracking-wider text-rose-600 font-bold">
          Due in 2 days
        </div>
        <div className="text-xs font-semibold text-slate-900">Rent payment</div>
      </div>
      <div className="text-sm font-bold text-slate-900">$1,800</div>
    </div>
  </div>
);

const PortfolioCard = () => (
  <div className="bg-slate-900 rounded-2xl p-4 text-white shadow-xl">
    <div className="flex items-center justify-between mb-3">
      <div className="text-[10px] uppercase tracking-wider opacity-60 font-bold">
        Investments
      </div>
      <Receipt size={12} className="opacity-60" />
    </div>
    <div className="text-2xl font-bold tracking-tight mb-1">$8,420.55</div>
    <div className="flex items-center gap-1.5 text-[11px]">
      <span className="text-emerald-400 font-semibold">+$182.30</span>
      <span className="opacity-50">today</span>
    </div>
    <div className="mt-3 h-10">
      <svg
        viewBox="0 0 100 30"
        className="w-full h-full"
        preserveAspectRatio="none"
      >
        <path
          d="M0,20 L15,18 L30,22 L45,15 L60,12 L75,8 L100,5"
          stroke="#34D399"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M0,20 L15,18 L30,22 L45,15 L60,12 L75,8 L100,5 L100,30 L0,30 Z"
          fill="url(#sparkGradient)"
        />
        <defs>
          <linearGradient id="sparkGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#34D399" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#34D399" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  </div>
);

const column1 = [
  <BalanceCard key="balance" />,
  <AIInsightCard key="ai" />,
  <BudgetProgressCard key="budget" />,
  <SubscriptionsCard key="subs" />,
  <IncomeExpenseCard key="incexp" />,
];

const column2 = [
  <MonthlySummaryCard key="monthly" />,
  <RecentTransactionsCard key="recent" />,
  <CategoryDonutCard key="cats" />,
  <SavingsGoalCard key="savings" />,
  <UpcomingBillCard key="bill" />,
  <PortfolioCard key="portfolio" />,
];

const AuthHero = ({ headline, subheadline }) => {
  return (
    <div className="relative h-full w-full overflow-hidden bg-linear-to-br from-violet-100 via-violet-50 to-white">
      <div className="absolute -top-32 -left-24 w-96 h-96 bg-violet-300/40 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute top-1/2 -right-24 w-80 h-80 bg-pink-200/30 rounded-full blur-3xl pointer-events-none z-0" />

      {/**Full-height tilted card columns */}
      <div className="absolute inset-0 overflow-hidden z-10">
        <div
          className="absolute -inset-40 flex gap-4"
          style={{ transform: "rotate(-7deg)" }}
        >
          <div className="flex-1 min-w-0">
            <div className="animate-scroll-up">
              {[...column1, ...column1, ...column2]
                .sort(() => Math.random() - 0.5)
                .map((card, i) => (
                  <div key={i} className="pb-4">
                    {card}
                  </div>
                ))}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="animate-scroll-down">
              {[...column2, ...column2, ...column2].map((card, i) => (
                <div key={i} className="pb-4">
                  {card}
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div style={{ animation: "scrollUp 45s linear infinite" }}>
              {[...column1, ...column1, ...column2]
                .sort(() => Math.random() - 0.5)
                .map((card, i) => (
                  <div key={i} className="pb-4">
                    {card}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/**Top fade - gives the headline a clean backdrop */}
      <div className="absolute top-0 left-0 right-0 h-64 bg-linear-to-b from-violet-100 via-violet-50/90 to-transparent pointer-events-none z-20" />
      {/**Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-linear-to-t from-white via-white/70 to-transparent pointer-events-none z-20" />
      {/**Headline floats on top */}
      <div className="absolute top-10 left-10 xl:top-14 xl:left-14 z-30 max-w-70">
        <h1 className="text-5xl xl:text-6xl font-normal tracking-tight text-slate-900 mb-2">
          {headline}
        </h1>
        <p className="text-base text-slate-600">{subheadline}</p>
      </div>
    </div>
  );
};

export default AuthHero;
