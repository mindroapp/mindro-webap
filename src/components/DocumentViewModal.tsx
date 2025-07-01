
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface DocumentViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: {
    id: string;
    name: string;
    type: string;
    url: string;
  } | null;
}

const DocumentViewModal: React.FC<DocumentViewModalProps> = ({
  isOpen,
  onClose,
  document,
}) => {
  if (!document) return null;

  const isImage = document.type.toLowerCase().includes('image') || 
                  document.name.toLowerCase().match(/\.(jpg|jpeg|png|gif|bmp|webp)$/);
  const isPDF = document.type.toLowerCase().includes('pdf') || 
                document.name.toLowerCase().endsWith('.pdf');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>{document.name}</DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-auto">
          {isImage ? (
            <div className="flex justify-center">
              <img 
                src={document.url} 
                alt={document.name}
                className="max-w-full max-h-[70vh] object-contain"
              />
            </div>
          ) : isPDF ? (
            <div className="w-full h-[70vh]">
              <iframe
                src={document.url}
                className="w-full h-full border-0"
                title={document.name}
              />
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">
                Visualização não disponível para este tipo de arquivo.
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Use o botão "Baixar" para fazer o download do documento.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentViewModal;
