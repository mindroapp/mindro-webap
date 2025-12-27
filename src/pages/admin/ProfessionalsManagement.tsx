import React, { useState } from "react";
import AdminLayout from "@/components/layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, CheckCircle, XCircle, Pause, Play, Search, Edit, FileText, AlertTriangle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import ProfessionalEditModal from "@/components/ProfessionalEditModal";
import DocumentViewModal from "@/components/DocumentViewModal";

// Mock data
const pendingProfessionals = [
  {
    id: 1,
    name: "Dr. João Silva",
    email: "joao@exemplo.com",
    phone: "(85) 9 9999-9999",
    profession: "Psicólogo",
    registration: "CRP 11/12345",
    requestDate: "2024-01-15",
    documents: ["diploma.pdf", "crp.pdf", "identidade.pdf"]
  },
  {
    id: 2,
    name: "Dra. Maria Santos",
    email: "maria@exemplo.com", 
    phone: "(85) 9 8888-8888",
    profession: "Psicanalista",
    registration: "CFP 12345",
    requestDate: "2024-01-14",
    documents: ["diploma.pdf", "cfp.pdf", "comprovante_residencia.pdf"]
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
    joinDate: "2023-12-01",
    plan: "Profissional"
  },
  {
    id: 4,
    name: "Dra. Ana Costa",
    email: "ana@exemplo.com",
    phone: "(85) 9 6666-6666", 
    profession: "Terapeuta",
    registration: "CRT 98765",
    status: "Suspenso",
    joinDate: "2023-11-15",
    plan: "Básico"
  },
  {
    id: 5,
    name: "Dr. Pedro Oliveira",
    email: "pedro@exemplo.com",
    phone: "(85) 9 5555-5555", 
    profession: "Neuropsicólogo",
    registration: "CRP 11/67890",
    status: "Ativo",
    joinDate: "2023-10-20",
    plan: "Premium"
  }
];

const ProfessionalsManagement: React.FC = () => {
  const [selectedProfessional, setSelectedProfessional] = useState<any>(null);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false);
  const [activateDialogOpen, setActivateDialogOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [documentsModalOpen, setDocumentsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [professionFilter, setProfessionFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();

  const handleAcceptProfessional = (id: number) => {
    console.log("Aceitar profissional:", id);
    setApproveDialogOpen(false);
    toast({
      title: "Profissional aprovado",
      description: "O profissional foi movido para a lista de ativos com sucesso."
    });
  };

  const handleRejectProfessional = (id: number) => {
    console.log("Rejeitar e apagar profissional:", id);
    setRejectDialogOpen(false);
    toast({
      title: "Solicitação rejeitada",
      description: "O registro do profissional foi removido do sistema."
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalhes do Profissional</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-sm">Nome:</label>
              <p className="text-sm">{professional?.name}</p>
            </div>
            <div>
              <label className="font-semibold text-sm">Email:</label>
              <p className="text-sm">{professional?.email}</p>
            </div>
            <div>
              <label className="font-semibold text-sm">Telefone:</label>
              <p className="text-sm">{professional?.phone}</p>
            </div>
            <div>
              <label className="font-semibold text-sm">Profissão:</label>
              <p className="text-sm">{professional?.profession}</p>
            </div>
            <div>
              <label className="font-semibold text-sm">Registro:</label>
              <p className="text-sm">{professional?.registration}</p>
            </div>
            {professional?.requestDate && (
              <div>
                <label className="font-semibold text-sm">Data da Solicitação:</label>
                <p className="text-sm">{professional.requestDate}</p>
              </div>
            )}
            {professional?.status && (
              <div>
                <label className="font-semibold text-sm">Status:</label>
                <Badge variant={professional.status === "Ativo" ? "default" : "destructive"}>
                  {professional.status}
                </Badge>
              </div>
            )}
            {professional?.plan && (
              <div>
                <label className="font-semibold text-sm">Plano:</label>
                <Badge variant="outline">{professional.plan}</Badge>
              </div>
            )}
          </div>
          {professional?.documents && (
            <div>
              <div className="flex items-center justify-between">
                <label className="font-semibold text-sm">Documentos:</label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedProfessional(professional);
                    setDocumentsModalOpen(true);
                  }}
                >
                  <FileText className="h-4 w-4 mr-1" />
                  Ver Documentos
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <AdminLayout>
      <div className="space-y-4 md:space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Gerenciamento de Profissionais
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Gerencie solicitações e profissionais ativos na plataforma
          </p>
        </div>

        {/* Filtros */}
        <Card>
          <CardContent className="pt-4 md:pt-6">
            <div className="flex flex-col gap-3 md:flex-row md:gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
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
          <TabsList className="w-full md:w-auto">
            <TabsTrigger value="requests" className="flex-1 md:flex-none">
              Solicitações ({filteredPendingProfessionals.length})
            </TabsTrigger>
            <TabsTrigger value="active" className="flex-1 md:flex-none">
              Ativos ({filteredActiveProfessionals.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="requests">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Solicitações Pendentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto -mx-6 px-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[150px]">Nome</TableHead>
                        <TableHead className="hidden md:table-cell">Email</TableHead>
                        <TableHead className="hidden lg:table-cell">Telefone</TableHead>
                        <TableHead>Profissão</TableHead>
                        <TableHead className="hidden sm:table-cell">Registro</TableHead>
                        <TableHead className="hidden lg:table-cell">Data</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPendingProfessionals.map((professional) => (
                        <TableRow key={professional.id}>
                          <TableCell className="font-medium">{professional.name}</TableCell>
                          <TableCell className="hidden md:table-cell">{professional.email}</TableCell>
                          <TableCell className="hidden lg:table-cell">{professional.phone}</TableCell>
                          <TableCell>{professional.profession}</TableCell>
                          <TableCell className="hidden sm:table-cell">{professional.registration}</TableCell>
                          <TableCell className="hidden lg:table-cell">{professional.requestDate}</TableCell>
                          <TableCell>
                            <div className="flex gap-1 md:gap-2">
                              <ViewDetailsDialog
                                professional={professional}
                                trigger={
                                  <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                }
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 w-8 p-0 text-green-600 hover:text-green-700"
                                onClick={() => {
                                  setSelectedProfessional(professional);
                                  setApproveDialogOpen(true);
                                }}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
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
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="active">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <CardTitle className="text-lg">Profissionais Ativos</CardTitle>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-48">
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
                <div className="overflow-x-auto -mx-6 px-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[150px]">Nome</TableHead>
                        <TableHead className="hidden md:table-cell">Email</TableHead>
                        <TableHead className="hidden lg:table-cell">Telefone</TableHead>
                        <TableHead>Profissão</TableHead>
                        <TableHead className="hidden sm:table-cell">Plano</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="hidden lg:table-cell">Entrada</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredActiveProfessionals.map((professional) => (
                        <TableRow key={professional.id}>
                          <TableCell className="font-medium">{professional.name}</TableCell>
                          <TableCell className="hidden md:table-cell">{professional.email}</TableCell>
                          <TableCell className="hidden lg:table-cell">{professional.phone}</TableCell>
                          <TableCell>{professional.profession}</TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <Badge variant="outline">{professional.plan}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={professional.status === "Ativo" ? "default" : "destructive"}>
                              {professional.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">{professional.joinDate}</TableCell>
                          <TableCell>
                            <div className="flex gap-1 md:gap-2">
                              <ViewDetailsDialog
                                professional={professional}
                                trigger={
                                  <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                }
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700"
                                onClick={() => {
                                  setSelectedProfessional(professional);
                                  setEditModalOpen(true);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              {professional.status === "Ativo" ? (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 w-8 p-0 text-orange-600 hover:text-orange-700"
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
                                  className="h-8 w-8 p-0 text-green-600 hover:text-green-700"
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
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Modal de Confirmação de Aprovação */}
        <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Confirmar Aprovação
              </DialogTitle>
              <DialogDescription>
                Tem certeza que deseja aprovar o cadastro de <strong>{selectedProfessional?.name}</strong>?
                O profissional será movido para a lista de ativos e poderá acessar a plataforma.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={() => setApproveDialogOpen(false)} className="w-full sm:w-auto">
                Cancelar
              </Button>
              <Button
                className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
                onClick={() => handleAcceptProfessional(selectedProfessional?.id)}
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Aprovar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal de Confirmação de Rejeição */}
        <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                Confirmar Rejeição
              </DialogTitle>
              <DialogDescription>
                Tem certeza que deseja rejeitar a solicitação de <strong>{selectedProfessional?.name}</strong>?
                Esta ação irá <strong>remover permanentemente</strong> o registro do sistema.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={() => setRejectDialogOpen(false)} className="w-full sm:w-auto">
                Cancelar
              </Button>
              <Button
                variant="destructive"
                className="w-full sm:w-auto"
                onClick={() => handleRejectProfessional(selectedProfessional?.id)}
              >
                <XCircle className="h-4 w-4 mr-1" />
                Rejeitar e Remover
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal de Suspensão */}
        <Dialog open={suspendDialogOpen} onOpenChange={setSuspendDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Pause className="h-5 w-5 text-orange-600" />
                Confirmar Suspensão
              </DialogTitle>
              <DialogDescription>
                Tem certeza que deseja suspender o cadastro de <strong>{selectedProfessional?.name}</strong>?
                O profissional não conseguirá realizar login após a suspensão.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={() => setSuspendDialogOpen(false)} className="w-full sm:w-auto">
                Cancelar
              </Button>
              <Button
                variant="destructive"
                className="w-full sm:w-auto"
                onClick={() => handleSuspendProfessional(selectedProfessional?.id)}
              >
                <Pause className="h-4 w-4 mr-1" />
                Suspender
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal de Ativação */}
        <Dialog open={activateDialogOpen} onOpenChange={setActivateDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Play className="h-5 w-5 text-green-600" />
                Confirmar Ativação
              </DialogTitle>
              <DialogDescription>
                Tem certeza que deseja reativar o cadastro de <strong>{selectedProfessional?.name}</strong>?
                O profissional poderá realizar login novamente.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={() => setActivateDialogOpen(false)} className="w-full sm:w-auto">
                Cancelar
              </Button>
              <Button className="w-full sm:w-auto" onClick={() => handleActivateProfessional(selectedProfessional?.id)}>
                <Play className="h-4 w-4 mr-1" />
                Ativar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <ProfessionalEditModal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          professional={selectedProfessional}
        />

        <DocumentViewModal
          isOpen={documentsModalOpen}
          onClose={() => setDocumentsModalOpen(false)}
          documents={selectedProfessional?.documents || []}
        />
      </div>
    </AdminLayout>
  );
};

export default ProfessionalsManagement;
