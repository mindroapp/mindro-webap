
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar, Check, X, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ScheduleCalendarProps {
  type: "schedules" | "appointments";
}

const ScheduleCalendar: React.FC<ScheduleCalendarProps> = ({ type }) => {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState<any>(null);
  const { toast } = useToast();

  // Mock data - últimos dias do mês com agenda livre e agendamentos
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  
  // Últimos 7 dias do mês atual
  const lastWeekDates = [];
  for (let i = 6; i >= 0; i--) {
    const day = lastDayOfMonth - i;
    const date = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    lastWeekDates.push(date);
  }

  // Mock - agenda livre (verde) nos últimos dias do mês
  const availableDates = [lastWeekDates[0], lastWeekDates[2], lastWeekDates[4], lastWeekDates[6]];
  
  // Mock - agendamentos (vermelho) nos últimos dias do mês
  const appointmentDates = [lastWeekDates[1], lastWeekDates[3], lastWeekDates[5]];

  // Mock agendamentos do dia
  const dayAppointments = [
    { id: "1", time: "09:00", patient: "João Silva", status: "confirmed" },
    { id: "2", time: "14:00", patient: "Maria Santos", status: "pending" },
    { id: "3", time: "16:00", patient: "Pedro Costa", status: "confirmed" },
  ];

  const generateCalendarDays = () => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push({ date: "", day: "", isEmpty: true });
    }
    
    // Days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      days.push({
        date,
        day: i,
        isAvailable: type === "schedules" && availableDates.includes(date),
        hasAppointment: type === "appointments" && appointmentDates.includes(date),
        isSelectable: type === "schedules" ? availableDates.includes(date) : appointmentDates.includes(date),
        isEmpty: false
      });
    }
    
    return days;
  };

  const handleDateClick = (date: string, isSelectable: boolean) => {
    if (!isSelectable) return;
    
    setSelectedDate(date);
    if (type === "schedules") {
      setModalData({ type: "schedule", date });
    } else {
      setModalData({ type: "appointments", date, appointments: dayAppointments });
    }
    setIsModalOpen(true);
  };

  const handleSaveSchedule = () => {
    toast({
      title: "Agenda salva",
      description: "Horários disponíveis foram salvos com sucesso."
    });
    setIsModalOpen(false);
  };

  const handleConfirmAppointment = (appointmentId: string) => {
    toast({
      title: "Agendamento confirmado",
      description: "O agendamento foi confirmado com sucesso."
    });
  };

  const handleCancelAppointment = (appointmentId: string) => {
    toast({
      title: "Agendamento cancelado",
      description: "O agendamento foi cancelado."
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const getMonthName = () => {
    const months = [
      "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
      "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];
    return `${months[currentMonth]} ${currentYear}`;
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>
              {type === "schedules" ? "Calendário de Agendas" : "Calendário de Agendamentos"}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold">{getMonthName()}</h3>
          </div>
          
          <div className="grid grid-cols-7 gap-2 mb-4">
            {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map(day => (
              <div key={day} className="text-center font-medium text-sm text-gray-500 p-2">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-2">
            {generateCalendarDays().map((dayInfo, index) => {
              if (dayInfo.isEmpty) {
                return <div key={index} className="h-12"></div>;
              }
              
              const { date, day, isAvailable, hasAppointment, isSelectable } = dayInfo;
              
              return (
                <Button
                  key={date}
                  variant="outline"
                  className={`
                    h-12 p-0 text-sm
                    ${isAvailable ? "bg-green-100 border-green-300 text-green-800 hover:bg-green-200" : ""}
                    ${hasAppointment ? "bg-red-100 border-red-300 text-red-800 hover:bg-red-200" : ""}
                    ${!isSelectable ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                  `}
                  onClick={() => handleDateClick(date, isSelectable)}
                  disabled={!isSelectable}
                >
                  {day}
                </Button>
              );
            })}
          </div>

          <div className="flex items-center justify-center space-x-6 mt-4 text-sm">
            {type === "schedules" && (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
                <span>Agenda Livre</span>
              </div>
            )}
            {type === "appointments" && (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
                <span>Com Agendamento</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {modalData?.type === "schedule" ? "Configurar Agenda" : "Agendamentos do Dia"}
            </DialogTitle>
          </DialogHeader>

          {modalData?.type === "schedule" ? (
            <div className="space-y-4">
              <div>
                <Label>Data selecionada</Label>
                <Input value={formatDate(selectedDate)} disabled />
              </div>
              <div>
                <Label>Horários disponíveis</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {["08:00", "09:00", "10:00", "14:00", "15:00", "16:00"].map(time => (
                    <Badge key={time} variant="outline" className="justify-center p-2">
                      {time}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSaveSchedule}>
                  <Plus className="h-4 w-4 mr-2" />
                  Salvar Agenda
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <Label>Data: {formatDate(selectedDate)}</Label>
              </div>
              <div className="space-y-3">
                {dayAppointments.map(appointment => (
                  <div key={appointment.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{appointment.time} - {appointment.patient}</p>
                      <Badge variant={appointment.status === "confirmed" ? "default" : "secondary"}>
                        {appointment.status === "confirmed" ? "Confirmado" : "Pendente"}
                      </Badge>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        onClick={() => handleConfirmAppointment(appointment.id)}
                        disabled={appointment.status === "confirmed"}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleCancelAppointment(appointment.id)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ScheduleCalendar;
