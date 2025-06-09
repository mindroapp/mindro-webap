
import React from "react";
import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import MarketingLayout from "@/components/layouts/MarketingLayout";

const formSchema = z.object({
  name: z.string().min(3, { message: "O nome deve ter pelo menos 3 caracteres." }),
  email: z.string().email({ message: "Email inválido." }),
  subject: z.string().min(1, { message: "Selecione um assunto." }),
  message: z.string().min(10, { message: "A mensagem deve ter pelo menos 10 caracteres." })
});

const ContactPage: React.FC = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: ""
    }
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Mensagem enviada com sucesso!",
        description: "Entraremos em contato em breve."
      });
      
      form.reset();
    }, 1000);
  };

  return (
    <MarketingLayout>
      <div className="container mx-auto py-12 px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-indigo-700">Entre em Contato</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Estamos aqui para ajudar profissionais de saúde mental a otimizarem suas práticas.
            Fale conosco e descubra como podemos apoiar seu trabalho.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Envie uma mensagem</h2>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome completo</FormLabel>
                      <FormControl>
                        <Input placeholder="Seu nome" {...field} />
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
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="seu@email.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assunto</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o assunto" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="sales">Informações sobre planos</SelectItem>
                          <SelectItem value="support">Suporte técnico</SelectItem>
                          <SelectItem value="partnership">Parcerias</SelectItem>
                          <SelectItem value="feedback">Feedback</SelectItem>
                          <SelectItem value="other">Outro assunto</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mensagem</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Digite sua mensagem aqui..." 
                          className="min-h-[150px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full bg-indigo-700 hover:bg-indigo-800"
                >
                  Enviar mensagem
                </Button>
              </form>
            </Form>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Informações de contato</h2>
            
            <div className="bg-indigo-50 p-6 rounded-xl mb-8">
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-indigo-100 p-3 rounded-full mr-4">
                    <Mail className="h-6 w-6 text-indigo-700" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Email</h3>
                    <p className="text-gray-600">contato@mindro.com.br</p>
                    <p className="text-gray-600">suporte@mindro.com.br</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-indigo-100 p-3 rounded-full mr-4">
                    <Phone className="h-6 w-6 text-indigo-700" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Telefone</h3>
                    <p className="text-gray-600">(11) 3456-7890</p>
                    <p className="text-gray-600">0800 123 4567</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-indigo-100 p-3 rounded-full mr-4">
                    <MapPin className="h-6 w-6 text-indigo-700" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Endereço</h3>
                    <p className="text-gray-600">Av. Paulista, 1000 - Bela Vista</p>
                    <p className="text-gray-600">São Paulo - SP, 01310-100</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-indigo-100 p-3 rounded-full mr-4">
                    <Clock className="h-6 w-6 text-indigo-700" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Horário de atendimento</h3>
                    <p className="text-gray-600">Segunda a Sexta: 9h às 18h</p>
                    <p className="text-gray-600">Sábados: 9h às 13h</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Perguntas frequentes</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-indigo-700">Como posso começar a usar a plataforma?</h4>
                  <p className="text-gray-600">Você pode se registrar gratuitamente e explorar nosso plano básico, ou agendar uma demonstração com nossa equipe.</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-indigo-700">Oferecem suporte técnico 24/7?</h4>
                  <p className="text-gray-600">Nosso suporte está disponível em horário comercial. Clientes dos planos Premium e Enterprise têm acesso a suporte estendido.</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-indigo-700">É possível migrar meus dados de outro sistema?</h4>
                  <p className="text-gray-600">Sim, oferecemos migração assistida para os planos Professional e Enterprise. Entre em contato para mais detalhes.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MarketingLayout>
  );
};

export default ContactPage;
