
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Users, UserCheck, Activity, MessageSquare, AlertTriangle, TrendingUp, Calendar, Wifi } from "lucide-react";
import AdminLayout from "@/components/layouts/AdminLayout";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { Badge } from "@/components/ui/badge";

const AdminDashboard: React.FC = () => {
  // Dados para planos contratados
  const planTypes = [
    { plan: "Básico", profissionais: 45, color: "#8884d8" },
    { plan: "Profissional", profissionais: 78, color: "#82ca9d" },
    { plan: "Premium", profissionais: 33, color: "#ffc658" },
  ];

  // Dados para tipos de mensagens WhatsApp
  const messageTypes = [
    { type: "Confirmação", count: 45, color: "#8884d8" },
    { type: "Lembrete", count: 32, color: "#82ca9d" },
    { type: "Cancelamento", count: 18, color: "#ffc658" },
    { type: "Informativa", count: 25, color: "#ff7300" },
  ];

  // Profissionais com baixa atividade
  const lowActivityProfessionals = [
    { name: "Dr. Carlos Lima", lastActivity: "5 dias atrás", sessions: 2 },
    { name: "Dra. Ana Costa", lastActivity: "7 dias atrás", sessions: 1 },
    { name: "Dr. Pedro Santos", lastActivity: "10 dias atrás", sessions: 0 },
  ];

  // Alertas e falhas
  const alerts = [
    { type: "Erro", message: "Falha na conexão WhatsApp - Dr. João", time: "2h atrás" },
    { type: "Aviso", message: "3 profissionais sem atividade há 7 dias", time: "1 dia atrás" },
    { type: "Info", message: "Backup realizado com sucesso", time: "2 dias atrás" },
  ];

  const stats = [
    {
      title: "Total de Profissionais",
      value: "156",
      change: "+8 este mês",
      icon: Users,
      trend: "up",
    },
    {
      title: "Ativos (7 dias)",
      value: "142",
      change: "+5 desde ontem",
      icon: UserCheck,
      trend: "up",
    },
    {
      title: "Tickets Abertos",
      value: "8",
      change: "-2 hoje",
      icon: Activity,
      trend: "down",
    },
    {
      title: "Mensagens WhatsApp",
      value: "120",
      change: "Esta semana",
      icon: MessageSquare,
      trend: "up",
    },
  ];

  const getAlertColor = (type: string) => {
    switch (type) {
      case "Erro": return "bg-red-100 text-red-600 border-red-200";
      case "Aviso": return "bg-yellow-100 text-yellow-600 border-yellow-200";
      case "Info": return "bg-blue-100 text-blue-600 border-blue-200";
      default: return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard Administrativo</h2>
          <div className="flex items-center space-x-2 mt-2 md:mt-0">
            <Wifi className="h-5 w-5 text-green-500" />
            <span className="text-sm text-green-600 font-medium">Sistema Online</span>
          </div>
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
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Profissionais por Tipo de Plano</CardTitle>
              <CardDescription>Distribuição por plano contratado</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={planTypes}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="plan" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="profissionais" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Tipos de Mensagens WhatsApp</CardTitle>
              <CardDescription>Distribuição por categoria</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={messageTypes}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                      label={({ type, count }) => `${type}: ${count}`}
                    >
                      {messageTypes.map((entry, index) => (
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Profissionais com Baixa Atividade</CardTitle>
              <CardDescription>Últimas atividades registradas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lowActivityProfessionals.map((prof, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{prof.name}</p>
                      <p className="text-sm text-gray-600">Última atividade: {prof.lastActivity}</p>
                      <p className="text-xs text-gray-500">Sessões esta semana: {prof.sessions}</p>
                    </div>
                    <Badge variant="outline" className="text-yellow-600 border-yellow-300">
                      Baixa Atividade
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Alertas e Falhas</CardTitle>
              <CardDescription>Últimas notificações do sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alerts.map((alert, i) => (
                  <div key={i} className={`flex items-start space-x-3 p-3 rounded-lg border ${getAlertColor(alert.type)}`}>
                    <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{alert.message}</p>
                      <p className="text-xs opacity-75">{alert.time}</p>
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
