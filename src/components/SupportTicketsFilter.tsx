
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, MessageSquare, Clock, AlertCircle } from "lucide-react";
import SupportTicketModal from "./SupportTicketModal";

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

const SupportTicketsFilter: React.FC = () => {
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [subjectFilter, setSubjectFilter] = useState<string>("");

  // Mock data para chamados
  const mockTickets: SupportTicket[] = [
    {
      id: "TKT-001",
      subject: "Problema de Login",
      description: "Não consigo fazer login na plataforma",
      priority: "high",
      status: "open",
      createdAt: "2024-01-15T10:00:00Z",
      updatedAt: "2024-01-15T10:30:00Z",
      messages: [
        {
          id: "msg1",
          sender: "user",
          message: "Estou com problemas para fazer login. Aparece uma mensagem de erro.",
          timestamp: "2024-01-15T10:00:00Z"
        },
        {
          id: "msg2",
          sender: "support",
          message: "Olá! Vamos verificar sua conta. Você poderia me informar qual navegador está utilizando?",
          timestamp: "2024-01-15T10:15:00Z"
        },
        {
          id: "msg3",
          sender: "user",
          message: "Estou usando o Chrome, versão mais recente.",
          timestamp: "2024-01-15T10:30:00Z"
        }
      ]
    },
    {
      id: "TKT-002",
      subject: "Integração WhatsApp",
      description: "Dúvidas sobre configuração do WhatsApp",
      priority: "medium",
      status: "in-progress",
      createdAt: "2024-01-14T14:00:00Z",
      updatedAt: "2024-01-15T09:00:00Z",
      messages: [
        {
          id: "msg4",
          sender: "user",
          message: "Como faço para conectar minha conta do WhatsApp Business?",
          timestamp: "2024-01-14T14:00:00Z"
        },
        {
          id: "msg5",
          sender: "support",
          message: "Vou te enviar um guia passo a passo para configuração.",
          timestamp: "2024-01-15T09:00:00Z"
        }
      ]
    },
    {
      id: "TKT-003",
      subject: "Relatórios Financeiros",
      description: "Erro ao gerar relatório mensal",
      priority: "low",
      status: "resolved",
      createdAt: "2024-01-10T16:00:00Z",
      updatedAt: "2024-01-12T11:00:00Z",
      messages: [
        {
          id: "msg6",
          sender: "user",
          message: "O relatório financeiro não está sendo gerado corretamente.",
          timestamp: "2024-01-10T16:00:00Z"
        },
        {
          id: "msg7",
          sender: "support",
          message: "Problema identificado e corrigido. Pode testar novamente.",
          timestamp: "2024-01-12T11:00:00Z"
        }
      ]
    }
  ];

  const filteredTickets = mockTickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = !priorityFilter || ticket.priority === priorityFilter;
    const matchesStatus = !statusFilter || ticket.status === statusFilter;
    const matchesSubject = !subjectFilter || ticket.subject.toLowerCase().includes(subjectFilter.toLowerCase());
    
    return matchesSearch && matchesPriority && matchesStatus && matchesSubject;
  });

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

  const clearFilters = () => {
    setSearchTerm("");
    setPriorityFilter("");
    setStatusFilter("");
    setSubjectFilter("");
  };

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por termo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={subjectFilter} onValueChange={setSubjectFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por assunto" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos os assuntos</SelectItem>
                <SelectItem value="login">Problemas de Login</SelectItem>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
                <SelectItem value="financeiro">Relatórios Financeiros</SelectItem>
                <SelectItem value="tecnico">Suporte Técnico</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por prioridade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas as prioridades</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
                <SelectItem value="medium">Média</SelectItem>
                <SelectItem value="low">Baixa</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos os status</SelectItem>
                <SelectItem value="open">Aberto</SelectItem>
                <SelectItem value="in-progress">Em Andamento</SelectItem>
                <SelectItem value="resolved">Resolvido</SelectItem>
                <SelectItem value="closed">Fechado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-end mt-4">
            <Button variant="outline" onClick={clearFilters}>
              Limpar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Chamados */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">
          Meus Chamados ({filteredTickets.length})
        </h3>
        
        {filteredTickets.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Nenhum chamado encontrado</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredTickets.map((ticket) => (
              <Card 
                key={ticket.id} 
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedTicket(ticket)}
              >
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium text-gray-900">#{ticket.id}</h4>
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
                      
                      <h5 className="font-semibold text-lg mb-2">{ticket.subject}</h5>
                      <p className="text-gray-600 mb-3 line-clamp-2">{ticket.description}</p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>Criado em {formatDate(ticket.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          <span>{ticket.messages.length} mensagens</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 sm:mt-0 sm:ml-4">
                      <Button variant="outline" size="sm">
                        Ver Detalhes
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Detalhes */}
      <SupportTicketModal
        isOpen={!!selectedTicket}
        onClose={() => setSelectedTicket(null)}
        ticket={selectedTicket}
      />
    </div>
  );
};

export default SupportTicketsFilter;
