
import React from "react";
import { 
  Shield, 
  Database, 
  Video, 
  Calendar, 
  MessageSquare, 
  FileText,
  CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import MarketingLayout from "@/components/layouts/MarketingLayout";

const PlatformResourcesPage: React.FC = () => {
  const navigate = useNavigate();

  const resources = [
    {
      title: "Agendamento Inteligente",
      description: "Sistema completo de agendamento com lembretes automáticos para pacientes.",
      icon: Calendar,
    },
    {
      title: "Prontuário Eletrônico",
      description: "Documentação clínica digital segura e organizada para todos os seus pacientes.",
      icon: FileText,
    },
    {
      title: "Teleconsulta Integrada",
      description: "Realize atendimentos online com uma ferramenta estável e sem instalações.",
      icon: Video,
    },
    {
      title: "Chat Seguro",
      description: "Comunicação criptografada entre você e seus pacientes.",
      icon: MessageSquare,
    },
    {
      title: "Gestão Financeira",
      description: "Controle de pagamentos, pacotes de sessões e emissão de recibos.",
      icon: Database,
    },
    {
      title: "Segurança Avançada",
      description: "Dados criptografados e conformidade com normas de privacidade.",
      icon: Shield,
    },
  ];

  return (
    <MarketingLayout>
      <div className="container mx-auto py-12 px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-indigo-600">Recursos da Plataforma</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Desenvolvida especificamente para profissionais de Saúde Mental, nossa plataforma oferece 
            todas as ferramentas necessárias para otimizar sua prática clínica.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {resources.map((resource, index) => (
            <Card key={index} className="border-2 border-gray-100 hover:border-indigo-200 transition-all">
              <CardHeader>
                <div className="bg-indigo-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <resource.icon className="h-6 w-6 text-indigo-600" />
                </div>
                <CardTitle>{resource.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{resource.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 bg-indigo-50 p-8 rounded-xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4 text-indigo-600">Desenvolvido para Profissionais de Saúde Mental</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Nossa plataforma é especialmente desenhada para atender as necessidades específicas de:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              "Psicólogos",
              "Psicanalistas",
              "Terapeutas Cognitivo-Comportamentais",
              "Neuropsicólogos",
              "Psiquiatras",
              "Terapeutas Ocupacionais"
            ].map((profession, index) => (
              <div key={index} className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-indigo-600" />
                <span className="text-gray-800">{profession}</span>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Button 
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-6 text-lg rounded-lg"
              onClick={() => navigate("/plans")}
            >
              Conheça Nossos Planos
            </Button>
          </div>
        </div>
      </div>
    </MarketingLayout>
  );
};

export default PlatformResourcesPage;
