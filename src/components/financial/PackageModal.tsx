
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import PackageForm from "./PackageForm";

interface PackageModalProps {
  patientId: string;
  isOpen: boolean;
  onClose: () => void;
}

const PackageModal: React.FC<PackageModalProps> = ({
  patientId,
  isOpen,
  onClose
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Registrar Pacote de Sessões</DialogTitle>
        </DialogHeader>
        
        <PackageForm 
          patientId={patientId}
          onSuccess={onClose}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default PackageModal;
