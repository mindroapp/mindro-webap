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
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const { getAvailabilitiesByProfessional, createPublicAppointment, publicAppointments } = usePatientStore();
  const { toast } = useToast();

  const availabilities = professionalId ? getAvailabilitiesByProfessional(professionalId) : [];
  
  const today = startOfDay(new Date());
  
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

  const professionalInfo = {
    name: "Dr. João Silva",
    profession: "Psicólogo",
    registration: "CRP 12/34567",
    phone: "(11) 99999-9999"
  };

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime || !professionalId || !selectedAvailability) {
      toast({
        title: "Erro",
        description: "Selecione data e horário",
        variant: "destructive"
      });
      return;
    }

    try {
      await createPublicAppointment({
        availabilityId: selectedAvailability.id,
        date: format(selectedDate, "yyyy-MM-dd"),
        time: selectedTime,
        patientName,
        patientPhone,
        professionalId
      });

      setIsSubmitted(true);
      toast({
        title: "Sucesso!",
        description: "Seu agendamento foi confirmado."
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
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header com marca e info do profissional */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center mb-4">
            <span className="text-4xl font-bold text-foreground">
              mind<span className="text-primary">ro</span>
            </span>
          </div>
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center gap-3">
                <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <UserIcon className="h-10 w-10 text-primary" />
                </div>
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-foreground">{professionalInfo.name}</h2>
                  <p className="text-muted-foreground">{professionalInfo.profession} / {professionalInfo.registration}</p>
                  <div className="flex items-center justify-center gap-2 mt-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    {professionalInfo.phone}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-6 w-6" />
              Escolha a Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isSubmitted ? (
              <div className="text-center py-8 space-y-4">
                <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
                <div>
                  <h3 className="text-xl font-semibold mb-2">Agendamento Confirmado!</h3>
                  <p className="text-muted-foreground">
                    Seu agendamento foi realizado com sucesso para o dia{" "}
                    {selectedDate && format(selectedDate, "dd/MM/yyyy")} às {selectedTime}.
                  </p>
                  <p className="text-muted-foreground mt-2">
                    Você receberá uma confirmação no WhatsApp.
                  </p>
                </div>
                <Button onClick={() => {
                  setIsSubmitted(false);
                  setSelectedDate(undefined);
                  setSelectedTime("");
                  setPatientName("");
                  setPatientPhone("");
                }}>
                  Fazer Outro Agendamento
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Calendário */}
                <div>
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
                </div>

                {/* Horários - só exibe se data selecionada */}
                {selectedDate && (
                  <Card className="border-primary/20">
                    <CardHeader>
                      <CardTitle className="text-lg">Escolha o Horário</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {availableTimeSlots.length > 0 ? (
                        <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                          {availableTimeSlots.map(slot => (
                            <Button
                              key={slot.time}
                              variant={selectedTime === slot.time ? "default" : "outline"}
                              onClick={() => setSelectedTime(slot.time)}
                              className="w-full"
                            >
                              <Clock className="h-4 w-4 mr-2" />
                              {slot.time}
                            </Button>
                          ))}
                        </div>
                      ) : (
                        <p className="text-center text-muted-foreground py-4">
                          Não há horários disponíveis para esta data.
                        </p>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Formulário - só exibe se data e hora selecionadas */}
                {selectedDate && selectedTime && (
                  <Card className="border-primary/20">
                    <CardHeader>
                      <CardTitle className="text-lg">Seus Dados</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="name">Nome completo</Label>
                        <Input
                          id="name"
                          value={patientName}
                          onChange={(e) => setPatientName(e.target.value)}
                          placeholder="Digite seu nome"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">WhatsApp</Label>
                        <Input
                          id="phone"
                          value={patientPhone}
                          onChange={(e) => setPatientPhone(e.target.value)}
                          placeholder="(00) 00000-0000"
                        />
                      </div>
                      <Button 
                        onClick={handleBooking}
                        className="w-full"
                        disabled={!patientName || !patientPhone}
                      >
                        Confirmar Agendamento
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PublicBooking;
