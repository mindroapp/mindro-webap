import React from "react";
import { useForm } from "react-hook-form";
import { Session } from "@/stores/patientStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const form = useForm<Partial<Session>>({
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
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    onSubmit(data);
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="basic">
        <TabsList className="mb-4">
          <TabsTrigger value="basic">Informações Básicas</TabsTrigger>
          <TabsTrigger value="clinical">Clínico</TabsTrigger>
        </TabsList>
        <TabsContent value="basic" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Data da Sessão</Label>
              <Input
                id="date"
                type="datetime-local"
                {...form.register("date")}
                required={!isEdit}
              />
            </div>
            <div className="space-y-2">
              <Label>Humor</Label>
              <div className="flex gap-2 items-center">
                {[1, 2, 3, 4, 5].map((value) => (
                  <Button
                    key={value}
                    type="button"
                    variant={form.watch("mood") === value ? "default" : "outline"}
                    className="text-2xl h-10 w-10"
                    onClick={() => form.setValue("mood", value)}
                  >
                    {moodEmojis[value - 1]}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Notas da Sessão</Label>
            <Textarea {...form.register("notes")} rows={3} />
          </div>
          <div className="space-y-2">
            <Label>Objetivos</Label>
            <Textarea {...form.register("objectives")} rows={2} />
          </div>
          <div className="space-y-2">
            <Label>Intervenções</Label>
            <Textarea {...form.register("interventions")} rows={2} />
          </div>
          <div className="space-y-2">
            <Label>Próximos Passos</Label>
            <Textarea {...form.register("nextSteps")} rows={2} />
          </div>
        </TabsContent>
        <TabsContent value="clinical" className="space-y-4">
          <div className="space-y-2">
            <Label>Diagnóstico</Label>
            <Input {...form.register("diagnosis")} />
          </div>
          <div className="space-y-2">
            <Label>Anotações Clínicas</Label>
            <Textarea {...form.register("clinicalNotes")} rows={2} />
          </div>
          <div className="space-y-2">
            <Label>Abordagem</Label>
            <select {...form.register("approach")} className="w-full border rounded px-2 py-1">
              <option value="">Selecione</option>
              <option value="cognitive">TCC</option>
              <option value="psychoanalysis">Psicanálise</option>
              <option value="behavioral">Comportamental</option>
              <option value="humanistic">Humanista</option>
              <option value="other">Outra</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label>Medicações</Label>
            <Input {...form.register("medications")} />
          </div>
          <div className="space-y-2">
            <Label>Progresso do Tratamento</Label>
            <Textarea {...form.register("treatmentProgress")} rows={2} />
          </div>
          <div className="space-y-2">
            <Label>Notas Privadas</Label>
            <Textarea {...form.register("privateNotes")} rows={2} />
          </div>
          <div className="space-y-2">
            <Label>Evolução</Label>
            <Textarea {...form.register("evolution")} rows={2} />
          </div>
        </TabsContent>
      </Tabs>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {isEdit ? "Salvar Alterações" : "Salvar"}
        </Button>
      </div>
    </form>
  );
};

export default SessionForm; 