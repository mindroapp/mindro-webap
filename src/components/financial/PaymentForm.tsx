
import React, { useState } from "react";
import { usePatientStore } from "@/stores/patientStore";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PaymentMethod, PaymentStatus } from "@/stores/slices/financialSlice";

interface PaymentFormProps {
  patientId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  sessionId?: string;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  patientId,
  onSuccess,
  onCancel,
  sessionId
}) => {
  const { addPayment, patients } = usePatientStore();
  const patient = patients.find(p => p.id === patientId);
  
  const [amount, setAmount] = useState("0");
  const [description, setDescription] = useState(sessionId ? "Sessão de terapia" : "");
  const [method, setMethod] = useState<PaymentMethod>("pix");
  const [status, setStatus] = useState<PaymentStatus>("paid");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Erro",
        description: "Por favor, informe um valor válido",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      await addPayment({
        patientId,
        amount: parseFloat(amount),
        date: new Date().toISOString(),
        description,
        method,
        status,
        notes,
        sessionId
      });
      
      toast({
        title: "Pagamento registrado",
        description: "O pagamento foi registrado com sucesso",
      });
      
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Erro ao registrar pagamento:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao registrar o pagamento",
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
        <Label htmlFor="amount">Valor (R$)</Label>
        <Input 
          id="amount" 
          type="number" 
          step="0.01" 
          value={amount} 
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Input 
          id="description" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="method">Método de Pagamento</Label>
        <Select value={method} onValueChange={(value: PaymentMethod) => setMethod(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o método" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pix">PIX</SelectItem>
            <SelectItem value="cash">Dinheiro</SelectItem>
            <SelectItem value="creditCard">Cartão de Crédito</SelectItem>
            <SelectItem value="debitCard">Cartão de Débito</SelectItem>
            <SelectItem value="bankTransfer">Transferência Bancária</SelectItem>
            <SelectItem value="other">Outro</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select value={status} onValueChange={(value: PaymentStatus) => setStatus(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="paid">Pago</SelectItem>
            <SelectItem value="pending">Pendente</SelectItem>
            <SelectItem value="partial">Parcial</SelectItem>
            <SelectItem value="cancelled">Cancelado</SelectItem>
          </SelectContent>
        </Select>
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
          {isSubmitting ? "Registrando..." : "Registrar Pagamento"}
        </Button>
      </div>
    </form>
  );
};

export default PaymentForm;
