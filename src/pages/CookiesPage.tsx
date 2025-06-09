
import React from "react";
import MarketingLayout from "@/components/layouts/MarketingLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const CookiesPage: React.FC = () => {
  return (
    <MarketingLayout>
      <div className="container mx-auto py-12 px-4 max-w-4xl">
        <h1 className="text-4xl font-bold mb-4 text-indigo-600">Política de Cookies</h1>
        <p className="text-lg text-gray-600 mb-8 dark:text-gray-300">
          Últimas atualizações: 15 de maio de 2025
        </p>
        
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold mb-4 text-indigo-600">1. O que são Cookies?</h2>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              Cookies são pequenos arquivos de texto que são armazenados no seu navegador ou dispositivo quando você visita nosso site. Eles são amplamente utilizados para fazer os sites funcionarem de maneira mais eficiente e fornecer informações aos proprietários do site.
            </p>
            
            <Separator className="my-6" />
            
            <h2 className="text-2xl font-semibold mb-4 text-indigo-600">2. Como Utilizamos os Cookies</h2>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              <strong>2.1. Cookies Essenciais:</strong> Necessários para o funcionamento básico da plataforma. Eles permitem que você navegue pelo site e use recursos essenciais, como áreas seguras e login.
            </p>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              <strong>2.2. Cookies de Desempenho:</strong> Coletam informações sobre como você utiliza nosso site, como quais páginas você visita com mais frequência. Esses cookies não coletam informações que identificam você pessoalmente.
            </p>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              <strong>2.3. Cookies de Funcionalidade:</strong> Permitem que o site se lembre das escolhas que você faz (como seu nome de usuário, idioma ou região) e forneça recursos aprimorados e mais personalizados.
            </p>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              <strong>2.4. Cookies de Marketing:</strong> São utilizados para rastrear visitantes em sites. O objetivo é exibir anúncios relevantes e envolventes para o usuário individual.
            </p>
            
            <Separator className="my-6" />
            
            <h2 className="text-2xl font-semibold mb-4 text-indigo-600">3. Cookies de Terceiros</h2>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              Alguns cookies podem ser definidos por serviços de terceiros que aparecem em nossas páginas, como Google Analytics, que utilizamos para entender como os visitantes usam nosso site e otimizar a experiência do usuário.
            </p>
            
            <Separator className="my-6" />
            
            <h2 className="text-2xl font-semibold mb-4 text-indigo-600">4. Como Gerenciar Cookies</h2>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              A maioria dos navegadores permite que você controle cookies através das configurações de preferências. Limitações ao uso de cookies podem impactar sua experiência e funcionalidades disponíveis.
            </p>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              Você pode configurar seu navegador para recusar todos os cookies ou indicar quando um cookie está sendo enviado. No entanto, alguns recursos do site podem não funcionar adequadamente sem cookies.
            </p>
            
            <Separator className="my-6" />
            
            <h2 className="text-2xl font-semibold mb-4 text-indigo-600">5. Como Desativar Cookies</h2>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              <strong>Google Chrome:</strong> Menu → Configurações → Mostrar configurações avançadas → Privacidade → Configurações de conteúdo → Cookies
            </p>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              <strong>Mozilla Firefox:</strong> Menu → Opções → Privacidade → Histórico → Usar configurações personalizadas
            </p>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              <strong>Internet Explorer:</strong> Menu → Opções da Internet → Privacidade → Configurações
            </p>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              <strong>Safari:</strong> Preferências → Privacidade
            </p>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              <strong>Edge:</strong> Menu → Configurações → Privacidade e serviços
            </p>
            
            <Separator className="my-6" />
            
            <h2 className="text-2xl font-semibold mb-4 text-indigo-600">6. Alterações na Política de Cookies</h2>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              Podemos atualizar nossa Política de Cookies periodicamente. Recomendamos que você verifique esta página regularmente para se manter informado sobre quaisquer alterações.
            </p>
            
            <Separator className="my-6" />
            
            <h2 className="text-2xl font-semibold mb-4 text-indigo-600">7. Contato</h2>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              Se você tiver dúvidas sobre nossa Política de Cookies, entre em contato conosco pelo e-mail: cookies@mindro.com.br
            </p>
          </CardContent>
        </Card>
      </div>
    </MarketingLayout>
  );
};

export default CookiesPage;
