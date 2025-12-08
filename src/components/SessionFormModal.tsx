import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import SessionForm from "./SessionForm";
import { Session } from "@/stores/patientStore";
import { usePatientStore } from "@/stores/patientStore";
import { Video, Copy, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SessionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
}

const SessionFormModal: React.FC<SessionFormModalProps> = ({ isOpen, onClose, patientId }) => {
  const { addSession, addPayment, patients } = usePatientStore();
  const { toast } = useToast();
  const [createVideoRoom, setCreateVideoRoom] = useState(false);
  const [videoRoomLink, setVideoRoomLink] = useState("");

  const patient = patients.find(p => p.id === patientId);

  const generateVideoRoomLink = () => {
    const roomId = `${patientId}-${Date.now()}`;
    const link = `${window.location.origin}/video-meeting?room=${roomId}&patientId=${patientId}`;
    setVideoRoomLink(link);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(videoRoomLink);
    toast({
      title: "Link copiado!",
      description: "O link foi copiado para a área de transferência.",
    });
  };

  const sendWhatsApp = () => {
    if (!patient?.phone) {
      toast({
        title: "Telefone não cadastrado",
        description: "O paciente não possui telefone cadastrado.",
        variant: "destructive",
      });
      return;
    }

    const phone = patient.phone.replace(/\D/g, "");
    const message = encodeURIComponent(
      `Olá ${patient.name}! Sua teleconsulta está agendada. Acesse o link para iniciar: ${videoRoomLink}`
    );
    window.open(`https://wa.me/55${phone}?text=${message}`, "_blank");
  };

  const handleSubmit = async (data: Partial<Session> & { sessionValue?: number }) => {
    // Cria a sessão
    const sessionData = { 
      ...data,
      videoLink: videoRoomLink || undefined
    } as Omit<Session, "id">;
    await addSession(patientId, sessionData);
    
    // O id da sessão criada é gerado por Date.now(), então vamos simular o mesmo id
    const sessionId = `s${Date.now()}`;
    
    // Cria o pagamento vinculado à sessão
    await addPayment({
      patientId,
      amount: Number(data.sessionValue) || 0,
      date: (data.date as string) || new Date().toISOString(),
      description: "Sessão de terapia",
      method: "pix",
      status: "pending",
      sessionId,
    });
    
    // Reset states
    setCreateVideoRoom(false);
    setVideoRoomLink("");
    onClose();
  };

  const handleClose = () => {
    setCreateVideoRoom(false);
    setVideoRoomLink("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle>Nova Sessão</DialogTitle>
        </DialogHeader>

        {/* Opção de Teleconsulta */}
        <div className="bg-muted/50 rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Video className="h-5 w-5 text-primary" />
              <div>
                <Label htmlFor="video-room" className="text-sm font-medium">
                  Criar sala de vídeo
                </Label>
                <p className="text-xs text-muted-foreground">
                  Gere um link para teleconsulta com o paciente
                </p>
              </div>
            </div>
            <Switch
              id="video-room"
              checked={createVideoRoom}
              onCheckedChange={(checked) => {
                setCreateVideoRoom(checked);
                if (checked && !videoRoomLink) {
                  generateVideoRoomLink();
                }
              }}
            />
          </div>

          {createVideoRoom && videoRoomLink && (
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input 
                  value={videoRoomLink} 
                  readOnly 
                  className="text-xs bg-background"
                />
                <Button variant="outline" size="icon" onClick={copyLink}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={sendWhatsApp}
                className="w-full"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Enviar link via WhatsApp
              </Button>
            </div>
          )}
        </div>

        <Separator />

        <SessionForm onSubmit={handleSubmit} onCancel={handleClose} />
      </DialogContent>
    </Dialog>
  );
};

export default SessionFormModal;
