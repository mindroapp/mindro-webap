import React, { useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { QrCode, Upload, Save, Smartphone, User, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import InputMask from 'react-input-mask';
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

const ProfessionalSettings: React.FC = () => {
  const { toast } = useToast();
  const [whatsappConnected, setWhatsappConnected] = useState(false);
  const [showQrCode, setShowQrCode] = useState(false);
  
  // Dados do profissional - mock data
  const [professionalData, setProfessionalData] = useState({
    name: "Dr. João Silva",
    email: "joao@exemplo.com",
    phone: "(85) 9 9999-9999",
    profession: "",
    registration: "",
    document: null as File | null
  });

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: ""
  });

  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleConnectWhatsApp = () => {
    setShowQrCode(true);
    // Simular conexão após 3 segundos
    setTimeout(() => {
      setWhatsappConnected(true);
      setShowQrCode(false);
      toast({
        title: "WhatsApp Conectado",
        description: "Sua conta WhatsApp foi conectada com sucesso!",
      });
    }, 3000);
  };

  const handleSaveProfessionalData = () => {
    if (!professionalData.profession || !professionalData.registration) {
      toast({
        title: "Campos obrigatórios",
        description: "Profissão e registro são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Dados salvos",
      description: "Seus dados cadastrais foram atualizados com sucesso!",
    });
  };

  const handleChangePassword = () => {
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      toast({
        title: "Campos obrigatórios",
        description: "Todos os campos de senha são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    if (passwords.new !== passwords.confirm) {
      toast({
        title: "Senhas não coincidem",
        description: "A nova senha e confirmação devem ser iguais.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Senha alterada",
      description: "Sua senha foi alterada com sucesso! Faça login novamente.",
    });
    setTimeout(() => {
      logout();
      navigate("/login");
    }, 1200);
    setPasswords({ current: "", new: "", confirm: "" });
  };

  const handleDocumentUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setProfessionalData({ ...professionalData, document: file });
      toast({
        title: "Documento carregado",
        description: `Arquivo ${file.name} carregado com sucesso!`,
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Configurações
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gerencie suas configurações e dados profissionais
          </p>
        </div>

        <Tabs defaultValue="whatsapp" className="space-y-4">
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="whatsapp" className="flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              WhatsApp
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Perfil
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Segurança
            </TabsTrigger>
          </TabsList>

          <TabsContent value="whatsapp">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  Conexão WhatsApp
                  {whatsappConnected ? (
                    <Badge variant="default" className="bg-green-500">Conectado</Badge>
                  ) : (
                    <Badge variant="secondary">Desconectado</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 dark:text-gray-400">
                  Conecte seu WhatsApp para enviar mensagens automáticas de confirmação e criar agendamentos.
                </p>
                
                {!whatsappConnected && (
                  <Button onClick={handleConnectWhatsApp} className="flex items-center gap-2">
                    <QrCode className="h-4 w-4" />
                    Gerar QR Code para Conexão
                  </Button>
                )}

                {showQrCode && (
                  <div className="text-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
                    <div className="text-6xl mb-4">📱</div>
                    <p className="text-sm text-gray-600">
                      Escaneie o QR Code com seu WhatsApp
                    </p>
                    <div className="animate-pulse mt-2">Conectando...</div>
                  </div>
                )}

                {whatsappConnected && (
                  <>
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-green-800">
                        ✅ WhatsApp conectado com sucesso! Você pode agora receber e enviar mensagens automáticas.
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      className="mt-4"
                      onClick={() => {
                        setWhatsappConnected(false);
                        toast({
                          title: "WhatsApp Desconectado",
                          description: "Sua conta WhatsApp foi desconectada.",
                        });
                      }}
                    >
                      Desconectar WhatsApp
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Dados Cadastrais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input
                      id="name"
                      value={professionalData.name}
                      onChange={(e) => setProfessionalData({...professionalData, name: e.target.value})}
                      disabled
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={professionalData.email}
                      onChange={(e) => setProfessionalData({...professionalData, email: e.target.value})}
                      disabled
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <InputMask
                      mask="(99) 9 9999-9999"
                      value={professionalData.phone}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProfessionalData({...professionalData, phone: e.target.value})}
                      disabled
                    >
                      {(inputProps) => <Input {...inputProps} id="phone" />}
                    </InputMask>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="profession">Profissão *</Label>
                    <Input
                      id="profession"
                      placeholder="Ex: Psicólogo, Psiquiatra, Terapeuta"
                      value={professionalData.profession}
                      onChange={(e) => setProfessionalData({...professionalData, profession: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="registration">Registro Profissional *</Label>
                    <Input
                      id="registration"
                      placeholder="Ex: CRP 11/12345, CRM 54321"
                      value={professionalData.registration}
                      onChange={(e) => setProfessionalData({...professionalData, registration: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="document">Documento Comprobatório</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="document"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleDocumentUpload}
                      className="flex-1"
                    />
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500">
                    Faça upload do seu diploma, certificado ou carteira profissional
                  </p>
                  {professionalData.document && (
                    <p className="text-sm text-green-600">
                      ✅ Arquivo carregado: {professionalData.document.name}
                    </p>
                  )}
                </div>

                <Button onClick={handleSaveProfessionalData} className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Salvar Dados
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Alterar Senha</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Senha Atual</Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={passwords.current}
                    onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-password">Nova Senha</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={passwords.new}
                    onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={passwords.confirm}
                    onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                  />
                </div>

                <Button onClick={handleChangePassword} className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Alterar Senha
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default ProfessionalSettings;
