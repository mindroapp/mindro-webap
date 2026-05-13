
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, MessageCircle, Mail, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const ThankYouPage: React.FC = () => {
  const [firstName, setFirstName] = useState("Futuro Parceiro");
  const location = useLocation();
  const { user, isVerified } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.firstName) {
      setFirstName(location.state.firstName);
    }
  }, [location.state]);

  // Se o usuário está verificado, redirecionar para o dashboard
  useEffect(() => {
    if (user && isVerified) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, isVerified, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-50 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/">
            <span className="text-3xl font-bold text-gray-900">
              mind<span className="text-indigo-600">ro</span>
            </span>
          </Link>
        </div>

        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-gray-800">
              Obrigado, {firstName}! 🎉
            </CardTitle>
          </CardHeader>
          
          <CardContent className="text-center space-y-6">
            <div className="space-y-4">
              {user && user.role === "professional" && !isVerified ? (
                <>
                  {/* Mensagem para profissional aguardando aprovação */}
                  <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div className="text-left">
                        <h3 className="font-semibold text-amber-800 mb-2">
                          Sua conta está em análise
                        </h3>
                        <p className="text-sm text-amber-700">
                          Seu cadastro foi recebido com sucesso! Nossa equipe de suporte entrará em contato para verificar suas informações profissionais.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-indigo-800 mb-2">Você receberá contato via:</h3>
                    <div className="flex justify-center space-x-6">
                      <div className="flex items-center text-indigo-700">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        <span className="text-sm">WhatsApp</span>
                      </div>
                      <div className="flex items-center text-indigo-700">
                        <Mail className="w-4 h-4 mr-2" />
                        <span className="text-sm">E-mail</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <p className="text-sm text-gray-600">
                      Enquanto aguarda aprovação, você pode acessar mais informações no site sobre nossas especialidades e serviços.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  {/* Mensagem padrão */}
                  <p className="text-gray-600">
                    Seu cadastro foi recebido com sucesso! Nossa equipe de suporte entrará em contato em breve para finalizar sua conta e começarmos nossa parceria de sucesso.
                  </p>
                  
                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-indigo-800 mb-2">Nossa equipe entrará em contato via:</h3>
                    <div className="flex justify-center space-x-6">
                      <div className="flex items-center text-indigo-700">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        <span className="text-sm">WhatsApp</span>
                      </div>
                      <div className="flex items-center text-indigo-700">
                        <Mail className="w-4 h-4 mr-2" />
                        <span className="text-sm">E-mail</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <p className="text-sm text-gray-500 italic">
                      Esta será uma parceria de sucesso, {firstName}! 
                      Juntos, vamos transformar sua prática profissional.
                    </p>
                  </div>
                </>
              )}
            </div>

            <div className="space-y-3">
              <Link to="/" className="block">
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                  Voltar ao Site
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ThankYouPage;
