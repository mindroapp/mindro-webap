import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Video, Copy, ExternalLink, MessageCircle } from "lucide-react";

interface TeleconsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
  patientName: string;
  patientPhone?: string;
  onStartCall: (roomLink: string) => void;
}

const TeleconsultationModal: React.FC<TeleconsultationModalProps> = ({
  isOpen,
  onClose,
  patientId,
  patientName,
  patientPhone,
  onStartCall,
}) => {
  const { toast } = useToast();
  const [roomLink, setRoomLink] = useState("");
  const [patientLink, setPatientLink] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const generateRoomLink = () => {
    setIsCreating(true);
    // Gera um ID único para a sala
    const roomId = `${patientId}-${Date.now()}`;
    
    // Link para o paciente (sem role ou com role=patient)
    const patientUrl = `${window.location.origin}/video-meeting?room=${roomId}&patientId=${patientId}&role=patient`;
    // Link para o profissional (com role=professional)
    const professionalUrl = `${window.location.origin}/video-meeting?room=${roomId}&patientId=${patientId}&role=professional`;
    
    setPatientLink(patientUrl);
    setRoomLink(professionalUrl);
    setIsCreating(false);
    
    toast({
      title: "Sala criada!",
      description: "Links da teleconsulta gerados com sucesso.",
    });
  };

  const copyLink = () => {
    navigator.clipboard.writeText(patientLink);
    toast({
      title: "Link copiado!",
      description: "O link do paciente foi copiado para a área de transferência.",
    });
  };

  const sendWhatsApp = () => {
    if (!patientPhone) {
      toast({
        title: "Telefone não cadastrado",
        description: "O paciente não possui telefone cadastrado.",
        variant: "destructive",
      });
      return;
    }

    const phone = patientPhone.replace(/\D/g, "");
    const message = encodeURIComponent(
      `Olá ${patientName}! Sua teleconsulta está pronta. Acesse o link para iniciar: ${patientLink}`
    );
    window.open(`https://wa.me/55${phone}?text=${message}`, "_blank");
  };

  const handleStartCall = () => {
    if (roomLink) {
      onStartCall(roomLink);
      onClose();
    }
  };

  const handleClose = () => {
    setRoomLink("");
    setPatientLink("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Video className="h-5 w-5 text-primary" />
            Teleconsulta - {patientName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {!roomLink ? (
            <div className="text-center space-y-4">
              <p className="text-muted-foreground text-sm">
                Crie uma sala de vídeo para iniciar a teleconsulta com o paciente.
              </p>
              <Button 
                onClick={generateRoomLink} 
                disabled={isCreating}
                className="w-full"
              >
                <Video className="mr-2 h-4 w-4" />
                {isCreating ? "Criando sala..." : "Criar Sala de Vídeo"}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm">Link para o Paciente</Label>
                <div className="flex gap-2">
                  <Input 
                    value={patientLink} 
                    readOnly 
                    className="text-xs"
                  />
                  <Button variant="outline" size="icon" onClick={copyLink} className="shrink-0">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Este link é exclusivo para o paciente acessar a chamada.
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <Button 
                  variant="outline" 
                  onClick={sendWhatsApp}
                  className="w-full"
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Enviar link via WhatsApp
                </Button>

                <Button 
                  onClick={handleStartCall}
                  className="w-full"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Iniciar Teleconsulta
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TeleconsultationModal;
