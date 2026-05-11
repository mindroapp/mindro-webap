import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, Shield, AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ProfessionalEditModal from "@/components/ProfessionalEditModal";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import usersService from "@/services/usersService";

const ProfessionalSettings: React.FC = () => {
  const { toast } = useToast();
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  
  const [professionalData, setProfessionalData] = useState({
    fullName: "",
    email: "",
    phone: "",
    profession: "",
    professionalCouncil: "",
    professionalRegister: "",
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

  // Carregar dados do perfil ao montar o componente
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoadingProfile(true);
        const profile = await usersService.getCurrentProfile();
        setProfessionalData({
          fullName: profile.fullName || "",
          email: profile.email || "",
          phone: profile.phone || "",
          profession: profile.profession || "",
          professionalCouncil: profile.professionalCouncil || "",
          professionalRegister: profile.professionalRegister || "",
        });
      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados do perfil",
          variant: "destructive",
        });
      } finally {
        setIsLoadingProfile(false);
      }
    };

    loadProfile();
  }, [toast]);

  const handleChangePassword = async () => {
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

    try {
      // TODO: Implementar chamada de API para mudar senha
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
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Falha ao alterar a senha",
        variant: "destructive",
      });
    }
  };

  const handleEditSuccess = async () => {
    // Recarregar os dados após edição bem-sucedida
    try {
      const profile = await usersService.getCurrentProfile();
      setProfessionalData({
        fullName: profile.fullName || "",
        email: profile.email || "",
        phone: profile.phone || "",
        profession: profile.profession || "",
        professionalCouncil: profile.professionalCouncil || "",
        professionalRegister: profile.professionalRegister || "",
      });
    } catch (error) {
      console.error("Erro ao recarregar perfil:", error);
    }
  };

  if (isLoadingProfile) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-600">Carregando dados...</p>
        </div>
      </DashboardLayout>
    );
  }

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
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Dados Cadastrais</CardTitle>
              <Button onClick={() => setIsEditModalOpen(true)} variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Nome Completo</Label>
                  <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
                    <p className="text-gray-900">{professionalData.fullName || "-"}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Email</Label>
                  <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
                    <p className="text-gray-900">{professionalData.email || "-"}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Telefone</Label>
                  <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
                    <p className="text-gray-900">{professionalData.phone || "-"}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Profissão</Label>
                  <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
                    <p className="text-gray-900">{professionalData.profession || "-"}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Conselho</Label>
                  <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
                    <p className="text-gray-900">{professionalData.professionalCouncil || "-"}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Registro Profissional</Label>
                  <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
                    <p className="text-gray-900">{professionalData.professionalRegister || "-"}</p>
                  </div>
                </div>
              </div>
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
                  <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      type={showPasswords.confirm ? "text" : "password"}
                      value={passwords.confirm}
                      onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                      placeholder="Confirme a nova senha"
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

              <Button onClick={handleChangePassword} className="w-full md:w-auto">
                Alterar Senha
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal de Edição */}
      <ProfessionalEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={handleEditSuccess}
      />
    </DashboardLayout>
  );
};

export default ProfessionalSettings;
