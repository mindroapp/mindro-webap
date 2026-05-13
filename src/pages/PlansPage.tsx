import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Sparkles } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import MarketingLayout from "@/components/layouts/MarketingLayout";
import SEO from "@/components/SEO";

const MONTHLY_PRICE = 49.9;
const ANNUAL_INSTALLMENT = 45.75;
const ANNUAL_TOTAL = 549.0;
const SAVINGS = MONTHLY_PRICE * 12 - ANNUAL_TOTAL;

const features = [
  "Dashboard analítico",
  "Agendamentos ilimitados com link personalizado",
  "Lembretes automáticos via WhatsApp Mindro",
  "Prontuário eletrônico",
  "Controle de pacotes e recibos",
];

const PlansPage: React.FC = () => {
  const [annual, setAnnual] = useState(true);
  const navigate = useNavigate();

  return (
    <MarketingLayout>
      <SEO
        title="Planos e Preços — Mindro"
        description="Conheça os planos da Mindro: mensal a R$ 49,90 ou anual com desconto. 1 mês grátis para novos profissionais."
        path="/plans"
      />
      <div className="container mx-auto py-10 sm:py-14 px-4 max-w-2xl">
        <div className="text-center mb-8">
          <Badge variant="secondary" className="mb-3">Planos</Badge>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
            Um plano. Tudo incluso.
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Você cuida dos pacientes — a mindro cuida do resto.
          </p>

          <div className="flex items-center justify-center mt-6 gap-3">
            <Label htmlFor="billing" className={!annual ? "font-medium" : "text-muted-foreground"}>
              Mensal
            </Label>
            <Switch id="billing" checked={annual} onCheckedChange={setAnnual} />
            <div className="flex items-center gap-2">
              <Label htmlFor="billing" className={annual ? "font-medium" : "text-muted-foreground"}>
                Anual
              </Label>
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                1 mês grátis
              </Badge>
            </div>
          </div>
        </div>

        <Card className="relative border-primary/30 shadow-lg overflow-hidden">
          {annual && (
            <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 rounded-bl-lg text-xs font-semibold flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              MAIS POPULAR
            </div>
          )}

          <CardContent className="p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-1">
                {annual ? "Plano Anual" : "Plano Mensal"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {annual ? "Pague 11, use 12 meses." : "Sem fidelidade. Cancele quando quiser."}
              </p>
            </div>

            <div>
              {annual ? (
                <>
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="text-4xl sm:text-5xl font-bold text-primary">
                      12x R$ {ANNUAL_INSTALLMENT.toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    ou R$ {ANNUAL_TOTAL.toFixed(2).replace(".", ",")} à vista ·
                    economize R$ {SAVINGS.toFixed(2).replace(".", ",")}/ano
                  </p>
                </>
              ) : (
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl sm:text-5xl font-bold text-foreground">
                    R$ {MONTHLY_PRICE.toFixed(2).replace(".", ",")}
                  </span>
                  <span className="text-base text-muted-foreground">/mês</span>
                </div>
              )}
            </div>

            <ul className="space-y-2.5">
              {features.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm sm:text-base">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <div className="space-y-2">
              <Button onClick={() => navigate("/register")} size="lg" className="w-full">
                {annual ? "Assinar anual" : "Começar agora"}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Acesso completo · Suporte incluso
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </MarketingLayout>
  );
};

export default PlansPage;
