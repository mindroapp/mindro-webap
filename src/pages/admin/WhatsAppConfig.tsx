import React, { useState } from "react";
import AdminLayout from "@/components/layouts/AdminLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, Send, History, Wifi, WifiOff, Upload, Bold, Italic, Smile, Users, User, Image, FileText, Filter } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import MessageTemplates from "@/components/MessageTemplates";

// Dados fictícios para profissionais
const professionals = [
  { id: "1", name: "Dr. João Silva", phone: "+5511999999999", profession: "Psicólogo" },
  { id: "2", name: "Dra. Maria Santos", phone: "+5511888888888", profession: "Psicanalista" },
  { id: "3", name: "Dr. Carlos Lima", phone: "+5511777777777", profession: "Terapeuta" },
];

// Histórico de mensagens fictício
const messageHistory = [
  {
    id: "1",
    recipients: "3 profissionais",
    message: "Lembrete: Nova atualização da plataforma disponível!",
    type: "Lote",
    sentAt: "2024-01-15 14:30",
    status: "Enviado"
  },
  {
    id: "2",
    recipients: "Dr. João Silva",
    message: "Sua documentação foi aprovada. Bem-vindo à plataforma!",
    type: "Individual",
    sentAt: "2024-01-15 10:15",
    status: "Enviado"
  },
  {
    id: "3",
    recipients: "Todos os profissionais",
    message: "Manutenção programada para domingo das 2h às 4h.",
    type: "Broadcast",
    sentAt: "2024-01-14 16:45",
    status: "Falhou"
  }
];

const WhatsAppConfig: React.FC = () => {
  const [activeTab, setActiveTab] = useState("conexao");
  const [whatsappNumber, setWhatsappNumber] = useState("+55 11 98765-4321");
  const [isConnected, setIsConnected] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [messageType, setMessageType] = useState("individual");
  const [selectedProfessionals, setSelectedProfessionals] = useState<string[]>([]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);
  
  // Filtros para histórico
  const [recipientFilter, setRecipientFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  
  const { toast } = useToast();

  const handleConnect = () => {
    setShowQRCode(true);
    setTimeout(() => {
      setIsConnected(true);
      setShowQRCode(false);
      toast({
        title: "WhatsApp conectado",
        description: "Conexão estabelecida com sucesso!"
      });
    }, 3000);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    toast({
      title: "WhatsApp desconectado",
      description: "Conexão encerrada."
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        toast({
          title: "Arquivo muito grande",
          description: "O arquivo deve ter no máximo 10MB.",
          variant: "destructive"
        });
        return;
      }
      
      setUploadedFile(file);
      toast({
        title: "Arquivo carregado",
        description: `${file.name} foi carregado com sucesso.`
      });
    }
  };

  const handleSendMessage = () => {
    if (!messageText.trim() && !uploadedFile) {
      toast({
        title: "Erro",
        description: "Digite uma mensagem ou selecione um arquivo antes de enviar.",
        variant: "destructive"
      });
      return;
    }

    if (messageType === "individual" && !phoneNumber && selectedProfessionals.length === 0) {
      toast({
        title: "Erro",
        description: "Selecione ao menos um destinatário.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Mensagem enviada",
      description: `Mensagem enviada com sucesso para ${
        messageType === "individual" 
          ? phoneNumber || `${selectedProfessionals.length} profissional(is)`
          : "todos os profissionais"
      }!`
    });

    // Reset form
    setMessageText("");
    setPhoneNumber("");
    setSelectedProfessionals([]);
    setUploadedFile(null);
  };

  const handleSelectTemplate = (template: string) => {
    setMessageText(template);
    setShowTemplates(false);
  };

  const formatMessage = (text: string, format: string) => {
    const textarea = document.getElementById("message-text") as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = text.substring(start, end);
    
    if (selectedText) {
      let formattedText = "";
      switch (format) {
        case "bold":
          formattedText = `*${selectedText}*`;
          break;
        case "italic":
          formattedText = `_${selectedText}_`;
          break;
        default:
          formattedText = selectedText;
      }
      
      const newText = text.substring(0, start) + formattedText + text.substring(end);
      setMessageText(newText);
    }
  };

  const canSendMessage = () => {
    return isConnected && (messageText.trim() || uploadedFile);
  };

  const filteredHistory = messageHistory.filter((message) => {
    const matchesRecipient = recipientFilter === "all" || message.recipients.toLowerCase().includes(recipientFilter.toLowerCase());
    const matchesType = typeFilter === "all" || message.type === typeFilter;
    const matchesStatus = statusFilter === "all" || message.status === statusFilter;
    
    return matchesRecipient && matchesType && matchesStatus;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold tracking-tight">Configurações de WhatsApp</h2>
          <div className="flex items-center space-x-2">
            {isConnected ? <Wifi className="h-5 w-5 text-green-500" /> : <WifiOff className="h-5 w-5 text-red-500" />}
            <span className="text-sm font-medium">{isConnected ? 'Conectado' : 'Desconectado'}</span>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 lg:w-[500px]">
            <TabsTrigger value="conexao">
              <Wifi className="h-4 w-4 mr-2" />
              Conexão
            </TabsTrigger>
            <TabsTrigger value="mensagens">
              <Send className="h-4 w-4 mr-2" />
              Mensagens
            </TabsTrigger>
            <TabsTrigger value="historico">
              <History className="h-4 w-4 mr-2" />
              Histórico
            </TabsTrigger>
            <TabsTrigger value="configuracoes">
              <MessageCircle className="h-4 w-4 mr-2" />
              Config
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="conexao" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Status da Conexão</CardTitle>
                <CardDescription>
                  Gerencie a conexão do WhatsApp Business com a plataforma.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {isConnected ? <Wifi className="h-8 w-8 text-green-500" /> : <WifiOff className="h-8 w-8 text-red-500" />}
                    <div>
                      <p className="font-medium">WhatsApp Business</p>
                      <p className="text-sm text-gray-500">
                        {isConnected ? `Conectado - ${whatsappNumber}` : "Desconectado"}
                      </p>
                    </div>
                  </div>
                  <div>
                    {isConnected ? (
                      <Button variant="outline" onClick={handleDisconnect}>
                        Desconectar
                      </Button>
                    ) : (
                      <Button onClick={handleConnect}>
                        Conectar
                      </Button>
                    )}
                  </div>
                </div>

                {showQRCode && (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center space-y-4">
                        <div className="w-48 h-48 mx-auto bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                          <div className="text-center">
                            <MessageCircle className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                            <p className="text-sm text-gray-500">QR Code apareceria aqui</p>
                          </div>
                        </div>
                        <div>
                          <p className="font-medium">Escaneie o QR Code</p>
                          <p className="text-sm text-gray-500">
                            Abra o WhatsApp no seu telefone e escaneie este código
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="mensagens" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Enviar Mensagens</CardTitle>
                  <CardDescription>
                    Envie mensagens individuais ou em lote para os profissionais.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <Label>Tipo de Envio</Label>
                      <Select value={messageType} onValueChange={setMessageType}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="individual">Individual</SelectItem>
                          <SelectItem value="lote">Lote</SelectItem>
                          <SelectItem value="todos">Todos os Profissionais</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {messageType === "individual" && (
                      <div className="space-y-4">
                        <div>
                          <Label>Número do WhatsApp (opcional)</Label>
                          <Input
                            placeholder="+55 11 99999-9999"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>Ou selecione profissionais cadastrados:</Label>
                          <div className="space-y-2 mt-2 max-h-32 overflow-y-auto border rounded p-2">
                            {professionals.map((prof) => (
                              <div key={prof.id} className="flex items-center space-x-2">
                                <Checkbox
                                  id={prof.id}
                                  checked={selectedProfessionals.includes(prof.id)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setSelectedProfessionals([...selectedProfessionals, prof.id]);
                                    } else {
                                      setSelectedProfessionals(selectedProfessionals.filter(id => id !== prof.id));
                                    }
                                  }}
                                />
                                <label htmlFor={prof.id} className="text-sm">
                                  {prof.name} - {prof.profession}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {messageType === "lote" && (
                      <div>
                        <Label>Selecionar profissionais:</Label>
                        <div className="space-y-2 mt-2 max-h-32 overflow-y-auto border rounded p-2">
                          {professionals.map((prof) => (
                            <div key={prof.id} className="flex items-center space-x-2">
                              <Checkbox
                                id={`lote-${prof.id}`}
                                checked={selectedProfessionals.includes(prof.id)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedProfessionals([...selectedProfessionals, prof.id]);
                                  } else {
                                    setSelectedProfessionals(selectedProfessionals.filter(id => id !== prof.id));
                                  }
                                }}
                              />
                              <label htmlFor={`lote-${prof.id}`} className="text-sm">
                                {prof.name} - {prof.profession}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="message-text">Mensagem</Label>
                        <div className="flex space-x-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowTemplates(!showTemplates)}
                          >
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Templates
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => formatMessage(messageText, "bold")}
                          >
                            <Bold className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => formatMessage(messageText, "italic")}
                          >
                            <Italic className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <Textarea
                        id="message-text"
                        placeholder="Digite sua mensagem..."
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        rows={4}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Anexar Arquivo</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="file"
                          accept="image/*,application/pdf,.doc,.docx"
                          onChange={handleFileUpload}
                          className="flex-1"
                        />
                        <Button variant="outline" size="sm">
                          <Upload className="h-4 w-4 mr-1" />
                          Upload
                        </Button>
                      </div>
                      {uploadedFile && (
                        <div className="flex items-center space-x-2 p-2 bg-green-50 border border-green-200 rounded">
                          {uploadedFile.type.startsWith('image/') ? (
                            <Image className="h-4 w-4 text-green-600" />
                          ) : (
                            <FileText className="h-4 w-4 text-green-600" />
                          )}
                          <span className="text-sm text-green-700">{uploadedFile.name}</span>
                        </div>
                      )}
                    </div>

                    <Button 
                      onClick={handleSendMessage} 
                      disabled={!canSendMessage()}
                      className="w-full"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Enviar Mensagem
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {showTemplates && (
                <Card>
                  <CardHeader>
                    <CardTitle>Templates de Mensagens</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <MessageTemplates onSelectTemplate={handleSelectTemplate} />
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="historico" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Histórico de Mensagens</CardTitle>
                    <CardDescription>
                      Visualize todas as mensagens enviadas pela plataforma.
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Filter className="h-4 w-4" />
                    <span className="text-sm font-medium">Filtros</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Destinatário</Label>
                      <Select value={recipientFilter} onValueChange={setRecipientFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Filtrar por destinatário" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          <SelectItem value="dr. joão">Dr. João Silva</SelectItem>
                          <SelectItem value="dra. maria">Dra. Maria Santos</SelectItem>
                          <SelectItem value="profissionais">Todos os profissionais</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Tipo</Label>
                      <Select value={typeFilter} onValueChange={setTypeFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Filtrar por tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          <SelectItem value="Individual">Individual</SelectItem>
                          <SelectItem value="Lote">Lote</SelectItem>
                          <SelectItem value="Broadcast">Broadcast</SelectItem>
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
                          <SelectItem value="Enviado">Enviado</SelectItem>
                          <SelectItem value="Falhou">Falhou</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="rounded-md border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Destinatários</TableHead>
                          <TableHead>Mensagem</TableHead>
                          <TableHead>Tipo</TableHead>
                          <TableHead>Data/Hora</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredHistory.map((message) => (
                          <TableRow key={message.id}>
                            <TableCell className="font-medium">{message.recipients}</TableCell>
                            <TableCell className="max-w-xs truncate">{message.message}</TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {message.type}
                              </Badge>
                            </TableCell>
                            <TableCell>{message.sentAt}</TableCell>
                            <TableCell>
                              <Badge variant={message.status === "Enviado" ? "default" : "destructive"}>
                                {message.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="configuracoes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configurações Gerais</CardTitle>
                <CardDescription>
                  Configure as opções gerais do WhatsApp Business.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="whatsapp-number">Número de WhatsApp</Label>
                  <Input 
                    id="whatsapp-number" 
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatsapp-name">Nome de exibição</Label>
                  <Input 
                    id="whatsapp-name" 
                    defaultValue="Mindro - Psicólogos"
                  />
                </div>
                <div className="flex items-center space-x-2 pt-2">
                  <Switch id="auto-reply" defaultChecked />
                  <Label htmlFor="auto-reply">Ativar resposta automática para novas mensagens</Label>
                </div>
                <div className="space-y-2 pt-2">
                  <Label htmlFor="auto-reply-message">Mensagem de resposta automática</Label>
                  <Textarea 
                    id="auto-reply-message" 
                    defaultValue="Olá! Obrigado por entrar em contato com a Mindro. Em breve um de nossos atendentes irá te responder."
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default WhatsAppConfig;
