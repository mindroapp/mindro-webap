
import React from "react";
import { Patient } from "@/stores/patientStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatPhoneNumber } from "@/lib/format";

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
        <div className="p-3 sm:p-4">
          <div className="flex items-center">
            <Avatar className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
              <AvatarImage src={patient.avatar} alt={patient.name} />
              <AvatarFallback className="bg-primary text-primary-foreground text-sm sm:text-base">
                {getInitials(patient.name)}
              </AvatarFallback>
            </Avatar>
            <div className="ml-3 sm:ml-4 min-w-0 flex-1">
              <h3 className="text-base sm:text-lg font-medium text-foreground truncate">{patient.name}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">{patient.email}</p>
            </div>
          </div>
          
          <div className="mt-3 sm:mt-4 grid grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm">
            <div>
              <p className="text-muted-foreground">Idade</p>
              <p className="font-medium text-foreground">{calculateAge(patient.birthdate)} anos</p>
            </div>
            <div>
              <p className="text-muted-foreground">Telefone</p>
              <p className="font-medium text-foreground truncate">{formatPhoneNumber(patient.phone)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Paciente desde</p>
              <p className="font-medium text-foreground">{formatDate(patient.createdAt)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Sessões</p>
              <p className="font-medium text-foreground">{patient.sessions.length}</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border bg-muted/50 px-3 sm:px-4 py-2 sm:py-3">
          <Button 
            variant="ghost" 
            className="w-full text-primary hover:text-primary hover:bg-primary/10 text-sm"
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
