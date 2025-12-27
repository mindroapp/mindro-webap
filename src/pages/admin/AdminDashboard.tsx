import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, UserX, UserPlus, Calendar, Activity } from "lucide-react";
import AdminLayout from "@/components/layouts/AdminLayout";

const AdminDashboard: React.FC = () => {
  // Dados simplificados para os indicadores principais
  const stats = [
    {
      title: "Profissionais Solicitados",
      value: "12",
      icon: UserPlus,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950",
    },
    {
      title: "Profissionais Ativos",
      value: "142",
      icon: UserCheck,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950",
    },
    {
      title: "Profissionais Inativos",
      value: "14",
      icon: UserX,
      color: "text-red-600",
      bgColor: "bg-red-50 dark:bg-red-950",
    },
    {
      title: "Total de Pacientes",
      value: "1.248",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950",
    },
    {
      title: "Total de Sessões",
      value: "5.632",
      icon: Calendar,
      color: "text-amber-600",
      bgColor: "bg-amber-50 dark:bg-amber-950",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">Visão geral da plataforma</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {stats.map((stat) => (
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
