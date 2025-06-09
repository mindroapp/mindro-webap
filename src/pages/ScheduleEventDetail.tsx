import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePatientStore, ScheduleEvent } from "@/stores/patientStore";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import SidebarMenu from "@/components/SidebarMenu";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { format, parseISO } from "date-fns";
import { ArrowLeft, Clock, Calendar as CalendarIcon, MessageSquare, Video, Edit, Copy, Check } from "lucide-react";

const ScheduleEventDetail = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const [event, setEvent] = useState<ScheduleEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [videoLink, setVideoLink] = useState("");
  const [whatsappMessage, setWhatsappMessage] = useState("");
  const [isVideoLinkCopied, setIsVideoLinkCopied] = useState(false);
  
  const { scheduleEvents, updateScheduleEvent } = usePatientStore();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (eventId && scheduleEvents) {
      const foundEvent = scheduleEvents.find(e => e.id === eventId);
      if (foundEvent) {
        setEvent(foundEvent);
        setVideoLink(foundEvent.videoLink || "");
        // Cria uma mensagem padrão para o WhatsApp
        setWhatsappMessage(
          `Olá ${foundEvent.patientName}, este é um lembrete para sua consulta no dia ${format(
            parseISO(foundEvent.date), 
            "d 'de' MMMM 'de' yyyy"
          )} às ${format(parseISO(foundEvent.date), "HH:mm")}.`
        );
      }
      setLoading(false);
    }
  }, [eventId, scheduleEvents]);

  const handleVideoLinkSave = async () => {
    if (!event) return;
    
    try {
      await updateScheduleEvent(event.id, { videoLink });
      toast({
        title: "Sucesso",
        description: "O link da videochamada foi salvo com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao salvar o link da videochamada.",
        variant: "destructive",
      });
    }
  };

  const generateWhatsappLink = () => {
    if (!event) return "";
    
    // Formata o número de telefone removendo caracteres não numéricos
    const phone = event.patientPhone?.replace(/\D/g, "") || "";
    
    // Cria a URL do WhatsApp
    return `https://wa.me/${phone}?text=${encodeURIComponent(whatsappMessage)}`;
  };

  const copyVideoLink = () => {
    if (videoLink) {
      navigator.clipboard.writeText(videoLink);
      setIsVideoLinkCopied(true);
      setTimeout(() => setIsVideoLinkCopied(false), 3000);
      toast({
        title: "Copiado",
        description: "O link da videochamada foi copiado para a área de transferência.",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <div className="w-64 hidden md:block">
          <SidebarMenu />
        </div>
        <div className="flex-1">
          <Header />
          <main className="p-6">
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-psycho-primary"></div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <div className="w-64 hidden md:block">
          <SidebarMenu />
        </div>
        <div className="flex-1">
          <Header />
          <main className="p-6">
            <div className="text-center py-12">
              <h2 className="text-lg font-medium mb-2">Compromisso não encontrado</h2>
              <p className="text-gray-500 mb-4">O compromisso que você está procurando não existe ou foi removido.</p>
              <Button onClick={() => navigate("/schedule")}>
                <ArrowLeft size={16} className="mr-1" /> Voltar para a agenda
              </Button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="w-64 hidden md:block">
        <SidebarMenu />
      </div>
      <div className="flex-1">
        <Header />
        <main className="p-6">
          <div className="flex items-center mb-6">
            <Button variant="ghost" size="sm" className="mr-4" onClick={() => navigate("/schedule")}>
              <ArrowLeft size={16} className="mr-1" /> Voltar
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Detalhes do Compromisso</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informações do Compromisso</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Paciente</h3>
                  <p className="mt-1 font-medium text-gray-900">{event.patientName}</p>
                  <Button 
                    variant="link" 
                    size="sm" 
                    className="px-0 text-psycho-primary" 
                    onClick={() => navigate(`/patients/${event.patientId}`)}
                  >
                    Ver detalhes do paciente
                  </Button>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Data e Hora</h3>
                  <div className="mt-1 flex items-center">
                    <CalendarIcon size={16} className="text-gray-400 mr-1" />
                    <span className="font-medium text-gray-900">
                      {format(parseISO(event.date), "d 'de' MMMM 'de' yyyy")}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center">
                    <Clock size={16} className="text-gray-400 mr-1" />
                    <span className="font-medium text-gray-900">
                      {format(parseISO(event.date), "HH:mm")} ({event.duration} min)
                    </span>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <div className="mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      event.status === "confirmed" ? "bg-green-100 text-green-800" :
                      event.status === "scheduled" ? "bg-blue-100 text-blue-800" :
                      event.status === "completed" ? "bg-indigo-100 text-indigo-800" :
                      "bg-red-100 text-red-800"
                    }`}>
                      {event.status === "scheduled" && "Agendado"}
                      {event.status === "confirmed" && "Confirmado"}
                      {event.status === "completed" && "Concluído"}
                      {event.status === "cancelled" && "Cancelado"}
                    </span>
                  </div>
                </div>
                
                {event.notes && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Notas</h3>
                    <p className="mt-1 text-gray-900">{event.notes}</p>
                  </div>
                )}
                
                <div className="pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => navigate(`/patients/${event.patientId}/sessions/new`)}
                  >
                    <Edit size={16} className="mr-1" /> Criar Registro de Sessão
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <div className="lg:col-span-2">
              <Tabs defaultValue="video">
                <TabsList>
                  <TabsTrigger value="video">
                    <Video className="h-4 w-4 mr-2" /> Videochamada
                  </TabsTrigger>
                  <TabsTrigger value="whatsapp">
                    <MessageSquare className="h-4 w-4 mr-2" /> Lembrete no WhatsApp
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="video" className="space-y-4">
                  <Card>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-4 p-4">
                          <Button
                            onClick={() => {
                              const generatedToken = Math.random().toString(36).substring(2, 15);
                              const generatedLink = `${window.location.origin}/meeting?token=${generatedToken}`;
                              setVideoLink(generatedLink);

                              // Atualiza a mensagem do WhatsApp com o novo link
                              if (event) {
                                setWhatsappMessage(
                                  `Olá ${event.patientName}, este é um lembrete para sua consulta no dia ${format(
                                    parseISO(event.date),
                                    "d 'de' MMMM 'de' yyyy"
                                  )} às ${format(parseISO(event.date), "HH:mm")}. Link da videochamada: ${generatedLink}`
                                );
                              }

                              toast({
                                title: "Link Gerado",
                                description: "O link da videochamada foi gerado com sucesso.",
                              });
                            }}
                            className="w-full"
                          >
                            Criar Videochamada
                          </Button>
                        </div>

                        {videoLink && (
                          <div className="pt-4">
                            <Card className="bg-gray-50">
                              <CardContent className="p-4">
                                <h3 className="font-medium mb-2">Link da Videochamada</h3>
                                <div className="mb-2 break-all">
                                  <a
                                    href={videoLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-psycho-primary hover:underline"
                                  >
                                    {videoLink}
                                  </a>
                                </div>
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  className="w-full"
                                  onClick={copyVideoLink}
                                >
                                  {isVideoLinkCopied ? (
                                    <>
                                      <Check size={16} className="mr-1" /> Copiado!
                                    </>
                                  ) : (
                                    <>
                                      <Copy size={16} className="mr-1" /> Copiar link
                                    </>
                                  )}
                                </Button>
                              </CardContent>
                            </Card>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="whatsapp" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Lembrete no WhatsApp</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium">Mensagem</label>
                          <Textarea 
                            value={whatsappMessage} 
                            onChange={(e) => setWhatsappMessage(e.target.value)} 
                            placeholder="Digite sua mensagem..."
                            className="mt-1" 
                            rows={4}
                          />
                          <p className="mt-2 text-sm text-gray-500">
                            Personalize a mensagem de lembrete que será enviada ao paciente.
                          </p>
                        </div>

                        <Button 
                          className="w-full"
                          disabled={!event.patientPhone}
                          onClick={() => {
                            if (generateWhatsappLink()) {
                              window.open(generateWhatsappLink(), '_blank');
                            } else {
                              toast({
                                title: "Erro",
                                description: "O número de telefone do paciente está ausente.",
                                variant: "destructive",
                              });
                            }
                          }}
                        >
                          <MessageSquare size={16} className="mr-2" /> Enviar Lembrete no WhatsApp
                        </Button>
                        
                        {!event.patientPhone && (
                          <p className="text-red-500 text-sm">
                            Este paciente não possui um número de telefone registrado. Atualize os detalhes do paciente primeiro.
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ScheduleEventDetail;