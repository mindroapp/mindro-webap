import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import SessionForm from "./SessionForm";
import { Session } from "@/stores/patientStore";

interface SessionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
}

const SessionFormModal: React.FC<SessionFormModalProps> = ({ isOpen, onClose }) => {
  const handleSubmit = (data: Partial<Session>) => {
    // Aqui você pode chamar a função de criação de sessão
    // Exemplo: addSession(patientId, data)
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Nova Sessão</DialogTitle>
        </DialogHeader>
        <SessionForm onSubmit={handleSubmit} onCancel={onClose} />
      </DialogContent>
    </Dialog>
  );
};

export default SessionFormModal;
