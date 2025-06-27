
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Users, UserCheck, Activity } from "lucide-react";
import AdminLayout from "@/components/layouts/AdminLayout";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from "recharts";

const AdminDashboard: React.FC = () => {
  // Dados fictícios para profissionais
  const totalProfessionals = 156;
  const activeProfessionals = 142;
  const suspendedProfessionals = 8;
  const pendingRequests = 6;

  // Dados para gráfico de profissionais por área
  const professionalsByArea = [
    { area: "Psicólogos", count: 85, color: "#8884d8" },
    { area: "Psicanalistas", count: 32, color: "#82ca9d" },
    { area: "Terapeutas", count: 28, color: "#ffc658" },
    { area: "Neuropsicólogos", count: 11, color: "#ff7300" },
  ];

  const stats = [
    {
      title: "Total de Profissionais",
      value: totalProfessionals.toString(),
      change: "+8",
      icon: Users,
      trend: "up",
    },
    {
      title: "Profissionais Ativos",
      value: activeProfessionals.toString(),
      change: "+5",
      icon: UserCheck,
      trend: "up",
    },
    {
      title: "Solicitações Pendentes",
      value: pendingRequests.toString(),
      change: "+2",
      icon: Activity,
      trend: "up",
    },
    {
      title: "Profissionais Suspensos",
      value: suspendedProfessionals.toString(),
      change: "-1",
      icon: Users,
      trend: "down",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard Administrativo</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className={`flex items-center text-xs ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.change} este mês
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Total de Profissionais por Mês</CardTitle>
              <CardDescription>Crescimento mensal de profissionais cadastrados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { month: 'Jan', total: 120 },
                    { month: 'Fev', total: 132 },
                    { month: 'Mar', total: 145 },
                    { month: 'Abr', total: 156 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="total" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Profissionais por Área</CardTitle>
              <CardDescription>Distribuição por especialidade</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={professionalsByArea}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                      label={({ area, count }) => `${area}: ${count}`}
                    >
                      {professionalsByArea.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Atividades Recentes</CardTitle>
              <CardDescription>Últimas ações na plataforma</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { action: "Novo profissional aprovado", name: "Dr. João Silva", time: "2 horas atrás" },
                  { action: "Solicitação de cadastro", name: "Dra. Maria Santos", time: "4 horas atrás" },
                  { action: "Profissional suspenso", name: "Dr. Carlos Lima", time: "1 dia atrás" },
                  { action: "Novo profissional aprovado", name: "Dra. Ana Costa", time: "2 dias atrás" },
                ].map((activity, i) => (
                  <div key={i} className="flex items-start space-x-4 pb-4 border-b last:border-0">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-psycho-muted flex items-center justify-center">
                      <UserCheck className="h-4 w-4 text-psycho-primary" />
                    </span>
                    <div>
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-sm text-gray-600">{activity.name}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
