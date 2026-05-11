
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MaskedInput } from "@/components/ui/masked-input";
import { Save } from "lucide-react";
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
  professional
}) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    profession: "",
    professionalRegister: "",
    professionalCouncil: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Carregar dados do profissional quando o modal abre
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        if (!isOpen) {
          // Limpar form quando modal fecha
          setFormData({
            fullName: "",
            email: "",
            phone: "",
            profession: "",
            professionalRegister: "",
            professionalCouncil: ""
          });
          return;
        }
        
        // Se foi passado um profissional (edição do admin), usar esses dados
        if (professional && professional.id) {
          console.log("Carregando dados do profissional:", professional);
          
          // Handle both ApiUser and DisplayProfessional formats
          const fullName = professional.fullName || professional.name || "";
          let phone = professional.phone || "";
          
          // Garantir que o telefone seja apenas números (para unmask={true})
          phone = phone.replace(/\D/g, '');
          
          const registration = professional.professionalRegister || professional.registration || "";
          
          const newFormData = {
            fullName: fullName,
            email: professional.email || "",
            phone: phone,
            profession: professional.profession || "",
            professionalRegister: registration,
            professionalCouncil: professional.professionalCouncil || ""
          };
          
          console.log("Form data após carregamento:", newFormData);
          setFormData(newFormData);
          return;
        }

        // Caso contrário, tentar carregar o perfil do usuário autenticado
        try {
          const profile = await usersService.getCurrentProfile();
          setFormData({
            fullName: profile.fullName || "",
            email: profile.email || "",
            phone: (profile.phone || "").replace(/\D/g, ''),
            profession: profile.profession || "",
            professionalRegister: profile.professionalRegister || "",
            professionalCouncil: profile.professionalCouncil || ""
          });
        } catch (err) {
          // Endpoint de profile não existe, apenas mostra o formulário vazio
          console.warn("Endpoint de perfil não disponível");
          // Manter form vazio
        }
      } catch (error) {
        console.error("Erro ao carregar dados do profissional:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados do profissional",
          variant: "destructive"
        });
      }
    };

    loadProfileData();
  }, [isOpen, professional?.id, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.email || !formData.phone) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome, email e telefone são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const updateData = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone, // Já vem sem formatação com unmask={true}
        profession: formData.profession,
        professionalRegister: formData.professionalRegister,
        professionalCouncil: formData.professionalCouncil
      };

      // Se é edição do admin (professional prop passou), usar updateUser com o ID
      if (professional && professional.id) {
        await usersService.updateUser(professional.id, updateData);
      } else {
        // Caso contrário, tentar atualizar o perfil do usuário autenticado
        try {
          await usersService.updateProfile(updateData);
        } catch (err) {
          // Se endpoint de profile não existe, tenta updateUser com o ID do usuário autenticado
          if (user?.id) {
            await usersService.updateUser(user.id, updateData);
          } else {
            throw err;
          }
        }
      }

      toast({
        title: "Sucesso",
        description: "Dados do profissional atualizado com sucesso!"
      });

      if (onSuccess) onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Erro ao atualizar perfil:", error);
      toast({
        title: "Erro",
        description: error.message || "Falha ao atualizar os dados. Tente novamente.",
        variant: "destructive"
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
          <DialogTitle>Editar Perfil Profissional</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Nome Completo *</Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

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

          <div className="space-y-2">
            <Label htmlFor="profession">Profissão *</Label>
            <Select value={formData.profession} onValueChange={(value) => handleChange("profession", value)}>
              <SelectTrigger disabled={isLoading}>
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="professionalRegister">Registro Profissional *</Label>
            <Input
              id="professionalRegister"
              value={formData.professionalRegister}
              onChange={(e) => handleChange("professionalRegister", e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="professionalCouncil">Conselho (Opcional)</Label>
            <Input
              id="professionalCouncil"
              value={formData.professionalCouncil}
              onChange={(e) => handleChange("professionalCouncil", e.target.value)}
              disabled={isLoading}
            />
          </div>

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
