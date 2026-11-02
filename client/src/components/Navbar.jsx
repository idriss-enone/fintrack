import { Menu, Search, Bell } from "lucide-react";
import useAuth from "@/hooks/useAuth";
import { getGreeting, getTodayDate, getFullDate } from "@/utils/helpers";

export default function Navbar({ isMenuOpen, onMenuClick, menuButtonRef }) {
  const { user } = useAuth();
  const firstName = user?.name?.split(" ")[0] || "";

 
  return (
    <header className=" h-16 bg-white border-b border-slate-100 flex items-center justify-between  shrink-0 px-4 md:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          ref={menuButtonRef}
          onClick={onMenuClick}
          aria-label="Menu principal"
          aria-expanded={isMenuOpen}
          aria-controls="sidebar"
          className="-ml-2 flex size-11 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 lg:hidden"
        >
          <Menu size={20} aria-hidden="true" />
        </button>

        <div>
          <div className="text-sm font-semibold tracking-tight text-slate-900">
            {getGreeting()}
            {firstName && `, ${firstName}`}
          </div>
          <time
            dateTime={getTodayDate()}
            className="hidden text-xs text-slate-500 capitalize md:block"
          >
            {getFullDate()}
          </time>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <button
          type="button"
          title="Rechercher"
          aria-label="Rechercher"
          className="flex h-9 w-9  items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
        >
          <Search size={17} aria-hidden="true" />
        </button>
        <button
          type="button"
          title="Notifications"
          aria-label="Notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
        >
          <Bell size={17} aria-hidden="true" />
          <span
            aria-hidden="true"
            className="absolute right-2.5 top-2.5 size-2 rounded-full bg-rose-500 ring-2 ring-white"
          />
        </button>
      </div>
    </header>
  );
}
