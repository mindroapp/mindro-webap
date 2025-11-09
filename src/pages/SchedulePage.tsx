
import DashboardLayout from "@/components/layouts/DashboardLayout";
import ScheduleManager from "@/components/ScheduleManager";

const SchedulePage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Agendamentos</h1>
          <p className="text-muted-foreground">
            Gerencie suas agendas e visualize seus agendamentos
          </p>
        </div>
        <ScheduleManager />
      </div>
    </DashboardLayout>
  );
};

export default SchedulePage;
