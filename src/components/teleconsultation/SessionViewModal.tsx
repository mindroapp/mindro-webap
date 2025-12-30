import React from "react";
import { Session } from "@/stores/patientStore";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Brain, Stethoscope, ClipboardList, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface SessionViewModalProps {
  session: Session;
  isOpen: boolean;
  onClose: () => void;
}

const getMoodEmoji = (mood: number) => {
  const emojis = ["😞", "😕", "😐", "🙂", "😊"];
  return emojis[mood - 1] || "😐";
};

const getApproachLabel = (approach?: string) => {
  const approaches: Record<string, string> = {
    cognitive: "Terapia Cognitivo-Comportamental",
    psychoanalysis: "Psicanálise",
    behavioral: "Comportamental",
    humanistic: "Humanista",
    other: "Outra"
  };
  return approach ? approaches[approach] || approach : "Não informada";
};

const SessionViewModal: React.FC<SessionViewModalProps> = ({ 
  session, 
  isOpen, 
  onClose 
}) => {
  const formattedDate = format(new Date(session.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Sessão de {formattedDate}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Header com status e humor */}
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="text-sm">
              {getMoodEmoji(session.mood)} Humor: {session.mood}/5
            </Badge>
            {session.status && (
              <Badge 
                variant={session.status === "Realizada" ? "default" : "secondary"}
                className="text-sm"
              >
                {session.status}
              </Badge>
            )}
          </div>

          <Tabs defaultValue="clinical" className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="clinical" className="text-xs sm:text-sm">Dados Clínicos</TabsTrigger>
              <TabsTrigger value="evolution" className="text-xs sm:text-sm">Evolução</TabsTrigger>
              <TabsTrigger value="notes" className="text-xs sm:text-sm">Anotações</TabsTrigger>
            </TabsList>
            
            <TabsContent value="clinical" className="space-y-4">
              {session.diagnosis && (
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Stethoscope className="h-4 w-4 text-primary" />
                      <h4 className="font-medium text-sm">Diagnóstico</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">{session.diagnosis}</p>
                  </CardContent>
                </Card>
              )}

              {session.approach && (
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="h-4 w-4 text-primary" />
                      <h4 className="font-medium text-sm">Abordagem Terapêutica</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">{getApproachLabel(session.approach)}</p>
                  </CardContent>
                </Card>
              )}

              {session.clinicalNotes && (
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <ClipboardList className="h-4 w-4 text-primary" />
                      <h4 className="font-medium text-sm">Anotações Clínicas</h4>
                    </div>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{session.clinicalNotes}</p>
                  </CardContent>
                </Card>
              )}

              {session.medications && (
                <Card>
                  <CardContent className="pt-4">
                    <h4 className="font-medium text-sm mb-2">Medicações</h4>
                    <p className="text-sm text-muted-foreground">{session.medications}</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="evolution" className="space-y-4">
              {session.evolution && (
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      <h4 className="font-medium text-sm">Evolução do Paciente</h4>
                    </div>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{session.evolution}</p>
                  </CardContent>
                </Card>
              )}

              {session.treatmentProgress && (
                <Card>
                  <CardContent className="pt-4">
                    <h4 className="font-medium text-sm mb-2">Progresso do Tratamento</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{session.treatmentProgress}</p>
                  </CardContent>
                </Card>
              )}

              {session.objectives && (
                <Card>
                  <CardContent className="pt-4">
                    <h4 className="font-medium text-sm mb-2">Objetivos</h4>
                    <p className="text-sm text-muted-foreground">{session.objectives}</p>
                  </CardContent>
                </Card>
              )}

              {session.interventions && (
                <Card>
                  <CardContent className="pt-4">
                    <h4 className="font-medium text-sm mb-2">Intervenções</h4>
                    <p className="text-sm text-muted-foreground">{session.interventions}</p>
                  </CardContent>
                </Card>
              )}

              {session.nextSteps && (
                <Card>
                  <CardContent className="pt-4">
                    <h4 className="font-medium text-sm mb-2">Próximos Passos</h4>
                    <p className="text-sm text-muted-foreground">{session.nextSteps}</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="notes" className="space-y-4">
              {session.notes && (
                <Card>
                  <CardContent className="pt-4">
                    <h4 className="font-medium text-sm mb-2">Notas da Sessão</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{session.notes}</p>
                  </CardContent>
                </Card>
              )}

              {!session.notes && !session.evolution && !session.clinicalNotes && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Nenhuma anotação registrada para esta sessão.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SessionViewModal;
