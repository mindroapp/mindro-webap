import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { usePatientStore, ScheduleEvent } from "@/stores/patientStore";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Form,
  FormControl,
  FormDescription,
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
import { format, addMinutes } from "date-fns";
import { CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

interface ScheduleEventFormProps {
  eventToEdit?: ScheduleEvent;
  initialDate?: Date;
  onCancel: () => void;
  onSuccess: () => void;
}

// Schema para validação do formulário
const scheduleSchema = z.object({
  patientId: z.string({ required_error: "Paciente é obrigatório" }),
  date: z.date({ required_error: "Data é obrigatória" }),
  time: z.string({ required_error: "Hora é obrigatória" }),
  duration: z.coerce.number().int().min(15).max(240),
  notes: z.string().optional(),
  status: z.enum(["scheduled", "confirmed", "completed", "cancelled"], {
    required_error: "Status é obrigatório",
  }),
});

type ScheduleFormValues = z.infer<typeof scheduleSchema>;

const ScheduleEventForm: React.FC<ScheduleEventFormProps> = ({ 
  eventToEdit, 
  initialDate,
  onCancel,
  onSuccess
}) => {
  const { patients, addScheduleEvent, updateScheduleEvent, isLoading } = usePatientStore();
  const { toast } = useToast();
  
  // Configuração do formulário com valores padrão
  const form = useForm<ScheduleFormValues>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: eventToEdit 
      ? {
          patientId: eventToEdit.patientId,
          date: new Date(eventToEdit.date),
          time: format(new Date(eventToEdit.date), "HH:mm"),
          duration: eventToEdit.duration,
          notes: eventToEdit.notes || "",
          status: eventToEdit.status,
        }
      : {
          date: initialDate || new Date(),
          time: "09:00",
          duration: 60,
          notes: "",
          status: "scheduled",
        },
  });

  // Mantém o controle dos horários disponíveis
  const timeSlots = Array.from({ length: 24 * 4 }, (_, i) => {
    const hour = Math.floor(i / 4);
    const minute = (i % 4) * 15;
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  });

  const durations = [15, 30, 45, 60, 90, 120];

  async function onSubmit(values: ScheduleFormValues) {
    try {
      // Combina data e hora
      const [hours, minutes] = values.time.split(':').map(Number);
      const dateTime = new Date(values.date);
      dateTime.setHours(hours, minutes, 0, 0);
      
      // Prepara os dados do evento
      const patient = patients.find(p => p.id === values.patientId);
      
      if (!patient) {
        toast({
          title: "Erro",
          description: "Paciente selecionado não encontrado",
          variant: "destructive",
        });
        return;
      }
      
      const eventData = {
        patientId: values.patientId,
        patientName: patient.name,
        date: dateTime.toISOString(),
        duration: values.duration,
        notes: values.notes,
        status: values.status as ScheduleEvent["status"],
      };
      
      if (eventToEdit) {
        await updateScheduleEvent(eventToEdit.id, eventData);
        toast({
          title: "Sucesso",
          description: "Compromisso atualizado com sucesso",
        });
      } else {
        await addScheduleEvent(eventData);
        toast({
          title: "Sucesso",
          description: "Compromisso agendado com sucesso",
        });
      }
      
      onSuccess();
    } catch (error) {
      console.error("Erro ao salvar o compromisso:", error);
      toast({
        title: "Erro",
        description: "Falha ao salvar o compromisso. Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-4">
        <FormField
          control={form.control}
          name="patientId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Paciente</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um paciente" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {patients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Escolha uma data</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hora</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um horário" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        {format(new Date().setHours(parseInt(time.split(':')[0]), parseInt(time.split(':')[1])), "h:mm a")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duração (minutos)</FormLabel>
                <Select 
                  onValueChange={(value) => field.onChange(parseInt(value))} 
                  defaultValue={field.value.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a duração" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {durations.map((duration) => (
                      <SelectItem key={duration} value={duration.toString()}>
                        {duration} minutos
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="scheduled">Agendado</SelectItem>
                    <SelectItem value="confirmed">Confirmado</SelectItem>
                    <SelectItem value="completed">Concluído</SelectItem>
                    <SelectItem value="cancelled">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notas</FormLabel>
              <FormControl>
                <Textarea placeholder="Adicione notas sobre este compromisso" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Salvando..." : eventToEdit ? "Atualizar" : "Agendar"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ScheduleEventForm;