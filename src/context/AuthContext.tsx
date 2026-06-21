import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "@/components/ui/use-toast";
import authService, { LoginResponse } from "@/services/authService";
import { apiFetch } from "@/services/apiClient";

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role?: "admin" | "professional";
  isVerified?: boolean;
  professionalCouncil?: string | null;
  professionalRegister?: string | null;
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

function mapUser(userData: LoginResponse["user"]): User {
  return {
    id: userData.id,
    name: userData.fullName,
    email: userData.email,
    phone: userData.phone ?? null,
    role: userData.role as "admin" | "professional",
    isVerified: userData.isVerified ?? false,
    professionalCouncil: userData.professionalCouncil ?? null,
    professionalRegister: userData.professionalRegister ?? null,
  };
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Escutar evento de sessão expirada (disparado pelo apiClient quando refresh falha)
  useEffect(() => {
    const handleSessionExpired = () => setUser(null);
    window.addEventListener('auth:session-expired', handleSessionExpired);
    return () => window.removeEventListener('auth:session-expired', handleSessionExpired);
  }, []);

  // Verificar sessão ativa via cookie httpOnly ao iniciar
  useEffect(() => {
    const initSession = async () => {
      try {
        const res = await apiFetch('/users/profile/me', { method: 'GET' });
        if (res.ok) {
          const userData = await res.json();
          setUser({
            id: userData.id,
            name: userData.fullName,
            email: userData.email,
            phone: userData.phone ?? null,
            role: userData.role?.toLowerCase() as "admin" | "professional",
            isVerified: userData.approvalStatus === 'APPROVED',
            professionalCouncil: userData.professionalCouncil ?? null,
            professionalRegister: userData.professionalRegister ?? null,
          });
        }
      } catch {
        // Sem sessão ativa — usuário não logado
      } finally {
        setIsLoading(false);
      }
    };
    initSession();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await authService.login(email, password);
      const mappedUser = mapUser(response.user);
      setUser(mappedUser);
      toast({
        title: "Login realizado com sucesso",
        description: `Bem-vindo de volta, ${mappedUser.name}!`,
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

      if (response.user.isVerified) {
        setUser(mapUser(response.user));
        toast({
          title: "Registro realizado com sucesso",
          description: "Bem-vindo à plataforma!",
        });
      } else {
        toast({
          title: "Registro realizado com sucesso",
          description: "Sua conta foi criada e está aguardando aprovação do administrador.",
        });
      }
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
    authService.logout().catch(() => {});
    setUser(null);
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

  // Tokens agora são gerenciados via httpOnly cookie — não expostos ao JavaScript
  const getAccessToken = (): string | null => null;

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
