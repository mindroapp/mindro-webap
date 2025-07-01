
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { format, isBefore, isAfter, addMinutes, differenceInMinutes } from "date-fns";
import ScheduleModal from "./ScheduleModal";
import AppointmentModal from "./AppointmentModal";

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
  schedules: Schedule[];
  appointments: Appointment[];
  onDeleteSchedule: (scheduleId: string) => void;
  onCreateAppointment: (appointment: Omit<Appointment, "id">) => void;
  onUpdateAppointment: (appointmentId: string, updates: Partial<Appointment>) => void;
  onCancelAppointment: (appointmentId: string) => void;
  type: "schedules" | "appointments";
}

const ScheduleCalendar: React.FC<ScheduleCalendarProps> = ({
  schedules,
  appointments,
  onDeleteSchedule,
  onCreateAppointment,
  onUpdateAppointment,
  onCancelAppointment,
  type
}) => {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [modalType, setModalType] = useState<"schedule" | "appointment" | null>(null);

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
    
    // Dias vazios antes do primeiro dia do mês
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push({ date: "", day: "", isEmpty: true });
    }
    
    // Dias do mês
    for (let i = 1; i <= daysInMonth; i++) {
      const date = format(new Date(year, month, i), "yyyy-MM-dd");
      const hasSchedule = schedules.some(s => s.date === date);
      const hasAppointment = appointments.some(a => a.date === date);
      const isPastDate = isBefore(new Date(date), new Date(today.toDateString()));
      
      days.push({
        date,
        day: i,
        hasSchedule,
        hasAppointment,
        isPastDate,
        isClickable: !isPastDate && (type === "schedules" ? true : hasSchedule)
      });
    }
    
    return days;
  };

  const handleDateClick = (date: string, isClickable: boolean) => {
    if (!isClickable) return;
    
    setSelectedDate(date);
    
    if (type === "schedules") {
      setModalType("schedule");
    } else {
      setModalType("appointment");
    }
  };

  const getDayStyle = (dayInfo: any) => {
    if (dayInfo.isEmpty || dayInfo.isPastDate) {
      return "opacity-50 cursor-not-allowed";
    }
    
    if (type === "schedules") {
      return dayInfo.hasSchedule 
        ? "bg-green-100 border-green-300 text-green-800 hover:bg-green-200" 
        : "hover:bg-gray-100";
    } else {
      if (dayInfo.hasSchedule) {
        return dayInfo.hasAppointment 
          ? "bg-blue-100 border-blue-300 text-blue-800 hover:bg-blue-200"
          : "bg-green-100 border-green-300 text-green-800 hover:bg-green-200";
      } else {
        return "bg-red-100 border-red-300 text-red-800 cursor-not-allowed";
      }
    }
  };

  const canDeleteSchedule = (schedule: Schedule) => {
    const scheduleDateTime = new Date(`${schedule.date}T${schedule.startTime}`);
    return differenceInMinutes(scheduleDateTime, new Date()) >= 30;
  };

  const canCancelAppointment = (appointment: Appointment) => {
    const appointmentDateTime = new Date(`${appointment.date}T${appointment.time}`);
    return differenceInMinutes(appointmentDateTime, new Date()) >= 30;
  };

  const renderCalendar = (month: number, year: number, title: string) => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          {title}
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
          {generateCalendarDays(month, year).map((dayInfo, index) => {
            if (dayInfo.isEmpty) {
              return <div key={index} className="h-12"></div>;
            }
            
            return (
              <Button
                key={dayInfo.date}
                variant="outline"
                className={`h-12 p-0 text-sm ${getDayStyle(dayInfo)}`}
                onClick={() => handleDateClick(dayInfo.date, dayInfo.isClickable)}
                disabled={!dayInfo.isClickable}
              >
                {dayInfo.day}
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {renderCalendar(currentMonth, currentYear, format(new Date(currentYear, currentMonth), "MMMM yyyy"))}
      {renderCalendar(nextMonth, nextYear, format(new Date(nextYear, nextMonth), "MMMM yyyy"))}

      {/* Legenda */}
      <div className="flex items-center justify-center space-x-6 text-sm">
        {type === "schedules" ? (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
            <span>Com Agenda</span>
          </div>
        ) : (
          <>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
              <span>Agenda Livre</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded"></div>
              <span>Com Agendamento</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
              <span>Sem Agenda</span>
            </div>
          </>
        )}
      </div>

      {/* Modais */}
      <ScheduleModal
        isOpen={modalType === "schedule"}
        onClose={() => setModalType(null)}
        date={selectedDate}
        schedules={schedules.filter(s => s.date === selectedDate)}
        onDeleteSchedule={onDeleteSchedule}
        canDeleteSchedule={canDeleteSchedule}
      />

      <AppointmentModal
        isOpen={modalType === "appointment"}
        onClose={() => setModalType(null)}
        date={selectedDate}
        schedules={schedules.filter(s => s.date === selectedDate)}
        appointments={appointments.filter(a => a.date === selectedDate)}
        onCreateAppointment={onCreateAppointment}
        onUpdateAppointment={onUpdateAppointment}
        onCancelAppointment={onCancelAppointment}
        canCancelAppointment={canCancelAppointment}
      />
    </div>
  );
};

export default ScheduleCalendar;
