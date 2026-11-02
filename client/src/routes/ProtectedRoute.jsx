import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import FullPageStatus from "@/components/FullPageStatus";
import ServerUnreachable from "@/components/ServerUnreachable";

const ProtectedRoute = () => {
  const { isAuthenticated, isChecking, isUnreachable,retry } = useAuth();
  const location = useLocation();

  if (isChecking) return <FullPageStatus />;
  if (isUnreachable) return <ServerUnreachable retry={retry}/>;
  if (!isAuthenticated)
    return <Navigate to="/login" replace state={{ from: location }} />;

  return <Outlet />;
};

export default ProtectedRoute;
