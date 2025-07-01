import React from "react";
import { usePatientStore, Session } from "@/stores/patientStore";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import SessionForm from "./SessionForm";
import { useToast } from "@/hooks/use-toast";

interface SessionEditModalProps {
  patientId: string;
  session: Session;
  isOpen: boolean;
  onClose: () => void;
}

const SessionEditModal: React.FC<SessionEditModalProps> = ({ patientId, session, isOpen, onClose }) => {
  const { updateSession } = usePatientStore();
  const { toast } = useToast();

  const handleSubmit = async (data: Partial<Session>) => {
    try {
      await updateSession(patientId, session.id, { ...session, ...data });
      toast({
        title: "Sessão atualizada",
        description: "As notas da sessão foram atualizadas com sucesso."
      });
      onClose();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao atualizar as notas da sessão.",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Editar Notas da Sessão</DialogTitle>
        </DialogHeader>
        <SessionForm
          initialValues={session}
          onSubmit={handleSubmit}
          onCancel={onClose}
          isEdit
        />
      </DialogContent>
    </Dialog>
  );
};

export default SessionEditModal;
