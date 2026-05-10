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
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import MarketingLayout from "@/components/layouts/MarketingLayout";

const SESSION_IMG =
  "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?auto=format&fit=crop&w=1200&q=80";
const TECH_IMG =
  "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80";
const CARE_IMG =
  "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=900&q=80";
const MIND_IMG =
  "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=1200&q=80";

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
      <div className="container mx-auto pt-12 sm:pt-16 lg:pt-20 pb-12 sm:pb-16 px-4 max-w-6xl">
        <div className="text-center mb-10 sm:mb-14">
          <Badge variant="secondary" className="mb-3">Recursos</Badge>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-3">
            O essencial para sua clínica.
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
            Ferramentas pensadas para profissionais de saúde mental.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Mosaico de imagens */}
          <div className="grid grid-cols-6 grid-rows-6 gap-3 sm:gap-4 h-[360px] sm:h-[460px] lg:h-[520px]">
            <img
              src={SESSION_IMG}
              alt="Sessão de atendimento"
              loading="lazy"
              className="col-span-4 row-span-4 h-full w-full object-cover rounded-2xl shadow-lg"
            />
            <img
              src={MIND_IMG}
              alt="Bem-estar e saúde mental"
              loading="lazy"
              className="col-span-2 row-span-3 h-full w-full object-cover rounded-2xl shadow-md"
            />
            <img
              src={TECH_IMG}
              alt="Tecnologia como aliada"
              loading="lazy"
              className="col-span-2 row-span-3 h-full w-full object-cover rounded-2xl shadow-md"
            />
            <img
              src={CARE_IMG}
              alt="Cuidado próximo"
              loading="lazy"
              className="col-span-4 row-span-2 h-full w-full object-cover rounded-2xl shadow-md"
            />
          </div>

          {/* Lista sem cards */}
          <ul className="divide-y divide-border/60">
            {resources.map((r) => {
              const Icon = r.icon;
              return (
                <li key={r.title} className="flex items-start gap-4 py-4">
                  <div className="shrink-0 p-2.5 rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-base leading-tight">{r.title}</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">{r.description}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="mt-12 text-center">
          <Button onClick={() => navigate("/plans")} size="lg" className="gap-2">
            Conhecer planos <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </MarketingLayout>
  );
};

export default PlatformResourcesPage;
