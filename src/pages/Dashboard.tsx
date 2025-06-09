import Header from "@/components/Header";
import SidebarMenu from "@/components/SidebarMenu";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { usePatientStore } from "@/stores/patientStore";
import { Calendar, ChevronRight, Clock, FileText, Plus, Users } from "lucide-react";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard: React.FC = () => {
  const { patients, fetchPatients, isLoading } = usePatientStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  // Obter sessões de hoje
  const today = new Date();
  const todaySessions = patients
    .flatMap((patient) =>
      patient.sessions
        .filter((session) => {
          const sessionDate = new Date(session.date);
          return (
            sessionDate.getFullYear() === today.getFullYear() &&
            sessionDate.getMonth() === today.getMonth() &&
            sessionDate.getDate() === today.getDate()
          );
        })
        .map((session) => ({
          ...session,
          patientName: patient.name,
          patientId: patient.id,
        }))
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  // Obter sessões recentes de todos os pacientes
  const recentSessions = patients
    .flatMap((patient) =>
      patient.sessions.map((session) => ({
        ...session,
        patientName: patient.name,
        patientId: patient.id,
      }))
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  // Obter pacientes recentes
  const recentPatients = [...patients]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  const upcomingSessions = [
    { id: "u1", patientName: "Ana Silva", date: new Date(Date.now() + 86400000).toISOString() },
    { id: "u2", patientName: "Carlos Mendes", date: new Date(Date.now() + 172800000).toISOString() },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="w-64 hidden md:block">
        <SidebarMenu />
      </div>
      <div className="flex-1">
        <Header />
        <main className="p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Painel</h1>
            <p className="text-gray-500">Bem-vindo de volta! Aqui está o que está acontecendo hoje.</p>
          </div>

          {/* Cartões de Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-50 rounded-md mr-4">
                    <Users className="h-6 w-6 text-psycho-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total de Pacientes</p>
                    <h3 className="text-2xl font-bold text-gray-900">{patients.length}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-indigo-50 rounded-md mr-4">
                    <Calendar className="h-6 w-6 text-psycho-secondary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Sessões de Hoje</p>
                    <h3 className="text-2xl font-bold text-gray-900">{todaySessions.length}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-indigo-50 rounded-md mr-4">
                    <Clock className="h-6 w-6 text-indigo-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total de Sessões</p>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {patients.reduce((acc, patient) => acc + patient.sessions.length, 0)}
                    </h3>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pacientes Recentes */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Pacientes Recentes</CardTitle>
                    <CardDescription>Seus pacientes adicionados mais recentemente</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => navigate("/patients")}>
                    Ver todos <ChevronRight size={16} className="ml-1" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {isLoading ? (
                    <div className="flex justify-center py-6">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-psycho-primary"></div>
                    </div>
                  ) : (
                    <>
                      {recentPatients.length > 0 ? (
                        recentPatients.map((patient) => (
                          <div key={patient.id} 
                            className="flex items-center p-3 hover:bg-gray-50 rounded-md cursor-pointer"
                            onClick={() => navigate(`/patients/${patient.id}`)}
                          >
                            <div className="flex-shrink-0">
                              <div className="w-10 h-10 rounded-full bg-psycho-secondary text-white flex items-center justify-center">
                                {patient.name.charAt(0).toUpperCase()}
                              </div>
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900">{patient.name}</p>
                              <p className="text-xs text-gray-500">Adicionado em {new Date(patient.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className="ml-auto">
                              <ChevronRight size={16} className="text-gray-400" />
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-6">
                          <p className="text-gray-500">Nenhum paciente adicionado ainda</p>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="mt-2"
                            onClick={() => navigate("/patients/new")}
                          >
                            <Plus size={16} className="mr-1" /> Adicionar paciente
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Próximas Sessões */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Próximas Sessões</CardTitle>
                    <CardDescription>Sessões agendadas para os próximos 7 dias</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => navigate("/schedule")}>
                    Calendário <ChevronRight size={16} className="ml-1" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingSessions.map((session) => (
                    <div key={session.id} className="flex items-center p-3 hover:bg-gray-50 rounded-md cursor-pointer">
                      <div className="mr-3 w-12 text-center">
                        <p className="text-xs text-gray-500">{new Date(session.date).toLocaleString('default', { month: 'short' })}</p>
                        <p className="text-xl font-semibold text-gray-900">{new Date(session.date).getDate()}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{session.patientName}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(session.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <div className="ml-auto">
                        <Button variant="outline" size="sm">
                          <FileText size={14} className="mr-1" /> Notas
                        </Button>
                      </div>
                    </div>
                  ))}
                  <div className="pt-2 text-center">
                    <Button variant="outline" size="sm" onClick={() => navigate("/schedule")}>
                      <Plus size={16} className="mr-1" /> Agendar nova sessão
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sessões Recentes */}
            <Card className="lg:col-span-2">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Sessões Recentes</CardTitle>
                    <CardDescription>Suas sessões mais recentes com pacientes</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {isLoading ? (
                    <div className="flex justify-center py-6">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-psycho-primary"></div>
                    </div>
                  ) : (
                    <>
                      {recentSessions.length > 0 ? (
                        recentSessions.map((session) => (
                          <div key={session.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-psycho-muted text-psycho-primary flex items-center justify-center mr-2">
                                  {session.patientName.charAt(0)}
                                </div>
                                <div>
                                  <h4 className="font-medium">{session.patientName}</h4>
                                  <p className="text-xs text-gray-500">
                                    {new Date(session.date).toLocaleDateString()} às {' '}
                                    {new Date(session.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </p>
                                </div>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => navigate(`/patients/${session.patientId}`)}
                              >
                                Ver paciente
                              </Button>
                            </div>
                            <div>
                              <p className="text-gray-700 text-sm">{session.notes}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-6">
                          <p className="text-gray-500">Nenhuma sessão registrada ainda</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;