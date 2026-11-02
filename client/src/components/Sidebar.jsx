import { useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Tag,
  Target,
  RefreshCw,
  Trophy,
  FileBarChart2,
  X,
  Wallet,
  LogOut,
} from "lucide-react";
import useAuth from "@/hooks/useAuth";

const navItems = [
  { to: "/", label: "Tableau de bord", icon: LayoutDashboard },
  { to: "/transactions", label: "Transactions", icon: ArrowLeftRight },
  { to: "/categories", label: "Catégories", icon: Tag },
  { to: "/budgets", label: "Budgets", icon: Target },
  { to: "/recurrents", label: "Récurrents", icon: RefreshCw },
  { to: "/goals", label: "Objectifs", icon: Trophy },
  { to: "/reports", label: "Rapport mensuel", icon: FileBarChart2 },
];

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth();
  const closeButtonRef = useRef(null);
  const logoutButtonRef = useRef(null);
  const name = user?.name?.trim();
  const initial = name?.[0]?.toUpperCase() ?? "?";

  // Menu ouvert (mobile) : le focus entre dans le menu
  useEffect(() => {
    if (open) {
      //Gestion du focus à l'ouverture (attend la fin de l'animation Tailwind)
      const timer = setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [open]);

  // 2. Piège à focus (Focus Trap) uniquement sur Mobile/Tablette
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event) => {
      // On n'active le piège que si on est sur un écran inférieur à 'lg' (1024px)
      if (window.innerWidth >= 1024) return;

      if (event.key === "Tab") {
        const firstElement = closeButtonRef.current;
        const lastElement = logoutButtonRef.current;

        if (event.shiftKey) {
          // Shift + Tab : si on recule au-delà du premier élément, on va au dernier
          if (document.activeElement === firstElement) {
            lastElement?.focus();
            event.preventDefault();
          }
        } else {
          // Tab seul : si on avance au-delà du dernier élément, on retourne au premier
          if (document.activeElement === lastElement) {
            firstElement?.focus();
            event.preventDefault();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    // Fermé sur mobile : "invisible" retire le menu de l'ordre de tabulation ET des lecteurs d'écran,
    // sans toucher au grand écran où le menu est toujours visible.
    <div
      id="sidebar"
      className={`fixed left-0 top-0 z-30 flex h-dvh w-64 flex-col overflow-y-auto border-r border-slate-100 bg-white
        transition-[transform,visibility] duration-300
        lg:sticky lg:z-auto lg:shrink-0 lg:translate-x-0
        ${open ? "translate-x-0 max-lg:shadow-xl" : "-translate-x-full max-lg:invisible"}`}
    >
      {/* Logo + bouton fermer (mobile) */}
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-100 px-6">
        <div className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-lg bg-linear-to-br from-violet-500 to-violet-700">
            <Wallet size={16} className="text-white" aria-hidden="true" />
          </div>
          <span className="font-bold text-slate-900">FinTrack</span>
        </div>
        <button
          type="button"
          ref={closeButtonRef}
          onClick={onClose}
          aria-label="Fermer le menu"
          className="-mr-3 flex size-11 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 lg:hidden"
        >
          <X size={20} aria-hidden="true" />
        </button>
      </div>

      {/* Navigation (NavLink ajoute aria-current="page" sur le lien actif) */}
      <nav aria-label="Navigation principale" className="flex-1 px-3 pb-3 pt-6">
        <ul className="flex flex-col gap-1.5">
          {navItems.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                onClick={onClose}
                className={({ isActive }) =>
                  `relative flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-slate-100 text-slate-900 before:absolute before:bottom-2.5 before:left-0 before:top-2.5 before:w-1 before:rounded-full before:bg-violet-500"
                      : "text-slate-700 hover:bg-slate-50"
                  }`
                }
              >
                <Icon size={20} strokeWidth={1.75} aria-hidden="true" />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Utilisateur connecté et déconnexion */}
      <div className="shrink-0 border-t border-slate-100 p-3">
        <div className="flex items-center gap-3 rounded-2xl p-2.5">
          <div
            aria-hidden="true"
            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-violet-500 to-violet-700 text-sm font-semibold text-white"
          >
            {initial}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold text-slate-900">
              {name || "Utilisateur"}
            </div>
            <div title={user?.email} className="truncate text-xs text-slate-500">{user?.email}</div>
          </div>
          <button
            type="button"
            ref={logoutButtonRef}
            onClick={logout}
            title="Se déconnecter"
            className="flex size-10 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-rose-50 hover:text-rose-700"
          >
            <LogOut size={16} aria-hidden="true" />
            <span className="sr-only">Se déconnecter</span>
          </button>
        </div>
      </div>
    </div>
  );
}
