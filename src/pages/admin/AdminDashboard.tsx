import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, UserCheck, UserX, UserPlus, Calendar } from "lucide-react";
import AdminLayout from "@/components/layouts/AdminLayout";
import { dashboardService, AdminStats } from "@/services/dashboardService";

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    dashboardService
      .getAdminStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const statCards = stats
    ? [
        {
          title: "Profissionais Solicitados",
          value: stats.pendingProfessionals.toString(),
          icon: UserPlus,
          color: "text-blue-600",
          bgColor: "bg-blue-50 dark:bg-blue-950",
        },
        {
          title: "Profissionais Ativos",
          value: stats.activeProfessionals.toString(),
          icon: UserCheck,
          color: "text-green-600",
          bgColor: "bg-green-50 dark:bg-green-950",
        },
        {
          title: "Profissionais Inativos",
          value: stats.inactiveProfessionals.toString(),
          icon: UserX,
          color: "text-red-600",
          bgColor: "bg-red-50 dark:bg-red-950",
        },
        {
          title: "Total de Pacientes",
          value: stats.totalPatients.toLocaleString("pt-BR"),
          icon: Users,
          color: "text-purple-600",
          bgColor: "bg-purple-50 dark:bg-purple-950",
        },
        {
          title: "Total de Sessões",
          value: stats.totalSessions.toLocaleString("pt-BR"),
          icon: Calendar,
          color: "text-amber-600",
          bgColor: "bg-amber-50 dark:bg-amber-950",
        },
      ]
    : [];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">Visão geral da plataforma</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <Card key={i} className="border-0 shadow-sm">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-12 w-12 rounded-xl" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-3 w-28" />
                        <Skeleton className="h-7 w-14" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            : statCards.map((stat) => (
                <Card key={stat.title} className="border-0 shadow-sm">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                        <stat.icon className={`h-5 w-5 md:h-6 md:w-6 ${stat.color}`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs md:text-sm text-muted-foreground truncate">
                          {stat.title}
                        </p>
                        <p className="text-xl md:text-2xl font-bold">{stat.value}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
