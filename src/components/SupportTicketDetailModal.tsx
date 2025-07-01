
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Trash2 } from "lucide-react";

interface SupportTicket {
  id: string;
  subject: string;
  description: string;
  priority: string;
  status: string;
  createdAt: string;
  type: string;
  attachment?: string;
}

interface SupportTicketDetailModalProps {
  ticket: SupportTicket | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (ticketId: string) => void;
}

const SupportTicketDetailModal: React.FC<SupportTicketDetailModalProps> = ({
  ticket,
  isOpen,
  onClose,
  onDelete
}) => {
  if (!ticket) return null;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Alta": return "bg-red-100 text-red-800";
      case "Média": return "bg-yellow-100 text-yellow-800";
      case "Baixa": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Aberto": return "bg-red-100 text-red-800";
      case "Em andamento": return "bg-yellow-100 text-yellow-800";
      case "Resolvido": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Detalhes do Chamado #{ticket.id}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <strong>Tipo:</strong> {ticket.type}
            </div>
            <div>
              <strong>Criado em:</strong> {new Date(ticket.createdAt).toLocaleDateString('pt-BR')}
            </div>
          </div>
          
          <div>
            <strong>Assunto:</strong>
            <p className="mt-1">{ticket.subject}</p>
          </div>
          
          <div>
            <strong>Descrição:</strong>
            <p className="mt-1 text-gray-700">{ticket.description}</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <strong>Prioridade:</strong>
              <Badge className={getPriorityColor(ticket.priority)}>
                {ticket.priority}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <strong>Status:</strong>
              <Badge className={getStatusColor(ticket.status)}>
                {ticket.status}
              </Badge>
            </div>
          </div>
          
          {ticket.attachment && (
            <div>
              <strong>Anexo:</strong>
              <div className="mt-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Baixar Anexo
                </Button>
              </div>
            </div>
          )}
          
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Fechar
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                onDelete(ticket.id);
                onClose();
              }}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir Chamado
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SupportTicketDetailModal;
