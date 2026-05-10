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

const features = [
  { title: "Agenda com IA", icon: Brain },
  { title: "Prontuário", icon: FileText },
  { title: "Teleconsulta", icon: Video },
  { title: "Financeiro", icon: Wallet },
  { title: "LGPD", icon: Shield },
  { title: "Suporte humano", icon: Headphones },
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

      {/* Features compactos */}
      <section className="w-full py-10 sm:py-14 bg-muted/40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8 max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Tudo num só lugar.
            </h2>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 max-w-4xl mx-auto">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <Card key={f.title} className="text-center hover:border-primary/40 hover:shadow-sm transition-all">
                  <CardContent className="p-3 sm:p-4 flex flex-col items-center gap-2">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                    <span className="text-[11px] sm:text-xs font-medium leading-tight">{f.title}</span>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          <div className="text-center mt-6">
            <Link to="/platform/resources" className="text-sm text-primary hover:underline inline-flex items-center gap-1">
              Ver todos os recursos <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full py-10 sm:py-14">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-primary text-primary-foreground border-0">
            <CardContent className="p-6 sm:p-10 text-center space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Comece hoje. Sem cartão.
              </h2>
              <Link to="/register" className="inline-block">
                <Button size="lg" variant="secondary" className="gap-2">
                  Criar conta grátis <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </MarketingLayout>
  );
};

export default LandingPage;
