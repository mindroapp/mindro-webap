
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { useToast } from "@/components/ui/use-toast";
import { DatePickerWithRange } from "@/components/DatePickerWithRange";
import { addDays, format, differenceInDays, isWithinInterval, parseISO } from "date-fns";
import { usePatientStore } from "@/stores/patientStore";
import { ptBR } from "date-fns/locale";
import { Download } from "lucide-react";
import { DateRange } from "react-day-picker";

// Define the structure of schedule events
interface ScheduleEvent {
  id: string;
  patientId: string;
  start: string;
  end: string;
  title: string;
  type?: string;
  status?: string;
  duration?: number;
}

// Calculate patient retention (returning patients)
const calculateRetention = (scheduleEvents: ScheduleEvent[], dateRange: { from: Date; to: Date }) => {
  if (!scheduleEvents || scheduleEvents.length === 0) {
    return { 
      totalPatients: 0,
      returningPatients: 0,
      retentionRate: 0,
      retentionData: [] 
    };
  }

  const { from, to } = dateRange;
  
  // Filter events within the date range
  const filteredEvents = scheduleEvents.filter(event => {
    if (!event.start) return false;
    const eventDate = parseISO(event.start);
    return isWithinInterval(eventDate, { start: from, end: to });
  });

  // Count unique patients
  const patientVisits: Record<string, number> = {};
  
  filteredEvents.forEach(event => {
    if (!event.patientId) return;
    
    if (!patientVisits[event.patientId]) {
      patientVisits[event.patientId] = 0;
    }
    patientVisits[event.patientId]++;
  });

  const totalPatients = Object.keys(patientVisits).length;
  const returningPatients = Object.values(patientVisits).filter(count => 
    typeof count === 'number' && count > 1
  ).length;
  const retentionRate = totalPatients > 0 ? (returningPatients / totalPatients) * 100 : 0;

  // Prepare data for visualization
  const retentionData = [
    { name: "Uma Sessão", value: totalPatients - returningPatients },
    { name: "Múltiplas Sessões", value: returningPatients }
  ];

  return { 
    totalPatients, 
    returningPatients, 
    retentionRate: Math.round(retentionRate), 
    retentionData 
  };
};

// Calculate average time between sessions
const calculateAverageTimeBetweenSessions = (scheduleEvents: ScheduleEvent[], dateRange: { from: Date; to: Date }) => {
  if (!scheduleEvents || scheduleEvents.length === 0) {
    return { 
      averageDays: 0,
      intervalData: [] 
    };
  }

  const { from, to } = dateRange;
  
  // Filter events within the date range
  const filteredEvents = scheduleEvents.filter(event => {
    if (!event.start) return false;
    const eventDate = parseISO(event.start);
    return isWithinInterval(eventDate, { start: from, end: to });
  });

  // Group sessions by patient
  const sessionsByPatient: Record<string, Date[]> = {};
  
  filteredEvents.forEach(event => {
    if (!event.patientId || !event.start) return;
    
    if (!sessionsByPatient[event.patientId]) {
      sessionsByPatient[event.patientId] = [];
    }
    
    sessionsByPatient[event.patientId].push(parseISO(event.start));
  });
  
  // Calculate intervals for patients with multiple sessions
  let totalIntervals = 0;
  let intervalCount = 0;
  const sessionIntervals: number[] = [];
  
  Object.values(sessionsByPatient).forEach(dates => {
    if (!Array.isArray(dates) || dates.length < 2) return;
    
    // Sort dates
    dates.sort((a, b) => a.getTime() - b.getTime());
    
    // Calculate intervals
    for (let i = 1; i < dates.length; i++) {
      const interval = differenceInDays(dates[i], dates[i-1]);
      if (interval > 0) {
        totalIntervals += interval;
        intervalCount++;
        sessionIntervals.push(interval);
      }
    }
  });
  
  const averageDays = intervalCount > 0 ? Math.round(totalIntervals / intervalCount) : 0;
  
  // Prepare data for interval distribution chart
  const intervalDistribution: Record<string, number> = {};
  sessionIntervals.forEach(interval => {
    const bucket = interval <= 7 ? '0-7 dias' : 
                  interval <= 14 ? '8-14 dias' : 
                  interval <= 21 ? '15-21 dias' : 
                  interval <= 28 ? '22-28 dias' : '29+ dias';
    
    if (!intervalDistribution[bucket]) {
      intervalDistribution[bucket] = 0;
    }
    intervalDistribution[bucket]++;
  });
  
  const intervalData = Object.entries(intervalDistribution).map(([range, count]) => ({
    name: range,
    value: count
  }));
  
  return { 
    averageDays, 
    intervalData 
  };
};

const ReportsDashboard = () => {
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState<{
    from: Date;
    to: Date;
  }>({
    from: addDays(new Date(), -30),
    to: new Date(),
  });
  
  const { scheduleEvents } = usePatientStore();
  const typedScheduleEvents = scheduleEvents as unknown as ScheduleEvent[];
  
  // Calculate metrics
  const sessionsByPeriod = typedScheduleEvents?.filter(event => {
    if (!event.start) return false;
    const eventDate = parseISO(event.start);
    return isWithinInterval(eventDate, { start: dateRange.from, end: dateRange.to });
  })?.length || 0;
  
  const retention = calculateRetention(typedScheduleEvents || [], dateRange);
  const averageTime = calculateAverageTimeBetweenSessions(typedScheduleEvents || [], dateRange);

  // Use our new Indigo color for the charts
  const COLORS = ['#4F46E5', '#818CF8', '#C7D2FE', '#EEF2FF', '#6366F1'];

  const exportToCSV = () => {
    const filteredEvents = typedScheduleEvents?.filter(event => {
      if (!event.start) return false;
      const eventDate = parseISO(event.start);
      return isWithinInterval(eventDate, { start: dateRange.from, end: dateRange.to });
    }) || [];

    if (filteredEvents.length === 0) {
      toast({
        title: "Sem dados para exportar",
        description: "Não há eventos no período selecionado.",
        variant: "destructive",
      });
      return;
    }

    // Prepare CSV data
    const headers = ["Data", "Paciente", "Tipo", "Status", "Duração"];
    const csvRows = [];
    csvRows.push(headers.join(","));

    filteredEvents.forEach(event => {
      if (!event.start) return;
      const row = [
        format(parseISO(event.start), "dd/MM/yyyy HH:mm"),
        event.title || "N/A",
        event.type || "N/A",
        event.status || "N/A",
        event.duration ? `${event.duration} min` : "N/A"
      ];
      csvRows.push(row.join(","));
    });

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `relatorio_sessoes_${format(dateRange.from, "dd-MM-yyyy")}_a_${format(dateRange.to, "dd-MM-yyyy")}.csv`);
    link.style.visibility = "hidden";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handler for date range changes
  const handleDateRangeChange = (range: DateRange | undefined) => {
    if (range?.from) {
      setDateRange({
        from: range.from,
        to: range.to || range.from,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-primary">Relatórios e Indicadores</h2>
        <div className="flex items-center gap-2">
          <DatePickerWithRange
            dateRange={dateRange}
            onDateRangeChange={handleDateRangeChange}
          />
          <Button onClick={exportToCSV} size="icon" variant="outline">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total de Sessões</CardTitle>
            <CardDescription>No período selecionado</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{sessionsByPeriod}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Taxa de Retorno</CardTitle>
            <CardDescription>Pacientes com múltiplas sessões</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{retention.retentionRate}%</div>
            <div className="text-sm text-muted-foreground mt-1">
              {retention.returningPatients} de {retention.totalPatients} pacientes
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Tempo Médio Entre Sessões</CardTitle>
            <CardDescription>Dias entre consultas do mesmo paciente</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{averageTime.averageDays} dias</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Fidelização de Pacientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={retention.retentionData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#4F46E5"
                    dataKey="value"
                  >
                    {retention.retentionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Intervalo Entre Sessões</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={averageTime.intervalData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                  <YAxis />
                  <RechartsTooltip />
                  <Bar dataKey="value" name="Número de Intervalos" fill="#4F46E5" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportsDashboard;
