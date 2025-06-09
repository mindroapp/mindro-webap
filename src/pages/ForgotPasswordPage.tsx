import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError("Por favor, preencha o campo de e-mail.");
      return;
    }

    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      await resetPassword(email);
      setSuccess("Um e-mail com instruções de recuperação foi enviado.");
    } catch (err) {
      setError("Falha ao enviar o e-mail de recuperação. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              mind<span className="text-indigo-600">ro</span>
            </span>
          </Link>
        </div>

        <Card className="shadow-md">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl md:text-2xl text-center">Recuperar Senha</CardTitle>
            <CardDescription className="text-center">
              Insira seu e-mail para receber instruções de recuperação
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              {error && (
                <div className="p-3 mb-4 text-sm text-red-500 bg-red-50 rounded-md">
                  {error}
                </div>
              )}
              {success && (
                <div className="p-3 mb-4 text-sm text-green-500 bg-green-50 rounded-md">
                  {success}
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="nome@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
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
                      <span>Enviando...</span>
                    </div>
                  ) : (
                    "Enviar Instruções"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <div className="w-full text-center">
              <p className="text-sm text-gray-600">
                Lembrou sua senha?{" "}
                <Link
                  to="/login"
                  className="text-psycho-primary hover:underline font-medium"
                >
                  Entrar
                </Link>
              </p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;