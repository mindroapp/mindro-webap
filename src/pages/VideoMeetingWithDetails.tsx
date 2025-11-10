import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mic, MicOff, Video, VideoOff, PhoneOff, Volume, VolumeX, Camera, User as UserIcon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { usePatientStore } from '@/stores/patientStore';
import { ScrollArea } from '@/components/ui/scroll-area';
import DocumentUploadModal from '@/components/DocumentUploadModal';
import DocumentViewModal from '@/components/DocumentViewModal';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const VideoMeetingWithDetails = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const patientId = searchParams.get('patientId') || 'p1';
  const { patients } = usePatientStore();
  const patient = patients.find(p => p.id === patientId);

  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [audioOn, setAudioOn] = useState(true);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);

  const [showDocumentUpload, setShowDocumentUpload] = useState(false);
  const [showDocumentView, setShowDocumentView] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);

  const patientSessions = patient?.sessions || [];
  const patientDocuments = patient?.documents || [];

  useEffect(() => {
    let stream: MediaStream | null = null;
    const setupStream = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setLocalStream(stream);
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

  const handleEndCall = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    toast({
      title: "Reunião encerrada",
      description: "Redirecionando para os detalhes do paciente...",
    });
    navigate(`/patients/${patientId}`);
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
      <div className="flex items-center justify-center min-h-screen">
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
      <div className="w-80 flex flex-col bg-card border-r">
        {/* Vídeo Local */}
        <div className="flex-1 relative bg-muted">
          <AspectRatio ratio={4/3} className="w-full h-full">
            {videoOn ? (
              <video
                ref={el => { if (el && localStream) el.srcObject = localStream; }}
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
          </AspectRatio>
          <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 text-xs rounded">
            Você
          </div>
        </div>

        {/* Vídeo Remoto */}
        <div className="flex-1 relative bg-muted border-t">
          <AspectRatio ratio={4/3} className="w-full h-full">
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
                <UserIcon className="h-8 w-8 text-primary" />
              </div>
            </div>
          </AspectRatio>
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

      {/* Coluna Direita - Detalhes do Paciente */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-4 border-b bg-card">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{patient.name}</h2>
              <p className="text-sm text-muted-foreground">
                {patient.email} • {patient.phone}
              </p>
            </div>
            <Badge variant="outline">Em atendimento</Badge>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-6">
            <Tabs defaultValue="avaliacao" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="avaliacao">Avaliação</TabsTrigger>
                <TabsTrigger value="sessoes">Sessões</TabsTrigger>
                <TabsTrigger value="documentos">Documentos</TabsTrigger>
                <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
              </TabsList>

              <TabsContent value="avaliacao" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Informações do Paciente</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Email:</p>
                      <p className="font-medium">{patient.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Telefone:</p>
                      <p className="font-medium">{patient.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Data de Nascimento:</p>
                      <p className="font-medium">{format(new Date(patient.birthdate), "dd/MM/yyyy")}</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="sessoes" className="space-y-4">
                <div className="space-y-3">
                  {patientSessions.length === 0 ? (
                    <Card>
                      <CardContent className="pt-6 text-center text-muted-foreground">
                        Nenhuma sessão registrada
                      </CardContent>
                    </Card>
                  ) : (
                    patientSessions.map((session) => (
                      <Card key={session.id}>
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <p className="font-medium">
                                {format(new Date(session.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                              </p>
                              <p className="text-sm text-muted-foreground">{session.notes}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="documentos" className="space-y-4">
                <Button onClick={() => setShowDocumentUpload(true)}>
                  Adicionar Documento
                </Button>
                
                <div className="space-y-3">
                  {patientDocuments.map((doc) => (
                    <Card 
                      key={doc.id} 
                      className="cursor-pointer hover:bg-accent"
                      onClick={() => {
                        setSelectedDocument(doc);
                        setShowDocumentView(true);
                      }}
                    >
                      <CardContent className="pt-6">
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-sm text-muted-foreground">{doc.type}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="financeiro" className="space-y-4">
                <Card>
                  <CardContent className="pt-6 text-center text-muted-foreground">
                    Informações financeiras disponíveis em Detalhes do Paciente
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
      </div>

      {/* Modais */}
      <DocumentUploadModal
        isOpen={showDocumentUpload}
        onClose={() => setShowDocumentUpload(false)}
        patientId={patientId}
      />

      {selectedDocument && (
        <DocumentViewModal
          isOpen={showDocumentView}
          onClose={() => {
            setShowDocumentView(false);
            setSelectedDocument(null);
          }}
          documents={patientDocuments.map(d => d.url)}
        />
      )}
    </div>
  );
};

export default VideoMeetingWithDetails;
