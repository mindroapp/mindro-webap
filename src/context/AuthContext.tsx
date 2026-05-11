import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "@/components/ui/use-toast";
import authService, { LoginResponse } from "@/services/authService";

interface User {
  id: string;
  name: string;
  email: string;
  role?: "admin" | "professional";
  isVerified?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  isVerified: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, phone: string, profession: string, professionalRegister: string, professionalCouncil?: string) => Promise<void>;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
  getAccessToken: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Carregar usuário do localStorage ao iniciar
  useEffect(() => {
    const loadUserFromStorage = () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch (error) {
            setUser(null);
            localStorage.removeItem("user");
          }
        }
      } finally {
        setIsLoading(false);
      }
    };
    loadUserFromStorage();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response: LoginResponse = await authService.login(email, password);
      const { user: userData, accessToken, refreshToken } = response;
      const user: User = {
        id: userData.id,
        name: userData.fullName,
        email: userData.email,
        role: userData.role as "admin" | "professional",
        isVerified: userData.isVerified ?? false,
      };
      if (accessToken) localStorage.setItem("accessToken", accessToken);
      if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      toast({
        title: "Login realizado com sucesso",
        description: `Bem-vindo de volta, ${user.name}!`,
      });
    } catch (error: any) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, phone: string, profession: string, professionalRegister: string, professionalCouncil?: string) => {
    try {
      setIsLoading(true);
      const response = await authService.register({
        fullName: name,
        email,
        phone,
        password,
        confirmPassword: password,
        profession,
        professionalRegister,
        professionalCouncil,
      });
      const { user: userData, accessToken, refreshToken } = response;
      const user: User = {
        id: userData.id,
        name: userData.fullName,
        email: userData.email,
        role: userData.role as "admin" | "professional",
        isVerified: userData.isVerified ?? false,
      };
      if (accessToken) localStorage.setItem("accessToken", accessToken);
      if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      toast({
        title: "Registro realizado com sucesso",
        description: "Sua conta foi criada com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: "Falha no registro",
        description: error.message || "Por favor, tente novamente mais tarde.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    toast({
      title: "Logout realizado",
      description: "Você saiu da sua conta com sucesso.",
    });
  };

  const resetPassword = async (email: string) => {
    try {
      await authService.resetPassword(email);
      toast({
        title: "E-mail enviado",
        description: "Verifique seu e-mail para redefinir sua senha.",
      });
    } catch (error: any) {
      toast({
        title: "Falha ao enviar e-mail",
        description: error.message || "Por favor, tente novamente mais tarde.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const getAccessToken = (): string | null => {
    return localStorage.getItem("accessToken");
  };

  const isAdmin = user?.role === "admin";
  const isVerified = user?.isVerified ?? false;

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      isLoading, 
      isAdmin,
      isVerified,
      login, 
      register, 
      logout, 
      resetPassword,
      getAccessToken
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
