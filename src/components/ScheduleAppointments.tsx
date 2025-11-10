import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar as CalendarIcon, Video, MessageSquare, Phone, User } from "lucide-react";
import { usePatientStore } from "@/stores/patientStore";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useNavigate } from "react-router-dom";

const ScheduleAppointments: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();
  const { scheduleEvents, publicAppointments, getPublicAppointmentsByProfessional } = usePatientStore();
  const { toast } = useToast();
  const navigate = useNavigate();

  const professionalAppointments = user ? getPublicAppointmentsByProfessional(user.email) : [];

  // Combinar agendamentos públicos com eventos de agenda existentes
  const allAppointments = selectedDate
    ? [
        ...scheduleEvents.filter(event => {
          const eventDate = new Date(event.date);
          return format(eventDate, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd");
        }),
        ...professionalAppointments.filter(apt => 
          apt.date === format(selectedDate, "yyyy-MM-dd")
        ).map(apt => ({
          id: apt.id,
          patientName: apt.patientName,
          patientPhone: apt.patientPhone,
          date: `${apt.date}T${apt.time}`,
          time: apt.time,
          status: apt.status,
          notes: `Agendamento público - Tel: ${apt.patientPhone}`,
        }))
      ]
    : [];

  // Datas com agendamentos para destacar no calendário
  const datesWithAppointments = [
    ...scheduleEvents.map(e => new Date(e.date)),
    ...professionalAppointments.map(a => new Date(a.date))
  ];

  const handleAppointmentClick = (appointment: any) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleStartVideoCall = () => {
    if (selectedAppointment) {
      const patientId = 'patientId' in selectedAppointment ? selectedAppointment.patientId : 'p1';
      window.open(`/meeting-details?patientId=${patientId}`, '_blank');
      toast({
        title: "Chamada iniciada",
        description: "A chamada de vídeo foi aberta em uma nova aba."
      });
      setIsModalOpen(false);
    }
  };

  const handleSendWhatsAppReminder = (phone: string, name: string) => {
    const message = encodeURIComponent(
      `Olá ${name}! Este é um lembrete da sua consulta agendada. Aguardo você!`
    );
    window.open(`https://wa.me/${phone.replace(/\D/g, '')}?text=${message}`, '_blank');
    toast({
      title: "WhatsApp aberto",
      description: "Você pode enviar o lembrete agora."
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "default";
      case "pending":
        return "secondary";
      case "cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Confirmado";
      case "pending":
        return "Pendente";
      case "cancelled":
        return "Cancelado";
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendário */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CalendarIcon className="h-5 w-5" />
              Selecionar Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border pointer-events-auto"
              locale={ptBR}
              modifiers={{
                booked: datesWithAppointments
              }}
              modifiersClassNames={{
                booked: "bg-primary text-primary-foreground"
              }}
            />
            <div className="mt-4 text-sm text-muted-foreground">
              <p>Datas destacadas possuem agendamentos</p>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Agendamentos */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>
              {selectedDate ? (
                <>Agendamentos para {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}</>
              ) : (
                <>Selecione uma data</>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {allAppointments.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>Nenhum agendamento para esta data.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {allAppointments
                  .sort((a, b) => {
                    const timeA = 'time' in a ? a.time : new Date(a.date).toTimeString().slice(0, 5);
                    const timeB = 'time' in b ? b.time : new Date(b.date).toTimeString().slice(0, 5);
                    return timeA.localeCompare(timeB);
                  })
                  .map(appointment => {
                    const appointmentTime = 'time' in appointment 
                      ? appointment.time 
                      : format(new Date(appointment.date), "HH:mm");
                    return (
                      <div
                        key={appointment.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                        onClick={() => handleAppointmentClick(appointment)}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-lg">{appointmentTime}</span>
                            <Badge variant={getStatusColor(appointment.status)}>
                              {getStatusLabel(appointment.status)}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {appointment.patientName}
                          </p>
                          {appointment.patientPhone && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                              <Phone className="h-3 w-3" />
                              {appointment.patientPhone}
                            </p>
                          )}
                        </div>
                        <Button size="sm" variant="outline">
                          Ver detalhes
                        </Button>
                      </div>
                    );
                  })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modal de Detalhes do Agendamento */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Detalhes do Agendamento</DialogTitle>
          </DialogHeader>
          {selectedAppointment && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Paciente:</span>
                  <span className="font-medium">{selectedAppointment.patientName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Data:</span>
                  <span className="font-medium">
                    {format(new Date(selectedAppointment.date), "dd/MM/yyyy")}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Horário:</span>
                  <span className="font-medium">
                    {selectedAppointment.time || format(new Date(selectedAppointment.date), "HH:mm")}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  <Badge variant={getStatusColor(selectedAppointment.status)}>
                    {getStatusLabel(selectedAppointment.status)}
                  </Badge>
                </div>
                {selectedAppointment.patientPhone && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Telefone:</span>
                    <span className="font-medium">{selectedAppointment.patientPhone}</span>
                  </div>
                )}
                {selectedAppointment.notes && (
                  <div className="pt-2">
                    <span className="text-sm text-muted-foreground block mb-1">Observações:</span>
                    <p className="text-sm p-2 bg-muted rounded">{selectedAppointment.notes}</p>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2 pt-4 border-t">
                <Button onClick={handleStartVideoCall} className="w-full">
                  <Video className="h-4 w-4 mr-2" />
                  Iniciar Chamada de Vídeo
                </Button>
                {selectedAppointment.patientPhone && (
                  <Button
                    variant="outline"
                    onClick={() => handleSendWhatsAppReminder(
                      selectedAppointment.patientPhone,
                      selectedAppointment.patientName
                    )}
                    className="w-full"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Enviar Lembrete no WhatsApp
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ScheduleAppointments;
