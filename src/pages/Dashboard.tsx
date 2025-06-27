
import React from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, CalendarDays, Activity, BarChart3 } from "lucide-react";

const Dashboard: React.FC = () => {
  // Dados simplificados para o dashboard profissional
  const stats = [
    {
      title: "Total de Pacientes",
      value: "32",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Agendas Abertas (Mês)",
      value: "45",
      icon: Calendar,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Agendas Abertas (Hoje)",
      value: "3",
      icon: CalendarDays,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Agendamentos (Mês)",
      value: "38",
      icon: Calendar,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      title: "Agendamentos (Hoje)",
      value: "2",
      icon: CalendarDays,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      title: "Sessões Realizadas",
      value: "127",
      icon: Activity,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Média de Sessões/Paciente",
      value: "4.2",
      icon: BarChart3,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50"
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Visão geral da sua prática profissional
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-md ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Resumo da Semana</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-medium text-blue-900">Próximos Agendamentos</p>
                  <p className="text-sm text-blue-700">2 agendamentos hoje, 5 esta semana</p>
                </div>
                <div className="text-2xl font-bold text-blue-600">7</div>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium text-green-900">Horários Disponíveis</p>
                  <p className="text-sm text-green-700">3 slots livres hoje, 12 esta semana</p>
                </div>
                <div className="text-2xl font-bold text-green-600">15</div>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <div>
                  <p className="font-medium text-purple-900">Sessões Pendentes</p>
                  <p className="text-sm text-purple-700">Registros aguardando documentação</p>
                </div>
                <div className="text-2xl font-bold text-purple-600">3</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
