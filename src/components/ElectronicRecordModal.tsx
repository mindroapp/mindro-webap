
import React from "react";
import { useForm } from "react-hook-form";
import { Session } from "@/stores/patientStore";
import { usePatientStore } from "@/stores/patientStore";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Form, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

interface ElectronicRecordModalProps {
  patientId: string;
  session: Session;
  isOpen: boolean;
  onClose: () => void;
}

const ElectronicRecordModal: React.FC<ElectronicRecordModalProps> = ({ 
  patientId, 
  session, 
  isOpen, 
  onClose 
}) => {
  const { updateSession } = usePatientStore();
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = React.useState("clinical");
  const [loading, setLoading] = React.useState(false);
  
  const form = useForm<Session>({
    defaultValues: {
      id: session.id,
      date: session.date,
      notes: session.notes,
      mood: session.mood,
      objectives: session.objectives,
      interventions: session.interventions,
      nextSteps: session.nextSteps,
      clinicalNotes: session.clinicalNotes || "",
      diagnosis: session.diagnosis || "",
      approach: session.approach || "cognitive",
      medications: session.medications || "",
      treatmentProgress: session.treatmentProgress || "",
      privateNotes: session.privateNotes || "",
      evolution: session.evolution || ""
    }
  });
  
  const onSubmit = async (data: Session) => {
    setLoading(true);
    try {
      await updateSession(patientId, session.id, data);
      toast({
        title: "Prontuário atualizado",
        description: "As informações clínicas foram atualizadas com sucesso."
      });
      onClose();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao atualizar o prontuário eletrônico.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const formattedDate = new Date(session.date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Prontuário Eletrônico - Sessão de {formattedDate}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs 
              defaultValue="clinical" 
              value={selectedTab} 
              onValueChange={setSelectedTab}
              className="w-full"
            >
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="clinical">Dados Clínicos</TabsTrigger>
                <TabsTrigger value="evolution">Evolução</TabsTrigger>
                <TabsTrigger value="private">Notas Privadas</TabsTrigger>
              </TabsList>
              
              <TabsContent value="clinical" className="space-y-4">
                <FormField
                  control={form.control}
                  name="approach"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Abordagem Terapêutica</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma abordagem" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="cognitive">Terapia Cognitivo-Comportamental</SelectItem>
                          <SelectItem value="psychoanalysis">Psicanálise</SelectItem>
                          <SelectItem value="behavioral">Comportamental</SelectItem>
                          <SelectItem value="humanistic">Humanista</SelectItem>
                          <SelectItem value="other">Outra</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="diagnosis"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Diagnóstico</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormDescription>
                        Inclua código CID se aplicável
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="clinicalNotes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Anotações Clínicas</FormLabel>
                      <FormControl>
                        <Textarea className="min-h-[100px]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="medications"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Medicações</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormDescription>
                        Liste medicações em uso, dosagens e prescritor
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
              
              <TabsContent value="evolution" className="space-y-4">
                <FormField
                  control={form.control}
                  name="evolution"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Evolução do Paciente</FormLabel>
                      <FormControl>
                        <Textarea className="min-h-[150px]" {...field} />
                      </FormControl>
                      <FormDescription>
                        Descreva a evolução do paciente em relação às sessões anteriores, 
                        incluindo avaliações métricas se aplicável.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="treatmentProgress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Progresso do Tratamento</FormLabel>
                      <FormControl>
                        <Textarea className="min-h-[150px]" {...field} />
                      </FormControl>
                      <FormDescription>
                        Indique a fase atual do tratamento e próximos objetivos terapêuticos.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
              
              <TabsContent value="private" className="space-y-4">
                <FormField
                  control={form.control}
                  name="privateNotes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notas Privadas</FormLabel>
                      <FormControl>
                        <Textarea className="min-h-[250px]" {...field} />
                      </FormControl>
                      <FormDescription>
                        Estas anotações são privadas e não serão compartilhadas com o paciente 
                        ou outros profissionais.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>
            
            <DialogFooter>
              <Button variant="outline" type="button" onClick={onClose} disabled={loading}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Skeleton className="h-4 w-4 rounded-full animate-spin mr-2" />
                    Salvando...
                  </>
                ) : (
                  "Salvar Prontuário"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ElectronicRecordModal;
