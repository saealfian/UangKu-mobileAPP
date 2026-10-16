import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { getToken, clearToken } from "@/api/client";
import { authService } from "@/api/auth";

export type User = {
  id: number;
  nama: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  ready: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    nama: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const t = await getToken();
      setTokenState(t);
      if (t) {
        try {
          const data = await authService.me();
          setUser(data.user);
        } catch {
          // Token tidak valid / kadaluarsa, hapus
          await clearToken();
          setTokenState(null);
        }
      }
      setReady(true);
    })();
  }, []);

  const login = async (email: string, password: string) => {
    const data = await authService.login({ email, password });
    setTokenState(data.token);
    setUser(data.user);
  };

  const register = async (
    nama: string,
    email: string,
    password: string
  ) => {
    const data = await authService.register({ nama, email, password });
    setTokenState(data.token);
    setUser(data.user);
  };

  const logout = async () => {
    await authService.logout();
    setTokenState(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, ready, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth harus digunakan di dalam AuthProvider");
  }
  return ctx;
}
