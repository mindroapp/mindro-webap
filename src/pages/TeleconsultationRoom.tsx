import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  User as UserIcon, Save,
  FileText, Plus, Upload, Calendar, Eye,
  ClipboardList, Stethoscope,
  TrendingUp, Check, CreditCard, Receipt
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { usePatientStore, Session, Patient, Document } from '@/stores/patientStore';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import DocumentUploadModal from '@/components/DocumentUploadModal';
import { 
  SessionViewModal, 
  CallEndedScreen, 
  DocumentPreviewModal,
  VideoControls 
} from '@/components/teleconsultation';

const TeleconsultationRoom = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  
  const patientId = searchParams.get('patientId') || '';
  const roomId = searchParams.get('room') || '';
  const role = searchParams.get('role') || 'patient';
  
  const isProfessional = role === 'professional';
  
  const { patients, addSession, payments, updatePayment, generateReceipt } = usePatientStore();
  const patient = patients.find(p => p.id === patientId);

  // Video states
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [audioOn, setAudioOn] = useState(true);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [callEnded, setCallEnded] = useState(false);

  // Modal states
  const [showDocumentUpload, setShowDocumentUpload] = useState(false);
  const [viewingSession, setViewingSession] = useState<Session | null>(null);
  const [viewingDocument, setViewingDocument] = useState<Document | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);

  // Session notes for current teleconsultation
  const [currentNotes, setCurrentNotes] = useState({
    evolution: '',
    privateNotes: '',
    diagnosis: '',
    therapeuticPlan: '',
    annotations: ''
  });

  // Patient payments
  const patientPayments = useMemo(() => {
    return payments.filter(p => p.patientId === patient?.id);
  }, [payments, patient?.id]);

  // Initialize video stream
  useEffect(() => {
    let stream: MediaStream | null = null;
    
    const setupStream = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: true 
        });
        setLocalStream(stream);
        
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing media devices:", err);
        toast({
          title: "Erro ao acessar dispositivos",
          description: "Não foi possível acessar sua câmera ou microfone. Verifique as permissões.",
          variant: "destructive",
        });
      }
    };
    
    setupStream();
    
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [toast]);

  // Sync video stream with ref when videoOn changes
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream, videoOn]);

  const handleEndCall = async () => {
    // Only professional can end the call
    if (!isProfessional) {
      toast({
        title: "Ação não permitida",
        description: "Aguarde o profissional encerrar a teleconsulta.",
        variant: "destructive",
      });
      return;
    }

    // Save session if there are notes
    if (patient && (currentNotes.evolution || currentNotes.annotations)) {
      await saveSession();
    }
    
    // Stop all media tracks
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    
    toast({
      title: "Teleconsulta encerrada",
      description: "Redirecionando para os detalhes do paciente...",
    });
    
    navigate(`/patients/${patientId}`);
  };

  const saveSession = async () => {
    if (!patient) return;
    
    setIsSaving(true);
    try {
      const sessionData: Omit<Session, 'id'> = {
        patientId: patient.id,
        date: new Date().toISOString(),
        notes: currentNotes.annotations,
        mood: 3,
        objectives: '',
        interventions: '',
        nextSteps: '',
        evolution: currentNotes.evolution,
        privateNotes: currentNotes.privateNotes,
        diagnosis: currentNotes.diagnosis,
        clinicalNotes: currentNotes.therapeuticPlan,
        status: 'Realizada'
      };
      
      await addSession(patient.id, sessionData);
      
      toast({
        title: "Sessão salva",
        description: "As anotações foram salvas com sucesso.",
      });

      setCurrentNotes({
        evolution: '',
        privateNotes: '',
        diagnosis: '',
        therapeuticPlan: '',
        annotations: ''
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível salvar a sessão.",
        variant: "destructive",
      });
    }
    setIsSaving(false);
  };

  const toggleMic = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !micOn;
      });
    }
    setMicOn(!micOn);
  };

  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = !videoOn;
      });
    }
    setVideoOn(!videoOn);
  };

  const toggleAudio = () => setAudioOn(!audioOn);

  const handleConfirmPayment = async (paymentId: string) => {
    await updatePayment(paymentId, { status: "paid" });
    toast({
      title: "Pagamento confirmado",
      description: "O status foi atualizado para PAGO.",
    });
  };

  const handleGenerateReceipt = async (payment: any) => {
    try {
      if (!payment.receiptNumber) {
        await generateReceipt(payment.id);
      }
      setSelectedPayment(payment);
      setIsReceiptModalOpen(true);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível gerar o recibo.",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Pago</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Pendente</Badge>;
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

  const getMoodEmoji = (mood: number) => {
    const emojis = ["😞", "😕", "😐", "🙂", "😊"];
    return emojis[mood - 1] || "😐";
  };

  const sortedSessions = patient 
    ? [...patient.sessions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    : [];

  // Patient View - Show call ended screen
  if (!isProfessional && callEnded) {
    return (
      <CallEndedScreen 
        onClose={() => navigate('/')}
      />
    );
  }

  // Patient View - Video call interface (Google Meet style)
  if (!isProfessional) {
    return (
      <div className="fixed inset-0 w-screen h-screen bg-background flex flex-col">
        {/* Header */}
        <div className="px-4 py-3 bg-card border-b shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">M</span>
            </div>
            <span className="font-semibold text-lg hidden sm:inline">mindro</span>
          </div>
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300 dark:bg-green-900 dark:text-green-200 dark:border-green-700">
            Em atendimento
          </Badge>
        </div>

        {/* Video Area - Google Meet style layout */}
        <div className="flex-1 relative bg-muted overflow-hidden">
          {/* Remote Video (Professional) - Main focus */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-full max-w-4xl mx-auto">
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              {/* Placeholder when no remote video */}
              <div className="absolute inset-0 flex items-center justify-center bg-muted">
                <div className="h-24 w-24 sm:h-32 sm:w-32 rounded-full bg-primary/20 flex items-center justify-center">
                  <UserIcon className="h-12 w-12 sm:h-16 sm:w-16 text-primary" />
                </div>
              </div>
              <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm text-foreground px-3 py-1.5 text-sm rounded-lg">
                Profissional
              </div>
            </div>
          </div>

          {/* Local Video (Patient) - Picture in Picture style */}
          <div className="absolute bottom-4 right-4 w-28 h-36 sm:w-40 sm:h-52 rounded-xl overflow-hidden shadow-xl border-2 border-background">
            {videoOn ? (
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <UserIcon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
              </div>
            )}
            <div className="absolute bottom-2 left-2 bg-background/80 backdrop-blur-sm text-foreground px-2 py-0.5 text-xs rounded">
              Você
            </div>
          </div>
        </div>

        {/* Video Controls */}
        <div className="p-4 sm:p-6 bg-card border-t shrink-0">
          <VideoControls
            micOn={micOn}
            videoOn={videoOn}
            audioOn={audioOn}
            onToggleMic={toggleMic}
            onToggleVideo={toggleVideo}
            onToggleAudio={toggleAudio}
            showEndCall={false}
            size="lg"
          />
          <p className="text-center text-xs sm:text-sm text-muted-foreground mt-4">
            Aguardando o profissional encerrar a sessão...
          </p>
        </div>
      </div>
    );
  }

  // Professional View - Patient not found
  if (!patient) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Card>
          <CardContent className="pt-6">
            <p>Paciente não encontrado</p>
            <Button onClick={() => navigate('/patients')} className="mt-4">
              Voltar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Professional View - Full interface with patient panel
  return (
    <div className="fixed inset-0 w-screen h-screen bg-background flex flex-col lg:flex-row overflow-hidden">
      {/* Left Column - Videos (Google Meet style for professional) */}
      <div className="w-full lg:w-80 xl:w-96 flex flex-col bg-card lg:border-r shrink-0 h-44 sm:h-52 lg:h-full">
        <div className="flex lg:flex-col flex-1 relative">
          {/* Remote Video (Patient) - Main focus for professional */}
          <div className="flex-[2] lg:flex-1 relative bg-muted">
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            {/* Placeholder when no remote video */}
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <div className="h-12 w-12 lg:h-20 lg:w-20 rounded-full bg-primary/20 flex items-center justify-center">
                <UserIcon className="h-6 w-6 lg:h-10 lg:w-10 text-primary" />
              </div>
            </div>
            <div className="absolute top-2 left-2 bg-background/80 backdrop-blur-sm text-foreground px-2 py-1 text-xs rounded-lg">
              {patient.name}
            </div>
          </div>

          {/* Local Video (Professional) - Smaller */}
          <div className="flex-1 lg:flex-none lg:h-32 relative bg-muted border-l lg:border-l-0 lg:border-t">
            {videoOn ? (
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-muted">
                <div className="h-8 w-8 lg:h-10 lg:w-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <UserIcon className="h-4 w-4 lg:h-5 lg:w-5 text-primary" />
                </div>
              </div>
            )}
            <div className="absolute top-2 left-2 bg-background/80 backdrop-blur-sm text-foreground px-2 py-1 text-xs rounded-lg">
              Você
            </div>
          </div>
        </div>

        {/* Video Controls */}
        <div className="p-3 bg-card border-t">
          <VideoControls
            micOn={micOn}
            videoOn={videoOn}
            audioOn={audioOn}
            onToggleMic={toggleMic}
            onToggleVideo={toggleVideo}
            onToggleAudio={toggleAudio}
            onEndCall={handleEndCall}
            showEndCall={true}
            size="sm"
          />
        </div>
      </div>

      {/* Right Column - Patient Panel */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-3 lg:p-4 border-b bg-card shrink-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="min-w-0">
              <h2 className="text-lg lg:text-xl font-bold truncate">{patient.name}</h2>
              <p className="text-xs lg:text-sm text-muted-foreground truncate">
                {patient.email} • {patient.phone}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300 dark:bg-green-900 dark:text-green-200 dark:border-green-700 text-xs">
                Em atendimento
              </Badge>
              <Button 
                size="sm" 
                onClick={saveSession}
                disabled={isSaving}
              >
                <Save className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">{isSaving ? 'Salvando...' : 'Salvar'}</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Content with Tabs */}
        <ScrollArea className="flex-1">
          <div className="p-3 lg:p-6">
            <Tabs defaultValue="prontuario" className="w-full">
              <TabsList className="mb-4 lg:mb-6 w-full grid grid-cols-4">
                <TabsTrigger value="prontuario" className="text-xs lg:text-sm">Prontuário</TabsTrigger>
                <TabsTrigger value="initial-record" className="text-xs lg:text-sm">Avaliação</TabsTrigger>
                <TabsTrigger value="documents" className="text-xs lg:text-sm">Documentos</TabsTrigger>
                <TabsTrigger value="financial" className="text-xs lg:text-sm">Financeiro</TabsTrigger>
              </TabsList>

              {/* Prontuário - Current Session Notes */}
              <TabsContent value="prontuario" className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      Registro da Sessão Atual
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm">Evolução</Label>
                      <Textarea 
                        placeholder="Registre a evolução do paciente nesta sessão..."
                        value={currentNotes.evolution}
                        onChange={(e) => setCurrentNotes(prev => ({ ...prev, evolution: e.target.value }))}
                        rows={3}
                        className="text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2 text-sm">
                          <Stethoscope className="h-3 w-3" />
                          Diagnóstico
                        </Label>
                        <Input 
                          placeholder="CID-10 ou descrição"
                          value={currentNotes.diagnosis}
                          onChange={(e) => setCurrentNotes(prev => ({ ...prev, diagnosis: e.target.value }))}
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2 text-sm">
                          <ClipboardList className="h-3 w-3" />
                          Plano Terapêutico
                        </Label>
                        <Input 
                          placeholder="Plano de tratamento"
                          value={currentNotes.therapeuticPlan}
                          onChange={(e) => setCurrentNotes(prev => ({ ...prev, therapeuticPlan: e.target.value }))}
                          className="text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm">Anotações da Sessão</Label>
                      <Textarea 
                        placeholder="Anotações gerais sobre a sessão..."
                        value={currentNotes.annotations}
                        onChange={(e) => setCurrentNotes(prev => ({ ...prev, annotations: e.target.value }))}
                        rows={3}
                        className="text-sm"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Previous evolutions */}
                {sortedSessions.length > 0 && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Evoluções Anteriores</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {sortedSessions.slice(0, 5).map((session) => (
                          <div 
                            key={session.id} 
                            className="p-3 border rounded-lg hover:border-primary/30 transition-colors cursor-pointer"
                            onClick={() => setViewingSession(session)}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-3 w-3 text-muted-foreground" />
                                <span className="text-sm font-medium">
                                  {format(new Date(session.date), "dd/MM/yyyy")}
                                </span>
                                <span>{getMoodEmoji(session.mood)}</span>
                              </div>
                              <Button variant="ghost" size="sm" className="h-7 px-2">
                                <Eye className="h-3 w-3 mr-1" />
                                <span className="text-xs">Detalhes</span>
                              </Button>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {session.evolution || session.notes || "Sem anotações"}
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Initial Record */}
              <TabsContent value="initial-record" className="space-y-4">
                {!patient.initialRecord ? (
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <FileText className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                      <p className="text-muted-foreground">
                        Avaliação inicial não registrada
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    <Card>
                      <CardContent className="pt-4">
                        <h3 className="font-medium mb-2 text-sm">Motivo da Consulta</h3>
                        <p className="text-muted-foreground text-sm">{patient.initialRecord.reasonForConsultation}</p>
                      </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Card>
                        <CardContent className="pt-4">
                          <h3 className="font-medium mb-2 text-sm">Histórico Familiar</h3>
                          <p className="text-muted-foreground text-sm">{patient.initialRecord.familyHistory}</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-4">
                          <h3 className="font-medium mb-2 text-sm">Histórico Médico</h3>
                          <p className="text-muted-foreground text-sm">{patient.initialRecord.medicalHistory}</p>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Card>
                        <CardContent className="pt-4">
                          <h3 className="font-medium mb-2 text-sm">Diagnóstico Inicial</h3>
                          <p className="text-muted-foreground text-sm">{patient.initialRecord.initialDiagnosis}</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-4">
                          <h3 className="font-medium mb-2 text-sm">Plano de Tratamento</h3>
                          <p className="text-muted-foreground text-sm">{patient.initialRecord.treatmentPlan}</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* Documents */}
              <TabsContent value="documents" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-sm">Documentos do Paciente</h3>
                  <Button size="sm" onClick={() => setShowDocumentUpload(true)}>
                    <Plus className="h-4 w-4 mr-1" />
                    Adicionar
                  </Button>
                </div>

                {patient.documents.length === 0 ? (
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <FileText className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                      <p className="text-muted-foreground text-sm">Nenhum documento anexado</p>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="mt-3"
                        onClick={() => setShowDocumentUpload(true)}
                      >
                        <Upload className="h-4 w-4 mr-1" />
                        Enviar documento
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {patient.documents.map((doc) => (
                      <Card 
                        key={doc.id} 
                        className="hover:border-primary/30 transition-colors cursor-pointer"
                        onClick={() => setViewingDocument(doc)}
                      >
                        <CardContent className="pt-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                              <FileText className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate text-sm">{doc.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {format(new Date(doc.uploadDate), "dd/MM/yyyy")} • {doc.type.toUpperCase()}
                              </p>
                            </div>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 shrink-0">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Financial */}
              <TabsContent value="financial" className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-primary" />
                      Resumo Financeiro
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-xs lg:text-sm text-muted-foreground">Total de Sessões</p>
                        <p className="text-xl lg:text-2xl font-bold">{patient.sessions.length}</p>
                      </div>
                      <div>
                        <p className="text-xs lg:text-sm text-muted-foreground">Pagamentos</p>
                        <p className="text-xl lg:text-2xl font-bold">{patientPayments.length}</p>
                      </div>
                      <div>
                        <p className="text-xs lg:text-sm text-muted-foreground">Pendentes</p>
                        <p className="text-xl lg:text-2xl font-bold text-yellow-600">
                          {patientPayments.filter(p => p.status === 'pending').length}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {patientPayments.length > 0 && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Histórico de Pagamentos</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto -mx-4 lg:mx-0">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="text-xs">Data</TableHead>
                              <TableHead className="text-xs">Descrição</TableHead>
                              <TableHead className="text-xs">Valor</TableHead>
                              <TableHead className="text-xs">Status</TableHead>
                              <TableHead className="text-xs">Ações</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {patientPayments.map((payment) => (
                              <TableRow key={payment.id}>
                                <TableCell className="text-sm">
                                  {format(new Date(payment.date), "dd/MM/yy")}
                                </TableCell>
                                <TableCell className="font-medium text-sm truncate max-w-[100px]">
                                  {payment.description}
                                </TableCell>
                                <TableCell className="text-sm">
                                  R$ {payment.amount.toFixed(2)}
                                </TableCell>
                                <TableCell>{getStatusBadge(payment.status)}</TableCell>
                                <TableCell>
                                  <div className="flex gap-1">
                                    {payment.status === 'pending' && (
                                      <Button 
                                        size="sm" 
                                        variant="ghost"
                                        className="h-7 w-7 p-0"
                                        onClick={() => handleConfirmPayment(payment.id)}
                                        title="Confirmar pagamento"
                                      >
                                        <Check className="h-3 w-3" />
                                      </Button>
                                    )}
                                    <Button 
                                      size="sm" 
                                      variant="ghost"
                                      className="h-7 w-7 p-0"
                                      onClick={() => handleGenerateReceipt(payment)}
                                      title="Gerar recibo"
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
                    </CardContent>
                  </Card>
                )}

                {patientPayments.length === 0 && (
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <CreditCard className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                      <p className="text-muted-foreground text-sm">Nenhum pagamento registrado</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
      </div>

      {/* Modals */}
      <DocumentUploadModal
        isOpen={showDocumentUpload}
        onClose={() => setShowDocumentUpload(false)}
        patientId={patientId}
      />

      {viewingSession && (
        <SessionViewModal
          session={viewingSession}
          isOpen={!!viewingSession}
          onClose={() => setViewingSession(null)}
        />
      )}

      {viewingDocument && (
        <DocumentPreviewModal
          document={viewingDocument}
          isOpen={!!viewingDocument}
          onClose={() => setViewingDocument(null)}
        />
      )}

      {/* Receipt Modal */}
      {isReceiptModalOpen && selectedPayment && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-lg">Recibo de Pagamento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div><strong>Paciente:</strong> {patient?.name}</div>
              <div><strong>Data:</strong> {format(new Date(selectedPayment.date), "dd/MM/yyyy")}</div>
              <div><strong>Valor:</strong> R$ {selectedPayment.amount.toFixed(2)}</div>
              <div><strong>Status:</strong> {getStatusBadge(selectedPayment.status)}</div>
              <div><strong>Forma de Pagamento:</strong> {getPaymentMethodLabel(selectedPayment.method)}</div>
              <div><strong>Descrição:</strong> {selectedPayment.description}</div>
              <div><strong>Recibo:</strong> {selectedPayment.receiptNumber || "-"}</div>
              <Button 
                className="w-full mt-4" 
                onClick={() => setIsReceiptModalOpen(false)}
              >
                Fechar
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TeleconsultationRoom;
