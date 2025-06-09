
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
    return new Intl.DateTimeFormat("en-US", {
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
    <Card className={cn("transition-all duration-200", expanded && "border-psycho-primary")}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">
            Session on {formatDate(session.date)}
          </CardTitle>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 w-7 p-0" 
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </Button>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={onEdit}>
              <Edit size={16} />
            </Button>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={onViewDetails}>
              <FileText size={16} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="mb-3">
          <div className="flex items-center mb-1.5">
            <span className="text-xl mr-2">{getMoodEmoji(session.mood)}</span>
            <span className="text-sm text-gray-500">
              Humor: {getMoodEmoji(session.mood)}
            </span>
            {session.approach && (
              <Badge variant="outline" className="ml-auto">
                {getApproachLabel(session.approach)}
              </Badge>
            )}
          </div>
          <p className="text-gray-700">{session.notes}</p>
        </div>
        
        <div className="space-y-3 mt-4 text-sm">
          <div>
            <h4 className="font-medium text-psycho-primary">Objetivos</h4>
            <p className="text-gray-600">{session.objectives}</p>
          </div>
          
          <div>
            <h4 className="font-medium text-psycho-primary">Intervenções</h4>
            <p className="text-gray-600">{session.interventions}</p>
          </div>
          
          <div>
            <h4 className="font-medium text-psycho-primary">Próximos Passos</h4>
            <p className="text-gray-600">{session.nextSteps}</p>
          </div>
        </div>
        
        {expanded && session.diagnosis && (
          <div className="mt-6 pt-4 border-t border-dashed">
            <div className="space-y-4">
              {session.diagnosis && (
                <div>
                  <h4 className="font-medium text-psycho-primary">Diagnóstico</h4>
                  <p className="text-gray-600">{session.diagnosis}</p>
                </div>
              )}
              
              {session.clinicalNotes && (
                <div>
                  <h4 className="font-medium text-psycho-primary">Anotações Clínicas</h4>
                  <p className="text-gray-600">{session.clinicalNotes}</p>
                </div>
              )}
              
              {session.treatmentProgress && (
                <div>
                  <h4 className="font-medium text-psycho-primary">Progresso do Tratamento</h4>
                  <p className="text-gray-600">{session.treatmentProgress}</p>
                </div>
              )}
              
              {session.evolution && (
                <div>
                  <h4 className="font-medium text-psycho-primary">Evolução</h4>
                  <p className="text-gray-600">{session.evolution}</p>
                </div>
              )}
              
              {session.medications && (
                <div>
                  <h4 className="font-medium text-psycho-primary">Medicações</h4>
                  <p className="text-gray-600">{session.medications}</p>
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
