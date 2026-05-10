
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText, AlertCircle, MessageCircle, Image as ImageIcon, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DocumentViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  documents: string[];
  professionalName?: string;
  professionalPhone?: string;
  onRequestDocuments?: (phone: string, missingDocs: string[]) => void;
}

const REQUIRED_DOCUMENTS = [
  { name: "diploma", label: "Diploma" },
  { name: "registro", label: "Comprovação de Registro" },
  { name: "identidade", label: "Comprovante de Identidade" }
];

const ALLOWED_IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp", ".svg"];

const isImageFile = (filename: string): boolean => {
  const extension = filename.toLowerCase().substring(filename.lastIndexOf("."));
  return ALLOWED_IMAGE_EXTENSIONS.includes(extension);
};

const DocumentViewModal: React.FC<DocumentViewModalProps> = ({
  isOpen,
  onClose,
  documents = [],
  professionalName = "",
  professionalPhone = "",
  onRequestDocuments
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const checkDocumentExists = (docName: string): boolean => {
    return documents.some(doc => 
      doc.toLowerCase().includes(docName.toLowerCase())
    );
  };

  const getMissingDocuments = (): string[] => {
    return REQUIRED_DOCUMENTS
      .filter(doc => !checkDocumentExists(doc.name))
      .map(doc => doc.label);
  };

  const missingDocs = getMissingDocuments();
  const allDocumentsComplete = missingDocs.length === 0;

  const handleRequestDocuments = () => {
    if (onRequestDocuments) {
      onRequestDocuments(professionalPhone, missingDocs);
    } else {
      // Fallback: abrir WhatsApp
      const message = `Olá ${professionalName}, detectamos que os seguintes documentos estão faltando no seu cadastro: ${missingDocs.join(", ")}. Por favor, adicione-os na plataforma o quanto antes.`;
      const cleanPhone = professionalPhone.replace(/\D/g, '');
      const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  const validDocuments = documents.filter(doc => isImageFile(doc));
  const invalidDocuments = documents.filter(doc => !isImageFile(doc));

  if (selectedImage) {
    return (
      <Dialog open={true} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-[95vw] w-screen h-[90vh] max-h-[90vh] p-0 overflow-hidden flex flex-col">
          <DialogHeader className="flex flex-row items-center justify-between space-y-0 p-4 border-b flex-shrink-0">
            <DialogTitle>Visualização da Imagem</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedImage(null)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          <div className="flex justify-center items-center bg-gray-100 p-6 flex-grow overflow-auto">
            <img 
              src={selectedImage} 
              alt="Visualização"
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Documentos Anexados</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Status de Documentos Obrigatórios */}
          <div>
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <span>Documentos Obrigatórios</span>
              {allDocumentsComplete ? (
                <Badge className="bg-green-100 text-green-800">Completo</Badge>
              ) : (
                <Badge className="bg-red-100 text-red-800 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {missingDocs.length} faltando
                </Badge>
              )}
            </h3>
            
            <div className="space-y-2">
              {REQUIRED_DOCUMENTS.map((doc) => {
                const exists = checkDocumentExists(doc.name);
                return (
                  <div 
                    key={doc.name} 
                    className={`flex items-center justify-between p-3 border rounded-lg ${
                      exists ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <ImageIcon className={`h-4 w-4 ${exists ? "text-green-600" : "text-red-600"}`} />
                      <span className="text-sm">{doc.label}</span>
                    </div>
                    <Badge className={exists ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                      {exists ? "✓ Enviado" : "✗ Faltando"}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Aviso de Tipo de Arquivo */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-800">
              <strong>Nota:</strong> Apenas arquivos de imagem são aceitos (JPG, PNG, GIF, WebP, BMP, SVG)
            </p>
          </div>

          {/* Documentos Válidos Anexados */}
          {validDocuments.length > 0 && (
            <div>
              <h3 className="font-semibold text-sm mb-3">Imagens Anexadas</h3>
              <div className="space-y-2">
                {validDocuments.map((doc, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(doc)}
                    className="w-full flex items-center justify-between p-3 border rounded-lg bg-green-50 border-green-200 hover:bg-green-100 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center space-x-2">
                      <ImageIcon className="h-4 w-4 text-green-600" />
                      <span className="text-sm">{doc}</span>
                    </div>
                    <span className="text-xs text-green-600 font-medium">Clique para visualizar</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Avisos de Documentos Inválidos */}
          {invalidDocuments.length > 0 && (
            <div>
              <h3 className="font-semibold text-sm mb-3 flex items-center gap-2 text-red-600">
                <AlertCircle className="h-4 w-4" />
                Arquivos Rejeitados (Formato Inválido)
              </h3>
              <div className="space-y-2">
                {invalidDocuments.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-red-50 border-red-200">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-red-600" />
                      <div>
                        <span className="text-sm text-red-800">{doc}</span>
                        <p className="text-xs text-red-600">Formato não permitido - apenas imagens</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {validDocuments.length === 0 && invalidDocuments.length === 0 && (
            <div className="text-center py-4 text-muted-foreground">
              Nenhum documento anexado
            </div>
          )}

          {/* Botões de Ação */}
          <div className="flex gap-2 justify-end">
            {!allDocumentsComplete && (
              <Button 
                onClick={handleRequestDocuments}
                className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
              >
                <MessageCircle className="h-4 w-4" />
                Solicitar Documentos via WhatsApp
              </Button>
            )}
            <Button onClick={onClose} variant="outline">
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentViewModal;
