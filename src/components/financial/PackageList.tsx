
import React, { useEffect, useState } from "react";
import { usePatientStore } from "@/stores/patientStore";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { SessionPackage } from "@/stores/slices/financialSlice";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Trash, MinusCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";

interface PackageListProps {
  patientId?: string;
  limit?: number;
  onUseSession?: (packageId: string) => void;
}

const formatCurrency = (value: number): string => {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
};

const getStatusBadge = (status: "active" | "completed" | "cancelled") => {
  const variants: Record<typeof status, { variant: "default" | "outline" | "secondary" | "destructive" | null, label: string }> = {
    active: { variant: "default", label: "Ativo" },
    completed: { variant: "secondary", label: "Concluído" },
    cancelled: { variant: "destructive", label: "Cancelado" }
  };
  
  const { variant, label } = variants[status];
  return <Badge variant={variant}>{label}</Badge>;
};

const PackageList: React.FC<PackageListProps> = ({ patientId, limit, onUseSession }) => {
  const { packages, deletePackage, useSessionFromPackage, patients } = usePatientStore();
  const [isLoading, setIsLoading] = useState(true);
  const [filteredPackages, setFilteredPackages] = useState<SessionPackage[]>([]);
  
  useEffect(() => {
    // Simulando um tempo de carregamento
    const timer = setTimeout(() => {
      let filtered = [...packages];
      
      if (patientId) {
        filtered = filtered.filter(p => p.patientId === patientId);
      }
      
      // Ordenar por data (mais recentes primeiro)
      filtered.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
      
      if (limit && limit > 0) {
        filtered = filtered.slice(0, limit);
      }
      
      setFilteredPackages(filtered);
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [packages, patientId, limit]);
  
  const handleDeletePackage = async (id: string) => {
    try {
      await deletePackage(id);
      toast({
        title: "Pacote excluído",
        description: "O pacote foi excluído com sucesso"
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível excluir o pacote",
        variant: "destructive"
      });
    }
  };
  
  const handleUseSession = async (packageId: string) => {
    try {
      await useSessionFromPackage(packageId);
      
      if (onUseSession) {
        onUseSession(packageId);
      }
      
      toast({
        title: "Sessão utilizada",
        description: "Uma sessão foi utilizada do pacote"
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível utilizar a sessão",
        variant: "destructive"
      });
    }
  };
  
  const getPatientName = (patientId: string) => {
    return patients.find(p => p.id === patientId)?.name || "Paciente não encontrado";
  };
  
  const getProgressPercentage = (pkg: SessionPackage) => {
    return 100 - (pkg.remainingSessions / pkg.totalSessions * 100);
  };
  
  if (isLoading) {
    return (
      <div className="w-full space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }
  
  if (filteredPackages.length === 0) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Nenhum pacote encontrado</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {patientId ? 
            "Este paciente ainda não possui pacotes de sessões registrados." : 
            "Não há pacotes de sessões registrados no sistema."}
        </p>
      </div>
    );
  }
  
  return (
    <div className="w-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            {!patientId && <TableHead>Paciente</TableHead>}
            <TableHead>Início</TableHead>
            <TableHead>Sessões</TableHead>
            <TableHead>Progresso</TableHead>
            <TableHead>Valor Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredPackages.map((pkg) => (
            <TableRow key={pkg.id}>
              <TableCell>{pkg.name}</TableCell>
              {!patientId && <TableCell>{getPatientName(pkg.patientId)}</TableCell>}
              <TableCell>{format(new Date(pkg.startDate), "dd/MM/yyyy", { locale: ptBR })}</TableCell>
              <TableCell>{`${pkg.remainingSessions} de ${pkg.totalSessions}`}</TableCell>
              <TableCell>
                <div className="w-full">
                  <Progress value={getProgressPercentage(pkg)} className="h-2" />
                </div>
              </TableCell>
              <TableCell>{formatCurrency(pkg.totalValue)}</TableCell>
              <TableCell>{getStatusBadge(pkg.status)}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {pkg.status === "active" && pkg.remainingSessions > 0 && (
                      <DropdownMenuItem onClick={() => handleUseSession(pkg.id)}>
                        <MinusCircle className="mr-2 h-4 w-4" /> Utilizar Sessão
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => handleDeletePackage(pkg.id)}>
                      <Trash className="mr-2 h-4 w-4" /> Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PackageList;
