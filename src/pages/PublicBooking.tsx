import React, { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, Clock, CheckCircle2, Phone, User as UserIcon } from "lucide-react";
import { usePatientStore } from "@/stores/patientStore";
import { useToast } from "@/hooks/use-toast";
import { format, isBefore, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";

const PublicBooking: React.FC = () => {
  const { professionalId } = useParams<{ professionalId: string }>();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [patientPhone, setPatientPhone] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const { getAvailabilitiesByProfessional, createPublicAppointment, publicAppointments } = usePatientStore();
  const { toast } = useToast();

  const availabilities = professionalId ? getAvailabilitiesByProfessional(professionalId) : [];
  const today = startOfDay(new Date());
  
  // Info do profissional (mock - em produção viria do backend)
  const professionalInfo = {
    name: "Dr. João Silva",
    profession: "Psicólogo",
    registration: "CRP 12/34567",
    phone: "(11) 99999-9999"
  };

  const availableDates = useMemo(() => {
    return availabilities
      .filter(av => {
        const avDate = new Date(av.date);
        return !isBefore(avDate, today) && av.timeSlots.some(slot => {
          const bookedSlot = publicAppointments.find(
            apt => apt.availabilityId === av.id && apt.time === slot.time
          );
          return slot.available && !bookedSlot;
        });
      })
      .map(av => new Date(av.date));
  }, [availabilities, publicAppointments, today]);
  
  const selectedAvailability = selectedDate 
    ? availabilities.find(av => av.date === format(selectedDate, "yyyy-MM-dd"))
    : null;
    
  const availableTimeSlots = useMemo(() => {
    if (!selectedAvailability) return [];
    
    return selectedAvailability.timeSlots.filter(slot => {
      const bookedSlot = publicAppointments.find(
        apt => apt.availabilityId === selectedAvailability.id && apt.time === slot.time
      );
      return slot.available && !bookedSlot;
    });
  }, [selectedAvailability, publicAppointments]);

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime || !professionalId || !selectedAvailability || !patientPhone) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos",
        variant: "destructive"
      });
      return;
    }

    try {
      await createPublicAppointment({
        availabilityId: selectedAvailability.id,
        date: format(selectedDate, "yyyy-MM-dd"),
        time: selectedTime,
        patientName: `Paciente ${patientPhone.slice(-4)}`,
        patientPhone,
        professionalId
      });

      setIsSubmitted(true);
      toast({
        title: "Agendamento confirmado!",
        description: "Você receberá uma confirmação no WhatsApp."
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível realizar o agendamento.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-lg mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <span className="text-3xl font-bold text-foreground">
            mind<span className="text-primary">ro</span>
          </span>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center gap-3">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <UserIcon className="h-8 w-8 text-primary" />
                </div>
                <div className="text-center">
                  <h2 className="text-xl font-bold">{professionalInfo.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    {professionalInfo.profession} / {professionalInfo.registration}
                  </p>
                  <p className="text-sm text-muted-foreground flex items-center justify-center gap-1 mt-1">
                    <Phone className="h-3 w-3" />
                    {professionalInfo.phone}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {isSubmitted ? (
          <Card>
            <CardContent className="pt-8 text-center space-y-4">
              <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Agendamento Confirmado!</h3>
                <p className="text-muted-foreground">
                  {selectedDate && format(selectedDate, "dd/MM/yyyy")} às {selectedTime}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Confirmação enviada para {patientPhone}
                </p>
              </div>
              <Button onClick={() => {
                setIsSubmitted(false);
                setSelectedDate(undefined);
                setSelectedTime("");
                setPatientPhone("");
              }} variant="outline">
                Novo Agendamento
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <CalendarIcon className="h-5 w-5" />
                Agendar Consulta
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Calendário */}
              <div className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    setSelectedDate(date);
                    setSelectedTime("");
                  }}
                  locale={ptBR}
                  disabled={(date) => {
                    const isBeforeToday = isBefore(date, today);
                    const hasAvailability = availableDates.some(d => 
                      format(d, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
                    );
                    return isBeforeToday || !hasAvailability;
                  }}
                  className="rounded-md border"
                />
              </div>

              {/* Horários */}
              {selectedDate && (
                <div className="space-y-3">
                  <Label>Horário</Label>
                  {availableTimeSlots.length > 0 ? (
                    <div className="grid grid-cols-4 gap-2">
                      {availableTimeSlots.map(slot => (
                        <Button
                          key={slot.time}
                          variant={selectedTime === slot.time ? "default" : "outline"}
                          onClick={() => setSelectedTime(slot.time)}
                          size="sm"
                        >
                          {slot.time}
                        </Button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-4">
                      Sem horários disponíveis
                    </p>
                  )}
                </div>
              )}

              {/* WhatsApp */}
              {selectedDate && selectedTime && (
                <div className="space-y-3">
                  <Label htmlFor="phone">Seu WhatsApp</Label>
                  <Input
                    id="phone"
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    placeholder="(00) 00000-0000"
                  />
                  <Button 
                    onClick={handleBooking}
                    className="w-full"
                    disabled={!patientPhone}
                  >
                    Confirmar Agendamento
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PublicBooking;
