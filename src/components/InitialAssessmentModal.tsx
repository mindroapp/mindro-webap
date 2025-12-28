import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface InitialAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
}

const InitialAssessmentModal: React.FC<InitialAssessmentModalProps> = ({
  isOpen,
  onClose,
  patientId
}) => {
  const [assessmentData, setAssessmentData] = useState({
    reasonForConsultation: "",
    familyHistory: "",
    medicalHistory: "",
    previousTreatment: "",
    mentalStatusExam: "",
    initialDiagnosis: "",
    treatmentPlan: ""
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!assessmentData.reasonForConsultation) {
      toast({
        title: "Campo obrigatório",
        description: "O motivo da consulta é obrigatório.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Avaliação salva",
      description: "A avaliação inicial foi salva com sucesso!"
    });

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Avaliação Inicial</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-2">
              <Label htmlFor="reason" className="text-sm">Motivo da Consulta *</Label>
              <Textarea
                id="reason"
                placeholder="Descreva o motivo principal da consulta..."
                value={assessmentData.reasonForConsultation}
                onChange={(e) => setAssessmentData({ ...assessmentData, reasonForConsultation: e.target.value })}
                rows={3}
                required
                className="text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="family" className="text-sm">Histórico Familiar</Label>
              <Textarea
                id="family"
                placeholder="Histórico familiar relevante..."
                value={assessmentData.familyHistory}
                onChange={(e) => setAssessmentData({ ...assessmentData, familyHistory: e.target.value })}
                rows={3}
                className="text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="medical" className="text-sm">Histórico Médico</Label>
              <Textarea
                id="medical"
                placeholder="Histórico médico do paciente..."
                value={assessmentData.medicalHistory}
                onChange={(e) => setAssessmentData({ ...assessmentData, medicalHistory: e.target.value })}
                rows={3}
                className="text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="previous" className="text-sm">Tratamento Anterior</Label>
              <Textarea
                id="previous"
                placeholder="Tratamentos psicológicos anteriores..."
                value={assessmentData.previousTreatment}
                onChange={(e) => setAssessmentData({ ...assessmentData, previousTreatment: e.target.value })}
                rows={3}
                className="text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mental" className="text-sm">Exame do Estado Mental</Label>
              <Textarea
                id="mental"
                placeholder="Observações sobre o estado mental..."
                value={assessmentData.mentalStatusExam}
                onChange={(e) => setAssessmentData({ ...assessmentData, mentalStatusExam: e.target.value })}
                rows={3}
                className="text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="diagnosis" className="text-sm">Diagnóstico Inicial</Label>
              <Textarea
                id="diagnosis"
                placeholder="Diagnóstico inicial ou hipóteses diagnósticas..."
                value={assessmentData.initialDiagnosis}
                onChange={(e) => setAssessmentData({ ...assessmentData, initialDiagnosis: e.target.value })}
                rows={3}
                className="text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="treatment" className="text-sm">Plano de Tratamento</Label>
            <Textarea
              id="treatment"
              placeholder="Plano de tratamento proposto..."
              value={assessmentData.treatmentPlan}
              onChange={(e) => setAssessmentData({ ...assessmentData, treatmentPlan: e.target.value })}
              rows={3}
              className="text-sm"
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto">
              Cancelar
            </Button>
            <Button type="submit" className="w-full sm:w-auto">
              <Save className="h-4 w-4 mr-2" />
              Salvar Avaliação
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InitialAssessmentModal;
