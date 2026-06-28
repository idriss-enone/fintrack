import { useMemo } from 'react';
import {
  BarChart,Bar,XAxis,YAxis,Tooltip, PieChart, Pie, ResponsiveContainer, Cell, Legend} from "recharts";
import AlertBox from '../components/ui/AlertBox';
import StatCard  from '../components/ui/StatCard'
import { useApp } from '../context/AppContext';
import { 
  formatAmount,formatAmountCompact,getCurrentMonth 
} from '../utils/helpers';
import { TRANSACTION_TYPES } from '../utils/constants';


 const COLORS = ["#3B82F6","#10B981","#F59E0B","#EF4444","#8B5CF6","#EC4899","#14B8A6","#F97316"];


export default function Dashboard() {
  const { transactions, budgets, getCat } = useApp();
  
  const currentMonth = getCurrentMonth();

  // ── Métriques globales ──────────────────────────────────────
  const totalRev = useMemo(
    () => transactions.filter(t => t.type === TRANSACTION_TYPES.REVENU)
      .reduce((s, t) => s + t.amount, 0),[transactions]
  );

  
  const totalDep = useMemo(
    () => transactions.filter(t => t.type === TRANSACTION_TYPES.DEPENSE)
      .reduce((s, t) => s + t.amount, 0), [transactions]
  );


  const solde =   totalRev - totalDep

  const depMois = useMemo(() => 
    transactions.filter(t => t.type === TRANSACTION_TYPES.DEPENSE && t.date.startsWith(currentMonth))
    .reduce((s, t) => s + t.amount, 0),[transactions,currentMonth]
  );

  // --- Données graphique barres-------------------------------------------------------------------

  const barData = useMemo(() => {
    const months = {};
    transactions.forEach(t => {
      const m = t.date.slice(0,7);
      if(!months[m]) months[m] = { mois: m, Revenus: 0, Depenses: 0};
      if(t.type === "revenu") months[m].Revenus += t.amount;
      else months[m].Depenses = + t.amount;
  
    });
    return Object.values(months).sort((a,b) => a.mois.localeCompare(b.mois))
  },[transactions])


  const pieData = useMemo(() =>{
    const totals = {}
    transactions.filter(t => t.type === TRANSACTION_TYPES.DEPENSE)
    .forEach(t => {totals[t.catId] = (totals[t.catId] || 0) + t.amount})
    return Object.entries(totals).map(([catId,value]) =>({
      name: getCat(parseInt(catId)).name,
      value : Math.round(value)
    })) 
  },[transactions,getCat]) 

   // --- Alertes budgets -------------------------------------------------------------------
   const alerts = useMemo(() => {
    return budgets.map(b => {
      const spent = transactions
      .filter( t => t.type === TRANSACTION_TYPES.DEPENSE && t.catId === b.catId && t.date.startsWith(currentMonth))
      .reduce((s,t) => s + t.amount,0)

      const pct = Math.round ( spent / b.limit * 100);
      const cat = getCat(b.catId);
      if(pct >= 100) return {type:'danger', message: `${cat.emoji} ${cat.name}: budget dépassé! (${formatAmount(spent)} / ${formatAmount(b.limit)})`}
      if(pct >= 80) return {type:'warn', message: `${cat.emoji} ${cat.name}: ${pct}% du budget utilisé (${formatAmount(spent)} / ${formatAmount(b.limit)})`}
      return null;
    }).filter(Boolean)
   },[budgets,transactions,currentMonth,getCat])

  return (
    
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-gray-800">Tableau de bord</h1>

      {/**Alertes */}
      {alerts.length > 0 && (
        <div className='space-y-2'>
          {alerts.map((a,i) => <AlertBox key={i} type={a.type} message={a.message} />)}
        </div>
      )}
      
      {/* Métriques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total revenus" value={formatAmount(totalRev)} color="text-green-600" icon="💰" />
        <StatCard label="Total dépenses" value={formatAmount(totalDep)} color="text-red-500"   icon="💸" />
        <StatCard label="Solde net" value={formatAmount(solde)} color={solde >= 0 ? 'text-green-600' : 'text-red-500'} icon="📈" />
        <StatCard label="Dépenses ce mois" value={formatAmount(depMois)}  color="text-amber-600" icon="📅" />
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Barres */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gray-600 mb-4">Revenus vs Dépenses</h2>

          <ResponsiveContainer width="100%" height={300}> {/*220*/}
            <BarChart data={barData} barGap={4}>
              <XAxis dataKey="mois" tick={{ fontSize:12 }}/>
              <YAxis tickFormatter={formatAmountCompact} tick={{ fontSize:11 }}/>
              <Tooltip formatter={(v) => formatAmount(v)}/> 
              <Bar dataKey="Revenus" fill="#10B981" radius={[4,4,0,0]}/>
              <Bar dataKey="Depenses" fill="#EF4444" radius={[4,4,0,0]}/>
              
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Donut */}

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h2 className="text-sm font-semibold text-gray-600 mb-4">Dépenses par catégorie</h2>

        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="40%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={3}
            >
              {
                pieData.map((_,i) =>(
                  <Cell key={i} fill={COLORS[i % COLORS.length]}/>
                ))
              }
              
              
            </Pie>
            <Legend
            iconType="circle"
            iconSize={8}
            formatter={(v) => <span style={{fontSize:11}}>{v}</span>}
            />
            <Tooltip formatter={(v) => formatAmount(v)}/>
          </PieChart>
        </ResponsiveContainer>
      </div>

      </div>
            

        {/* Dernières transactions */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">

          <h2 className="text-sm font-semibold text-gray-600 mb-4">Dernières transactions</h2>

          <div className="space-y-2">
            {
              transactions.slice(0, 6).map(t => {
                const cat = getCat(t.catId);
                return (
                  <div key={t.id} className='flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors'>
                    <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-lg flex-shrink-0">
                      {cat.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{t.desc}</p>
                      <p className="text-xs text-gray-400 truncate">{cat.name} . {t.date}</p>
                    </div>
                    <span className={`text-sm font-semibold flex-shrink-0 ${t.type === 'revenu' ? 'text-green-600': 'text-red-500'}`}>
                      {t.type === 'revenu' ? '+' : '-'}{formatAmount(t.amount)}
                    </span>
                  </div>
                )
                
              })
            }

              

          
          </div>
        </div>
    </div>
  )
}
