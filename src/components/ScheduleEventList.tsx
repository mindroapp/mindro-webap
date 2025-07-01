import React from "react";
import { useNavigate } from "react-router-dom";
import { ScheduleEvent } from "@/stores/patientStore";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, CalendarDays, User, Plus, Calendar, ArrowRight } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ScheduleEventListProps {
  events: ScheduleEvent[];
  showDate?: boolean;
  showAddButton?: boolean;
  onAddClick?: () => void;
}

const ScheduleEventList: React.FC<ScheduleEventListProps> = ({ 
  events, 
  showDate = false, 
  showAddButton = false,
  onAddClick 
}) => {
  const navigate = useNavigate();

  const getStatusColor = (status: ScheduleEvent["status"]) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200";
      case "completed":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const sortedEvents = [...events].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <div className="space-y-3">
      {sortedEvents.length > 0 ? (
        sortedEvents.map((event) => (
          <Card 
            key={event.id} 
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => navigate(`/schedule/${event.id}`)}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-3">
                  <div className="bg-psycho-muted p-2 rounded-md text-psycho-primary">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-medium">
                      {format(parseISO(event.date), "HH:mm")} ({event.duration} min)
                    </div>
                    
                    <div className="flex items-center mt-1 text-sm text-gray-600">
                      <User className="h-3.5 w-3.5 mr-1" /> {event.patientName}
                    </div>
                    
                    {showDate && (
                      <div className="flex items-center mt-1 text-sm text-gray-600">
                        <CalendarDays className="h-3.5 w-3.5 mr-1" /> 
                        {format(parseISO(event.date), "d 'de' MMMM 'de' yyyy")}
                      </div>
                    )}
                    
                    {event.notes && (
                      <div className="mt-2 text-sm text-gray-600">
                        {event.notes.length > 60 ? `${event.notes.substring(0, 60)}...` : event.notes}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-2">
                  <Badge className={cn("font-normal capitalize", getStatusColor(event.status))}>
                    {event.status === "scheduled" && "Agendado"}
                    {event.status === "confirmed" && "Confirmado"}
                    {event.status === "completed" && "Concluído"}
                    {event.status === "cancelled" && "Cancelado"}
                  </Badge>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs group"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/schedule/${event.id}`);
                    }}
                  >
                    Detalhes <ArrowRight size={14} className="ml-1 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      ) : showAddButton ? (
        <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-lg">
          <CalendarDays className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum compromisso agendado</h3>
          <p className="text-gray-500 mb-4">Adicione seu primeiro compromisso para esta data</p>
          <Button onClick={onAddClick}>
            <Plus className="h-4 w-4 mr-1" /> Adicionar Compromisso
          </Button>
        </div>
      ) : (
        <div className="text-center py-6 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Nenhum compromisso agendado</p>
        </div>
      )}
    </div>
  );
};

export default ScheduleEventList;