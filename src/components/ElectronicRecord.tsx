import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  FileText, Plus, Calendar, Edit, 
  ClipboardList, Lock, Paperclip, Stethoscope,
  TrendingUp, History
} from "lucide-react";
import { Patient, Session } from "@/stores/patientStore";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ElectronicRecordProps {
  patient: Patient;
  onNewSession: () => void;
  onEditSession: (session: Session) => void;
  onViewSession: (session: Session) => void;
  onUploadDocument: () => void;
}

const ElectronicRecord: React.FC<ElectronicRecordProps> = ({
  patient,
  onNewSession,
  onEditSession,
  onViewSession,
  onUploadDocument,
}) => {
  const [selectedTab, setSelectedTab] = useState("evolutions");

  const getApproachLabel = (approach?: string) => {
    const labels: Record<string, string> = {
      cognitive: "TCC",
      psychoanalysis: "Psicanálise",
      behavioral: "Comportamental",
      humanistic: "Humanista",
      other: "Outra",
    };
    return approach ? labels[approach] || approach : null;
  };

  const getMoodEmoji = (mood: number) => {
    const emojis = ["😞", "😕", "😐", "🙂", "😊"];
    return emojis[mood - 1] || "😐";
  };

  // Ordena sessões por data (mais recente primeiro)
  const sortedSessions = [...patient.sessions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-6">
      {/* Header com ações rápidas */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Prontuário Eletrônico</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onUploadDocument}>
            <Paperclip className="h-4 w-4 mr-1" />
            Anexar
          </Button>
          <Button size="sm" onClick={onNewSession}>
            <Plus className="h-4 w-4 mr-1" />
            Nova Sessão
          </Button>
        </div>
      </div>

      {/* Tabs do Prontuário */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="evolutions" className="gap-1">
            <TrendingUp className="h-3 w-3" />
            <span className="hidden sm:inline">Evoluções</span>
          </TabsTrigger>
          <TabsTrigger value="private" className="gap-1">
            <Lock className="h-3 w-3" />
            <span className="hidden sm:inline">Privadas</span>
          </TabsTrigger>
          <TabsTrigger value="attachments" className="gap-1">
            <Paperclip className="h-3 w-3" />
            <span className="hidden sm:inline">Anexos</span>
          </TabsTrigger>
          <TabsTrigger value="diagnosis" className="gap-1">
            <Stethoscope className="h-3 w-3" />
            <span className="hidden sm:inline">Diagnósticos</span>
          </TabsTrigger>
          <TabsTrigger value="plan" className="gap-1">
            <ClipboardList className="h-3 w-3" />
            <span className="hidden sm:inline">Plano</span>
          </TabsTrigger>
        </TabsList>

        {/* Evoluções */}
        <TabsContent value="evolutions" className="mt-4">
          <ScrollArea className="h-[500px]">
            <div className="space-y-4 pr-4">
              {sortedSessions.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <FileText className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                    <p className="text-muted-foreground mb-3">
                      Nenhuma evolução registrada
                    </p>
                    <Button size="sm" onClick={onNewSession}>
                      <Plus className="h-4 w-4 mr-1" />
                      Registrar primeira sessão
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                sortedSessions.map((session) => (
                  <Card key={session.id} className="hover:border-primary/30 transition-colors">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">
                            {format(new Date(session.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                          </span>
                          <span className="text-xl">{getMoodEmoji(session.mood)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {getApproachLabel(session.approach) && (
                            <Badge variant="outline">{getApproachLabel(session.approach)}</Badge>
                          )}
                          <Button variant="ghost" size="icon" onClick={() => onEditSession(session)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {session.evolution ? (
                        <div className="space-y-3">
                          <p className="text-foreground">{session.evolution}</p>
                        </div>
                      ) : session.notes ? (
                        <p className="text-muted-foreground">{session.notes}</p>
                      ) : (
                        <p className="text-muted-foreground italic">Sem anotações</p>
                      )}

                      {(session.objectives || session.interventions || session.nextSteps) && (
                        <div className="mt-4 pt-3 border-t space-y-2">
                          {session.objectives && (
                            <div>
                              <span className="text-xs font-medium text-primary">Objetivos:</span>
                              <p className="text-sm text-muted-foreground">{session.objectives}</p>
                            </div>
                          )}
                          {session.interventions && (
                            <div>
                              <span className="text-xs font-medium text-primary">Intervenções:</span>
                              <p className="text-sm text-muted-foreground">{session.interventions}</p>
                            </div>
                          )}
                          {session.nextSteps && (
                            <div>
                              <span className="text-xs font-medium text-primary">Próximos Passos:</span>
                              <p className="text-sm text-muted-foreground">{session.nextSteps}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Anotações Privadas */}
        <TabsContent value="private" className="mt-4">
          <ScrollArea className="h-[500px]">
            <div className="space-y-4 pr-4">
              {sortedSessions.filter(s => s.privateNotes).length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <Lock className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                    <p className="text-muted-foreground">
                      Nenhuma anotação privada registrada
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Anotações privadas são visíveis apenas para você
                    </p>
                  </CardContent>
                </Card>
              ) : (
                sortedSessions
                  .filter((s) => s.privateNotes)
                  .map((session) => (
                    <Card key={session.id}>
                      <CardContent className="pt-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">
                            {format(new Date(session.date), "dd/MM/yyyy")}
                          </span>
                          <Lock className="h-3 w-3 text-amber-500" />
                        </div>
                        <p className="text-foreground">{session.privateNotes}</p>
                      </CardContent>
                    </Card>
                  ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Anexos */}
        <TabsContent value="attachments" className="mt-4">
          <ScrollArea className="h-[500px]">
            <div className="space-y-4 pr-4">
              {patient.documents.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <Paperclip className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                    <p className="text-muted-foreground mb-3">
                      Nenhum documento anexado
                    </p>
                    <Button size="sm" variant="outline" onClick={onUploadDocument}>
                      <Plus className="h-4 w-4 mr-1" />
                      Anexar documento
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {patient.documents.map((doc) => (
                    <Card key={doc.id} className="hover:border-primary/30 transition-colors cursor-pointer">
                      <CardContent className="pt-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <FileText className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{doc.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(doc.uploadDate), "dd/MM/yyyy")} • {doc.type.toUpperCase()}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Diagnósticos */}
        <TabsContent value="diagnosis" className="mt-4">
          <ScrollArea className="h-[500px]">
            <div className="space-y-4 pr-4">
              {sortedSessions.filter(s => s.diagnosis).length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <Stethoscope className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                    <p className="text-muted-foreground">
                      Nenhum diagnóstico registrado
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <>
                  {/* Diagnóstico atual */}
                  {patient.initialRecord?.initialDiagnosis && (
                    <Card className="border-primary/30">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Stethoscope className="h-4 w-4" />
                          Diagnóstico Principal
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="font-medium">{patient.initialRecord.initialDiagnosis}</p>
                      </CardContent>
                    </Card>
                  )}

                  {/* Histórico de diagnósticos */}
                  {sortedSessions
                    .filter((s) => s.diagnosis)
                    .map((session) => (
                      <Card key={session.id}>
                        <CardContent className="pt-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              {format(new Date(session.date), "dd/MM/yyyy")}
                            </span>
                          </div>
                          <p className="font-medium">{session.diagnosis}</p>
                          {session.clinicalNotes && (
                            <p className="text-sm text-muted-foreground mt-2">
                              {session.clinicalNotes}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                </>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Plano Terapêutico */}
        <TabsContent value="plan" className="mt-4">
          <ScrollArea className="h-[500px]">
            <div className="space-y-4 pr-4">
              {/* Plano de tratamento da avaliação inicial */}
              {patient.initialRecord?.treatmentPlan ? (
                <Card className="border-primary/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <ClipboardList className="h-4 w-4" />
                      Plano de Tratamento
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{patient.initialRecord.treatmentPlan}</p>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <ClipboardList className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                    <p className="text-muted-foreground">
                      Nenhum plano terapêutico definido
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Progresso do tratamento */}
              {sortedSessions.filter(s => s.treatmentProgress).length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-medium flex items-center gap-2">
                    <History className="h-4 w-4" />
                    Progresso do Tratamento
                  </h3>
                  {sortedSessions
                    .filter((s) => s.treatmentProgress)
                    .map((session) => (
                      <Card key={session.id}>
                        <CardContent className="pt-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              {format(new Date(session.date), "dd/MM/yyyy")}
                            </span>
                          </div>
                          <p className="text-sm">{session.treatmentProgress}</p>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ElectronicRecord;
