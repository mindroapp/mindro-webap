import React from "react";
import { useForm } from "react-hook-form";
import { Patient } from "@/stores/patientStore";
import { usePatientStore } from "@/stores/patientStore";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MaskedInput } from "@/components/ui/masked-input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

interface PatientEditModalProps {
  patient: Patient;
  isOpen: boolean;
  onClose: () => void;
}

const PatientEditModal: React.FC<PatientEditModalProps> = ({ patient, isOpen, onClose }) => {
  const { updatePatient } = usePatientStore();
  const { toast } = useToast();
  
  const form = useForm<Partial<Patient>>({
    defaultValues: {
      name: patient.name,
      email: patient.email,
      phone: patient.phone,
      birthdate: patient.birthdate
    }
  });
  
  const onSubmit = async (data: Partial<Patient>) => {
    try {
      await updatePatient(patient.id, data);
      toast({
        title: "Paciente atualizado",
        description: "As informações do paciente foram atualizadas com sucesso."
      });
      onClose();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao atualizar as informações do paciente.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Informações do Paciente</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Completo</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <MaskedInput
                      mask="(99) 9 9999-9999"
                      placeholder="(85) 9 9999-9999"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="birthdate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de Nascimento</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} value={field.value?.split('T')[0]} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="mt-6">
              <Button variant="outline" type="button" onClick={onClose}>Cancelar</Button>
              <Button type="submit">Salvar Alterações</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default PatientEditModal;