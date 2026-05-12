import React, { useState, useMemo, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar, Clock, Users, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { usePatientStore } from "@/stores/patientStore";
import { format, isBefore, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import ScheduleForm from "./ScheduleForm";

const ScheduleCalendarView: React.FC = () => {
  const { user } = useAuth();
  const {
    getAvailabilitiesByProfessional,
    fetchAvailabilities,
    fetchPublicAppointments,
    deleteAvailability,
    removeTimeSlot,
    deletePublicAppointment,
    publicAppointments,
  } = usePatientStore();

  useEffect(() => {
    if (user?.email) {
      fetchAvailabilities(user.email).catch(console.error);
      fetchPublicAppointments(user.email).catch(console.error);
    }
  }, [user?.email]);
  const { toast } = useToast();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'available' | 'busy'>('all');
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    type: 'schedule' | 'slot' | null;
    availabilityId?: string;
    slotTime?: string;
  }>({ open: false, type: null });

  const professionalAvailabilities = user ? getAvailabilitiesByProfessional(user.email) : [];
  const today = startOfDay(new Date());

  // Stats
  const stats = useMemo(() => {
    const currentMonthAvailabilities = professionalAvailabilities.filter(av => {
      const avDate = new Date(av.date);
      return avDate.getFullYear() === currentDate.getFullYear() &&
        avDate.getMonth() === currentDate.getMonth();
    });

    const totalSlots = currentMonthAvailabilities.reduce((acc, av) => acc + av.timeSlots.length, 0);
    const bookedSlots = currentMonthAvailabilities.reduce((acc, av) => {
      return acc + av.timeSlots.filter(slot => {
        return publicAppointments.some(apt => apt.availabilityId === av.id && apt.time === slot.time);
      }).length;
    }, 0);

    return {
      totalSchedules: currentMonthAvailabilities.length,
      freeSlots: totalSlots - bookedSlots,
      bookedSlots
    };
  }, [professionalAvailabilities, publicAppointments, currentDate]);

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

  const getAvailabilityForDate = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return professionalAvailabilities.find(av => av.date === dateStr);
  };

  const getScheduleStats = (date: Date) => {
    const availability = getAvailabilityForDate(date);
    if (!availability) return { total: 0, available: 0, busy: 0 };

    const total = availability.timeSlots.length;
    const busy = availability.timeSlots.filter(slot => {
      return publicAppointments.some(apt => apt.availabilityId === availability.id && apt.time === slot.time);
    }).length;

    return { total, available: total - busy, busy };
  };

  const hasSchedule = (date: Date) => {
    return !!getAvailabilityForDate(date);
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

  const handleDeleteSchedule = async (availabilityId: string) => {
    const hasAppointment = publicAppointments.some(apt => apt.availabilityId === availabilityId);

    if (hasAppointment) {
      toast({
        title: "Não é possível excluir",
        description: "Esta agenda possui agendamentos vinculados.",
        variant: "destructive"
      });
      return;
    }

    try {
      await deleteAvailability(availabilityId);
      toast({
        title: "Agenda excluída",
        description: "A agenda foi removida com sucesso."
      });
      setSelectedDate(null);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao excluir agenda.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteTimeSlot = async (availabilityId: string, slotTime: string) => {
    try {
      // Primeiro, delete o agendamento associado a este horário (se houver)
      const appointmentToDelete = publicAppointments.find(
        apt => apt.availabilityId === availabilityId && apt.time === slotTime
      );
      
      if (appointmentToDelete) {
        await deletePublicAppointment(appointmentToDelete.id);
      }

      // Depois, remova o slot da agenda
      await removeTimeSlot(availabilityId, slotTime);
      
      toast({
        title: "Horário removido",
        description: "O horário foi removido da agenda com sucesso."
      });
      
      setConfirmModal({ open: false, type: null });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao remover horário.",
        variant: "destructive"
      });
    }
  };

  const selectedAvailability = selectedDate ? getAvailabilityForDate(selectedDate) : null;
  const selectedStats = selectedDate ? getScheduleStats(selectedDate) : null;

  const isSlotPast = (slotTime: string): boolean => {
    if (!selectedDate) return false;
    const [hours, minutes] = slotTime.split(':').map(Number);
    const slotDateTime = new Date(selectedDate);
    slotDateTime.setHours(hours, minutes, 0, 0);
    return isBefore(slotDateTime, new Date());
  };

  const filteredSlots = selectedAvailability?.timeSlots.filter(slot => {
    const isBooked = publicAppointments.some(
      apt => apt.availabilityId === selectedAvailability.id && apt.time === slot.time
    );
    if (filterType === 'available') return !isBooked;
    if (filterType === 'busy') return isBooked;
    return true;
  }) || [];

  const currentMonthDays = getCalendarDays(currentDate);
  const isPastDate = selectedDate ? isBefore(selectedDate, today) : false;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header with Stats */}
      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
            <div className="flex-1">
              <h2 className="text-xl sm:text-2xl font-bold mb-1">Gestão de Agendas</h2>
              <p className="text-sm text-muted-foreground">Configure seus dias e horários disponíveis</p>
            </div>
            <Button onClick={() => setShowCreateForm(!showCreateForm)}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Agenda
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-muted/50 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.totalSchedules}</p>
                  <p className="text-xs text-muted-foreground">Agendas Criadas</p>
                </div>
              </div>
            </div>

            <div className="bg-muted/50 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.freeSlots}</p>
                  <p className="text-xs text-muted-foreground">Horários Livres</p>
                </div>
              </div>
            </div>

            <div className="bg-muted/50 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <Users className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.bookedSlots}</p>
                  <p className="text-xs text-muted-foreground">Agendamentos</p>
                </div>
              </div>
            </div>
          </div>

          {showCreateForm && (
            <div className="mt-6">
              <ScheduleForm
                onClose={() => setShowCreateForm(false)}
                onScheduleCreated={() => setShowCreateForm(false)}
              />
            </div>
          )}
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
              const hasScheduleForDay = hasSchedule(day);
              const isSelected = selectedDate?.toDateString() === day.toDateString();
              const dayStats = getScheduleStats(day);
              const isPast = isBefore(day, today);

              return (
                <div key={index} className="relative">
                  <button
                    onClick={() => hasScheduleForDay && isCurrentMonthDay ? setSelectedDate(day) : null}
                    disabled={!hasScheduleForDay || !isCurrentMonthDay}
                    className={`w-full h-12 sm:h-16 md:h-20 rounded-xl flex flex-col items-center justify-center text-xs sm:text-sm font-medium transition-all duration-200 relative ${
                      isCurrentMonthDay
                        ? hasScheduleForDay
                          ? isSelected
                            ? 'bg-primary/20 border-2 border-primary shadow-lg scale-105'
                            : dayStats.available > 0 && dayStats.busy === 0
                              ? 'bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/30 cursor-pointer'
                              : dayStats.available === 0 && dayStats.busy > 0
                                ? 'bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/30 cursor-pointer'
                                : dayStats.available > 0 && dayStats.busy > 0
                                  ? 'bg-orange-50 dark:bg-orange-900/20 border-2 border-orange-200 dark:border-orange-800 hover:bg-orange-100 dark:hover:bg-orange-900/30 cursor-pointer'
                                  : 'bg-muted/50 hover:bg-muted cursor-pointer border border-border'
                          : 'text-muted-foreground'
                        : 'text-muted-foreground/50'
                    }`}
                  >
                    <span className={`text-sm sm:text-lg ${isSelected ? 'font-bold' : ''}`}>
                      {day.getDate()}
                    </span>
                    {hasScheduleForDay && isCurrentMonthDay && (
                      <div className="flex gap-1 mt-1">
                        {dayStats.available > 0 && (
                          <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-green-500 rounded-full" />
                        )}
                        {dayStats.busy > 0 && (
                          <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-red-500 rounded-full" />
                        )}
                      </div>
                    )}
                    {isPast && hasScheduleForDay && isCurrentMonthDay && (
                      <div className="absolute inset-0 bg-muted/40 rounded-xl" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-6 pt-4 border-t">
            <h4 className="text-sm font-semibold mb-3">Legenda</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded flex items-center justify-center">
                  <div className="w-1 h-1 bg-green-500 rounded-full" />
                </div>
                <span className="text-muted-foreground">Apenas livres</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded flex items-center justify-center">
                  <div className="w-1 h-1 bg-red-500 rounded-full" />
                </div>
                <span className="text-muted-foreground">Apenas ocupados</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-orange-50 dark:bg-orange-900/20 border-2 border-orange-200 dark:border-orange-800 rounded flex items-center justify-center">
                  <div className="flex gap-0.5">
                    <div className="w-0.5 h-0.5 bg-green-500 rounded-full" />
                    <div className="w-0.5 h-0.5 bg-red-500 rounded-full" />
                  </div>
                </div>
                <span className="text-muted-foreground">Mistos</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-muted border border-border rounded" />
                <span className="text-muted-foreground">Sem agenda</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Schedule Details */}
      {selectedDate && selectedAvailability && (
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
              <div className="flex-1">
                <h3 className="text-lg sm:text-xl font-bold capitalize mb-1">
                  {formatDateFull(selectedDate)}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {selectedStats?.total} horário{selectedStats?.total !== 1 ? 's' : ''} configurado{selectedStats?.total !== 1 ? 's' : ''}
                </p>
                {isPastDate && (
                  <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                    Agenda não pode ser editada (data passada)
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  variant={filterType === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterType('all')}
                >
                  Todos ({selectedStats?.total || 0})
                </Button>
                <Button
                  variant={filterType === 'available' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterType('available')}
                >
                  Livres ({selectedStats?.available || 0})
                </Button>
                <Button
                  variant={filterType === 'busy' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterType('busy')}
                >
                  Ocupados ({selectedStats?.busy || 0})
                </Button>
              </div>

              {!isPastDate && selectedStats?.busy === 0 &&
                selectedAvailability.timeSlots.some(s => !isSlotPast(s.time)) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setConfirmModal({ open: true, type: 'schedule', availabilityId: selectedAvailability.id })}
                  className="text-destructive border-destructive/30 hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Excluir Agenda
                </Button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {filteredSlots.map((slot) => {
                const isBooked = publicAppointments.some(
                  apt => apt.availabilityId === selectedAvailability.id && apt.time === slot.time
                );
                const appointment = publicAppointments.find(
                  apt => apt.availabilityId === selectedAvailability.id && apt.time === slot.time
                );

                return (
                  <div
                    key={slot.time}
                    className={`p-3 sm:p-4 rounded-xl border transition-all ${
                      isBooked
                        ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                        : 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-sm sm:text-base">{slot.time}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant={isBooked ? "destructive" : "default"} className="text-xs">
                          {isBooked ? 'Ocupado' : 'Livre'}
                        </Badge>
                        {!isPastDate && !isSlotPast(slot.time) && (
                          <button
                            onClick={() => setConfirmModal({
                              open: true,
                              type: 'slot',
                              availabilityId: selectedAvailability.id,
                              slotTime: slot.time
                            })}
                            className="p-1 hover:bg-destructive/10 rounded text-destructive/60 hover:text-destructive transition-colors"
                            title="Excluir horário"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                    {isBooked && appointment && (
                      <p className="text-xs text-muted-foreground truncate">
                        {appointment.patientName}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Confirm Delete Modal */}
      {confirmModal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle>
                {confirmModal.type === 'slot' ? 'Confirmar Exclusão de Horário' : 'Confirmar Exclusão'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                {confirmModal.type === 'slot' 
                  ? `Tem certeza que deseja excluir o horário ${confirmModal.slotTime}? Se houver um agendamento para este horário, ele também será removido.`
                  : 'Tem certeza que deseja excluir esta agenda? Esta ação não pode ser desfeita.'
                }
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setConfirmModal({ open: false, type: null })}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    if (confirmModal.type === 'slot' && confirmModal.availabilityId && confirmModal.slotTime) {
                      handleDeleteTimeSlot(confirmModal.availabilityId, confirmModal.slotTime);
                    } else if (confirmModal.type === 'schedule' && confirmModal.availabilityId) {
                      handleDeleteSchedule(confirmModal.availabilityId);
                    }
                  }}
                  className="flex-1"
                >
                  Excluir
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ScheduleCalendarView;
