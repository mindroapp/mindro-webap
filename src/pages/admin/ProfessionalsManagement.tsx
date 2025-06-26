
import React, { useState } from "react";
import AdminLayout from "@/components/layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye, CheckCircle, XCircle, Pause } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Mock data - substituir por dados reais da API
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
    profession: "Psiquiatra",
    registration: "CRM 12345",
    requestDate: "2024-01-14",
    documents: ["diploma.pdf", "crm.pdf"]
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
    status: "Ativo",
    joinDate: "2023-11-15"
  }
];

const ProfessionalsManagement: React.FC = () => {
  const [selectedProfessional, setSelectedProfessional] = useState<any>(null);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false);

  const handleAcceptProfessional = (id: number) => {
    console.log("Aceitar profissional:", id);
    // Implementar lógica de aceitar profissional
  };

  const handleRejectProfessional = (id: number) => {
    console.log("Rejeitar profissional:", id);
    setRejectDialogOpen(false);
    // Implementar lógica de rejeitar profissional
  };

  const handleSuspendProfessional = (id: number) => {
    console.log("Suspender profissional:", id);
    setSuspendDialogOpen(false);
    // Implementar lógica de suspender profissional
  };

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

        <Tabs defaultValue="requests" className="space-y-4">
          <TabsList>
            <TabsTrigger value="requests">
              Solicitações ({pendingProfessionals.length})
            </TabsTrigger>
            <TabsTrigger value="active">
              Ativos ({activeProfessionals.length})
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
                      <TableHead>Profissão</TableHead>
                      <TableHead>Registro</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingProfessionals.map((professional) => (
                      <TableRow key={professional.id}>
                        <TableCell className="font-medium">{professional.name}</TableCell>
                        <TableCell>{professional.email}</TableCell>
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
                <CardTitle>Profissionais Ativos</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Profissão</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Data de Entrada</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeProfessionals.map((professional) => (
                      <TableRow key={professional.id}>
                        <TableCell className="font-medium">{professional.name}</TableCell>
                        <TableCell>{professional.email}</TableCell>
                        <TableCell>{professional.profession}</TableCell>
                        <TableCell>
                          <Badge variant="default">{professional.status}</Badge>
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

        {/* Dialog de Rejeição */}
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

        {/* Dialog de Suspensão */}
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
      </div>
    </AdminLayout>
  );
};

export default ProfessionalsManagement;
