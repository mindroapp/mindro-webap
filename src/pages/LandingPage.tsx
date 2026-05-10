import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import MarketingLayout from "@/components/layouts/MarketingLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, FileText, Video, Wallet, Shield, Headphones, CheckCircle2 } from "lucide-react";
import { PROFESSIONS } from "@/lib/professions";

const features = [
  {
    title: "Agendamento com IA",
    description: "Agendamento e confirmação automática por IA integrado diretamente no seu WhatsApp profissional.",
    link: "/platform/resources",
    icon: Brain,
  },
  {
    title: "Prontuário Eletrônico",
    description: "Mantenha todos os registros dos seus pacientes de forma organizada e segura.",
    link: "/platform/resources",
    icon: FileText,
  },
  {
    title: "Teleconsulta Integrada",
    description: "Atendimentos online com a mesma qualidade das consultas presenciais.",
    link: "/platform/resources",
    icon: Video,
  },
  {
    title: "Gestão Financeira",
    description: "Controle de pagamentos, pacotes de sessões e geração de recibos.",
    link: "/financial",
    icon: Wallet,
  },
  {
    title: "Segurança Avançada",
    description: "Seus dados e os de seus pacientes totalmente protegidos e em conformidade com a LGPD.",
    link: "/platform/security",
    icon: Shield,
  },
  {
    title: "Suporte Especializado",
    description: "Equipe pronta para te ajudar em qualquer momento que precisar.",
    link: "/company/contact",
    icon: Headphones,
  },
];

const LandingPage: React.FC = () => {
  return (
    <MarketingLayout>
      {/* Hero Section */}
      <section className="w-full py-8 sm:py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center lg:flex-row lg:text-left lg:items-center lg:justify-between gap-8 lg:gap-12">
            {/* Hero content */}
            <div className="w-full lg:w-1/2 space-y-4 sm:space-y-6">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight">
                Plataforma para{" "}
                <span className="text-primary">Profissionais</span> de Saúde Mental
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground max-w-lg mx-auto lg:mx-0">
                Transforme seu consultório com a plataforma mindro. 
                Descubra a eficiência do atendimento personalizado e veja sua agenda multiplicar.
              </p>
              <p className="text-sm text-muted-foreground">
                Pensado e desenvolvido por profissionais de saúde mental para profissionais de saúde mental.
              </p>
              
              {/* CTA Buttons - Mobile */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 justify-center lg:justify-start">
                <Link to="/register" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
                    Começar agora
                  </Button>
                </Link>
                <Link to="/plans" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-primary text-primary hover:bg-primary/10">
                    Ver Planos
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Hero image */}
            <div className="w-full lg:w-1/2 mt-8 lg:mt-0">
              <img
                src="https://images.unsplash.com/photo-1573497620053-ea5300f94f21?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"
                alt="Profissional de saúde mental usando um notebook"
                className="rounded-xl shadow-2xl w-full max-h-[300px] sm:max-h-[400px] lg:max-h-[500px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Features section */}
      <section className="w-full py-12 sm:py-16 lg:py-20 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 sm:mb-4">
              Tudo que você precisa em um só lugar
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base px-4">
              Nossa plataforma é completa para que você possa focar no que realmente importa: seus pacientes.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Link to={feature.link} key={index} className="group">
                  <Card className="h-full transition-all duration-300 hover:shadow-lg hover:border-primary/50 bg-card">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-start gap-4">
                        <div className="p-2 sm:p-3 rounded-lg bg-primary/10 text-primary shrink-0">
                          <IconComponent className="h-5 w-5 sm:h-6 sm:w-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1 sm:mb-2 group-hover:text-primary transition-colors">
                            {feature.title}
                          </h3>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
};

export default LandingPage;
