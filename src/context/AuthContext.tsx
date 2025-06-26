
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "@/components/ui/use-toast";
import authService, { LoginResponse } from "@/services/authService";
import { User, AuthContextType } from "@/types/auth";
import { useAxiosInterceptors } from "@/hooks/useAxiosInterceptors";
import { useAuthActions } from "@/hooks/useAuthActions";
import { useUserStorage } from "@/hooks/useUserStorage";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Use custom hooks
  useAxiosInterceptors(setUser, toast);
  const { loadUserFromStorage } = useUserStorage();
  const { loginUser, registerUser, logoutUser, resetUserPassword } = useAuthActions(setUser, setIsLoading, toast);

  // Load user from storage on mount
  useEffect(() => {
    loadUserFromStorage(setUser, setIsLoading);
  }, [loadUserFromStorage]);

  // Method to get access token (now always returns null as tokens are managed by cookies)
  const getAccessToken = (): string | null => {
    return null;
  };

  // Check if current user is admin
  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      isLoading, 
      isAdmin,
      login: loginUser, 
      register: registerUser, 
      logout: logoutUser, 
      resetPassword: resetUserPassword,
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
