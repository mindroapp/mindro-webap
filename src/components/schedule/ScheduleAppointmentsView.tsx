import React, { useState, useMemo, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, User, Phone, Video, MessageSquare, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { usePatientStore } from "@/stores/patientStore";
import { format, isBefore, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";

const ScheduleAppointmentsView: React.FC = () => {
  const { user } = useAuth();
  const {
    scheduleEvents,
    fetchScheduleEvents,
    getPublicAppointmentsByProfessional,
    fetchPublicAppointments,
    patients,
  } = usePatientStore();
  const { toast } = useToast();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'today' | 'upcoming' | 'past'>('all');
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cancelModal, setCancelModal] = useState<{ open: boolean; appointment: any }>({ open: false, appointment: null });

  const today = startOfDay(new Date());
  const professionalAppointments = user ? getPublicAppointmentsByProfessional(user.email) : [];

  // Inicializar selectedDate com a data atual ao carregar e buscar dados
  useEffect(() => {
    setSelectedDate(today);
    setCurrentDate(today);
  }, []);

  useEffect(() => {
    if (user?.email) {
      fetchScheduleEvents(user.email).catch(console.error);
      fetchPublicAppointments(user.email).catch(console.error);
    }
  }, [user?.email]);

  // Stats
  const stats = useMemo(() => {
    const allAppointments = [
      ...scheduleEvents,
      ...professionalAppointments.map(apt => ({
        id: apt.id,
        date: `${apt.date}T${apt.time}`,
        patientName: apt.patientName,
        patientPhone: apt.patientPhone,
        status: apt.status
      }))
    ];

    const currentMonthAppointments = allAppointments.filter(apt => {
      const aptDate = new Date(apt.date);
      return aptDate.getFullYear() === currentDate.getFullYear() &&
        aptDate.getMonth() === currentDate.getMonth();
    });

    const todayStr = format(today, "yyyy-MM-dd");
    const todayAppointments = currentMonthAppointments.filter(apt => 
      format(new Date(apt.date), "yyyy-MM-dd") === todayStr
    );

    const upcomingAppointments = currentMonthAppointments.filter(apt => 
      !isBefore(new Date(apt.date), today)
    );

    const pastAppointments = currentMonthAppointments.filter(apt => 
      isBefore(new Date(apt.date), today)
    );

    return {
      total: currentMonthAppointments.length,
      today: todayAppointments.length,
      upcoming: upcomingAppointments.length,
      past: pastAppointments.length
    };
  }, [scheduleEvents, professionalAppointments, currentDate, today]);

  const getCalendarDays = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const currentDateIter = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDateIter));
      currentDateIter.setDate(currentDateIter.getDate() + 1);
    }

    return days;
  };

  const getAppointmentsForDate = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    
    return [
      ...scheduleEvents.filter(event => format(new Date(event.date), "yyyy-MM-dd") === dateStr),
      ...professionalAppointments.filter(apt => apt.date === dateStr).map(apt => ({
        id: apt.id,
        patientName: apt.patientName,
        patientPhone: apt.patientPhone,
        date: `${apt.date}T${apt.time}`,
        time: apt.time,
        status: apt.status,
        isPublicAppointment: true
      }))
    ].sort((a, b) => {
      const timeA = 'time' in a ? a.time : format(new Date(a.date), "HH:mm");
      const timeB = 'time' in b ? b.time : format(new Date(b.date), "HH:mm");
      return timeA.localeCompare(timeB);
    });
  };

  const hasAppointments = (date: Date) => {
    return getAppointmentsForDate(date).length > 0;
  };

  const isCurrentMonth = (date: Date, month: number) => {
    return date.getMonth() === month;
  };

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  };

  const formatDateFull = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    setSelectedDate(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    setSelectedDate(null);
  };

  const handleAppointmentClick = (appointment: any) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleStartVideoCall = () => {
    if (selectedAppointment) {
      const matchedPatient = patients.find(p =>
        p.name.toLowerCase() === selectedAppointment.patientName?.toLowerCase() ||
        p.phone === selectedAppointment.patientPhone
      );
      const patientId = matchedPatient?.id || selectedAppointment.patientId || 'p1';
      window.open(`/teleconsultation?patientId=${patientId}&role=professional`, '_blank');
      toast({
        title: "Chamada iniciada",
        description: "A teleconsulta foi aberta em uma nova aba."
      });
      setIsModalOpen(false);
    }
  };

  const handleSendWhatsApp = (phone: string, name: string) => {
    const message = encodeURIComponent(
      `Olá ${name}! Este é um lembrete da sua consulta agendada. Aguardo você!`
    );
    window.open(`https://wa.me/${phone.replace(/\D/g, '')}?text=${message}`, '_blank');
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
      default: return status || "Agendado";
    }
  };

  const selectedAppointments = selectedDate ? getAppointmentsForDate(selectedDate) : [];
  const currentMonthDays = getCalendarDays(currentDate);

  // All appointments for list view
  const allAppointments = useMemo(() => {
    const appointments = [
      ...scheduleEvents.map(event => ({
        ...event,
        dateObj: new Date(event.date),
        time: format(new Date(event.date), "HH:mm")
      })),
      ...professionalAppointments.map(apt => ({
        id: apt.id,
        patientName: apt.patientName,
        patientPhone: apt.patientPhone,
        date: `${apt.date}T${apt.time}`,
        dateObj: new Date(`${apt.date}T${apt.time}`),
        time: apt.time,
        status: apt.status,
        isPublicAppointment: true
      }))
    ].filter(apt => {
      const aptDate = apt.dateObj;
      return aptDate.getFullYear() === currentDate.getFullYear() &&
        aptDate.getMonth() === currentDate.getMonth();
    });

    // Apply filter
    switch (filterType) {
      case 'today':
        return appointments.filter(apt => format(apt.dateObj, "yyyy-MM-dd") === format(today, "yyyy-MM-dd"));
      case 'upcoming':
        return appointments.filter(apt => !isBefore(apt.dateObj, today));
      case 'past':
        return appointments.filter(apt => isBefore(apt.dateObj, today));
      default:
        return appointments;
    }
  }, [scheduleEvents, professionalAppointments, currentDate, filterType, today]);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header with Stats */}
      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
            <div className="flex-1">
              <h2 className="text-xl sm:text-2xl font-bold mb-1">Gestão de Agendamentos</h2>
              <p className="text-sm text-muted-foreground">Visualize e gerencie todos os agendamentos</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-muted/50 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <CalendarIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-xs text-muted-foreground">Total</p>
                </div>
              </div>
            </div>

            <div className="bg-muted/50 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.today}</p>
                  <p className="text-xs text-muted-foreground">Hoje</p>
                </div>
              </div>
            </div>

            <div className="bg-muted/50 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                  <User className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.upcoming}</p>
                  <p className="text-xs text-muted-foreground">Futuros</p>
                </div>
              </div>
            </div>

            <div className="bg-muted/50 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <CalendarIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.past}</p>
                  <p className="text-xs text-muted-foreground">Passados</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calendar */}
      <Card>
        <CardContent className="p-4 sm:p-6">
          {/* Calendar Navigation */}
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevMonth}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline ml-2">Anterior</span>
            </Button>
            <h3 className="text-lg sm:text-xl font-bold capitalize">
              {formatMonthYear(currentDate)}
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextMonth}
            >
              <span className="hidden sm:inline mr-2">Próximo</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-4">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
              <div key={day} className="text-center text-xs sm:text-sm font-semibold text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {currentMonthDays.map((day, index) => {
              const isCurrentMonthDay = isCurrentMonth(day, currentDate.getMonth());
              const hasAppointmentsForDay = hasAppointments(day);
              const isSelected = selectedDate?.toDateString() === day.toDateString();
              const appointmentsCount = getAppointmentsForDate(day).length;
              const isPast = isBefore(day, today);

              return (
                <div key={index} className="relative">
                  <button
                    onClick={() => hasAppointmentsForDay && isCurrentMonthDay ? setSelectedDate(day) : null}
                    disabled={!hasAppointmentsForDay || !isCurrentMonthDay}
                    className={`w-full h-12 sm:h-16 md:h-20 rounded-xl flex flex-col items-center justify-center text-xs sm:text-sm font-medium transition-all duration-200 relative ${
                      isCurrentMonthDay
                        ? hasAppointmentsForDay
                          ? isSelected
                            ? 'bg-primary/20 border-2 border-primary shadow-lg scale-105'
                            : isPast
                              ? 'bg-muted/50 border-2 border-muted hover:bg-muted cursor-pointer'
                              : 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 cursor-pointer'
                          : 'text-muted-foreground'
                        : 'text-muted-foreground/50'
                    }`}
                  >
                    <span className={`text-sm sm:text-lg ${isSelected ? 'font-bold' : ''}`}>
                      {day.getDate()}
                    </span>
                    {hasAppointmentsForDay && isCurrentMonthDay && (
                      <div className="flex items-center gap-1 mt-1">
                        <div className={`w-1.5 h-1.5 rounded-full ${isPast ? 'bg-muted-foreground' : 'bg-blue-500'}`} />
                        <span className={`text-xs font-bold ${isPast ? 'text-muted-foreground' : 'text-blue-600 dark:text-blue-400'}`}>
                          {appointmentsCount}
                        </span>
                      </div>
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-6 pt-4 border-t">
            <h4 className="text-sm font-semibold mb-3">Legenda</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded flex items-center justify-center">
                  <div className="w-1 h-1 bg-blue-500 rounded-full" />
                </div>
                <span className="text-muted-foreground">Agendamentos futuros</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-muted/50 border-2 border-muted rounded flex items-center justify-center">
                  <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                </div>
                <span className="text-muted-foreground">Agendamentos passados</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-background border border-border rounded" />
                <span className="text-muted-foreground">Sem agendamentos</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appointments List */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <CardTitle className="flex-1">
              {selectedDate ? (
                <>Agendamentos - {formatDateFull(selectedDate)}</>
              ) : (
                <>Todos os Agendamentos</>
              )}
            </CardTitle>
            {!selectedDate && (
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={filterType === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterType('all')}
                >
                  Todos
                </Button>
                <Button
                  variant={filterType === 'today' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterType('today')}
                >
                  Hoje
                </Button>
                <Button
                  variant={filterType === 'upcoming' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterType('upcoming')}
                >
                  Futuros
                </Button>
                <Button
                  variant={filterType === 'past' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterType('past')}
                >
                  Passados
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {(selectedDate ? selectedAppointments : allAppointments).length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>Nenhum agendamento encontrado.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {(selectedDate ? selectedAppointments : allAppointments).map((appointment: any) => {
                const appointmentDate = appointment.dateObj || new Date(appointment.date);
                const appointmentTime = appointment.time || format(appointmentDate, "HH:mm");
                const isPastAppointment = isBefore(appointmentDate, new Date());

                return (
                  <div
                    key={appointment.id}
                    className={`p-4 rounded-xl border transition-all cursor-pointer hover:shadow-md ${
                      isPastAppointment
                        ? 'bg-muted/30 border-muted'
                        : 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800'
                    }`}
                    onClick={() => handleAppointmentClick(appointment)}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <div className="flex items-center gap-3 flex-1">
                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                          isPastAppointment ? 'bg-muted' : 'bg-blue-200 dark:bg-blue-800'
                        }`}>
                          <User className={`h-5 w-5 ${isPastAppointment ? 'text-muted-foreground' : 'text-blue-600 dark:text-blue-400'}`} />
                        </div>
                        <div>
                          <h4 className="font-semibold">{appointment.patientName}</h4>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <CalendarIcon className="h-3 w-3" />
                              {format(appointmentDate, 'dd/MM/yyyy', { locale: ptBR })}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {appointmentTime}
                            </div>
                            {appointment.patientPhone && (
                              <div className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {appointment.patientPhone}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <Badge variant={isPastAppointment ? "secondary" : getStatusColor(appointment.status)}>
                        {isPastAppointment ? 'Realizado' : getStatusLabel(appointment.status)}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Appointment Details Modal */}
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
                {selectedAppointment.patientPhone && (
                  <Button
                    variant="outline"
                    onClick={() => handleSendWhatsApp(
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

export default ScheduleAppointmentsView;
