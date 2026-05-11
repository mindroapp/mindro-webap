
import React from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Save } from "lucide-react";
import { usePatientStore } from "@/stores/patientStore";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { MaskedInput } from '@/components/ui/masked-input';

const patientFormSchema = z.object({
  name: z.string()
    .nonempty({ message: "O nome é obrigatório" })
    .regex(/^[A-Za-zÀ-ÿ\s]+$/, { message: "O nome deve conter apenas letras" }),
  email: z.string().email({ message: "Por favor, insira um endereço de e-mail válido" }),
  phone: z.string()
    .min(11, { message: "O telefone deve ter no mínimo 11 caracteres" }),
  birthdate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Por favor, insira uma data válida",
  }),
});

type PatientFormValues = z.infer<typeof patientFormSchema>;

interface PatientFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const PatientFormModal: React.FC<PatientFormModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { addPatient, isLoading } = usePatientStore();
  const { toast } = useToast();
  
  const form = useForm<PatientFormValues>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      birthdate: "",
    },
  });

  const onSubmit = async (data: PatientFormValues) => {
    try {
      await addPatient({ 
        name: data.name, 
        email: data.email, 
        phone: data.phone, 
        birthdate: data.birthdate 
      });
      
      toast({
        title: "Paciente adicionado",
        description: "O paciente foi adicionado com sucesso",
      });
      
      form.reset();
      onClose();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Erro ao adicionar paciente:", error);
      toast({
        title: "Erro",
        description: "Falha ao adicionar paciente. Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Paciente</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Completo</FormLabel>
                    <FormControl>
                      <Input placeholder="João Silva" {...field} />
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
                      <Input type="email" placeholder="joao.silva@exemplo.com" {...field} />
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
                        placeholder="(85) 9 9285-0222"
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
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
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <span className="animate-spin mr-2">⌛</span> Salvando...
                  </>
                ) : (
                  <>
                    <Save size={16} className="mr-2" /> Salvar Paciente
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default PatientFormModal;
