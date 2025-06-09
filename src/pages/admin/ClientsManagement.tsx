
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, MoreHorizontal, Plus, Search, Trash2 } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";

// Dados fictícios de clientes
const mockClients = [
  {
    id: "1",
    name: "Clínica Bem Estar",
    email: "contato@bemestar.com",
    plan: "Premium",
    professionals: 8,
    status: "Ativo",
    lastPayment: "12/04/2025",
  },
  {
    id: "2",
    name: "Espaço Mente Sã",
    email: "admin@mentesa.com",
    plan: "Basic",
    professionals: 3,
    status: "Ativo",
    lastPayment: "05/04/2025",
  },
  {
    id: "3",
    name: "Instituto Saúde Mental",
    email: "contato@ism.org",
    plan: "Premium",
    professionals: 12,
    status: "Inadimplente",
    lastPayment: "02/03/2025",
  },
  {
    id: "4",
    name: "Consultório Dra. Márcia",
    email: "marcia@consultorio.com",
    plan: "Basic",
    professionals: 1,
    status: "Ativo",
    lastPayment: "20/04/2025",
  },
  {
    id: "5",
    name: "Clínica Equilíbrio",
    email: "atendimento@equilibrio.com.br",
    plan: "Premium",
    professionals: 6,
    status: "Suspenso",
    lastPayment: "15/03/2025",
  },
];

// Dados fictícios de pagamentos
const mockPayments = {
  "1": [
    { id: "p1", date: "12/04/2025", value: "R$ 399,00", status: "Pago", invoice: "INV-2025-0412" },
    { id: "p2", date: "12/03/2025", value: "R$ 399,00", status: "Pago", invoice: "INV-2025-0312" },
    { id: "p3", date: "12/02/2025", value: "R$ 399,00", status: "Pago", invoice: "INV-2025-0212" },
    { id: "p4", date: "12/05/2025", value: "R$ 399,00", status: "A Vencer", invoice: "INV-2025-0512" },
  ],
  "2": [
    { id: "p1", date: "05/04/2025", value: "R$ 199,00", status: "Pago", invoice: "INV-2025-0405" },
    { id: "p2", date: "05/03/2025", value: "R$ 199,00", status: "Pago", invoice: "INV-2025-0305" },
    { id: "p3", date: "05/05/2025", value: "R$ 199,00", status: "A Vencer", invoice: "INV-2025-0505" },
  ],
  "3": [
    { id: "p1", date: "02/01/2025", value: "R$ 399,00", status: "Pago", invoice: "INV-2025-0102" },
    { id: "p2", date: "02/02/2025", value: "R$ 399,00", status: "Pago", invoice: "INV-2025-0202" },
    { id: "p3", date: "02/03/2025", value: "R$ 399,00", status: "Vencido", invoice: "INV-2025-0302" },
    { id: "p4", date: "02/04/2025", value: "R$ 399,00", status: "Vencido", invoice: "INV-2025-0402" },
  ],
  "4": [
    { id: "p1", date: "20/04/2025", value: "R$ 99,00", status: "Pago", invoice: "INV-2025-0420" },
    { id: "p2", date: "20/03/2025", value: "R$ 99,00", status: "Pago", invoice: "INV-2025-0320" },
    { id: "p3", date: "20/05/2025", value: "R$ 99,00", status: "A Vencer", invoice: "INV-2025-0520" },
  ],
  "5": [
    { id: "p1", date: "15/01/2025", value: "R$ 399,00", status: "Pago", invoice: "INV-2025-0115" },
    { id: "p2", date: "15/02/2025", value: "R$ 399,00", status: "Pago", invoice: "INV-2025-0215" },
    { id: "p3", date: "15/03/2025", value: "R$ 399,00", status: "Vencido", invoice: "INV-2025-0315" },
  ],
};

// Detalhes fictícios de assinatura
const mockSubscriptionDetails = {
  "1": { 
    status: "Ativa", 
    planName: "Premium", 
    startDate: "12/01/2025", 
    renewalDate: "12/05/2025",
    paymentMethod: "Cartão de Crédito (final 4567)",
    professionals: 8,
    features: ["Agendamento ilimitado", "Suporte prioritário", "Relatórios avançados", "Integrações com sistemas externos"]
  },
  "2": { 
    status: "Ativa", 
    planName: "Basic", 
    startDate: "05/01/2025", 
    renewalDate: "05/05/2025",
    paymentMethod: "Cartão de Crédito (final 8901)",
    professionals: 3,
    features: ["Até 50 agendamentos/mês", "Suporte por e-mail", "Relatórios básicos"]
  },
  "3": { 
    status: "Inadimplente", 
    planName: "Premium", 
    startDate: "02/01/2025", 
    renewalDate: "02/05/2025",
    paymentMethod: "Boleto Bancário",
    professionals: 12,
    features: ["Agendamento ilimitado", "Suporte prioritário", "Relatórios avançados", "Integrações com sistemas externos"]
  },
  "4": { 
    status: "Ativa", 
    planName: "Basic", 
    startDate: "20/01/2025", 
    renewalDate: "20/05/2025",
    paymentMethod: "Cartão de Crédito (final 2345)",
    professionals: 1,
    features: ["Até 50 agendamentos/mês", "Suporte por e-mail", "Relatórios básicos"]
  },
  "5": { 
    status: "Suspensa", 
    planName: "Premium", 
    startDate: "15/01/2025", 
    renewalDate: "15/04/2025",
    paymentMethod: "Boleto Bancário",
    professionals: 6,
    features: ["Agendamento ilimitado", "Suporte prioritário", "Relatórios avançados", "Integrações com sistemas externos"]
  }
};

const ClientsManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("todos");
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [clientActionOpen, setClientActionOpen] = useState<string | null>(null);
  const [billingTab, setBillingTab] = useState<string>("payments");
  const { toast } = useToast();

  const filteredClients = mockClients.filter((client) => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        client.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === "todos") return matchesSearch;
    if (activeTab === "ativos") return matchesSearch && client.status === "Ativo";
    if (activeTab === "inadimplentes") return matchesSearch && client.status === "Inadimplente";
    if (activeTab === "suspensos") return matchesSearch && client.status === "Suspenso";
    
    return matchesSearch;
  });

  const handleAddClient = () => {
    setSelectedClient(null);
    setIsAddClientOpen(true);
  };

  const handleEditClient = (client: any) => {
    setSelectedClient(client);
    setIsAddClientOpen(true);
    setClientActionOpen(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pago":
        return "bg-green-100 text-green-800";
      case "A Vencer":
        return "bg-blue-100 text-blue-800";
      case "Vencido":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getSubscriptionStatusColor = (status: string) => {
    switch (status) {
      case "Ativa":
        return "bg-green-100 text-green-800";
      case "Inadimplente":
        return "bg-amber-100 text-amber-800";
      case "Suspensa":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handlePaymentAction = (action: string, paymentId: string) => {
    toast({
      title: "Ação realizada",
      description: `Ação "${action}" no pagamento ${paymentId} realizada com sucesso.`,
    });
  };

  const handleEmitInvoice = () => {
    toast({
      title: "Fatura emitida",
      description: "Uma nova fatura foi emitida para o cliente.",
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:justify-between md:items-center">
          <h2 className="text-3xl font-bold tracking-tight">Gestão de Clientes</h2>
          <Button onClick={handleAddClient} className="bg-psycho-primary hover:bg-psycho-primary/90">
            <Plus className="mr-2 h-4 w-4" /> Novo Cliente
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Clientes</CardTitle>
            <CardDescription>
              Gerencie todos os clientes da plataforma Mindro.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Buscar clientes..."
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
                    <TabsTrigger value="ativos">Ativos</TabsTrigger>
                    <TabsTrigger value="inadimplentes">Inadimplentes</TabsTrigger>
                    <TabsTrigger value="suspensos">Suspensos</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead className="hidden md:table-cell">Email</TableHead>
                      <TableHead className="hidden md:table-cell">Plano</TableHead>
                      <TableHead className="hidden md:table-cell">Profissionais</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden md:table-cell">Último Pagamento</TableHead>
                      <TableHead className="w-[80px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredClients.map((client) => (
                      <TableRow key={client.id}>
                        <TableCell className="font-medium">{client.name}</TableCell>
                        <TableCell className="hidden md:table-cell">{client.email}</TableCell>
                        <TableCell className="hidden md:table-cell">{client.plan}</TableCell>
                        <TableCell className="hidden md:table-cell">{client.professionals}</TableCell>
                        <TableCell>
                          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                            ${
                              client.status === "Ativo"
                                ? "bg-green-100 text-green-800"
                                : client.status === "Inadimplente"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {client.status}
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{client.lastPayment}</TableCell>
                        <TableCell>
                          <DropdownMenu open={clientActionOpen === client.id} onOpenChange={(open) => {
                            setClientActionOpen(open ? client.id : null);
                          }}>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditClient(client)}>
                                <Edit className="mr-2 h-4 w-4" />
                                <span>Editar</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Excluir</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredClients.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          Nenhum cliente encontrado.
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

      <Dialog open={isAddClientOpen} onOpenChange={setIsAddClientOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {selectedClient ? "Editar Cliente" : "Adicionar Novo Cliente"}
            </DialogTitle>
            <DialogDescription>
              {selectedClient
                ? "Atualize as informações do cliente abaixo."
                : "Preencha as informações do novo cliente."}
            </DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="info">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="info">Informações</TabsTrigger>
              <TabsTrigger value="billing">Financeiro</TabsTrigger>
              <TabsTrigger value="users">Usuários</TabsTrigger>
            </TabsList>
            <TabsContent value="info" className="space-y-4 py-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome da Clínica/Consultório</Label>
                  <Input
                    id="name"
                    defaultValue={selectedClient?.name || ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email de Contato</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue={selectedClient?.email || ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    defaultValue={selectedClient?.phone || ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Endereço</Label>
                  <Input
                    id="address"
                    defaultValue={selectedClient?.address || ""}
                  />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="billing" className="space-y-4 py-4">
              {selectedClient && (
                <Tabs value={billingTab} onValueChange={setBillingTab} className="w-full">
                  <TabsList className="w-full grid grid-cols-2">
                    <TabsTrigger value="payments">Pagamentos</TabsTrigger>
                    <TabsTrigger value="subscription">Assinatura</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="payments" className="mt-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-semibold">Histórico de Pagamentos</h4>
                      <div className="space-x-2">
                        <Button variant="outline" size="sm" onClick={handleEmitInvoice}>
                          Emitir Fatura
                        </Button>
                        <Button size="sm" className="bg-psycho-primary hover:bg-psycho-primary/90">
                          Registrar Pagamento
                        </Button>
                      </div>
                    </div>
                    
                    <div className="rounded-md border overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Data</TableHead>
                            <TableHead>Valor</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Fatura</TableHead>
                            <TableHead className="w-[100px]">Ações</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedClient && mockPayments[selectedClient.id]?.map((payment) => (
                            <TableRow key={payment.id}>
                              <TableCell>{payment.date}</TableCell>
                              <TableCell>{payment.value}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className={getStatusColor(payment.status)}>
                                  {payment.status}
                                </Badge>
                              </TableCell>
                              <TableCell>{payment.invoice}</TableCell>
                              <TableCell>
                                <div className="flex space-x-1">
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={() => handlePaymentAction("download", payment.id)}
                                    className="h-8 w-8"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-download"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                                  </Button>
                                  {payment.status === "Vencido" && (
                                    <Button 
                                      variant="ghost" 
                                      size="icon"
                                      onClick={() => handlePaymentAction("notificar", payment.id)}
                                      className="h-8 w-8"
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bell"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
                                    </Button>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                          {(!selectedClient || !mockPayments[selectedClient.id] || mockPayments[selectedClient.id].length === 0) && (
                            <TableRow>
                              <TableCell colSpan={5} className="h-24 text-center">
                                Nenhum pagamento encontrado.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="subscription" className="mt-4 space-y-4">
                    {selectedClient && mockSubscriptionDetails[selectedClient.id] && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Status da Assinatura</Label>
                            <div>
                              <Badge variant="outline" className={getSubscriptionStatusColor(mockSubscriptionDetails[selectedClient.id].status)}>
                                {mockSubscriptionDetails[selectedClient.id].status}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Plano</Label>
                            <div className="font-medium">
                              {mockSubscriptionDetails[selectedClient.id].planName}
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Data de Início</Label>
                            <div className="font-medium">
                              {mockSubscriptionDetails[selectedClient.id].startDate}
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Próxima Renovação</Label>
                            <div className="font-medium">
                              {mockSubscriptionDetails[selectedClient.id].renewalDate}
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Método de Pagamento</Label>
                            <div className="font-medium">
                              {mockSubscriptionDetails[selectedClient.id].paymentMethod}
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Profissionais</Label>
                            <div className="font-medium">
                              {mockSubscriptionDetails[selectedClient.id].professionals}
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Recursos do Plano</Label>
                          <ul className="list-disc pl-5 space-y-1">
                            {mockSubscriptionDetails[selectedClient.id].features.map((feature, index) => (
                              <li key={index}>{feature}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          <Button className="bg-psycho-primary hover:bg-psycho-primary/90">
                            Renovar Assinatura
                          </Button>
                          <Button variant="outline">
                            Alterar Plano
                          </Button>
                          {mockSubscriptionDetails[selectedClient.id].status === "Suspensa" && (
                            <Button variant="outline">
                              Reativar Assinatura
                            </Button>
                          )}
                          {mockSubscriptionDetails[selectedClient.id].status === "Ativa" && (
                            <Button variant="outline" className="text-red-600 hover:bg-red-50">
                              Cancelar Assinatura
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              )}
              
              {!selectedClient && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="plan">Plano</Label>
                    <select
                      id="plan"
                      className="w-full border rounded-md p-2"
                      defaultValue="Basic"
                    >
                      <option value="Basic">Básico</option>
                      <option value="Premium">Premium</option>
                      <option value="Enterprise">Enterprise</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <select
                      id="status"
                      className="w-full border rounded-md p-2"
                      defaultValue="Ativo"
                    >
                      <option value="Ativo">Ativo</option>
                      <option value="Inadimplente">Inadimplente</option>
                      <option value="Suspenso">Suspenso</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastPayment">Data Último Pagamento</Label>
                    <Input
                      id="lastPayment"
                      type="date"
                      defaultValue="2025-04-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nextPayment">Data Próximo Pagamento</Label>
                    <Input
                      id="nextPayment"
                      type="date"
                      defaultValue="2025-05-12"
                    />
                  </div>
                </div>
              )}
            </TabsContent>
            <TabsContent value="users" className="space-y-4 py-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-medium">Profissionais cadastrados</h4>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-1" /> Adicionar
                  </Button>
                </div>
                <div className="border rounded-md divide-y">
                  {[1, 2, 3].map((user) => (
                    <div key={user} className="flex justify-between items-center p-3">
                      <div>
                        <p className="font-medium">Profissional {user}</p>
                        <p className="text-sm text-muted-foreground">profissional{user}@email.com</p>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddClientOpen(false)}>
              Cancelar
            </Button>
            <Button className="bg-psycho-primary hover:bg-psycho-primary/90">
              {selectedClient ? "Salvar Alterações" : "Adicionar Cliente"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default ClientsManagement;
