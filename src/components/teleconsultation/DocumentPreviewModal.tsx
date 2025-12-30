import React from "react";
import { Document } from "@/stores/patientStore";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, ExternalLink, Calendar } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

interface DocumentPreviewModalProps {
  document: Document;
  isOpen: boolean;
  onClose: () => void;
}

const getFileTypeLabel = (type: string) => {
  const types: Record<string, string> = {
    pdf: "PDF",
    doc: "Word",
    docx: "Word",
    xls: "Excel",
    xlsx: "Excel",
    jpg: "Imagem",
    jpeg: "Imagem",
    png: "Imagem",
    txt: "Texto"
  };
  return types[type.toLowerCase()] || type.toUpperCase();
};

const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({ 
  document, 
  isOpen, 
  onClose 
}) => {
  const { toast } = useToast();

  const handleDownload = () => {
    toast({
      title: "Download iniciado",
      description: `O documento "${document.name}" está sendo baixado.`
    });
    // Aqui seria implementado o download real
  };

  const handleOpenExternal = () => {
    if (document.url && document.url !== "#") {
      window.open(document.url, "_blank");
    } else {
      toast({
        title: "Documento indisponível",
        description: "O documento não possui uma URL válida para visualização.",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Detalhes do Documento
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Document Icon and Name */}
          <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium truncate">{document.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  {getFileTypeLabel(document.type)}
                </Badge>
              </div>
            </div>
          </div>

          {/* Document Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Enviado em:</span>
              <span className="font-medium">
                {format(new Date(document.uploadDate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </span>
            </div>
          </div>

          {/* Preview Area (placeholder for PDF/image preview) */}
          <div className="h-40 bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-muted-foreground/20">
            <div className="text-center text-muted-foreground">
              <FileText className="h-10 w-10 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Pré-visualização não disponível</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handleOpenExternal}
              className="flex-1"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Abrir
            </Button>
            <Button 
              onClick={handleDownload}
              className="flex-1"
            >
              <Download className="h-4 w-4 mr-2" />
              Baixar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentPreviewModal;
