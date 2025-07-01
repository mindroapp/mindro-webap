
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Check, X, Video, Plus } from "lucide-react";
import { format, addMinutes, isAfter } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { usePatientStore } from "@/stores/patientStore";

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

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: string;
  schedules: Schedule[];
  appointments: Appointment[];
  onCreateAppointment: (appointment: Omit<Appointment, "id">) => void;
  onUpdateAppointment: (appointmentId: string, updates: Partial<Appointment>) => void;
  onCancelAppointment: (appointmentId: string) => void;
  canCancelAppointment: (appointment: Appointment) => boolean;
}

const AppointmentModal: React.FC<AppointmentModalProps> = ({
  isOpen,
  onClose,
  date,
  schedules,
  appointments,
  onCreateAppointment,
  onUpdateAppointment,
  onCancelAppointment,
  canCancelAppointment
}) => {
  const [view, setView] = useState<"list" | "create">("list");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedPatient, setSelectedPatient] = useState("");
  const [notes, setNotes] = useState("");
  const { toast } = useToast();
  const { patients } = usePatientStore();

  const generateAvailableSlots = () => {
    const slots: string[] = [];
    const now = new Date();
    const isToday = date === format(now, "yyyy-MM-dd");
    
    schedules.forEach(schedule => {
      const start = new Date(`${date}T${schedule.startTime}`);
      const end = new Date(`${date}T${schedule.endTime}`);
      
      let current = start;
      while (current < end) {
        const timeStr = format(current, "HH:mm");
        const isBooked = appointments.some(a => a.time === timeStr);
        
        // Se for hoje, só mostrar horários com pelo menos 30 min de diferença
        const isValidTime = isToday 
          ? isAfter(new Date(`${date}T${timeStr}`), addMinutes(now, 30))
          : true;
        
        if (!isBooked && isValidTime) {
          slots.push(timeStr);
        }
        
        current = addMinutes(current, schedule.slotDuration);
      }
    });
    
    return slots.sort();
  };

  const handleCreateAppointment = () => {
    if (!selectedTime || !selectedPatient) {
      toast({
        title: "Erro",
        description: "Selecione um horário e um paciente.",
        variant: "destructive"
      });
      return;
    }

    const patient = patients.find(p => p.id === selectedPatient);
    const schedule = schedules.find(s => {
      const start = new Date(`${date}T${s.startTime}`);
      const end = new Date(`${date}T${s.endTime}`);
      const appointmentTime = new Date(`${date}T${selectedTime}`);
      return appointmentTime >= start && appointmentTime < end;
    });

    onCreateAppointment({
      scheduleId: schedule?.id || "",
      date,
      time: selectedTime,
      patientId: selectedPatient,
      patientName: patient?.name || "",
      notes,
      status: "pending"
    });

    toast({
      title: "Agendamento criado",
      description: "Agendamento realizado com sucesso."
    });

    handleClear();
    setView("list");
  };

  const handleClear = () => {
    setSelectedTime("");
    setSelectedPatient("");
    setNotes("");
  };

  const handleConfirm = (appointmentId: string) => {
    onUpdateAppointment(appointmentId, { status: "confirmed" });
    toast({
      title: "Agendamento confirmado",
      description: "Agendamento confirmado com sucesso."
    });
  };

  const handleCancel = (appointmentId: string) => {
    onCancelAppointment(appointmentId);
    toast({
      title: "Agendamento cancelado",
      description: "Agendamento cancelado com sucesso."
    });
  };

  const handleVideoCall = (appointmentId: string) => {
    const randomToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const meetingUrl = `/meeting?token=${randomToken}&appointment=${appointmentId}`;
    window.open(meetingUrl, '_blank');
    
    toast({
      title: "Videochamada iniciada",
      description: "Nova aba aberta com a sala de videochamada."
    });
  };

  if (!date) return null;

  const availableSlots = generateAvailableSlots();
  const hasAvailableSlots = availableSlots.length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            Agendamentos - {format(new Date(date), "dd/MM/yyyy")}
          </DialogTitle>
        </DialogHeader>

        {view === "list" ? (
          <div className="space-y-4">
            {appointments.length > 0 && (
              <div className="space-y-3">
                {appointments.map((appointment) => (
                  <div key={appointment.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-medium">
                          {appointment.time} - {appointment.patientName}
                        </p>
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
                        <Button size="sm" onClick={() => handleConfirm(appointment.id)}>
                          <Check className="h-4 w-4 mr-1" />
                          Confirmar
                        </Button>
                      )}
                      {appointment.status === "confirmed" && (
                        <Button size="sm" onClick={() => handleVideoCall(appointment.id)}>
                          <Video className="h-4 w-4 mr-1" />
                          Video Chamada
                        </Button>
                      )}
                      {canCancelAppointment(appointment) && (
                        <Button size="sm" variant="destructive" onClick={() => handleCancel(appointment.id)}>
                          <X className="h-4 w-4 mr-1" />
                          Cancelar
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {hasAvailableSlots && (
              <div className="pt-4 border-t">
                <Button onClick={() => setView("create")} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Agendamento
                </Button>
              </div>
            )}

            {!hasAvailableSlots && appointments.length === 0 && (
              <p className="text-gray-500 text-center py-4">
                Nenhum horário disponível para este dia.
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <Label htmlFor="time">Horário</Label>
              <Select value={selectedTime} onValueChange={setSelectedTime}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um horário" />
                </SelectTrigger>
                <SelectContent>
                  {availableSlots.map((time) => (
                    <SelectItem key={time} value={time}>{time}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="patient">Paciente</Label>
              <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um paciente" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="notes">Notas</Label>
              <Textarea
                id="notes"
                placeholder="Observações sobre o agendamento"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <div className="flex space-x-2">
              <Button onClick={() => setView("list")} variant="outline">
                Cancelar
              </Button>
              <Button onClick={handleCreateAppointment}>
                Criar Agendamento
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentModal;
