import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePatientStore } from "@/stores/patientStore";
import { Session } from "@/stores/patientStore";
import Header from "@/components/Header";
import SidebarMenu from "@/components/SidebarMenu";
import SessionCard from "@/components/SessionCard";
import SessionEditModal from "@/components/SessionEditModal";
import SessionFormModal from "@/components/SessionFormModal";
import ElectronicRecordModal from "@/components/ElectronicRecordModal";
import PatientEditModal from "@/components/PatientEditModal";
import DocumentUploadModal from "@/components/DocumentUploadModal";
import InitialAssessmentModal from "@/components/InitialAssessmentModal";
import TeleconsultationModal from "@/components/TeleconsultationModal";
import PatientDetailFilters from "@/components/PatientDetailFilters";
import Pagination from "@/components/Pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  FileText, 
  Plus, 
  ArrowLeft, 
  Calendar, 
  Edit, 
  Upload, 
  Trash, 
  Download,
  CreditCard,
  Receipt,
  Check,
  Video
} from "lucide-react";

const ITEMS_PER_PAGE = 10;

const PatientDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { selectedPatient, fetchPatient, isLoading, payments, updatePayment } = usePatientStore();
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const [viewingElectronicRecord, setViewingElectronicRecord] = useState<Session | null>(null);
  const [isEditingPatient, setIsEditingPatient] = useState(false);
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState(false);
  const [isNewSessionModalOpen, setIsNewSessionModalOpen] = useState(false);
  const [isDeleteDocumentOpen, setIsDeleteDocumentOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [isTeleconsultationOpen, setIsTeleconsultationOpen] = useState(false);
  
  // Filters and pagination states
  const [sessionsFilters, setSessionsFilters] = useState({
    searchTerm: "",
    sortBy: "date",
    currentPage: 1
  });
  const [documentsFilters, setDocumentsFilters] = useState({
    searchTerm: "",
    sortBy: "uploadDate",
    filterBy: "all",
    currentPage: 1
  });
  const [financialFilters, setFinancialFilters] = useState({
    searchTerm: "",
    sortBy: "date",
    filterBy: "all",
    currentPage: 1
  });

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

  const handleEditSession = (session: Session) => {
    setEditingSession(session);
  };
  
  const handleViewElectronicRecord = (session: Session) => {
    setViewingElectronicRecord(session);
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

  const handleConfirmPayment = async (paymentId: string) => {
    await updatePayment(paymentId, { status: "paid" });
    toast({
      title: "Pagamento confirmado",
      description: "O status foi atualizado para PAGO e o paciente foi notificado no WhatsApp.",
    });
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

  // Filtered and sorted data
  const filteredSessions = useMemo(() => {
    if (!selectedPatient?.sessions) return [];
    
    let filtered = selectedPatient.sessions.filter(session =>
      session.notes.toLowerCase().includes(sessionsFilters.searchTerm.toLowerCase()) ||
      (session.diagnosis && session.diagnosis.toLowerCase().includes(sessionsFilters.searchTerm.toLowerCase()))
    );

    filtered.sort((a, b) => {
      switch (sessionsFilters.sortBy) {
        case "date":
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "mood":
          return b.mood - a.mood;
        default:
          return 0;
      }
    });

    return filtered;
  }, [selectedPatient?.sessions, sessionsFilters.searchTerm, sessionsFilters.sortBy]);

  const filteredDocuments = useMemo(() => {
    if (!selectedPatient?.documents) return [];
    
    let filtered = selectedPatient.documents.filter(doc => {
      const matchesSearch = doc.name.toLowerCase().includes(documentsFilters.searchTerm.toLowerCase());
      const matchesFilter = documentsFilters.filterBy === "all" || doc.type === documentsFilters.filterBy;
      return matchesSearch && matchesFilter;
    });

    filtered.sort((a, b) => {
      switch (documentsFilters.sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "uploadDate":
          return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
        case "type":
          return a.type.localeCompare(b.type);
        default:
          return 0;
      }
    });

    return filtered;
  }, [selectedPatient?.documents, documentsFilters.searchTerm, documentsFilters.sortBy, documentsFilters.filterBy]);

  const filteredPayments = useMemo(() => {
    const patientPayments = payments.filter(p => p.patientId === selectedPatient?.id);
    
    let filtered = patientPayments.filter(payment => {
      const matchesSearch = payment.description.toLowerCase().includes(financialFilters.searchTerm.toLowerCase());
      const matchesFilter = financialFilters.filterBy === "all" || payment.status === financialFilters.filterBy;
      return matchesSearch && matchesFilter;
    });

    filtered.sort((a, b) => {
      switch (financialFilters.sortBy) {
        case "date":
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "amount":
          return b.amount - a.amount;
        case "status":
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

    return filtered;
  }, [payments, selectedPatient?.id, financialFilters.searchTerm, financialFilters.sortBy, financialFilters.filterBy]);

  // Pagination calculations
  const sessionsTotalPages = Math.ceil(filteredSessions.length / ITEMS_PER_PAGE);
  const paginatedSessions = filteredSessions.slice(
    (sessionsFilters.currentPage - 1) * ITEMS_PER_PAGE,
    sessionsFilters.currentPage * ITEMS_PER_PAGE
  );

  const documentsTotalPages = Math.ceil(filteredDocuments.length / ITEMS_PER_PAGE);
  const paginatedDocuments = filteredDocuments.slice(
    (documentsFilters.currentPage - 1) * ITEMS_PER_PAGE,
    documentsFilters.currentPage * ITEMS_PER_PAGE
  );

  const financialTotalPages = Math.ceil(filteredPayments.length / ITEMS_PER_PAGE);
  const paginatedPayments = filteredPayments.slice(
    (financialFilters.currentPage - 1) * ITEMS_PER_PAGE,
    financialFilters.currentPage * ITEMS_PER_PAGE
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex">
        <div className="w-64 hidden md:block">
          <SidebarMenu />
        </div>
        <div className="flex-1">
          <Header />
          <main className="p-4 md:p-6">
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
      <div className="min-h-screen bg-background flex">
        <div className="w-64 hidden md:block">
          <SidebarMenu />
        </div>
        <div className="flex-1">
          <Header />
          <main className="p-4 md:p-6">
            <div className="text-center py-12">
              <h2 className="text-lg font-medium mb-2">Paciente não encontrado</h2>
              <p className="text-muted-foreground mb-4">
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
    <div className="min-h-screen bg-background flex">
      <div className="w-64 hidden md:block">
        <SidebarMenu />
      </div>
      <div className="flex-1">
        <Header />
        <main className="p-4 md:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex items-center">
              <Button variant="ghost" size="sm" className="mr-2 md:mr-4" onClick={() => navigate("/patients")}>
                <ArrowLeft size={16} className="mr-1" /> <span className="hidden sm:inline">Voltar</span>
              </Button>
              <h1 className="text-xl md:text-2xl font-bold">Detalhes do Paciente</h1>
            </div>
          </div>
  
          <Card className="mb-6">
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col md:flex-row">
                <div className="md:mr-6 mb-4 md:mb-0 flex justify-center md:justify-start">
                  <Avatar className="h-20 w-20 md:h-24 md:w-24">
                    <AvatarImage src={selectedPatient.avatar} alt={selectedPatient.name} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xl md:text-2xl">
                      {getInitials(selectedPatient.name)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                    <div className="text-center md:text-left">
                      <h2 className="text-xl md:text-2xl font-bold mb-1">{selectedPatient.name}</h2>
                      <p className="text-muted-foreground text-sm">{selectedPatient.email}</p>
                    </div>
                    <div className="mt-3 md:mt-0 flex justify-center md:justify-end gap-2">
                      <Button 
                        variant="default" 
                        size="sm" 
                        onClick={() => setIsTeleconsultationOpen(true)}
                      >
                        <Video size={16} className="mr-1" /> <span className="hidden sm:inline">Teleconsulta</span>
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleEditPatient}>
                        <Edit size={16} className="mr-1" /> <span className="hidden sm:inline">Editar</span>
                      </Button>
                    </div>
                  </div>
  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mt-4">
                    <div>
                      <p className="text-muted-foreground text-xs md:text-sm">Idade</p>
                      <p className="font-medium text-sm md:text-base">{calculateAge(selectedPatient.birthdate)} anos</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs md:text-sm">Data de Nascimento</p>
                      <p className="font-medium text-sm md:text-base">{formatDate(selectedPatient.birthdate)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs md:text-sm">Telefone</p>
                      <p className="font-medium text-sm md:text-base">{selectedPatient.phone}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs md:text-sm">Paciente desde</p>
                      <p className="font-medium text-sm md:text-base">{formatDate(selectedPatient.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs md:text-sm">Total de Sessões</p>
                      <p className="font-medium text-sm md:text-base">{selectedPatient.sessions.length}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs md:text-sm">Documentos</p>
                      <p className="font-medium text-sm md:text-base">{selectedPatient.documents.length}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
  
          <Tabs defaultValue="initial-record">
            <TabsList className="mb-6 w-full flex overflow-x-auto">
              <TabsTrigger value="initial-record" className="flex-1 text-xs md:text-sm">Avaliação Inicial</TabsTrigger>
              <TabsTrigger value="sessions" className="flex-1 text-xs md:text-sm">Sessões ({filteredSessions.length})</TabsTrigger>
              <TabsTrigger value="documents" className="flex-1 text-xs md:text-sm">Documentos ({filteredDocuments.length})</TabsTrigger>
              <TabsTrigger value="financial" className="flex-1 text-xs md:text-sm">Financeiro ({filteredPayments.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="initial-record" className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <h2 className="text-lg md:text-xl font-semibold">Avaliação Inicial</h2>
                <Button onClick={() => setIsAssessmentModalOpen(true)} size="sm">
                  <Plus size={16} className="mr-1" /> 
                  {selectedPatient.initialRecord ? "Editar Avaliação" : "Criar Avaliação"}
                </Button>
              </div>
  
              {!selectedPatient.initialRecord ? (
                <div className="text-center py-12 border border-dashed border-border rounded-lg bg-card">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                    <FileText size={24} className="text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">Ainda sem avaliação inicial</h3>
                  <p className="text-muted-foreground mb-4">
                    A avaliação inicial deste paciente ainda não foi registrada.
                  </p>
                  <Button onClick={() => setIsAssessmentModalOpen(true)}>
                    <Plus size={16} className="mr-1" /> Criar avaliação inicial
                  </Button>
                </div>
              ) : (
                <div className="grid gap-4 md:gap-6">
                  <Card>
                    <CardContent className="p-4 md:p-6">
                      <h3 className="text-lg font-medium mb-3">Motivo da Consulta</h3>
                      <p className="text-muted-foreground">{selectedPatient.initialRecord.reasonForConsultation}</p>
                    </CardContent>
                  </Card>
  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <Card>
                      <CardContent className="p-4 md:p-6">
                        <h3 className="text-lg font-medium mb-3">Histórico Familiar</h3>
                        <p className="text-muted-foreground">{selectedPatient.initialRecord.familyHistory}</p>
                      </CardContent>
                    </Card>
  
                    <Card>
                      <CardContent className="p-4 md:p-6">
                        <h3 className="text-lg font-medium mb-3">Histórico Médico</h3>
                        <p className="text-muted-foreground">{selectedPatient.initialRecord.medicalHistory}</p>
                      </CardContent>
                    </Card>
                  </div>
  
                  <Card>
                    <CardContent className="p-4 md:p-6">
                      <h3 className="text-lg font-medium mb-3">Tratamento Anterior</h3>
                      <p className="text-muted-foreground">{selectedPatient.initialRecord.previousTreatment}</p>
                    </CardContent>
                  </Card>
  
                  <Card>
                    <CardContent className="p-4 md:p-6">
                      <h3 className="text-lg font-medium mb-3">Exame do Estado Mental</h3>
                      <p className="text-muted-foreground">{selectedPatient.initialRecord.mentalStatusExam}</p>
                    </CardContent>
                  </Card>
  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <Card>
                      <CardContent className="p-4 md:p-6">
                        <h3 className="text-lg font-medium mb-3">Diagnóstico Inicial</h3>
                        <p className="text-muted-foreground">{selectedPatient.initialRecord.initialDiagnosis}</p>
                      </CardContent>
                    </Card>
  
                    <Card>
                      <CardContent className="p-4 md:p-6">
                        <h3 className="text-lg font-medium mb-3">Plano de Tratamento</h3>
                        <p className="text-muted-foreground">{selectedPatient.initialRecord.treatmentPlan}</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="sessions" className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <h2 className="text-lg md:text-xl font-semibold">Notas de Sessão</h2>
                <Button onClick={() => setIsNewSessionModalOpen(true)} size="sm">
                  <Plus size={16} className="mr-1" /> Nova Sessão
                </Button>
              </div>

              <PatientDetailFilters
                searchTerm={sessionsFilters.searchTerm}
                onSearchChange={(value) => setSessionsFilters(prev => ({ ...prev, searchTerm: value, currentPage: 1 }))}
                sortBy={sessionsFilters.sortBy}
                onSortChange={(value) => setSessionsFilters(prev => ({ ...prev, sortBy: value, currentPage: 1 }))}
                onClearFilters={() => setSessionsFilters({ searchTerm: "", sortBy: "date", currentPage: 1 })}
                type="sessions"
              />
  
              {paginatedSessions.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-border rounded-lg bg-card">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                    <Calendar size={24} className="text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">
                    {sessionsFilters.searchTerm ? "Nenhuma sessão encontrada" : "Ainda sem sessões"}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {sessionsFilters.searchTerm 
                      ? "Tente ajustar os filtros de busca."
                      : "Nenhum registro de sessão foi criado para este paciente ainda."
                    }
                  </p>
                  {!sessionsFilters.searchTerm && (
                    <Button onClick={() => setIsNewSessionModalOpen(true)}>
                      <Plus size={16} className="mr-1" /> Criar primeira sessão
                    </Button>
                  )}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                    {paginatedSessions.map((session) => (
                      <SessionCard 
                        key={session.id} 
                        session={session} 
                        onEdit={() => handleEditSession(session)}
                        onViewDetails={() => handleViewElectronicRecord(session)}
                      />
                    ))}
                  </div>
                  
                  {sessionsTotalPages > 1 && (
                    <Pagination
                      currentPage={sessionsFilters.currentPage}
                      totalPages={sessionsTotalPages}
                      onPageChange={(page) => setSessionsFilters(prev => ({ ...prev, currentPage: page }))}
                    />
                  )}
                </>
              )}
            </TabsContent>
  
            <TabsContent value="documents" className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <h2 className="text-lg md:text-xl font-semibold">Documentos</h2>
                <Button onClick={() => setIsDocumentModalOpen(true)} size="sm">
                  <Upload size={16} className="mr-1" /> Enviar Documento
                </Button>
              </div>

              <PatientDetailFilters
                searchTerm={documentsFilters.searchTerm}
                onSearchChange={(value) => setDocumentsFilters(prev => ({ ...prev, searchTerm: value, currentPage: 1 }))}
                sortBy={documentsFilters.sortBy}
                onSortChange={(value) => setDocumentsFilters(prev => ({ ...prev, sortBy: value, currentPage: 1 }))}
                filterBy={documentsFilters.filterBy}
                onFilterChange={(value) => setDocumentsFilters(prev => ({ ...prev, filterBy: value, currentPage: 1 }))}
                onClearFilters={() => setDocumentsFilters({ searchTerm: "", sortBy: "uploadDate", filterBy: "all", currentPage: 1 })}
                type="documents"
              />
  
              {paginatedDocuments.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-border rounded-lg bg-card">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                    <FileText size={24} className="text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">
                    {documentsFilters.searchTerm ? "Nenhum documento encontrado" : "Ainda sem documentos"}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {documentsFilters.searchTerm 
                      ? "Tente ajustar os filtros de busca."
                      : "Nenhum documento foi enviado para este paciente ainda."
                    }
                  </p>
                  {!documentsFilters.searchTerm && (
                    <Button onClick={() => setIsDocumentModalOpen(true)}>
                      <Upload size={16} className="mr-1" /> Enviar primeiro documento
                    </Button>
                  )}
                </div>
              ) : (
                <>
                  <div className="bg-card rounded-md shadow overflow-hidden">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="min-w-[150px]">Nome</TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead className="hidden sm:table-cell">Data de Envio</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {paginatedDocuments.map((document) => (
                            <TableRow key={document.id}>
                              <TableCell>
                                <div className="flex items-center">
                                  <div className="mr-2">
                                    <FileText size={16} className="text-muted-foreground" />
                                  </div>
                                  <div className="text-sm font-medium truncate max-w-[150px] md:max-w-none">{document.name}</div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-muted">
                                  {document.type}
                                </span>
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground hidden sm:table-cell">
                                {formatDate(document.uploadDate)}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-1">
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-8 w-8 p-0"
                                    onClick={() => handleDownloadDocument(document)}
                                  >
                                    <Download size={14} />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-8 w-8 p-0 text-destructive"
                                    onClick={() => handleDeleteDocument(document)}
                                  >
                                    <Trash size={14} />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                  
                  {documentsTotalPages > 1 && (
                    <Pagination
                      currentPage={documentsFilters.currentPage}
                      totalPages={documentsTotalPages}
                      onPageChange={(page) => setDocumentsFilters(prev => ({ ...prev, currentPage: page }))}
                    />
                  )}
                </>
              )}
            </TabsContent>
  
            <TabsContent value="financial" className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <h2 className="text-lg md:text-xl font-semibold">Financeiro</h2>
              </div>

              <PatientDetailFilters
                searchTerm={financialFilters.searchTerm}
                onSearchChange={(value) => setFinancialFilters(prev => ({ ...prev, searchTerm: value, currentPage: 1 }))}
                sortBy={financialFilters.sortBy}
                onSortChange={(value) => setFinancialFilters(prev => ({ ...prev, sortBy: value, currentPage: 1 }))}
                filterBy={financialFilters.filterBy}
                onFilterChange={(value) => setFinancialFilters(prev => ({ ...prev, filterBy: value, currentPage: 1 }))}
                onClearFilters={() => setFinancialFilters({ searchTerm: "", sortBy: "date", filterBy: "all", currentPage: 1 })}
                type="financial"
              />
              
              <Card>
                <CardContent className="p-4 md:p-6">
                  <div className="overflow-x-auto -mx-4 md:mx-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Data</TableHead>
                          <TableHead>Valor</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="hidden sm:table-cell">Pagamento</TableHead>
                          <TableHead className="hidden md:table-cell">Observações</TableHead>
                          <TableHead>Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedPayments.map((payment) => (
                          <TableRow key={payment.id}>
                            <TableCell className="text-sm">
                              {new Date(payment.date).toLocaleDateString('pt-BR')}
                            </TableCell>
                            <TableCell className="font-medium text-sm">
                              R$ {payment.amount.toFixed(2)}
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(payment.status)}
                            </TableCell>
                            <TableCell className="hidden sm:table-cell text-sm">
                              {getPaymentMethodLabel(payment.method)}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground hidden md:table-cell max-w-[150px] truncate">
                              {payment.notes || (payment.sessionId ? `Sessão ${payment.sessionId}` : "-")}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                {payment.status === "pending" ? (
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    className="h-8 w-8 p-0"
                                    onClick={() => handleConfirmPayment(payment.id)}
                                  >
                                    <Check className="h-3 w-3" />
                                  </Button>
                                ) : null}
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  className="h-8 w-8 p-0"
                                  onClick={() => { setSelectedPayment(payment); setIsReceiptModalOpen(true); }}
                                >
                                  <Receipt className="h-3 w-3" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  
                  {paginatedPayments.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">
                        {financialFilters.searchTerm ? "Nenhum registro encontrado com os filtros selecionados." : "Nenhum registro financeiro encontrado."}
                      </p>
                    </div>
                  )}
                  
                  {financialTotalPages > 1 && (
                    <Pagination
                      currentPage={financialFilters.currentPage}
                      totalPages={financialTotalPages}
                      onPageChange={(page) => setFinancialFilters(prev => ({ ...prev, currentPage: page }))}
                    />
                  )}
                </CardContent>
              </Card>
              
              <Dialog open={isReceiptModalOpen} onOpenChange={setIsReceiptModalOpen}>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Recibo de Pagamento</DialogTitle>
                  </DialogHeader>
                  {selectedPayment && (
                    <div className="space-y-4">
                      <div>
                        <strong>Paciente:</strong> {selectedPatient?.name}
                      </div>
                      <div>
                        <strong>Data:</strong> {new Date(selectedPayment.date).toLocaleDateString('pt-BR')}
                      </div>
                      <div>
                        <strong>Valor:</strong> R$ {selectedPayment.amount.toFixed(2)}
                      </div>
                      <div>
                        <strong>Status:</strong> {getStatusBadge(selectedPayment.status)}
                      </div>
                      <div>
                        <strong>Forma de Pagamento:</strong> {getPaymentMethodLabel(selectedPayment.method)}
                      </div>
                      <div>
                        <strong>Descrição:</strong> {selectedPayment.description}
                      </div>
                      <div>
                        <strong>Serviço Prestado:</strong> Sessão de psicoterapia individual
                      </div>
                      <div>
                        <strong>Recibo:</strong> {selectedPayment.receiptNumber || "-"}
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </TabsContent>
          </Tabs>

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

          {/* Modal de Teleconsulta */}
          {selectedPatient && (
            <TeleconsultationModal
              isOpen={isTeleconsultationOpen}
              onClose={() => setIsTeleconsultationOpen(false)}
              patientId={selectedPatient.id}
              patientName={selectedPatient.name}
              patientPhone={selectedPatient.phone}
              onStartCall={(roomLink) => {
                // O link para o profissional inclui role=professional
                const professionalLink = `${roomLink}&role=professional`;
                window.open(professionalLink, '_blank');
              }}
            />
          )}

          <Dialog open={isDeleteDocumentOpen} onOpenChange={setIsDeleteDocumentOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Confirmar Exclusão</DialogTitle>
              </DialogHeader>
              <p>Tem certeza que deseja excluir o documento "{selectedDocument?.name}"? Esta ação não pode ser desfeita.</p>
              <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setIsDeleteDocumentOpen(false)} className="w-full sm:w-auto">
                  Cancelar
                </Button>
                <Button variant="destructive" onClick={confirmDeleteDocument} className="w-full sm:w-auto">
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
