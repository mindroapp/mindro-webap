
import React, { useState } from "react";
import { usePatientStore } from "@/stores/patientStore";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface PackageFormProps {
  patientId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const PackageForm: React.FC<PackageFormProps> = ({
  patientId,
  onSuccess,
  onCancel
}) => {
  const { addPackage, patients } = usePatientStore();
  const patient = patients.find(p => p.id === patientId);
  
  const [name, setName] = useState("");
  const [totalSessions, setTotalSessions] = useState("4");
  const [valuePerSession, setValuePerSession] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const calculateTotalValue = (): number => {
    const total = parseFloat(valuePerSession) * parseInt(totalSessions);
    return isNaN(total) ? 0 : total;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !totalSessions || parseInt(totalSessions) <= 0 || !valuePerSession || parseFloat(valuePerSession) <= 0) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos corretamente",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      await addPackage({
        patientId,
        name,
        totalSessions: parseInt(totalSessions),
        remainingSessions: parseInt(totalSessions),
        valuePerSession: parseFloat(valuePerSession),
        totalValue: calculateTotalValue(),
        startDate: startDate?.toISOString() || new Date().toISOString(),
        status: "active",
        notes
      });
      
      toast({
        title: "Pacote registrado",
        description: "O pacote de sessões foi registrado com sucesso",
      });
      
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Erro ao registrar pacote:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao registrar o pacote de sessões",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="patient">Paciente</Label>
        <Input 
          id="patient" 
          value={patient?.name || ""} 
          disabled 
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="name">Nome do Pacote</Label>
        <Input 
          id="name" 
          value={name} 
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: Pacote Mensal, Trimestral, etc."
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="totalSessions">Número de Sessões</Label>
          <Input 
            id="totalSessions" 
            type="number" 
            min="1" 
            value={totalSessions} 
            onChange={(e) => setTotalSessions(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="valuePerSession">Valor por Sessão (R$)</Label>
          <Input 
            id="valuePerSession" 
            type="number" 
            step="0.01" 
            min="0"
            value={valuePerSession} 
            onChange={(e) => setValuePerSession(e.target.value)}
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="totalValue">Valor Total (R$)</Label>
        <Input 
          id="totalValue" 
          value={calculateTotalValue().toFixed(2)} 
          disabled
        />
      </div>
      
      <div className="space-y-2">
        <Label>Data de Início</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !startDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {startDate ? format(startDate, "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={setStartDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="notes">Observações</Label>
        <Textarea 
          id="notes" 
          value={notes} 
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
        />
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Registrando..." : "Registrar Pacote"}
        </Button>
      </div>
    </form>
  );
};

export default PackageForm;
