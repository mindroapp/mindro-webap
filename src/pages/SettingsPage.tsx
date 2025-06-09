import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Settings, Bell, User, Lock, Shield, Palette, Sun, Moon } from "lucide-react";
import DashboardLayout from "@/components/layouts/DashboardLayout";

const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const { theme, colorTheme, setTheme, setColorTheme } = useTheme();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");
  
  // Estado das configurações de perfil
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [bio, setBio] = useState("");

  // Estado das configurações de notificações
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [sessionReminders, setSessionReminders] = useState(true);
  const [newPatientAlerts, setNewPatientAlerts] = useState(true);

  // Estado das configurações de segurança
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Estado do tema
  const [showColorThemes, setShowColorThemes] = useState(false);

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // Simular chamada de API
    setTimeout(() => {
      toast({
        title: "Perfil atualizado",
        description: "As informações do seu perfil foram atualizadas com sucesso.",
      });
    }, 500);
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem. Por favor, tente novamente.",
        variant: "destructive",
      });
      return;
    }
    
    // Simular chamada de API
    setTimeout(() => {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast({
        title: "Senha atualizada",
        description: "Sua senha foi atualizada com sucesso.",
      });
    }, 500);
  };

  const toggleDarkMode = (enabled: boolean) => {
    setTheme(enabled ? "dark" : "light");
    toast({
      title: enabled ? "Modo escuro ativado" : "Modo claro ativado",
      description: "Sua preferência de tema foi atualizada.",
    });
  };

  const changeColorTheme = (newTheme: string) => {
    setColorTheme(newTheme as any);
    toast({
      title: `Tema ${newTheme} selecionado`,
      description: "Seu tema de cores foi atualizado.",
    });
  };

  return (
    <DashboardLayout>
      <div className="container max-w-5xl py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Configurações</h1>
            <p className="text-muted-foreground">Gerencie as configurações e preferências da sua conta</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab}
            orientation="vertical"
            className="w-full"
          >
            <div className="md:w-64 shrink-0">
              <TabsList className="flex flex-col h-auto w-full bg-background p-0 space-y-1">
                <TabsTrigger 
                  value="profile" 
                  className="justify-start px-4 py-2 data-[state=active]:bg-muted w-full"
                >
                  <User className="w-4 h-4 mr-2" />
                  Perfil
                </TabsTrigger>
                <TabsTrigger 
                  value="notifications" 
                  className="justify-start px-4 py-2 data-[state=active]:bg-muted w-full"
                >
                  <Bell className="w-4 h-4 mr-2" />
                  Notificações
                </TabsTrigger>
                <TabsTrigger 
                  value="appearance" 
                  className="justify-start px-4 py-2 data-[state=active]:bg-muted w-full"
                >
                  <Palette className="w-4 h-4 mr-2" />
                  Aparência
                </TabsTrigger>
                <TabsTrigger 
                  value="security" 
                  className="justify-start px-4 py-2 data-[state=active]:bg-muted w-full"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Segurança
                </TabsTrigger>
              </TabsList>
            </div>

            <br />

            <div className="flex-1">
              <TabsContent value="profile" className="mt-0 border-0 p-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Perfil</CardTitle>
                    <CardDescription>
                      Gerencie suas informações pessoais
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleProfileUpdate}>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Nome</Label>
                          <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Seu nome"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">E-mail</Label>
                          <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Seu e-mail"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="bio">Biografia</Label>
                          <textarea
                            id="bio"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Fale um pouco sobre você"
                            rows={4}
                          />
                        </div>
                      </div>

                      <div className="mt-6">
                        <Button type="submit">
                          Salvar alterações
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notifications" className="mt-0 border-0 p-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Notificações</CardTitle>
                    <CardDescription>
                      Gerencie como você recebe notificações
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Notificações por e-mail</Label>
                        <p className="text-sm text-muted-foreground">
                          Receba notificações por e-mail
                        </p>
                      </div>
                      <Switch
                        checked={emailNotifications}
                        onCheckedChange={setEmailNotifications}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Lembretes de sessões</Label>
                        <p className="text-sm text-muted-foreground">
                          Receba lembretes sobre sessões futuras
                        </p>
                      </div>
                      <Switch
                        checked={sessionReminders}
                        onCheckedChange={setSessionReminders}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Alertas de novos pacientes</Label>
                        <p className="text-sm text-muted-foreground">
                          Seja notificado quando um novo paciente for adicionado
                        </p>
                      </div>
                      <Switch
                        checked={newPatientAlerts}
                        onCheckedChange={setNewPatientAlerts}
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={() => {
                      toast({
                        title: "Configurações de notificações salvas",
                        description: "Suas preferências de notificações foram atualizadas.",
                      });
                    }}>
                      Salvar preferências
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="appearance" className="mt-0 border-0 p-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Aparência</CardTitle>
                    <CardDescription>
                      Personalize como o aplicativo se parece
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Modo escuro</Label>
                        <p className="text-sm text-muted-foreground">
                          Alterne entre o modo claro e escuro
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Sun className="h-4 w-4 text-muted-foreground" />
                        <Switch
                          checked={theme === "dark"}
                          onCheckedChange={toggleDarkMode}
                        />
                        <Moon className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="space-y-0.5">
                          <Label>Tema de cores</Label>
                          <p className="text-sm text-muted-foreground">
                            Escolha seu tema de cores preferido
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                        {[
                          { name: "Padrão", value: "default" },
                          { name: "Roxo", value: "purple" }, 
                          { name: "Azul", value: "blue" }, 
                          { name: "Verde", value: "green" }, 
                          { name: "Laranja", value: "orange" }, 
                          { name: "Vermelho", value: "red" }
                        ].map((color) => (
                          <Button 
                            key={color.value} 
                            variant={colorTheme === color.value ? "default" : "outline"}
                            className="h-20 flex flex-col gap-2 items-center justify-center"
                            onClick={() => changeColorTheme(color.value)}
                          >
                            <div 
                              className={`w-6 h-6 rounded-full ${
                                color.value === "default" 
                                  ? "bg-primary" 
                                  : color.value === "purple" 
                                  ? "bg-[#9b87f5]" 
                                  : color.value === "blue" 
                                  ? "bg-[#0EA5E9]" 
                                  : color.value === "green" 
                                  ? "bg-[#22c55e]" 
                                  : color.value === "orange" 
                                  ? "bg-[#F97316]" 
                                  : "bg-[#ef4444]"
                              }`}
                            />
                            <span className="text-xs">{color.name}</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="mt-0 border-0 p-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Segurança</CardTitle>
                    <CardDescription>
                      Gerencie a segurança e autenticação da sua conta
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handlePasswordUpdate}>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="current-password">Senha atual</Label>
                          <Input
                            id="current-password"
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="new-password">Nova senha</Label>
                          <Input
                            id="new-password"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="confirm-password">Confirmar nova senha</Label>
                          <Input
                            id="confirm-password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="mt-6">
                        <Button type="submit">
                          Atualizar senha
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                  
                  <CardHeader className="mt-6">
                    <CardTitle>Autenticação em duas etapas</CardTitle>
                    <CardDescription>
                      Adicione uma camada extra de segurança à sua conta
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Ativar autenticação em duas etapas</Label>
                        <p className="text-sm text-muted-foreground">
                          Proteja sua conta com autenticação em duas etapas
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => {
                          toast({
                            title: "Configuração de autenticação em duas etapas",
                            description: "Siga as instruções para configurar a autenticação em duas etapas.",
                          });
                        }}
                      >
                        <Shield className="w-4 h-4 mr-2" />
                        Configurar autenticação
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;