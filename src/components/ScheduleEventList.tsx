
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, User, Phone, Calendar, Check, X, Video, Plus } from "lucide-react";
import { ScheduleEvent, usePatientStore } from "@/stores/patientStore";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ScheduleEventListProps {
  events: ScheduleEvent[];
  showDate?: boolean;
  showAddButton?: boolean;
  onAddClick?: () => void;
}

const ScheduleEventList: React.FC<ScheduleEventListProps> = ({
  events,
  showDate = false,
  showAddButton = false,
  onAddClick,
}) => {
  const { updateScheduleEvent } = usePatientStore();
  const { toast } = useToast();

  const handleConfirmEvent = async (eventId: string) => {
    try {
      await updateScheduleEvent(eventId, { status: 'confirmed' });
      toast({
        title: "Agendamento confirmado",
        description: "O agendamento foi confirmado com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao confirmar agendamento.",
        variant: "destructive",
      });
    }
  };

  const handleCancelEvent = async (eventId: string) => {
    try {
      await updateScheduleEvent(eventId, { status: 'cancelled' });
      toast({
        title: "Agendamento cancelado",
        description: "O agendamento foi cancelado.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao cancelar agendamento.",
        variant: "destructive",
      });
    }
  };

  const handleStartVideoCall = (event: ScheduleEvent) => {
    // Simular criação de sala de vídeo
    const roomId = `room-${event.id}-${Date.now()}`;
    const videoLink = `https://meet.example.com/${roomId}`;
    
    // Abrir em nova aba
    window.open(videoLink, '_blank');
    
    toast({
      title: "Sala criada",
      description: "Sala de vídeo chamada criada e aberta em nova aba.",
    });
  };

  const getStatusBadge = (status: ScheduleEvent['status']) => {
    switch (status) {
      case 'scheduled':
        return <Badge variant="secondary">Agendado</Badge>;
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-800">Confirmado</Badge>;
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-800">Realizado</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatEventTime = (dateString: string) => {
    return format(new Date(dateString), "HH:mm", { locale: ptBR });
  };

  const formatEventDate = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy", { locale: ptBR });
  };

  if (events.length === 0 && showAddButton) {
    return (
      <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg bg-white">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
          <Calendar size={24} className="text-gray-500" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhum compromisso para esta data</h3>
        <p className="text-gray-500 mb-4">
          Ainda não há compromissos agendados para o dia selecionado.
        </p>
        {onAddClick && (
          <Button onClick={onAddClick}>
            <Plus size={16} className="mr-1" /> Adicionar Compromisso
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <Card key={event.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex-1 space-y-2">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="font-medium text-gray-900">{event.patientName}</span>
                  {getStatusBadge(event.status)}
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  {showDate && (
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatEventDate(event.date)}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{formatEventTime(event.date)} ({event.duration}min)</span>
                  </div>
                  
                  {event.patientPhone && (
                    <div className="flex items-center space-x-1">
                      <Phone className="h-4 w-4" />
                      <span>{event.patientPhone}</span>
                    </div>
                  )}
                </div>
                
                {event.notes && (
                  <p className="text-sm text-gray-600 mt-2">{event.notes}</p>
                )}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:mt-0 sm:ml-4">
                {event.status === 'scheduled' && (
                  <>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleConfirmEvent(event.id)}
                      className="text-green-600 hover:text-green-700"
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Confirmar
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleCancelEvent(event.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Cancelar
                    </Button>
                  </>
                )}
                
                {event.status === 'confirmed' && (
                  <>
                    <Button 
                      size="sm" 
                      variant="default"
                      onClick={() => handleStartVideoCall(event)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Video className="h-4 w-4 mr-1" />
                      Iniciar Chamada
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleCancelEvent(event.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Cancelar
                    </Button>
                  </>
                )}
                
                {event.status === 'completed' && (
                  <Badge className="bg-blue-100 text-blue-800">
                    Sessão Realizada
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ScheduleEventList;
