import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { CheckCircle2, Phone, User as UserIcon, Loader2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format, isBefore, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { MaskedInput } from "@/components/ui/masked-input";
import { getProfessionByValue } from "@/lib/professions";

const BASE_URL = (import.meta as any).env?.VITE_API_URL ?? "http://localhost:6001/api";

async function publicFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.message ?? `Request failed: ${res.status}`);
  }
  return res.json();
}

interface Professional {
  id: string;
  fullName: string;
  profession: string | null;
  professionalCouncil: string | null;
  professionalRegister: string | null;
}

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

interface Availability {
  id: string;
  date: string;
  professionalId: string;
  timeSlots: TimeSlot[];
}

interface PublicAppointment {
  id: string;
  availabilityId: string;
  date: string;
  time: string;
  status: string;
}

const PublicBooking: React.FC = () => {
  const { professionalId } = useParams<{ professionalId: string }>();
  const { toast } = useToast();

  const [professional, setProfessional] = useState<Professional | null>(null);
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [appointments, setAppointments] = useState<PublicAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [step, setStep] = useState<"calendar" | "time" | "details">("calendar");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState("");
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  const today = useMemo(() => startOfDay(new Date()), []);

  const load = useCallback(async () => {
    if (!professionalId) return;
    try {
      setLoading(true);
      const encoded = encodeURIComponent(professionalId);
      const [prof, avails, apts] = await Promise.all([
        publicFetch<Professional>(`/users/public/${encoded}`),
        publicFetch<Availability[]>(`/schedule/availabilities?professionalId=${encoded}`),
        publicFetch<PublicAppointment[]>(`/schedule/appointments?professionalId=${encoded}`),
      ]);
      setProfessional(prof);
      setAvailabilities(avails);
      setAppointments(apts);
    } catch (err: any) {
      if (err.message?.includes("not found") || err.message?.includes("404")) {
        setNotFound(true);
      } else {
        toast({ title: "Erro ao carregar agenda", description: err.message, variant: "destructive" });
      }
    } finally {
      setLoading(false);
    }
  }, [professionalId, toast]);

  useEffect(() => {
    load();
  }, [load]);

  const availableDates = useMemo(() => {
    return availabilities
      .filter((av) => {
        const avDate = new Date(`${av.date}T00:00:00`);
        return (
          !isBefore(avDate, today) &&
          av.timeSlots.some((slot) => {
            const booked = appointments.find(
              (apt) => apt.availabilityId === av.id && apt.time === slot.time && apt.status !== "cancelled"
            );
            return slot.available && !booked;
          })
        );
      })
      .map((av) => new Date(`${av.date}T00:00:00`));
  }, [availabilities, appointments, today]);

  const selectedAvailability = useMemo(
    () =>
      selectedDate
        ? availabilities.find((av) => av.date === format(selectedDate, "yyyy-MM-dd"))
        : null,
    [selectedDate, availabilities]
  );

  const availableTimeSlots = useMemo(() => {
    if (!selectedAvailability) return [];
    return selectedAvailability.timeSlots.filter((slot) => {
      const booked = appointments.find(
        (apt) =>
          apt.availabilityId === selectedAvailability.id &&
          apt.time === slot.time &&
          apt.status !== "cancelled"
      );
      return slot.available && !booked;
    });
  }, [selectedAvailability, appointments]);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      setSelectedTime("");
      setStep("time");
    }
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setStep("details");
  };

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime || !professionalId || !selectedAvailability || !patientName || !patientPhone) return;
    setIsBooking(true);
    try {
      const phone = patientPhone.replace(/\D/g, "");
      await publicFetch("/schedule/appointments", {
        method: "POST",
        body: JSON.stringify({
          availabilityId: selectedAvailability.id,
          date: format(selectedDate, "yyyy-MM-dd"),
          time: selectedTime,
          patientName,
          patientPhone: phone,
          professionalId,
        }),
      });
      setIsSubmitted(true);
      await load();
    } catch (err: any) {
      toast({ title: "Erro ao agendar", description: err.message, variant: "destructive" });
    } finally {
      setIsBooking(false);
    }
  };

  const resetBooking = () => {
    setIsSubmitted(false);
    setSelectedDate(undefined);
    setSelectedTime("");
    setPatientName("");
    setPatientPhone("");
    setStep("calendar");
  };

  const profLabel =
    getProfessionByValue(professional?.profession ?? "")?.label ?? professional?.profession ?? "";

  const councilLabel = professional?.professionalCouncil
    ? `${professional.professionalCouncil}${professional.professionalRegister ? " " + professional.professionalRegister : ""}`
    : professional?.professionalRegister ?? "";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="text-sm">Carregando agenda...</span>
        </div>
      </div>
    );
  }

  if (notFound || !professional) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="text-center space-y-3">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto" />
          <h2 className="text-lg font-semibold">Profissional não encontrado</h2>
          <p className="text-sm text-muted-foreground">
            Este link de agendamento não está disponível.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-4 sm:py-8 px-4">
      <div className="max-w-lg mx-auto space-y-4 sm:space-y-6">
        {/* Logo */}
        <div className="text-center">
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
            <h2 className="text-lg sm:text-xl font-bold">{professional.fullName}</h2>
            {(profLabel || councilLabel) && (
              <p className="text-xs sm:text-sm text-muted-foreground">
                {[profLabel, councilLabel].filter(Boolean).join(" / ")}
              </p>
            )}
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
                com {professional.fullName}
              </p>
            </div>
            <Button onClick={resetBooking} variant="outline" className="w-full">
              Novo Agendamento
            </Button>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {/* STEP 1: CALENDÁRIO */}
            {step === "calendar" && (
              <div className="w-full bg-card border rounded-xl p-3 sm:p-4 shadow-sm">
                {availableDates.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground text-sm space-y-2">
                    <CalendarEmpty />
                    <p>Nenhum horário disponível neste mês.</p>
                  </div>
                ) : (
                  <>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={handleDateSelect}
                      month={currentMonth}
                      onMonthChange={setCurrentMonth}
                      locale={ptBR}
                      disabled={(date) => {
                        const isBeforeToday = isBefore(date, today);
                        const hasSlot = availableDates.some(
                          (d) => format(d, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
                        );
                        return isBeforeToday || !hasSlot;
                      }}
                      modifiers={{ available: availableDates }}
                      modifiersClassNames={{
                        available:
                          "!bg-green-100 dark:!bg-green-900/30 !text-green-700 dark:!text-green-400 font-semibold",
                      }}
                      className="w-full p-0"
                    />
                    <div className="flex items-center justify-center gap-2 mt-3 text-xs text-muted-foreground">
                      <span className="inline-block w-3 h-3 rounded-sm bg-green-100 dark:bg-green-900/30 border border-green-500/30" />
                      Datas com horários disponíveis
                    </div>
                  </>
                )}
              </div>
            )}

            {/* STEP 2: HORÁRIOS */}
            {step === "time" && selectedDate && (
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Data selecionada:</p>
                  <p className="text-lg font-semibold capitalize">
                    {format(selectedDate, "EEEE, dd 'de' MMMM", { locale: ptBR })}
                  </p>
                </div>

                <div className="space-y-3">
                  <Label className="text-base font-semibold">Selecionar Horário</Label>
                  {availableTimeSlots.length > 0 ? (
                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                      {availableTimeSlots.map((slot) => (
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
                    <p className="text-center text-muted-foreground py-4 text-sm">
                      Sem horários disponíveis para este dia.
                    </p>
                  )}
                </div>

                <Button variant="outline" onClick={() => setStep("calendar")} className="w-full">
                  Voltar para Calendário
                </Button>
              </div>
            )}

            {/* STEP 3: DADOS E CONFIRMAÇÃO */}
            {step === "details" && selectedDate && selectedTime && (
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Agendamento para:</p>
                  <p className="text-base font-semibold">
                    {format(selectedDate, "dd/MM/yyyy")} às {selectedTime}
                  </p>
                  <p className="text-xs text-muted-foreground">com {professional.fullName}</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-base font-semibold">
                      Nome Completo
                    </Label>
                    <Input
                      id="name"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      placeholder="Seu nome completo"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-base font-semibold flex items-center gap-1">
                      <Phone className="h-3.5 w-3.5" />
                      WhatsApp
                    </Label>
                    <MaskedInput
                      id="phone"
                      mask="(99) 99999-9999"
                      placeholder="(11) 99999-9999"
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                    />
                  </div>
                </div>

                <Button
                  onClick={handleBooking}
                  className="w-full"
                  disabled={!patientName || !patientPhone || isBooking}
                >
                  {isBooking ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Agendando...
                    </>
                  ) : (
                    "Confirmar Agendamento"
                  )}
                </Button>

                <Button variant="outline" onClick={() => setStep("time")} className="w-full">
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

const CalendarEmpty: React.FC = () => (
  <svg
    className="h-10 w-10 text-muted-foreground/50 mx-auto"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
    />
  </svg>
);

export default PublicBooking;
