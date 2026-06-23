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

export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-gray-900 text-white flex flex-col p-4">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-white">💰 FinTrack</h1>
        <p className="text-xs text-gray-400 mt-1">Gestion financière personnelle</p>
      </div>
      <nav className="flex flex-col gap-1">
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white font-medium'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`
            }
          >
            <span>{link.icon}</span>
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}