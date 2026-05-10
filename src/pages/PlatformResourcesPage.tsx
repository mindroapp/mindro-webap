import React from "react";
import {
  Shield,
  Wallet,
  Video,
  Calendar,
  MessageSquare,
  FileText,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import MarketingLayout from "@/components/layouts/MarketingLayout";

const resources = [
  { title: "Agendamento inteligente", description: "Lembretes automáticos por WhatsApp.", icon: Calendar },
  { title: "Prontuário eletrônico", description: "Documentação clínica segura.", icon: FileText },
  { title: "Teleconsulta", description: "Atendimento online sem instalações.", icon: Video },
  { title: "Chat seguro", description: "Comunicação criptografada.", icon: MessageSquare },
  { title: "Financeiro", description: "Pacotes, pagamentos e recibos.", icon: Wallet },
  { title: "Segurança LGPD", description: "Dados criptografados e auditados.", icon: Shield },
];

const PlatformResourcesPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <MarketingLayout>
      <div className="container mx-auto py-10 sm:py-14 px-4 max-w-5xl">
        <div className="text-center mb-8 sm:mb-12">
          <Badge variant="secondary" className="mb-3">Recursos</Badge>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
            O essencial para sua clínica.
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
            Ferramentas pensadas para profissionais de saúde mental.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {resources.map((r) => {
            const Icon = r.icon;
            return (
              <Card key={r.title} className="hover:border-primary/40 hover:shadow-sm transition-all">
                <CardContent className="p-4 sm:p-5 space-y-3">
                  <div className="inline-flex p-2 rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-semibold">{r.title}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">{r.description}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Button onClick={() => navigate("/plans")} size="lg" className="gap-2">
            Conhecer planos <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </MarketingLayout>
  );
};

export default PlatformResourcesPage;
