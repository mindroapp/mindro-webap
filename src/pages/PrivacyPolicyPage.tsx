
import React from "react";
import MarketingLayout from "@/components/layouts/MarketingLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const PrivacyPolicyPage: React.FC = () => {
  return (
    <MarketingLayout>
      <div className="container mx-auto py-12 px-4 max-w-4xl">
        <h1 className="text-4xl font-bold mb-4 text-indigo-600">Política de Privacidade</h1>
        <p className="text-lg text-gray-600 mb-8 dark:text-gray-300">
          Últimas atualizações: 15 de maio de 2025
        </p>
        
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold mb-4 text-indigo-600">1. Introdução</h2>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              A Mindro está comprometida em proteger sua privacidade. Esta Política de Privacidade explica como coletamos, usamos, divulgamos e protegemos suas informações pessoais quando você utiliza nossa plataforma.
            </p>
            
            <Separator className="my-6" />
            
            <h2 className="text-2xl font-semibold mb-4 text-indigo-600">2. Informações que Coletamos</h2>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              <strong>2.1. Informações de Registro:</strong> Quando você cria uma conta, coletamos seu nome, endereço de e-mail, número de telefone, informações profissionais (como registro profissional) e senha.
            </p>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              <strong>2.2. Informações de Uso:</strong> Coletamos informações sobre como você utiliza nossa plataforma, incluindo logs de acesso, ações realizadas, horários de utilização e outros dados de interação.
            </p>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              <strong>2.3. Dados de Pacientes:</strong> Como profissional de saúde mental, você insere dados de seus pacientes na plataforma. Estes dados são considerados sensíveis e tratados com o mais alto nível de segurança.
            </p>
            
            <Separator className="my-6" />
            
            <h2 className="text-2xl font-semibold mb-4 text-indigo-600">3. Como Utilizamos Suas Informações</h2>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              <strong>3.1.</strong> Para fornecer, manter e melhorar nossos serviços.
            </p>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              <strong>3.2.</strong> Para enviar comunicações relacionadas ao serviço, como confirmações, atualizações e alertas de segurança.
            </p>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              <strong>3.3.</strong> Para fins de pesquisa e análise, visando entender melhor como nossos serviços são utilizados.
            </p>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              <strong>3.4.</strong> Para cumprir obrigações legais e proteger direitos legais.
            </p>
            
            <Separator className="my-6" />
            
            <h2 className="text-2xl font-semibold mb-4 text-indigo-600">4. Compartilhamento de Informações</h2>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              <strong>4.1.</strong> Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros para fins de marketing.
            </p>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              <strong>4.2.</strong> Podemos compartilhar suas informações com prestadores de serviços terceirizados que nos auxiliam na operação da plataforma, sempre sob acordos de confidencialidade.
            </p>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              <strong>4.3.</strong> Podemos divulgar suas informações quando necessário para cumprir a lei ou proteger nossos direitos.
            </p>
            
            <Separator className="my-6" />
            
            <h2 className="text-2xl font-semibold mb-4 text-indigo-600">5. Segurança de Dados</h2>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              <strong>5.1.</strong> Implementamos medidas de segurança técnicas, administrativas e físicas para proteger suas informações contra acesso não autorizado, alteração, divulgação ou destruição.
            </p>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              <strong>5.2.</strong> Todos os dados são criptografados em trânsito e em repouso.
            </p>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              <strong>5.3.</strong> Realizamos auditorias de segurança regulares para garantir a integridade de nossos sistemas.
            </p>
            
            <Separator className="my-6" />
            
            <h2 className="text-2xl font-semibold mb-4 text-indigo-600">6. Seus Direitos</h2>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              <strong>6.1. Acesso:</strong> Você tem o direito de acessar as informações pessoais que coletamos sobre você.
            </p>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              <strong>6.2. Retificação:</strong> Você pode solicitar a correção de informações inexatas ou desatualizadas.
            </p>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              <strong>6.3. Exclusão:</strong> Você pode solicitar a exclusão de suas informações pessoais, sujeito às obrigações legais de retenção.
            </p>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              <strong>6.4. Portabilidade:</strong> Você pode solicitar uma cópia de suas informações pessoais em um formato estruturado, comumente usado e legível por máquina.
            </p>
            
            <Separator className="my-6" />
            
            <h2 className="text-2xl font-semibold mb-4 text-indigo-600">7. Alterações na Política de Privacidade</h2>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos você sobre mudanças significativas através da plataforma ou por e-mail.
            </p>
            
            <Separator className="my-6" />
            
            <h2 className="text-2xl font-semibold mb-4 text-indigo-600">8. Contato</h2>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              Se você tiver dúvidas ou preocupações sobre nossa Política de Privacidade ou práticas de dados, entre em contato conosco pelo e-mail: privacidade@mindro.com.br
            </p>
          </CardContent>
        </Card>
      </div>
    </MarketingLayout>
  );
};

export default PrivacyPolicyPage;
