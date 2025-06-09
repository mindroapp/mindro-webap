import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "@/components/ui/use-toast";
import authService, { LoginResponse } from "@/services/authService";
import axios from "axios";
import { config } from "@/config/env";

interface User {
  id: string;
  name: string;
  email: string;
  role?: "admin" | "professional"; // Adicionando o campo role
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean; // Nova propriedade para verificar se é admin
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
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

  // Configurar interceptor para incluir token nas requisições
  useEffect(() => {
    const logoutOn401 = () => {
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      toast({
        title: "Sessão expirada",
        description: "Faça login novamente.",
        variant: "destructive",
      });
    };
    const requestInterceptor = axios.interceptors.request.use((config) => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Interceptor de resposta para lidar com erros de token expirado
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        // Se o erro é 401 (Não autorizado) e não é uma retry
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          try {
            const refreshToken = localStorage.getItem("refreshToken");
            if (!refreshToken) {
              throw new Error("Refresh token não encontrado");
            }
            
            // Tentar renovar o token
            const response = await authService.refreshToken(refreshToken);
            const { accessToken, refreshToken: newRefreshToken } = response as any;
            
            if (accessToken) localStorage.setItem("accessToken", accessToken);
            if (newRefreshToken) localStorage.setItem("refreshToken", newRefreshToken);
            
            // Configurar o novo token na requisição original
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            
            // Tentar a requisição novamente
            return axios(originalRequest);
          } catch (err) {
            logoutOn401();
            return Promise.reject(error);
          }
        }
        
        return Promise.reject(error);
      }
    );

    // Limpar interceptors quando o componente for desmontado
    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  // Verificar se há token salvo ao iniciar
  useEffect(() => {
    const loadUserFromStorage = () => {
      try {
        // No more accessToken/refreshToken in localStorage
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch (error) {
            console.error("Falha ao analisar os dados do usuário:", error);
            // Use window.location.reload() to force logout if needed
            setUser(null);
            localStorage.removeItem("user");
          }
        }
      } finally {
        setIsLoading(false);
      }
    };
    loadUserFromStorage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response: LoginResponse = await authService.login(email, password);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { user: userData, accessToken, refreshToken } = response as { user: any; accessToken?: string; refreshToken?: string };
      // Ajusta para shape do User esperado
      const user: User = {
        id: userData.id,
        name: userData.fullName,
        email: userData.email,
        role: userData.role,
      };
      if (accessToken) localStorage.setItem("accessToken", accessToken);
      if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      toast({
        title: "Login realizado com sucesso",
        description: `Bem-vindo de volta, ${user.name}!`,
      });
    } catch (error) {
      console.error("Erro no login:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await authService.register(name, email, password);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { user: userData, accessToken, refreshToken } = response as { user: any; accessToken?: string; refreshToken?: string };
      const user: User = {
        id: userData.id,
        name: userData.fullName,
        email: userData.email,
        role: userData.role,
      };
      if (accessToken) localStorage.setItem("accessToken", accessToken);
      if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      toast({
        title: "Registro realizado com sucesso",
        description: "Sua conta foi criada com sucesso.",
      });
    } catch (error) {
      console.error("Erro no registro:", error);
      toast({
        title: "Falha no registro",
        description: "Por favor, tente novamente mais tarde.",
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
    } catch (error) {
      console.error("Erro ao redefinir senha:", error);
      toast({
        title: "Falha ao enviar e-mail",
        description: "Por favor, tente novamente mais tarde.",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Método para obter o token de acesso atual
  // Now always returns null, as tokens are managed by cookies
  const getAccessToken = (): string | null => {
    return null;
  };

  // Verificar se o usuário atual é um administrador
  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      isLoading, 
      isAdmin,
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
