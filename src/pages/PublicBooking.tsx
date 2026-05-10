import React, { useState, useMemo, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, CheckCircle2, Phone, User as UserIcon } from "lucide-react";
import { usePatientStore } from "@/stores/patientStore";
import { useToast } from "@/hooks/use-toast";
import { format, isBefore, startOfDay, startOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import InputMask from "react-input-mask";

const PublicBooking: React.FC = () => {
  const { professionalId } = useParams<{ professionalId: string }>();
  const [step, setStep] = useState<'calendar' | 'time' | 'details'>('calendar');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  
  const { getAvailabilitiesByProfessional, createPublicAppointment, publicAppointments } = usePatientStore();
  const { toast } = useToast();

  const availabilities = useMemo(() => 
    professionalId ? getAvailabilitiesByProfessional(professionalId) : [],
    [professionalId, getAvailabilitiesByProfessional]
  );
  const today = useMemo(() => startOfDay(new Date()), []);
  
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

  // Inicializar com o mês que tem disponibilidade
  useEffect(() => {
    if (availableDates.length > 0) {
      const firstMonth = startOfMonth(availableDates[0]);
      setCurrentMonth(prev => {
        if (format(prev, "yyyy-MM") !== format(firstMonth, "yyyy-MM")) {
          return firstMonth;
        }
        return prev;
      });
    }
  }, [availableDates]);
  
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

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      setSelectedTime("");
      setStep('time');
    }
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setStep('details');
  };

  const handleBackToTime = () => {
    setSelectedTime("");
    setStep('time');
  };

  const handleBackToCalendar = () => {
    setSelectedDate(undefined);
    setSelectedTime("");
    setStep('calendar');
  };

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime || !professionalId || !selectedAvailability || !patientPhone || !patientName) {
      return;
    }

    try {
      await createPublicAppointment({
        availabilityId: selectedAvailability.id,
        date: format(selectedDate, "yyyy-MM-dd"),
        time: selectedTime,
        patientName: patientName,
        patientPhone,
        professionalId
      });

      setIsSubmitted(true);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível realizar o agendamento.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background py-4 sm:py-8 px-4">
      <div className="max-w-md mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <span className="text-3xl font-bold text-foreground">
            mind<span className="text-primary">ro</span>
          </span>
        </div>

        {/* Professional Info */}
        <div className="text-center space-y-2">
          <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <UserIcon className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold">{professionalInfo.name}</h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {professionalInfo.profession} / {professionalInfo.registration}
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground flex items-center justify-center gap-1 mt-1">
              <Phone className="h-3 w-3" />
              {professionalInfo.phone}
            </p>
          </div>
        </div>

        {isSubmitted ? (
          <div className="text-center space-y-4 py-8 sm:py-12">
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
            <div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Agendamento Criado!</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                {selectedDate && format(selectedDate, "dd/MM/yyyy")} às {selectedTime}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                Confirmação enviada para {patientPhone}
              </p>
            </div>
            <Button onClick={() => {
              setIsSubmitted(false);
              setSelectedDate(undefined);
              setSelectedTime("");
              setPatientName("");
              setPatientPhone("");
              setStep('calendar');
            }} variant="outline" className="w-full">
              Novo Agendamento
            </Button>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {/* STEP 1: CALENDÁRIO */}
            {step === 'calendar' && (
              <div className="w-full bg-card border rounded-xl p-3 sm:p-4 shadow-sm">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  month={currentMonth}
                  onMonthChange={setCurrentMonth}
                  locale={ptBR}
                  disabled={(date) => {
                    const isBeforeToday = isBefore(date, today);
                    const hasAvailability = availableDates.some(d =>
                      format(d, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
                    );
                    return isBeforeToday || !hasAvailability;
                  }}
                  modifiers={{ available: availableDates }}
                  modifiersClassNames={{
                    available: "!bg-green-100 dark:!bg-green-900/30 !text-green-700 dark:!text-green-400 font-semibold"
                  }}
                  className="w-full p-0 [&_.rdp-months]:w-full [&_.rdp-month]:w-full [&_table]:w-full [&_.rdp-head_row]:flex [&_.rdp-head_row]:w-full [&_.rdp-head_cell]:flex-1 [&_.rdp-head_cell]:text-sm [&_.rdp-row]:flex [&_.rdp-row]:w-full [&_.rdp-cell]:flex-1 [&_.rdp-cell]:h-12 sm:[&_.rdp-cell]:h-14 [&_.rdp-cell]:p-0 [&_button.rdp-day]:w-full [&_button.rdp-day]:h-full [&_button.rdp-day]:text-base [&_button.rdp-day]:rounded-md [&_.rdp-caption_label]:text-base [&_.rdp-caption_label]:font-semibold"
                />
                <div className="flex items-center justify-center gap-2 mt-3 text-xs text-muted-foreground">
                  <span className="inline-block w-3 h-3 rounded-sm bg-green-100 dark:bg-green-900/30 border border-green-500/30" />
                  Datas com horários disponíveis
                </div>
              </div>
            )}

            {/* STEP 2: HORÁRIOS */}
            {step === 'time' && selectedDate && (
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-sm sm:text-base text-muted-foreground mb-2">
                    Data selecionada:
                  </p>
                  <p className="text-lg sm:text-xl font-semibold capitalize">
                    {format(selectedDate, "EEEE, dd 'de' MMMM", { locale: ptBR })}
                  </p>
                </div>

                <div className="space-y-3">
                  <Label className="text-base sm:text-lg font-semibold">Selecionar Horário</Label>
                  {availableTimeSlots.length > 0 ? (
                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                      {availableTimeSlots.map(slot => (
                        <Button
                          key={slot.time}
                          variant={selectedTime === slot.time ? "default" : "outline"}
                          onClick={() => handleTimeSelect(slot.time)}
                          size="sm"
                          className="text-xs sm:text-sm"
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

                <Button
                  variant="outline"
                  onClick={handleBackToCalendar}
                  className="w-full"
                >
                  Voltar para Calendário
                </Button>
              </div>
            )}

            {/* STEP 3: DADOS E CONFIRMAÇÃO */}
            {step === 'details' && selectedDate && selectedTime && (
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-sm sm:text-base text-muted-foreground mb-2">
                    Agendamento confirmado para:
                  </p>
                  <p className="text-base sm:text-lg font-semibold">
                    {format(selectedDate, "dd/MM/yyyy")} às {selectedTime}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-base sm:text-lg font-semibold">WhatsApp</Label>
                    <InputMask
                      mask="(99) 99999-9999"
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                    >
                      {(inputProps: any) => (
                        <Input
                          {...inputProps}
                          id="phone"
                          placeholder="(11) 99999-9999"
                          className="text-base"
                        />
                      )}
                    </InputMask>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-base sm:text-lg font-semibold">Nome Completo</Label>
                    <Input
                      id="name"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      placeholder="Seu nome completo"
                      className="text-base"
                    />
                  </div>
                </div>

                <Button 
                  onClick={handleBooking}
                  className="w-full text-base sm:text-lg py-2 sm:py-3"
                  disabled={!patientPhone || !patientName}
                >
                  Criar Agendamento
                </Button>

                <Button
                  variant="outline"
                  onClick={handleBackToTime}
                  className="w-full"
                >
                  Voltar para Horário
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicBooking;
