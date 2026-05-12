import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Calendar, CalendarDays, TrendingUp } from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { dashboardService, DashboardStats } from "@/services/dashboardService";

const STATUS_COLORS: Record<string, string> = {
  scheduled: "#8884d8",
  confirmed: "#82ca9d",
  completed: "#22c55e",
  cancelled: "#ef4444",
};

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    dashboardService
      .getStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const statCards = stats
    ? [
        {
          title: "Total de Pacientes",
          value: stats.totalPatients.toString(),
          icon: Users,
        },
        {
          title: "Agendas Abertas (Mês)",
          value: stats.availabilitiesThisMonth.toString(),
          icon: Calendar,
        },
        {
          title: "Agendamentos (Mês)",
          value: stats.eventsThisMonth.toString(),
          icon: CalendarDays,
          subtitle: stats.eventsToday > 0 ? `${stats.eventsToday} hoje` : undefined,
        },
        {
          title: "Média de Sessões/Paciente",
          value: stats.avgSessionsPerPatient.toFixed(1),
          icon: TrendingUp,
        },
      ]
    : [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Visão geral da sua prática profissional</p>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="border-none shadow-sm">
                  <CardContent className="p-6 space-y-3">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-8 w-16" />
                  </CardContent>
                </Card>
              ))
            : statCards.map((stat, index) => (
                <Card key={index} className="border-none shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <stat.icon className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                      <div className="flex items-baseline gap-2">
                        <h3 className="text-3xl font-bold text-foreground">{stat.value}</h3>
                        {stat.subtitle && (
                          <span className="text-xs text-muted-foreground">{stat.subtitle}</span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sessions by status */}
          <Card>
            <CardHeader>
              <CardTitle>Sessões por Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                {isLoading ? (
                  <Skeleton className="h-full w-full" />
                ) : stats && stats.sessionsByStatus.some((s) => s.count > 0) ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.sessionsByStatus.filter((s) => s.count > 0)}
                        cx="50%"
                        cy="50%"
                        outerRadius={90}
                        dataKey="count"
                        label={({ label, count }) => `${label}: ${count}`}
                      >
                        {stats.sessionsByStatus
                          .filter((s) => s.count > 0)
                          .map((entry) => (
                            <Cell key={entry.status} fill={STATUS_COLORS[entry.status] ?? "#ccc"} />
                          ))}
                      </Pie>
                      <Tooltip formatter={(value, _, props) => [value, props.payload.label]} />
                      <Legend formatter={(_, entry: any) => entry.payload.label} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                    Nenhuma sessão registrada
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Age distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Classificação por Idade</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                {isLoading ? (
                  <Skeleton className="h-full w-full" />
                ) : stats && stats.ageDistribution.some((a) => a.count > 0) ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.ageDistribution}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="ageRange" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#8884d8" name="Pacientes" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                    Nenhum paciente cadastrado
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
