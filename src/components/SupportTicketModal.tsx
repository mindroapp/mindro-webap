
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Send, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SupportTicket {
  id: string;
  subject: string;
  description: string;
  priority: "low" | "medium" | "high";
  status: "open" | "in-progress" | "resolved" | "closed";
  createdAt: string;
  updatedAt: string;
  messages: {
    id: string;
    sender: "user" | "support";
    message: string;
    timestamp: string;
  }[];
}

interface SupportTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: SupportTicket | null;
}

const SupportTicketModal: React.FC<SupportTicketModalProps> = ({
  isOpen,
  onClose,
  ticket,
}) => {
  const [newMessage, setNewMessage] = useState("");
  const { toast } = useToast();

  if (!ticket) return null;

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    toast({
      title: "Mensagem enviada",
      description: "Sua mensagem foi enviada com sucesso.",
    });

    setNewMessage("");
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-blue-100 text-blue-800";
      case "in-progress":
        return "bg-orange-100 text-orange-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Chamado #{ticket.id}</DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Informações do Chamado */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge className={getPriorityColor(ticket.priority)}>
                  {ticket.priority === "high" ? "Alta" : 
                   ticket.priority === "medium" ? "Média" : "Baixa"}
                </Badge>
                <Badge className={getStatusColor(ticket.status)}>
                  {ticket.status === "open" ? "Aberto" :
                   ticket.status === "in-progress" ? "Em Andamento" :
                   ticket.status === "resolved" ? "Resolvido" : "Fechado"}
                </Badge>
              </div>
              
              <h3 className="font-semibold text-lg mb-2">{ticket.subject}</h3>
              <p className="text-gray-700 mb-3">{ticket.description}</p>
              
              <div className="flex justify-between text-sm text-gray-500">
                <span>Criado em: {formatDate(ticket.createdAt)}</span>
                <span>Atualizado em: {formatDate(ticket.updatedAt)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Histórico de Mensagens */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            <h4 className="font-medium">Histórico de Conversas</h4>
            
            {ticket.messages.map((message, index) => (
              <div key={message.id}>
                <div className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.sender === "user" 
                      ? "bg-blue-500 text-white" 
                      : "bg-gray-100 text-gray-900"
                  }`}>
                    <p className="text-sm">{message.message}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender === "user" ? "text-blue-100" : "text-gray-500"
                    }`}>
                      {message.sender === "user" ? "Você" : "Suporte"} - {formatDate(message.timestamp)}
                    </p>
                  </div>
                </div>
                {index < ticket.messages.length - 1 && <div className="my-2" />}
              </div>
            ))}
          </div>

          <Separator />

          {/* Nova Mensagem */}
          <div className="space-y-3">
            <h4 className="font-medium">Adicionar Mensagem</h4>
            <div className="flex gap-2">
              <Textarea
                placeholder="Digite sua mensagem..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1"
                rows={3}
              />
              <Button 
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="self-start"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SupportTicketModal;
