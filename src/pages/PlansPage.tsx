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
import { CheckCircle, Sparkles } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import MarketingLayout from "@/components/layouts/MarketingLayout";

const MONTHLY_PRICE = 49.9;
const ANNUAL_INSTALLMENT = 45.75;
const ANNUAL_TOTAL = 549.0;
const MONTHLY_YEAR_TOTAL = MONTHLY_PRICE * 12;
const SAVINGS = MONTHLY_YEAR_TOTAL - ANNUAL_TOTAL;

const features = [
  "Dashboard analítico",
  "Agendamentos ilimitados com link personalizado",
  "Lembretes automáticos via WhatsApp Mindro",
  "Prontuário eletrônico",
  "Controle de pacotes e recibos",
];

const PlansPage: React.FC = () => {
  const [billingAnnually, setBillingAnnually] = useState(true);
  const navigate = useNavigate();

  const handlePlanSelection = () => {
    navigate("/register");
  };

  return (
    <MarketingLayout>
      <div className="container mx-auto py-10 sm:py-16 px-4 max-w-3xl">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4 text-foreground">
            Plano Mindro
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Tudo o que você precisa para gerenciar seu consultório em um só lugar.
            Escolha entre mensal ou anual.
          </p>

          <div className="flex items-center justify-center mt-6 sm:mt-8 space-x-3">
            <Label
              htmlFor="billing-toggle"
              className={!billingAnnually ? "font-medium" : "text-muted-foreground"}
            >
              Mensal
            </Label>
            <Switch
              id="billing-toggle"
              checked={billingAnnually}
              onCheckedChange={setBillingAnnually}
            />
            <div className="flex items-center gap-2">
              <Label
                htmlFor="billing-toggle"
                className={billingAnnually ? "font-medium" : "text-muted-foreground"}
              >
                Anual
              </Label>
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                1 mês grátis
              </Badge>
            </div>
          </div>
        </div>

        <Card className="relative border-primary/30 shadow-xl overflow-hidden">
          {billingAnnually && (
            <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-4 py-1.5 rounded-bl-lg text-xs sm:text-sm font-semibold flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5" />
              MAIS POPULAR
            </div>
          )}

          <CardHeader className="pt-8">
            <CardTitle className="text-2xl">
              {billingAnnually ? "Plano Anual Profissional" : "Plano Essencial"}
            </CardTitle>
            <CardDescription>
              {billingAnnually
                ? "Pague 11 meses e use por 12"
                : "Sem fidelidade. Cancele quando quiser."}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="mb-6">
              {billingAnnually ? (
                <>
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <p className="text-4xl sm:text-5xl font-bold text-primary">
                      12x R$ {ANNUAL_INSTALLMENT.toFixed(2).replace(".", ",")}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    ou R$ {ANNUAL_TOTAL.toFixed(2).replace(".", ",")} à vista
                  </p>
                  <div className="mt-3 space-y-1 text-sm">
                    <p className="text-foreground">
                      🔥 Ganhe <strong>1 mês grátis</strong>
                    </p>
                    <p className="text-muted-foreground">
                      Economize R$ {SAVINGS.toFixed(2).replace(".", ",")} por ano
                      em relação ao mensal
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-baseline gap-1">
                    <p className="text-4xl sm:text-5xl font-bold text-foreground">
                      R$ {MONTHLY_PRICE.toFixed(2).replace(".", ",")}
                    </p>
                    <span className="text-base text-muted-foreground">/mês</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Cobrança mensal recorrente
                  </p>
                </>
              )}
            </div>

            <div className="space-y-3">
              {features.map((feature, i) => (
                <div key={i} className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-foreground text-sm sm:text-base">{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>

          <CardFooter className="flex-col gap-3">
            <Button
              onClick={handlePlanSelection}
              size="lg"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {billingAnnually ? "Assinar anual" : "Começar agora"}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Acesso completo à plataforma · Suporte incluso
            </p>
          </CardFooter>
        </Card>

        {billingAnnually && (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-2xl font-bold text-primary">R$ 549</p>
              <p className="text-xs text-muted-foreground mt-1">Total no anual</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-2xl font-bold text-muted-foreground line-through">
                R$ {MONTHLY_YEAR_TOTAL.toFixed(2).replace(".", ",")}
              </p>
              <p className="text-xs text-muted-foreground mt-1">12x no mensal</p>
            </div>
            <div className="p-4 bg-primary/10 rounded-lg">
              <p className="text-2xl font-bold text-primary">
                R$ {SAVINGS.toFixed(2).replace(".", ",")}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Economia por ano</p>
            </div>
          </div>
        )}
      </div>
    </MarketingLayout>
  );
};

export default PlansPage;
