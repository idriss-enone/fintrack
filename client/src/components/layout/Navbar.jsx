export default function Navbar({ onMenuClick }) {
  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 flex-shrink-0">

      {/* Bouton hamburger — mobile uniquement */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
        aria-label="Ouvrir le menu"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Date — cachée sur mobile */}
      <p className="hidden md:block text-sm text-gray-500">
        {new Date().toLocaleDateString('fr-FR', { 
          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
        })}
      </p>

      {/* Profil */}
      <div className="flex items-center gap-2 md:gap-3 ml-auto">
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
          IE
        </div>
        <span className="hidden md:block text-sm font-medium text-gray-700">Idriss ENONE</span>
      </div>
    </header>
  )
}