
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface PublicRouteProps {
  children: React.ReactNode;
  redirectAuthenticated?: boolean; // Se true, redireciona usuários autenticados para /dashboard
}

const PublicRoute: React.FC<PublicRouteProps> = ({ 
  children, 
  redirectAuthenticated = true 
}) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-psycho-primary"></div>
      </div>
    );
  }

  if (redirectAuthenticated && isAuthenticated) {
    // Redirecionar para o dashboard se já estiver autenticado
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;
