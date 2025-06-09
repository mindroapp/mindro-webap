
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Users, Calendar, MessageCircle, HelpCircle, ArrowUp } from "lucide-react";
import AdminLayout from "@/components/layouts/AdminLayout";

const AdminDashboard: React.FC = () => {
  // Dados fictícios para o dashboard
  const stats = [
    {
      title: "Total de Clientes",
      value: "248",
      change: "+12%",
      icon: Users,
      trend: "up",
    },
    {
      title: "Agendamentos Hoje",
      value: "42",
      change: "+5%",
      icon: Calendar,
      trend: "up",
    },
    {
      title: "Mensagens WhatsApp",
      value: "1,284",
      change: "+18%",
      icon: MessageCircle,
      trend: "up",
    },
    {
      title: "Chamados de Suporte",
      value: "8",
      change: "-3%",
      icon: HelpCircle,
      trend: "down",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard Administrativo</h2>
          <div className="flex items-center space-x-2 mt-2 md:mt-0">
            <select className="bg-white dark:bg-background border rounded px-3 py-1.5 text-sm">
              <option>Último mês</option>
              <option>Últimos 3 meses</option>
              <option>Este ano</option>
            </select>
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
                  {stat.trend === 'up' ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowUp className="h-3 w-3 mr-1 transform rotate-180" />}
                  {stat.change} relativo ao mês passado
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Novos Clientes</CardTitle>
              <CardDescription>Clientes registrados nos últimos 30 dias</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[220px] flex items-center justify-center bg-slate-50 dark:bg-slate-900/50 rounded-md">
                <BarChart3 className="h-16 w-16 text-slate-300" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Status Financeiro</CardTitle>
              <CardDescription>Visão geral do faturamento</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[220px] flex items-center justify-center bg-slate-50 dark:bg-slate-900/50 rounded-md">
                <BarChart3 className="h-16 w-16 text-slate-300" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Atividades Recentes</CardTitle>
              <CardDescription>Últimas ações no sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-start space-x-4 pb-4 border-b last:border-0">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-psycho-muted flex items-center justify-center">
                      <Users className="h-4 w-4 text-psycho-primary" />
                    </span>
                    <div>
                      <p className="text-sm font-medium">
                        {i % 2 === 0 ? "Cliente novo cadastrado" : "Chamado de suporte atendido"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {`${i} ${i === 1 ? "hora" : "horas"} atrás`}
                      </p>
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
