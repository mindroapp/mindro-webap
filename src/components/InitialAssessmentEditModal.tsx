import React from "react";
import { useForm } from "react-hook-form";
import { InitialRecord } from "@/stores/patientStore";
import { usePatientStore } from "@/stores/patientStore";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

interface InitialAssessmentEditModalProps {
  patientId: string;
  initialRecord: InitialRecord;
  isOpen: boolean;
  onClose: () => void;
}

const InitialAssessmentEditModal: React.FC<InitialAssessmentEditModalProps> = ({
  patientId,
  initialRecord,
  isOpen,
  onClose
}) => {
  const { updatePatient } = usePatientStore();
  const { toast } = useToast();
  
  const form = useForm<InitialRecord>({
    defaultValues: initialRecord
  });
  
  const onSubmit = async (data: InitialRecord) => {
    try {
      await updatePatient(patientId, { initialRecord: data });
      toast({
        title: "Avaliação atualizada",
        description: "A avaliação inicial foi atualizada com sucesso."
      });
      onClose();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao atualizar a avaliação inicial.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Avaliação Inicial</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="reasonForConsultation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Motivo da Consulta</FormLabel>
                  <FormControl>
                    <Textarea className="min-h-[100px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="familyHistory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Histórico Familiar</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="medicalHistory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Histórico Médico</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="previousTreatment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tratamento Anterior</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="mentalStatusExam"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Exame do Estado Mental</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="initialDiagnosis"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Diagnóstico Inicial</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="treatmentPlan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plano de Tratamento</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
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

export default InitialAssessmentEditModal;