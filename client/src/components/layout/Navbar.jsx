import { Menu } from 'lucide-react';
import { getTodayDate,getFullDate } from '../../utils/helpers';

export default function Navbar({isMenuOpen, onMenuClick }) {
  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 flex-shrink-0">

      {/* Bouton hamburger — mobile uniquement */}
      <button
        onClick={onMenuClick}
        aria-expanded={isMenuOpen}
        className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
        aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
      >
        <Menu size={20} aria-hidden="true" />
      </button>

      {/* Date — cachée sur mobile */}
      <time 
        dateTime= {getTodayDate()}
        className="hidden md:block text-sm text-gray-500 capitalize"
      >
        {getFullDate()}
      </time>
      

      {/* Profil */}
      <div className="flex items-center gap-2 md:gap-3 ml-auto">
        <div 
          className="
            w-8 h-8 rounded-full bg-blue-600 flex items-center 
            justify-center text-white text-sm font-bold flex-shrink-0"
          aria-label="Initiales de l'utilisateur : IE"
        >
          IE
        </div>
        <span className="hidden md:block text-sm font-medium text-gray-700">Idriss ENONE</span>
      </div>
    </header>
  )
}