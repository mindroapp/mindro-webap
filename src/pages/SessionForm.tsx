
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePatientStore } from "@/stores/patientStore";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/Header";
import SidebarMenu from "@/components/SidebarMenu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Calendar } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const SessionForm: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const { selectedPatient, fetchPatient, addSession, isLoading } = usePatientStore();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const [date, setDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [time, setTime] = useState<string>(
    `${new Date().getHours().toString().padStart(2, '0')}:${new Date().getMinutes().toString().padStart(2, '0')}`
  );
  const [notes, setNotes] = useState<string>("");
  const [mood, setMood] = useState<number>(3);
  const [objectives, setObjectives] = useState<string>("");
  const [interventions, setInterventions] = useState<string>("");
  const [nextSteps, setNextSteps] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (patientId) {
      fetchPatient(patientId);
    }
  }, [patientId, fetchPatient]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId) return;

    setIsSubmitting(true);

    try {
      const dateTime = new Date(`${date}T${time}`).toISOString();

      await addSession(patientId, {
        patientId,
        date: dateTime,
        notes,
        mood,
        objectives,
        interventions,
        nextSteps
      });

      toast({
        title: "Sessão adicionada",
        description: "A sessão foi registrada com sucesso."
      });

      navigate(`/patients/${patientId}`);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao adicionar a sessão. Por favor, tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <div className="hidden md:block">
          <SidebarMenu />
        </div>
        <div className="flex-1">
          <Header />
          <main className="p-4 md:p-6">
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-psycho-primary"></div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!selectedPatient) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <div className="hidden md:block">
          <SidebarMenu />
        </div>
        <div className="flex-1">
          <Header />
          <main className="p-4 md:p-6">
            <div className="text-center py-12">
              <h2 className="text-lg font-medium mb-2">Paciente não encontrado</h2>
              <p className="text-gray-500 mb-4">O paciente que você está procurando não existe ou foi removido.</p>
              <Button onClick={() => navigate("/patients")}>
                <ArrowLeft size={16} className="mr-1" /> Voltar para pacientes
              </Button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const getMoodEmoji = (mood: number) => {
    const emojis = ["😞", "😕", "😐", "🙂", "😊"];
    return emojis[mood - 1] || "😐";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="hidden md:block">
        <SidebarMenu />
      </div>
      <div className="flex-1">
        <Header />
        <main className="p-4 md:p-6">
          <div className="flex items-center mb-4 md:mb-6">
            <Button variant="ghost" size="sm" className="mr-2 md:mr-4" onClick={() => navigate(`/patients/${patientId}`)}>
              <ArrowLeft size={16} className="mr-1" /> Voltar
            </Button>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">Nova Sessão</h1>
          </div>

          <Card className="mb-4 md:mb-6">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center">
                <Avatar className="h-10 w-10 md:h-12 md:w-12 mr-3 md:mr-4">
                  <AvatarImage src={selectedPatient.avatar} alt={selectedPatient.name} />
                  <AvatarFallback className="bg-psycho-primary text-white">
                    {getInitials(selectedPatient.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-base md:text-lg font-semibold">{selectedPatient.name}</h2>
                  <div className="flex items-center text-gray-500">
                    <Calendar size={14} className="mr-1" />
                    <span>{new Date().toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <form onSubmit={handleSubmit}>
            <Card className="mb-4 md:mb-6">
              <CardContent className="p-4 md:p-6 space-y-4">
                <h3 className="text-base md:text-lg font-medium">Informações da Sessão</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Data da Sessão</Label>
                    <Input
                      id="date"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Hora da Sessão</Label>
                    <Input
                      id="time"
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="mood">Humor do Paciente (1-5)</Label>
                  <div className="flex gap-2 md:gap-3 items-center justify-between md:justify-start">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        className={`text-xl md:text-2xl h-10 w-10 md:h-12 md:w-12 flex items-center justify-center rounded-md ${
                          mood === value ? "bg-[#0F172A] text-white" : "bg-[#FAF8FC] text-gray-500"
                        }`}
                        onClick={() => setMood(value)}
                      >
                        {getMoodEmoji(value)}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-4 md:mb-6">
              <CardContent className="p-4 md:p-6 space-y-4">
                <h3 className="text-base md:text-lg font-medium">Notas da Sessão</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="notes">Notas Gerais</Label>
                  <Textarea
                    id="notes"
                    placeholder="Insira as notas e observações da sessão..."
                    className="min-h-[100px]"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="mb-4 md:mb-6">
              <CardContent className="p-4 md:p-6 space-y-4">
                <h3 className="text-base md:text-lg font-medium">Informações do Tratamento</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="objectives">Objetivos da Sessão</Label>
                  <Textarea
                    id="objectives"
                    placeholder="Quais foram os objetivos desta sessão?"
                    className="min-h-[80px]"
                    value={objectives}
                    onChange={(e) => setObjectives(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="interventions">Intervenções Utilizadas</Label>
                  <Textarea
                    id="interventions"
                    placeholder="Quais intervenções ou técnicas foram utilizadas?"
                    className="min-h-[80px]"
                    value={interventions}
                    onChange={(e) => setInterventions(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="nextSteps">Próximos Passos</Label>
                  <Textarea
                    id="nextSteps"
                    placeholder="Tarefas de casa, recomendações ou planos para a próxima sessão..."
                    className="min-h-[80px]"
                    value={nextSteps}
                    onChange={(e) => setNextSteps(e.target.value)}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/patients/${patientId}`)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    <span>Salvando...</span>
                  </div>
                ) : (
                  "Salvar Sessão"
                )}
              </Button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default SessionForm;
