import React, { useCallback, useEffect, useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Loader2,
  RefreshCw,
  Send,
  SkipForward,
  Trash2,
  XCircle,
  Zap,
} from "lucide-react";
import AdminLayout from "@/components/layouts/AdminLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import reminderAdminService, { Reminder, ReminderStatus } from "@/services/reminderAdminService";

// ─── Helpers ────────────────────────────────────────────────────────────────

const STATUS_LABELS: Record<ReminderStatus, string> = {
  pending: "Pendente",
  sent: "Enviado",
  failed: "Falhou",
  skipped: "Ignorado",
};

const STATUS_ICONS: Record<ReminderStatus, React.ReactNode> = {
  pending: <Clock className="h-3 w-3" />,
  sent: <CheckCircle2 className="h-3 w-3" />,
  failed: <XCircle className="h-3 w-3" />,
  skipped: <SkipForward className="h-3 w-3" />,
};

const STATUS_VARIANT: Record<
  ReminderStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  pending: "outline",
  sent: "default",
  failed: "destructive",
  skipped: "secondary",
};

const TYPE_LABELS: Record<string, string> = {
  PUBLIC_APPOINTMENT: "Agenda pública",
  SCHEDULE_EVENT: "Agenda interna",
};

const ALL_STATUSES: ReminderStatus[] = ["pending", "sent", "failed", "skipped"];

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return format(new Date(iso), "dd/MM/yy HH:mm", { locale: ptBR });
}

function formatPhone(phone: string) {
  const d = phone.replace(/\D/g, "");
  if (d.length === 13) return `+${d.slice(0, 2)} (${d.slice(2, 4)}) ${d.slice(4, 9)}-${d.slice(9)}`;
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  return phone;
}

// ─── Component ──────────────────────────────────────────────────────────────

const LIMIT = 50;

const RemindersManagement: React.FC = () => {
  const { toast } = useToast();

  const [activeStatus, setActiveStatus] = useState<ReminderStatus | "all">("all");
  const [items, setItems] = useState<Reminder[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Reminder | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [resending, setResending] = useState<string | null>(null);
  const [processing, setProcessing] = useState<ReminderStatus | null>(null);

  const fetchPage = useCallback(
    async (status: ReminderStatus | "all", p: number) => {
      setLoading(true);
      try {
        const res = await reminderAdminService.list({
          status: status === "all" ? undefined : status,
          page: p,
          limit: LIMIT,
        });
        setItems(res.items);
        setTotal(res.total);
        setPage(res.page);
        setPages(res.pages);
      } catch (err: any) {
        toast({ title: "Erro ao carregar reminders", description: err.message, variant: "destructive" });
      } finally {
        setLoading(false);
      }
    },
    [toast],
  );

  useEffect(() => {
    setPage(1);
    void fetchPage(activeStatus, 1);
  }, [activeStatus, fetchPage]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await reminderAdminService.delete(deleteTarget.id);
      toast({ title: "Reminder removido" });
      setDeleteTarget(null);
      void fetchPage(activeStatus, page);
    } catch (err: any) {
      toast({ title: "Erro ao remover", description: err.message, variant: "destructive" });
    } finally {
      setDeleting(false);
    }
  };

  const handleResend = async (reminder: Reminder) => {
    setResending(reminder.id);
    try {
      const res = await reminderAdminService.resend(reminder.id);
      if (res.success) {
        toast({ title: `Enviado para ${reminder.patientName}` });
      } else {
        toast({ title: "Falha no reenvio", description: res.error, variant: "destructive" });
      }
      void fetchPage(activeStatus, page);
    } catch (err: any) {
      toast({ title: "Erro", description: err.message, variant: "destructive" });
    } finally {
      setResending(null);
    }
  };

  const handleProcess = async (status: ReminderStatus) => {
    setProcessing(status);
    try {
      const res = await reminderAdminService.process([status], status !== "pending");
      toast({
        title: `Processado: ${res.sent} enviado(s), ${res.failed} falhou`,
      });
      void fetchPage(activeStatus, page);
    } catch (err: any) {
      toast({ title: "Erro ao processar", description: err.message, variant: "destructive" });
    } finally {
      setProcessing(null);
    }
  };

  const canResend = (r: Reminder) => r.status === "failed" || r.status === "pending" || r.status === "skipped";

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Reminders</h2>
            <p className="text-muted-foreground text-sm">
              Gestão de lembretes de agendamento enviados via WhatsApp
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => void fetchPage(activeStatus, page)}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Atualizar
          </Button>
        </div>

        {/* Filtros de status + ações em lote */}
        <div className="flex flex-wrap gap-2 items-center">
          <button
            onClick={() => setActiveStatus("all")}
            className={`px-3 py-1.5 rounded-md text-sm font-medium border transition-colors ${
              activeStatus === "all"
                ? "bg-foreground text-background border-foreground"
                : "bg-background border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            Todos ({total > 0 && activeStatus === "all" ? total : "—"})
          </button>
          {ALL_STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setActiveStatus(s)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium border transition-colors ${
                activeStatus === s
                  ? "bg-foreground text-background border-foreground"
                  : "bg-background border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {STATUS_LABELS[s]}
              {activeStatus === s ? ` (${total})` : ""}
            </button>
          ))}

          <div className="ml-auto flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => void handleProcess("failed")}
              disabled={processing !== null}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              {processing === "failed" ? (
                <Loader2 className="h-4 w-4 animate-spin mr-1" />
              ) : (
                <Zap className="h-4 w-4 mr-1" />
              )}
              Reprocessar falhos
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => void handleProcess("pending")}
              disabled={processing !== null}
            >
              {processing === "pending" ? (
                <Loader2 className="h-4 w-4 animate-spin mr-1" />
              ) : (
                <Send className="h-4 w-4 mr-1" />
              )}
              Processar pendentes
            </Button>
          </div>
        </div>

        {/* Tabela */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium">
              {loading ? "Carregando..." : `${total} reminder(s)`}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-16 text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                Carregando...
              </div>
            ) : items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-2">
                <AlertCircle className="h-8 w-8 opacity-40" />
                <p className="text-sm">Nenhum reminder encontrado</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Paciente</TableHead>
                      <TableHead>Telefone</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Agendado para</TableHead>
                      <TableHead>Enviado em</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Erro</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell className="font-medium">{r.patientName}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {formatPhone(r.patientPhone)}
                        </TableCell>
                        <TableCell>
                          <span className="text-xs text-muted-foreground">
                            {TYPE_LABELS[r.type] ?? r.type}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm">{formatDate(r.scheduledFor)}</TableCell>
                        <TableCell className="text-sm">{formatDate(r.sentAt)}</TableCell>
                        <TableCell>
                          <Badge variant={STATUS_VARIANT[r.status]} className="gap-1 text-xs">
                            {STATUS_ICONS[r.status]}
                            {STATUS_LABELS[r.status]}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-[180px]">
                          {r.errorMessage ? (
                            <span className="text-xs text-red-600 truncate block" title={r.errorMessage}>
                              {r.errorMessage}
                            </span>
                          ) : (
                            <span className="text-muted-foreground text-xs">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-1">
                            {canResend(r) && (
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8"
                                title="Reenviar"
                                disabled={resending === r.id}
                                onClick={() => void handleResend(r)}
                              >
                                {resending === r.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Send className="h-4 w-4" />
                                )}
                              </Button>
                            )}
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                              title="Remover"
                              onClick={() => setDeleteTarget(r)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Paginação */}
            {pages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t text-sm text-muted-foreground">
                <span>
                  Página {page} de {pages}
                </span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={page <= 1 || loading}
                    onClick={() => void fetchPage(activeStatus, page - 1)}
                  >
                    Anterior
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={page >= pages || loading}
                    onClick={() => void fetchPage(activeStatus, page + 1)}
                  >
                    Próxima
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialog de confirmação de exclusão */}
      <Dialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remover reminder?</DialogTitle>
            <DialogDescription>
              O reminder de <strong>{deleteTarget?.patientName}</strong> será excluído permanentemente.
              Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)} disabled={deleting}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={() => void handleDelete()} disabled={deleting}>
              {deleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Remover
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default RemindersManagement;
