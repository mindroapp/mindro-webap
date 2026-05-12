import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePatientStore } from "@/stores/patientStore";
import { Session } from "@/stores/patientStore";
import Header from "@/components/Header";
import SidebarMenu from "@/components/SidebarMenu";
import SessionCard from "@/components/SessionCard";
import SessionEditModal from "@/components/SessionEditModal";
import SessionFormModal from "@/components/SessionFormModal";
import ElectronicRecordModal from "@/components/ElectronicRecordModal";
import PatientEditModal from "@/components/PatientEditModal";
import InitialAssessmentModal from "@/components/InitialAssessmentModal";
import TeleconsultationModal from "@/components/TeleconsultationModal";
import SessionTimeline from "@/components/SessionTimeline";
import Pagination from "@/components/Pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  FileText,
  Plus,
  ArrowLeft,
  Calendar,
  Edit,
  Upload,
  Trash,
  Download,
  CreditCard,
  Receipt,
  Check,
  Video,
  FileDown,
  X
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Label } from "@/components/ui/label";
import { formatPhoneNumber } from "@/lib/format";

const ITEMS_PER_PAGE = 10;

const crc16ccitt = (str: string): string => {
  let crc = 0xFFFF;
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1;
    }
  }
  return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
};

const buildPixPayload = (key: string, holderName: string, amount: number): string => {
  const f = (id: string, val: string) => `${id}${String(val.length).padStart(2, '0')}${val}`;
  const info = f('00', 'BR.GOV.BCB.PIX') + f('01', key);
  const name = (holderName || 'PROFISSIONAL').slice(0, 25);
  const body =
    f('00', '01') + f('26', info) + f('52', '0000') + f('53', '986') +
    f('54', amount.toFixed(2)) + f('58', 'BR') +
    f('59', name) + f('60', 'BRASIL') +
    f('62', f('05', '***')) + '6304';
  return body + crc16ccitt(body);
};

const defaultPixConfig = {
  pixKeyType: 'Chave aleatória',
  pixKey: '',
  observation: '',
};

const PatientDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { selectedPatient, fetchPatient, isLoading, payments, updatePayment } = usePatientStore();
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const [viewingElectronicRecord, setViewingElectronicRecord] = useState<Session | null>(null);
  const [isEditingPatient, setIsEditingPatient] = useState(false);
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState(false);
  const [isNewSessionModalOpen, setIsNewSessionModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("initial-record");
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [isTeleconsultationOpen, setIsTeleconsultationOpen] = useState(false);
  const [selectedPaymentIds, setSelectedPaymentIds] = useState<Set<string>>(new Set());
  const [isReportPdfModalOpen, setIsReportPdfModalOpen] = useState(false);
  const [isPixConfigOpen, setIsPixConfigOpen] = useState(false);
  const [pixConfig, setPixConfig] = useState<typeof defaultPixConfig>(() => {
    try {
      const saved = localStorage.getItem('mindro_pix_config');
      return saved ? JSON.parse(saved) : { ...defaultPixConfig };
    } catch { return { ...defaultPixConfig }; }
  });
  
  // Session filters
  const [sessionsFilters, setSessionsFilters] = useState({
    dateStart: "",
    dateEnd: "",
    approach: "all",
    mood: "all"
  });
  
  // Filters and pagination states
  const [financialFilters, setFinancialFilters] = useState({
    dateStart: "",
    dateEnd: "",
    status: "all",
    method: "all",
    currentPage: 1
  });

  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      fetchPatient(id);
    }
  }, [id]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
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

  const handleEditSession = (session: Session) => {
    setEditingSession(session);
  };
  
  const handleViewElectronicRecord = (session: Session) => {
    setViewingElectronicRecord(session);
  };

  const handleEditPatient = () => {
    setIsEditingPatient(true);
  };



  const handleConfirmPayment = async (paymentId: string) => {
    await updatePayment(paymentId, { status: "paid" });
    toast({
      title: "Pagamento confirmado",
      description: "O status foi atualizado para PAGO e o paciente foi notificado no WhatsApp.",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-800">Pago</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Cancelado</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPaymentStatusLabel = (status: string) => {
    const labels: Record<string, string> = { paid: "Pago", pending: "Pendente", cancelled: "Cancelado", partial: "Parcial" };
    return labels[status] || status;
  };

  const handleConfirmPdfGeneration = () => {
    localStorage.setItem('mindro_pix_config', JSON.stringify(pixConfig));
    setIsPixConfigOpen(false);
    generatePdfReport();
  };

  const getPaymentMethodLabel = (method: string) => {
    const methods: Record<string, string> = {
      pix: "PIX",
      cash: "Dinheiro",
      creditCard: "Cartão de Crédito",
      debitCard: "Cartão de Débito",
      bankTransfer: "Transferência"
    };
    return methods[method] || method;
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

  const filteredSessions = useMemo(() => {
    if (!selectedPatient?.sessions) return [];
    
    return selectedPatient.sessions.filter(session => {
      const sessionDate = new Date(session.date);
      const startDate = sessionsFilters.dateStart ? new Date(sessionsFilters.dateStart) : null;
      const endDate = sessionsFilters.dateEnd ? new Date(sessionsFilters.dateEnd) : null;
      
      const matchesDateRange = (
        (!startDate || sessionDate >= startDate) &&
        (!endDate || sessionDate <= endDate)
      );
      const matchesApproach = sessionsFilters.approach === "all" || session.approach === sessionsFilters.approach;
      const matchesMood = sessionsFilters.mood === "all" || session.mood === parseInt(sessionsFilters.mood);
      
      return matchesDateRange && matchesApproach && matchesMood;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [selectedPatient?.sessions, sessionsFilters]);

  const handleTogglePaymentSelection = (paymentId: string) => {
    const newSelected = new Set(selectedPaymentIds);
    if (newSelected.has(paymentId)) {
      newSelected.delete(paymentId);
    } else {
      newSelected.add(paymentId);
    }
    setSelectedPaymentIds(newSelected);
  };

  const generatePdfReport = () => {
    const paymentsForReport = selectedPaymentIds.size > 0
      ? filteredPayments.filter(p => selectedPaymentIds.has(p.id))
      : filteredPayments;

    if (paymentsForReport.length === 0) {
      toast({
        title: "Nenhum registro encontrado",
        description: "Não há sessões para gerar o relatório com os filtros atuais.",
        variant: "destructive"
      });
      return;
    }

    const pendingAmount = paymentsForReport
      .filter(p => p.status === "pending")
      .reduce((sum, p) => sum + p.amount, 0);

    const holderName = (pixConfig.observation || '').split('\n')[0].trim() || 'PROFISSIONAL';
    const pixPayload = pixConfig.pixKey
      ? buildPixPayload(pixConfig.pixKey, holderName, pendingAmount > 0 ? pendingAmount : paymentsForReport.reduce((s, p) => s + p.amount, 0))
      : null;
    const qrUrl = pixPayload
      ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(pixPayload)}`
      : null;

    const totalAPagar = pendingAmount > 0 ? pendingAmount : paymentsForReport.reduce((s, p) => s + p.amount, 0);

    const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Cobrança – ${selectedPatient?.name}</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#111;background:#fff;font-size:13px;line-height:1.5}
    .wrap{max-width:720px;margin:0 auto;padding:40px 32px}
    .top{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid #111;padding-bottom:16px;margin-bottom:24px}
    .brand{font-size:26px;font-weight:800;letter-spacing:-1px;color:#2563eb}
    .meta{text-align:right;font-size:12px;color:#555}
    .meta b{display:block;font-size:14px;color:#111;margin-bottom:2px}
    .patient{margin-bottom:24px}
    .patient p{font-size:14px}
    .patient .name{font-size:18px;font-weight:700;margin-bottom:2px}
    table{width:100%;border-collapse:collapse;margin-bottom:20px}
    th{background:#f3f4f6;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.4px;padding:8px 10px;text-align:left;border-bottom:2px solid #d1d5db;color:#374151}
    td{padding:8px 10px;border-bottom:1px solid #e5e7eb;color:#374151}
    tr:last-child td{border-bottom:none}
    .val{text-align:right;font-weight:600}
    .total-box{background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;padding:14px 16px;margin-bottom:24px}
    .total-row{display:flex;justify-content:space-between;padding:4px 0;font-size:13px;color:#374151}
    .total-row.big{font-size:15px;font-weight:700;color:#111;border-top:1px solid #d1d5db;margin-top:6px;padding-top:10px}
    .pix{display:flex;gap:24px;align-items:center;background:#faf5ff;border:1px solid #e9d5ff;border-radius:8px;padding:20px;margin-bottom:24px}
    .pix-text h3{font-size:13px;font-weight:700;color:#6d28d9;margin-bottom:8px}
    .pix-text p{margin-bottom:4px;color:#374151}
    .pix-text .key{font-size:14px;font-weight:700;color:#111;word-break:break-all;margin-top:6px}
    .pix-text .amount{font-size:16px;font-weight:800;color:#6d28d9;margin-top:10px}
    .pix-text .obs{white-space:pre-line;font-size:12px;color:#6b7280;margin-top:8px;border-top:1px solid #e9d5ff;padding-top:8px}
    .qr{flex-shrink:0;text-align:center}
    .qr img{border-radius:6px;border:3px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.1)}
    .qr span{display:block;font-size:10px;color:#9ca3af;margin-top:4px}
    .foot{text-align:center;font-size:11px;color:#9ca3af;border-top:1px solid #e5e7eb;padding-top:14px}
    @media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}.wrap{padding:20px}}
  </style>
</head>
<body>
<div class="wrap">
  <div class="top">
    <div class="brand">mindro</div>
    <div class="meta"><b>Relatório de Cobrança</b>${new Date().toLocaleDateString('pt-BR')}</div>
  </div>

  <div class="patient">
    <p class="name">${selectedPatient?.name}</p>
    <p style="color:#555">Paciente</p>
  </div>

  <table>
    <thead><tr><th>Data</th><th>Descrição</th><th style="text-align:right">Valor</th></tr></thead>
    <tbody>
      ${paymentsForReport.map(p => `
        <tr>
          <td style="white-space:nowrap">${new Date(p.date).toLocaleDateString('pt-BR')}</td>
          <td>${p.description || 'Sessão de psicoterapia'}</td>
          <td class="val">R$ ${p.amount.toFixed(2)}</td>
        </tr>`).join('')}
    </tbody>
  </table>

  <div class="total-box">
    <div class="total-row"><span>Sessões incluídas</span><span>${paymentsForReport.length}</span></div>
    <div class="total-row big"><span>Total a pagar</span><span>R$ ${totalAPagar.toFixed(2)}</span></div>
  </div>

  ${pixConfig.pixKey ? `
  <div class="pix">
    <div class="pix-text" style="flex:1">
      <h3>Pagamento via PIX</h3>
      <p><b>Tipo:</b> ${pixConfig.pixKeyType}</p>
      <p class="key">${pixConfig.pixKey}</p>
      <p class="amount">R$ ${totalAPagar.toFixed(2)}</p>
      ${pixConfig.observation ? `<p class="obs">${pixConfig.observation}</p>` : ''}
    </div>
    ${qrUrl ? `<div class="qr"><img src="${qrUrl}" width="160" height="160" alt="QR PIX"><span>Escaneie para pagar</span></div>` : ''}
  </div>` : ''}

  <div class="foot">Mindro · Plataforma de Gestão Clínica</div>
</div>
<script>
  var imgs = document.images;
  var loaded = 0;
  function tryPrint() { loaded++; if (loaded >= imgs.length) window.print(); }
  if (imgs.length === 0) { window.print(); }
  else { for (var i = 0; i < imgs.length; i++) { imgs[i].onload = tryPrint; imgs[i].onerror = tryPrint; } }
</script>
</body>
</html>`;

    const iframe = document.createElement('iframe');
    iframe.style.cssText = 'position:fixed;top:0;left:0;width:1px;height:1px;opacity:0;border:none;';
    document.body.appendChild(iframe);
    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(html);
      doc.close();
    }
    setTimeout(() => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
      setTimeout(() => document.body.removeChild(iframe), 3000);
    }, 400);
  };



  const filteredPayments = useMemo(() => {
    const patientPayments = payments.filter(p => p.patientId === selectedPatient?.id);
    
    let filtered = patientPayments.filter(payment => {
      const paymentDate = new Date(payment.date);
      const startDate = financialFilters.dateStart ? new Date(financialFilters.dateStart) : null;
      const endDate = financialFilters.dateEnd ? new Date(financialFilters.dateEnd) : null;
      
      const matchesDateRange = (
        (!startDate || paymentDate >= startDate) &&
        (!endDate || paymentDate <= endDate)
      );
      const matchesStatus = financialFilters.status === "all" || payment.status === financialFilters.status;
      const matchesMethod = financialFilters.method === "all" || payment.method === financialFilters.method;
      
      return matchesDateRange && matchesStatus && matchesMethod;
    });

    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return filtered;
  }, [payments, selectedPatient?.id, financialFilters]);



  const financialTotalPages = Math.ceil(filteredPayments.length / ITEMS_PER_PAGE);
  const paginatedPayments = useMemo(() => filteredPayments.slice(
    (financialFilters.currentPage - 1) * ITEMS_PER_PAGE,
    financialFilters.currentPage * ITEMS_PER_PAGE
  ), [filteredPayments, financialFilters.currentPage]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex">
        <div className="w-64 hidden md:block">
          <SidebarMenu />
        </div>
        <div className="flex-1">
          <Header />
          <main className="p-4 md:p-6">
            <div className="space-y-4">
              <Skeleton className="h-12 w-64" />
              <Skeleton className="h-48 w-full" />
              <div className="grid gap-4">
                <Skeleton className="h-36 w-full" />
                <Skeleton className="h-36 w-full" />
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!selectedPatient) {
    return (
      <div className="min-h-screen bg-background flex">
        <div className="w-64 hidden md:block">
          <SidebarMenu />
        </div>
        <div className="flex-1">
          <Header />
          <main className="p-4 md:p-6">
            <div className="text-center py-12">
              <h2 className="text-lg font-medium mb-2">Paciente não encontrado</h2>
              <p className="text-muted-foreground mb-4">
                O paciente que você está procurando não existe ou foi removido.
              </p>
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
    <div className="min-h-screen bg-background flex">
      <div className="w-64 hidden md:block">
        <SidebarMenu />
      </div>
      <div className="flex-1">
        <Header />
        <main className="p-4 md:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex items-center">
              <Button variant="ghost" size="sm" className="mr-2 md:mr-4" onClick={() => navigate("/patients")}>
                <ArrowLeft size={16} className="mr-1" /> <span className="hidden sm:inline">Voltar</span>
              </Button>
              <h1 className="text-xl md:text-2xl font-bold">Detalhes do Paciente</h1>
            </div>
          </div>
  
          <Card className="mb-6">
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12 flex-shrink-0">
                  <AvatarFallback className="bg-primary text-primary-foreground text-lg font-semibold">
                    {getInitials(selectedPatient.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-6">
                  <div className="flex-1">
                    <h2 className="text-lg md:text-xl font-bold">{selectedPatient.name}</h2>
                    <div className="flex flex-wrap gap-4 mt-2 text-xs md:text-sm">
                      <div className="flex items-center gap-1">
                        <span className="text-muted-foreground">Idade:</span>
                        <span className="font-medium">{calculateAge(selectedPatient.birthdate)} anos</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-muted-foreground">Nascimento:</span>
                        <span className="font-medium">{formatDate(selectedPatient.birthdate)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-muted-foreground">Telefone:</span>
                        <span className="font-medium">{formatPhoneNumber(selectedPatient.phone)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-muted-foreground">Desde:</span>
                        <span className="font-medium">{formatDate(selectedPatient.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-muted-foreground">Sessões:</span>
                        <span className="font-medium">{selectedPatient.sessions.length}</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleEditPatient} className="flex-shrink-0">
                    <Edit size={16} className="mr-1" /> <span className="hidden sm:inline">Editar</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
  
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6 w-full flex overflow-x-auto">
              <TabsTrigger value="initial-record" className="flex-1 text-xs md:text-sm">Avaliação Inicial</TabsTrigger>
            <TabsTrigger value="sessions" className="flex-1 text-xs md:text-sm">Sessões ({selectedPatient.sessions.length})</TabsTrigger>
              <TabsTrigger value="financial" className="flex-1 text-xs md:text-sm">Financeiro ({filteredPayments.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="initial-record" className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <h2 className="text-lg md:text-xl font-semibold">Avaliação Inicial</h2>
                <Button onClick={() => { setActiveTab("initial-record"); setIsAssessmentModalOpen(true); }} size="sm">
                  <Plus size={16} className="mr-1" /> 
                  {selectedPatient.initialRecord ? "Editar Avaliação" : "Criar Avaliação"}
                </Button>
              </div>
  
              {!selectedPatient.initialRecord ? (
                <div className="text-center py-12 border border-dashed border-border rounded-lg bg-card">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                    <FileText size={24} className="text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">Ainda sem avaliação inicial</h3>
                  <p className="text-muted-foreground mb-4">
                    A avaliação inicial deste paciente ainda não foi registrada.
                  </p>
                  <Button onClick={() => { setActiveTab("initial-record"); setIsAssessmentModalOpen(true); }}>
                    <Plus size={16} className="mr-1" /> Criar avaliação inicial
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedPatient.initialRecord.reasonForConsultation && (
                    <div className="border-l-4 border-primary pl-4">
                      <h3 className="text-sm font-semibold text-primary mb-2">Motivo da Consulta</h3>
                      <p className="text-sm text-foreground">{selectedPatient.initialRecord.reasonForConsultation}</p>
                    </div>
                  )}

                  {selectedPatient.initialRecord.familyHistory && (
                    <div className="border-l-4 border-primary pl-4">
                      <h3 className="text-sm font-semibold text-primary mb-2">Histórico Familiar</h3>
                      <p className="text-sm text-foreground">{selectedPatient.initialRecord.familyHistory}</p>
                    </div>
                  )}

                  {selectedPatient.initialRecord.medicalHistory && (
                    <div className="border-l-4 border-primary pl-4">
                      <h3 className="text-sm font-semibold text-primary mb-2">Histórico Médico</h3>
                      <p className="text-sm text-foreground">{selectedPatient.initialRecord.medicalHistory}</p>
                    </div>
                  )}

                  {selectedPatient.initialRecord.previousTreatment && (
                    <div className="border-l-4 border-primary pl-4">
                      <h3 className="text-sm font-semibold text-primary mb-2">Tratamento Anterior</h3>
                      <p className="text-sm text-foreground">{selectedPatient.initialRecord.previousTreatment}</p>
                    </div>
                  )}

                  {selectedPatient.initialRecord.mentalStatusExam && (
                    <div className="border-l-4 border-primary pl-4">
                      <h3 className="text-sm font-semibold text-primary mb-2">Exame do Estado Mental</h3>
                      <p className="text-sm text-foreground">{selectedPatient.initialRecord.mentalStatusExam}</p>
                    </div>
                  )}

                  {selectedPatient.initialRecord.initialDiagnosis && (
                    <div className="border-l-4 border-primary pl-4">
                      <h3 className="text-sm font-semibold text-primary mb-2">Diagnóstico Inicial</h3>
                      <p className="text-sm text-foreground">{selectedPatient.initialRecord.initialDiagnosis}</p>
                    </div>
                  )}

                  {selectedPatient.initialRecord.treatmentPlan && (
                    <div className="border-l-4 border-primary pl-4">
                      <h3 className="text-sm font-semibold text-primary mb-2">Plano de Tratamento</h3>
                      <p className="text-sm text-foreground">{selectedPatient.initialRecord.treatmentPlan}</p>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="sessions" className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <h2 className="text-lg md:text-xl font-semibold">Notas de Sessão</h2>
                <Button onClick={() => { setActiveTab("sessions"); setIsNewSessionModalOpen(true); }} size="sm">
                  <Plus size={16} className="mr-1" /> Nova Sessão
                </Button>
              </div>

              <div className="flex flex-col gap-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Data Início</label>
                    <Input
                      type="date"
                      value={sessionsFilters.dateStart}
                      onChange={(e) => setSessionsFilters(prev => ({ ...prev, dateStart: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Data Fim</label>
                    <Input
                      type="date"
                      value={sessionsFilters.dateEnd}
                      onChange={(e) => setSessionsFilters(prev => ({ ...prev, dateEnd: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Abordagem</label>
                    <Select value={sessionsFilters.approach} onValueChange={(value) => setSessionsFilters(prev => ({ ...prev, approach: value }))}>
                      <SelectTrigger>
                        <SelectValue />
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
                  </div>
                  <div className="space-y-2 flex flex-col">
                    <label className="text-sm font-medium">Humor</label>
                    <div className="flex gap-2 items-center flex-wrap">
                      <Select value={sessionsFilters.mood} onValueChange={(value) => setSessionsFilters(prev => ({ ...prev, mood: value }))}>
                        <SelectTrigger className="flex-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          <SelectItem value="1">😞</SelectItem>
                          <SelectItem value="2">😕</SelectItem>
                          <SelectItem value="3">😐</SelectItem>
                          <SelectItem value="4">🙂</SelectItem>
                          <SelectItem value="5">😊</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="px-3"
                        onClick={() => setSessionsFilters({ dateStart: "", dateEnd: "", approach: "all", mood: "all" })}
                      >
                        <X size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
  
              {filteredSessions.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-border rounded-lg bg-card">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                    <Calendar size={24} className="text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">Nenhuma sessão encontrada</h3>
                  <p className="text-muted-foreground mb-4">
                    Tente ajustar os filtros de busca.
                  </p>
                  <Button onClick={() => { setActiveTab("sessions"); setIsNewSessionModalOpen(true); }}>
                    <Plus size={16} className="mr-1" /> Criar sessão
                  </Button>
                </div>
              ) : (
                <SessionTimeline
                  sessions={filteredSessions}
                  onEdit={handleEditSession}
                  onViewDetails={handleViewElectronicRecord}
                />
              )}
            </TabsContent>
  

            <TabsContent value="financial" className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <h2 className="text-lg md:text-xl font-semibold">Financeiro</h2>
                <div className="flex gap-2">
                  <Button onClick={() => setIsPixConfigOpen(true)} size="sm" variant="outline">
                    <FileDown size={16} className="mr-1" />
                    <span className="hidden sm:inline">Exportar Relatório</span>
                  </Button>
                </div>
              </div>

              <div className="flex flex-col gap-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Data Início</label>
                    <Input
                      type="date"
                      value={financialFilters.dateStart}
                      onChange={(e) => setFinancialFilters(prev => ({ ...prev, dateStart: e.target.value, currentPage: 1 }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Data Fim</label>
                    <Input
                      type="date"
                      value={financialFilters.dateEnd}
                      onChange={(e) => setFinancialFilters(prev => ({ ...prev, dateEnd: e.target.value, currentPage: 1 }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Status</label>
                    <Select value={financialFilters.status} onValueChange={(value) => setFinancialFilters(prev => ({ ...prev, status: value, currentPage: 1 }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos os status</SelectItem>
                        <SelectItem value="paid">Pago</SelectItem>
                        <SelectItem value="pending">Pendente</SelectItem>
                        <SelectItem value="cancelled">Cancelado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 flex flex-col">
                    <label className="text-sm font-medium">Forma de Pagamento</label>
                    <div className="flex gap-2">
                      <Select value={financialFilters.method} onValueChange={(value) => setFinancialFilters(prev => ({ ...prev, method: value, currentPage: 1 }))}>
                        <SelectTrigger className="flex-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos os métodos</SelectItem>
                          <SelectItem value="pix">PIX</SelectItem>
                          <SelectItem value="cash">Dinheiro</SelectItem>
                          <SelectItem value="creditCard">Cartão de Crédito</SelectItem>
                          <SelectItem value="debitCard">Cartão de Débito</SelectItem>
                          <SelectItem value="bankTransfer">Transferência</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="px-3"
                        onClick={() => setFinancialFilters({ dateStart: "", dateEnd: "", status: "all", method: "all", currentPage: 1 })}
                      >
                        <X size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              <Card>
                <CardContent className="p-4 md:p-6">
                  <div className="overflow-x-auto -mx-4 md:mx-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-8"></TableHead>
                          <TableHead>Data</TableHead>
                          <TableHead>Valor</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="hidden sm:table-cell">Pagamento</TableHead>
                          <TableHead>Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedPayments.map((payment) => (
                          <TableRow key={payment.id}>
                            <TableCell>
                              <Checkbox 
                                checked={selectedPaymentIds.has(payment.id)}
                                onCheckedChange={() => handleTogglePaymentSelection(payment.id)}
                              />
                            </TableCell>
                            <TableCell className="text-sm">
                              {new Date(payment.date).toLocaleDateString('pt-BR')}
                            </TableCell>
                            <TableCell className="font-medium text-sm">
                              R$ {payment.amount.toFixed(2)}
                            </TableCell>
                            <TableCell>
                              <Select value={payment.status} onValueChange={(value) => {
                                 updatePayment(payment.id, { status: value as typeof payment.status });
                               }}>
                                <SelectTrigger className="w-[140px] h-8">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="paid">Pago</SelectItem>
                                  <SelectItem value="pending">Pendente</SelectItem>
                                  <SelectItem value="cancelled">Cancelado</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                              <Select value={payment.method} onValueChange={(value) => {
                                 updatePayment(payment.id, { method: value as typeof payment.method });
                               }}>
                                <SelectTrigger className="w-[160px] h-8">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pix">PIX</SelectItem>
                                  <SelectItem value="cash">Dinheiro</SelectItem>
                                  <SelectItem value="creditCard">Cartão de Crédito</SelectItem>
                                  <SelectItem value="debitCard">Cartão de Débito</SelectItem>
                                  <SelectItem value="bankTransfer">Transferência</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="h-8 px-3"
                                onClick={() => { setSelectedPayment(payment); setIsReceiptModalOpen(true); }}
                              >
                                <Receipt className="h-3 w-3 mr-1" />
                                <span className="hidden sm:inline text-xs">Recibo</span>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  
                  {paginatedPayments.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">
                        Nenhum registro financeiro encontrado com os filtros selecionados.
                      </p>
                    </div>
                  )}
                  
                  {financialTotalPages > 1 && (
                    <Pagination
                      currentPage={financialFilters.currentPage}
                      totalPages={financialTotalPages}
                      onPageChange={(page) => setFinancialFilters(prev => ({ ...prev, currentPage: page }))}
                    />
                  )}
                </CardContent>
              </Card>
              
              <Dialog open={isReceiptModalOpen} onOpenChange={setIsReceiptModalOpen}>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Recibo de Pagamento</DialogTitle>
                  </DialogHeader>
                  {selectedPayment && (
                    <div className="space-y-4">
                      <div>
                        <strong>Paciente:</strong> {selectedPatient?.name}
                      </div>
                      <div>
                        <strong>Data:</strong> {new Date(selectedPayment.date).toLocaleDateString('pt-BR')}
                      </div>
                      <div>
                        <strong>Valor:</strong> R$ {selectedPayment.amount.toFixed(2)}
                      </div>
                      <div>
                        <strong>Status:</strong> {getStatusBadge(selectedPayment.status)}
                      </div>
                      <div>
                        <strong>Forma de Pagamento:</strong> {getPaymentMethodLabel(selectedPayment.method)}
                      </div>
                      <div>
                        <strong>Descrição:</strong> {selectedPayment.description}
                      </div>
                      <div>
                        <strong>Serviço Prestado:</strong> Sessão de psicoterapia individual
                      </div>
                      <div>
                        <strong>Recibo:</strong> {selectedPayment.receiptNumber || "-"}
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </TabsContent>
          </Tabs>

          <InitialAssessmentModal
            isOpen={isAssessmentModalOpen}
            onClose={() => setIsAssessmentModalOpen(false)}
            patientId={id || ""}
            initialRecord={selectedPatient.initialRecord}
          />

          <Dialog open={isPixConfigOpen} onOpenChange={setIsPixConfigOpen}>
            <DialogContent className="sm:max-w-sm">
              <DialogHeader>
                <DialogTitle>Dados do relatório</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-1">
                  <Label className="text-xs">Tipo de chave PIX</Label>
                  <Select value={pixConfig.pixKeyType} onValueChange={(v) => setPixConfig(p => ({ ...p, pixKeyType: v }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CPF">CPF</SelectItem>
                      <SelectItem value="CNPJ">CNPJ</SelectItem>
                      <SelectItem value="E-mail">E-mail</SelectItem>
                      <SelectItem value="Telefone">Telefone</SelectItem>
                      <SelectItem value="Chave aleatória">Chave aleatória</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Chave PIX</Label>
                  <Input
                    value={pixConfig.pixKey}
                    onChange={(e) => setPixConfig(p => ({ ...p, pixKey: e.target.value }))}
                    placeholder="Sua chave PIX"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Observação</Label>
                  <textarea
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
                    rows={3}
                    value={pixConfig.observation}
                    onChange={(e) => setPixConfig(p => ({ ...p, observation: e.target.value }))}
                    placeholder="Ex: João Silva · Nubank · Conta corrente"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setIsPixConfigOpen(false)}>Cancelar</Button>
                <Button onClick={handleConfirmPdfGeneration}>
                  <FileDown size={16} className="mr-1" /> Exportar Relatório
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {editingSession && id && (
            <SessionEditModal
              patientId={id}
              session={editingSession}
              isOpen={!!editingSession}
              onClose={() => setEditingSession(null)}
            />
          )}
          
          {viewingElectronicRecord && id && (
            <ElectronicRecordModal
              patientId={id}
              session={viewingElectronicRecord}
              isOpen={!!viewingElectronicRecord}
              onClose={() => setViewingElectronicRecord(null)}
            />
          )}

          {isEditingPatient && (
            <PatientEditModal
              patient={selectedPatient}
              isOpen={isEditingPatient}
              onClose={() => setIsEditingPatient(false)}
            />
          )}

          {id && (
            <SessionFormModal
              isOpen={isNewSessionModalOpen}
              onClose={() => setIsNewSessionModalOpen(false)}
              patientId={id}
            />
          )}

          {/* Modal de Teleconsulta */}
          {selectedPatient && (
            <TeleconsultationModal
              isOpen={isTeleconsultationOpen}
              onClose={() => setIsTeleconsultationOpen(false)}
              patientId={selectedPatient.id}
              patientName={selectedPatient.name}
              patientPhone={selectedPatient.phone}
              onStartCall={(roomLink) => {
                // O link para o profissional inclui role=professional
                const professionalLink = `${roomLink}&role=professional`;
                window.open(professionalLink, '_blank');
              }}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default PatientDetail;
