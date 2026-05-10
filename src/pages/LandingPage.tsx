import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import MarketingLayout from "@/components/layouts/MarketingLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Brain,
  FileText,
  Video,
  Wallet,
  Shield,
  Headphones,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const HERO_IMG =
  "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1200&q=80";
const CARE_IMG =
  "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=900&q=80";
const SESSION_IMG =
  "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?auto=format&fit=crop&w=1200&q=80";
const MIND_IMG =
  "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=1200&q=80";
const ZEN_IMG =
  "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80";

const features = [
  { title: "Agenda com IA", icon: Brain, description: "Lembretes e organização automática." },
  { title: "Prontuário", icon: FileText, description: "Registros clínicos seguros." },
  { title: "Teleconsulta", icon: Video, description: "Atendimento online integrado." },
  { title: "Financeiro", icon: Wallet, description: "Recibos e pacotes em um clique." },
  { title: "LGPD", icon: Shield, description: "Dados criptografados e auditados." },
  { title: "Suporte humano", icon: Headphones, description: "Time real ao seu lado." },
];

const LandingPage: React.FC = () => {
  return (
    <MarketingLayout>
      {/* Hero */}
      <section className="w-full pt-8 pb-10 sm:pt-12 sm:pb-14 lg:pt-16 lg:pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-14 items-center">
            <div className="space-y-5 text-center lg:text-left">
              <Badge variant="secondary" className="gap-1.5">
                <Sparkles className="h-3 w-3" />
                Plataforma multiprofissional
              </Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight">
                Cuidar de pessoas <span className="text-primary">sem burocracia</span>.
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground max-w-md mx-auto lg:mx-0">
                Agenda, prontuário, teleconsulta e financeiro em um só lugar.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 pt-2 justify-center lg:justify-start">
                <Link to="/register" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto gap-2">
                    Começar grátis <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/plans" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Ver planos
                  </Button>
                </Link>
              </div>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-5 gap-y-2 pt-2 text-xs sm:text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-primary" /> Sem cartão</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-primary" /> LGPD</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-primary" /> Cancele quando quiser</span>
              </div>
            </div>

            <div className="relative grid grid-cols-5 gap-3 sm:gap-4 h-[280px] sm:h-[380px] lg:h-[440px]">
              <img
                src={HERO_IMG}
                alt="Profissional acolhendo paciente"
                loading="lazy"
                className="col-span-3 row-span-2 h-full w-full object-cover rounded-2xl shadow-xl"
              />
              <img
                src={CARE_IMG}
                alt="Sessão de terapia"
                loading="lazy"
                className="col-span-2 h-full w-full object-cover rounded-2xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features — sem cards, lado a lado com mosaico de imagens */}
      <section className="w-full pt-16 sm:pt-20 lg:pt-24 pb-12 sm:pb-16 bg-muted/40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center max-w-6xl mx-auto">
            {/* Mosaico de imagens — saúde mental, sessões, bem-estar */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 h-[320px] sm:h-[420px] lg:h-[480px] order-last lg:order-first">
              <img
                src={SESSION_IMG}
                alt="Sessão de atendimento"
                loading="lazy"
                className="col-span-1 row-span-2 h-full w-full object-cover rounded-2xl shadow-lg"
              />
              <img
                src={MIND_IMG}
                alt="Bem-estar e saúde mental"
                loading="lazy"
                className="col-span-1 row-span-1 h-full w-full object-cover rounded-2xl shadow-md"
              />
              <img
                src={ZEN_IMG}
                alt="Momento de calma e reflexão"
                loading="lazy"
                className="col-span-1 row-span-1 h-full w-full object-cover rounded-2xl shadow-md"
              />
            </div>

            {/* Lista de recursos sem cards */}
            <div>
              <Badge variant="secondary" className="mb-3">Recursos</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
                Tudo num só lugar.
              </h2>
              <p className="text-muted-foreground mb-8 max-w-md">
                Tecnologia que cuida de você enquanto você cuida de quem precisa.
              </p>

              <ul className="divide-y divide-border/60">
                {features.map((f) => {
                  const Icon = f.icon;
                  return (
                    <li key={f.title} className="flex items-start gap-4 py-4">
                      <div className="shrink-0 p-2.5 rounded-lg bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-base leading-tight">{f.title}</h3>
                        <p className="text-sm text-muted-foreground mt-0.5">{f.description}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
};

export default LandingPage;
