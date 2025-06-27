
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Plus, Edit, Trash } from "lucide-react";

const ScheduleManager: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>("");

  // Mock data para agendas disponíveis
  const availableSchedules = [
    {
      id: "1",
      dayOfWeek: "Segunda-feira",
      times: ["08:00", "09:00", "10:00", "14:00", "15:00", "16:00"]
    },
    {
      id: "2",
      dayOfWeek: "Terça-feira",
      times: ["08:00", "09:00", "10:00", "14:00", "15:00"]
    },
    {
      id: "3",
      dayOfWeek: "Quarta-feira",
      times: ["08:00", "09:00", "14:00", "15:00", "16:00"]
    }
  ];

  // Mock data para agendamentos
  const appointments = [
    {
      id: "1",
      date: "2024-01-15",
      time: "09:00",
      patient: "João Silva",
      status: "confirmed"
    },
    {
      id: "2",
      date: "2024-01-15",
      time: "14:00",
      patient: "Maria Santos",
      status: "pending"
    },
    {
      id: "3",
      date: "2024-01-16",
      time: "10:00",
      patient: "Carlos Lima",
      status: "confirmed"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-100 text-green-800">Confirmado</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Cancelado</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="schedules">
        <TabsList>
          <TabsTrigger value="schedules">Agendas</TabsTrigger>
          <TabsTrigger value="appointments">Agendamentos</TabsTrigger>
        </TabsList>

        <TabsContent value="schedules" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Gestão de Agendas</h3>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Agenda
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableSchedules.map((schedule) => (
              <Card key={schedule.id}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center justify-between">
                    {schedule.dayOfWeek}
                    <div className="flex space-x-1">
                      <Button size="sm" variant="outline">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Trash className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-2">
                    {schedule.times.map((time) => (
                      <Badge key={time} variant="outline" className="justify-center">
                        {time}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    {schedule.times.length} horários disponíveis
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="appointments" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Agendamentos</h3>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Agendamento
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Calendário</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 border rounded-lg bg-gray-50">
                  <p className="text-center text-gray-500">
                    Calendário interativo seria implementado aqui
                  </p>
                  <p className="text-center text-sm text-gray-400 mt-2">
                    Dias com horários disponíveis em verde
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Próximos Agendamentos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {appointments.map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                          <Clock className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">{appointment.patient}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(appointment.date).toLocaleDateString('pt-BR')} às {appointment.time}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(appointment.status)}
                        <Button size="sm" variant="outline">
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ScheduleManager;
