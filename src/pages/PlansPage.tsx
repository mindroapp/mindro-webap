
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, X } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import MarketingLayout from "@/components/layouts/MarketingLayout";

const PlansPage: React.FC = () => {
  const [billingAnnually, setBillingAnnually] = useState(true);
  const navigate = useNavigate();

  const plans = [
    {
      name: "Essencial",
      description: "Para profissionais iniciantes",
      priceMonthly: 79,
      priceAnnually: 67.15, // 15% desconto
      features: [
        "20 agendamentos por mês",
        "Lembretes automáticos",
        "Até 30 pacientes ativos",
        "5 teleconsultas/mês",
        "Chat seguro até 5 pacientes",
        "Recibos simples",
        "Criptografia padrão",
        "Suporte por email",
      ],
      limitations: [],
      buttonText: "Escolher Plano",
      buttonVariant: "outline",
      popular: false,
      color: "green",
    },
    {
      name: "Profissional",
      description: "Para profissionais estabelecidos",
      priceMonthly: 149,
      priceAnnually: 126.65, // 15% desconto
      features: [
        "Agendamento ilimitado",
        "Lembretes automáticos",
        "Prontuário eletrônico ilimitado",
        "20 teleconsultas/mês em HD",
        "Chat seguro até 30 pacientes",
        "Controle de pacotes e recibos personalizados",
        "Segurança avançada com backups",
        "Suporte por email + chat",
        "7 dias grátis",
      ],
      limitations: [],
      buttonText: "Escolher Plano",
      buttonVariant: "default",
      popular: true,
      color: "yellow",
    },
    {
      name: "Premium",
      description: "Para clínicas e profissionais avançados",
      priceMonthly: 229,
      priceAnnually: 194.65, // 15% desconto
      features: [
        "Agendamento ilimitado + personalização",
        "Prontuário ilimitado + backups",
        "Teleconsulta ilimitada com prioridade",
        "Chat ilimitado com notificações em tempo real",
        "Relatórios avançados + integrações",
        "Criptografia + LGPD + HIPAA",
        "Suporte prioritário (email, chat, onboarding)",
        "Acesso a novidades beta",
        "7 dias grátis",
      ],
      limitations: [],
      buttonText: "Escolher Plano",
      buttonVariant: "default",
      popular: false,
      color: "blue",
    }
  ];

  const handlePlanSelection = () => {
    navigate("/register");
  };

  const getCardStyle = (color: string, popular: boolean) => {
    const baseStyle = "flex flex-col transition-all duration-200 hover:shadow-lg";
    
    if (popular) {
      return `${baseStyle} border-yellow-400 shadow-lg relative scale-105`;
    }
    
    switch (color) {
      case "green":
        return `${baseStyle} border-green-200 hover:border-green-400`;
      case "yellow":
        return `${baseStyle} border-yellow-200 hover:border-yellow-400`;
      case "blue":
        return `${baseStyle} border-blue-200 hover:border-blue-400`;
      default:
        return baseStyle;
    }
  };

  const getIconColor = (color: string) => {
    switch (color) {
      case "green":
        return "text-green-600";
      case "yellow":
        return "text-yellow-600";
      case "blue":
        return "text-blue-600";
      default:
        return "text-green-600";
    }
  };

  const getPriceColor = (color: string) => {
    switch (color) {
      case "green":
        return "text-green-700";
      case "yellow":
        return "text-yellow-700";
      case "blue":
        return "text-blue-700";
      default:
        return "text-green-700";
    }
  };

  return (
    <MarketingLayout>
      <div className="container mx-auto py-12 px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-indigo-700">🧠 Planos da Plataforma para Profissionais de Saúde Mental</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Escolha o plano ideal para sua prática. Com a nossa plataforma, você cuida dos seus pacientes — nós cuidamos do resto.
          </p>

          <div className="flex items-center justify-center mt-8 space-x-3">
            <Label htmlFor="billing-toggle" className={billingAnnually ? "text-gray-500" : "font-medium"}>
              Pagamento Mensal
            </Label>
            <Switch
              id="billing-toggle"
              checked={billingAnnually}
              onCheckedChange={setBillingAnnually}
            />
            <div className="flex flex-col items-start">
              <Label htmlFor="billing-toggle" className={billingAnnually ? "font-medium" : "text-gray-500"}>
                Pagamento Anual
              </Label>
              <span className="text-xs text-green-600">💸 Economia de 15%</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={getCardStyle(plan.color, plan.popular)}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-yellow-500 text-white px-3 py-1 rounded-bl-lg rounded-tr-lg text-sm font-medium">
                  🏆 Popular
                </div>
              )}
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full ${
                    plan.color === 'green' ? 'bg-green-500' : 
                    plan.color === 'yellow' ? 'bg-yellow-500' : 'bg-blue-500'
                  }`}></div>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                </div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="mb-6">
                  <p className={`text-4xl font-bold ${getPriceColor(plan.color)}`}>
                    R$ {billingAnnually ? plan.priceAnnually.toFixed(2) : plan.priceMonthly}
                    <span className="text-base font-normal text-gray-500">/mês</span>
                  </p>
                  {billingAnnually && (
                    <p className="text-sm text-gray-500">
                      Faturado anualmente como R$ {(plan.priceAnnually * 12).toFixed(2)}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start">
                      <CheckCircle className={`h-5 w-5 ${getIconColor(plan.color)} mr-2 flex-shrink-0 mt-0.5`} />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handlePlanSelection}
                  className={`w-full ${
                    plan.buttonVariant === "default" 
                      ? plan.color === 'green' 
                        ? "bg-green-600 hover:bg-green-700" 
                        : plan.color === 'yellow'
                        ? "bg-yellow-600 hover:bg-yellow-700"
                        : "bg-blue-600 hover:bg-blue-700"
                      : ""
                  }`}
                  variant={plan.buttonVariant as "default" | "outline"}
                >
                  {plan.buttonText}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-16 bg-indigo-50 p-8 rounded-xl">
          <h2 className="text-2xl font-bold mb-6 text-center text-indigo-700">🎁 Bônus e Condições</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-2xl mb-2">✅</div>
              <h3 className="font-medium text-indigo-700 mb-2">7 dias grátis</h3>
              <p className="text-gray-600 text-sm">No plano Profissional e Premium</p>
            </div>
            
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-2xl mb-2">💸</div>
              <h3 className="font-medium text-indigo-700 mb-2">15% de desconto</h3>
              <p className="text-gray-600 text-sm">No pagamento anual</p>
            </div>
            
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-2xl mb-2">🔁</div>
              <h3 className="font-medium text-indigo-700 mb-2">Flexibilidade total</h3>
              <p className="text-gray-600 text-sm">Mude de plano quando quiser</p>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Comece agora com 7 dias grátis e descubra como podemos transformar sua prática profissional.
            </p>
            <Button 
              onClick={handlePlanSelection}
              size="lg" 
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Começar Agora Grátis
            </Button>
          </div>
        </div>
      </div>
    </MarketingLayout>
  );
};

export default PlansPage;
