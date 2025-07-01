
import Header from "@/components/Header";
import ScheduleEventForm from "@/components/ScheduleEventForm";
import ScheduleEventList from "@/components/ScheduleEventList";
import SidebarMenu from "@/components/SidebarMenu";
import { Calendar } from "@/components/ui/calendar";
import { usePatientStore } from "@/stores/patientStore";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { format } from "date-fns";
import { CalendarDays, List, Plus } from "lucide-react";

import { ptBR } from "date-fns/locale";

const SchedulePage = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [view, setView] = useState<"calendar" | "list">("calendar");
  const { scheduleEvents, getDateEvents } = usePatientStore();
  const isMobile = useIsMobile();

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  // Converte a data para o formato de string para a função getDateEvents
  const currentDateEvents = selectedDate ? getDateEvents(selectedDate.toISOString()) : [];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="hidden md:block">
        <SidebarMenu />
      </div>
      <div className="flex-1">
        <Header />
        <main className="p-4 md:p-6">
          <div className="mb-4 md:mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">Agenda</h1>
              <p className="text-gray-500">Gerencie sua agenda de compromissos</p>
            </div>
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              <Button 
                variant="outline" 
                size="sm" 
                className={`${view === "calendar" ? "bg-psycho-muted text-psycho-primary" : ""} flex-1 md:flex-none`}
                onClick={() => setView("calendar")}
              >
                <CalendarDays className="h-4 w-4 mr-2" />
                Calendário
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className={`${view === "list" ? "bg-psycho-muted text-psycho-primary" : ""} flex-1 md:flex-none`}
                onClick={() => setView("list")}
              >
                <List className="h-4 w-4 mr-2" />
                Lista
              </Button>
              <Button 
                onClick={() => setIsAddingEvent(true)} 
                size="sm"
                className="flex-1 md:flex-none"
              >
                <Plus className="h-4 w-4 mr-1" /> Adicionar
              </Button>
            </div>
          </div>

          {view === "calendar" ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              <Card className="md:sticky md:top-4">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Selecionar Data</CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    className="rounded-md border shadow-sm pointer-events-auto"
                    locale={ptBR} // Configura o calendário para usar o locale em português
                  />
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">
                    {selectedDate ? (
                      <>Compromissos para {format(selectedDate, "d 'de' MMMM 'de' yyyy", { locale: ptBR })}</>
                    ) : (
                      <>Selecione uma data</>
                    )}
                  </CardTitle>
                  <CardDescription>
                    {currentDateEvents.length} compromissos agendados
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isAddingEvent ? (
                    <ScheduleEventForm 
                      initialDate={selectedDate}
                      onCancel={() => setIsAddingEvent(false)}
                      onSuccess={() => setIsAddingEvent(false)}
                    />
                  ) : (
                    <>
                      <ScheduleEventList 
                        events={currentDateEvents} 
                        showAddButton={currentDateEvents.length === 0}
                        onAddClick={() => setIsAddingEvent(true)}
                      />
                      {currentDateEvents.length > 0 && (
                        <div className="mt-4 text-center">
                          <Button 
                            variant="outline" 
                            className="text-sm" 
                            onClick={() => setIsAddingEvent(true)}
                          >
                            <Plus className="h-4 w-4 mr-1" /> Adicionar Outro Compromisso
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            <ScheduleEventList 
              events={scheduleEvents} 
              showDate
              onAddClick={() => setIsAddingEvent(true)}
            />
          )}
        </main>
      </div>

      {/* Visualização móvel para adicionar um evento */}
      {isAddingEvent && view === "list" && isMobile && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-4 border-b">
              <h2 className="text-xl font-semibold">Adicionar Compromisso</h2>
            </div>
            <ScheduleEventForm 
              initialDate={selectedDate}
              onCancel={() => setIsAddingEvent(false)}
              onSuccess={() => setIsAddingEvent(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SchedulePage;