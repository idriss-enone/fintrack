import { useCallback, useEffect, useMemo, useState } from "react";
//import toast from "react-hot-toast";
import { AuthContext } from "./AuthContext";
import { AUTH_STATUS } from "@/constants/auth.constants";
import { loginRequest, registerRequest, getMeRequest } from "../api/authApi";
import {
  getAccessToken,
  saveAccessToken,
  clearAccessToken,
} from "@/lib/storage";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState(AUTH_STATUS.CHECKING);
  const [sessionKey, setSessionKey] = useState(0);

  useEffect(() => {
    const checkSession = async () => {
      const token = getAccessToken();
      if (!token) {
        setStatus(AUTH_STATUS.UNAUTHENTICATED);
        return;
      }
      try {
        const data = await getMeRequest();
        setUser(data);
        setStatus(AUTH_STATUS.AUTHENTICATED);
      } catch (error) {
        if (error.response?.status === 401) {
          // Token refusé : on le supprime
          clearAccessToken();
          setUser(null);
          setStatus(AUTH_STATUS.UNAUTHENTICATED);
        } else {
          setStatus(AUTH_STATUS.UNREACHABLE);
        }
      }
    };
    checkSession();
  }, [sessionKey]);

  const retry = useCallback(() => {
    setStatus(AUTH_STATUS.CHECKING);
    setSessionKey((k) => k + 1);
  }, []);

  // Déconnexion déclenchée par l'intercepteur axios (token expiré)
  useEffect(() => {
    const handleLogout = () => {
      setUser(null);
      setStatus(AUTH_STATUS.UNAUTHENTICATED);
    };
    window.addEventListener("auth:logout", handleLogout);
    return () => window.removeEventListener("auth:logout", handleLogout);
  }, []);

  const login = useCallback(async (email, password, remember) => {
    const { user: loggedUser, token } = await loginRequest(email, password);
    saveAccessToken(token, remember);
    setUser(loggedUser);
    setStatus(AUTH_STATUS.AUTHENTICATED);
    //toast.success(`Bienvenue ${loggedUser.name}`);
  }, []);

  const register = useCallback(async (data) => {
    const { user: newUser, token } = await registerRequest(data);
    saveAccessToken(token, true);
    setUser(newUser);
    setStatus(AUTH_STATUS.AUTHENTICATED);
  }, []);

  const logout = useCallback(() => {
    clearAccessToken();
    setUser(null);
    setStatus(AUTH_STATUS.UNAUTHENTICATED);
  }, []);

  const value = useMemo(
    () => ({
      user,
      status,
      isAuthenticated: status === AUTH_STATUS.AUTHENTICATED,
      isChecking: status === AUTH_STATUS.CHECKING,
      isUnreachable: status === AUTH_STATUS.UNREACHABLE,
      login,
      register,
      logout,
      retry,
    }),
    [user, status, login, register, logout, retry],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
