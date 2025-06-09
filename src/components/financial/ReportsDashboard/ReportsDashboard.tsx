
import React, { useState } from "react";
import { usePatientStore } from "@/stores/patientStore";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { format, differenceInDays, addMonths, subMonths, startOfMonth, endOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { DateRange } from "react-day-picker";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from "recharts";
import { 
  Download, 
  Calendar as CalendarIcon, 
  FileChartColumn,
  ChartBar,
  ChartPie
} from "lucide-react";
import { cn } from "@/lib/utils";

const ReportsDashboard: React.FC = () => {
  const { patients, scheduleEvents } = usePatientStore();
  const [dateRange, setDateRange] = useState<{
    from: Date;
    to: Date;
  }>({
    from: startOfMonth(subMonths(new Date(), 2)),
    to: endOfMonth(new Date())
  });
  
  // Helper function to count sessions in date range
  const countSessionsInRange = () => {
    return scheduleEvents.filter(session => {
      const sessionDate = new Date(session.date);
      return sessionDate >= dateRange.from && sessionDate <= dateRange.to;
    }).length;
  };
  
  // Helper function to calculate patient retention
  const calculateRetention = () => {
    // Count patients with more than one session
    const patientCounts = scheduleEvents.reduce((acc, session) => {
      acc[session.patientId] = (acc[session.patientId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const totalPatients = patients.length;
    const returningPatients = Object.keys(patientCounts).filter(id => patientCounts[id] > 1).length;
    
    return {
      totalPatients,
      returningPatients,
      retentionRate: totalPatients > 0 ? (returningPatients / totalPatients) * 100 : 0
    };
  };
  
  // Helper function to calculate average days between sessions
  const calculateAverageDaysBetweenSessions = () => {
    const patientSessions: Record<string, Date[]> = {};
    
    // Group sessions by patient
    scheduleEvents.forEach(session => {
      if (!patientSessions[session.patientId]) {
        patientSessions[session.patientId] = [];
      }
      patientSessions[session.patientId].push(new Date(session.date));
    });
    
    // Calculate intervals for each patient
    let totalIntervals = 0;
    let totalDays = 0;
    
    Object.values(patientSessions).forEach(dates => {
      if (dates.length < 2) return;
      
      // Sort dates
      dates.sort((a, b) => a.getTime() - b.getTime());
      
      // Calculate intervals
      for (let i = 1; i < dates.length; i++) {
        const days = differenceInDays(dates[i], dates[i-1]);
        if (days > 0 && days < 90) { // Exclude outliers (>90 days)
          totalDays += days;
          totalIntervals++;
        }
      }
    });
    
    return totalIntervals > 0 ? totalDays / totalIntervals : 0;
  };
  
  // Prepare data for charts
  const prepareMonthlySessions = () => {
    const months: Record<string, number> = {};
    
    // Initialize with 6 months
    for (let i = 5; i >= 0; i--) {
      const month = subMonths(new Date(), i);
      const key = format(month, 'MMM yyyy', { locale: ptBR });
      months[key] = 0;
    }
    
    // Count sessions by month
    scheduleEvents.forEach(session => {
      const date = new Date(session.date);
      const key = format(date, 'MMM yyyy', { locale: ptBR });
      if (months[key] !== undefined) {
        months[key]++;
      }
    });
    
    return Object.entries(months).map(([name, count]) => ({ name, count }));
  };
  
  const prepareRetentionData = () => {
    const { totalPatients, returningPatients } = calculateRetention();
    const oneTimePatients = totalPatients - returningPatients;
    
    return [
      { name: "Recorrentes", value: returningPatients },
      { name: "Não Retornaram", value: oneTimePatients }
    ];
  };
  
  // Colors for pie chart
  const COLORS = ['#9b87f5', '#c4b5fb', '#7E69AB', '#D6BCFA'];
  
  // Download report data as CSV
  const handleDownloadCSV = () => {
    const dateRangeString = `${format(dateRange.from, 'dd/MM/yyyy')}_a_${format(dateRange.to, 'dd/MM/yyyy')}`;
    const retention = calculateRetention();
    
    // Format data as CSV
    const header = 'Indicador,Valor\n';
    const rows = [
      `Total de Sessões,${countSessionsInRange()}`,
      `Total de Pacientes,${retention.totalPatients}`,
      `Pacientes Recorrentes,${retention.returningPatients}`,
      `Taxa de Fidelização,${retention.retentionRate.toFixed(2)}%`,
      `Dias Médios Entre Sessões,${calculateAverageDaysBetweenSessions().toFixed(1)}`
    ].join('\n');
    
    const csvContent = `data:text/csv;charset=utf-8,${header}${rows}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `relatorio_${dateRangeString}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const retention = calculateRetention();
  const sessionCount = countSessionsInRange();
  const avgDaysBetween = calculateAverageDaysBetweenSessions();
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold mb-1">Relatórios e Análises</h2>
          <p className="text-muted-foreground">
            Acompanhe seus indicadores de desempenho e fidelização de pacientes
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto justify-start">
                <CalendarIcon className="mr-2 h-4 w-4" />
                <span>
                  {format(dateRange.from, "dd MMM yy", { locale: ptBR })} - {" "}
                  {format(dateRange.to, "dd MMM yy", { locale: ptBR })}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange.from}
                selected={dateRange}
                onSelect={(range) => {
                  if (range?.from && range?.to) {
                    setDateRange({ from: range.from, to: range.to });
                  }
                }}
                locale={ptBR}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
          
          <Button variant="outline" onClick={handleDownloadCSV}>
            <Download className="mr-2 h-4 w-4" /> Exportar Dados
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Sessões no Período
                </p>
                <p className="text-2xl font-bold">{sessionCount}</p>
              </div>
              <FileChartColumn className="h-8 w-8 text-indigo-700" strokeWidth={1.5} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Taxa de Fidelização
                </p>
                <p className="text-2xl font-bold">
                  {retention.retentionRate.toFixed(1)}%
                </p>
              </div>
              <ChartPie className="h-8 w-8 text-indigo-700" strokeWidth={1.5} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Dias Entre Sessões
                </p>
                <p className="text-2xl font-bold">
                  {avgDaysBetween.toFixed(1)}
                </p>
              </div>
              <ChartBar className="h-8 w-8 text-indigo-700" strokeWidth={1.5} />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="sessions">
        <TabsList>
          <TabsTrigger value="sessions">Sessões</TabsTrigger>
          <TabsTrigger value="retention">Fidelização</TabsTrigger>
          <TabsTrigger value="intervals">Intervalos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sessions" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Sessões por Mês</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={prepareMonthlySessions()}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip 
                      formatter={(value) => [`${value} sessões`, 'Quantidade']}
                      labelFormatter={(label) => `Mês: ${label}`}
                    />
                    <Bar dataKey="count" name="Sessões" fill="#9b87f5" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="retention" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Taxa de Fidelização de Pacientes</h3>
              <div className="h-80 flex flex-col items-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={prepareRetentionData()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {prepareRetentionData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} pacientes`, '']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
                <div className="text-center mt-2">
                  <p className="text-sm text-muted-foreground">
                    {retention.returningPatients} de {retention.totalPatients} pacientes retornaram para mais sessões
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="intervals" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Tempo Médio Entre Sessões</h3>
              <div className="h-80">
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="text-4xl font-bold text-indigo-700">
                    {avgDaysBetween.toFixed(1)} dias
                  </div>
                  <p className="text-muted-foreground mt-2">
                    Média de dias entre cada consulta por paciente
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsDashboard;
