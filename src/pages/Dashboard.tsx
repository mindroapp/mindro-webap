
import React from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, CalendarDays, Activity, BarChart3, User, TrendingUp } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const Dashboard: React.FC = () => {
  // Dados para classificação por sexo
  const genderData = [
    { gender: "Masculino", count: 12, color: "#8884d8" },
    { gender: "Feminino", count: 20, color: "#82ca9d" },
  ];

  // Dados para classificação por idade
  const ageData = [
    { ageRange: "18-25", count: 5 },
    { ageRange: "26-35", count: 12 },
    { ageRange: "36-45", count: 8 },
    { ageRange: "46-55", count: 5 },
    { ageRange: "56+", count: 2 },
  ];

  const stats = [
    {
      title: "Total de Pacientes",
      value: "32",
      icon: Users,
    },
    {
      title: "Agendas Abertas (Mês)",
      value: "45",
      icon: Calendar,
      subtitle: "3 hoje"
    },
    {
      title: "Agendamentos (Mês)",
      value: "38",
      icon: CalendarDays,
      subtitle: "2 hoje"
    },
    {
      title: "Média de Sessões/Paciente",
      value: "4.2",
      icon: TrendingUp,
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="border-none shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-3xl font-bold text-foreground">
                      {stat.value}
                    </h3>
                    {stat.subtitle && (
                      <span className="text-xs text-muted-foreground">
                        {stat.subtitle}
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Classificação por Sexo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={genderData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                      label={({ gender, count }) => `${gender}: ${count}`}
                    >
                      {genderData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Classificação por Idade</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ageData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="ageRange" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
