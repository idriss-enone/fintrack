import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import FullPageStatus from "@/components/FullPageStatus";
import ServerUnreachable from "@/components/ServerUnreachable";

const PublicOnlyRoute = () => {
  const { isAuthenticated, isChecking, isUnreachable, retry } = useAuth();
  const location = useLocation();

  if (isChecking) return <FullPageStatus />;

  // Token présent mais serveur injoignable : on laisse ProtectedRoute afficher l'écran « Réessayer »
  if (isUnreachable) return <ServerUnreachable retry={retry} />;

  if (isAuthenticated) {
    const from = location.state?.from;
    return <Navigate to={from ? from.pathname + from.search : "/"} replace />;
  }

  return <Outlet />;
};

export default PublicOnlyRoute;
