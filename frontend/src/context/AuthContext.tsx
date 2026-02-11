import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { loginUser, logoutUser, getCurrentUser } from "../services/api";

interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      getCurrentUser(token)
        .then((u) => setUser(u))
        .catch(() => {
          localStorage.removeItem("token");
          setToken(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const res = await loginUser(username, password);
      localStorage.setItem("token", res.access_token);
      setToken(res.access_token);
      setUser(res.user);
      setError(null);
    } catch (err: any) {
      const msg = err.response?.data?.detail || "Login failed";
      setError(msg);
      throw err;
    }
  };

  const logout = () => {
    if (token) {
      logoutUser(token).catch(() => {});
    }
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider value={{ user, token, loading, error, login, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
