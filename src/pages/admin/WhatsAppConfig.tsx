
import React, { useState } from "react";
import AdminLayout from "@/components/layouts/AdminLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, Send, Calendar, BarChart3, Plus, Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mensagens pré-programadas de exemplo
const mockScheduledMessages = [
  {
    id: "1",
    title: "Lembrete de Consulta",
    message: "Olá {nome}, lembrando da sua consulta amanhã às {horario} com {profissional}. Confirma sua presença?",
    trigger: "1 dia antes",
    status: "Ativo"
  },
  {
    id: "2",
    title: "Agradecimento após consulta",
    message: "Olá {nome}, esperamos que a consulta de hoje com {profissional} tenha sido produtiva. Qualquer dúvida estamos à disposição!",
    trigger: "2 horas depois",
    status: "Ativo"
  },
  {
    id: "3",
    title: "Confirmação de agendamento",
    message: "Olá {nome}, sua consulta com {profissional} foi agendada para {data} às {horario}. Agradecemos a preferência!",
    trigger: "Imediato",
    status: "Ativo"
  },
  {
    id: "4",
    title: "Lembrete de pagamento",
    message: "Olá {nome}, o pagamento referente à sessão de {data} está pendente. Poderia regularizar em até 3 dias? Obrigado!",
    trigger: "5 dias depois",
    status: "Inativo"
  }
];

// Campanhas de exemplo
const mockCampaigns = [
  {
    id: "1",
    title: "Desconto Pacote de Sessões",
    message: "Olá {nome}, que tal aproveitar nosso pacote especial com 10% de desconto para 5 sessões? Válido somente esta semana!",
    segment: "Clientes inativos (30+ dias)",
    scheduledDate: "15/05/2025",
    status: "Agendada"
  },
  {
    id: "2",
    title: "Novos serviços",
    message: "Olá {nome}, temos novos serviços disponíveis como terapia em grupo e avaliação psicológica completa. Saiba mais acessando nosso site!",
    segment: "Todos os clientes",
    scheduledDate: "20/05/2025",
    status: "Rascunho"
  }
];

const WhatsAppConfig: React.FC = () => {
  const [activeTab, setActiveTab] = useState("configuracao");
  const [whatsappNumber, setWhatsappNumber] = useState("+55 11 98765-4321");
  const [isConnected, setIsConnected] = useState(true);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold tracking-tight">Configurações de WhatsApp</h2>
          <div className="flex items-center space-x-2">
            <span className={`inline-flex h-3 w-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
            <span className="text-sm font-medium">{isConnected ? 'Conectado' : 'Desconectado'}</span>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="configuracao">
              <MessageCircle className="h-4 w-4 mr-2" />
              Configuração
            </TabsTrigger>
            <TabsTrigger value="mensagens">
              <Calendar className="h-4 w-4 mr-2" />
              Mensagens
            </TabsTrigger>
            <TabsTrigger value="campanhas">
              <Send className="h-4 w-4 mr-2" />
              Campanhas
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="configuracao" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuração do WhatsApp</CardTitle>
                <CardDescription>
                  Configure o número de WhatsApp oficial da plataforma.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="whatsapp-number">Número de WhatsApp</Label>
                  <Input 
                    id="whatsapp-number" 
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatsapp-name">Nome de exibição</Label>
                  <Input 
                    id="whatsapp-name" 
                    defaultValue="Mindro - Psicólogos"
                  />
                </div>
                <div className="flex items-center space-x-2 pt-2">
                  <Switch id="auto-reply" defaultChecked />
                  <Label htmlFor="auto-reply">Ativar resposta automática para novas mensagens</Label>
                </div>
                <div className="space-y-2 pt-2">
                  <Label htmlFor="auto-reply-message">Mensagem de resposta automática</Label>
                  <Textarea 
                    id="auto-reply-message" 
                    defaultValue="Olá! Obrigado por entrar em contato com a Mindro. Em breve um de nossos atendentes irá te responder."
                  />
                </div>
                <div className="pt-4">
                  <Button variant={isConnected ? "outline" : "default"} onClick={() => setIsConnected(!isConnected)}>
                    {isConnected ? "Desconectar WhatsApp" : "Conectar WhatsApp"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Configurações Avançadas</CardTitle>
                <CardDescription>
                  Ajustes avançados para o serviço de WhatsApp.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch id="notification" defaultChecked />
                  <Label htmlFor="notification">Receber notificações por e-mail</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="analytics" defaultChecked />
                  <Label htmlFor="analytics">Coletar métricas de engajamento</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="batch" />
                  <Label htmlFor="batch">Permitir envios em lotes maiores que 50 mensagens</Label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="mensagens" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Mensagens Programadas</CardTitle>
                  <CardDescription>
                    Configure mensagens automáticas de acordo com eventos no sistema.
                  </CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Mensagem
                </Button>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Título</TableHead>
                        <TableHead className="hidden md:table-cell">Mensagem</TableHead>
                        <TableHead>Gatilho</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-[80px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockScheduledMessages.map((message) => (
                        <TableRow key={message.id}>
                          <TableCell className="font-medium">{message.title}</TableCell>
                          <TableCell className="hidden md:table-cell max-w-xs truncate">{message.message}</TableCell>
                          <TableCell>{message.trigger}</TableCell>
                          <TableCell>
                            <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                              ${message.status === "Ativo" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                            >
                              {message.status}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Modelos de Mensagem</CardTitle>
                <CardDescription>Variáveis disponíveis: {"{nome}"}, {"{profissional}"}, {"{data}"}, {"{horario}"}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-md p-3 space-y-2">
                    <p className="font-medium">Confirmação de agendamento</p>
                    <p className="text-sm text-gray-600">Olá {"{nome}"}, sua consulta com {"{profissional}"} foi agendada para {"{data}"} às {"{horario}"}. Agradecemos a preferência!</p>
                  </div>
                  <div className="border rounded-md p-3 space-y-2">
                    <p className="font-medium">Lembrete de consulta</p>
                    <p className="text-sm text-gray-600">Olá {"{nome}"}, lembrando da sua consulta amanhã às {"{horario}"} com {"{profissional}"}. Confirma sua presença?</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="campanhas" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Campanhas</CardTitle>
                  <CardDescription>
                    Gerencie campanhas de mensagens para seus clientes.
                  </CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Campanha
                </Button>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Título</TableHead>
                        <TableHead className="hidden md:table-cell">Segmento</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-[80px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockCampaigns.map((campaign) => (
                        <TableRow key={campaign.id}>
                          <TableCell className="font-medium">{campaign.title}</TableCell>
                          <TableCell className="hidden md:table-cell">{campaign.segment}</TableCell>
                          <TableCell>{campaign.scheduledDate}</TableCell>
                          <TableCell>
                            <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                              ${campaign.status === "Agendada" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}`}
                            >
                              {campaign.status}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Métricas de Campanhas</CardTitle>
                <CardDescription>
                  Estatísticas de desempenho das campanhas enviadas.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[220px] flex items-center justify-center bg-slate-50 dark:bg-slate-900/50 rounded-md">
                  <BarChart3 className="h-16 w-16 text-slate-300" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default WhatsAppConfig;
