import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, Clock, User, Phone, Check } from "lucide-react";
import { usePatientStore } from "@/stores/patientStore";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const PublicBooking: React.FC = () => {
  const { professionalId } = useParams<{ professionalId: string }>();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const { availabilities, getAvailabilitiesByProfessional, createPublicAppointment } = usePatientStore();
  const { toast } = useToast();
  const navigate = useNavigate();

  const professionalAvailabilities = professionalId 
    ? getAvailabilitiesByProfessional(professionalId)
    : [];

  // Obter datas disponíveis
  const availableDates = professionalAvailabilities.map(av => new Date(av.date));

  // Obter horários disponíveis para a data selecionada
  const availableTimeSlotsForDate = selectedDate
    ? professionalAvailabilities
        .find(av => av.date === format(selectedDate, "yyyy-MM-dd"))
        ?.timeSlots.filter(slot => slot.available) || []
    : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDate || !selectedTime || !patientName || !patientPhone) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await createPublicAppointment({
        availabilityId: professionalAvailabilities.find(
          av => av.date === format(selectedDate, "yyyy-MM-dd")
        )?.id || "",
        date: format(selectedDate, "yyyy-MM-dd"),
        time: selectedTime,
        patientName,
        patientPhone,
        professionalId: professionalId || ""
      });

      setBookingComplete(true);
      toast({
        title: "Agendamento realizado!",
        description: "Seu agendamento foi realizado com sucesso. Aguarde confirmação."
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao realizar agendamento. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (bookingComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Agendamento Confirmado!</CardTitle>
            <CardDescription>
              Seu agendamento foi realizado com sucesso
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Nome:</span>
                <span className="font-medium">{patientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Data:</span>
                <span className="font-medium">
                  {selectedDate && format(selectedDate, "dd/MM/yyyy")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Horário:</span>
                <span className="font-medium">{selectedTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Telefone:</span>
                <span className="font-medium">{patientPhone}</span>
              </div>
            </div>
            <p className="text-sm text-center text-muted-foreground">
              Você receberá uma confirmação em breve. Aguarde o contato do profissional.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Agende sua Consulta</h1>
          <p className="text-muted-foreground">
            Escolha o dia e horário que melhor se adequa à sua agenda
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Calendário */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Selecione a Data
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border pointer-events-auto w-full"
                  locale={ptBR}
                  disabled={(date) => {
                    const dateStr = format(date, "yyyy-MM-dd");
                    return !availableDates.some(d => format(d, "yyyy-MM-dd") === dateStr);
                  }}
                  modifiers={{
                    available: availableDates
                  }}
                  modifiersClassNames={{
                    available: "bg-primary/10 font-semibold"
                  }}
                />
                <p className="text-sm text-muted-foreground mt-4">
                  Datas destacadas estão disponíveis para agendamento
                </p>
              </CardContent>
            </Card>

            {/* Horários e Dados */}
            <div className="space-y-6">
              {/* Horários */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Escolha o Horário
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {!selectedDate ? (
                    <p className="text-center text-muted-foreground py-8">
                      Selecione uma data primeiro
                    </p>
                  ) : availableTimeSlotsForDate.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      Nenhum horário disponível para esta data
                    </p>
                  ) : (
                    <div className="grid grid-cols-3 gap-2">
                      {availableTimeSlotsForDate.map(slot => (
                        <Button
                          key={slot.time}
                          type="button"
                          variant={selectedTime === slot.time ? "default" : "outline"}
                          onClick={() => setSelectedTime(slot.time)}
                          className="w-full"
                        >
                          {slot.time}
                        </Button>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Dados do Paciente */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Seus Dados
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo *</Label>
                    <Input
                      id="name"
                      placeholder="Seu nome completo"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">WhatsApp *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="(00) 00000-0000"
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                      required
                    />
                  </div>

                  {selectedDate && selectedTime && (
                    <div className="p-4 bg-muted rounded-lg space-y-2 mt-4">
                      <p className="text-sm font-medium">Resumo do Agendamento:</p>
                      <div className="space-y-1 text-sm">
                        <p>📅 {format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</p>
                        <p>🕐 {selectedTime}</p>
                      </div>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={!selectedDate || !selectedTime || !patientName || !patientPhone || isSubmitting}
                  >
                    {isSubmitting ? "Agendando..." : "Confirmar Agendamento"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PublicBooking;
