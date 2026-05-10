import React, { useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Save, User, Shield, AlertCircle, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import InputMask from 'react-input-mask';
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

const ProfessionalSettings: React.FC = () => {
  const { toast } = useToast();
  
  // Dados do profissional - mock data
  const [professionalData, setProfessionalData] = useState({
    name: "Dr. João Silva",
    email: "joao@exemplo.com",
    phone: "(85) 9 9999-9999",
    profession: "Psicólogo",
    council: "CRP",
    registration: "CRP 11/12345",
    diplomaDocument: null as File | null,
    carteiraDocument: null as File | null
  });

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: ""
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleSaveProfessionalData = () => {
    if (!professionalData.name || !professionalData.email || !professionalData.phone) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome, email e telefone são obrigatórios.",
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

    if (passwords.new.length < 6) {
      toast({
        title: "Senha fraca",
        description: "A nova senha deve ter no mínimo 6 caracteres.",
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
      title: "✅ Senha alterada",
      description: "Você será desconectado em breve...",
    });
    
    setTimeout(() => {
      localStorage.clear();
      logout();
      navigate("/login");
    }, 1500);
    setPasswords({ current: "", new: "", confirm: "" });
  };

  const handleDocumentUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'diploma' | 'carteira') => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Tipo de arquivo inválido",
          description: "Por favor, envie apenas imagens (JPG, PNG, etc).",
          variant: "destructive",
        });
        return;
      }

      if (type === 'diploma') {
        setProfessionalData({ ...professionalData, diplomaDocument: file });
      } else {
        setProfessionalData({ ...professionalData, carteiraDocument: file });
      }
      
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
            Gerencie seus dados profissionais e segurança da conta
          </p>
        </div>

        {/* Seção de Perfil */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Dados Cadastrais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    value={professionalData.name}
                    onChange={(e) => setProfessionalData({...professionalData, name: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={professionalData.email}
                    onChange={(e) => setProfessionalData({...professionalData, email: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <InputMask
                    mask="(99) 9 9999-9999"
                    value={professionalData.phone}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProfessionalData({...professionalData, phone: e.target.value})}
                  >
                    {(inputProps) => <Input {...inputProps} id="phone" />}
                  </InputMask>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="profession">Profissão</Label>
                  <Input
                    id="profession"
                    value={professionalData.profession}
                    disabled
                    className="bg-gray-50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="council">Conselho</Label>
                  <Input
                    id="council"
                    value={professionalData.council}
                    disabled
                    className="bg-gray-50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="registration">Registro Profissional</Label>
                  <Input
                    id="registration"
                    value={professionalData.registration}
                    disabled
                    className="bg-gray-50"
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h3 className="font-semibold text-sm">Documentação Profissional</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="diploma">Diploma</Label>
                    <div className="flex items-center gap-4">
                      <Input
                        id="diploma"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleDocumentUpload(e, 'diploma')}
                        className="flex-1"
                      />
                      <Button variant="outline" size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload
                      </Button>
                    </div>
                    {professionalData.diplomaDocument && (
                      <p className="text-sm text-green-600">
                        ✅ {professionalData.diplomaDocument.name}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="carteira">Carteira Profissional</Label>
                    <div className="flex items-center gap-4">
                      <Input
                        id="carteira"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleDocumentUpload(e, 'carteira')}
                        className="flex-1"
                      />
                      <Button variant="outline" size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload
                      </Button>
                    </div>
                    {professionalData.carteiraDocument && (
                      <p className="text-sm text-green-600">
                        ✅ {professionalData.carteiraDocument.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <Button onClick={handleSaveProfessionalData} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Salvar Dados
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Seção de Segurança */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Alterar Senha
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex gap-2">
                <AlertCircle className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-700">
                  Ao alterar sua senha, você será desconectado e precisará fazer login novamente.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Senha Atual</Label>
                  <div className="relative">
                    <Input
                      id="current-password"
                      type={showPasswords.current ? "text" : "password"}
                      value={passwords.current}
                      onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                      placeholder="Digite sua senha atual"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords({...showPasswords, current: !showPasswords.current})}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPasswords.current ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-password">Nova Senha</Label>
                  <div className="relative">
                    <Input
                      id="new-password"
                      type={showPasswords.new ? "text" : "password"}
                      value={passwords.new}
                      onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                      placeholder="Mínimo 6 caracteres"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords({...showPasswords, new: !showPasswords.new})}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPasswords.new ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmar Senha</Label>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      type={showPasswords.confirm ? "text" : "password"}
                      value={passwords.confirm}
                      onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                      placeholder="Confirme sua senha"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords({...showPasswords, confirm: !showPasswords.confirm})}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPasswords.confirm ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-500">
                Sua senha deve ter no mínimo 6 caracteres
              </p>

              <Button onClick={handleChangePassword} className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Alterar Senha
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfessionalSettings;
