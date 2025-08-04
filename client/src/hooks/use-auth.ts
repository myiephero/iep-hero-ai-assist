import { useState, useEffect, createContext, useContext } from "react";
import { authApi, type AuthUser } from "@/lib/auth";

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string, role: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function useAuthState() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const result = await authApi.getCurrentUser();
      setUser(result?.user || null);
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const result = await authApi.login({ email, password });
      setUser(result.user);
      return result;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (email: string, username: string, password: string, role: string, planStatus?: string) => {
    const result = await authApi.register({ email, username, password, role, planStatus });
    setUser(result.user);
    return result;
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
  };

  return {
    user,
    login,
    register,
    logout,
    isLoading,
  };
}

export { AuthContext };
