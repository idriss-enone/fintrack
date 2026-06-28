/**
 * Dialog de confirmation accessible
 * Utilise role="dialog" et aria-modal pour les lecteurs d'écran
 */
export default function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
    >
      <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full space-y-4">
        <h2 id="confirm-title" className="text-base font-semibold text-gray-800">
          Confirmer la suppression
        </h2>
        <p className="text-sm text-gray-500">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            autoFocus
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  )
}