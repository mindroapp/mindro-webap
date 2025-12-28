import React from "react";
import { useForm } from "react-hook-form";
import { Session } from "@/stores/patientStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface SessionFormProps {
  initialValues?: Partial<Session>;
  onSubmit: (data: Partial<Session>) => void;
  onCancel: () => void;
  isEdit?: boolean;
  loading?: boolean;
}

const moodEmojis = ["😞", "😕", "😐", "🙂", "😊"];

const SessionForm: React.FC<SessionFormProps> = ({
  initialValues = {},
  onSubmit,
  onCancel,
  isEdit = false,
  loading = false,
}) => {
  const form = useForm<Partial<Session> & { sessionValue?: number }>({
    defaultValues: {
      mood: initialValues.mood ?? 3,
      notes: initialValues.notes ?? "",
      objectives: initialValues.objectives ?? "",
      interventions: initialValues.interventions ?? "",
      nextSteps: initialValues.nextSteps ?? "",
      date: initialValues.date ?? "",
      clinicalNotes: initialValues.clinicalNotes ?? "",
      diagnosis: initialValues.diagnosis ?? "",
      approach: initialValues.approach ?? undefined,
      medications: initialValues.medications ?? "",
      treatmentProgress: initialValues.treatmentProgress ?? "",
      privateNotes: initialValues.privateNotes ?? "",
      evolution: initialValues.evolution ?? "",
      sessionValue: initialValues.sessionValue ?? 0,
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    onSubmit(data);
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="mb-4 w-full grid grid-cols-2">
          <TabsTrigger value="basic" className="text-xs sm:text-sm">Informações Básicas</TabsTrigger>
          <TabsTrigger value="clinical" className="text-xs sm:text-sm">Clínico</TabsTrigger>
        </TabsList>
        <TabsContent value="basic" className="space-y-3 sm:space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="text-sm">Data da Sessão</Label>
              <Input
                id="date"
                type="datetime-local"
                {...form.register("date")}
                required={!isEdit}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sessionValue" className="text-sm">Valor da Sessão (R$)</Label>
              <Input
                id="sessionValue"
                type="number"
                step="0.01"
                min="0"
                {...form.register("sessionValue", { valueAsNumber: true })}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Humor</Label>
              <div className="flex gap-1 sm:gap-2 items-center flex-wrap">
                {[1, 2, 3, 4, 5].map((value) => (
                  <Button
                    key={value}
                    type="button"
                    variant={form.watch("mood") === value ? "default" : "outline"}
                    className="text-lg sm:text-2xl h-9 w-9 sm:h-10 sm:w-10 p-0"
                    onClick={() => form.setValue("mood", value)}
                  >
                    {moodEmojis[value - 1]}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-sm">Notas da Sessão</Label>
            <Textarea {...form.register("notes")} rows={3} className="text-sm" />
          </div>
          <div className="space-y-2">
            <Label className="text-sm">Objetivos</Label>
            <Textarea {...form.register("objectives")} rows={2} className="text-sm" />
          </div>
          <div className="space-y-2">
            <Label className="text-sm">Intervenções</Label>
            <Textarea {...form.register("interventions")} rows={2} className="text-sm" />
          </div>
          <div className="space-y-2">
            <Label className="text-sm">Próximos Passos</Label>
            <Textarea {...form.register("nextSteps")} rows={2} className="text-sm" />
          </div>
        </TabsContent>
        <TabsContent value="clinical" className="space-y-3 sm:space-y-4">
          <div className="space-y-2">
            <Label className="text-sm">Diagnóstico</Label>
            <Input {...form.register("diagnosis")} className="text-sm" />
          </div>
          <div className="space-y-2">
            <Label className="text-sm">Anotações Clínicas</Label>
            <Textarea {...form.register("clinicalNotes")} rows={2} className="text-sm" />
          </div>
          <div className="space-y-2">
            <Label className="text-sm">Abordagem</Label>
            <Select 
              value={form.watch("approach") || ""} 
              onValueChange={(value) => form.setValue("approach", value as Session["approach"])}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cognitive">TCC</SelectItem>
                <SelectItem value="psychoanalysis">Psicanálise</SelectItem>
                <SelectItem value="behavioral">Comportamental</SelectItem>
                <SelectItem value="humanistic">Humanista</SelectItem>
                <SelectItem value="other">Outra</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-sm">Medicações</Label>
            <Input {...form.register("medications")} className="text-sm" />
          </div>
          <div className="space-y-2">
            <Label className="text-sm">Progresso do Tratamento</Label>
            <Textarea {...form.register("treatmentProgress")} rows={2} className="text-sm" />
          </div>
          <div className="space-y-2">
            <Label className="text-sm">Notas Privadas</Label>
            <Textarea {...form.register("privateNotes")} rows={2} className="text-sm" />
          </div>
          <div className="space-y-2">
            <Label className="text-sm">Evolução</Label>
            <Textarea {...form.register("evolution")} rows={2} className="text-sm" />
          </div>
        </TabsContent>
      </Tabs>
      <div className="flex flex-col sm:flex-row justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading} className="w-full sm:w-auto">
          Cancelar
        </Button>
        <Button type="submit" disabled={loading} className="w-full sm:w-auto">
          {isEdit ? "Salvar Alterações" : "Salvar"}
        </Button>
      </div>
    </form>
  );
};

export default SessionForm;
