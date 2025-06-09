
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import MarketingLayout from "@/components/layouts/MarketingLayout";

const PlansPage: React.FC = () => {
  const [billingAnnually, setBillingAnnually] = useState(true);

  const plans = [
    {
      name: "Básico",
      description: "Para profissionais autônomos iniciando na carreira",
      priceMonthly: 69.90,
      priceAnnually: 49.90,
      features: [
        "Agendamento de até 30 consultas/mês",
        "Prontuário eletrônico básico",
        "1 usuário",
        "Suporte por email",
        "Teleconsulta com limite de 5h/mês",
        "Recibos simples",
      ],
      limitations: [
        "Sem integrações",
        "Sem personalização",
        "Sem backup avançado",
        "Sem relatórios avançados",
      ],
      buttonText: "Começar Grátis",
      buttonVariant: "outline",
      popular: false,
    },
    {
      name: "Profissional",
      description: "Para profissionais estabelecidos com prática individual",
      priceMonthly: 129.90,
      priceAnnually: 99.90,
      features: [
        "Agendamento ilimitado",
        "Prontuário eletrônico completo",
        "1 usuário",
        "Suporte prioritário",
        "Teleconsulta ilimitada",
        "Recibos e faturas personalizados",
        "Integração com WhatsApp",
        "Lembretes automáticos",
        "Relatórios básicos",
        "Personalização da agenda",
      ],
      limitations: [],
      buttonText: "Escolher Plano",
      buttonVariant: "default",
      popular: true,
    },
    {
      name: "Enterprise",
      description: "Para clínicas e grupos de profissionais",
      priceMonthly: 299.90,
      priceAnnually: 249.90,
      features: [
        "Todas as funcionalidades do plano Profissional",
        "Até 10 usuários",
        "Gestão de equipe",
        "Agenda compartilhada",
        "Dashboard administrativo",
        "Relatórios avançados",
        "Exportação de dados",
        "API para integrações personalizadas",
        "Armazenamento ilimitado",
        "Suporte 24/7",
        "Gerenciamento financeiro avançado"
      ],
      limitations: [],
      buttonText: "Fale com Vendas",
      buttonVariant: "default",
      popular: false,
    }
  ];

  return (
    <MarketingLayout>
      <div className="container mx-auto py-12 px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-indigo-700">Planos e Preços</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Escolha o plano ideal para sua prática em saúde mental.
            Todos os planos incluem acesso à nossa plataforma completa.
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
              <span className="text-xs text-green-600">Economia de até 30%</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`flex flex-col ${
                plan.popular ? "border-indigo-400 shadow-lg relative" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-indigo-700 text-white px-3 py-1 rounded-bl-lg rounded-tr-lg text-sm font-medium">
                  Popular
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="mb-6">
                  <p className="text-4xl font-bold text-indigo-700">
                    R${billingAnnually ? plan.priceAnnually : plan.priceMonthly}
                    <span className="text-base font-normal text-gray-500">/mês</span>
                  </p>
                  {billingAnnually && (
                    <p className="text-sm text-gray-500">
                      Faturado anualmente como R${(plan.priceAnnually * 12).toFixed(2)}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}

                  {plan.limitations.map((limitation, limitationIndex) => (
                    <div key={limitationIndex} className="flex items-start text-gray-400">
                      <CheckCircle className="h-5 w-5 text-gray-300 mr-2 flex-shrink-0 mt-0.5" />
                      <span>{limitation}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className={`w-full ${
                    plan.buttonVariant === "default" ? "bg-indigo-700 hover:bg-indigo-800" : ""
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
          <h2 className="text-2xl font-bold mb-6 text-center text-indigo-700">Perguntas Frequentes sobre Planos</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            <div>
              <h3 className="text-lg font-medium mb-2 text-indigo-700">Posso mudar de plano depois?</h3>
              <p className="text-gray-600">
                Sim, você pode fazer upgrade ou downgrade do seu plano a qualquer momento. 
                As mudanças serão refletidas no próximo ciclo de faturamento.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2 text-indigo-700">Existe período mínimo de contratação?</h3>
              <p className="text-gray-600">
                Não existe período mínimo para os planos mensais. Para planos anuais, 
                o compromisso é de 12 meses, com possibilidade de cancelamento mediante uma taxa.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2 text-indigo-700">Preciso fornecer cartão de crédito para testar?</h3>
              <p className="text-gray-600">
                Não, você pode experimentar nosso plano básico gratuitamente por 14 dias 
                sem fornecer informações de pagamento.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2 text-indigo-700">Como funciona o suporte técnico?</h3>
              <p className="text-gray-600">
                Todos os planos incluem suporte técnico. A diferença está no tempo de resposta e nos 
                canais disponíveis (email, chat, telefone), que variam de acordo com o plano escolhido.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2 text-indigo-700">Posso adicionar usuários extras?</h3>
              <p className="text-gray-600">
                Sim, nos planos Enterprise você pode adicionar usuários extras por um valor adicional 
                por usuário/mês. Entre em contato com nossa equipe de vendas para mais detalhes.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2 text-indigo-700">Os preços incluem impostos?</h3>
              <p className="text-gray-600">
                Todos os preços apresentados já incluem impostos para pessoas físicas. 
                Para empresas, os valores podem variar de acordo com o regime tributário.
              </p>
            </div>
          </div>
          
          <div className="mt-10 text-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="link" 
                    className="text-indigo-700"
                  >
                    Precisa de um plano personalizado? <HelpCircle className="h-4 w-4 ml-1" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="w-80 text-sm">
                    Para necessidades específicas, oferecemos planos personalizados. 
                    Entre em contato com nossa equipe de vendas para discutir suas necessidades.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </MarketingLayout>
  );
};

export default PlansPage;
