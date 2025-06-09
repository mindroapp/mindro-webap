
import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Determina para onde redirecionar após o login com base no papel do usuário
  const handleSuccessfulLogin = () => {
    const from = location.state?.from?.pathname;
    
    // Se há um caminho anterior específico, usar ele
    if (from) {
      navigate(from, { replace: true });
      return;
    }
    
    // Caso contrário, redirecionar com base no papel
    if (isAdmin) {
      navigate("/admin/dashboard", { replace: true });
    } else {
      navigate("/dashboard", { replace: true });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError("Por favor, preencha email e senha");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      await login(email, password);
      handleSuccessfulLogin();
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || "Email ou senha inválidos";
      setError(errorMessage);
      
      // Adicionar mensagem de toast para erro
      toast({
        title: "Erro ao fazer login",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-6 md:mb-8">
          <Link to="/">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              mind<span className="text-indigo-600">ro</span>
            </span>
          </Link>
        </div>
        
        <Card className="shadow-md">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl md:text-2xl text-center">Entrar</CardTitle>
            <CardDescription className="text-center">
              Digite suas credenciais para acessar sua conta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              {error && (
                <div className="p-3 mb-4 text-sm text-red-500 bg-red-50 rounded-md">
                  {error}
                </div>
              )}
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="nome@exemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Senha</Label>
                    <Link
                      to="/forgot-password"
                      className="text-sm text-psycho-primary hover:underline"
                    >
                      Esqueceu a senha?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full"
                  />
                </div>
                
                <Button
                  type="submit"
                  className="w-full bg-psycho-primary hover:bg-psycho-primary/90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      <span>Entrando...</span>
                    </div>
                  ) : (
                    "Entrar"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <div className="w-full text-center">
              <p className="text-sm text-gray-600">
                Não tem uma conta?{" "}
                <Link
                  to="/register"
                  className="text-psycho-primary hover:underline font-medium"
                >
                  Cadastre-se
                </Link>
              </p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
