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
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [customTime, setCustomTime] = useState("");
  const { user } = useAuth();
  const { availabilities, addAvailability, deleteAvailability, getAvailabilitiesByProfessional } = usePatientStore();
  const { toast } = useToast();

  const defaultTimeOptions = [
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"
  ];

  const professionalAvailabilities = user ? getAvailabilitiesByProfessional(user.email) : [];

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    
    const dateStr = format(date, "yyyy-MM-dd");
    const exists = selectedDates.some(d => format(d, "yyyy-MM-dd") === dateStr);
    
    if (exists) {
      setSelectedDates(prev => prev.filter(d => format(d, "yyyy-MM-dd") !== dateStr));
    } else {
      setSelectedDates(prev => [...prev, date]);
    }
  };

  const handleTimeToggle = (time: string) => {
    setTimeSlots(prev => 
      prev.includes(time) 
        ? prev.filter(t => t !== time)
        : [...prev, time]
    );
  };

  const handleAddCustomTime = () => {
    if (customTime && !timeSlots.includes(customTime)) {
      setTimeSlots(prev => [...prev, customTime].sort());
      setCustomTime("");
    }
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

    if (timeSlots.length === 0) {
      toast({
        title: "Selecione horários",
        description: "Por favor, selecione pelo menos um horário.",
        variant: "destructive"
      });
      return;
    }

    try {
      for (const date of selectedDates) {
        await addAvailability({
          date: format(date, "yyyy-MM-dd"),
          timeSlots: timeSlots.map(time => ({ time, available: true })),
          professionalId: user?.email || ""
        });
      }

      toast({
        title: "Agendas criadas",
        description: `${selectedDates.length} agenda(s) criada(s) com sucesso.`
      });

      setSelectedDates([]);
      setTimeSlots([]);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao criar agendas. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteAvailability = async (id: string) => {
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
                <Label className="text-base mb-3 block">Horários disponíveis</Label>
                <div className="grid grid-cols-3 gap-2 max-h-[300px] overflow-y-auto p-2 border rounded-lg">
                  {defaultTimeOptions.map(time => (
                    <div key={time} className="flex items-center space-x-2">
                      <Checkbox
                        id={time}
                        checked={timeSlots.includes(time)}
                        onCheckedChange={() => handleTimeToggle(time)}
                      />
                      <Label htmlFor={time} className="cursor-pointer text-sm">
                        {time}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-sm mb-2 block">Adicionar horário personalizado</Label>
                <div className="flex gap-2">
                  <Input
                    type="time"
                    value={customTime}
                    onChange={(e) => setCustomTime(e.target.value)}
                    className="flex-1"
                  />
                  <Button size="sm" onClick={handleAddCustomTime}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {timeSlots.length > 0 && (
                <div className="p-3 bg-muted rounded-lg">
                  <Label className="text-sm mb-2 block">Horários selecionados:</Label>
                  <div className="flex flex-wrap gap-2">
                    {timeSlots.map(time => (
                      <Badge key={time} variant="default">
                        <Clock className="h-3 w-3 mr-1" />
                        {time}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <Button 
                onClick={handleCreateAvailability} 
                className="w-full"
                disabled={selectedDates.length === 0 || timeSlots.length === 0}
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
              {professionalAvailabilities.map(availability => (
                <div key={availability.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">
                      {format(new Date(availability.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {availability.timeSlots.map(slot => (
                        <Badge key={slot.time} variant={slot.available ? "default" : "secondary"} className="text-xs">
                          {slot.time}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteAvailability(availability.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ScheduleAvailability;
