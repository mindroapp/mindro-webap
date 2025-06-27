
import React from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  DollarSign, 
  CreditCard, 
  AlertCircle,
  Target,
  Calendar,
  Users,
  MessageSquare,
  Receipt
} from "lucide-react";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from "recharts";

const FinancialPage: React.FC = () => {
  // Dados para receita por mês
  const monthlyRevenue = [
    { month: "Jan", value: 12000 },
    { month: "Fev", value: 14500 },
    { month: "Mar", value: 13200 },
    { month: "Abr", value: 16800 },
    { month: "Mai", value: 15300 },
    { month: "Jun", value: 18200 },
  ];

  // Dados para formas de pagamento
  const paymentMethods = [
    { method: "PIX", value: 45, color: "#8884d8" },
    { method: "Cartão", value: 30, color: "#82ca9d" },
    { method: "Dinheiro", value: 15, color: "#ffc658" },
    { method: "Transferência", value: 10, color: "#ff7300" },
  ];

  // Dados para sessões pagas/pendentes
  const sessionStatus = [
    { status: "Pagas", count: 85, color: "#22c55e" },
    { status: "Pendentes", count: 15, color: "#f59e0b" },
  ];

  // Pacientes com débitos
  const debtors = [
    { name: "João Silva", debt: 400, sessions: 2, lastPayment: "15/05/2024" },
    { name: "Maria Santos", debt: 200, sessions: 1, lastPayment: "10/05/2024" },
    { name: "Carlos Lima", debt: 600, sessions: 3, lastPayment: "05/05/2024" },
  ];

  const currentMonthRevenue = 18200;
  const monthlyGoal = 20000;
  const goalProgress = (currentMonthRevenue / monthlyGoal) * 100;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Financeiro</h1>
          <div className="flex space-x-2">
            <Button className="bg-indigo-700 hover:bg-indigo-800">
              <Receipt className="h-4 w-4 mr-2" />
              Novo Recibo
            </Button>
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Relatório Mensal
            </Button>
          </div>
        </div>

        {/* Métricas principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita do Mês</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                R$ {currentMonthRevenue.toLocaleString()}
              </div>
              <p className="text-xs text-green-500 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +18% vs mês passado
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sessões Realizadas</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">100</div>
              <p className="text-xs text-green-500">
                85 pagas, 15 pendentes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">85%</div>
              <p className="text-xs text-gray-500">
                Sessões pagas/realizadas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pacientes Ativos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">32</div>
              <p className="text-xs text-gray-500">
                Com sessões este mês
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Meta financeira do mês */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5" />
              <span>Meta Financeira do Mês</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Progresso da Meta</span>
                <span className="text-sm text-gray-600">
                  R$ {currentMonthRevenue.toLocaleString()} / R$ {monthlyGoal.toLocaleString()}
                </span>
              </div>
              <Progress value={goalProgress} className="h-3" />
              <div className="flex justify-between text-sm">
                <span className="text-green-600 font-medium">{goalProgress.toFixed(1)}% atingido</span>
                <span className="text-gray-600">
                  Faltam R$ {(monthlyGoal - currentMonthRevenue).toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Receita por Mês</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyRevenue}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`R$ ${value}`, 'Receita']} />
                    <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Formas de Pagamento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={paymentMethods}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ method, value }) => `${method}: ${value}%`}
                    >
                      {paymentMethods.map((entry, index) => (
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
              <CardTitle>Sessões Pagas vs Pendentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sessionStatus}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="status" />
                    <YAxis />
                    <Tooltip />
                    {sessionStatus.map((entry, index) => (
                      <Bar key={`bar-${index}`} dataKey="count" fill={entry.color} />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-orange-500" />
                <span>Pacientes com Débitos</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {debtors.map((debtor, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{debtor.name}</p>
                      <p className="text-sm text-gray-600">
                        {debtor.sessions} sessões • Último pagamento: {debtor.lastPayment}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="destructive">
                        R$ {debtor.debt}
                      </Badge>
                      <Button size="sm" variant="outline">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        Cobrar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FinancialPage;
