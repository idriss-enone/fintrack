import { useEffect, useId, useRef } from "react";
import ReactDOM from "react-dom";
import { X } from "lucide-react";

const sizeClasses = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
};

const Modal = ({ open, onClose, title, children, size = "md" }) => {
  const dialogRef = useRef(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !open) return;

    const previouslyFocused = document.activeElement;
    dialog.showModal();
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
      if (document.body.contains(previouslyFocused)) {
        previouslyFocused.focus();
      }
    };
  }, [open]);

  // Échap : on laisse React fermer via l'état
  const handleCancel = (e) => {
    e.preventDefault();
    onClose();
  };

  // Clic sur le fond : la cible est le <dialog> lui-même
  const handleBackdropMouseDown = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!open) return null;

  return ReactDOM.createPortal(
    <dialog
      ref={dialogRef}
      onMouseDown={handleBackdropMouseDown}
      onCancel={handleCancel}
      aria-labelledby={titleId}
      className={`fixed top-1/2 left-1/2 m-0 flex max-h-[90vh] w-full
        -translate-x-1/2 -translate-y-1/2 flex-col rounded-2xl border
        border-slate-100 bg-white shadow-xl ${sizeClasses[size]}
        scale-100 opacity-100 transition-all duration-300 ease-out
        starting:scale-95 starting:opacity-0
        backdrop:bg-slate-900/40 backdrop:opacity-100
        backdrop:transition-all backdrop:duration-300 backdrop:starting:opacity-0`}
    >
      <header className="flex shrink-0 items-center justify-between border-b border-slate-100 p-5">
        <h2 id={titleId} className="font-semibold text-slate-900">
          {title}
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer la boîte de dialogue"
          className="cursor-pointer rounded-md p-1 text-slate-500 transition hover:bg-slate-100"
        >
          <X size={18} aria-hidden="true" />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto overscroll-contain p-5 text-sm text-slate-600">
        {children}
      </div>
    </dialog>,
    document.body,
  );
};

export default Modal;
