import React from "react";
import { Session } from "@/stores/patientStore";
import { Button } from "@/components/ui/button";
import { Edit, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SessionTimelineProps {
  sessions: Session[];
  onEdit?: (session: Session) => void;
  onViewDetails?: (session: Session) => void;
}

const SessionTimeline: React.FC<SessionTimelineProps> = ({ 
  sessions, 
  onEdit, 
  onViewDetails 
}) => {
  const getMoodEmoji = (mood: number) => {
    const emojis = ["😞", "😕", "😐", "🙂", "😊"];
    return emojis[mood - 1] || "😐";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("pt-BR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
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

  // Group sessions by date
  const groupedSessions = sessions.reduce((acc, session) => {
    const date = formatDate(session.date);
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(session);
    return acc;
  }, {} as Record<string, Session[]>);

  const sortedDates = Object.keys(groupedSessions).sort((a, b) => {
    const dateA = new Date(groupedSessions[a][0].date).getTime();
    const dateB = new Date(groupedSessions[b][0].date).getTime();
    return dateB - dateA;
  });

  return (
    <div className="space-y-8">
      {sortedDates.map((dateGroup, dateIndex) => (
        <div key={dateGroup}>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground">{dateGroup}</h3>
            </div>
            <div className="h-0.5 flex-1 bg-border"></div>
          </div>

          <div className="space-y-4 pl-0 md:pl-8">
            {groupedSessions[dateGroup].map((session, sessionIndex) => (
              <div key={session.id} className="relative">
                {/* Timeline dot and line */}
                <div className="absolute -left-2 md:-left-10 top-6 w-6 h-6 bg-primary rounded-full border-4 border-background" />
                {sessionIndex < groupedSessions[dateGroup].length - 1 && (
                  <div className="absolute -left-1 md:-left-9 top-12 w-1 h-12 bg-border" />
                )}

                {/* Card */}
                <div className="ml-6 md:ml-0 p-4 border border-border rounded-lg hover:border-primary/50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getMoodEmoji(session.mood)}</span>
                      <div>
                        <time className="text-sm font-medium text-muted-foreground">
                          {formatTime(session.date)}
                        </time>
                        {session.approach && (
                          <Badge variant="outline" className="ml-2 text-xs">
                            {getApproachLabel(session.approach)}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={() => onEdit?.(session)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={() => onViewDetails?.(session)}
                      >
                        <FileText size={16} />
                      </Button>
                    </div>
                  </div>

                  <p className="text-sm text-foreground mb-3">{session.notes}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <h4 className="font-medium text-primary mb-1">Objetivos</h4>
                      <p className="text-muted-foreground line-clamp-2">{session.objectives}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-primary mb-1">Intervenções</h4>
                      <p className="text-muted-foreground line-clamp-2">{session.interventions}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-primary mb-1">Próximos Passos</h4>
                      <p className="text-muted-foreground line-clamp-2">{session.nextSteps}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SessionTimeline;
