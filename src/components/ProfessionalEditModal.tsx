// Função para formatar o nome da profissão
const formatProfession = (profession: string) => {
  return profession
    .split("_")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MaskedInput } from "@/components/ui/masked-input";
import { Save, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import usersService from "@/services/usersService";
import { PROFESSIONS } from "@/lib/professions";

interface ProfessionalEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  professional?: any;
}

const ProfessionalEditModal: React.FC<ProfessionalEditModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  professional,
}) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    profession: "",
    professionalRegister: "",
    professionalCouncil: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Admin editing a specific professional vs. professional editing own profile
  const isAdminEdit = !!(professional && professional.id);

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        if (!isOpen) {
          setFormData({
            fullName: "",
            email: "",
            phone: "",
            profession: "",
            professionalRegister: "",
            professionalCouncil: "",
          });
          return;
        }

        if (isAdminEdit) {
          const fullName = professional.fullName || professional.name || "";
          const phone = (professional.phone || "").replace(/\D/g, "");
          const registration =
            professional.professionalRegister || professional.registration || "";

          setFormData({
            fullName,
            email: professional.email || "",
            phone,
            profession: professional.profession || "",
            professionalRegister: registration,
            professionalCouncil: professional.professionalCouncil || "",
          });
          return;
        }

        try {
          const profile = await usersService.getCurrentProfile();
          setFormData({
            fullName: profile.fullName || "",
            email: profile.email || "",
            phone: (profile.phone || "").replace(/\D/g, ""),
            profession: profile.profession || "",
            professionalRegister: profile.professionalRegister || "",
            professionalCouncil: profile.professionalCouncil || "",
          });
        } catch {
          console.warn("Endpoint de perfil não disponível");
        }
      } catch (error) {
        console.error("Erro ao carregar dados do profissional:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados do profissional",
          variant: "destructive",
        });
      }
    };

    loadProfileData();
  }, [isOpen, professional?.id, toast, isAdminEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.phone) {
      toast({
        title: "Campos obrigatórios",
        description: "Email e telefone são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    if (isAdminEdit && !formData.fullName) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome é obrigatório",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      if (isAdminEdit) {
        await usersService.updateUser(professional.id, {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          profession: formData.profession,
          professionalRegister: formData.professionalRegister,
          professionalCouncil: formData.professionalCouncil,
        });
      } else {
        await usersService.updateProfile({
          email: formData.email,
          phone: formData.phone,
        });
      }

      toast({
        title: "Sucesso",
        description: "Dados atualizados com sucesso!",
      });

      if (onSuccess) onSuccess();
      onClose();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Falha ao atualizar os dados. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isAdminEdit ? "Editar Profissional" : "Editar Dados de Contato"}
          </DialogTitle>
        </DialogHeader>

        {!isAdminEdit && (
          <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200">
            <Lock className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              Somente <strong>email</strong> e <strong>telefone</strong> podem ser alterados pelo
              profissional. Para alterar nome, profissão ou registro, entre em contato com o
              administrador.
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {((isAdminEdit && formData.fullName !== "") || !isAdminEdit) && (
            <div className="space-y-2">
              <Label htmlFor="fullName" className={!isAdminEdit ? "text-muted-foreground" : ""}>
                Nome Completo {isAdminEdit && "*"}
              </Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                disabled={isLoading || !isAdminEdit}
                readOnly={!isAdminEdit}
                className={!isAdminEdit ? "bg-muted cursor-not-allowed" : ""}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telefone *</Label>
            <MaskedInput
              id="phone"
              mask="(99) 9 9999-9999"
              placeholder="(85) 9 9999-9999"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          {((isAdminEdit && formData.profession !== "") || !isAdminEdit) && (
            <div className="space-y-2">
              <Label htmlFor="profession" className={!isAdminEdit ? "text-muted-foreground" : ""}>
                Profissão {isAdminEdit && "*"}
              </Label>
              {isAdminEdit ? (
                <Select
                  value={formData.profession}
                  onValueChange={(value) => handleChange("profession", value)}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a profissão" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROFESSIONS.map((prof) => (
                      <SelectItem key={prof.value} value={prof.value}>
                        {prof.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id="profession"
                  value={formatProfession(formData.profession)}
                  disabled
                  readOnly
                  className="bg-muted cursor-not-allowed"
                />
              )}
            </div>
          )}

          {((isAdminEdit && formData.professionalRegister !== "") || !isAdminEdit) && (
            <div className="space-y-2">
              <Label
                htmlFor="professionalRegister"
                className={!isAdminEdit ? "text-muted-foreground" : ""}
              >
                Registro Profissional {isAdminEdit && "*"}
              </Label>
              <Input
                id="professionalRegister"
                value={formData.professionalRegister}
                onChange={(e) => handleChange("professionalRegister", e.target.value)}
                disabled={isLoading || !isAdminEdit}
                readOnly={!isAdminEdit}
                className={!isAdminEdit ? "bg-muted cursor-not-allowed" : ""}
              />
            </div>
          )}

          {((isAdminEdit && formData.professionalCouncil !== "") || !isAdminEdit) && (
            <div className="space-y-2">
              <Label
                htmlFor="professionalCouncil"
                className={!isAdminEdit ? "text-muted-foreground" : ""}
              >
                Conselho {isAdminEdit ? "(Opcional)" : ""}
              </Label>
              <Input
                id="professionalCouncil"
                value={formData.professionalCouncil}
                onChange={(e) => handleChange("professionalCouncil", e.target.value)}
                disabled={isLoading || !isAdminEdit}
                readOnly={!isAdminEdit}
                className={!isAdminEdit ? "bg-muted cursor-not-allowed" : ""}
              />
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProfessionalEditModal;
