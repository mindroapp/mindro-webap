
import React, { useState } from "react";
import AdminLayout from "@/components/layouts/AdminLayout";
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
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Dados fictícios de solicitações de suporte
const mockSupportRequests = [
  {
    id: "sr1",
    clientId: "1",
    clientName: "Clínica Bem Estar",
    subject: "Problema com agendamento",
    description: "Não consigo criar novos agendamentos para os pacientes.",
    status: "Em Andamento",
    priority: "Alta",
    createdAt: "10/04/2025 14:32",
    lastUpdate: "12/04/2025 09:15",
    assignedTo: "Suporte Técnico",
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
    id: "sr2",
    clientId: "3",
    clientName: "Instituto Saúde Mental",
    subject: "Dúvida sobre relatórios",
    description: "Preciso saber como exportar relatórios em formato Excel.",
    status: "Aberto",
    priority: "Média",
    createdAt: "12/04/2025 10:20",
    lastUpdate: "12/04/2025 10:20",
    assignedTo: null,
    messages: [
      {
        id: "m1",
        sender: "cliente",
        message: "Preciso saber como exportar relatórios em formato Excel. Não encontrei esta opção no sistema.",
        timestamp: "12/04/2025 10:20"
      }
    ]
  },
  {
    id: "sr3",
    clientId: "2",
    clientName: "Espaço Mente Sã",
    subject: "Problema com pagamento",
    description: "Fui cobrado duas vezes na mensalidade deste mês.",
    status: "Em Andamento",
    priority: "Alta",
    createdAt: "08/04/2025 16:45",
    lastUpdate: "11/04/2025 14:30",
    assignedTo: "Financeiro",
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
    clientId: "5",
    clientName: "Clínica Equilíbrio",
    subject: "Solicitação de novo recurso",
    description: "Gostaria de sugerir a inclusão de um campo para CID nos prontuários.",
    status: "Resolvido",
    priority: "Baixa",
    createdAt: "05/04/2025 11:10",
    lastUpdate: "08/04/2025 16:20",
    assignedTo: "Desenvolvimento",
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
  },
  {
    id: "sr5",
    clientId: "4",
    clientName: "Consultório Dra. Márcia",
    subject: "Problema com acesso",
    description: "Não consigo acessar o sistema desde ontem.",
    status: "Resolvido",
    priority: "Crítica",
    createdAt: "11/04/2025 08:30",
    lastUpdate: "11/04/2025 11:45",
    assignedTo: "Suporte Técnico",
    messages: [
      {
        id: "m1",
        sender: "cliente",
        message: "Não consigo acessar o sistema desde ontem. Recebo uma mensagem de erro ao fazer login.",
        timestamp: "11/04/2025 08:30"
      },
      {
        id: "m2",
        sender: "suporte",
        message: "Bom dia! Vamos verificar imediatamente. Você poderia nos informar qual mensagem de erro aparece?",
        timestamp: "11/04/2025 08:45"
      },
      {
        id: "m3",
        sender: "cliente",
        message: "Aparece 'Erro de autenticação: credenciais inválidas'",
        timestamp: "11/04/2025 09:00"
      },
      {
        id: "m4",
        sender: "suporte",
        message: "Identificamos o problema. Sua senha foi alterada automaticamente por motivos de segurança. Enviamos uma nova senha temporária para seu e-mail.",
        timestamp: "11/04/2025 09:30"
      },
      {
        id: "m5",
        sender: "cliente",
        message: "Recebi a senha e consegui acessar. Muito obrigada pela ajuda rápida!",
        timestamp: "11/04/2025 11:45"
      }
    ]
  }
];

const SupportRequests: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("todos");
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [updateStatus, setUpdateStatus] = useState<string | null>(null);
  const { toast } = useToast();

  const filteredRequests = mockSupportRequests.filter((request) => {
    const matchesSearch = 
      request.clientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      request.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === "todos") return matchesSearch;
    if (activeTab === "abertos") return matchesSearch && request.status === "Aberto";
    if (activeTab === "andamento") return matchesSearch && request.status === "Em Andamento";
    if (activeTab === "resolvidos") return matchesSearch && request.status === "Resolvido";
    
    return matchesSearch;
  });

  const handleSelectRequest = (request: any) => {
    setSelectedRequest(request);
    setIsDetailOpen(true);
    setUpdateStatus(request.status);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    // Na vida real, aqui enviaríamos a mensagem para a API
    toast({
      title: "Mensagem enviada",
      description: "Sua resposta foi enviada ao cliente com sucesso."
    });
    
    setNewMessage("");
  };

  const handleUpdateStatus = () => {
    if (!updateStatus || updateStatus === selectedRequest.status) return;
    
    // Na vida real, aqui atualizaríamos o status na API
    toast({
      title: "Status atualizado",
      description: `Chamado atualizado para "${updateStatus}" com sucesso.`
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Crítica":
        return "bg-red-100 text-red-800";
      case "Alta":
        return "bg-orange-100 text-orange-800";
      case "Média":
        return "bg-amber-100 text-amber-800";
      case "Baixa":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
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
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:justify-between md:items-center">
          <h2 className="text-3xl font-bold tracking-tight">Gestão de Suporte</h2>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Solicitações de Suporte</CardTitle>
            <CardDescription>
              Gerencie todas as solicitações de suporte dos clientes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Buscar solicitações..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Tabs 
                  value={activeTab} 
                  onValueChange={setActiveTab}
                  className="w-full md:w-auto"
                >
                  <TabsList className="grid grid-cols-4 w-full md:w-auto">
                    <TabsTrigger value="todos">Todos</TabsTrigger>
                    <TabsTrigger value="abertos">Abertos</TabsTrigger>
                    <TabsTrigger value="andamento">Em Andamento</TabsTrigger>
                    <TabsTrigger value="resolvidos">Resolvidos</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Assunto</TableHead>
                      <TableHead className="hidden md:table-cell">Prioridade</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden md:table-cell">Última Atualização</TableHead>
                      <TableHead className="hidden md:table-cell">Responsável</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRequests.map((request) => (
                      <TableRow 
                        key={request.id}
                        className="cursor-pointer hover:bg-muted/80"
                        onClick={() => handleSelectRequest(request)}
                      >
                        <TableCell className="font-medium">{request.clientName}</TableCell>
                        <TableCell>{request.subject}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge variant="outline" className={getPriorityColor(request.priority)}>
                            {request.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getStatusColor(request.status)}>
                            {request.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{request.lastUpdate}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          {request.assignedTo || "Não atribuído"}
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredRequests.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          Nenhuma solicitação de suporte encontrada.
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
          {selectedRequest && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">
                  {selectedRequest.subject}
                </DialogTitle>
                <DialogDescription className="text-sm">
                  Solicitação de <span className="font-medium">{selectedRequest.clientName}</span> • 
                  Criado em {selectedRequest.createdAt}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">Status</Label>
                    <div className="mt-1">
                      <select
                        className="w-full border rounded-md p-2"
                        value={updateStatus || selectedRequest.status}
                        onChange={(e) => setUpdateStatus(e.target.value)}
                      >
                        <option value="Aberto">Aberto</option>
                        <option value="Em Andamento">Em Andamento</option>
                        <option value="Resolvido">Resolvido</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-xs text-muted-foreground">Prioridade</Label>
                    <div className="mt-1">
                      <Badge variant="outline" className={getPriorityColor(selectedRequest.priority)}>
                        {selectedRequest.priority}
                      </Badge>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-xs text-muted-foreground">Responsável</Label>
                    <div className="mt-1 font-medium">
                      {selectedRequest.assignedTo || "Não atribuído"}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Descrição</Label>
                  <div className="p-3 bg-muted rounded-md">
                    {selectedRequest.description}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label>Histórico de Mensagens</Label>
                    <Button variant="outline" size="sm" onClick={handleUpdateStatus} disabled={!updateStatus || updateStatus === selectedRequest.status}>
                      Atualizar Status
                    </Button>
                  </div>
                  
                  <div className="space-y-4 max-h-[300px] overflow-y-auto p-2">
                    {selectedRequest.messages.map((message: any) => (
                      <div 
                        key={message.id} 
                        className={`p-3 rounded-lg ${
                          message.sender === "suporte" 
                            ? "bg-blue-50 dark:bg-blue-950/30 ml-8" 
                            : "bg-gray-50 dark:bg-gray-800/50 mr-8"
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium">
                            {message.sender === "suporte" ? "Suporte" : selectedRequest.clientName}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {message.timestamp}
                          </span>
                        </div>
                        <p>{message.message}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-2 pt-4">
                    <Label htmlFor="reply">Responder</Label>
                    <Textarea
                      id="reply"
                      placeholder="Digite sua resposta..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
                  Fechar
                </Button>
                <Button onClick={handleSendMessage} disabled={!newMessage.trim()} className="bg-psycho-primary hover:bg-psycho-primary/90">
                  Enviar Resposta
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default SupportRequests;
