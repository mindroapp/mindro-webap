
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface SupportRequestFormProps {
  clientId?: string;
  clientName?: string;
  triggerButton?: React.ReactNode;
}

interface FormValues {
  subject: string;
  description: string;
  priority: string;
}

const SupportRequestForm: React.FC<SupportRequestFormProps> = ({
  clientId,
  clientName,
  triggerButton,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    defaultValues: {
      subject: "",
      description: "",
      priority: "Média",
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      // Aqui seria feita a integração com uma API real
      console.log("Enviando solicitação de suporte:", {
        ...data,
        clientId,
        clientName,
      });
      
      // Simula o envio bem-sucedido
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Solicitação enviada",
        description: "Sua solicitação de suporte foi enviada com sucesso. Responderemos em breve.",
      });
      
      form.reset();
      setIsOpen(false);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Houve um problema ao enviar sua solicitação. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button variant="outline">Solicitar Suporte</Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nova Solicitação de Suporte</DialogTitle>
          <DialogDescription>
            Descreva seu problema ou dúvida e nossa equipe responderá o mais breve possível.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="subject"
              rules={{ required: "O assunto é obrigatório" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assunto</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Ex: Problema com agendamento" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              rules={{ 
                required: "A descrição é obrigatória",
                minLength: {
                  value: 20,
                  message: "Por favor, forneça uma descrição mais detalhada (mínimo 20 caracteres)"
                }
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descreva seu problema ou dúvida em detalhes..." 
                      rows={5}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prioridade</FormLabel>
                  <FormControl>
                    <select
                      className="w-full border rounded-md p-2"
                      {...field}
                    >
                      <option value="Baixa">Baixa</option>
                      <option value="Média">Média</option>
                      <option value="Alta">Alta</option>
                      <option value="Crítica">Crítica</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-6">
              <Button variant="outline" type="button" onClick={() => setIsOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">Enviar Solicitação</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default SupportRequestForm;
