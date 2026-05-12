import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { CheckCircle2, Phone, Loader2, AlertCircle, MapPin, FileText, ArrowRight } from "lucide-react";
import { format, isBefore, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { MaskedInput } from "@/components/ui/masked-input";
import { getProfessionByValue } from "@/lib/professions";
import ProfileAvatarEditor from "@/components/ProfileAvatarEditor";
import schedulePublicProfileService from "@/services/schedulePublicProfileService";

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
  avatar?: string | null;
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

  const [professional, setProfessional] = useState<Professional | null>(null);
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [appointments, setAppointments] = useState<PublicAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [step, setStep] = useState<"calendar" | "time" | "patient-type" | "details" | "confirmation" | "success">("calendar");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState("");
  const [patientName, setPatientName] = useState("");
  const [patientEmail, setPatientEmail] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [patientBirthDate, setPatientBirthDate] = useState("");
  const [isPatient, setIsPatient] = useState<boolean | undefined>();
  const [existingPatient, setExistingPatient] = useState<any>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [searchingPatient, setSearchingPatient] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  const today = useMemo(() => {
    const now = new Date();
    return startOfDay(now);
  }, []);

  // Carregar configurações salvas
  const [publicPageConfig, setPublicPageConfig] = useState<{
    avatar: string | null;
    pageName: string;
    address: string;
    bio: string;
    instagram: string;
  } | null>(null);

  useEffect(() => {
    const loadPublicProfile = async () => {
      if (!professional?.id) return;
      try {
        const profile = await schedulePublicProfileService.getPublicProfileByProfessional(
          professional.id
        );
        if (profile) {
          setPublicPageConfig({
            avatar: profile.avatar || null,
            pageName: profile.pageName || "",
            address: profile.address || "",
            bio: profile.bio || "",
            instagram: profile.instagram || "",
          });
        }
      } catch (err) {
        console.error("Erro ao carregar perfil público:", err);
      }
    };

    loadPublicProfile();
  }, [professional?.id]);

  const load = useCallback(async () => {
    if (!professionalId) return;
    try {
      setLoading(true);
      const encoded = encodeURIComponent(professionalId);
      const prof = await publicFetch<Professional>(`/users/public/${encoded}`);
      const profEmail = encodeURIComponent(prof.email);
      const [avails, apts] = await Promise.all([
        publicFetch<Availability[]>(`/schedule/availabilities?professionalId=${profEmail}`),
        publicFetch<PublicAppointment[]>(`/schedule/appointments?professionalId=${profEmail}`),
      ]);
      setProfessional(prof);
      setAvailabilities(avails);
      setAppointments(apts);
    } catch (err: any) {
      if (err.message?.includes("not found") || err.message?.includes("404")) {
        setNotFound(true);
      }
    } finally {
      setLoading(false);
    }
  }, [professionalId]);

  useEffect(() => {
    load();
  }, [load]);

  const hasValidTimeSlots = (availability: Availability, isToday: boolean): boolean => {
    const now = new Date();
    return availability.timeSlots.some((slot) => {
      const booked = appointments.find(
        (apt) =>
          apt.availabilityId === availability.id &&
          apt.time === slot.time &&
          apt.status !== "cancelled"
      );

      if (!slot.available || booked) return false;

      if (isToday) {
        const [hours, minutes] = slot.time.split(":").map(Number);
        const slotTime = new Date();
        slotTime.setHours(hours, minutes, 0, 0);

        const thirtyMinutesFromNow = new Date(now.getTime() + 30 * 60 * 1000);
        return slotTime >= thirtyMinutesFromNow;
      }

      return true;
    });
  };

  const availableDates = useMemo(() => {
    return availabilities
      .filter((av) => {
        const avDate = new Date(`${av.date}T00:00:00`);
        const dateStr = format(avDate, "yyyy-MM-dd");
        const todayStr = format(today, "yyyy-MM-dd");
        const isToday = dateStr === todayStr;
        const isFuture = dateStr > todayStr || isToday;

        return isFuture && hasValidTimeSlots(av, isToday);
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
    if (!selectedAvailability || !selectedDate) return [];
    
    const now = new Date();
    const isToday = format(selectedDate, "yyyy-MM-dd") === format(now, "yyyy-MM-dd");
    
    return selectedAvailability.timeSlots.filter((slot) => {
      const booked = appointments.find(
        (apt) =>
          apt.availabilityId === selectedAvailability.id &&
          apt.time === slot.time &&
          apt.status !== "cancelled"
      );
      
      if (!slot.available || booked) return false;
      
      // Se é hoje, filtrar por 30 minutos de antecedência
      if (isToday) {
        const [hours, minutes] = slot.time.split(':').map(Number);
        const slotTime = new Date(selectedDate);
        slotTime.setHours(hours, minutes, 0, 0);
        
        const thirtyMinutesFromNow = new Date(now.getTime() + 30 * 60 * 1000);
        return slotTime >= thirtyMinutesFromNow;
      }
      
      return true;
    });
  }, [selectedAvailability, appointments, selectedDate]);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      setSelectedTime("");
      setStep("time");
    }
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setStep("patient-type");
  };

  const handlePatientTypeSelect = (isFirstTime: boolean) => {
    setIsPatient(isFirstTime);
    setPatientName("");
    setPatientEmail("");
    setPatientPhone("");
    setPatientBirthDate("");
    setExistingPatient(null);
    setBookingError(null);
    setStep("details");
  };

  const fetchExistingPatient = async (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length < 11) return;
    
    setSearchingPatient(true);
    setBookingError(null);
    try {
      const patient = await publicFetch<any>(`/patients/by-phone/${cleanPhone}`);
      if (patient) {
        setExistingPatient(patient);
        setPatientName(patient.name || "");
        setStep("confirmation");
      } else {
        setBookingError("Paciente não encontrado neste consultório");
      }
    } catch (err: any) {
      if (err.message?.includes("404") || err.message?.toLowerCase().includes("não encontrado")) {
        setBookingError("Paciente não encontrado. Verifique o número ou cadastre-se.");
      } else {
        setBookingError(err.message || "Erro ao buscar dados do paciente");
      }
    } finally {
      setSearchingPatient(false);
    }
  };

  const createPatient = async (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, "");
    try {
      const newPatient = await publicFetch("/patients", {
        method: "POST",
        body: JSON.stringify({
          fullName: patientName,
          email: patientEmail,
          phone: cleanPhone,
          birthDate: patientBirthDate ? new Date(patientBirthDate).toISOString() : null,
          professionalId,
        }),
      });
      setExistingPatient(newPatient);
      return newPatient;
    } catch (err: any) {
      console.error("Erro ao criar paciente:", err);
      throw err;
    }
  };

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime || !professionalId || !selectedAvailability || !patientName || !patientPhone) return;
    setIsBooking(true);
    setBookingError(null);
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
          patientEmail: patientEmail || undefined,
          patientBirthDate: patientBirthDate || undefined,
          isFirstTime: isPatient === true,
          professionalId,
        }),
      });
      setStep("success");
      await load();
    } catch (err: any) {
      console.error("Erro ao agendar:", err);
      setBookingError(err.message || "Erro ao criar agendamento");
    } finally {
      setIsBooking(false);
    }
  };

  const resetBooking = () => {
    setSelectedDate(undefined);
    setSelectedTime("");
    setPatientName("");
    setPatientEmail("");
    setPatientPhone("");
    setPatientBirthDate("");
    setIsPatient(undefined);
    setExistingPatient(null);
    setBookingError(null);
    setStep("calendar");
  };

  const profLabel =
    getProfessionByValue(professional?.profession ?? "")?.label ?? professional?.profession ?? "";

  const councilLabel = professional?.professionalCouncil
    ? `${professional.professionalCouncil}${professional.professionalRegister ? " " + professional.professionalRegister : ""}`
    : professional?.professionalRegister ?? "";

  // Verificar se todas as configurações estão preenchidas
  const hasAllConfigsFilled =
    publicPageConfig &&
    publicPageConfig.pageName &&
    publicPageConfig.address &&
    publicPageConfig.bio &&
    publicPageConfig.instagram;

  // Usar configurações customizadas se todas estiverem preenchidas
  const displayName = hasAllConfigsFilled
    ? publicPageConfig!.pageName
    : professional?.fullName.toUpperCase() ?? "";
  const displayAvatar = hasAllConfigsFilled ? publicPageConfig!.avatar : professional?.avatar || null;

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
        <div className="text-center space-y-4">
          <ProfileAvatarEditor
            name={professional?.fullName || "Profissional"}
            avatar={displayAvatar}
            readonly={true}
            onAvatarChange={() => {}}
          />
          <div>
            <h2 className="text-lg sm:text-xl font-bold">{displayName}</h2>
            {!hasAllConfigsFilled && (profLabel || councilLabel) && (
              <p className="text-xs sm:text-sm text-muted-foreground">
                {[profLabel, councilLabel].filter(Boolean).join(" / ")}
              </p>
            )}
          </div>
        </div>

        {/* Public Page Configuration Info */}
        {hasAllConfigsFilled && publicPageConfig && (
          <div className="text-center space-y-3">
            {publicPageConfig.address && (
              <div className="flex items-center justify-center gap-2 text-sm text-foreground">
                <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <p>{publicPageConfig.address}</p>
              </div>
            )}
            {publicPageConfig.bio && (
              <div className="flex items-center justify-center gap-2 text-sm text-foreground">
                <p className="whitespace-pre-wrap">{publicPageConfig.bio}</p>
              </div>
            )}
            {publicPageConfig.instagram && (
              <div className="flex items-center justify-center gap-2 text-sm text-foreground">
                <svg
                  className="h-4 w-4 text-muted-foreground flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.266.069 1.646.069 4.85 0 3.204-.012 3.584-.07 4.85-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.85-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.322a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z" />
                </svg>
                <a
                  href={`https://instagram.com/${publicPageConfig.instagram.replace("@", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {publicPageConfig.instagram}
                </a>
              </div>
            )}
          </div>
        )}

        {step === "success" ? (
          <div className="text-center space-y-4 py-8 sm:py-12">
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
            <div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Agendamento Criado!</h3>
              {isPatient === true && (
                <p className="text-sm sm:text-base text-muted-foreground mb-3">
                  Bem-vindo! Recebeu uma mensagem no WhatsApp com os detalhes.
                </p>
              )}
              <p className="text-sm sm:text-base text-muted-foreground">
                {selectedDate && format(selectedDate, "dd/MM/yyyy")} às {selectedTime}
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
                        const dateStr = format(date, "yyyy-MM-dd");
                        const todayStr = format(today, "yyyy-MM-dd");
                        const isBeforeToday = dateStr < todayStr;
                        const hasSlot = availableDates.some(
                          (d) => format(d, "yyyy-MM-dd") === dateStr
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

            {/* STEP 3: TIPO DE PACIENTE */}
            {step === "patient-type" && selectedDate && selectedTime && (
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Data/Hora selecionada</p>
                  <p className="text-base font-semibold">
                    {format(selectedDate, "dd/MM/yyyy")} às {selectedTime}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="space-y-2">
                    <Button
                      onClick={() => handlePatientTypeSelect(true)}
                      variant="outline"
                      className="w-full justify-start text-left h-auto py-3 px-4"
                    >
                      <FileText className="h-5 w-5 mr-3 flex-shrink-0 text-muted-foreground" />
                      <div className="flex flex-col items-start">
                        <span className="font-semibold">Primeira Consulta</span>
                        <span className="text-xs text-muted-foreground">Realizar cadastro</span>
                      </div>
                      <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground" />
                    </Button>
                    <Button
                      onClick={() => handlePatientTypeSelect(false)}
                      variant="outline"
                      className="w-full justify-start text-left h-auto py-3 px-4"
                    >
                      <CheckCircle2 className="h-5 w-5 mr-3 flex-shrink-0 text-muted-foreground" />
                      <div className="flex flex-col items-start">
                        <span className="font-semibold">Já sou Paciente</span>
                        <span className="text-xs text-muted-foreground">Continuar acompanhamento</span>
                      </div>
                      <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground" />
                    </Button>
                  </div>
                </div>

                <Button variant="outline" onClick={() => setStep("time")} className="w-full">
                  Voltar para Horário
                </Button>
              </div>
            )}

            {/* STEP 4: DADOS DO PACIENTE */}
            {step === "details" && selectedDate && selectedTime && (
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Data/Hora selecionada</p>
                  <p className="text-base font-semibold">
                    {format(selectedDate, "dd/MM/yyyy")} às {selectedTime}
                  </p>
                </div>

                {bookingError && (
                  <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg p-3 text-sm text-red-700 dark:text-red-400">
                    {bookingError}
                  </div>
                )}

                <div className="space-y-4">
                  {/* PRIMEIRA CONSULTA - Mostrar todos os campos */}
                  {isPatient === true && (
                    <>
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
                        <Label htmlFor="email" className="text-base font-semibold">
                          Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={patientEmail}
                          onChange={(e) => setPatientEmail(e.target.value)}
                          placeholder="seu.email@exemplo.com"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="birthdate" className="text-base font-semibold">
                          Data de Nascimento
                        </Label>
                        <Input
                          id="birthdate"
                          type="date"
                          value={patientBirthDate}
                          onChange={(e) => setPatientBirthDate(e.target.value)}
                        />
                      </div>
                    </>
                  )}

                  {/* PACIENTE EXISTENTE - Mostrar apenas WhatsApp */}
                  {isPatient === false && (
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
                        onChange={(e) => {
                          setPatientPhone(e.target.value);
                          // Buscar paciente quando completo
                          const cleanPhone = e.target.value.replace(/\D/g, "");
                          if (cleanPhone.length === 11) {
                            fetchExistingPatient(e.target.value);
                          }
                        }}
                        disabled={searchingPatient}
                      />
                      {searchingPatient && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Buscando dados do paciente...
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {isPatient === true && (
                  <Button
                    onClick={handleBooking}
                    className="w-full"
                    disabled={!patientName || !patientPhone || !patientEmail || !patientBirthDate || isBooking}
                  >
                    {isBooking ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Agendando...
                      </>
                    ) : (
                      "Criar Agendamento"
                    )}
                  </Button>
                )}

                <Button variant="outline" onClick={() => setStep("patient-type")} className="w-full">
                  Voltar
                </Button>
              </div>
            )}

            {/* STEP 5: CONFIRMAÇÃO - PACIENTE EXISTENTE */}
            {step === "confirmation" && existingPatient && (
              <div className="space-y-4">
                <div className="text-center">
                  <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground mb-2">Bem-vindo de volta!</p>
                  <p className="text-lg font-semibold mb-1">Olá, {patientName}!</p>
                </div>

                <div className="bg-card border rounded-lg p-4 space-y-2">
                  <p className="text-sm font-semibold">Resumo do agendamento:</p>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>📅 {format(selectedDate!, "dd/MM/yyyy")} às {selectedTime}</p>
                    <p>👤 {displayName}</p>
                  </div>
                </div>

                <Button
                  onClick={handleBooking}
                  className="w-full"
                  disabled={isBooking}
                >
                  {isBooking ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Agendando...
                    </>
                  ) : (
                    "Sim, Confirmar Agendamento"
                  )}
                </Button>

                <Button
                  variant="outline"
                  onClick={() => {
                    setStep("details");
                    setExistingPatient(null);
                    setPatientPhone("");
                    setPatientName("");
                  }}
                  className="w-full"
                >
                  Cancelar
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
