
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

interface MessageTemplatesProps {
  onSelectTemplate: (message: string) => void;
}

const MessageTemplates: React.FC<MessageTemplatesProps> = ({ onSelectTemplate }) => {
  const templates = [
    {
      category: "Pagamento",
      templates: [
        {
          title: "Cobrança Pendente",
          message: "Olá! Identificamos que há um pagamento pendente em sua conta. Por favor, regularize sua situação para continuar utilizando nossos serviços."
        },
        {
          title: "Vencimento Próximo",
          message: "Seu pagamento vence em 3 dias. Para evitar interrupções, efetue o pagamento até a data de vencimento."
        }
      ]
    },
    {
      category: "Avisos",
      templates: [
        {
          title: "Manutenção Programada",
          message: "Informamos que haverá manutenção programada no sistema no domingo das 2h às 4h. Durante este período, o acesso pode ficar indisponível."
        },
        {
          title: "Nova Funcionalidade",
          message: "Temos uma nova funcionalidade disponível! Acesse a plataforma e confira as melhorias que preparamos para você."
        }
      ]
    },
    {
      category: "Comemorações",
      templates: [
        {
          title: "Aniversário",
          message: "Parabéns pelo seu aniversário! Desejamos muito sucesso e felicidades em sua jornada profissional."
        },
        {
          title: "Bem-vindo",
          message: "Seja bem-vindo à nossa plataforma! Estamos aqui para apoiar você em sua prática profissional. Qualquer dúvida, entre em contato conosco."
        }
      ]
    }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Templates de Mensagens</h3>
      {templates.map((category, categoryIndex) => (
        <Card key={categoryIndex}>
          <CardHeader>
            <CardTitle className="text-base">{category.category}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {category.templates.map((template, templateIndex) => (
                <div key={templateIndex} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <p className="font-medium text-sm">{template.title}</p>
                    <p className="text-xs text-gray-600 truncate max-w-xs">{template.message}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSelectTemplate(template.message)}
                  >
                    <MessageSquare className="h-3 w-3 mr-1" />
                    Usar
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MessageTemplates;
