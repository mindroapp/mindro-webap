
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import PaymentForm from "./PaymentForm";

interface PaymentModalProps {
  patientId: string;
  isOpen: boolean;
  onClose: () => void;
  sessionId?: string;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  patientId,
  isOpen,
  onClose,
  sessionId
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Registrar Pagamento</DialogTitle>
        </DialogHeader>
        
        <PaymentForm 
          patientId={patientId}
          onSuccess={onClose}
          onCancel={onClose}
          sessionId={sessionId}
        />
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
