import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, DollarSign, Users, AlertCircle, Calendar, MessageSquare } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import {
  financialService,
  FinancialSummary,
  MonthlyRevenue,
  Debtor,
} from "@/services/financialService";

const FinancialPage: React.FC = () => {
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [monthly, setMonthly] = useState<MonthlyRevenue[]>([]);
  const [debtors, setDebtors] = useState<Debtor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      financialService.getSummary(),
      financialService.getMonthlyRevenue(),
      financialService.getDebtors(),
    ])
      .then(([s, m, d]) => {
        setSummary(s);
        setMonthly(m);
        setDebtors(d);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const handleWhatsAppCharge = (debtor: Debtor) => {
    const message = `Olá ${debtor.name}! Segue a cobrança referente a ${debtor.pendingCount} sessão(ões) pendente(s). Valor total: R$ ${debtor.totalDebt.toFixed(2)}. Por favor, efetue o pagamento. Obrigado!`;
    const phone = debtor.phone.replace(/\D/g, "");
    const whatsappUrl = `https://wa.me/55${phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handlePrintReport = () => {
    if (!summary) return;
    const now = new Date();
    const monthLabel = now.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
    const totalYearly = monthly.reduce((s, m) => s + m.value, 0);

    const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Relatório Financeiro</title>
  <style>
    body{font-family:Arial,sans-serif;margin:40px;color:#333}
    .header{text-align:center;margin-bottom:40px;border-bottom:2px solid #333;padding-bottom:20px}
    .metrics{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:40px}
    .metric-box{border:1px solid #ddd;padding:15px;border-radius:5px;background:#f9f9f9}
    .metric-box h3{margin:0 0 8px 0;font-size:13px;color:#333}
    .metric-box .value{font-size:22px;font-weight:bold;color:#22c55e}
    table{width:100%;border-collapse:collapse;margin-top:10px}
    th{background:#f0f0f0;padding:10px;text-align:left;border:1px solid #ddd;font-size:13px}
    td{padding:10px;border:1px solid #ddd;font-size:13px}
    h2{font-size:16px;border-bottom:1px solid #ddd;padding-bottom:8px;margin:30px 0 12px}
    .footer{margin-top:40px;text-align:center;font-size:11px;color:#999;border-top:1px solid #ddd;padding-top:14px}
    @media print{body{margin:20px}}
  </style>
</head>
<body>
<div class="header"><h1>Relatório Financeiro</h1><p>${monthLabel}</p><p>Gerado em: ${now.toLocaleDateString("pt-BR")}</p></div>
<div class="metrics">
  <div class="metric-box"><h3>Pacientes Ativos</h3><div class="value">${summary.activePatientsThisMonth}</div></div>
  <div class="metric-box"><h3>Receita do Mês</h3><div class="value">R$ ${summary.currentMonthRevenue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</div></div>
  <div class="metric-box"><h3>Sessões Pagas</h3><div class="value">${summary.paidCount}</div></div>
  <div class="metric-box"><h3>Taxa de Conversão</h3><div class="value">${summary.conversionRate}%</div></div>
</div>
<h2>Receita por Mês (${now.getFullYear()})</h2>
<table>
  <thead><tr><th>Mês</th><th style="text-align:right">Receita</th></tr></thead>
  <tbody>
    ${monthly.map((m) => `<tr><td>${m.month}</td><td style="text-align:right">R$ ${m.value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td></tr>`).join("")}
    <tr style="font-weight:bold;background:#f0f0f0"><td>Total</td><td style="text-align:right">R$ ${totalYearly.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td></tr>
  </tbody>
</table>
${
  debtors.length > 0
    ? `<h2>Pacientes com Débitos</h2>
<table>
  <thead><tr><th>Paciente</th><th>Sessões Pendentes</th><th style="text-align:right">Débito</th></tr></thead>
  <tbody>
    ${debtors.map((d) => `<tr><td>${d.name}</td><td>${d.pendingCount}</td><td style="text-align:right">R$ ${d.totalDebt.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td></tr>`).join("")}
    <tr style="font-weight:bold;background:#f0f0f0"><td colspan="2">Total em Débito</td><td style="text-align:right">R$ ${debtors.reduce((s, d) => s + d.totalDebt, 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td></tr>
  </tbody>
</table>`
    : ""
}
<div class="footer">Relatório gerado automaticamente pelo sistema Mindro</div>
</body></html>`;

    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    document.body.appendChild(iframe);
    if (iframe.contentDocument) {
      iframe.contentDocument.open();
      iframe.contentDocument.write(html);
      iframe.contentDocument.close();
      iframe.onload = () => setTimeout(() => iframe.contentWindow?.print(), 250);
    }
    setTimeout(() => document.body.removeChild(iframe), 5000);
  };

  const fmtCurrency = (v: number) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Financeiro</h1>
          <Button variant="outline" onClick={handlePrintReport} disabled={isLoading || !summary}>
            <Calendar className="h-4 w-4 mr-2" />
            Relatório Mensal
          </Button>
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pacientes Ativos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{summary?.activePatientsThisMonth ?? 0}</div>
                  <p className="text-xs text-muted-foreground">Com sessões este mês</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sessões Realizadas</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold">
                    {(summary?.paidCount ?? 0) + (summary?.pendingCount ?? 0)}
                  </div>
                  <p className="text-xs text-green-500">
                    {summary?.paidCount ?? 0} pagas, {summary?.pendingCount ?? 0} pendentes
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{summary?.conversionRate ?? 0}%</div>
                  <p className="text-xs text-muted-foreground">
                    {summary?.paidCount ?? 0} pagaram,{" "}
                    {summary?.pendingCount ?? 0} não pagaram
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita do Mês</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <>
                  <div className="text-2xl font-bold text-green-600">
                    {fmtCurrency(summary?.currentMonthRevenue ?? 0)}
                  </div>
                  {summary && summary.revenueChangePercent !== 0 && (
                    <p
                      className={`text-xs flex items-center ${
                        summary.revenueChangePercent > 0 ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {summary.revenueChangePercent > 0 ? "+" : ""}
                      {summary.revenueChangePercent}% vs mês passado
                    </p>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Receita por Mês ({new Date().getFullYear()})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                {isLoading ? (
                  <Skeleton className="h-full w-full" />
                ) : monthly.some((m) => m.value > 0) ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthly}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} />
                      <Tooltip
                        formatter={(value: number) => [fmtCurrency(value), "Receita"]}
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#8884d8"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                    Nenhum pagamento registrado este ano
                  </div>
                )}
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
              {isLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full rounded-lg" />
                  ))}
                </div>
              ) : debtors.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  Nenhum paciente com débitos pendentes
                </div>
              ) : (
                <div className="space-y-3">
                  {debtors.map((debtor) => (
                    <div
                      key={debtor.patientId}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{debtor.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {debtor.pendingCount} sessão(ões) pendente(s)
                          {debtor.lastPaymentDate && (
                            <> · Último pgto: {new Date(debtor.lastPaymentDate).toLocaleDateString("pt-BR")}</>
                          )}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="destructive">{fmtCurrency(debtor.totalDebt)}</Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleWhatsAppCharge(debtor)}
                        >
                          <MessageSquare className="h-3 w-3 mr-1" />
                          Cobrar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FinancialPage;
