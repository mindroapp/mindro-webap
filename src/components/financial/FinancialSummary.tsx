
import React, { useState, useEffect } from "react";
import { usePatientStore } from "@/stores/patientStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Area, 
  AreaChart, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis 
} from "recharts";
import { Badge } from "@/components/ui/badge";

const FinancialSummary: React.FC = () => {
  const { getMonthlyIncome, getYearlyIncome, payments, getPendingPayments } = usePatientStore();
  const [monthlyTotal, setMonthlyTotal] = useState(0);
  const [yearlyTotal, setYearlyTotal] = useState(0);
  const [pendingAmount, setPendingAmount] = useState(0);
  const [chartData, setChartData] = useState<{ name: string; total: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const monthNames = [
    "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
    "Jul", "Ago", "Set", "Out", "Nov", "Dez"
  ];
  
  const formatCurrency = (value: number): string => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };
  
  useEffect(() => {
    setIsLoading(true);
    
    // Get current month and year
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    
    // Calculate monthly income
    const monthlyIncome = getMonthlyIncome(currentYear, currentMonth);
    setMonthlyTotal(monthlyIncome);
    
    // Calculate yearly income
    const yearlyData = getYearlyIncome(currentYear);
    const yearlySum = Object.values(yearlyData).reduce((sum, value) => sum + value, 0);
    setYearlyTotal(yearlySum);
    
    // Calculate chart data
    const data = Object.entries(yearlyData).map(([month, value]) => ({
      name: monthNames[parseInt(month)],
      total: value
    }));
    setChartData(data);
    
    // Calculate pending payments
    const pendingPayments = getPendingPayments();
    const pendingTotal = pendingPayments.reduce((sum, payment) => sum + payment.amount, 0);
    setPendingAmount(pendingTotal);
    
    setIsLoading(false);
  }, [getMonthlyIncome, getYearlyIncome, getPendingPayments, payments]);
  
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Faturamento Mensal</CardTitle>
            <Badge variant="outline">Este mês</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(monthlyTotal)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Faturamento Anual</CardTitle>
            <Badge variant="outline">Este ano</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(yearlyTotal)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pagamentos Pendentes</CardTitle>
            <Badge variant="outline">Total</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(pendingAmount)}</div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Receita Mensal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{
                  top: 5,
                  right: 10,
                  left: 20,
                  bottom: 5,
                }}
              >
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="name" 
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `R$ ${value}`}
                />
                <Tooltip 
                  formatter={(value: any) => [`${formatCurrency(value)}`, 'Receita']}
                />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="#8884d8"
                  fillOpacity={1}
                  fill="url(#colorTotal)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialSummary;
