import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePatientStore } from "@/stores/patientStore";
import { Session } from "@/stores/patientStore";
import Header from "@/components/Header";
import SidebarMenu from "@/components/SidebarMenu";
import SessionCard from "@/components/SessionCard";
import SessionEditModal from "@/components/SessionEditModal";
import SessionFormModal from "@/components/SessionFormModal";
import ElectronicRecordModal from "@/components/ElectronicRecordModal";
import PatientHistory from "@/components/PatientHistory";
import PatientEditModal from "@/components/PatientEditModal";
import DocumentUploadModal from "@/components/DocumentUploadModal";
import InitialAssessmentModal from "@/components/InitialAssessmentModal";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  FileText, 
  Plus, 
  ArrowLeft, 
  Calendar, 
  Edit, 
  Upload, 
  Trash, 
  Download,
  History,
  CreditCard,
  Receipt,
  MessageSquare,
  Check
} from "lucide-react";

const PatientDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { selectedPatient, fetchPatient, isLoading } = usePatientStore();
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const [viewingElectronicRecord, setViewingElectronicRecord] = useState<Session | null>(null);
  const [isViewingHistory, setIsViewingHistory] = useState(false);
  const [isEditingPatient, setIsEditingPatient] = useState(false);
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState(false);
  const [isNewSessionModalOpen, setIsNewSessionModalOpen] = useState(false);
  const [isDeleteDocumentOpen, setIsDeleteDocumentOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [isFinancialModalOpen, setIsFinancialModalOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      fetchPatient(id);
    }
  }, [id, fetchPatient]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const calculateAge = (birthdate: string) => {
    const today = new Date();
    const birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  // Mock data para sessões financeiras
  const financialSessions = [
    {
      id: "1",
      date: "2024-01-15",
      value: 200,
      status: "paid",
      paymentMethod: "PIX",
      notes: "Sessão individual - 50min"
    },
    {
      id: "2",
      date: "2024-01-22",
      value: 200,
      status: "pending",
      paymentMethod: "Cartão",
      notes: "Sessão individual - 50min"
    },
    {
      id: "3",
      date: "2024-01-29",
      value: 200,
      status: "paid",
      paymentMethod: "Dinheiro",
      notes: "Sessão individual - 50min"
    }
  ];

  const handleEditSession = (session: Session) => {
    setEditingSession(session);
  };
  
  const handleViewElectronicRecord = (session: Session) => {
    setViewingElectronicRecord(session);
  };
  
  const handleViewHistory = () => {
    setIsViewingHistory(true);
  };

  const handleEditPatient = () => {
    setIsEditingPatient(true);
  };

  const handleDeleteDocument = (document: any) => {
    setSelectedDocument(document);
    setIsDeleteDocumentOpen(true);
  };

  const confirmDeleteDocument = () => {
    toast({
      title: "Documento excluído",
      description: "O documento foi excluído com sucesso."
    });
    setIsDeleteDocumentOpen(false);
    setSelectedDocument(null);
  };

  const handleDownloadDocument = (document: any) => {
    toast({
      title: "Download iniciado",
      description: `Download do documento ${document.name} iniciado.`
    });
  };

  const handleConfirmPayment = (sessionId: string) => {
    toast({
      title: "Pagamento confirmado",
      description: "O pagamento foi confirmado com sucesso."
    });
  };

  const handlePrintReceipt = (sessionId: string) => {
    toast({
      title: "Recibo impresso",
      description: "O recibo foi enviado para impressão."
    });
  };

  const getSortedSessions = () => {
    if (!selectedPatient?.sessions) return [];
    return [...selectedPatient.sessions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-800">Pago</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Cancelado</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    const methods: Record<string, string> = {
      pix: "PIX",
      cash: "Dinheiro",
      creditCard: "Cartão de Crédito",
      debitCard: "Cartão de Débito",
      bankTransfer: "Transferência"
    };
    return methods[method] || method;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <div className="w-64 hidden md:block">
          <SidebarMenu />
        </div>
        <div className="flex-1">
          <Header />
          <main className="p-6">
            <div className="space-y-4">
              <Skeleton className="h-12 w-64" />
              <Skeleton className="h-48 w-full" />
              <div className="grid gap-4">
                <Skeleton className="h-36 w-full" />
                <Skeleton className="h-36 w-full" />
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!selectedPatient) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <div className="w-64 hidden md:block">
          <SidebarMenu />
        </div>
        <div className="flex-1">
          <Header />
          <main className="p-6">
            <div className="text-center py-12">
              <h2 className="text-lg font-medium mb-2">Paciente não encontrado</h2>
              <p className="text-gray-500 mb-4">
                O paciente que você está procurando não existe ou foi removido.
              </p>
              <Button onClick={() => navigate("/patients")}>
                <ArrowLeft size={16} className="mr-1" /> Voltar para pacientes
              </Button>
            </div>
          </main>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex dark:bg-gray-900">
      <div className="w-64 hidden md:block">
        <SidebarMenu />
      </div>
      <div className="flex-1">
        <Header />
        <main className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <Button variant="ghost" size="sm" className="mr-4" onClick={() => navigate("/patients")}>
                <ArrowLeft size={16} className="mr-1" /> Voltar
              </Button>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Detalhes do Paciente</h1>
            </div>
            
            <Button variant="outline" onClick={() => setIsViewingHistory(true)}>
              <History size={16} className="mr-1" /> Ver Histórico Completo
            </Button>
          </div>
  
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row">
                <div className="md:mr-6 mb-4 md:mb-0 flex justify-center md:justify-start">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={selectedPatient.avatar} alt={selectedPatient.name} />
                    <AvatarFallback className="bg-psycho-primary text-white text-2xl">
                      {getInitials(selectedPatient.name)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{selectedPatient.name}</h2>
                      <p className="text-gray-500 dark:text-gray-400">{selectedPatient.email}</p>
                    </div>
                    <div className="mt-2 md:mt-0">
                      <Button variant="outline" size="sm" className="mr-2" onClick={handleEditPatient}>
                        <Edit size={16} className="mr-1" /> Editar
                      </Button>
                    </div>
                  </div>
  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">Idade</p>
                      <p className="font-medium dark:text-white">{calculateAge(selectedPatient.birthdate)} anos</p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">Data de Nascimento</p>
                      <p className="font-medium dark:text-white">{formatDate(selectedPatient.birthdate)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">Telefone</p>
                      <p className="font-medium dark:text-white">{selectedPatient.phone}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">Paciente desde</p>
                      <p className="font-medium dark:text-white">{formatDate(selectedPatient.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">Total de Sessões</p>
                      <p className="font-medium dark:text-white">{selectedPatient.sessions.length}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">Documentos</p>
                      <p className="font-medium dark:text-white">{selectedPatient.documents.length}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
  
          <Tabs defaultValue="initial-record">
            <TabsList className="mb-6">
              <TabsTrigger value="initial-record">Avaliação Inicial</TabsTrigger>
              <TabsTrigger value="sessions">Sessões</TabsTrigger>
              <TabsTrigger value="documents">Documentos</TabsTrigger>
              <TabsTrigger value="financial">Financeiro</TabsTrigger>
            </TabsList>
  
            <TabsContent value="initial-record" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Avaliação Inicial</h2>
                <Button onClick={() => setIsAssessmentModalOpen(true)}>
                  <Plus size={16} className="mr-1" /> 
                  {selectedPatient.initialRecord ? "Editar Avaliação" : "Criar Avaliação"}
                </Button>
              </div>
  
              {!selectedPatient.initialRecord ? (
                <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg bg-white">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                    <FileText size={24} className="text-gray-500" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">Ainda sem avaliação inicial</h3>
                  <p className="text-gray-500 mb-4">
                    A avaliação inicial deste paciente ainda não foi registrada.
                  </p>
                  <Button onClick={() => setIsAssessmentModalOpen(true)}>
                    <Plus size={16} className="mr-1" /> Criar avaliação inicial
                  </Button>
                </div>
              ) : (
                <div className="grid gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-medium mb-3">Motivo da Consulta</h3>
                      <p className="text-gray-700">{selectedPatient.initialRecord.reasonForConsultation}</p>
                    </CardContent>
                  </Card>
  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardContent className="p-6">
                        <h3 className="text-lg font-medium mb-3">Histórico Familiar</h3>
                        <p className="text-gray-700">{selectedPatient.initialRecord.familyHistory}</p>
                      </CardContent>
                    </Card>
  
                    <Card>
                      <CardContent className="p-6">
                        <h3 className="text-lg font-medium mb-3">Histórico Médico</h3>
                        <p className="text-gray-700">{selectedPatient.initialRecord.medicalHistory}</p>
                      </CardContent>
                    </Card>
                  </div>
  
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-medium mb-3">Tratamento Anterior</h3>
                      <p className="text-gray-700">{selectedPatient.initialRecord.previousTreatment}</p>
                    </CardContent>
                  </Card>
  
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-medium mb-3">Exame do Estado Mental</h3>
                      <p className="text-gray-700">{selectedPatient.initialRecord.mentalStatusExam}</p>
                    </CardContent>
                  </Card>
  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardContent className="p-6">
                        <h3 className="text-lg font-medium mb-3">Diagnóstico Inicial</h3>
                        <p className="text-gray-700">{selectedPatient.initialRecord.initialDiagnosis}</p>
                      </CardContent>
                    </Card>
  
                    <Card>
                      <CardContent className="p-6">
                        <h3 className="text-lg font-medium mb-3">Plano de Tratamento</h3>
                        <p className="text-gray-700">{selectedPatient.initialRecord.treatmentPlan}</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="sessions" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold dark:text-white">Notas de Sessão</h2>
                <Button onClick={() => setIsNewSessionModalOpen(true)}>
                  <Plus size={16} className="mr-1" /> Nova Sessão
                </Button>
              </div>
  
              {selectedPatient.sessions.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
                    <Calendar size={24} className="text-gray-500 dark:text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">Ainda sem sessões</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Nenhum registro de sessão foi criado para este paciente ainda.
                  </p>
                  <Button onClick={() => setIsNewSessionModalOpen(true)}>
                    <Plus size={16} className="mr-1" /> Criar primeira sessão
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {getSortedSessions().map((session) => (
                    <SessionCard 
                      key={session.id} 
                      session={session} 
                      onEdit={() => handleEditSession(session)}
                      onViewDetails={() => handleViewElectronicRecord(session)}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
  
            <TabsContent value="documents" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Documentos</h2>
                <Button onClick={() => setIsDocumentModalOpen(true)}>
                  <Upload size={16} className="mr-1" /> Enviar Documento
                </Button>
              </div>
  
              {selectedPatient.documents.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg bg-white">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                    <FileText size={24} className="text-gray-500" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">Ainda sem documentos</h3>
                  <p className="text-gray-500 mb-4">
                    Nenhum documento foi enviado para este paciente ainda.
                  </p>
                  <Button onClick={() => setIsDocumentModalOpen(true)}>
                    <Upload size={16} className="mr-1" /> Enviar primeiro documento
                  </Button>
                </div>
              ) : (
                <div className="bg-white rounded-md shadow overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nome
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tipo
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Data de Envio
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedPatient.documents.map((document) => (
                        <tr key={document.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="mr-2">
                                <FileText size={16} className="text-gray-400" />
                              </div>
                              <div className="text-sm font-medium text-gray-900">{document.name}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                              {document.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(document.uploadDate)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-psycho-primary"
                              onClick={() => handleDownloadDocument(document)}
                            >
                              <Download size={14} className="mr-1" /> Baixar
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-red-500"
                              onClick={() => handleDeleteDocument(document)}
                            >
                              <Trash size={14} className="mr-1" /> Excluir
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </TabsContent>
  
            <TabsContent value="financial" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Financeiro</h2>
                <Button 
                  className="bg-indigo-700 hover:bg-indigo-800"
                  onClick={() => setIsFinancialModalOpen(true)}
                >
                  <Plus size={16} className="mr-1" /> Novo Registro
                </Button>
              </div>
              
              <Card>
                <CardContent className="p-6">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left pb-3 font-medium">Data da Sessão</th>
                          <th className="text-left pb-3 font-medium">Valor</th>
                          <th className="text-left pb-3 font-medium">Status</th>
                          <th className="text-left pb-3 font-medium">Forma de Pagamento</th>
                          <th className="text-left pb-3 font-medium">Observações</th>
                          <th className="text-left pb-3 font-medium">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {financialSessions.map((session) => (
                          <tr key={session.id} className="border-b">
                            <td className="py-3">
                              {new Date(session.date).toLocaleDateString('pt-BR')}
                            </td>
                            <td className="py-3 font-medium">
                              R$ {session.value.toFixed(2)}
                            </td>
                            <td className="py-3">
                              {getStatusBadge(session.status)}
                            </td>
                            <td className="py-3">
                              {getPaymentMethodLabel(session.paymentMethod)}
                            </td>
                            <td className="py-3 text-sm text-gray-600">
                              {session.notes}
                            </td>
                            <td className="py-3">
                              <div className="flex space-x-2">
                                {session.status === "pending" && (
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => handleConfirmPayment(session.id)}
                                  >
                                    <Check className="h-3 w-3 mr-1" />
                                    Confirmar
                                  </Button>
                                )}
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handlePrintReceipt(session.id)}
                                >
                                  <Receipt className="h-3 w-3 mr-1" />
                                  Recibo
                                </Button>
                                <Button size="sm" variant="outline">
                                  <MessageSquare className="h-3 w-3 mr-1" />
                                  WhatsApp
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Modals */}
          {editingSession && id && (
            <SessionEditModal
              patientId={id}
              session={editingSession}
              isOpen={!!editingSession}
              onClose={() => setEditingSession(null)}
            />
          )}
          
          {viewingElectronicRecord && id && (
            <ElectronicRecordModal
              patientId={id}
              session={viewingElectronicRecord}
              isOpen={!!viewingElectronicRecord}
              onClose={() => setViewingElectronicRecord(null)}
            />
          )}
          
          {id && isViewingHistory && (
            <PatientHistory
              patientId={id}
              isOpen={isViewingHistory}
              onClose={() => setIsViewingHistory(false)}
            />
          )}

          {isEditingPatient && (
            <PatientEditModal
              patient={selectedPatient}
              isOpen={isEditingPatient}
              onClose={() => setIsEditingPatient(false)}
            />
          )}

          <DocumentUploadModal
            isOpen={isDocumentModalOpen}
            onClose={() => setIsDocumentModalOpen(false)}
            patientId={id || ""}
          />

          <InitialAssessmentModal
            isOpen={isAssessmentModalOpen}
            onClose={() => setIsAssessmentModalOpen(false)}
            patientId={id || ""}
          />

          {id && (
            <SessionFormModal
              isOpen={isNewSessionModalOpen}
              onClose={() => setIsNewSessionModalOpen(false)}
              patientId={id}
            />
          )}

          {/* Delete Document Confirmation Modal */}
          <Dialog open={isDeleteDocumentOpen} onOpenChange={setIsDeleteDocumentOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirmar Exclusão</DialogTitle>
              </DialogHeader>
              <p>Tem certeza que deseja excluir o documento "{selectedDocument?.name}"? Esta ação não pode ser desfeita.</p>
              <div className="flex justify-end space-x-2 mt-4">
                <Button variant="outline" onClick={() => setIsDeleteDocumentOpen(false)}>
                  Cancelar
                </Button>
                <Button variant="destructive" onClick={confirmDeleteDocument}>
                  Excluir
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  );
};

export default PatientDetail;
