
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ScheduleAvailability from "@/components/ScheduleAvailability";
import ScheduleAppointments from "@/components/ScheduleAppointments";

const ScheduleManager: React.FC = () => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="agendas" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="agendas">Agendas</TabsTrigger>
          <TabsTrigger value="agendamentos">Agendamentos</TabsTrigger>
        </TabsList>

        <TabsContent value="agendas" className="mt-6">
          <ScheduleAvailability />
        </TabsContent>

        <TabsContent value="agendamentos" className="mt-6">
          <ScheduleAppointments />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ScheduleManager;
