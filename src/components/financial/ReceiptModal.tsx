
import React, { useRef } from "react";
import { usePatientStore } from "@/stores/patientStore";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Payment } from "@/stores/slices/financialSlice";
import { Printer, Download } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

interface ReceiptModalProps {
  payment: Payment;
  isOpen: boolean;
  onClose: () => void;
}

const formatCurrency = (value: number): string => {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
};

const getPaymentMethodLabel = (method: string): string => {
  const methods: Record<string, string> = {
    pix: "PIX",
    cash: "Dinheiro",
    creditCard: "Cartão de Crédito",
    debitCard: "Cartão de Débito",
    bankTransfer: "Transferência Bancária",
    other: "Outro"
  };
  return methods[method] || method;
};

const ReceiptModal: React.FC<ReceiptModalProps> = ({
  payment,
  isOpen,
  onClose
}) => {
  const { patients } = usePatientStore();
  const receiptRef = useRef<HTMLDivElement>(null);
  
  const patient = patients.find(p => p.id === payment.patientId);
  
  // Professional information - normally this would come from a store or context
  const professional = {
    name: "Dr. Maria Silva",
    profession: "Psicóloga",
    licenseNumber: "CRP: 01/12345",
    cpf: "123.456.789-10",
    address: "Av. Paulista, 1000, São Paulo - SP",
    email: "contato@mariasilva.com.br",
    phone: "(11) 99999-9999"
  };
  
  const handlePrint = () => {
    const receiptContent = receiptRef.current;
    if (!receiptContent) return;
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    const printDocument = printWindow.document;
    printDocument.write('<html><head><title>Recibo de Pagamento</title>');
    printDocument.write('<style>');
    printDocument.write(`
      body { font-family: Arial, sans-serif; margin: 20px; }
      .receipt { padding: 20px; }
      .receipt-header { text-align: center; margin-bottom: 30px; }
      .receipt-title { font-size: 24px; font-weight: bold; margin-bottom: 5px; }
      .receipt-number { font-size: 16px; color: #666; }
      .receipt-body { margin-bottom: 30px; }
      .receipt-row { margin-bottom: 10px; display: flex; }
      .receipt-label { font-weight: bold; width: 150px; }
      .receipt-value { flex: 1; }
      .receipt-amount { font-size: 20px; font-weight: bold; text-align: right; margin-top: 20px; }
      .receipt-footer { margin-top: 50px; text-align: center; }
      .signature-line { width: 70%; margin: 50px auto 10px; border-top: 1px solid #000; }
      .professional-info { border-top: 1px dashed #ccc; margin-top: 30px; padding-top: 20px; font-size: 14px; }
    `);
    printDocument.write('</style></head><body>');
    printDocument.write(receiptContent.innerHTML);
    printDocument.write('</body></html>');
    printDocument.close();
    
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };
  
  const handleDownloadPDF = async () => {
    const receiptContent = receiptRef.current;
    if (!receiptContent) return;
    
    try {
      const canvas = await html2canvas(receiptContent);
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = canvas.height * imgWidth / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`recibo_${payment.receiptNumber || 'pagamento'}.pdf`);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Recibo de Pagamento</DialogTitle>
        </DialogHeader>
        
        <div className="bg-white rounded-md border p-6 my-4" ref={receiptRef}>
          <div className="receipt-header">
            <h2 className="text-2xl font-bold mb-1 text-indigo-700">RECIBO DE PAGAMENTO</h2>
            <p className="text-gray-500">
              {payment.receiptNumber || "Recibo sem número"}
            </p>
          </div>
          
          <div className="receipt-body">
            <div className="mb-6">
              <div className="grid grid-cols-[150px_1fr] mb-2">
                <span className="font-semibold">Cliente:</span>
                <span>{patient?.name || "Cliente não encontrado"}</span>
              </div>
              
              <div className="grid grid-cols-[150px_1fr] mb-2">
                <span className="font-semibold">CPF:</span>
                <span>{patient?.documents ? patient.documents.toString() : "Não informado"}</span>
              </div>
              
              <div className="grid grid-cols-[150px_1fr] mb-2">
                <span className="font-semibold">Data:</span>
                <span>{format(new Date(payment.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</span>
              </div>
              
              <div className="grid grid-cols-[150px_1fr] mb-2">
                <span className="font-semibold">Descrição:</span>
                <span>{payment.description}</span>
              </div>
              
              <div className="grid grid-cols-[150px_1fr] mb-2">
                <span className="font-semibold">Forma de Pagamento:</span>
                <span>{getPaymentMethodLabel(payment.method)}</span>
              </div>
              
              {payment.notes && (
                <div className="grid grid-cols-[150px_1fr] mb-2">
                  <span className="font-semibold">Observações:</span>
                  <span>{payment.notes}</span>
                </div>
              )}
            </div>
            
            <div className="text-right text-2xl font-bold mt-8 text-indigo-700">
              {formatCurrency(payment.amount)}
            </div>
            
            <div className="professional-info text-gray-700 mt-8">
              <div className="text-center mb-4">
                <h3 className="font-bold">Dados do Profissional</h3>
              </div>
              
              <div className="grid grid-cols-[150px_1fr] mb-1">
                <span className="font-semibold">Nome:</span>
                <span>{professional.name}</span>
              </div>
              
              <div className="grid grid-cols-[150px_1fr] mb-1">
                <span className="font-semibold">Profissão:</span>
                <span>{professional.profession}</span>
              </div>
              
              <div className="grid grid-cols-[150px_1fr] mb-1">
                <span className="font-semibold">Registro:</span>
                <span>{professional.licenseNumber}</span>
              </div>
              
              <div className="grid grid-cols-[150px_1fr] mb-1">
                <span className="font-semibold">CPF:</span>
                <span>{professional.cpf}</span>
              </div>
              
              <div className="grid grid-cols-[150px_1fr] mb-1">
                <span className="font-semibold">Endereço:</span>
                <span>{professional.address}</span>
              </div>
              
              <div className="grid grid-cols-[150px_1fr] mb-1">
                <span className="font-semibold">Contato:</span>
                <span>{professional.email} | {professional.phone}</span>
              </div>
            </div>
          </div>
          
          <div className="receipt-footer">
            <div className="signature-line"></div>
            <p>Assinatura</p>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" /> Imprimir
          </Button>
          <Button onClick={handleDownloadPDF}>
            <Download className="mr-2 h-4 w-4" /> Baixar PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReceiptModal;
