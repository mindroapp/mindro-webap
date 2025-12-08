import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  Mic, MicOff, Video, VideoOff, PhoneOff, 
  Volume, VolumeX, User as UserIcon, Save,
  FileText, Plus, Upload
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { usePatientStore, Session } from '@/stores/patientStore';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import DocumentUploadModal from '@/components/DocumentUploadModal';

const TeleconsultationRoom = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const patientId = searchParams.get('patientId') || '';
  const roomId = searchParams.get('room') || '';
  
  const { patients, addSession, updateSession } = usePatientStore();
  const patient = patients.find(p => p.id === patientId);

  // Video states
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [audioOn, setAudioOn] = useState(true);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);

  // Session notes states
  const [currentNotes, setCurrentNotes] = useState({
    evolution: '',
    privateNotes: '',
    diagnosis: '',
    therapeuticPlan: '',
    annotations: ''
  });

  const [showDocumentUpload, setShowDocumentUpload] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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
    // Salva a sessão antes de encerrar
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
    <div className="fixed inset-0 w-screen h-screen bg-background flex overflow-hidden">
      {/* Coluna Esquerda - Vídeos */}
      <div className="w-80 flex flex-col bg-card border-r shrink-0">
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
              <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
                <UserIcon className="h-8 w-8 text-primary" />
              </div>
            </div>
          )}
          <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 text-xs rounded">
            Você
          </div>
        </div>

        {/* Vídeo Remoto (Paciente) */}
        <div className="flex-1 relative bg-muted border-t">
          <div className="absolute inset-0 flex items-center justify-center bg-muted">
            <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
              <UserIcon className="h-8 w-8 text-primary" />
            </div>
          </div>
          <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 text-xs rounded">
            {patient.name}
          </div>
        </div>

        {/* Controles */}
        <div className="p-4 bg-card border-t">
          <div className="flex justify-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className={`rounded-full ${micOn ? '' : 'bg-destructive text-destructive-foreground'}`}
              onClick={toggleMic}
            >
              {micOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className={`rounded-full ${videoOn ? '' : 'bg-destructive text-destructive-foreground'}`}
              onClick={toggleVideo}
            >
              {videoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className={`rounded-full ${audioOn ? '' : 'bg-destructive text-destructive-foreground'}`}
              onClick={toggleAudio}
            >
              {audioOn ? <Volume className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
            </Button>
            <Button 
              variant="destructive" 
              size="icon" 
              className="rounded-full"
              onClick={handleEndCall}
            >
              <PhoneOff className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Coluna Direita - Painel do Paciente */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b bg-card shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">{patient.name}</h2>
              <p className="text-sm text-muted-foreground">
                {patient.email} • {patient.phone}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                Em atendimento
              </Badge>
              <Button 
                size="sm" 
                onClick={saveSession}
                disabled={isSaving}
              >
                <Save className="h-4 w-4 mr-1" />
                {isSaving ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </div>
        </div>

        {/* Conteúdo com Tabs */}
        <ScrollArea className="flex-1">
          <div className="p-6">
            <Tabs defaultValue="prontuario" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="prontuario">Prontuário</TabsTrigger>
                <TabsTrigger value="historico">Histórico</TabsTrigger>
                <TabsTrigger value="documentos">Documentos</TabsTrigger>
                <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
              </TabsList>

              {/* Prontuário Eletrônico */}
              <TabsContent value="prontuario" className="space-y-4">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label>Evolução</Label>
                    <Textarea 
                      placeholder="Registre a evolução do paciente nesta sessão..."
                      value={currentNotes.evolution}
                      onChange={(e) => setCurrentNotes(prev => ({ ...prev, evolution: e.target.value }))}
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Anotações Privadas</Label>
                    <Textarea 
                      placeholder="Anotações visíveis apenas para você..."
                      value={currentNotes.privateNotes}
                      onChange={(e) => setCurrentNotes(prev => ({ ...prev, privateNotes: e.target.value }))}
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Diagnóstico</Label>
                      <Input 
                        placeholder="CID-10 ou descrição"
                        value={currentNotes.diagnosis}
                        onChange={(e) => setCurrentNotes(prev => ({ ...prev, diagnosis: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Plano Terapêutico</Label>
                      <Input 
                        placeholder="Plano de tratamento"
                        value={currentNotes.therapeuticPlan}
                        onChange={(e) => setCurrentNotes(prev => ({ ...prev, therapeuticPlan: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Anotações da Sessão</Label>
                    <Textarea 
                      placeholder="Anotações gerais sobre a sessão..."
                      value={currentNotes.annotations}
                      onChange={(e) => setCurrentNotes(prev => ({ ...prev, annotations: e.target.value }))}
                      rows={4}
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Histórico de Sessões */}
              <TabsContent value="historico" className="space-y-4">
                <div className="space-y-3">
                  {patient.sessions.length === 0 ? (
                    <Card>
                      <CardContent className="pt-6 text-center text-muted-foreground">
                        <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        Nenhuma sessão anterior registrada
                      </CardContent>
                    </Card>
                  ) : (
                    patient.sessions.slice(0, 5).map((session) => (
                      <Card key={session.id}>
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between mb-2">
                            <span className="font-medium text-sm">
                              {format(new Date(session.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                            </span>
                            {session.status && (
                              <Badge variant="outline" className="text-xs">
                                {session.status}
                              </Badge>
                            )}
                          </div>
                          {session.notes && (
                            <p className="text-sm text-muted-foreground mb-2">{session.notes}</p>
                          )}
                          {session.evolution && (
                            <div className="mt-2">
                              <span className="text-xs font-medium text-primary">Evolução:</span>
                              <p className="text-sm text-muted-foreground">{session.evolution}</p>
                            </div>
                          )}
                          {session.diagnosis && (
                            <div className="mt-2">
                              <span className="text-xs font-medium text-primary">Diagnóstico:</span>
                              <p className="text-sm text-muted-foreground">{session.diagnosis}</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>

              {/* Documentos */}
              <TabsContent value="documentos" className="space-y-4">
                <Button onClick={() => setShowDocumentUpload(true)} size="sm">
                  <Upload className="h-4 w-4 mr-1" />
                  Adicionar Documento
                </Button>
                
                <div className="space-y-3">
                  {patient.documents.length === 0 ? (
                    <Card>
                      <CardContent className="pt-6 text-center text-muted-foreground">
                        <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        Nenhum documento anexado
                      </CardContent>
                    </Card>
                  ) : (
                    patient.documents.map((doc) => (
                      <Card key={doc.id} className="cursor-pointer hover:bg-accent">
                        <CardContent className="pt-4">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-primary" />
                            <div>
                              <p className="font-medium text-sm">{doc.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {format(new Date(doc.uploadDate), "dd/MM/yyyy")}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>

              {/* Financeiro */}
              <TabsContent value="financeiro" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Resumo Financeiro</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Total de Sessões</p>
                        <p className="text-2xl font-bold">{patient.sessions.length}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Documentos</p>
                        <p className="text-2xl font-bold">{patient.documents.length}</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-4">
                      Para gestão financeira completa, acesse os detalhes do paciente.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
      </div>

      {/* Modal de Upload de Documento */}
      <DocumentUploadModal
        isOpen={showDocumentUpload}
        onClose={() => setShowDocumentUpload(false)}
        patientId={patientId}
      />
    </div>
  );
};

export default TeleconsultationRoom;
