import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, ExternalLink } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import ScheduleCalendarView from "@/components/schedule/ScheduleCalendarView";
import ScheduleAppointmentsView from "@/components/schedule/ScheduleAppointmentsView";

const ScheduleManager: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const copyPublicLink = () => {
    const link = `${window.location.origin}/booking/${user?.email}`;
    navigator.clipboard.writeText(link);
    toast({
      title: "Link copiado",
      description: "Compartilhe com seus pacientes."
    });
  };

  const openPublicLink = () => {
    const link = `${window.location.origin}/booking/${user?.email}`;
    window.open(link, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Link de Agendamento Público */}
      <Card className="border-primary/30">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold">Link de Agendamento Público</h3>
              <p className="text-sm text-muted-foreground">
                Compartilhe este link com seus pacientes para que eles possam agendar consultas
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={copyPublicLink}>
                <Copy className="h-4 w-4 mr-2" />
                Copiar Link
              </Button>
              <Button variant="outline" size="sm" onClick={openPublicLink}>
                <ExternalLink className="h-4 w-4 mr-2" />
                Visualizar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs de Gestão */}
      <Tabs defaultValue="agendas" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="agendas">Agendas</TabsTrigger>
          <TabsTrigger value="agendamentos">Agendamentos</TabsTrigger>
        </TabsList>

        <TabsContent value="agendas" className="mt-6">
          <ScheduleCalendarView />
        </TabsContent>

        <TabsContent value="agendamentos" className="mt-6">
          <ScheduleAppointmentsView />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ScheduleManager;
