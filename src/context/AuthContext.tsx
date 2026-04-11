import { createContext, useState, type ReactNode } from "react";
import type { User, LoginPayload, RegisterPayload } from "@/types/auth.type";
import * as authService from "@/services/authServices";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (payload: LoginPayload) => {
    setIsLoading(true);
    try {
      const response = await authService.login(payload);
      localStorage.setItem("token", response.token); // simpan token
      localStorage.setItem("customer_token", response.token); // simpan token utk customer 
      localStorage.setItem("customer_name", response.user.name); // simpan name utk customer
      setUser(response.user); // simpan data user
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: RegisterPayload) => {
    setIsLoading(true);
    try {
      const response = await authService.register(payload);
      localStorage.setItem("customer_token", response.token); // simpan token utk customer
      localStorage.setItem("customer_name", response.user.name); // simpan name utk customer
      setUser(response.user);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
    } finally {
      localStorage.removeItem("token"); // hapus token
      localStorage.removeItem("customer_token");
      localStorage.removeItem("customer_name");
      setUser(null); // reset user
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
