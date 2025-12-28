import React from "react";
import { Session } from "@/stores/patientStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, FileText, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface SessionCardProps {
  session: Session;
  onEdit?: () => void;
  onViewDetails?: () => void;
}

const SessionCard: React.FC<SessionCardProps> = ({ session, onEdit, onViewDetails }) => {
  const [expanded, setExpanded] = React.useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("pt-BR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(date);
  };

  const getMoodEmoji = (mood: number) => {
    const emojis = ["😞", "😕", "😐", "🙂", "😊"];
    return emojis[mood - 1] || "😐";
  };

  const getApproachLabel = (approach?: string) => {
    switch (approach) {
      case "cognitive": return "TCC";
      case "psychoanalysis": return "Psicanálise";
      case "behavioral": return "Comportamental";
      case "humanistic": return "Humanista";
      case "other": return "Outra";
      default: return "Não definida";
    }
  };

  return (
    <Card className={cn("transition-all duration-200", expanded && "border-primary")}>
      <CardHeader className="p-3 sm:p-4 pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <CardTitle className="text-sm sm:text-base font-medium text-foreground">
            Sessão em {formatDate(session.date)}
          </CardTitle>
          <div className="flex gap-1 sm:gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0" 
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onEdit}>
              <Edit size={16} />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onViewDetails}>
              <FileText size={16} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-3 sm:p-4 pt-0">
        <div className="mb-3">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-lg sm:text-xl">{getMoodEmoji(session.mood)}</span>
            <span className="text-xs sm:text-sm text-muted-foreground">
              Humor: {getMoodEmoji(session.mood)}
            </span>
            {session.approach && (
              <Badge variant="outline" className="text-xs">
                {getApproachLabel(session.approach)}
              </Badge>
            )}
          </div>
          <p className="text-sm text-foreground line-clamp-2">{session.notes}</p>
        </div>
        
        <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
          <div>
            <h4 className="font-medium text-primary">Objetivos</h4>
            <p className="text-muted-foreground line-clamp-2">{session.objectives}</p>
          </div>
          
          <div>
            <h4 className="font-medium text-primary">Intervenções</h4>
            <p className="text-muted-foreground line-clamp-2">{session.interventions}</p>
          </div>
          
          <div>
            <h4 className="font-medium text-primary">Próximos Passos</h4>
            <p className="text-muted-foreground line-clamp-2">{session.nextSteps}</p>
          </div>
        </div>
        
        {expanded && session.diagnosis && (
          <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-dashed border-border">
            <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm">
              {session.diagnosis && (
                <div>
                  <h4 className="font-medium text-primary">Diagnóstico</h4>
                  <p className="text-muted-foreground">{session.diagnosis}</p>
                </div>
              )}
              
              {session.clinicalNotes && (
                <div>
                  <h4 className="font-medium text-primary">Anotações Clínicas</h4>
                  <p className="text-muted-foreground">{session.clinicalNotes}</p>
                </div>
              )}
              
              {session.treatmentProgress && (
                <div>
                  <h4 className="font-medium text-primary">Progresso do Tratamento</h4>
                  <p className="text-muted-foreground">{session.treatmentProgress}</p>
                </div>
              )}
              
              {session.evolution && (
                <div>
                  <h4 className="font-medium text-primary">Evolução</h4>
                  <p className="text-muted-foreground">{session.evolution}</p>
                </div>
              )}
              
              {session.medications && (
                <div>
                  <h4 className="font-medium text-primary">Medicações</h4>
                  <p className="text-muted-foreground">{session.medications}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SessionCard;
