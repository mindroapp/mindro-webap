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
import { formatPhoneNumber } from "@/lib/format";

const ProfessionalSettings: React.FC = () => {
  const { toast } = useToast();
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  
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
      setIsChangingPassword(true);
      await usersService.changePassword({
        currentPassword: passwords.current,
        newPassword: passwords.new,
        confirmPassword: passwords.confirm,
      });
      
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
    } finally {
      setIsChangingPassword(false);
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

  const formatProfession = (profession: string) => {
    return profession
      .split("_")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
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
            <CardContent>
              <div className="space-y-1">
                {professionalData.fullName && (
                  <div className="py-1">
                    <span className="text-gray-600">Nome Completo:</span>
                    <span className="text-gray-900 font-medium ml-2">{professionalData.fullName}</span>
                  </div>
                )}
                {professionalData.email && (
                  <div className="py-1">
                    <span className="text-gray-600">Email:</span>
                    <span className="text-gray-900 font-medium ml-2">{professionalData.email}</span>
                  </div>
                )}
                {professionalData.phone && (
                  <div className="py-1">
                    <span className="text-gray-600">Telefone:</span>
                    <span className="text-gray-900 font-medium ml-2">{formatPhoneNumber(professionalData.phone)}</span>
                  </div>
                )}
                {professionalData.profession && (
                  <div className="py-1">
                    <span className="text-gray-600">Profissão:</span>
                    <span className="text-gray-900 font-medium ml-2">{formatProfession(professionalData.profession)}</span>
                  </div>
                )}
                {professionalData.professionalCouncil && (
                  <div className="py-1">
                    <span className="text-gray-600">Conselho:</span>
                    <span className="text-gray-900 font-medium ml-2">{professionalData.professionalCouncil}</span>
                  </div>
                )}
                {professionalData.professionalRegister && (
                  <div className="py-1">
                    <span className="text-gray-600">Registro Profissional:</span>
                    <span className="text-gray-900 font-medium ml-2">{professionalData.professionalRegister}</span>
                  </div>
                )}
                {/* Se nenhum campo estiver preenchido, exibe mensagem */}
                {!professionalData.fullName &&
                  !professionalData.email &&
                  !professionalData.phone &&
                  !professionalData.profession &&
                  !professionalData.professionalCouncil &&
                  !professionalData.professionalRegister && (
                    <div className="py-1 text-gray-500">Nenhum dado cadastral preenchido.</div>
                )}
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

              <Button onClick={handleChangePassword} className="w-full md:w-auto" disabled={isChangingPassword}>
                {isChangingPassword ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Alterando...
                  </>
                ) : (
                  "Alterar Senha"
                )}
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
