
import React, { useEffect, useState } from "react";
import { usePatientStore } from "@/stores/patientStore";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Payment, PaymentMethod, PaymentStatus } from "@/stores/slices/financialSlice";
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
import { MoreHorizontal, FileText, Trash, Receipt } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import ReceiptModal from "./ReceiptModal";

interface PaymentListProps {
  patientId?: string;
  limit?: number;
}

const formatCurrency = (value: number): string => {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
};

const getPaymentMethodLabel = (method: PaymentMethod): string => {
  const methods: Record<PaymentMethod, string> = {
    pix: "PIX",
    cash: "Dinheiro",
    creditCard: "Cartão de Crédito",
    debitCard: "Cartão de Débito",
    bankTransfer: "Transferência",
    other: "Outro"
  };
  return methods[method];
};

const getStatusBadge = (status: PaymentStatus) => {
  const variants: Record<PaymentStatus, { variant: "default" | "outline" | "secondary" | "destructive" | null, label: string }> = {
    paid: { variant: "default", label: "Pago" },
    pending: { variant: "outline", label: "Pendente" },
    partial: { variant: "secondary", label: "Parcial" },
    cancelled: { variant: "destructive", label: "Cancelado" }
  };
  
  const { variant, label } = variants[status];
  return <Badge variant={variant}>{label}</Badge>;
};

const PaymentList: React.FC<PaymentListProps> = ({ patientId, limit }) => {
  const { payments, generateReceipt, deletePayment, patients } = usePatientStore();
  const [isLoading, setIsLoading] = useState(true);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  
  useEffect(() => {
    // Simulando um tempo de carregamento
    const timer = setTimeout(() => {
      let filtered = [...payments];
      
      if (patientId) {
        filtered = filtered.filter(p => p.patientId === patientId);
      }
      
      // Ordenar por data (mais recentes primeiro)
      filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      if (limit && limit > 0) {
        filtered = filtered.slice(0, limit);
      }
      
      setFilteredPayments(filtered);
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [payments, patientId, limit]);
  
  const handleDeletePayment = async (id: string) => {
    try {
      await deletePayment(id);
      toast({
        title: "Pagamento excluído",
        description: "O pagamento foi excluído com sucesso"
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível excluir o pagamento",
        variant: "destructive"
      });
    }
  };
  
  const handleGenerateReceipt = async (payment: Payment) => {
    try {
      if (!payment.receiptNumber) {
        await generateReceipt(payment.id);
      }
      setSelectedPayment(payment);
      setIsReceiptModalOpen(true);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível gerar o recibo",
        variant: "destructive"
      });
    }
  };
  
  const getPatientName = (patientId: string) => {
    return patients.find(p => p.id === patientId)?.name || "Paciente não encontrado";
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
  
  if (filteredPayments.length === 0) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Nenhum pagamento encontrado</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {patientId ? 
            "Este paciente ainda não possui pagamentos registrados." : 
            "Não há pagamentos registrados no sistema."}
        </p>
      </div>
    );
  }
  
  return (
    <>
      <div className="w-full overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              {!patientId && <TableHead>Paciente</TableHead>}
              <TableHead>Descrição</TableHead>
              <TableHead>Forma de Pagamento</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPayments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>{format(new Date(payment.date), "dd/MM/yyyy", { locale: ptBR })}</TableCell>
                {!patientId && <TableCell>{getPatientName(payment.patientId)}</TableCell>}
                <TableCell>{payment.description}</TableCell>
                <TableCell>{getPaymentMethodLabel(payment.method)}</TableCell>
                <TableCell>{formatCurrency(payment.amount)}</TableCell>
                <TableCell>{getStatusBadge(payment.status)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleGenerateReceipt(payment)}>
                        <Receipt className="mr-2 h-4 w-4" /> Gerar Recibo
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeletePayment(payment.id)}>
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
      
      {selectedPayment && (
        <ReceiptModal
          payment={selectedPayment}
          isOpen={isReceiptModalOpen}
          onClose={() => setIsReceiptModalOpen(false)}
        />
      )}
    </>
  );
};

export default PaymentList;
