import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar as CalendarIcon, Clock, Copy, Plus, Trash2, ExternalLink, Users, CheckCircle } from "lucide-react";
import { usePatientStore } from "@/stores/patientStore";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { format, isBefore, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";

const ScheduleAvailability: React.FC = () => {
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [timeRanges, setTimeRanges] = useState<{ start: string; end: string; duration: number }[]>([
    { start: "08:00", end: "12:00", duration: 50 }
  ]);
  const { user } = useAuth();
  const { availabilities, addAvailability, deleteAvailability, getAvailabilitiesByProfessional, publicAppointments } = usePatientStore();
  const { toast } = useToast();

  const professionalAvailabilities = user ? getAvailabilitiesByProfessional(user.email) : [];
  const today = startOfDay(new Date());

  // Stats
  const stats = useMemo(() => {
    const futureAvailabilities = professionalAvailabilities.filter(av => !isBefore(new Date(av.date), today));
    const totalSlots = futureAvailabilities.reduce((acc, av) => acc + av.timeSlots.length, 0);
    const bookedSlots = futureAvailabilities.reduce((acc, av) => {
      return acc + av.timeSlots.filter(slot => {
        return publicAppointments.some(apt => apt.availabilityId === av.id && apt.time === slot.time);
      }).length;
    }, 0);
    
    return {
      totalDays: futureAvailabilities.length,
      totalSlots,
      bookedSlots,
      availableSlots: totalSlots - bookedSlots
    };
  }, [professionalAvailabilities, publicAppointments, today]);

  const generateTimeSlots = (start: string, end: string, duration: number): string[] => {
    const slots: string[] = [];
    const [startHour, startMin] = start.split(':').map(Number);
    const [endHour, endMin] = end.split(':').map(Number);
    
    let currentTime = startHour * 60 + startMin;
    const endTime = endHour * 60 + endMin;
    
    while (currentTime + duration <= endTime) {
      const hours = Math.floor(currentTime / 60);
      const minutes = currentTime % 60;
      slots.push(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`);
      currentTime += duration;
    }
    
    return slots;
  };

  const addTimeRange = () => {
    setTimeRanges([...timeRanges, { start: "", end: "", duration: 50 }]);
  };

  const removeTimeRange = (index: number) => {
    setTimeRanges(timeRanges.filter((_, i) => i !== index));
  };

  const updateTimeRange = (index: number, field: 'start' | 'end' | 'duration', value: string | number) => {
    const updated = [...timeRanges];
    updated[index] = { ...updated[index], [field]: value };
    setTimeRanges(updated);
  };

  const handleCreateAvailability = async () => {
    if (selectedDates.length === 0) {
      toast({
        title: "Selecione datas",
        description: "Selecione pelo menos uma data no calendário.",
        variant: "destructive"
      });
      return;
    }

    const validRanges = timeRanges.filter(r => r.start && r.end && r.duration > 0);
    if (validRanges.length === 0) {
      toast({
        title: "Configure horários",
        description: "Configure pelo menos um intervalo de horários.",
        variant: "destructive"
      });
      return;
    }

    try {
      for (const date of selectedDates) {
        const allSlots: string[] = [];
        validRanges.forEach(range => {
          const slots = generateTimeSlots(range.start, range.end, range.duration);
          allSlots.push(...slots);
        });

        await addAvailability({
          date: format(date, "yyyy-MM-dd"),
          timeSlots: allSlots.map(time => ({ time, available: true })),
          professionalId: user?.email || ""
        });
      }

      toast({
        title: "Agendas criadas",
        description: `${selectedDates.length} agenda(s) criada(s) com sucesso.`
      });

      setSelectedDates([]);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao criar agendas.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteAvailability = async (id: string) => {
    const hasAppointment = publicAppointments.some(apt => apt.availabilityId === id);
    
    if (hasAppointment) {
      toast({
        title: "Não é possível excluir",
        description: "Esta agenda possui agendamentos vinculados.",
        variant: "destructive"
      });
      return;
    }

    try {
      await deleteAvailability(id);
      toast({
        title: "Agenda removida",
        description: "A agenda foi removida com sucesso."
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao remover agenda.",
        variant: "destructive"
      });
    }
  };

  const copyPublicLink = () => {
    const link = user?.email ? `${window.location.origin}/agendamento/${encodeURIComponent(user.email)}` : "";
    navigator.clipboard.writeText(link);
    toast({
      title: "Link copiado",
      description: "Compartilhe com seus pacientes."
    });
  };

  const openPublicLink = () => {
    const link = user?.email ? `${window.location.origin}/agendamento/${encodeURIComponent(user.email)}` : "";
    window.open(link, '_blank');
  };

  // Datas com agendas para destacar no calendário
  const datesWithAvailabilities = professionalAvailabilities.map(av => new Date(av.date));

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <CalendarIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalDays}</p>
                <p className="text-xs text-muted-foreground">Dias Disponíveis</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                <Clock className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.availableSlots}</p>
                <p className="text-xs text-muted-foreground">Horários Livres</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.bookedSlots}</p>
                <p className="text-xs text-muted-foreground">Agendados</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalSlots}</p>
                <p className="text-xs text-muted-foreground">Total de Horários</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Link de Agendamento */}
      <Card className="border-primary/30">
        <CardContent className="pt-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold">Link de Agendamento</h3>
              <p className="text-sm text-muted-foreground">Compartilhe com seus pacientes</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={copyPublicLink}>
                <Copy className="h-4 w-4 mr-2" />
                Copiar
              </Button>
              <Button variant="outline" size="sm" onClick={openPublicLink}>
                <ExternalLink className="h-4 w-4 mr-2" />
                Visualizar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Criar Agendas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Criar Novas Agendas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Calendário */}
            <div>
              <Label className="text-sm mb-2 block">Selecione os dias</Label>
              <Calendar
                mode="multiple"
                selected={selectedDates}
                onSelect={(dates) => setSelectedDates(dates || [])}
                className="rounded-md border pointer-events-auto"
                locale={ptBR}
                disabled={(date) => isBefore(date, today)}
                modifiers={{
                  hasAvailability: datesWithAvailabilities
                }}
                modifiersClassNames={{
                  hasAvailability: "bg-primary/20"
                }}
              />
              {selectedDates.length > 0 && (
                <Badge className="mt-2" variant="secondary">
                  {selectedDates.length} dia(s) selecionado(s)
                </Badge>
              )}
            </div>

            {/* Horários */}
            <div className="space-y-4">
              <Label className="text-sm">Intervalos de horários</Label>
              <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {timeRanges.map((range, index) => (
                  <div key={index} className="p-3 border rounded-lg space-y-3 bg-muted/30">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Intervalo {index + 1}</span>
                      {timeRanges.length > 1 && (
                        <Button variant="ghost" size="sm" onClick={() => removeTimeRange(index)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <Label className="text-xs">Início</Label>
                        <Input
                          type="time"
                          value={range.start}
                          onChange={(e) => updateTimeRange(index, 'start', e.target.value)}
                          className="h-9"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Fim</Label>
                        <Input
                          type="time"
                          value={range.end}
                          onChange={(e) => updateTimeRange(index, 'end', e.target.value)}
                          className="h-9"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Duração (min)</Label>
                        <Input
                          type="number"
                          value={range.duration}
                          onChange={(e) => updateTimeRange(index, 'duration', parseInt(e.target.value) || 0)}
                          min="15"
                          step="5"
                          className="h-9"
                        />
                      </div>
                    </div>
                    {range.start && range.end && range.duration > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {generateTimeSlots(range.start, range.end, range.duration).map(time => (
                          <Badge key={time} variant="outline" className="text-xs">
                            {time}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <Button variant="outline" size="sm" onClick={addTimeRange} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Intervalo
              </Button>

              <Button 
                onClick={handleCreateAvailability} 
                className="w-full"
                disabled={selectedDates.length === 0}
              >
                Criar Agendas
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Agendas */}
      <Card>
        <CardHeader>
          <CardTitle>Agendas Criadas</CardTitle>
        </CardHeader>
        <CardContent>
          {professionalAvailabilities.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Nenhuma agenda criada. Crie sua primeira agenda acima.
            </p>
          ) : (
            <div className="space-y-2">
              {professionalAvailabilities
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .map(availability => {
                  const bookedCount = publicAppointments.filter(apt => apt.availabilityId === availability.id).length;
                  const totalSlots = availability.timeSlots.length;
                  const availableCount = totalSlots - bookedCount;
                  const isPast = isBefore(new Date(availability.date), today);
                  
                  return (
                    <div 
                      key={availability.id} 
                      className={`flex items-center justify-between p-3 border rounded-lg ${isPast ? 'opacity-50' : 'hover:border-primary/50'}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-center min-w-[60px]">
                          <p className="text-lg font-bold">
                            {format(new Date(availability.date), "dd")}
                          </p>
                          <p className="text-xs text-muted-foreground uppercase">
                            {format(new Date(availability.date), "MMM", { locale: ptBR })}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium">
                            {format(new Date(availability.date), "EEEE", { locale: ptBR })}
                          </p>
                          <div className="flex gap-2 mt-1">
                            <Badge variant={availableCount > 0 ? "default" : "secondary"} className="text-xs">
                              {availableCount} livre(s)
                            </Badge>
                            {bookedCount > 0 && (
                              <Badge variant="outline" className="text-xs">
                                {bookedCount} agendado(s)
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      {!isPast && bookedCount === 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteAvailability(availability.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  );
                })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ScheduleAvailability;
