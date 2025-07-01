
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Check, X, Plus, Video, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { usePatientStore } from "@/stores/patientStore";
import { format, addDays, addMinutes, isAfter, isBefore, differenceInMinutes } from "date-fns";

interface ScheduleCalendarProps {
  type: "schedules" | "appointments";
}

interface Schedule {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
}

interface Appointment {
  id: string;
  date: string;
  time: string;
  patientId: string;
  patientName: string;
  notes: string;
  status: "pending" | "confirmed" | "completed";
}

const ScheduleCalendar: React.FC<ScheduleCalendarProps> = ({ type }) => {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState<any>(null);
  const { toast } = useToast();
  const { patients } = usePatientStore();

  // Form states for schedule creation
  const [scheduleForm, setScheduleForm] = useState({
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    duration: 60
  });

  // Form states for appointment creation
  const [appointmentForm, setAppointmentForm] = useState({
    patientId: "",
    notes: "",
    selectedTime: ""
  });

  // Mock data - schedules and appointments
  const [schedules, setSchedules] = useState<Schedule[]>([
    { id: "1", date: "2025-01-03", startTime: "09:00", endTime: "17:00", duration: 60 },
    { id: "2", date: "2025-01-05", startTime: "14:00", endTime: "18:00", duration: 60 },
  ]);

  const [appointments, setAppointments] = useState<Appointment[]>([
    { id: "1", date: "2025-01-03", time: "10:00", patientId: "p1", patientName: "João Silva", notes: "Consulta inicial", status: "confirmed" },
    { id: "2", date: "2025-01-03", time: "15:00", patientId: "p2", patientName: "Maria Santos", notes: "", status: "pending" },
  ]);

  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
  const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;

  const generateCalendarDays = (month: number, year: number) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push({ date: "", day: "", isEmpty: true });
    }
    
    // Days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const hasSchedule = schedules.some(s => s.date === date);
      const hasAppointment = appointments.some(a => a.date === date);
      const isPastDate = isBefore(new Date(date), new Date(today.toDateString()));
      
      days.push({
        date,
        day: i,
        hasSchedule,
        hasAppointment,
        isSelectable: !isPastDate && (type === "schedules" || hasSchedule),
        isEmpty: false,
        isPastDate
      });
    }
    
    return days;
  };

  const getMinimumTime = () => {
    const now = new Date();
    const minTime = addMinutes(now, 30);
    return format(minTime, "HH:mm");
  };

  const isTimeValid = (time: string, date: string) => {
    const now = new Date();
    const selectedDateTime = new Date(`${date}T${time}`);
    const minDateTime = addMinutes(now, 30);
    return isAfter(selectedDateTime, minDateTime);
  };

  const canCancelOrDelete = (datetime: string) => {
    const now = new Date();
    const itemDateTime = new Date(datetime);
    return differenceInMinutes(itemDateTime, now) >= 30;
  };

  const handleDateClick = (date: string, isSelectable: boolean) => {
    if (!isSelectable) return;
    
    setSelectedDate(date);
    
    if (type === "schedules") {
      const daySchedules = schedules.filter(s => s.date === date);
      setModalData({ type: "view-schedules", date, schedules: daySchedules });
    } else {
      const hasSchedule = schedules.some(s => s.date === date);
      if (hasSchedule) {
        const dayAppointments = appointments.filter(a => a.date === date);
        const availableTimes = generateAvailableTimes(date);
        setModalData({ 
          type: dayAppointments.length > 0 ? "view-appointments" : "create-appointment", 
          date, 
          appointments: dayAppointments,
          availableTimes 
        });
      }
    }
    setIsModalOpen(true);
  };

  const generateAvailableTimes = (date: string) => {
    const schedule = schedules.find(s => s.date === date);
    if (!schedule) return [];

    const times = [];
    const start = new Date(`${date}T${schedule.startTime}`);
    const end = new Date(`${date}T${schedule.endTime}`);
    
    let current = start;
    while (current < end) {
      const timeStr = format(current, "HH:mm");
      const isBooked = appointments.some(a => a.date === date && a.time === timeStr);
      const isValidTime = date === format(today, "yyyy-MM-dd") ? isTimeValid(timeStr, date) : true;
      
      if (!isBooked && isValidTime) {
        times.push(timeStr);
      }
      current = addMinutes(current, schedule.duration);
    }
    
    return times;
  };

  const handleCreateSchedule = () => {
    if (!scheduleForm.startDate || !scheduleForm.endDate || !scheduleForm.startTime || !scheduleForm.endTime) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    const startDate = new Date(scheduleForm.startDate);
    const endDate = new Date(scheduleForm.endDate);
    
    const newSchedules: Schedule[] = [];
    let currentDate = startDate;
    
    while (currentDate <= endDate) {
      const dateStr = format(currentDate, "yyyy-MM-dd");
      newSchedules.push({
        id: `s${Date.now()}-${Math.random()}`,
        date: dateStr,
        startTime: scheduleForm.startTime,
        endTime: scheduleForm.endTime,
        duration: scheduleForm.duration
      });
      currentDate = addDays(currentDate, 1);
    }
    
    setSchedules(prev => [...prev, ...newSchedules]);
    
    toast({
      title: "Agendas criadas",
      description: `${newSchedules.length} agenda(s) criada(s) com sucesso.`
    });
    
    handleClearForm();
  };

  const handleClearForm = () => {
    setScheduleForm({
      startDate: "",
      endDate: "",
      startTime: "",
      endTime: "",
      duration: 60
    });
  };

  const handleDeleteSchedule = (scheduleId: string) => {
    setSchedules(prev => prev.filter(s => s.id !== scheduleId));
    toast({
      title: "Agenda excluída",
      description: "Agenda removida com sucesso."
    });
    setIsModalOpen(false);
  };

  const handleCreateAppointment = () => {
    if (!appointmentForm.patientId || !appointmentForm.selectedTime) {
      toast({
        title: "Erro",
        description: "Selecione um paciente e horário.",
        variant: "destructive"
      });
      return;
    }

    const patient = patients.find(p => p.id === appointmentForm.patientId);
    const newAppointment: Appointment = {
      id: `a${Date.now()}`,
      date: selectedDate,
      time: appointmentForm.selectedTime,
      patientId: appointmentForm.patientId,
      patientName: patient?.name || "",
      notes: appointmentForm.notes,
      status: "pending"
    };

    setAppointments(prev => [...prev, newAppointment]);
    
    toast({
      title: "Agendamento criado",
      description: "Agendamento realizado com sucesso."
    });
    
    setAppointmentForm({ patientId: "", notes: "", selectedTime: "" });
    setIsModalOpen(false);
  };

  const handleConfirmAppointment = (appointmentId: string) => {
    setAppointments(prev => 
      prev.map(a => 
        a.id === appointmentId ? { ...a, status: "confirmed" as const } : a
      )
    );
    
    toast({
      title: "Agendamento confirmado",
      description: "Agendamento confirmado com sucesso."
    });
  };

  const handleCancelAppointment = (appointmentId: string) => {
    setAppointments(prev => prev.filter(a => a.id !== appointmentId));
    
    toast({
      title: "Agendamento cancelado",
      description: "Agendamento cancelado com sucesso."
    });
    
    setIsModalOpen(false);
  };

  const handleStartVideoCall = (appointmentId: string) => {
    const randomToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const meetingUrl = `/meeting?token=${randomToken}&appointment=${appointmentId}`;
    window.open(meetingUrl, '_blank');
    
    toast({
      title: "Videochamada iniciada",
      description: "Nova aba aberta com a sala de videochamada."
    });
  };

  return (
    <div className="space-y-6">
      {type === "schedules" && (
        <Card>
          <CardHeader>
            <CardTitle>Criar Nova Agenda</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Data Início</Label>
                <Input
                  id="startDate"
                  type="date"
                  min={format(today, "yyyy-MM-dd")}
                  value={scheduleForm.startDate}
                  onChange={(e) => setScheduleForm(prev => ({ ...prev, startDate: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="endDate">Data Fim</Label>
                <Input
                  id="endDate"
                  type="date"
                  min={scheduleForm.startDate || format(today, "yyyy-MM-dd")}
                  value={scheduleForm.endDate}
                  onChange={(e) => setScheduleForm(prev => ({ ...prev, endDate: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="startTime">Hora Início</Label>
                <Input
                  id="startTime"
                  type="time"
                  min={scheduleForm.startDate === format(today, "yyyy-MM-dd") ? getMinimumTime() : undefined}
                  value={scheduleForm.startTime}
                  onChange={(e) => setScheduleForm(prev => ({ ...prev, startTime: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="endTime">Hora Fim</Label>
                <Input
                  id="endTime"
                  type="time"
                  min={scheduleForm.startTime}
                  value={scheduleForm.endTime}
                  onChange={(e) => setScheduleForm(prev => ({ ...prev, endTime: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="duration">Duração (minutos)</Label>
                <Select value={scheduleForm.duration.toString()} onValueChange={(value) => setScheduleForm(prev => ({ ...prev, duration: parseInt(value) }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 minutos</SelectItem>
                    <SelectItem value="45">45 minutos</SelectItem>
                    <SelectItem value="60">60 minutos</SelectItem>
                    <SelectItem value="90">90 minutos</SelectItem>
                    <SelectItem value="120">120 minutos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex space-x-2 mt-4">
              <Button onClick={handleCreateSchedule}>
                <Plus className="h-4 w-4 mr-2" />
                Criar Agenda
              </Button>
              <Button variant="outline" onClick={handleClearForm}>
                Limpar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Month Calendar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>
              {format(new Date(currentYear, currentMonth), "MMMM yyyy")}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2 mb-4">
            {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map(day => (
              <div key={day} className="text-center font-medium text-sm text-gray-500 p-2">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-2">
            {generateCalendarDays(currentMonth, currentYear).map((dayInfo, index) => {
              if (dayInfo.isEmpty) {
                return <div key={index} className="h-12"></div>;
              }
              
              const { date, day, hasSchedule, hasAppointment, isSelectable } = dayInfo;
              
              return (
                <Button
                  key={date}
                  variant="outline"
                  className={`
                    h-12 p-0 text-sm
                    ${type === "schedules" && hasSchedule ? "bg-green-100 border-green-300 text-green-800 hover:bg-green-200" : ""}
                    ${type === "appointments" && hasSchedule ? "bg-green-100 border-green-300 text-green-800 hover:bg-green-200" : ""}
                    ${type === "appointments" && !hasSchedule && !dayInfo.isPastDate ? "bg-red-100 border-red-300 text-red-800" : ""}
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
        </CardContent>
      </Card>

      {/* Next Month Calendar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>
              {format(new Date(nextYear, nextMonth), "MMMM yyyy")}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2 mb-4">
            {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map(day => (
              <div key={day} className="text-center font-medium text-sm text-gray-500 p-2">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-2">
            {generateCalendarDays(nextMonth, nextYear).map((dayInfo, index) => {
              if (dayInfo.isEmpty) {
                return <div key={index} className="h-12"></div>;
              }
              
              const { date, day, hasSchedule, hasAppointment, isSelectable } = dayInfo;
              
              return (
                <Button
                  key={date}
                  variant="outline"
                  className={`
                    h-12 p-0 text-sm
                    ${type === "schedules" && hasSchedule ? "bg-green-100 border-green-300 text-green-800 hover:bg-green-200" : ""}
                    ${type === "appointments" && hasSchedule ? "bg-green-100 border-green-300 text-green-800 hover:bg-green-200" : ""}
                    ${type === "appointments" && !hasSchedule && !dayInfo.isPastDate ? "bg-red-100 border-red-300 text-red-800" : ""}
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
        </CardContent>
      </Card>

      <div className="flex items-center justify-center space-x-6 text-sm">
        {type === "schedules" && (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
            <span>Com Agenda</span>
          </div>
        )}
        {type === "appointments" && (
          <>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
              <span>Agenda Disponível</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
              <span>Sem Agenda</span>
            </div>
          </>
        )}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {modalData?.type === "view-schedules" && "Agendas do Dia"}
              {modalData?.type === "create-appointment" && "Criar Agendamento"}
              {modalData?.type === "view-appointments" && "Agendamentos do Dia"}
            </DialogTitle>
          </DialogHeader>

          {modalData?.type === "view-schedules" && (
            <div className="space-y-4">
              <div>
                <Label>Data: {format(new Date(selectedDate), "dd/MM/yyyy")}</Label>
              </div>
              <div className="space-y-3">
                {modalData.schedules.map((schedule: Schedule) => (
                  <div key={schedule.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{schedule.startTime} - {schedule.endTime}</p>
                      <Badge variant="outline">{schedule.duration} min</Badge>
                    </div>
                    {canCancelOrDelete(`${schedule.date}T${schedule.startTime}`) && (
                      <Button size="sm" variant="destructive" onClick={() => handleDeleteSchedule(schedule.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {modalData?.type === "create-appointment" && (
            <div className="space-y-4">
              <div>
                <Label>Data: {format(new Date(selectedDate), "dd/MM/yyyy")}</Label>
              </div>
              <div>
                <Label htmlFor="appointmentTime">Horário Disponível</Label>
                <Select value={appointmentForm.selectedTime} onValueChange={(value) => setAppointmentForm(prev => ({ ...prev, selectedTime: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um horário" />
                  </SelectTrigger>
                  <SelectContent>
                    {modalData.availableTimes.map((time: string) => (
                      <SelectItem key={time} value={time}>{time}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="patient">Paciente</Label>
                <Select value={appointmentForm.patientId} onValueChange={(value) => setAppointmentForm(prev => ({ ...prev, patientId: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um paciente" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>{patient.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="notes">Notas</Label>
                <Textarea
                  id="notes"
                  placeholder="Observações sobre o agendamento"
                  value={appointmentForm.notes}
                  onChange={(e) => setAppointmentForm(prev => ({ ...prev, notes: e.target.value }))}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateAppointment}>
                  Criar Agendamento
                </Button>
              </div>
            </div>
          )}

          {modalData?.type === "view-appointments" && (
            <div className="space-y-4">
              <div>
                <Label>Data: {format(new Date(selectedDate), "dd/MM/yyyy")}</Label>
              </div>
              <div className="space-y-3">
                {modalData.appointments.map((appointment: Appointment) => (
                  <div key={appointment.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-medium">{appointment.time} - {appointment.patientName}</p>
                        <Badge variant={appointment.status === "confirmed" ? "default" : "secondary"}>
                          {appointment.status === "confirmed" ? "Confirmado" : "Pendente"}
                        </Badge>
                      </div>
                    </div>
                    {appointment.notes && (
                      <p className="text-sm text-gray-600 mb-2">{appointment.notes}</p>
                    )}
                    <div className="flex space-x-2">
                      {appointment.status === "pending" && (
                        <Button size="sm" onClick={() => handleConfirmAppointment(appointment.id)}>
                          <Check className="h-4 w-4 mr-1" />
                          Confirmar
                        </Button>
                      )}
                      {appointment.status === "confirmed" && (
                        <Button size="sm" onClick={() => handleStartVideoCall(appointment.id)}>
                          <Video className="h-4 w-4 mr-1" />
                          Video Chamada
                        </Button>
                      )}
                      {canCancelOrDelete(`${appointment.date}T${appointment.time}`) && (
                        <Button size="sm" variant="destructive" onClick={() => handleCancelAppointment(appointment.id)}>
                          <X className="h-4 w-4 mr-1" />
                          Cancelar
                        </Button>
                      )}
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
