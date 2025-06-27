
import React, { useState } from "react";
import AdminLayout from "@/components/layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, CheckCircle, XCircle, Pause, Play, Search } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

// Mock data atualizado
const pendingProfessionals = [
  {
    id: 1,
    name: "Dr. João Silva",
    email: "joao@exemplo.com",
    phone: "(85) 9 9999-9999",
    profession: "Psicólogo",
    registration: "CRP 11/12345",
    requestDate: "2024-01-15",
    documents: ["diploma.pdf", "crp.pdf"]
  },
  {
    id: 2,
    name: "Dra. Maria Santos",
    email: "maria@exemplo.com", 
    phone: "(85) 9 8888-8888",
    profession: "Psicanalista",
    registration: "CFP 12345",
    requestDate: "2024-01-14",
    documents: ["diploma.pdf", "cfp.pdf"]
  }
];

const activeProfessionals = [
  {
    id: 3,
    name: "Dr. Carlos Lima",
    email: "carlos@exemplo.com",
    phone: "(85) 9 7777-7777",
    profession: "Psicólogo",
    registration: "CRP 11/54321",
    status: "Ativo",
    joinDate: "2023-12-01"
  },
  {
    id: 4,
    name: "Dra. Ana Costa",
    email: "ana@exemplo.com",
    phone: "(85) 9 6666-6666", 
    profession: "Terapeuta",
    registration: "CRT 98765",
    status: "Suspenso",
    joinDate: "2023-11-15"
  },
  {
    id: 5,
    name: "Dr. Pedro Oliveira",
    email: "pedro@exemplo.com",
    phone: "(85) 9 5555-5555", 
    profession: "Neuropsicólogo",
    registration: "CRP 11/67890",
    status: "Ativo",
    joinDate: "2023-10-20"
  }
];

const ProfessionalsManagement: React.FC = () => {
  const [selectedProfessional, setSelectedProfessional] = useState<any>(null);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false);
  const [activateDialogOpen, setActivateDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [professionFilter, setProfessionFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();

  const handleAcceptProfessional = (id: number) => {
    console.log("Aceitar profissional:", id);
    toast({
      title: "Profissional aprovado",
      description: "O profissional foi movido para a lista de ativos com sucesso."
    });
  };

  const handleRejectProfessional = (id: number) => {
    console.log("Rejeitar profissional:", id);
    setRejectDialogOpen(false);
    toast({
      title: "Profissional rejeitado",
      description: "A solicitação foi rejeitada e o profissional foi notificado."
    });
  };

  const handleSuspendProfessional = (id: number) => {
    console.log("Suspender profissional:", id);
    setSuspendDialogOpen(false);
    toast({
      title: "Profissional suspenso",
      description: "O acesso do profissional foi suspenso."
    });
  };

  const handleActivateProfessional = (id: number) => {
    console.log("Ativar profissional:", id);
    setActivateDialogOpen(false);
    toast({
      title: "Profissional ativado",
      description: "O acesso do profissional foi reativado."
    });
  };

  const filteredActiveProfessionals = activeProfessionals.filter((professional) => {
    const matchesSearch = 
      professional.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      professional.profession.toLowerCase().includes(searchTerm.toLowerCase()) ||
      professional.registration.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesProfession = professionFilter === "all" || professional.profession === professionFilter;
    const matchesStatus = statusFilter === "all" || professional.status === statusFilter;
    
    return matchesSearch && matchesProfession && matchesStatus;
  });

  const filteredPendingProfessionals = pendingProfessionals.filter((professional) => {
    const matchesSearch = 
      professional.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      professional.profession.toLowerCase().includes(searchTerm.toLowerCase()) ||
      professional.registration.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesProfession = professionFilter === "all" || professional.profession === professionFilter;
    
    return matchesSearch && matchesProfession;
  });

  const ViewDetailsDialog = ({ professional, trigger }: { professional: any; trigger: React.ReactNode }) => (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Detalhes do Profissional</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-semibold">Nome:</label>
              <p>{professional?.name}</p>
            </div>
            <div>
              <label className="font-semibold">Email:</label>
              <p>{professional?.email}</p>
            </div>
            <div>
              <label className="font-semibold">Telefone:</label>
              <p>{professional?.phone}</p>
            </div>
            <div>
              <label className="font-semibold">Profissão:</label>
              <p>{professional?.profession}</p>
            </div>
            <div>
              <label className="font-semibold">Registro:</label>
              <p>{professional?.registration}</p>
            </div>
            {professional?.requestDate && (
              <div>
                <label className="font-semibold">Data da Solicitação:</label>
                <p>{professional.requestDate}</p>
              </div>
            )}
            {professional?.status && (
              <div>
                <label className="font-semibold">Status:</label>
                <Badge variant={professional.status === "Ativo" ? "default" : "destructive"}>
                  {professional.status}
                </Badge>
              </div>
            )}
          </div>
          {professional?.documents && (
            <div>
              <label className="font-semibold">Documentos:</label>
              <div className="flex gap-2 mt-2">
                {professional.documents.map((doc: string, index: number) => (
                  <Button key={index} variant="outline" size="sm">
                    {doc}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Gerenciamento de Profissionais
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gerencie solicitações e profissionais ativos na plataforma
          </p>
        </div>

        {/* Filtros */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por nome, profissão ou registro..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={professionFilter} onValueChange={setProfessionFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filtrar por profissão" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as profissões</SelectItem>
                  <SelectItem value="Psicólogo">Psicólogo</SelectItem>
                  <SelectItem value="Psicanalista">Psicanalista</SelectItem>
                  <SelectItem value="Terapeuta">Terapeuta</SelectItem>
                  <SelectItem value="Neuropsicólogo">Neuropsicólogo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="requests" className="space-y-4">
          <TabsList>
            <TabsTrigger value="requests">
              Solicitações ({filteredPendingProfessionals.length})
            </TabsTrigger>
            <TabsTrigger value="active">
              Ativos ({filteredActiveProfessionals.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="requests">
            <Card>
              <CardHeader>
                <CardTitle>Solicitações Pendentes</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Telefone</TableHead>
                      <TableHead>Profissão</TableHead>
                      <TableHead>Registro</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPendingProfessionals.map((professional) => (
                      <TableRow key={professional.id}>
                        <TableCell className="font-medium">{professional.name}</TableCell>
                        <TableCell>{professional.email}</TableCell>
                        <TableCell>{professional.phone}</TableCell>
                        <TableCell>{professional.profession}</TableCell>
                        <TableCell>{professional.registration}</TableCell>
                        <TableCell>{professional.requestDate}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <ViewDetailsDialog
                              professional={professional}
                              trigger={
                                <Button variant="outline" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              }
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-green-600 hover:text-green-700"
                              onClick={() => handleAcceptProfessional(professional.id)}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => {
                                setSelectedProfessional(professional);
                                setRejectDialogOpen(true);
                              }}
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="active">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Profissionais Ativos</CardTitle>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filtrar por status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os status</SelectItem>
                      <SelectItem value="Ativo">Ativo</SelectItem>
                      <SelectItem value="Suspenso">Suspenso</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Telefone</TableHead>
                      <TableHead>Profissão</TableHead>
                      <TableHead>Registro</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Data de Entrada</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredActiveProfessionals.map((professional) => (
                      <TableRow key={professional.id}>
                        <TableCell className="font-medium">{professional.name}</TableCell>
                        <TableCell>{professional.email}</TableCell>
                        <TableCell>{professional.phone}</TableCell>
                        <TableCell>{professional.profession}</TableCell>
                        <TableCell>{professional.registration}</TableCell>
                        <TableCell>
                          <Badge variant={professional.status === "Ativo" ? "default" : "destructive"}>
                            {professional.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{professional.joinDate}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <ViewDetailsDialog
                              professional={professional}
                              trigger={
                                <Button variant="outline" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              }
                            />
                            {professional.status === "Ativo" ? (
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-orange-600 hover:text-orange-700"
                                onClick={() => {
                                  setSelectedProfessional(professional);
                                  setSuspendDialogOpen(true);
                                }}
                              >
                                <Pause className="h-4 w-4" />
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-green-600 hover:text-green-700"
                                onClick={() => {
                                  setSelectedProfessional(professional);
                                  setActivateDialogOpen(true);
                                }}
                              >
                                <Play className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Diálogos de confirmação */}
        <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar Rejeição</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja rejeitar a solicitação de {selectedProfessional?.name}?
                Esta ação não pode ser desfeita.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleRejectProfessional(selectedProfessional?.id)}
              >
                Rejeitar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={suspendDialogOpen} onOpenChange={setSuspendDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar Suspensão</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja suspender o cadastro de {selectedProfessional?.name}?
                O profissional não conseguirá realizar login após a suspensão.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSuspendDialogOpen(false)}>
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleSuspendProfessional(selectedProfessional?.id)}
              >
                Suspender
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={activateDialogOpen} onOpenChange={setActivateDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar Ativação</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja reativar o cadastro de {selectedProfessional?.name}?
                O profissional poderá realizar login novamente.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setActivateDialogOpen(false)}>
                Cancelar
              </Button>
              <Button
                onClick={() => handleActivateProfessional(selectedProfessional?.id)}
              >
                Ativar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default ProfessionalsManagement;
