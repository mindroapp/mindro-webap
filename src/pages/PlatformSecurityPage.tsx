
import React from "react";
import { 
  Shield, 
  Lock, 
  KeyRound, 
  Server, 
  FileCheck,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useNavigate } from "react-router-dom";
import MarketingLayout from "@/components/layouts/MarketingLayout";

const PlatformSecurityPage: React.FC = () => {
  const navigate = useNavigate();

  const securityFeatures = [
    {
      title: "Criptografia de ponta a ponta",
      description: "Todos os dados são criptografados tanto em trânsito quanto em repouso.",
      icon: Lock,
    },
    {
      title: "Autenticação de dois fatores",
      description: "Proteção adicional para acesso à sua conta.",
      icon: KeyRound,
    },
    {
      title: "Backup diário automático",
      description: "Seus dados são automaticamente salvos em backup diariamente.",
      icon: Server,
    },
    {
      title: "Conformidade com LGPD",
      description: "Plataforma totalmente aderente à Lei Geral de Proteção de Dados.",
      icon: FileCheck,
    },
    {
      title: "Auditoria de acessos",
      description: "Monitoramento constante de todos os acessos à plataforma.",
      icon: AlertCircle,
    },
    {
      title: "Certificações de segurança",
      description: "Seguimos os mais rigorosos padrões internacionais de segurança.",
      icon: Shield,
    }
  ];

  return (
    <MarketingLayout>
      <div className="container mx-auto py-12 px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-indigo-700">Segurança e Privacidade</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Entendemos a sensibilidade dos dados de saúde mental. Nossa plataforma 
            foi desenvolvida priorizando a segurança e confidencialidade dos dados 
            dos seus pacientes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {securityFeatures.map((feature, index) => (
            <Card key={index} className="border-2 border-gray-100 hover:border-indigo-200 transition-all">
              <CardHeader>
                <div className="bg-indigo-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-indigo-700" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-indigo-50 p-8 rounded-xl">
          <h2 className="text-2xl font-bold mb-6 text-indigo-700">Perguntas Frequentes sobre Segurança</h2>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-left">
                Como meus dados são protegidos?
              </AccordionTrigger>
              <AccordionContent>
                Utilizamos criptografia AES-256 para todos os dados armazenados e protocolo SSL/TLS 
                para transmissão de dados. Além disso, implementamos políticas rigorosas de acesso, 
                com autenticação multifator e monitoramento contínuo.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger className="text-left">
                A plataforma está em conformidade com a LGPD?
              </AccordionTrigger>
              <AccordionContent>
                Sim, nossa plataforma foi desenvolvida seguindo todos os princípios e 
                requisitos da Lei Geral de Proteção de Dados. Oferecemos ferramentas para 
                que você possa atender às solicitações de seus pacientes relacionadas aos 
                direitos garantidos pela lei.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger className="text-left">
                O que acontece se meu dispositivo for roubado?
              </AccordionTrigger>
              <AccordionContent>
                Você pode desativar imediatamente seu acesso à plataforma através de 
                qualquer outro dispositivo ou entrando em contato com nosso suporte. 
                As sessões ativas são automaticamente encerradas após um período de 
                inatividade e exigem autenticação para novo acesso.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger className="text-left">
                Como são feitos os backups dos dados?
              </AccordionTrigger>
              <AccordionContent>
                Realizamos backups automáticos diários, com retenção de 30 dias. 
                Todos os backups são criptografados e armazenados em servidores 
                redundantes localizados em diferentes regiões geográficas.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger className="text-left">
                Vocês compartilham dados com terceiros?
              </AccordionTrigger>
              <AccordionContent>
                Não compartilhamos dados de pacientes ou profissionais com terceiros 
                para fins de marketing ou comerciais. Em casos específicos e sempre com 
                consentimento prévio, podemos utilizar serviços de terceiros para processamento 
                de pagamentos ou envio de notificações.
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="mt-10 text-center">
            <Button 
              className="bg-indigo-700 hover:bg-indigo-800 text-white px-8 py-6 text-lg rounded-lg"
              onClick={() => navigate("/plans")}
            >
              Experimente com Segurança
            </Button>
          </div>
        </div>
      </div>
    </MarketingLayout>
  );
};

export default PlatformSecurityPage;
