
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format, addMinutes } from "date-fns";

interface ScheduleFormProps {
  onScheduleCreated: (schedule: any) => void;
}

const ScheduleForm: React.FC<ScheduleFormProps> = ({ onScheduleCreated }) => {
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    slotDuration: 60
  });
  const { toast } = useToast();

  const getMinimumDateTime = () => {
    const now = new Date();
    const minTime = addMinutes(now, 30);
    return {
      date: format(now, "yyyy-MM-dd"),
      time: format(minTime, "HH:mm")
    };
  };

  const handleSubmit = () => {
    if (!formData.startDate || !formData.endDate || !formData.startTime || !formData.endTime) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
    const endDateTime = new Date(`${formData.startDate}T${formData.endTime}`);
    
    if (startDateTime >= endDateTime) {
      toast({
        title: "Erro",
        description: "A hora de fim deve ser posterior à hora de início.",
        variant: "destructive"
      });
      return;
    }

    // Criar agenda para cada dia no período
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const schedules = [];

    while (start <= end) {
      schedules.push({
        id: `schedule-${Date.now()}-${Math.random()}`,
        date: format(start, "yyyy-MM-dd"),
        startTime: formData.startTime,
        endTime: formData.endTime,
        slotDuration: formData.slotDuration,
        available: true
      });
      start.setDate(start.getDate() + 1);
    }

    schedules.forEach(schedule => onScheduleCreated(schedule));

    toast({
      title: "Agendas criadas",
      description: `${schedules.length} agenda(s) criada(s) com sucesso.`
    });

    handleClear();
  };

  const handleClear = () => {
    setFormData({
      startDate: "",
      endDate: "",
      startTime: "",
      endTime: "",
      slotDuration: 60
    });
  };

  const minDateTime = getMinimumDateTime();

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Criar Nova Agenda
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <Label htmlFor="startDate">Data Início</Label>
            <Input
              id="startDate"
              type="date"
              min={minDateTime.date}
              value={formData.startDate}
              onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="endDate">Data Fim</Label>
            <Input
              id="endDate"
              type="date"
              min={formData.startDate || minDateTime.date}
              value={formData.endDate}
              onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="startTime">Hora Início</Label>
            <Input
              id="startTime"
              type="time"
              min={formData.startDate === minDateTime.date ? minDateTime.time : undefined}
              value={formData.startTime}
              onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="endTime">Hora Fim</Label>
            <Input
              id="endTime"
              type="time"
              min={formData.startTime}
              value={formData.endTime}
              onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="duration">Duração (min)</Label>
            <Select value={formData.slotDuration.toString()} onValueChange={(value) => setFormData(prev => ({ ...prev, slotDuration: parseInt(value) }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 min</SelectItem>
                <SelectItem value="45">45 min</SelectItem>
                <SelectItem value="60">60 min</SelectItem>
                <SelectItem value="90">90 min</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <Button onClick={handleSubmit}>
            <Plus className="h-4 w-4 mr-2" />
            Criar Agenda
          </Button>
          <Button variant="outline" onClick={handleClear}>
            Limpar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScheduleForm;
