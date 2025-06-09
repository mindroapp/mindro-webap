
import React from "react";
import { usePatientStore, Session } from "@/stores/patientStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Timeline, TimelineItem } from "./ui/timeline";
import { FileText, History, ArrowUpDown, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PatientHistoryProps {
  patientId: string;
  isOpen: boolean;
  onClose: () => void;
}

const PatientHistory: React.FC<PatientHistoryProps> = ({ 
  patientId, 
  isOpen, 
  onClose 
}) => {
  const { patients } = usePatientStore();
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('desc');
  const [filterApproach, setFilterApproach] = React.useState<string>('all');
  const [searchTerm, setSearchTerm] = React.useState<string>('');
  const [activeTab, setActiveTab] = React.useState<string>('timeline');
  
  const patient = React.useMemo(() => {
    return patients.find(p => p.id === patientId);
  }, [patients, patientId]);
  
  const filteredSessions = React.useMemo(() => {
    if (!patient) return [];
    
    let sessions = [...patient.sessions];
    
    // Filter by approach
    if (filterApproach !== 'all') {
      sessions = sessions.filter(s => s.approach === filterApproach);
    }
    
    // Filter by search term
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      sessions = sessions.filter(s => 
        s.notes?.toLowerCase().includes(lowerSearchTerm) ||
        s.diagnosis?.toLowerCase().includes(lowerSearchTerm) ||
        s.clinicalNotes?.toLowerCase().includes(lowerSearchTerm) ||
        s.evolution?.toLowerCase().includes(lowerSearchTerm)
      );
    }
    
    // Sort by date
    sessions.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    });
    
    return sessions;
  }, [patient, filterApproach, searchTerm, sortDirection]);
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric'
    });
  };
  
  const getApproachLabel = (approach?: string) => {
    switch (approach) {
      case "cognitive": return "TCC";
      case "psychoanalysis": return "Psicanálise";
      case "behavioral": return "Comportamental";
      case "humanistic": return "Humanista";
      case "other": return "Outra";
      default: return "Não definida";
    }
  };
  
  if (!patient) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History size={18} />
            Histórico Completo do Paciente
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col md:flex-row gap-4 items-center mb-4">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar no histórico..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Select 
              value={filterApproach} 
              onValueChange={setFilterApproach}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Abordagem" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as abordagens</SelectItem>
                <SelectItem value="cognitive">TCC</SelectItem>
                <SelectItem value="psychoanalysis">Psicanálise</SelectItem>
                <SelectItem value="behavioral">Comportamental</SelectItem>
                <SelectItem value="humanistic">Humanista</SelectItem>
                <SelectItem value="other">Outra</SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSortDirection(d => d === 'asc' ? 'desc' : 'asc')}
              title={sortDirection === 'asc' ? 'Mais recente primeiro' : 'Mais antigo primeiro'}
            >
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="timeline">Linha do Tempo</TabsTrigger>
            <TabsTrigger value="diagnoses">Diagnósticos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="timeline" className="mt-4">
            {filteredSessions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Nenhum registro encontrado para os filtros selecionados.
              </div>
            ) : (
              <Timeline>
                {filteredSessions.map((session) => (
                  <TimelineItem key={session.id}>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{formatDate(session.date)}</h3>
                        {session.approach && (
                          <Badge variant="outline">
                            {getApproachLabel(session.approach)}
                          </Badge>
                        )}
                      </div>
                      
                      {session.clinicalNotes && (
                        <p className="text-sm text-gray-600 mt-1">{session.clinicalNotes}</p>
                      )}
                      
                      {session.diagnosis && (
                        <div className="mt-2">
                          <span className="text-xs font-medium text-psycho-primary">Diagnóstico:</span>
                          <p className="text-sm">{session.diagnosis}</p>
                        </div>
                      )}
                      
                      {session.evolution && (
                        <div className="mt-2">
                          <span className="text-xs font-medium text-psycho-primary">Evolução:</span>
                          <p className="text-sm">{session.evolution}</p>
                        </div>
                      )}
                    </div>
                  </TimelineItem>
                ))}
              </Timeline>
            )}
          </TabsContent>
          
          <TabsContent value="diagnoses" className="mt-4">
            <div className="space-y-4">
              {patient.sessions
                .filter(s => s.diagnosis)
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((session, index, arr) => {
                  // Check if this is the first occurrence of this diagnosis
                  const isFirstOccurrence = arr.findIndex(s => 
                    s.diagnosis === session.diagnosis
                  ) === index;
                  
                  // Only show unique diagnoses
                  return isFirstOccurrence ? (
                    <Card key={session.id}>
                      <CardHeader className="py-3">
                        <CardTitle className="text-base font-medium flex items-center gap-2">
                          <FileText size={16} />
                          {session.diagnosis}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="py-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">
                            Primeira identificação: {formatDate(session.date)}
                          </span>
                          {session.approach && (
                            <Badge variant="outline">
                              {getApproachLabel(session.approach)}
                            </Badge>
                          )}
                        </div>
                        
                        {session.clinicalNotes && (
                          <p className="mt-2 text-sm">{session.clinicalNotes}</p>
                        )}
                      </CardContent>
                    </Card>
                  ) : null;
                })
                .filter(Boolean)}
                
              {patient.sessions.filter(s => s.diagnosis).length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Nenhum diagnóstico registrado.
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default PatientHistory;
