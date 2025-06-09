
import React from "react";
import MarketingLayout from "@/components/layouts/MarketingLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const TermsOfUsePage: React.FC = () => {
  return (
    <MarketingLayout>
      <div className="container mx-auto py-12 px-4 max-w-4xl">
        <h1 className="text-4xl font-bold mb-4 text-indigo-600">Termos de Uso</h1>
        <p className="text-lg text-gray-600 mb-8 dark:text-gray-300">
          Últimas atualizações: 15 de maio de 2025
        </p>
        
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold mb-4 text-indigo-600">1. Aceitação dos Termos</h2>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              Ao acessar ou utilizar a plataforma Mindro, você concorda em cumprir e estar vinculado a estes Termos de Uso. Se você não concordar com qualquer parte destes termos, não poderá acessar ou utilizar nossos serviços.
            </p>
            
            <Separator className="my-6" />
            
            <h2 className="text-2xl font-semibold mb-4 text-indigo-600">2. Descrição do Serviço</h2>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              A Mindro é uma plataforma de gerenciamento para profissionais de saúde mental, incluindo, mas não se limitando a, psicólogos, psicanalistas, psiquiatras e terapeutas. Nossos serviços incluem agendamento de consultas, prontuário eletrônico, teleconsultas, gestão financeira e outras ferramentas de apoio à prática clínica.
            </p>
            
            <Separator className="my-6" />
            
            <h2 className="text-2xl font-semibold mb-4 text-indigo-600">3. Registro e Segurança</h2>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              3.1. Para utilizar nossos serviços, é necessário criar uma conta, fornecendo informações precisas e completas.
            </p>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              3.2. Você é responsável por manter a confidencialidade de suas credenciais de acesso e por todas as atividades que ocorrerem em sua conta.
            </p>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              3.3. Você deve notificar imediatamente a Mindro sobre qualquer uso não autorizado de sua conta ou qualquer outra violação de segurança.
            </p>
            
            <Separator className="my-6" />
            
            <h2 className="text-2xl font-semibold mb-4 text-indigo-600">4. Responsabilidades do Usuário</h2>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              4.1. Você concorda em utilizar a plataforma em conformidade com todas as leis e regulamentações aplicáveis, incluindo, mas não se limitando a, leis de privacidade e proteção de dados.
            </p>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              4.2. Você é responsável pela precisão e legalidade de todas as informações e conteúdos que inserir na plataforma.
            </p>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              4.3. Você concorda em não utilizar a plataforma para qualquer finalidade ilegal ou não autorizada.
            </p>
            
            <Separator className="my-6" />
            
            <h2 className="text-2xl font-semibold mb-4 text-indigo-600">5. Limitação de Responsabilidade</h2>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              5.1. A Mindro não será responsável por quaisquer danos diretos, indiretos, incidentais, especiais, consequenciais ou punitivos, incluindo, mas não se limitando a, perda de lucros, dados, uso, boa vontade ou outras perdas intangíveis.
            </p>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              5.2. A plataforma é fornecida "no estado em que se encontra" e "conforme disponível", sem garantias de qualquer tipo, expressas ou implícitas.
            </p>
            
            <Separator className="my-6" />
            
            <h2 className="text-2xl font-semibold mb-4 text-indigo-600">6. Alterações nos Termos</h2>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              A Mindro reserva-se o direito de modificar ou substituir estes Termos de Uso a qualquer momento. Alterações substanciais serão notificadas através da plataforma ou por e-mail.
            </p>
            
            <Separator className="my-6" />
            
            <h2 className="text-2xl font-semibold mb-4 text-indigo-600">7. Contato</h2>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              Se você tiver dúvidas sobre estes Termos de Uso, entre em contato conosco pelo e-mail: contato@mindro.com.br
            </p>
          </CardContent>
        </Card>
      </div>
    </MarketingLayout>
  );
};

export default TermsOfUsePage;
