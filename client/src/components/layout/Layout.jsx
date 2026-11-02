import { useEffect, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();
  const menuButtonRef = useRef(null);
  const mainRef = useRef(null);
  const contentRef = useRef(null);
  const wasOpen = useRef(false);

  const openSidebar = () => setSidebarOpen(true);
  const closeSidebar = () => setSidebarOpen(false);

  // Menu ouvert : le reste de la page devient inerte (ni clic, ni Tab, ni lecteur d'écran),
  // comme derrière une fenêtre modale. À la fermeture, le focus revient sur le bouton du menu.
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.inert = sidebarOpen;
    }
    if (wasOpen.current && !sidebarOpen) {
      menuButtonRef.current?.focus();
    }
    wasOpen.current = sidebarOpen;
  }, [sidebarOpen]);

  // Échap ferme le menu
  useEffect(() => {
    if (!sidebarOpen) return;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setSidebarOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [sidebarOpen]);

  // Passage en grand écran avec le menu ouvert : on le ferme (sinon le contenu resterait inerte)
  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const handleChange = (event) => {
      if (event.matches) setSidebarOpen(false);
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Navigation : c'est <main> qui défile (pas la fenêtre), donc le navigateur ne le remet pas
  // en haut tout seul. On le fait à chaque changement de page.
  useEffect(() => {
    if (mainRef.current) mainRef.current.scrollTop = 0;
  }, [pathname]);

  return (
    <div className="h-dvh flex bg-slate-50 overflow-hidden">
      {/* Lien d'évitement : visible seulement au clavier */}
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:font-medium focus:text-slate-900 focus:shadow-lg"
      >
        Aller au contenu principal
      </a>

      {/* Fond sombre (mobile) : décoratif, Échap ferme déjà le menu au clavier */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Fermer le menu"
          onClick={closeSidebar}
          className="fixed inset-0 z-20 bg-slate-900/40 lg:hidden cursor-default"
        />
      )}

      <Sidebar open={sidebarOpen} onClose={closeSidebar} />

      <div ref={contentRef} className="flex min-w-0 flex-1 flex-col">
        <Navbar
          isMenuOpen={sidebarOpen}
          onMenuClick={openSidebar}
          menuButtonRef={menuButtonRef}
        />
        <main
          ref={mainRef}
          id="contenu"
          tabIndex={-1}
          className="flex-1 overflow-y-auto p-4 md:p-6"
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
