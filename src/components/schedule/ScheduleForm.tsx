import React, { useState, useMemo, useEffect } from "react";
import { Plus, X, Calendar, Clock, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { usePatientStore } from "@/stores/patientStore";

interface ScheduleFormProps {
  onClose: () => void;
  onScheduleCreated?: () => void;
}

interface PresetSchedule {
  name: string;
  start: string;
  end: string;
  lunch: boolean;
  lunchStart?: string;
  lunchEnd?: string;
}

const ScheduleForm: React.FC<ScheduleFormProps> = ({ onClose, onScheduleCreated }) => {
  const { user } = useAuth();
  const { addAvailability } = usePatientStore();
  const { toast } = useToast();

  const [dateMode, setDateMode] = useState<'single' | 'range'>('single');
  const [singleDate, setSingleDate] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [slotDuration, setSlotDuration] = useState('50');
  const [lunchBreak, setLunchBreak] = useState(false);
  const [lunchStart, setLunchStart] = useState('12:00');
  const [lunchEnd, setLunchEnd] = useState('13:00');
  const [enableRecurrence, setEnableRecurrence] = useState(false);
  const [recurrenceOccurrences, setRecurrenceOccurrences] = useState(4);
  const [selectedPreset, setSelectedPreset] = useState<PresetSchedule | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const presetSchedules: PresetSchedule[] = [
    { name: 'Meio Período (Manhã)', start: '08:00', end: '12:00', lunch: false },
    { name: 'Meio Período (Tarde)', start: '14:00', end: '18:00', lunch: false },
    { name: 'Período Integral', start: '08:00', end: '17:00', lunch: true, lunchStart: '12:00', lunchEnd: '13:00' },
    { name: 'Estendido', start: '07:00', end: '19:00', lunch: true, lunchStart: '12:00', lunchEnd: '13:00' },
  ];

  const minDate = useMemo(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }, []);

  // Pré-selecionar "Meio Período (Manhã)" ao montar o componente
  useEffect(() => {
    const manhaPreset = presetSchedules[0];
    setSelectedPreset(manhaPreset);
    setLunchBreak(manhaPreset.lunch);
    if (manhaPreset.lunchStart) setLunchStart(manhaPreset.lunchStart);
    if (manhaPreset.lunchEnd) setLunchEnd(manhaPreset.lunchEnd);
  }, []);

  const generateTimeSlots = (preset: PresetSchedule, duration: number): string[] => {
    const slots: string[] = [];
    const startTime = new Date(`2000-01-01T${preset.start}:00`);
    const endTime = new Date(`2000-01-01T${preset.end}:00`);

    const currentTime = new Date(startTime);
    while (currentTime < endTime) {
      const timeStr = currentTime.toTimeString().slice(0, 5);

      // Skip lunch break if enabled
      if (lunchBreak) {
        const lunchStartTime = new Date(`2000-01-01T${lunchStart}:00`);
        const lunchEndTime = new Date(`2000-01-01T${lunchEnd}:00`);
        if (currentTime >= lunchStartTime && currentTime < lunchEndTime) {
          currentTime.setMinutes(currentTime.getMinutes() + duration);
          continue;
        }
      }

      slots.push(timeStr);
      currentTime.setMinutes(currentTime.getMinutes() + duration);
    }

    return slots;
  };

  const getDatesBetween = (start: Date, end: Date): Date[] => {
    const dates: Date[] = [];
    const currentDate = new Date(start);
    while (currentDate <= end) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  };

  const getRecurringDates = (baseDate: Date, occurrences: number): Date[] => {
    const dates: Date[] = [];
    for (let i = 0; i < occurrences; i++) {
      const newDate = new Date(baseDate);
      newDate.setDate(newDate.getDate() + i * 7);
      dates.push(newDate);
    }
    return dates;
  };

  const handleCreateSchedule = async () => {
    if (dateMode === 'single' && !singleDate) {
      toast({
        title: "Selecione uma data",
        description: "Por favor, selecione uma data para criar a agenda.",
        variant: "destructive"
      });
      return;
    }

    if (dateMode === 'range' && !startDate) {
      toast({
        title: "Selecione a data inicial",
        description: "Por favor, selecione a data inicial para criar a agenda.",
        variant: "destructive"
      });
      return;
    }

    if (!selectedPreset) {
      toast({
        title: "Selecione um modelo",
        description: "Por favor, selecione um modelo de horário.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const timeSlots = generateTimeSlots(selectedPreset, parseInt(slotDuration));
      let datesToCreate: Date[] = [];

      if (dateMode === 'single') {
        const baseDate = new Date(singleDate + 'T00:00:00');
        if (enableRecurrence) {
          datesToCreate = getRecurringDates(baseDate, recurrenceOccurrences);
        } else {
          datesToCreate = [baseDate];
        }
      } else {
        const start = new Date(startDate + 'T00:00:00');
        const end = endDate ? new Date(endDate + 'T00:00:00') : start;
        datesToCreate = getDatesBetween(start, end);
      }

      for (const date of datesToCreate) {
        await addAvailability({
          date: date.toISOString().split('T')[0],
          timeSlots: timeSlots.map(time => ({ time, available: true })),
          professionalId: user?.email || ""
        });
      }

      toast({
        title: "Agendas criadas com sucesso!",
        description: `${datesToCreate.length} agenda(s) criada(s) com ${timeSlots.length} horários cada.`
      });

      onClose();
      onScheduleCreated?.();
    } catch (error) {
      toast({
        title: "Erro ao criar agenda",
        description: "Ocorreu um erro ao criar as agendas. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const previewSlots = selectedPreset ? generateTimeSlots(selectedPreset, parseInt(slotDuration)) : [];

  return (
    <Card className="border-primary/20 shadow-lg">
      <CardHeader className="bg-primary/5 border-b border-primary/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
              <Calendar className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <CardTitle>Nova Agenda</CardTitle>
              <p className="text-sm text-muted-foreground">Configure os dias e horários disponíveis</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6 space-y-6">
        {/* Quick Presets */}
        <div>
          <Label className="text-sm font-semibold mb-3 block">Modelos Rápidos</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {presetSchedules.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => {
                  setSelectedPreset(preset);
                  setLunchBreak(preset.lunch);
                  if (preset.lunchStart) setLunchStart(preset.lunchStart);
                  if (preset.lunchEnd) setLunchEnd(preset.lunchEnd);
                }}
                className={`p-3 text-left border rounded-lg transition-colors ${
                  selectedPreset?.name === preset.name
                    ? 'border-primary ring-2 ring-primary/30 bg-primary/10'
                    : 'border-border hover:bg-muted/50'
                }`}
              >
                <div className="font-medium text-sm">{preset.name}</div>
                <div className="text-xs text-muted-foreground">
                  {preset.start} às {preset.end}
                  {preset.lunch && <span className="ml-2">• Almoço incluído</span>}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Date Selection Mode */}
        <div>
          <Label className="text-sm font-semibold mb-2 block">Tipo de Agenda</Label>
          <div className="grid grid-cols-2 gap-2 mb-4">
            <button
              type="button"
              onClick={() => {
                setDateMode('single');
                setEnableRecurrence(false);
              }}
              className={`p-3 text-left border rounded-lg transition-colors ${
                dateMode === 'single'
                  ? 'border-primary ring-2 ring-primary/30 bg-primary/10'
                  : 'border-border hover:bg-muted/50'
              }`}
            >
              <div className="font-medium text-sm">Dia Único</div>
              <div className="text-xs text-muted-foreground">Criar agenda para um dia específico</div>
            </button>
            <button
              type="button"
              onClick={() => {
                setDateMode('range');
                setEnableRecurrence(false);
              }}
              className={`p-3 text-left border rounded-lg transition-colors ${
                dateMode === 'range'
                  ? 'border-primary ring-2 ring-primary/30 bg-primary/10'
                  : 'border-border hover:bg-muted/50'
              }`}
            >
              <div className="font-medium text-sm">Intervalo de Dias</div>
              <div className="text-xs text-muted-foreground">Criar agenda para vários dias</div>
            </button>
          </div>

          {dateMode === 'single' ? (
            <>
              <Label className="text-sm font-semibold mb-2 block">Data</Label>
              <Input
                type="date"
                value={singleDate}
                onChange={(e) => setSingleDate(e.target.value)}
                className="w-full"
                min={minDate}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Agendas podem ser criadas a partir de hoje
              </p>

              {/* Recurrence Option */}
              <div className="mt-4 bg-muted/30 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <input
                    type="checkbox"
                    id="enableRecurrence"
                    checked={enableRecurrence}
                    onChange={(e) => setEnableRecurrence(e.target.checked)}
                    className="w-4 h-4 rounded accent-primary"
                  />
                  <label htmlFor="enableRecurrence" className="text-sm font-semibold">
                    Repetir esta agenda semanalmente
                  </label>
                </div>

                {enableRecurrence && singleDate && (
                  <div>
                    <Label className="text-xs text-muted-foreground mb-2 block">
                      Repetir por quantas semanas? (incluindo a primeira)
                    </Label>
                    <Input
                      type="number"
                      min="1"
                      max="52"
                      value={recurrenceOccurrences}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 1;
                        setRecurrenceOccurrences(Math.min(Math.max(value, 1), 52));
                      }}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      {(() => {
                        const baseDate = new Date(singleDate + 'T00:00:00');
                        const dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
                        const dayName = dayNames[baseDate.getDay()];
                        
                        if (recurrenceOccurrences === 1) {
                          return `Esta agenda será criada apenas para ${dayName}, ${baseDate.toLocaleDateString('pt-BR')}`;
                        }
                        
                        const lastDate = new Date(baseDate);
                        lastDate.setDate(lastDate.getDate() + (recurrenceOccurrences - 1) * 7);
                        
                        return `Esta agenda será criada para ${recurrenceOccurrences} ${dayName}s seguidas, de ${baseDate.toLocaleDateString('pt-BR')} até ${lastDate.toLocaleDateString('pt-BR')}`;
                      })()}
                    </p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-semibold mb-2 block">Data Inicial</Label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full"
                  min={minDate}
                />
              </div>
              <div>
                <Label className="text-sm font-semibold mb-2 block">Data Final (Opcional)</Label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full"
                  min={startDate || minDate}
                />
              </div>
              {startDate && (
                <p className="text-xs text-muted-foreground col-span-full">
                  {endDate
                    ? `Agendas serão criadas para todos os dias entre ${new Date(startDate + 'T00:00:00').toLocaleDateString('pt-BR')} e ${new Date(endDate + 'T00:00:00').toLocaleDateString('pt-BR')}`
                    : `Agenda será criada apenas para ${new Date(startDate + 'T00:00:00').toLocaleDateString('pt-BR')}`}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Slot Duration */}
        <div>
          <Label className="text-sm font-semibold mb-2 block">Duração por Consulta</Label>
          <select
            value={slotDuration}
            onChange={(e) => setSlotDuration(e.target.value)}
            className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="15">15 minutos</option>
            <option value="20">20 minutos</option>
            <option value="30">30 minutos</option>
            <option value="45">45 minutos</option>
            <option value="50">50 minutos</option>
            <option value="60">60 minutos</option>
          </select>
        </div>

        {/* Lunch Break */}
        <div className="bg-muted/30 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <input
              type="checkbox"
              id="lunchBreak"
              checked={lunchBreak}
              onChange={(e) => setLunchBreak(e.target.checked)}
              className="w-4 h-4 rounded accent-primary"
            />
            <label htmlFor="lunchBreak" className="text-sm font-semibold">
              Intervalo para Almoço
            </label>
          </div>

          {lunchBreak && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">Início do intervalo</Label>
                <Input
                  type="time"
                  value={lunchStart}
                  onChange={(e) => setLunchStart(e.target.value)}
                  className="text-sm"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">Fim do intervalo</Label>
                <Input
                  type="time"
                  value={lunchEnd}
                  onChange={(e) => setLunchEnd(e.target.value)}
                  className="text-sm"
                />
              </div>
            </div>
          )}
        </div>

        {/* Preview */}
        {selectedPreset && previewSlots.length > 0 && (
          <div className="bg-muted/30 rounded-lg p-4">
            <h4 className="text-sm font-semibold mb-2">Prévia dos Horários</h4>
            <div className="flex flex-wrap gap-1">
              {previewSlots.slice(0, 8).map((time) => (
                <Badge key={time} className="text-xs">
                  {time}
                </Badge>
              ))}
              {previewSlots.length > 8 && (
                <span className="px-2 py-1 text-xs text-muted-foreground">
                  +{previewSlots.length - 8} mais
                </span>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleCreateSchedule}
            disabled={
              (dateMode === 'single' && !singleDate) ||
              (dateMode === 'range' && !startDate) ||
              !selectedPreset ||
              isSubmitting
            }
            className="flex-1"
          >
            {isSubmitting ? (
              <Clock className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Criar Agenda
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScheduleForm;
