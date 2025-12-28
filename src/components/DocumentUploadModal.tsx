import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
}

const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  isOpen,
  onClose,
  patientId
}) => {
  const [documentData, setDocumentData] = useState({
    name: "",
    type: "",
    description: "",
    file: null as File | null
  });
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDocumentData({ ...documentData, file, name: file.name });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!documentData.file || !documentData.type) {
      toast({
        title: "Campos obrigatórios",
        description: "Selecione um arquivo e tipo de documento.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Documento enviado",
      description: "O documento foi enviado com sucesso!"
    });

    setDocumentData({
      name: "",
      type: "",
      description: "",
      file: null
    });
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg">Enviar Documento</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="file" className="text-sm">Arquivo *</Label>
            <Input
              id="file"
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              required
              className="text-sm"
            />
            {documentData.file && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground p-2 bg-muted rounded">
                <FileText className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{documentData.file.name}</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="type" className="text-sm">Tipo de Documento *</Label>
            <Select value={documentData.type} onValueChange={(value) => setDocumentData({ ...documentData, type: value })}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Exame">Exame</SelectItem>
                <SelectItem value="Receita">Receita</SelectItem>
                <SelectItem value="Relatório">Relatório</SelectItem>
                <SelectItem value="Atestado">Atestado</SelectItem>
                <SelectItem value="Outros">Outros</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm">Descrição</Label>
            <Textarea
              id="description"
              placeholder="Descrição opcional do documento..."
              value={documentData.description}
              onChange={(e) => setDocumentData({ ...documentData, description: e.target.value })}
              rows={3}
              className="text-sm"
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto">
              Cancelar
            </Button>
            <Button type="submit" className="w-full sm:w-auto">
              <Upload className="h-4 w-4 mr-2" />
              Enviar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentUploadModal;
