import { useRef,useEffect } from "react";
import { X } from 'lucide-react'
/**
 * Dialog de confirmation accessible
 * Utilise role="dialog" et aria-modal pour les lecteurs d'écran
 */
export default function ConfirmDialog({ message, onConfirm, onCancel,tbodyRef }) {
  const dialogRef    = useRef(null);
  const cancelBtnRef = useRef(null);

  // ── Bloquer le scroll du body ─────────────────────────────
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden'
    return () => {
     document.body.style.overflow = previousOverflow
    } 
  }, []);

  // ── Focus automatique à l'ouverture ──────────────────────
  useEffect(() => {
    const previouslyFocusedElement = document.activeElement;
    cancelBtnRef.current?.focus();

    // 3. Fonction de nettoyage (au démontage)
    return () => {
      
      if (document.body.contains(previouslyFocusedElement)) {
        previouslyFocusedElement.focus();
      }else {
        tbodyRef.current?.focus();
      }
    };
  }, [tbodyRef]);

  // ── Fermeture via Escape ──────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape'){
        onCancel();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  // ── Focus trap ────────────────────────────────────────────

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return

    // Récupère tous les éléments focusables dans le dialog
    const getFocusableElements = () => [
      ...dialog.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ),
    ].filter(el => !el.disabled);

    const handleTab = (e) => {
      if (e.key !== 'Tab') return;
      const focusable = getFocusableElements();
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      
      if(e.shiftKey){
        // Si l'utilisateur fait SHIFT + TAB (navigation en arrière)
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus(); // On boucle vers le dernier élément
        }
      }else{
        if (document.activeElement === last) {
          e.preventDefault()
          first.focus()
      }
      }
      
      
    }
    dialog.addEventListener('keydown', handleTab);
    return () => dialog.removeEventListener('keydown', handleTab)
  },[]);


  return (
    <>
    {/* Overlay — clic ferme le dialog */}
    <div
        className="fixed inset-0 z-50 bg-black/40"
        aria-hidden="true"
        onClick={onCancel}
    />

    {/* Dialog */}
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-desc"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
    >
      <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full space-y-4 pointer-events-auto">

        {/* En-tête avec titre + bouton fermer */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <h2 id="confirm-dialog-title" className="text-base font-semibold text-gray-800">
            Confirmer la suppression
          </h2>
          <button
            onClick={onCancel}
            aria-label="Fermer"
            className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-md p-0.5 flex-shrink-0"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>
        {/* Message */}
        
        
        <p 
          id="confirm-dialog-desc" 
          className="text-sm text-gray-500"
        >
            {message}
        </p>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <button
            ref={cancelBtnRef}
            onClick={onCancel}
            className="
            px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors
            focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2
            "
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="
            px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors 
            font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
    </>
  )
}