import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar as CalendarIcon, Video, MessageSquare, Phone, User, Clock, FileText } from "lucide-react";
import { usePatientStore } from "@/stores/patientStore";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { format, isBefore, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";

const ScheduleAppointments: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();
  const { scheduleEvents, publicAppointments, getPublicAppointmentsByProfessional, patients } = usePatientStore();
  const { toast } = useToast();
  const navigate = useNavigate();

  const today = startOfDay(new Date());
  const professionalAppointments = user?.id ? getPublicAppointmentsByProfessional(user.id) : [];

  // Stats
  const stats = useMemo(() => {
    const todayAppointments = professionalAppointments.filter(apt => 
      apt.date === format(today, "yyyy-MM-dd")
    );
    const upcomingAppointments = professionalAppointments.filter(apt => 
      !isBefore(new Date(apt.date), today)
    );
    
    return {
      today: todayAppointments.length,
      upcoming: upcomingAppointments.length,
      pending: professionalAppointments.filter(apt => apt.status === 'pending').length,
      confirmed: professionalAppointments.filter(apt => apt.status === 'confirmed').length
    };
  }, [professionalAppointments, today]);

  // Combinar agendamentos
  const allAppointments = useMemo(() => {
    if (!selectedDate) return [];
    
    const dateStr = format(selectedDate, "yyyy-MM-dd");
    
    return [
      ...scheduleEvents.filter(event => {
        const eventDate = new Date(event.date);
        return format(eventDate, "yyyy-MM-dd") === dateStr;
      }),
      ...professionalAppointments.filter(apt => apt.date === dateStr).map(apt => ({
        id: apt.id,
        patientName: apt.patientName,
        patientPhone: apt.patientPhone,
        date: `${apt.date}T${apt.time}`,
        time: apt.time,
        status: apt.status,
        notes: `Agendamento via link público`,
        isPublicAppointment: true
      }))
    ].sort((a, b) => {
      const timeA = 'time' in a ? a.time : format(new Date(a.date), "HH:mm");
      const timeB = 'time' in b ? b.time : format(new Date(b.date), "HH:mm");
      return timeA.localeCompare(timeB);
    });
  }, [selectedDate, scheduleEvents, professionalAppointments]);

  // Datas com agendamentos
  const datesWithAppointments = useMemo(() => {
    const dates = new Set<string>();
    scheduleEvents.forEach(e => dates.add(format(new Date(e.date), "yyyy-MM-dd")));
    professionalAppointments.forEach(a => dates.add(a.date));
    return Array.from(dates).map(d => new Date(d));
  }, [scheduleEvents, professionalAppointments]);

  const handleAppointmentClick = (appointment: any) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleStartVideoCall = () => {
    if (selectedAppointment) {
      // Tenta encontrar o paciente pelo nome ou usa um ID padrão
      const matchedPatient = patients.find(p => 
        p.name.toLowerCase() === selectedAppointment.patientName?.toLowerCase() ||
        p.phone === selectedAppointment.patientPhone
      );
      const patientId = matchedPatient?.id || 'patientId' in selectedAppointment ? selectedAppointment.patientId : 'p1';
      window.open(`/teleconsultation?patientId=${patientId}`, '_blank');
      toast({
        title: "Chamada iniciada",
        description: "A teleconsulta foi aberta em uma nova aba."
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

  const findPatientByAppointment = (appointment: any) => {
    if (!appointment) return null;
    
    return patients.find(p => {
      const cleanAppointmentPhone = appointment.patientPhone?.replace(/\D/g, '') || '';
      const cleanPatientPhone = p.phone.replace(/\D/g, '');
      
      return p.name.toLowerCase() === appointment.patientName?.toLowerCase() ||
        cleanPatientPhone === cleanAppointmentPhone;
    });
  };

  const handleViewPatientRecord = () => {
    const patient = findPatientByAppointment(selectedAppointment);
    if (patient) {
      navigate(`/patients/${patient.id}`);
      setIsModalOpen(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "default";
      case "pending": return "secondary";
      case "cancelled": return "destructive";
      default: return "outline";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "confirmed": return "Confirmado";
      case "pending": return "Pendente";
      case "cancelled": return "Cancelado";
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.today}</p>
                <p className="text-xs text-muted-foreground">Hoje</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                <CalendarIcon className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.upcoming}</p>
                <p className="text-xs text-muted-foreground">Próximos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                <User className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.pending}</p>
                <p className="text-xs text-muted-foreground">Pendentes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                <Video className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.confirmed}</p>
                <p className="text-xs text-muted-foreground">Confirmados</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendário */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Calendário</CardTitle>
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
            <p className="text-xs text-muted-foreground mt-3">
              Datas destacadas possuem agendamentos
            </p>
          </CardContent>
        </Card>

        {/* Lista de Agendamentos */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              {selectedDate ? (
                <>Agendamentos - {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}</>
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
              <div className="space-y-2">
                {allAppointments.map(appointment => {
                  const appointmentTime = 'time' in appointment 
                    ? appointment.time 
                    : format(new Date(appointment.date), "HH:mm");
                  
                  return (
                    <div
                      key={appointment.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => handleAppointmentClick(appointment)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-center min-w-[50px]">
                          <p className="text-lg font-bold">{appointmentTime}</p>
                        </div>
                        <div>
                          <p className="font-medium">{appointment.patientName}</p>
                          {appointment.patientPhone && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {appointment.patientPhone}
                            </p>
                          )}
                        </div>
                      </div>
                      <Badge variant={getStatusColor(appointment.status)}>
                        {getStatusLabel(appointment.status)}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modal de Detalhes */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Detalhes do Agendamento</DialogTitle>
          </DialogHeader>
          {selectedAppointment && (
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Paciente</span>
                  <span className="font-medium">{selectedAppointment.patientName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Data</span>
                  <span className="font-medium">
                    {format(new Date(selectedAppointment.date), "dd/MM/yyyy")}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Horário</span>
                  <span className="font-medium">
                    {selectedAppointment.time || format(new Date(selectedAppointment.date), "HH:mm")}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge variant={getStatusColor(selectedAppointment.status)}>
                    {getStatusLabel(selectedAppointment.status)}
                  </Badge>
                </div>
                {selectedAppointment.patientPhone && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">WhatsApp</span>
                    <span className="font-medium">{selectedAppointment.patientPhone}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2 pt-4 border-t">
                <Button onClick={handleStartVideoCall} className="w-full">
                  <Video className="h-4 w-4 mr-2" />
                  Iniciar Teleconsulta
                </Button>
                {selectedAppointment && findPatientByAppointment(selectedAppointment) && (
                  <Button
                    variant="outline"
                    onClick={handleViewPatientRecord}
                    className="w-full"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Ver Prontuário
                  </Button>
                )}
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
                    Enviar Lembrete WhatsApp
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
