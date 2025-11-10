import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarIcon, Clock, Copy, Plus, Trash2, ExternalLink } from "lucide-react";
import { usePatientStore } from "@/stores/patientStore";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Input } from "@/components/ui/input";

const ScheduleAvailability: React.FC = () => {
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [timeRanges, setTimeRanges] = useState<{ start: string; end: string; duration: number }[]>([
    { start: "", end: "", duration: 50 }
  ]);
  const { user } = useAuth();
  const { availabilities, addAvailability, deleteAvailability, getAvailabilitiesByProfessional, publicAppointments } = usePatientStore();
  const { toast } = useToast();

  const professionalAvailabilities = user ? getAvailabilitiesByProfessional(user.email) : [];

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
        description: "Por favor, selecione pelo menos uma data no calendário.",
        variant: "destructive"
      });
      return;
    }

    const validRanges = timeRanges.filter(r => r.start && r.end && r.duration > 0);
    if (validRanges.length === 0) {
      toast({
        title: "Configure horários",
        description: "Por favor, configure pelo menos um intervalo de horários.",
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
      setTimeRanges([{ start: "", end: "", duration: 50 }]);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao criar agendas. Tente novamente.",
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
    const link = `${window.location.origin}/booking/${user?.email}`;
    navigator.clipboard.writeText(link);
    toast({
      title: "Link copiado",
      description: "O link foi copiado para a área de transferência."
    });
  };

  const openPublicLink = () => {
    const link = `${window.location.origin}/booking/${user?.email}`;
    window.open(link, '_blank');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Criar Agendas Livres
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={copyPublicLink}>
                <Copy className="h-4 w-4 mr-2" />
                Copiar Link
              </Button>
              <Button variant="outline" size="sm" onClick={openPublicLink}>
                <ExternalLink className="h-4 w-4 mr-2" />
                Visualizar
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Calendário */}
            <div>
              <Label className="text-base mb-3 block">Selecione os dias</Label>
              <Calendar
                mode="multiple"
                selected={selectedDates}
                onSelect={(dates) => setSelectedDates(dates || [])}
                className="rounded-md border pointer-events-auto"
                locale={ptBR}
                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
              />
              {selectedDates.length > 0 && (
                <div className="mt-3">
                  <Badge variant="secondary">
                    {selectedDates.length} dia(s) selecionado(s)
                  </Badge>
                </div>
              )}
            </div>

            {/* Horários */}
            <div className="space-y-4">
              <div>
                <Label className="text-base mb-3 block">Intervalos de horários</Label>
                <div className="space-y-3 max-h-[350px] overflow-y-auto">
                  {timeRanges.map((range, index) => (
                    <div key={index} className="p-3 border rounded-lg space-y-2">
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-sm font-medium">Intervalo {index + 1}</Label>
                        {timeRanges.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeTimeRange(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-xs">Início</Label>
                          <Input
                            type="time"
                            value={range.start}
                            onChange={(e) => updateTimeRange(index, 'start', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Fim</Label>
                          <Input
                            type="time"
                            value={range.end}
                            onChange={(e) => updateTimeRange(index, 'end', e.target.value)}
                          />
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs">Duração da sessão (minutos)</Label>
                        <Input
                          type="number"
                          value={range.duration}
                          onChange={(e) => updateTimeRange(index, 'duration', parseInt(e.target.value) || 0)}
                          min="15"
                          step="5"
                        />
                      </div>
                      {range.start && range.end && range.duration > 0 && (
                        <div className="pt-2 border-t">
                          <Label className="text-xs text-muted-foreground">Horários gerados:</Label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {generateTimeSlots(range.start, range.end, range.duration).map(time => (
                              <Badge key={time} variant="outline" className="text-xs">
                                {time}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addTimeRange}
                  className="w-full mt-2"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Intervalo
                </Button>
              </div>

              <Button 
                onClick={handleCreateAvailability} 
                className="w-full"
                disabled={selectedDates.length === 0}
              >
                <Plus className="h-4 w-4 mr-2" />
                Criar Agendas
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Agendas Criadas */}
      <Card>
        <CardHeader>
          <CardTitle>Agendas Criadas</CardTitle>
        </CardHeader>
        <CardContent>
          {professionalAvailabilities.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Nenhuma agenda criada ainda. Crie sua primeira agenda acima.
            </p>
          ) : (
            <div className="space-y-3">
              {professionalAvailabilities.map(availability => {
                const hasAppointments = publicAppointments.some(apt => apt.availabilityId === availability.id);
                const availableSlots = availability.timeSlots.filter(s => s.available).length;
                const totalSlots = availability.timeSlots.length;
                
                return (
                  <div key={availability.id} className="p-4 border rounded-lg hover:border-primary/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <p className="font-semibold text-foreground">
                            {format(new Date(availability.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                          </p>
                          <Badge variant={availableSlots > 0 ? "default" : "secondary"}>
                            {availableSlots}/{totalSlots} livres
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {availability.timeSlots.map(slot => (
                            <Badge 
                              key={slot.time} 
                              variant={slot.available ? "outline" : "secondary"}
                              className="text-xs"
                            >
                              <Clock className="h-3 w-3 mr-1" />
                              {slot.time}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteAvailability(availability.id)}
                        disabled={hasAppointments}
                        title={hasAppointments ? "Possui agendamentos vinculados" : "Excluir agenda"}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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
