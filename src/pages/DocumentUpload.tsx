import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePatientStore } from "@/stores/patientStore";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/Header";
import SidebarMenu from "@/components/SidebarMenu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Upload, X } from "lucide-react";

const DocumentUpload: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const { selectedPatient, fetchPatient, addDocument, isLoading } = usePatientStore();
  const { toast } = useToast();

  const [name, setName] = useState<string>("");
  const [type, setType] = useState<string>("pdf");
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (patientId) {
      fetchPatient(patientId);
    }
  }, [patientId, fetchPatient]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      if (!name) {
        // Preencher automaticamente o nome do documento com o nome do arquivo
        setName(selectedFile.name.split(".")[0]);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId || !file) return;

    setIsSubmitting(true);

    try {
      // Em uma aplicação real, faríamos o upload do arquivo para um servidor
      // Aqui estamos apenas simulando
      await addDocument(patientId, {
        name,
        type,
        url: URL.createObjectURL(file),
      });

      toast({
        title: "Documento enviado",
        description: "O documento foi enviado com sucesso."
      });

      navigate(`/patients/${patientId}`);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao enviar o documento. Por favor, tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <div className="w-64 hidden md:block">
          <SidebarMenu />
        </div>
        <div className="flex-1">
          <Header />
          <main className="p-6">
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-psycho-primary"></div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!selectedPatient) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <div className="w-64 hidden md:block">
          <SidebarMenu />
        </div>
        <div className="flex-1">
          <Header />
          <main className="p-6">
            <div className="text-center py-12">
              <h2 className="text-lg font-medium mb-2">Paciente não encontrado</h2>
              <p className="text-gray-500 mb-4">O paciente que você está procurando não existe ou foi removido.</p>
              <Button onClick={() => navigate("/patients")}>
                <ArrowLeft size={16} className="mr-1" /> Voltar para pacientes
              </Button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="w-64 hidden md:block">
        <SidebarMenu />
      </div>
      <div className="flex-1">
        <Header />
        <main className="p-6">
          <div className="flex items-center mb-6">
            <Button variant="ghost" size="sm" className="mr-4" onClick={() => navigate(`/patients/${patientId}`)}>
              <ArrowLeft size={16} className="mr-1" /> Voltar
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Enviar Documento</h1>
          </div>

          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Avatar className="h-12 w-12 mr-4">
                  <AvatarImage src={selectedPatient.avatar} alt={selectedPatient.name} />
                  <AvatarFallback className="bg-psycho-primary text-white">
                    {getInitials(selectedPatient.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-lg font-semibold">{selectedPatient.name}</h2>
                  <p className="text-gray-500">{selectedPatient.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <form onSubmit={handleSubmit}>
            <Card className="mb-6">
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Documento</Label>
                  <Input
                    id="name"
                    placeholder="Digite o nome do documento"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="type">Tipo de Documento</Label>
                  <Select value={type} onValueChange={setType} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo de documento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">Documento PDF</SelectItem>
                      <SelectItem value="image">Imagem</SelectItem>
                      <SelectItem value="report">Relatório Médico</SelectItem>
                      <SelectItem value="test">Resultados de Exames</SelectItem>
                      <SelectItem value="letter">Carta de Encaminhamento</SelectItem>
                      <SelectItem value="other">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="file">Enviar Arquivo</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center">
                    {!file ? (
                      <>
                        <div className="mb-4">
                          <Upload size={40} className="text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-500 text-center mb-4">
                          Arraste e solte seu arquivo aqui, ou clique para selecionar o arquivo
                        </p>
                        <input
                          id="file"
                          type="file"
                          className="hidden"
                          onChange={handleFileChange}
                          required
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById("file")?.click()}
                        >
                          Selecionar Arquivo
                        </Button>
                      </>
                    ) : (
                      <div className="w-full">
                        <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
                          <div className="flex items-center">
                            <div className="mr-3">
                              <div className="w-10 h-10 rounded bg-blue-100 flex items-center justify-center">
                                <span className="font-semibold text-xs text-psycho-primary">
                                  {file.name.split(".").pop()?.toUpperCase() || "ARQ"}
                                </span>
                              </div>
                            </div>
                            <div className="overflow-hidden">
                              <p className="font-medium text-sm truncate">{file.name}</p>
                              <p className="text-xs text-gray-500">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-gray-500 hover:text-red-500"
                            onClick={() => setFile(null)}
                          >
                            <X size={16} />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/patients/${patientId}`)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting || !file}>
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    <span>Enviando...</span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Upload size={16} className="mr-1" /> Enviar Documento
                  </div>
                )}
              </Button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default DocumentUpload;