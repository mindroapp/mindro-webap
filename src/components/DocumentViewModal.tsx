
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Eye, Download } from "lucide-react";

interface DocumentViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  documents: string[] | null;
}

const DocumentViewModal: React.FC<DocumentViewModalProps> = ({
  isOpen,
  onClose,
  documents,
}) => {
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);

  if (!documents) return null;

  const handleViewDocument = (docName: string) => {
    // Mock URL for demonstration - in real app, this would be fetched from API
    const mockUrl = `https://example.com/documents/${docName}`;
    setSelectedDocument(mockUrl);
  };

  const isImage = (fileName: string) => {
    return fileName.toLowerCase().match(/\.(jpg|jpeg|png|gif|bmp|webp)$/);
  };

  const isPDF = (fileName: string) => {
    return fileName.toLowerCase().endsWith('.pdf');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Documentos do Profissional</DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-auto">
          {!selectedDocument ? (
            <div className="space-y-3">
              {documents.map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="font-medium">{doc}</span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDocument(doc)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Visualizar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Baixar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <Button
                variant="outline"
                onClick={() => setSelectedDocument(null)}
              >
                ← Voltar à lista
              </Button>
              
              <div className="flex justify-center">
                {isImage(selectedDocument) ? (
                  <img 
                    src={selectedDocument} 
                    alt="Documento"
                    className="max-w-full max-h-[60vh] object-contain"
                  />
                ) : isPDF(selectedDocument) ? (
                  <div className="w-full h-[60vh]">
                    <iframe
                      src={selectedDocument}
                      className="w-full h-full border-0"
                      title="Documento PDF"
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
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentViewModal;
