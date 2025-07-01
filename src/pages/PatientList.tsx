
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import PatientCard from "@/components/PatientCard";
import PatientFormModal from "@/components/PatientFormModal";
import PatientFilters from "@/components/PatientFilters";
import Pagination from "@/components/Pagination";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { usePatientStore } from "@/stores/patientStore";

const ITEMS_PER_PAGE = 9;

const PatientList: React.FC = () => {
  const navigate = useNavigate();
  const { patients, fetchPatients } = usePatientStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const filteredAndSortedPatients = useMemo(() => {
    let filtered = patients.filter(patient =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm)
    );

    // Sort patients
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "createdAt":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "lastSession":
          const aLastSession = a.sessions.length > 0 ? new Date(a.sessions[a.sessions.length - 1].date) : new Date(0);
          const bLastSession = b.sessions.length > 0 ? new Date(b.sessions[b.sessions.length - 1].date) : new Date(0);
          return bLastSession.getTime() - aLastSession.getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [patients, searchTerm, sortBy]);

  const totalPages = Math.ceil(filteredAndSortedPatients.length / ITEMS_PER_PAGE);
  const paginatedPatients = filteredAndSortedPatients.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePatientClick = (patientId: string) => {
    navigate(`/patients/${patientId}`);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSortBy("name");
    setCurrentPage(1);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold">Pacientes</h1>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus size={16} className="mr-2" />
            Novo Paciente
          </Button>
        </div>

        <PatientFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          sortBy={sortBy}
          onSortChange={setSortBy}
          onClearFilters={handleClearFilters}
        />

        {paginatedPatients.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedPatients.map((patient) => (
                <PatientCard
                  key={patient.id}
                  patient={patient}
                  onClick={() => handlePatientClick(patient.id)}
                />
              ))}
            </div>
            
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {searchTerm ? "Nenhum paciente encontrado" : "Nenhum paciente cadastrado"}
            </p>
          </div>
        )}

        <PatientFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => fetchPatients()}
        />
      </div>
    </DashboardLayout>
  );
};

export default PatientList;
