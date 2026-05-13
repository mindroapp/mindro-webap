import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import SessionForm from "./SessionForm";
import { Session } from "@/stores/patientStore";
import { usePatientStore } from "@/stores/patientStore";

interface SessionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
}

const SessionFormModal: React.FC<SessionFormModalProps> = ({ isOpen, onClose, patientId }) => {
  const { addSession, addPayment } = usePatientStore();

  const handleSubmit = async (data: Partial<Session> & { sessionValue?: number }) => {
    // Cria a sessão
    const sessionData = { 
      ...data,
    } as Omit<Session, "id">;
    await addSession(patientId, sessionData);
    
    // O id da sessão criada é gerado por Date.now()
    const sessionId = `s${Date.now()}`;
    
    // Cria o pagamento vinculado à sessão
    await addPayment({
      patientId,
      amount: Number(data.sessionValue) || 0,
      date: (data.date as string) || new Date().toISOString(),
      description: "Sessão de terapia",
      method: "pix",
      status: "pending",
      sessionId,
    });
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nova Sessão</DialogTitle>
        </DialogHeader>

        <SessionForm onSubmit={handleSubmit} onCancel={onClose} />
      </DialogContent>
    </Dialog>
  );
};

export default SessionFormModal;
