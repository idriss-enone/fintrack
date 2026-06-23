export default function Navbar() {
  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <p className="text-sm text-gray-500">
        {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
      </p>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
          IE
        </div>
        <span className="text-sm font-medium text-gray-700">Idriss ENONE</span>
      </div>
    </header>
  )
}