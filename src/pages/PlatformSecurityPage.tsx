import React from "react";
import {
  Shield,
  Lock,
  KeyRound,
  Server,
  FileCheck,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useNavigate } from "react-router-dom";
import MarketingLayout from "@/components/layouts/MarketingLayout";

const items = [
  { title: "Criptografia ponta a ponta", description: "Dados em trânsito e em repouso.", icon: Lock },
  { title: "2FA", description: "Autenticação em dois fatores.", icon: KeyRound },
  { title: "Backup diário", description: "Retenção de 30 dias.", icon: Server },
  { title: "LGPD", description: "Total conformidade.", icon: FileCheck },
  { title: "Auditoria", description: "Monitoramento de acessos.", icon: AlertCircle },
  { title: "Certificações", description: "Padrões internacionais.", icon: Shield },
];

const PlatformSecurityPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <MarketingLayout>
      <div className="container mx-auto py-10 sm:py-14 px-4 max-w-5xl">
        <div className="text-center mb-8 sm:mb-12">
          <Badge variant="secondary" className="mb-3">Segurança</Badge>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
            Seus dados protegidos.
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
            Plataforma desenhada com a sensibilidade da saúde mental em mente.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-10 sm:mb-14">
          {items.map((it) => {
            const Icon = it.icon;
            return (
              <Card key={it.title} className="hover:border-primary/40 hover:shadow-sm transition-all">
                <CardContent className="p-4 sm:p-5 space-y-3">
                  <div className="inline-flex p-2 rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-semibold">{it.title}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">{it.description}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="bg-muted/40 border-0">
          <CardContent className="p-5 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">Perguntas frequentes</h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="i1">
                <AccordionTrigger className="text-left text-sm sm:text-base">
                  Como meus dados são protegidos?
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  Criptografia AES-256 em repouso e SSL/TLS em trânsito, com 2FA e monitoramento contínuo.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="i2">
                <AccordionTrigger className="text-left text-sm sm:text-base">
                  Estão em conformidade com a LGPD?
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  Sim. Oferecemos ferramentas para atender aos direitos garantidos pela lei.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="i3">
                <AccordionTrigger className="text-left text-sm sm:text-base">
                  E se meu dispositivo for roubado?
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  Você pode encerrar sessões remotamente. Sessões expiram por inatividade.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="i4">
                <AccordionTrigger className="text-left text-sm sm:text-base">
                  Vocês compartilham dados com terceiros?
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  Não para fins comerciais. Apenas serviços operacionais essenciais (pagamentos, notificações).
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <div className="mt-10 text-center">
          <Button onClick={() => navigate("/plans")} size="lg" className="gap-2">
            Experimentar com segurança <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </MarketingLayout>
  );
};

export default PlatformSecurityPage;
