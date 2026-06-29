import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard ,
  ArrowLeftRight,
  Tag,
  Target,
  RefreshCw,
  Trophy,
  FileBarChart2,
  X,
} from 'lucide-react';

const links = [
  { to: '/dashboard',    label: 'Tableau de bord',  icon: LayoutDashboard },
  { to: '/transactions', label: 'Transactions',      icon: ArrowLeftRight },
  { to: '/categories',   label: 'Catégories',        icon: Tag },
  { to: '/budgets',      label: 'Budgets',            icon: Target },
  { to: '/recurrents',   label: 'Récurrents',         icon: RefreshCw },
  { to: '/goals',        label: 'Objectifs',          icon: Trophy },
  { to: '/rapport',      label: 'Rapport mensuel',    icon: FileBarChart2 },
]

export default function Sidebar({ open, onClose }) {
  return (
    <aside 
      aria-hidden={!open ? "true" : "false"}
      className={`
      fixed top-0 left-0 z-30 min-h-screen w-64 bg-gray-900 text-white
      flex flex-col p-4 transition-transform duration-300
      ${open ? 'translate-x-0' : '-translate-x-full'}
       lg:static lg:translate-x-0 lg:z-auto
       ${!open ? 'pointer-events-none lg:pointer-events-auto' : ''}
    `}>
      {/* Logo + bouton fermer sur mobile */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-lg font-bold">💰 FinTrack</h1>
          <p className="hidden lg:block text-xs text-gray-400 mt-0.5">
              Gestion financière
          </p>
        </div>
        <button
          onClick={onClose}
          tabIndex={!open ? -1 : 0} 
          className="
          lg:hidden text-gray-400 hover:text-white text-xl p-1
          rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500
          "
          aria-label="Fermer le menu"
        >
          <X size={20} aria-hidden="true" />
        </button>
      </div>
    

      {/* Navigation */}
      <nav aria-label="Navigation principale" >
        <ul className="flex flex-col gap-1">
          {links.map(({ to,label,icon: Icon}) => (
            <li key={to}>
              <NavLink
                to={to}
                onClick={onClose}
                tabIndex={!open ? -1 : 0}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white font-medium'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`
                }
              >
                <Icon size={18} aria-hidden="true" />
                <span>{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}