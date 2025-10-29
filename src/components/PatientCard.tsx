
import React from "react";
import { Patient } from "@/stores/patientStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

interface PatientCardProps {
  patient: Patient;
  onClick?: () => void;
}

const PatientCard: React.FC<PatientCardProps> = ({ patient, onClick }) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "-";
      return new Intl.DateTimeFormat("pt-BR", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(date);
    } catch {
      return "-";
    }
  };

  const calculateAge = (birthdate: string | undefined) => {
    if (!birthdate) return "-";
    const birthDate = new Date(birthdate);
    if (isNaN(birthDate.getTime())) return "-";
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="p-4">
          <div className="flex items-center">
            <Avatar className="h-12 w-12">
              <AvatarImage src={patient.avatar} alt={patient.name} />
              <AvatarFallback className="bg-psycho-secondary text-white">
                {getInitials(patient.name)}
              </AvatarFallback>
            </Avatar>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">{patient.name}</h3>
              <p className="text-sm text-gray-500">{patient.email}</p>
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Idade</p>
              <p className="font-medium">{calculateAge(patient.birthdate)} anos</p>
            </div>
            <div>
              <p className="text-gray-500">Telefone</p>
              <p className="font-medium">{patient.phone}</p>
            </div>
            <div>
              <p className="text-gray-500">Paciente desde</p>
              <p className="font-medium">{formatDate(patient.createdAt)}</p>
            </div>
            <div>
              <p className="text-gray-500">Sessões</p>
              <p className="font-medium">{patient.sessions.length}</p>
            </div>
          </div>
          
          <div className="mt-4 flex">
            {patient.initialRecord ? (
              <div className="flex items-center text-xs text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
                <FileText size={12} className="mr-1" />
                Avaliação inicial completa
              </div>
            ) : (
              <div className="flex items-center text-xs text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
                <FileText size={12} className="mr-1" />
                Avaliação inicial pendente
              </div>
            )}
          </div>
        </div>
        
        <div className="border-t border-gray-100 bg-gray-50 px-4 py-3">
          <Button 
            variant="ghost" 
            className="w-full text-psycho-primary hover:text-psycho-primary hover:bg-psycho-muted"
            onClick={onClick}
          >
            Ver detalhes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientCard;
