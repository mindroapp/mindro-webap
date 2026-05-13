import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import SidebarMenu from "@/components/SidebarMenu";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Save } from "lucide-react";
import { usePatientStore } from "@/stores/patientStore";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { MaskedInput } from '@/components/ui/masked-input';

const patientFormSchema = z.object({
  name: z.string()
    .nonempty({ message: "O nome é obrigatório" })
    .regex(/^[A-Za-zÀ-ÿ\s]+$/, { message: "O nome deve conter apenas letras" }),
  email: z.string().email({ message: "Por favor, insira um endereço de e-mail válido" }).optional().or(z.literal("")).catch(""),
  phone: z.string()
    .min(11, { message: "O telefone deve ter no mínimo 11 caracteres" }),
  birthdate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Por favor, insira uma data válida",
  }),
});

type PatientFormValues = z.infer<typeof patientFormSchema>;

const PatientForm = () => {
  const { addPatient, isLoading } = usePatientStore();
  const navigate = useNavigate();
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
      const newPatient = await addPatient({ 
        name: data.name, 
        email: data.email, 
        phone: data.phone, 
        birthdate: data.birthdate 
      });
      
      toast({
        title: "Paciente adicionado",
        description: "O paciente foi adicionado com sucesso",
      });
      
      navigate(`/patients/${newPatient.id}`);
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
    <div className="min-h-screen bg-gray-50 flex">
      <div className="w-64 hidden md:block">
        <SidebarMenu />
      </div>
      <div className="flex-1">
        <Header />
        <main className="p-6">
          <div className="flex items-center mb-6">
            <Button variant="ghost" size="sm" className="mr-4" onClick={() => navigate("/patients")}>
              <ArrowLeft size={16} className="mr-1" /> Voltar para pacientes
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Adicionar Novo Paciente</h1>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Informações do Paciente</CardTitle>
            </CardHeader>
            <CardContent>
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
                    <Button type="button" variant="outline" onClick={() => navigate("/patients")}>
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
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default PatientForm;