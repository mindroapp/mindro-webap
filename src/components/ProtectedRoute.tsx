import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false 
}) => {
  const { isAuthenticated, isLoading, user, getAccessToken, isAdmin, isVerified } = useAuth();
  const location = useLocation();

  const { toast } = useToast();
  
  // Verificar se o token existe e é válido
  useEffect(() => {
    const token = getAccessToken();
    if (!token || isLoading) return;
    try {
      const parts = token.split('.');
      if (parts.length !== 3 || !parts[1]) return;
      const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(atob(base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=')));
      const exp = payload.exp * 1000;
      if (Date.now() >= exp) {
        toast({
          title: "Erro",
          description: "Sua sessão expirou. Faça login novamente.",
          variant: "destructive"
        });
        window.location.href = "/login";
      }
    } catch (error) {
      console.error("Erro ao validar token:", error);
    }
  }, [isLoading, toast, getAccessToken]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-psycho-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirecionar para a página de login com a URL de retorno
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Verificar se usuário profissional não está verificado/aprovado
  if (user?.role === "professional" && !isVerified) {
    toast({
      title: "Acesso negado",
      description: "Sua conta ainda está aguardando aprovação do administrador.",
      variant: "destructive"
    });
    return <Navigate to="/thank-you" replace />;
  }

  // Verificar se a rota requer permissão de administrador
  if (requireAdmin && !isAdmin) {
    // Redirecionar para o dashboard padrão se não for administrador
    return <Navigate to="/dashboard" replace />;
  }

  // Verificar se a rota é admin e o usuário está tentando acessar
  if (location.pathname.startsWith('/admin') && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
