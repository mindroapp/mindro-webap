
import React from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import ScheduleManager from "@/components/ScheduleManager";

const SchedulePage: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Agendamentos</h1>
        <ScheduleManager />
      </div>
    </DashboardLayout>
  );
};

export default SchedulePage;
