
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Filter, MessageCircle, AlertTriangle, CheckCircle } from "lucide-react";

const SupportTicketsFilter: React.FC = () => {
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Mock tickets data
  const tickets = [
    {
      id: "1",
      subject: "Problema técnico",
      description: "Erro ao fazer login na plataforma",
      priority: "Alta",
      status: "Aberto",
      createdAt: "2024-01-15 10:30"
    },
    {
      id: "2",
      subject: "Dúvida sobre funcionalidade",
      description: "Como configurar agendamentos automáticos?",
      priority: "Média",
      status: "Em andamento",
      createdAt: "2024-01-14 14:20"
    },
    {
      id: "3",
      subject: "Solicitação de melhoria",
      description: "Adicionar filtro por data nos relatórios",
      priority: "Baixa",
      status: "Resolvido",
      createdAt: "2024-01-12 09:15"
    }
  ];

  const filteredTickets = tickets.filter(ticket => {
    const matchesSubject = subjectFilter === "all" || ticket.subject.toLowerCase().includes(subjectFilter.toLowerCase());
    const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter;
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;
    
    return matchesSubject && matchesPriority && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Aberto": return <MessageCircle className="h-4 w-4" />;
      case "Em andamento": return <AlertTriangle className="h-4 w-4" />;
      case "Resolvido": return <CheckCircle className="h-4 w-4" />;
      default: return <MessageCircle className="h-4 w-4" />;
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Alta": return "bg-red-100 text-red-800";
      case "Média": return "bg-yellow-100 text-yellow-800";
      case "Baixa": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filtros</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Assunto</Label>
              <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por assunto" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="problema técnico">Problema técnico</SelectItem>
                  <SelectItem value="dúvida">Dúvida sobre funcionalidade</SelectItem>
                  <SelectItem value="solicitação">Solicitação de melhoria</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Prioridade</Label>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="Alta">Alta</SelectItem>
                  <SelectItem value="Média">Média</SelectItem>
                  <SelectItem value="Baixa">Baixa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="Aberto">Aberto</SelectItem>
                  <SelectItem value="Em andamento">Em andamento</SelectItem>
                  <SelectItem value="Resolvido">Resolvido</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Meus Chamados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTickets.map(ticket => (
              <div key={ticket.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-lg">{ticket.subject}</h3>
                    <p className="text-gray-600 text-sm mt-1">{ticket.description}</p>
                    <p className="text-xs text-gray-500 mt-2">Criado em: {ticket.createdAt}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(ticket.status)}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getPriorityColor(ticket.priority)}>
                    {ticket.priority}
                  </Badge>
                  <Badge className={getStatusColor(ticket.status)}>
                    {ticket.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>

          {filteredTickets.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">Nenhum chamado encontrado com os filtros selecionados.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SupportTicketsFilter;
