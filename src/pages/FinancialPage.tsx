
import React from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  DollarSign, 
  CreditCard, 
  AlertCircle,
  Calendar,
  Users,
  MessageSquare
} from "lucide-react";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip
} from "recharts";

const FinancialPage: React.FC = () => {
  const handlePrintReport = () => {
    // Criar um elemento temporário com o conteúdo do relatório
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Relatório Financeiro - Maio 2026</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 40px;
            color: #333;
          }
          .header {
            text-align: center;
            margin-bottom: 40px;
            border-bottom: 2px solid #333;
            padding-bottom: 20px;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
          }
          .header p {
            margin: 5px 0;
            color: #666;
          }
          .metrics {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 40px;
          }
          .metric-box {
            border: 1px solid #ddd;
            padding: 15px;
            border-radius: 5px;
            background-color: #f9f9f9;
          }
          .metric-box h3 {
            margin: 0 0 10px 0;
            color: #333;
            font-size: 14px;
          }
          .metric-box .value {
            font-size: 24px;
            font-weight: bold;
            color: #22c55e;
            margin-bottom: 5px;
          }
          .metric-box .description {
            font-size: 12px;
            color: #666;
          }
          .section {
            margin-bottom: 30px;
          }
          .section h2 {
            font-size: 18px;
            border-bottom: 1px solid #ddd;
            padding-bottom: 10px;
            margin-bottom: 15px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
          }
          th {
            background-color: #f0f0f0;
            padding: 10px;
            text-align: left;
            border: 1px solid #ddd;
            font-weight: bold;
            font-size: 13px;
          }
          td {
            padding: 10px;
            border: 1px solid #ddd;
            font-size: 13px;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            text-align: center;
            font-size: 12px;
            color: #999;
          }
          @media print {
            body { margin: 20px; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Relatório Financeiro</h1>
          <p>Mês: Maio/2026</p>
          <p>Data de Geração: ${new Date().toLocaleDateString('pt-BR')}</p>
        </div>

        <div class="metrics">
          <div class="metric-box">
            <h3>Pacientes Ativos</h3>
            <div class="value">32</div>
            <div class="description">Com sessões este mês</div>
          </div>
          <div class="metric-box">
            <h3>Sessões Realizadas</h3>
            <div class="value">100</div>
            <div class="description">85 pagas | 15 pendentes</div>
          </div>
          <div class="metric-box">
            <h3>Taxa de Conversão</h3>
            <div class="value">85%</div>
            <div class="description">85 pagaram | 15 não pagaram</div>
          </div>
          <div class="metric-box">
            <h3>Receita do Mês</h3>
            <div class="value">R$ 18.200</div>
            <div class="description">+18% vs mês passado</div>
          </div>
        </div>

        <div class="section">
          <h2>Resumo de Receitas</h2>
          <table>
            <thead>
              <tr>
                <th>Mês</th>
                <th style="text-align: right;">Receita</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Janeiro</td><td style="text-align: right;">R$ 12.000</td></tr>
              <tr><td>Fevereiro</td><td style="text-align: right;">R$ 14.500</td></tr>
              <tr><td>Março</td><td style="text-align: right;">R$ 13.200</td></tr>
              <tr><td>Abril</td><td style="text-align: right;">R$ 16.800</td></tr>
              <tr><td>Maio</td><td style="text-align: right;">R$ 18.200</td></tr>
              <tr style="background-color: #f0f0f0; font-weight: bold;">
                <td>Total</td>
                <td style="text-align: right;">R$ 74.700</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="section">
          <h2>Pacientes com Débitos</h2>
          <table>
            <thead>
              <tr>
                <th>Paciente</th>
                <th>Sessões</th>
                <th>Último Pagamento</th>
                <th style="text-align: right;">Débito</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>João Silva</td><td>2</td><td>15/05/2024</td><td style="text-align: right;">R$ 400</td></tr>
              <tr><td>Maria Santos</td><td>1</td><td>10/05/2024</td><td style="text-align: right;">R$ 200</td></tr>
              <tr><td>Carlos Lima</td><td>3</td><td>05/05/2024</td><td style="text-align: right;">R$ 600</td></tr>
              <tr style="background-color: #f0f0f0; font-weight: bold;">
                <td colspan="3">Total em Débito</td>
                <td style="text-align: right;">R$ 1.200</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="footer">
          <p>Este relatório foi gerado automaticamente pelo sistema</p>
        </div>
      </body>
      </html>
    `;

    // Abrir em nova aba, deixar carregar e depois chamar print
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    document.body.appendChild(iframe);

    if (iframe.contentDocument) {
      iframe.contentDocument.open();
      iframe.contentDocument.write(printContent);
      iframe.contentDocument.close();

      // Aguardar o carregamento antes de chamar print
      iframe.onload = () => {
        setTimeout(() => {
          iframe.contentWindow?.print();
        }, 250);
      };
    }

    // Remover o iframe após a impressão
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 1000);
  };

  // Dados para receita por mês
  const monthlyRevenue = [
    { month: "Jan", value: 12000 },
    { month: "Fev", value: 14500 },
    { month: "Mar", value: 13200 },
    { month: "Abr", value: 16800 },
    { month: "Mai", value: 15300 },
    { month: "Jun", value: 18200 },
  ];

  // Pacientes com débitos
  const debtors = [
    { name: "João Silva", debt: 400, sessions: 2, lastPayment: "15/05/2024", phone: "5585987654321" },
    { name: "Maria Santos", debt: 200, sessions: 1, lastPayment: "10/05/2024", phone: "5585998765432" },
    { name: "Carlos Lima", debt: 600, sessions: 3, lastPayment: "05/05/2024", phone: "5585999876543" },
  ];

  const currentMonthRevenue = 18200;

  const handleWhatsAppCharge = (debtor: typeof debtors[0]) => {
    const message = `Olá ${debtor.name}! Segue a cobrança referente às ${debtor.sessions} sessão(ões) realizadas. Valor total a pagar: R$ ${debtor.debt}. Por favor, efetue o pagamento. Agradecemos!`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${debtor.phone}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Financeiro</h1>
          <Button variant="outline" onClick={handlePrintReport}>
            <Calendar className="h-4 w-4 mr-2" />
            Relatório Mensal
          </Button>
        </div>

        {/* Métricas principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                85 pagaram, 15 não pagaram
              </p>
            </CardContent>
          </Card>

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
        </div>

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
                      <Button size="sm" variant="outline" onClick={() => handleWhatsAppCharge(debtor)}>
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
