
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import MarketingLayout from "@/components/layouts/MarketingLayout";

const LandingPage: React.FC = () => {
  return (
    <MarketingLayout>
      <div className="container mx-auto py-12 px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 py-12">
          {/* Hero content */}
          <div className="lg:w-1/2 space-y-6">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 dark:text-white">
              Com a nossa plataforma, você <span className="text-indigo-600">cuida dos seus pacientes</span> — nós cuidamos do resto.
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-lg">
              Plataforma completa para profissionais de saúde mental com agendamento e confirmação por IA integrado no WhatsApp do profissional.
            </p>
            <div className="bg-indigo-50 p-4 rounded-lg border-l-4 border-indigo-500">
              <p className="text-indigo-800 font-medium">
                🎁 Comece agora com 7 dias grátis
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/register">
                <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8">
                  Começar Grátis Agora
                </Button>
              </Link>
              <Link to="/platform/resources">
                <Button variant="outline" size="lg" className="border-indigo-600 text-indigo-600 hover:bg-indigo-50">
                  Conheça os Recursos
                </Button>
              </Link>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              ✅ Agendamento inteligente com IA • ✅ WhatsApp integrado • ✅ Sem burocracia
            </p>
          </div>
          
          {/* Hero image */}
          <div className="lg:w-1/2">
            <img
              src="https://images.unsplash.com/photo-1573497620053-ea5300f94f21?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"
              alt="Profissional de saúde mental usando um notebook"
              className="rounded-lg shadow-xl max-h-[500px] object-cover w-full"
            />
          </div>
        </div>
        
        {/* Features section */}
        <div className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
              Tudo que você precisa em um só lugar
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Nossa plataforma é completa para que você possa focar no que realmente importa: seus pacientes.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "🤖 Agendamento com IA",
                description: "Agendamento e confirmação automática por IA integrado diretamente no seu WhatsApp profissional.",
                link: "/platform/resources",
              },
              {
                title: "📋 Prontuário Eletrônico",
                description: "Mantenha todos os registros dos seus pacientes de forma organizada e segura.",
                link: "/platform/resources",
              },
              {
                title: "💻 Teleconsulta Integrada",
                description: "Atendimentos online com a mesma qualidade das consultas presenciais.",
                link: "/platform/resources",
              },
              {
                title: "💰 Gestão Financeira",
                description: "Controle de pagamentos, pacotes de sessões e geração de recibos.",
                link: "/financial",
              },
              {
                title: "🔒 Segurança Avançada",
                description: "Seus dados e os de seus pacientes totalmente protegidos e em conformidade com a LGPD.",
                link: "/platform/security",
              },
              {
                title: "🎧 Suporte Especializado",
                description: "Equipe pronta para te ajudar em qualquer momento que precisar.",
                link: "/company/contact",
              },
            ].map((feature, index) => (
              <Link to={feature.link} key={index} className="group">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100 dark:border-gray-700 h-full">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
        
        {/* Call to action */}
        <div className="bg-indigo-50 dark:bg-gray-800 rounded-xl p-8 md:p-12 my-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-indigo-700 dark:text-indigo-400 mb-4">
              Comece hoje mesmo
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Descubra como a mindro pode transformar sua prática profissional com 
              7 dias grátis, sem necessidade de cartão de crédito.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/plans">
              <Button size="lg" variant="outline" className="border-indigo-600 text-indigo-600 hover:bg-indigo-50">
                Ver Planos
              </Button>
            </Link>
            <Link to="/register">
              <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                Começar Grátis (7 dias)
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </MarketingLayout>
  );
};

export default LandingPage;
