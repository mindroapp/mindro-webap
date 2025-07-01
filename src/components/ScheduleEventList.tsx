
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ScheduleEvent } from "@/stores/patientStore";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Clock, CalendarDays, User, Plus, Calendar, ArrowRight, Search, X, Check, Ban } from "lucide-react";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { usePatientStore } from "@/stores/patientStore";
import { useToast } from "@/hooks/use-toast";
import Pagination from "./Pagination";

const ITEMS_PER_PAGE = 10;

interface ScheduleEventListProps {
  events: ScheduleEvent[];
  showDate?: boolean;
  showAddButton?: boolean;
  onAddClick?: () => void;
  showPagination?: boolean;
  showFilters?: boolean;
}

const ScheduleEventList: React.FC<ScheduleEventListProps> = ({ 
  events, 
  showDate = false, 
  showAddButton = false,
  onAddClick,
  showPagination = false,
  showFilters = false
}) => {
  const navigate = useNavigate();
  const { updateScheduleEvent } = usePatientStore();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    eventId: string;
    action: "confirm" | "cancel";
  }>({ isOpen: false, eventId: "", action: "confirm" });

  const filteredAndSortedEvents = useMemo(() => {
    let filtered = events.filter(event => {
      const matchesSearch = event.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (event.notes && event.notes.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = statusFilter === "all" || event.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "patient":
          return a.patientName.localeCompare(b.patientName);
        case "status":
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

    return filtered;
  }, [events, searchTerm, statusFilter, sortBy]);

  const totalPages = Math.ceil(filteredAndSortedEvents.length / ITEMS_PER_PAGE);
  const paginatedEvents = showPagination 
    ? filteredAndSortedEvents.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
    : filteredAndSortedEvents;

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

  const getStatusLabel = (status: ScheduleEvent["status"]) => {
    switch (status) {
      case "scheduled": return "Agendado";
      case "confirmed": return "Confirmado";
      case "completed": return "Concluído";
      case "cancelled": return "Cancelado";
      default: return status;
    }
  };

  const handleStatusUpdate = async (eventId: string, newStatus: ScheduleEvent["status"]) => {
    await updateScheduleEvent(eventId, { status: newStatus });
    toast({
      title: "Status atualizado",
      description: `O agendamento foi ${getStatusLabel(newStatus).toLowerCase()}.`
    });
  };

  const handleConfirmAction = async () => {
    const { eventId, action } = confirmDialog;
    const newStatus = action === "confirm" ? "confirmed" : "cancelled";
    await handleStatusUpdate(eventId, newStatus);
    setConfirmDialog({ isOpen: false, eventId: "", action: "confirm" });
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setSortBy("date");
    setCurrentPage(1);
  };

  const renderStatusActions = (event: ScheduleEvent) => {
    if (event.status === "completed") {
      return null;
    }

    return (
      <div className="flex gap-2">
        {event.status === "scheduled" && (
          <>
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                setConfirmDialog({ isOpen: true, eventId: event.id, action: "confirm" });
              }}
            >
              <Check className="h-3 w-3 mr-1" />
              Confirmar
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                setConfirmDialog({ isOpen: true, eventId: event.id, action: "cancel" });
              }}
            >
              <Ban className="h-3 w-3 mr-1" />
              Cancelar
            </Button>
          </>
        )}
        
        {event.status === "confirmed" && (
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              setConfirmDialog({ isOpen: true, eventId: event.id, action: "cancel" });
            }}
          >
            <Ban className="h-3 w-3 mr-1" />
            Cancelar
          </Button>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {showFilters && (
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              placeholder="Buscar por paciente ou observações..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="scheduled">Agendado</SelectItem>
              <SelectItem value="confirmed">Confirmado</SelectItem>
              <SelectItem value="completed">Concluído</SelectItem>
              <SelectItem value="cancelled">Cancelado</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Data</SelectItem>
              <SelectItem value="patient">Paciente</SelectItem>
              <SelectItem value="status">Status</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" onClick={handleClearFilters}>
            <X className="h-4 w-4 mr-2" />
            Limpar
          </Button>
        </div>
      )}

      <div className="space-y-3">
        {paginatedEvents.length > 0 ? (
          paginatedEvents.map((event) => (
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
                      {getStatusLabel(event.status)}
                    </Badge>
                    
                    <div className="flex items-center gap-2">
                      {renderStatusActions(event)}
                      
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

      {showPagination && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      <Dialog open={confirmDialog.isOpen} onOpenChange={(open) => 
        setConfirmDialog({ ...confirmDialog, isOpen: open })
      }>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {confirmDialog.action === "confirm" ? "Confirmar Agendamento" : "Cancelar Agendamento"}
            </DialogTitle>
          </DialogHeader>
          <p>
            {confirmDialog.action === "confirm" 
              ? "Tem certeza que deseja confirmar este agendamento?"
              : "Tem certeza que deseja cancelar este agendamento?"
            }
          </p>
          <div className="flex justify-end gap-2 mt-4">
            <Button 
              variant="outline" 
              onClick={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
            >
              Cancelar
            </Button>
            <Button onClick={handleConfirmAction}>
              {confirmDialog.action === "confirm" ? "Confirmar" : "Cancelar Agendamento"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ScheduleEventList;
