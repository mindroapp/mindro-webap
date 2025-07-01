
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ScheduleForm from "./schedule/ScheduleForm";
import ScheduleCalendar from "./schedule/ScheduleCalendar";
import { useToast } from "@/hooks/use-toast";

interface Schedule {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  slotDuration: number;
  available: boolean;
}

interface Appointment {
  id: string;
  scheduleId: string;
  date: string;
  time: string;
  patientId: string;
  patientName: string;
  notes: string;
  status: "pending" | "confirmed" | "completed";
}

interface ScheduleCalendarProps {
  type: "schedules" | "appointments";
}

const ScheduleCalendarContainer: React.FC<ScheduleCalendarProps> = ({ type }) => {
  const { toast } = useToast();

  // Estados para armazenar agendas e agendamentos
  const [schedules, setSchedules] = useState<Schedule[]>([
    // Dados mockados para teste - última semana do mês
    { 
      id: "1", 
      date: "2025-01-25", 
      startTime: "09:00", 
      endTime: "17:00", 
      slotDuration: 60, 
      available: true 
    },
    { 
      id: "2", 
      date: "2025-01-26", 
      startTime: "14:00", 
      endTime: "18:00", 
      slotDuration: 60, 
      available: true 
    },
    { 
      id: "3", 
      date: "2025-01-27", 
      startTime: "08:00", 
      endTime: "12:00", 
      slotDuration: 30, 
      available: true 
    },
    { 
      id: "4", 
      date: "2025-01-28", 
      startTime: "13:00", 
      endTime: "17:00", 
      slotDuration: 45, 
      available: true 
    },
    { 
      id: "5", 
      date: "2025-01-29", 
      startTime: "09:00", 
      endTime: "16:00", 
      slotDuration: 60, 
      available: true 
    },
    { 
      id: "6", 
      date: "2025-01-30", 
      startTime: "10:00", 
      endTime: "15:00", 
      slotDuration: 60, 
      available: true 
    },
    { 
      id: "7", 
      date: "2025-01-31", 
      startTime: "14:00", 
      endTime: "18:00", 
      slotDuration: 60, 
      available: true 
    }
  ]);

  const [appointments, setAppointments] = useState<Appointment[]>([
    // Dados mockados para teste
    {
      id: "1",
      scheduleId: "1",
      date: "2025-01-25",
      time: "10:00",
      patientId: "p1",
      patientName: "João Silva",
      notes: "Consulta inicial",
      status: "confirmed"
    },
    {
      id: "2",
      scheduleId: "1",
      date: "2025-01-25",
      time: "15:00",
      patientId: "p2",
      patientName: "Maria Santos",
      notes: "Retorno",
      status: "pending"
    },
    {
      id: "3",
      scheduleId: "2",
      date: "2025-01-26",
      time: "16:00",
      patientId: "p3",
      patientName: "Pedro Costa",
      notes: "",
      status: "confirmed"
    }
  ]);

  const handleScheduleCreated = (newSchedule: Schedule) => {
    setSchedules(prev => [...prev, newSchedule]);
  };

  const handleDeleteSchedule = (scheduleId: string) => {
    setSchedules(prev => prev.filter(s => s.id !== scheduleId));
  };

  const handleCreateAppointment = (appointmentData: Omit<Appointment, "id">) => {
    const newAppointment: Appointment = {
      ...appointmentData,
      id: `appointment-${Date.now()}`
    };
    setAppointments(prev => [...prev, newAppointment]);
  };

  const handleUpdateAppointment = (appointmentId: string, updates: Partial<Appointment>) => {
    setAppointments(prev => 
      prev.map(a => 
        a.id === appointmentId ? { ...a, ...updates } : a
      )
    );
  };

  const handleCancelAppointment = (appointmentId: string) => {
    setAppointments(prev => prev.filter(a => a.id !== appointmentId));
  };

  if (type === "schedules") {
    return (
      <div className="space-y-6">
        <ScheduleForm onScheduleCreated={handleScheduleCreated} />
        <ScheduleCalendar
          type="schedules"
          schedules={schedules}
          appointments={appointments}
          onDeleteSchedule={handleDeleteSchedule}
          onCreateAppointment={handleCreateAppointment}
          onUpdateAppointment={handleUpdateAppointment}
          onCancelAppointment={handleCancelAppointment}
        />
      </div>
    );
  }

  return (
    <ScheduleCalendar
      type="appointments"
      schedules={schedules}
      appointments={appointments}
      onDeleteSchedule={handleDeleteSchedule}
      onCreateAppointment={handleCreateAppointment}
      onUpdateAppointment={handleUpdateAppointment}
      onCancelAppointment={handleCancelAppointment}
    />
  );
};

export default ScheduleCalendarContainer;
