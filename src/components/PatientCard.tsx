
import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, FileText, User, Phone, Mail } from "lucide-react";
import { Patient } from "@/stores/patientStore";

interface PatientCardProps {
  patient: Patient;
  onClick: () => void;
}

const PatientCard: React.FC<PatientCardProps> = ({ patient, onClick }) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getGenderLabel = (gender?: string) => {
    if (!gender) return null;
    return gender === "male" ? "Masculino" : "Feminino";
  };

  const calculateAge = (birthdate: string) => {
    const today = new Date();
    const birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={onClick}>
      <CardHeader className="flex flex-row items-center space-y-0 pb-2">
        <Avatar className="h-12 w-12 mr-4">
          <AvatarImage src={patient.avatar} alt={patient.name} />
          <AvatarFallback className="bg-psycho-primary text-white">
            {getInitials(patient.name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{patient.name}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>{calculateAge(patient.birthdate)} anos</span>
            {patient.gender && (
              <>
                <span>•</span>
                <span>{getGenderLabel(patient.gender)}</span>
              </>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-2">
        <div className="flex items-center text-sm text-gray-600">
          <Mail className="h-4 w-4 mr-2" />
          <span className="truncate">{patient.email}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <Phone className="h-4 w-4 mr-2" />
          <span>{patient.phone}</span>
        </div>

        <div className="flex items-center text-sm text-gray-600">
          <User className="h-4 w-4 mr-2" />
          <span>Paciente desde {formatDate(patient.createdAt)}</span>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between items-center pt-4">
        <div className="flex gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {patient.sessions.length} sessões
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <FileText className="h-3 w-3" />
            {patient.documents.length} docs
          </Badge>
        </div>
        
        <Button variant="outline" size="sm">
          Ver Detalhes
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PatientCard;
