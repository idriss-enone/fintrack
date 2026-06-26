import { NavLink } from 'react-router-dom'

const links = [
  { to: '/dashboard',    label: 'Tableau de bord',  icon: '📊' },
  { to: '/transactions', label: 'Transactions',      icon: '💸' },
  { to: '/categories',   label: 'Catégories',        icon: '🏷️' },
  { to: '/budgets',      label: 'Budgets',            icon: '🎯' },
  { to: '/recurrents',   label: 'Récurrents',         icon: '🔁' },
  { to: '/goals',        label: 'Objectifs',          icon: '🏆' },
  { to: '/rapport',      label: 'Rapport mensuel',    icon: '📅' },
]

export default function Sidebar({ open, onClose }) {
  return (
    <aside className={`
      fixed top-0 left-0 z-30 min-h-screen w-64 bg-gray-900 text-white
      flex flex-col p-4 transition-transform duration-300
      ${open ? 'translate-x-0' : '-translate-x-full'}
       lg:static lg:translate-x-0 lg:z-auto
    `}>
      {/* Logo + bouton fermer sur mobile */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-lg font-bold">💰 FinTrack</h1>
          <p className="hidden md:block text-xs text-gray-400 mt-0.5">Gestion financière personnelle</p>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden text-gray-400 hover:text-white text-xl p-1"
          aria-label="Fermer le menu"
        >
          ✕
        </button>
      </div>
    

      {/* Navigation */}
      <nav className="flex flex-col gap-1">
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white font-medium'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`
            }
          >
            <span className="text-base">{link.icon}</span>
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}