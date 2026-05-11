import React, { useState, useEffect, useCallback } from "react";
import AdminLayout from "@/components/layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, XCircle, Pause, Play, Search, Edit, FileText, AlertTriangle, Trash2, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import ProfessionalEditModal from "@/components/ProfessionalEditModal";
import DocumentViewModal from "@/components/DocumentViewModal";
import usersService, { ApiUser } from "@/services/usersService";
import { getProfessionByValue } from "@/lib/professions";

interface DisplayProfessional {
  id: string;
  name: string;
  email: string;
  phone: string;
  profession: string;
  registration: string;
  requestDate?: string;
  joinDate?: string | null;
  status?: string;
}

const formatPhone = (phone: string | null): string => {
  if (!phone) return "-";
  const d = phone.replace(/\D/g, "");
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d[2]} ${d.slice(3, 7)}-${d.slice(7)}`;
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return phone;
};

const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("pt-BR");
};

const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
};

const openWhatsApp = (phone: string) => {
  const clean = phone.replace(/\D/g, "");
  window.open(`https://wa.me/${clean}`, "_blank");
};

function mapUser(user: ApiUser): DisplayProfessional {
  const profLabel = getProfessionByValue(user.profession ?? "")?.label ?? user.profession ?? "-";
  return {
    id: user.id,
    name: user.fullName,
    email: user.email,
    phone: formatPhone(user.phone),
    profession: profLabel,
    registration: user.professionalRegister ?? "-",
    requestDate: user.createdAt,
    joinDate: user.approvedAt,
    status: user.accountStatus === "ACTIVE" ? "Ativo" : "Suspenso",
  };
}

const ProfessionalsManagement: React.FC = () => {
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProfessional, setSelectedProfessional] = useState<DisplayProfessional | null>(null);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false);
  const [activateDialogOpen, setActivateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [documentsModalOpen, setDocumentsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [actionLoading, setActionLoading] = useState(false);
  const { toast } = useToast();

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await usersService.findAll();
      setUsers(data.filter((u) => u.role === "PROFESSIONAL"));
    } catch (err: any) {
      toast({
        title: "Erro ao carregar profissionais",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const pendingProfessionals = users
    .filter((u) => u.approvalStatus === "PENDING")
    .map(mapUser)
    .filter((p) => {
      const q = searchTerm.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.profession.toLowerCase().includes(q) ||
        p.registration.toLowerCase().includes(q)
      );
    });

  const activeProfessionals = users
    .filter((u) => u.approvalStatus === "APPROVED")
    .map(mapUser)
    .filter((p) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        p.name.toLowerCase().includes(q) ||
        p.profession.toLowerCase().includes(q) ||
        p.registration.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "all" || p.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

  const handleAcceptProfessional = async () => {
    if (!selectedProfessional) return;
    setActionLoading(true);
    try {
      await usersService.approve(selectedProfessional.id);
      await loadUsers();
      setApproveDialogOpen(false);
      toast({
        title: "Profissional aprovado",
        description: "O profissional foi movido para a lista de ativos com sucesso.",
      });
    } catch (err: any) {
      toast({ title: "Erro", description: err.message, variant: "destructive" });
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectProfessional = async () => {
    if (!selectedProfessional) return;
    setActionLoading(true);
    try {
      await usersService.delete(selectedProfessional.id);
      await loadUsers();
      setRejectDialogOpen(false);
      toast({
        title: "Solicitação rejeitada",
        description: "O registro do profissional foi removido do sistema.",
      });
    } catch (err: any) {
      toast({ title: "Erro", description: err.message, variant: "destructive" });
    } finally {
      setActionLoading(false);
    }
  };

  const handleSuspendProfessional = async () => {
    if (!selectedProfessional) return;
    setActionLoading(true);
    try {
      await usersService.deactivate(selectedProfessional.id);
      await loadUsers();
      setSuspendDialogOpen(false);
      toast({
        title: "Profissional suspenso",
        description: "O acesso do profissional foi suspenso.",
      });
    } catch (err: any) {
      toast({ title: "Erro", description: err.message, variant: "destructive" });
    } finally {
      setActionLoading(false);
    }
  };

  const handleActivateProfessional = async () => {
    if (!selectedProfessional) return;
    setActionLoading(true);
    try {
      await usersService.activate(selectedProfessional.id);
      await loadUsers();
      setActivateDialogOpen(false);
      toast({
        title: "Profissional ativado",
        description: "O acesso do profissional foi reativado.",
      });
    } catch (err: any) {
      toast({ title: "Erro", description: err.message, variant: "destructive" });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteProfessional = async () => {
    if (!selectedProfessional) return;
    setActionLoading(true);
    try {
      await usersService.delete(selectedProfessional.id);
      await loadUsers();
      setDeleteDialogOpen(false);
      toast({
        title: "Profissional excluído",
        description: "O profissional foi removido do sistema.",
      });
    } catch (err: any) {
      toast({ title: "Erro", description: err.message, variant: "destructive" });
    } finally {
      setActionLoading(false);
    }
  };

  const handleRequestDocuments = (phone: string, missingDocs: string[]) => {
    const message = `Olá ${selectedProfessional?.name}, detectamos que os seguintes documentos estão faltando no seu cadastro: ${missingDocs.join(", ")}. Por favor, adicione-os na plataforma o quanto antes.`;
    const clean = phone.replace(/\D/g, "");
    window.open(`https://wa.me/${clean}?text=${encodeURIComponent(message)}`, "_blank");
    toast({ title: "Solicitação enviada", description: "Mensagem enviada via WhatsApp com sucesso." });
  };

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
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="requests" className="space-y-4">
          <TabsList className="w-full grid grid-cols-2 gap-0">
            <TabsTrigger value="requests" className="flex-1">
              Solicitações ({loading ? "…" : pendingProfessionals.length})
            </TabsTrigger>
            <TabsTrigger value="active" className="flex-1">
              Ativos ({loading ? "…" : activeProfessionals.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="requests">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Solicitações Pendentes</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-12 text-muted-foreground gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Carregando...</span>
                  </div>
                ) : pendingProfessionals.length === 0 ? (
                  <p className="text-center py-12 text-muted-foreground text-sm">
                    Nenhuma solicitação pendente.
                  </p>
                ) : (
                  <div className="overflow-x-auto -mx-6 px-6">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="min-w-[150px]">Nome</TableHead>
                          <TableHead className="hidden md:table-cell">Email</TableHead>
                          <TableHead className="hidden lg:table-cell">Telefone</TableHead>
                          <TableHead>Profissão</TableHead>
                          <TableHead className="hidden sm:table-cell">Registro</TableHead>
                          <TableHead className="hidden lg:table-cell">Data/Hora Cadastro</TableHead>
                          <TableHead>Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pendingProfessionals.map((professional) => (
                          <TableRow key={professional.id}>
                            <TableCell className="font-medium">{professional.name}</TableCell>
                            <TableCell className="hidden md:table-cell">{professional.email}</TableCell>
                            <TableCell className="hidden lg:table-cell">
                              {professional.phone !== "-" ? (
                                <button
                                  onClick={() => openWhatsApp(professional.phone)}
                                  className="text-blue-600 hover:text-blue-800 hover:underline"
                                  title="Abrir WhatsApp"
                                >
                                  {professional.phone}
                                </button>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </TableCell>
                            <TableCell>{professional.profession}</TableCell>
                            <TableCell className="hidden sm:table-cell">{professional.registration}</TableCell>
                            <TableCell className="hidden lg:table-cell">
                              {professional.requestDate ? formatDateTime(professional.requestDate) : "-"}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1 md:gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  onClick={() => {
                                    setSelectedProfessional(professional);
                                    setDocumentsModalOpen(true);
                                  }}
                                  title="Ver Anexos"
                                >
                                  <FileText className="h-4 w-4" />
                                </Button>
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
                )}
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
                {loading ? (
                  <div className="flex items-center justify-center py-12 text-muted-foreground gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Carregando...</span>
                  </div>
                ) : activeProfessionals.length === 0 ? (
                  <p className="text-center py-12 text-muted-foreground text-sm">
                    Nenhum profissional encontrado.
                  </p>
                ) : (
                  <div className="overflow-x-auto -mx-6 px-6">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="min-w-[150px]">Nome</TableHead>
                          <TableHead className="hidden md:table-cell">Email</TableHead>
                          <TableHead className="hidden lg:table-cell">Telefone</TableHead>
                          <TableHead>Profissão</TableHead>
                          <TableHead className="hidden sm:table-cell">Registro</TableHead>
                          <TableHead className="hidden lg:table-cell">Aceito em</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {activeProfessionals.map((professional) => (
                          <TableRow key={professional.id}>
                            <TableCell className="font-medium">{professional.name}</TableCell>
                            <TableCell className="hidden md:table-cell">{professional.email}</TableCell>
                            <TableCell className="hidden lg:table-cell">
                              {professional.phone !== "-" ? (
                                <button
                                  onClick={() => openWhatsApp(professional.phone)}
                                  className="text-blue-600 hover:text-blue-800 hover:underline"
                                  title="Abrir WhatsApp"
                                >
                                  {professional.phone}
                                </button>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </TableCell>
                            <TableCell>{professional.profession}</TableCell>
                            <TableCell className="hidden sm:table-cell">{professional.registration}</TableCell>
                            <TableCell className="hidden lg:table-cell">{formatDate(professional.joinDate)}</TableCell>
                            <TableCell>
                              <Badge
                                className={
                                  professional.status === "Ativo"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }
                                variant="outline"
                              >
                                {professional.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1 md:gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  onClick={() => {
                                    setSelectedProfessional(professional);
                                    setDocumentsModalOpen(true);
                                  }}
                                  title="Ver Anexos"
                                >
                                  <FileText className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700"
                                  onClick={() => {
                                    setSelectedProfessional(professional);
                                    setEditModalOpen(true);
                                  }}
                                  title="Editar Profissional"
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
                                    title="Suspender Profissional"
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
                                    title="Ativar Profissional"
                                  >
                                    <Play className="h-4 w-4" />
                                  </Button>
                                )}
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                                  onClick={() => {
                                    setSelectedProfessional(professional);
                                    setDeleteDialogOpen(true);
                                  }}
                                  title="Excluir Profissional"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Aprovação */}
        <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Confirmar Aprovação
              </DialogTitle>
              <DialogDescription>
                Tem certeza que deseja aprovar o cadastro de{" "}
                <strong>{selectedProfessional?.name}</strong>? O profissional será movido
                para a lista de ativos e poderá acessar a plataforma.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={() => setApproveDialogOpen(false)} className="w-full sm:w-auto">
                Cancelar
              </Button>
              <Button
                className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
                onClick={handleAcceptProfessional}
                disabled={actionLoading}
              >
                {actionLoading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <CheckCircle className="h-4 w-4 mr-1" />}
                Aprovar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Rejeição */}
        <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                Confirmar Rejeição
              </DialogTitle>
              <DialogDescription>
                Tem certeza que deseja rejeitar a solicitação de{" "}
                <strong>{selectedProfessional?.name}</strong>? Esta ação irá{" "}
                <strong>remover permanentemente</strong> o registro do sistema.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={() => setRejectDialogOpen(false)} className="w-full sm:w-auto">
                Cancelar
              </Button>
              <Button
                variant="destructive"
                className="w-full sm:w-auto"
                onClick={handleRejectProfessional}
                disabled={actionLoading}
              >
                {actionLoading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <XCircle className="h-4 w-4 mr-1" />}
                Rejeitar e Remover
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Suspensão */}
        <Dialog open={suspendDialogOpen} onOpenChange={setSuspendDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Pause className="h-5 w-5 text-orange-600" />
                Confirmar Suspensão
              </DialogTitle>
              <DialogDescription>
                Tem certeza que deseja suspender o cadastro de{" "}
                <strong>{selectedProfessional?.name}</strong>? O profissional não
                conseguirá realizar login após a suspensão.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={() => setSuspendDialogOpen(false)} className="w-full sm:w-auto">
                Cancelar
              </Button>
              <Button
                variant="destructive"
                className="w-full sm:w-auto"
                onClick={handleSuspendProfessional}
                disabled={actionLoading}
              >
                {actionLoading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Pause className="h-4 w-4 mr-1" />}
                Suspender
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Ativação */}
        <Dialog open={activateDialogOpen} onOpenChange={setActivateDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Play className="h-5 w-5 text-green-600" />
                Confirmar Ativação
              </DialogTitle>
              <DialogDescription>
                Tem certeza que deseja reativar o cadastro de{" "}
                <strong>{selectedProfessional?.name}</strong>? O profissional poderá
                realizar login novamente.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={() => setActivateDialogOpen(false)} className="w-full sm:w-auto">
                Cancelar
              </Button>
              <Button
                className="w-full sm:w-auto"
                onClick={handleActivateProfessional}
                disabled={actionLoading}
              >
                {actionLoading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Play className="h-4 w-4 mr-1" />}
                Ativar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Exclusão */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Trash2 className="h-5 w-5 text-red-600" />
                Confirmar Exclusão
              </DialogTitle>
              <DialogDescription>
                Tem certeza que deseja excluir o cadastro de{" "}
                <strong>{selectedProfessional?.name}</strong>? Esta ação não poderá ser
                desfeita.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} className="w-full sm:w-auto">
                Cancelar
              </Button>
              <Button
                variant="destructive"
                className="w-full sm:w-auto"
                onClick={handleDeleteProfessional}
                disabled={actionLoading}
              >
                {actionLoading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Trash2 className="h-4 w-4 mr-1" />}
                Excluir
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <ProfessionalEditModal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          professional={selectedProfessional}
          onSuccess={() => {
            setEditModalOpen(false);
            loadUsers();
          }}
        />

        <DocumentViewModal
          isOpen={documentsModalOpen}
          onClose={() => setDocumentsModalOpen(false)}
          documents={[]}
          professionalName={selectedProfessional?.name ?? ""}
          professionalPhone={selectedProfessional?.phone ?? ""}
          onRequestDocuments={handleRequestDocuments}
        />
      </div>
    </AdminLayout>
  );
};

export default ProfessionalsManagement;
