import { apiFetchJson } from "./apiClient";

export type ReminderStatus = "pending" | "sent" | "failed" | "skipped";
export type ReminderType = "PUBLIC_APPOINTMENT" | "SCHEDULE_EVENT";

export interface Reminder {
  id: string;
  appointmentId: string;
  type: ReminderType;
  professionalId: string;
  patientName: string;
  patientPhone: string;
  message: string;
  scheduledFor: string;
  sentAt: string | null;
  status: ReminderStatus;
  errorMessage: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ListRemindersResult {
  items: Reminder[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface ProcessResult {
  success: boolean;
  processed: number;
  sent: number;
  failed: number;
  details: Array<{
    id: string;
    patientName: string;
    phone: string;
    result: "sent" | "failed";
    error?: string;
  }>;
}

const reminderAdminService = {
  list(params: { status?: ReminderStatus; page?: number; limit?: number } = {}): Promise<ListRemindersResult> {
    const qs = new URLSearchParams();
    if (params.status) qs.set("status", params.status);
    if (params.page) qs.set("page", String(params.page));
    if (params.limit) qs.set("limit", String(params.limit));
    const query = qs.toString() ? `?${qs.toString()}` : "";
    return apiFetchJson<ListRemindersResult>(`/messaging/reminders${query}`);
  },

  delete(id: string): Promise<void> {
    return apiFetchJson<void>(`/messaging/reminders/${id}`, { method: "DELETE" });
  },

  resend(id: string): Promise<{ success: boolean; error?: string }> {
    return apiFetchJson(`/messaging/reminders/${id}/resend`, { method: "POST" });
  },

  process(statuses: ReminderStatus[], ignoreSchedule = false): Promise<ProcessResult> {
    return apiFetchJson<ProcessResult>("/messaging/reminders/process", {
      method: "POST",
      body: JSON.stringify({ statuses, ignoreSchedule }),
    });
  },
};

export default reminderAdminService;
