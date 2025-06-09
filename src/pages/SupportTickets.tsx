
import React, { useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import SupportRequestForm from "@/components/SupportRequestForm";
import { useToast } from "@/hooks/use-toast";

// Dados fictícios de solicitações de suporte para o cliente logado
const mockClientTickets = [
  {
    id: "sr1",
    subject: "Problema com agendamento",
    description: "Não consigo criar novos agendamentos para os pacientes.",
    status: "Em Andamento",
    priority: "Alta",
    createdAt: "10/04/2025",
    lastUpdate: "12/04/2025",
    messages: [
      {
        id: "m1",
        sender: "cliente",
        message: "Não consigo criar novos agendamentos para os pacientes. O sistema mostra erro.",
        timestamp: "10/04/2025 14:32"
      },
      {
        id: "m2",
        sender: "suporte",
        message: "Olá! Estamos verificando o problema. Você poderia nos enviar um print da tela de erro?",
        timestamp: "10/04/2025 15:45"
      },
      {
        id: "m3",
        sender: "cliente",
        message: "Claro, segue o print anexado.",
        timestamp: "11/04/2025 09:10"
      },
      {
        id: "m4",
        sender: "suporte",
        message: "Obrigado! Identificamos o problema e estamos trabalhando na correção. Deve ser resolvido em breve.",
        timestamp: "12/04/2025 09:15"
      }
    ]
  },
  {
    id: "sr3",
    subject: "Problema com pagamento",
    description: "Fui cobrado duas vezes na mensalidade deste mês.",
    status: "Em Andamento",
    priority: "Alta",
    createdAt: "08/04/2025",
    lastUpdate: "11/04/2025",
    messages: [
      {
        id: "m1",
        sender: "cliente",
        message: "Fui cobrado duas vezes na mensalidade deste mês. Preciso de um estorno urgente.",
        timestamp: "08/04/2025 16:45"
      },
      {
        id: "m2",
        sender: "suporte",
        message: "Olá! Pedimos desculpas pelo transtorno. Estamos verificando em nosso sistema financeiro.",
        timestamp: "09/04/2025 09:30"
      },
      {
        id: "m3",
        sender: "suporte",
        message: "Confirmamos a duplicidade na cobrança. O estorno será realizado em até 7 dias úteis.",
        timestamp: "11/04/2025 14:30"
      }
    ]
  },
  {
    id: "sr4",
    subject: "Solicitação de novo recurso",
    description: "Gostaria de sugerir a inclusão de um campo para CID nos prontuários.",
    status: "Resolvido",
    priority: "Baixa",
    createdAt: "05/04/2025",
    lastUpdate: "08/04/2025",
    messages: [
      {
        id: "m1",
        sender: "cliente",
        message: "Gostaria de sugerir a inclusão de um campo para CID nos prontuários dos pacientes.",
        timestamp: "05/04/2025 11:10"
      },
      {
        id: "m2",
        sender: "suporte",
        message: "Obrigado pela sugestão! Vamos avaliar com nossa equipe de produto.",
        timestamp: "05/04/2025 15:45"
      },
      {
        id: "m3",
        sender: "suporte",
        message: "Sua sugestão foi aprovada! O recurso será incluído na próxima atualização do sistema, prevista para o final do mês.",
        timestamp: "08/04/2025 16:20"
      }
    ]
  }
];

const SupportTickets: React.FC = () => {
  const [activeTab, setActiveTab] = useState("todos");
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const { toast } = useToast();

  const filteredTickets = mockClientTickets.filter((ticket) => {
    if (activeTab === "todos") return true;
    if (activeTab === "abertos") return ticket.status === "Aberto";
    if (activeTab === "andamento") return ticket.status === "Em Andamento";
    if (activeTab === "resolvidos") return ticket.status === "Resolvido";
    return true;
  });

  const handleSelectTicket = (ticket: any) => {
    setSelectedTicket(ticket);
    setIsDetailOpen(true);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    // Na vida real, aqui enviaríamos a mensagem para a API
    toast({
      title: "Mensagem enviada",
      description: "Sua mensagem foi enviada com sucesso."
    });
    
    setNewMessage("");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Aberto":
        return "bg-blue-100 text-blue-800";
      case "Em Andamento":
        return "bg-amber-100 text-amber-800";
      case "Resolvido":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:justify-between md:items-center">
          <h2 className="text-3xl font-bold tracking-tight">Suporte</h2>
          <SupportRequestForm 
            triggerButton={
              <Button className="bg-psycho-primary hover:bg-psycho-primary/90">Nova Solicitação</Button>
            }
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Minhas Solicitações</CardTitle>
            <CardDescription>
              Acompanhe o status de todas as suas solicitações de suporte.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Tabs 
                value={activeTab} 
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid grid-cols-4 w-full md:w-auto">
                  <TabsTrigger value="todos">Todos</TabsTrigger>
                  <TabsTrigger value="abertos">Abertos</TabsTrigger>
                  <TabsTrigger value="andamento">Em Andamento</TabsTrigger>
                  <TabsTrigger value="resolvidos">Resolvidos</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Assunto</TableHead>
                      <TableHead className="hidden md:table-cell">Data</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden md:table-cell">Atualização</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTickets.map((ticket) => (
                      <TableRow 
                        key={ticket.id}
                        className="cursor-pointer hover:bg-muted/80"
                        onClick={() => handleSelectTicket(ticket)}
                      >
                        <TableCell className="font-medium">{ticket.subject}</TableCell>
                        <TableCell className="hidden md:table-cell">{ticket.createdAt}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getStatusColor(ticket.status)}>
                            {ticket.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{ticket.lastUpdate}</TableCell>
                      </TableRow>
                    ))}
                    {filteredTickets.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                          Nenhuma solicitação encontrada.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          {selectedTicket && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">
                  {selectedTicket.subject}
                </DialogTitle>
                <DialogDescription className="text-sm">
                  Criado em {selectedTicket.createdAt} • 
                  <Badge variant="outline" className={`ml-2 ${getStatusColor(selectedTicket.status)}`}>
                    {selectedTicket.status}
                  </Badge>
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6 py-4">
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Descrição</div>
                  <div className="p-3 bg-muted rounded-md">
                    {selectedTicket.description}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="text-sm text-muted-foreground">Histórico de Mensagens</div>
                  
                  <div className="space-y-4 max-h-[300px] overflow-y-auto p-2">
                    {selectedTicket.messages.map((message: any) => (
                      <div 
                        key={message.id} 
                        className={`p-3 rounded-lg ${
                          message.sender === "cliente" 
                            ? "bg-blue-50 dark:bg-blue-950/30 ml-8" 
                            : "bg-gray-50 dark:bg-gray-800/50 mr-8"
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium">
                            {message.sender === "cliente" ? "Você" : "Suporte"}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {message.timestamp}
                          </span>
                        </div>
                        <p>{message.message}</p>
                      </div>
                    ))}
                  </div>
                  
                  {selectedTicket.status !== "Resolvido" && (
                    <div className="space-y-2 pt-4">
                      <div className="text-sm text-muted-foreground">Responder</div>
                      <Textarea
                        placeholder="Digite sua mensagem..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        rows={3}
                      />
                    </div>
                  )}
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
                  Fechar
                </Button>
                {selectedTicket.status !== "Resolvido" && (
                  <Button 
                    onClick={handleSendMessage} 
                    disabled={!newMessage.trim()} 
                    className="bg-psycho-primary hover:bg-psycho-primary/90"
                  >
                    Enviar Mensagem
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default SupportTickets;
