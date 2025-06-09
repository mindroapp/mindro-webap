import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePatientStore } from "@/stores/patientStore";
import Header from "@/components/Header";
import SidebarMenu from "@/components/SidebarMenu";
import PatientCard from "@/components/PatientCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Users } from "lucide-react";

const PatientList: React.FC = () => {
  const { patients, fetchPatients, isLoading } = usePatientStore();
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const filteredPatients = searchTerm
    ? patients.filter((patient) =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : patients;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="w-64 hidden md:block">
        <SidebarMenu />
      </div>
      <div className="flex-1">
        <Header />
        <main className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Pacientes</h1>
              <p className="text-gray-500">Gerencie os registros dos seus pacientes</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button onClick={() => navigate("/patients/new")}>
                <Plus size={16} className="mr-1" /> Adicionar novo paciente
              </Button>
            </div>
          </div>

          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                type="text"
                placeholder="Pesquise pacientes por nome ou e-mail..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-psycho-primary"></div>
            </div>
          ) : (
            <>
              {filteredPatients.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPatients.map((patient) => (
                    <PatientCard key={patient.id} patient={patient} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg bg-white">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                    <Users size={24} className="text-gray-500" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhum paciente encontrado</h3>
                  {searchTerm ? (
                    <p className="text-gray-500">
                      Nenhum paciente corresponde aos critérios de busca. Tente uma busca diferente ou{" "}
                      <button
                        onClick={() => setSearchTerm("")}
                        className="text-psycho-primary hover:underline"
                      >
                        limpe a busca
                      </button>.
                    </p>
                  ) : (
                    <p className="text-gray-500">
                      Você ainda não adicionou nenhum paciente. Clique no botão abaixo para adicionar seu primeiro paciente.
                    </p>
                  )}
                  {!searchTerm && (
                    <Button className="mt-4" onClick={() => navigate("/patients/new")}>
                      <Plus size={16} className="mr-1" /> Adicionar novo paciente
                    </Button>
                  )}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default PatientList;