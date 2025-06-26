
import React, { useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Send, Upload, MessageCircle, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data para tickets existentes
const existingTickets = [
  {
    id: 1,
    type: "Técnico",
    priority: "Alta",
    subject: "Problema na conexão WhatsApp",
    status: "Em Andamento",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-16"
  },
  {
    id: 2,
    type: "Billing",
    priority: "Média",
    subject: "Dúvida sobre cobrança",
    status: "Resolvido",
    createdAt: "2024-01-10",
    updatedAt: "2024-01-12"
  }
];

const ProfessionalSupport: React.FC = () => {
  const { toast } = useToast();
  const [ticketData, setTicketData] = useState({
    type: "",
    priority: "",
    subject: "",
    description: "",
    attachments: [] as File[]
  });

  const handleSubmitTicket = () => {
    if (!ticketData.type || !ticketData.priority || !ticketData.subject || !ticketData.description) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    // Simular envio do ticket
    toast({
      title: "Ticket criado",
      description: "Seu chamado foi criado com sucesso! Nossa equipe entrará em contato em breve.",
    });

    // Limpar formulário
    setTicketData({
      type: "",
      priority: "",
      subject: "",
      description: "",
      attachments: []
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setTicketData({
      ...ticketData,
      attachments: [...ticketData.attachments, ...files]
    });
    
    toast({
      title: "Arquivos adicionados",
      description: `${files.length} arquivo(s) adicionado(s) com sucesso!`,
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Em Andamento":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "Resolvido":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Em Andamento":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Em Andamento</Badge>;
      case "Resolvido":
        return <Badge variant="default" className="bg-green-100 text-green-800">Resolvido</Badge>;
      default:
        return <Badge variant="outline">Pendente</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "Alta":
        return <Badge variant="destructive">Alta</Badge>;
      case "Média":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Média</Badge>;
      case "Baixa":
        return <Badge variant="outline">Baixa</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Suporte Técnico
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Abra chamados e acompanhe o status das suas solicitações
          </p>
        </div>

        <Tabs defaultValue="new-ticket" className="space-y-4">
          <TabsList>
            <TabsTrigger value="new-ticket" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Novo Chamado
            </TabsTrigger>
            <TabsTrigger value="my-tickets" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Meus Chamados ({existingTickets.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="new-ticket">
            <Card>
              <CardHeader>
                <CardTitle>Abrir Novo Chamado</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ticket-type">Tipo do Chamado *</Label>
                    <Select value={ticketData.type} onValueChange={(value) => setTicketData({...ticketData, type: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Técnico">Problema Técnico</SelectItem>
                        <SelectItem value="Billing">Financeiro/Cobrança</SelectItem>
                        <SelectItem value="Feature">Solicitação de Funcionalidade</SelectItem>
                        <SelectItem value="Account">Problemas na Conta</SelectItem>
                        <SelectItem value="General">Dúvida Geral</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priority">Prioridade *</Label>
                    <Select value={ticketData.priority} onValueChange={(value) => setTicketData({...ticketData, priority: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a prioridade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Baixa">Baixa</SelectItem>
                        <SelectItem value="Média">Média</SelectItem>
                        <SelectItem value="Alta">Alta</SelectItem>
                        <SelectItem value="Crítica">Crítica</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Assunto *</Label>
                  <Input
                    id="subject"
                    placeholder="Descreva brevemente o problema"
                    value={ticketData.subject}
                    onChange={(e) => setTicketData({...ticketData, subject: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição Detalhada *</Label>
                  <Textarea
                    id="description"
                    placeholder="Descreva o problema em detalhes, incluindo passos para reproduzir se necessário"
                    rows={6}
                    value={ticketData.description}
                    onChange={(e) => setTicketData({...ticketData, description: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="attachments">Anexos (Imagens ou Vídeos)</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="attachments"
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      onChange={handleFileUpload}
                      className="flex-1"
                    />
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Adicionar
                    </Button>
                  </div>
                  {ticketData.attachments.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600 mb-2">Arquivos selecionados:</p>
                      <ul className="space-y-1">
                        {ticketData.attachments.map((file, index) => (
                          <li key={index} className="text-sm text-green-600 flex items-center gap-2">
                            <CheckCircle className="h-3 w-3" />
                            {file.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <Button onClick={handleSubmitTicket} className="flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  Enviar Chamado
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="my-tickets">
            <Card>
              <CardHeader>
                <CardTitle>Meus Chamados</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Assunto</TableHead>
                      <TableHead>Prioridade</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Criado em</TableHead>
                      <TableHead>Atualizado em</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {existingTickets.map((ticket) => (
                      <TableRow key={ticket.id}>
                        <TableCell className="font-medium">#{ticket.id}</TableCell>
                        <TableCell>{ticket.type}</TableCell>
                        <TableCell>{ticket.subject}</TableCell>
                        <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(ticket.status)}
                            {getStatusBadge(ticket.status)}
                          </div>
                        </TableCell>
                        <TableCell>{ticket.createdAt}</TableCell>
                        <TableCell>{ticket.updatedAt}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default ProfessionalSupport;
