
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ScheduleCalendar from "@/components/ScheduleCalendar";

const ScheduleManager: React.FC = () => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="schedules">
        <TabsList>
          <TabsTrigger value="schedules">Agendas</TabsTrigger>
          <TabsTrigger value="appointments">Agendamentos</TabsTrigger>
        </TabsList>

        <TabsContent value="schedules">
          <ScheduleCalendar type="schedules" />
        </TabsContent>

        <TabsContent value="appointments">
          <ScheduleCalendar type="appointments" />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ScheduleManager;
