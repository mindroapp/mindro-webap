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
import { PROFESSIONS } from "@/lib/professions";

const HERO_IMG =
  "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1200&q=80";
const SESSION_IMG =
  "https://images.unsplash.com/photo-1590650046871-92c887180603?auto=format&fit=crop&w=900&q=80";
const CARE_IMG =
  "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=900&q=80";
const TEAM_IMG =
  "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=900&q=80";
const CALM_IMG =
  "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=900&q=80";

const features = [
  { title: "Agenda com IA", description: "Confirmações automáticas pelo WhatsApp.", icon: Brain, link: "/platform/resources" },
  { title: "Prontuário Eletrônico", description: "Registros organizados e seguros.", icon: FileText, link: "/platform/resources" },
  { title: "Teleconsulta", description: "Atendimento online em vídeo HD.", icon: Video, link: "/platform/resources" },
  { title: "Financeiro", description: "Pagamentos, pacotes e recibos.", icon: Wallet, link: "/financial" },
  { title: "LGPD & Segurança", description: "Dados criptografados ponta a ponta.", icon: Shield, link: "/platform/security" },
  { title: "Suporte humano", description: "Equipe disponível quando precisar.", icon: Headphones, link: "/company/contact" },
];

const stats = [
  { value: "+2.500", label: "Profissionais ativos" },
  { value: "98%", label: "Recomendam" },
  { value: "24/7", label: "Suporte" },
];

const testimonials = [
  {
    quote: "Reduzi as faltas em 60% com os lembretes automáticos. Voltei a ter tempo de respirar entre uma sessão e outra.",
    name: "Dra. Mariana Costa",
    role: "Psicóloga · CRP 06",
  },
  {
    quote: "Centralizar prontuário, agenda e recibo num só lugar mudou minha rotina clínica.",
    name: "Dr. Rafael Lima",
    role: "Psiquiatra · CRM-SP",
  },
];

const LandingPage: React.FC = () => {
  return (
    <MarketingLayout>
      {/* Hero */}
      <section className="w-full pt-8 pb-12 sm:pt-12 sm:pb-16 lg:pt-16 lg:pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="space-y-5 sm:space-y-6 text-center lg:text-left">
              <Badge variant="secondary" className="gap-1.5">
                <Sparkles className="h-3 w-3" />
                Plataforma multiprofissional
              </Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-[1.1] tracking-tight">
                Cuidar de pessoas <br className="hidden sm:block" />
                <span className="text-primary">sem perder tempo</span> com burocracia.
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground max-w-md mx-auto lg:mx-0">
                Agenda, prontuário, teleconsulta e financeiro num só lugar — feito com
                profissionais de saúde mental, para quem cuida de pessoas.
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

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-3 pt-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-primary" /> Sem cartão</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-primary" /> Cancele quando quiser</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-primary" /> LGPD</span>
              </div>
            </div>

            {/* Image collage */}
            <div className="relative grid grid-cols-5 grid-rows-5 gap-3 sm:gap-4 h-[340px] sm:h-[460px] lg:h-[520px]">
              <img
                src={HERO_IMG}
                alt="Profissional de saúde acolhendo paciente"
                loading="lazy"
                className="col-span-3 row-span-5 w-full h-full object-cover rounded-2xl shadow-xl"
              />
              <img
                src={CARE_IMG}
                alt="Sessão de terapia"
                loading="lazy"
                className="col-span-2 row-span-3 w-full h-full object-cover rounded-2xl shadow-lg"
              />
              <img
                src={CALM_IMG}
                alt="Ambiente acolhedor"
                loading="lazy"
                className="col-span-2 row-span-2 w-full h-full object-cover rounded-2xl shadow-lg"
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-12 sm:mt-16 max-w-2xl mx-auto">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-foreground">{s.value}</div>
                <div className="text-xs sm:text-sm text-muted-foreground mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Editorial split: Para quem é */}
      <section className="w-full py-12 sm:py-16 lg:py-20 bg-muted/40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <img
              src={TEAM_IMG}
              alt="Equipe multiprofissional de saúde"
              loading="lazy"
              className="w-full h-[260px] sm:h-[360px] lg:h-[440px] object-cover rounded-2xl shadow-lg order-2 lg:order-1"
            />
            <div className="space-y-5 order-1 lg:order-2">
              <Badge variant="secondary">Para toda a equipe</Badge>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
                Da clínica individual ao consultório multidisciplinar.
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base">
                Cadastros validados pelos principais conselhos do Brasil — CRP, CRM, CREFITO,
                CRFa, CRESS, COREN, CRN.
              </p>

              <div className="grid sm:grid-cols-2 gap-3">
                <Card className="border-l-4 border-l-primary">
                  <CardContent className="p-4">
                    <p className="text-xs uppercase tracking-wide text-primary font-semibold mb-2">Principais</p>
                    <ul className="space-y-1.5">
                      {PROFESSIONS.filter((p) => p.group === "principal").slice(0, 6).map((p) => (
                        <li key={p.value} className="text-sm text-foreground flex items-start gap-2">
                          <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0 mt-1" />
                          {p.label}
                        </li>
                      ))}
                      <li className="text-xs text-muted-foreground pl-5.5">
                        +{PROFESSIONS.filter((p) => p.group === "principal").length - 6} outras
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-muted-foreground/30">
                  <CardContent className="p-4">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground font-semibold mb-2">Complementares</p>
                    <ul className="space-y-1.5">
                      {PROFESSIONS.filter((p) => p.group === "complementar").slice(0, 6).map((p) => (
                        <li key={p.value} className="text-sm text-foreground flex items-start gap-2">
                          <CheckCircle2 className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-1" />
                          {p.label}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features – compact mobile-first cards */}
      <section className="w-full py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 max-w-2xl mx-auto">
            <Badge variant="secondary" className="mb-3">Recursos</Badge>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
              Tudo num só lugar.
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base mt-3">
              Menos abas abertas, mais tempo com seus pacientes.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <Link to={f.link} key={f.title} className="group">
                  <Card className="h-full transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 hover:border-primary/40">
                    <CardContent className="p-4 sm:p-6 space-y-3">
                      <div className="inline-flex p-2 rounded-lg bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-sm sm:text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                          {f.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
                          {f.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="w-full py-12 sm:py-16 lg:py-20 bg-muted/40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 items-center">
            <div className="lg:col-span-1 space-y-4">
              <Badge variant="secondary">Depoimentos</Badge>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
                Quem usa, recomenda.
              </h2>
              <img
                src={SESSION_IMG}
                alt="Profissional em atendimento"
                loading="lazy"
                className="w-full h-48 lg:h-56 object-cover rounded-2xl shadow-md"
              />
            </div>

            <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4">
              {testimonials.map((t) => (
                <Card key={t.name} className="h-full">
                  <CardContent className="p-5 sm:p-6 flex flex-col h-full">
                    <p className="text-foreground text-sm sm:text-base leading-relaxed flex-1">
                      "{t.quote}"
                    </p>
                    <div className="mt-4 pt-4 border-t">
                      <p className="font-semibold text-sm">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-primary text-primary-foreground border-0 overflow-hidden">
            <CardContent className="p-8 sm:p-12 lg:p-16 text-center space-y-5">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
                Comece hoje. Sem cartão, sem amarras.
              </h2>
              <p className="text-primary-foreground/90 text-sm sm:text-base max-w-xl mx-auto">
                Crie sua conta em menos de 2 minutos e veja sua rotina ficar mais leve.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <Link to="/register">
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto gap-2">
                    Criar conta grátis <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/plans">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                    Conhecer planos
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </MarketingLayout>
  );
};

export default LandingPage;
