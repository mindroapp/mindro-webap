
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProfessionalEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  professional: any;
}

const ProfessionalEditModal: React.FC<ProfessionalEditModalProps> = ({
  isOpen,
  onClose,
  professional
}) => {
  const [formData, setFormData] = useState({
    name: professional?.name || "",
    email: professional?.email || "",
    phone: professional?.phone || "",
    profession: professional?.profession || "",
    registration: professional?.registration || "",
    plan: professional?.plan || "Básico"
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Profissional atualizado",
      description: "As informações foram salvas com sucesso!"
    });

    onClose();
  };

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Profissional</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
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
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telefone *</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="profession">Profissão *</Label>
            <Input
              id="profession"
              value={formData.profession}
              onChange={(e) => handleChange("profession", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="registration">Registro *</Label>
            <Input
              id="registration"
              value={formData.registration}
              onChange={(e) => handleChange("registration", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="plan">Plano *</Label>
            <Select value={formData.plan} onValueChange={(value) => handleChange("plan", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Básico">Básico</SelectItem>
                <SelectItem value="Profissional">Profissional</SelectItem>
                <SelectItem value="Premium">Premium</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              Salvar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProfessionalEditModal;
