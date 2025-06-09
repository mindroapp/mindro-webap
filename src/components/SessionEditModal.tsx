
import React from "react";
import { useForm } from "react-hook-form";
import { Session } from "@/stores/patientStore";
import { usePatientStore } from "@/stores/patientStore";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

interface SessionEditModalProps {
  patientId: string;
  session: Session;
  isOpen: boolean;
  onClose: () => void;
}

const SessionEditModal: React.FC<SessionEditModalProps> = ({ patientId, session, isOpen, onClose }) => {
  const { updateSession } = usePatientStore();
  const { toast } = useToast();
  
  const form = useForm<Session>({
    defaultValues: {
      id: session.id,
      date: session.date,
      notes: session.notes,
      mood: session.mood,
      objectives: session.objectives,
      interventions: session.interventions,
      nextSteps: session.nextSteps
    }
  });
  
  const onSubmit = async (data: Session) => {
    try {
      await updateSession(patientId, session.id, data);
      toast({
        title: "Sessão atualizada",
        description: "As notas da sessão foram atualizadas com sucesso."
      });
      onClose();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao atualizar as notas da sessão.",
        variant: "destructive"
      });
    }
  };

  const getMoodEmoji = (mood: number) => {
    const emojis = ["😞", "😕", "😐", "🙂", "😊"];
    return emojis[mood - 1] || "😐";
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Editar Notas da Sessão</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs defaultValue="basic">
              <TabsList className="mb-4">
                <TabsTrigger value="basic">Informações Básicas</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-4">
                <FormField
                  control={form.control}
                  name="mood"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Humor</FormLabel>
                      <FormControl>
                        <div className="flex gap-3 items-center">
                          {[1, 2, 3, 4, 5].map((value) => (
                            <Button
                              key={value}
                              type="button"
                              variant={field.value === value ? "default" : "outline"}
                              className="text-2xl h-12 w-12"
                              onClick={() => field.onChange(value)}
                            >
                              {getMoodEmoji(value)}
                            </Button>
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notas da Sessão</FormLabel>
                      <FormControl>
                        <Textarea className="min-h-[100px]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="objectives"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Objetivos</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="interventions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Intervenções</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="nextSteps"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Próximos Passos</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>
            
            <DialogFooter>
              <Button variant="outline" type="button" onClick={onClose}>Cancelar</Button>
              <Button type="submit">Salvar Alterações</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default SessionEditModal;
