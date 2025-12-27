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
  Mic, MicOff, Video, VideoOff, PhoneOff, 
  Volume, VolumeX, User as UserIcon, Save,
  FileText, Plus, Upload, Calendar, Edit,
  ClipboardList, Stethoscope,
  TrendingUp, Check, CreditCard, Paperclip
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { usePatientStore, Session, Patient } from '@/stores/patientStore';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import DocumentUploadModal from '@/components/DocumentUploadModal';
import SessionFormModal from '@/components/SessionFormModal';
import SessionEditModal from '@/components/SessionEditModal';

const TeleconsultationRoom = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  
  const patientId = searchParams.get('patientId') || '';
  const roomId = searchParams.get('room') || '';
  const role = searchParams.get('role') || 'patient';
  
  const isProfessional = role === 'professional';
  
  const { patients, addSession, payments, updatePayment } = usePatientStore();
  const patient = patients.find(p => p.id === patientId);

  // Video states
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [audioOn, setAudioOn] = useState(true);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);

  // Modal states
  const [showDocumentUpload, setShowDocumentUpload] = useState(false);
  const [isNewSessionModalOpen, setIsNewSessionModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const [isSaving, setIsSaving] = useState(false);

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

  useEffect(() => {
    let stream: MediaStream | null = null;
    const setupStream = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setLocalStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        toast({
          title: "Erro",
          description: "Não foi possível acessar sua câmera ou microfone.",
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

  const handleEndCall = async () => {
    // Só o profissional pode finalizar
    if (!isProfessional) {
      toast({
        title: "Ação não permitida",
        description: "Apenas o profissional pode finalizar a teleconsulta.",
        variant: "destructive",
      });
      return;
    }

    if (patient && (currentNotes.evolution || currentNotes.annotations)) {
      await saveSession();
    }
    
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-800">Pago</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getMoodEmoji = (mood: number) => {
    const emojis = ["😞", "😕", "😐", "🙂", "😊"];
    return emojis[mood - 1] || "😐";
  };

  const sortedSessions = patient 
    ? [...patient.sessions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    : [];

  // Visão do Paciente - Apenas vídeos
  if (!isProfessional) {
    return (
      <div className="fixed inset-0 w-screen h-screen bg-background flex flex-col">
        {/* Header simples */}
        <div className="p-3 md:p-4 bg-card border-b shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">M</span>
            </div>
            <span className="font-semibold text-lg">mindro</span>
          </div>
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
            Em atendimento
          </Badge>
        </div>

        {/* Área de Vídeos - Responsivo */}
        <div className="flex-1 flex flex-col md:flex-row gap-2 md:gap-4 p-2 md:p-4 overflow-hidden">
          {/* Vídeo Remoto (Profissional) */}
          <div className="flex-1 relative bg-muted rounded-lg overflow-hidden min-h-[200px]">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-16 w-16 md:h-24 md:w-24 rounded-full bg-primary/20 flex items-center justify-center">
                <UserIcon className="h-8 w-8 md:h-12 md:w-12 text-primary" />
              </div>
            </div>
            <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 text-xs rounded">
              Profissional
            </div>
          </div>

          {/* Vídeo Local (Paciente) */}
          <div className="h-32 md:h-auto md:flex-1 relative bg-muted rounded-lg overflow-hidden">
            {videoOn ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-12 w-12 md:h-16 md:w-16 rounded-full bg-primary/20 flex items-center justify-center">
                  <UserIcon className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                </div>
              </div>
            )}
            <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 text-xs rounded">
              Você
            </div>
          </div>
        </div>

        {/* Controles de Vídeo */}
        <div className="p-4 md:p-6 bg-card border-t shrink-0">
          <div className="flex justify-center gap-3 md:gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className={`h-12 w-12 md:h-14 md:w-14 rounded-full ${micOn ? 'bg-muted' : 'bg-destructive text-destructive-foreground'}`}
              onClick={toggleMic}
            >
              {micOn ? <Mic className="h-5 w-5 md:h-6 md:w-6" /> : <MicOff className="h-5 w-5 md:h-6 md:w-6" />}
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className={`h-12 w-12 md:h-14 md:w-14 rounded-full ${videoOn ? 'bg-muted' : 'bg-destructive text-destructive-foreground'}`}
              onClick={toggleVideo}
            >
              {videoOn ? <Video className="h-5 w-5 md:h-6 md:w-6" /> : <VideoOff className="h-5 w-5 md:h-6 md:w-6" />}
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className={`h-12 w-12 md:h-14 md:w-14 rounded-full ${audioOn ? 'bg-muted' : 'bg-destructive text-destructive-foreground'}`}
              onClick={toggleAudio}
            >
              {audioOn ? <Volume className="h-5 w-5 md:h-6 md:w-6" /> : <VolumeX className="h-5 w-5 md:h-6 md:w-6" />}
            </Button>
          </div>
          <p className="text-center text-xs md:text-sm text-muted-foreground mt-4">
            Aguardando o profissional encerrar a sessão...
          </p>
        </div>
      </div>
    );
  }

  // Visão do Profissional - Vídeos + Painel do Paciente
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

  return (
    <div className="fixed inset-0 w-screen h-screen bg-background flex flex-col md:flex-row overflow-hidden">
      {/* Coluna Esquerda - Vídeos */}
      <div className="w-full md:w-72 lg:w-80 flex flex-col bg-card md:border-r shrink-0 h-48 md:h-full">
        <div className="flex md:flex-col flex-1">
          {/* Vídeo Local (Profissional) */}
          <div className="flex-1 relative bg-muted">
            {videoOn ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-muted">
                <div className="h-10 w-10 md:h-14 md:w-14 rounded-full bg-primary/20 flex items-center justify-center">
                  <UserIcon className="h-5 w-5 md:h-7 md:w-7 text-primary" />
                </div>
              </div>
            )}
            <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 text-xs rounded">
              Você
            </div>
          </div>

          {/* Vídeo Remoto (Paciente) */}
          <div className="flex-1 relative bg-muted border-l md:border-l-0 md:border-t">
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <div className="h-10 w-10 md:h-14 md:w-14 rounded-full bg-primary/20 flex items-center justify-center">
                <UserIcon className="h-5 w-5 md:h-7 md:w-7 text-primary" />
              </div>
            </div>
            <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 text-xs rounded">
              {patient.name}
            </div>
          </div>
        </div>

        {/* Controles */}
        <div className="p-2 md:p-3 bg-card border-t">
          <div className="flex justify-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className={`h-9 w-9 md:h-10 md:w-10 rounded-full ${micOn ? '' : 'bg-destructive text-destructive-foreground'}`}
              onClick={toggleMic}
            >
              {micOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className={`h-9 w-9 md:h-10 md:w-10 rounded-full ${videoOn ? '' : 'bg-destructive text-destructive-foreground'}`}
              onClick={toggleVideo}
            >
              {videoOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className={`h-9 w-9 md:h-10 md:w-10 rounded-full ${audioOn ? '' : 'bg-destructive text-destructive-foreground'}`}
              onClick={toggleAudio}
            >
              {audioOn ? <Volume className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
            <Button 
              variant="destructive" 
              size="icon" 
              className="h-9 w-9 md:h-10 md:w-10 rounded-full"
              onClick={handleEndCall}
            >
              <PhoneOff className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Coluna Direita - Painel do Paciente */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-3 md:p-4 border-b bg-card shrink-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="min-w-0">
              <h2 className="text-lg md:text-xl font-bold truncate">{patient.name}</h2>
              <p className="text-xs md:text-sm text-muted-foreground truncate">
                {patient.email} • {patient.phone}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300 text-xs">
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

        {/* Conteúdo com Tabs */}
        <ScrollArea className="flex-1">
          <div className="p-3 md:p-6">
            <Tabs defaultValue="prontuario" className="w-full">
              <TabsList className="mb-4 md:mb-6 w-full flex overflow-x-auto">
                <TabsTrigger value="prontuario" className="flex-1 text-xs md:text-sm">Prontuário</TabsTrigger>
                <TabsTrigger value="initial-record" className="flex-1 text-xs md:text-sm">Avaliação</TabsTrigger>
                <TabsTrigger value="sessions" className="flex-1 text-xs md:text-sm">Sessões</TabsTrigger>
                <TabsTrigger value="documents" className="flex-1 text-xs md:text-sm">Documentos</TabsTrigger>
                <TabsTrigger value="financial" className="flex-1 text-xs md:text-sm">Financeiro</TabsTrigger>
              </TabsList>

              {/* Prontuário - Anotações da Sessão Atual */}
              <TabsContent value="prontuario" className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                {/* Histórico recente de evoluções */}
                {sortedSessions.length > 0 && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Evoluções Anteriores</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {sortedSessions.slice(0, 3).map((session) => (
                          <div key={session.id} className="p-3 border rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <Calendar className="h-3 w-3 text-muted-foreground" />
                              <span className="text-sm font-medium">
                                {format(new Date(session.date), "dd/MM/yyyy")}
                              </span>
                              <span>{getMoodEmoji(session.mood)}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {session.evolution || session.notes || "Sem anotações"}
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Avaliação Inicial */}
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              {/* Sessões */}
              <TabsContent value="sessions" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-sm">Histórico de Sessões</h3>
                  <Button size="sm" onClick={() => setIsNewSessionModalOpen(true)}>
                    <Plus className="h-4 w-4 mr-1" />
                    Nova Sessão
                  </Button>
                </div>

                {sortedSessions.length === 0 ? (
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <Calendar className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                      <p className="text-muted-foreground text-sm">Nenhuma sessão registrada</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {sortedSessions.map((session) => (
                      <Card key={session.id} className="hover:border-primary/30 transition-colors">
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2 mb-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium text-sm">
                                {format(new Date(session.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                              </span>
                              <span className="text-xl">{getMoodEmoji(session.mood)}</span>
                              {session.status && (
                                <Badge variant="outline" className="text-xs">{session.status}</Badge>
                              )}
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={() => setEditingSession(session)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="text-muted-foreground text-sm">
                            {session.evolution || session.notes || "Sem anotações"}
                          </p>
                          {session.diagnosis && (
                            <div className="mt-2">
                              <span className="text-xs font-medium text-primary">Diagnóstico:</span>
                              <p className="text-sm text-muted-foreground">{session.diagnosis}</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Documentos */}
              <TabsContent value="documents" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-sm">Documentos do Paciente</h3>
                  <Button size="sm" onClick={() => setShowDocumentUpload(true)}>
                    <Upload className="h-4 w-4 mr-1" />
                    Adicionar
                  </Button>
                </div>

                {patient.documents.length === 0 ? (
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <Paperclip className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                      <p className="text-muted-foreground text-sm">Nenhum documento anexado</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {patient.documents.map((doc) => (
                      <Card key={doc.id} className="hover:border-primary/30 transition-colors cursor-pointer">
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
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Financeiro */}
              <TabsContent value="financial" className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Resumo Financeiro
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-xs md:text-sm text-muted-foreground">Total de Sessões</p>
                        <p className="text-xl md:text-2xl font-bold">{patient.sessions.length}</p>
                      </div>
                      <div>
                        <p className="text-xs md:text-sm text-muted-foreground">Pagamentos</p>
                        <p className="text-xl md:text-2xl font-bold">{patientPayments.length}</p>
                      </div>
                      <div>
                        <p className="text-xs md:text-sm text-muted-foreground">Pendentes</p>
                        <p className="text-xl md:text-2xl font-bold text-yellow-600">
                          {patientPayments.filter(p => p.status === 'pending').length}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {patientPayments.length > 0 && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Últimos Pagamentos</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto -mx-4 md:mx-0">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="text-xs">Descrição</TableHead>
                              <TableHead className="text-xs">Valor</TableHead>
                              <TableHead className="text-xs">Status</TableHead>
                              <TableHead className="text-xs"></TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {patientPayments.slice(0, 5).map((payment) => (
                              <TableRow key={payment.id}>
                                <TableCell className="font-medium text-sm">{payment.description}</TableCell>
                                <TableCell className="text-sm">R$ {payment.amount.toFixed(2)}</TableCell>
                                <TableCell>{getStatusBadge(payment.status)}</TableCell>
                                <TableCell>
                                  {payment.status === 'pending' && (
                                    <Button 
                                      size="sm" 
                                      variant="ghost"
                                      className="h-8 w-8 p-0"
                                      onClick={() => handleConfirmPayment(payment.id)}
                                    >
                                      <Check className="h-4 w-4" />
                                    </Button>
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
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

      {isNewSessionModalOpen && (
        <SessionFormModal
          isOpen={isNewSessionModalOpen}
          onClose={() => setIsNewSessionModalOpen(false)}
          patientId={patientId}
        />
      )}

      {editingSession && (
        <SessionEditModal
          isOpen={!!editingSession}
          onClose={() => setEditingSession(null)}
          session={editingSession}
          patientId={patientId}
        />
      )}
    </div>
  );
};

export default TeleconsultationRoom;
