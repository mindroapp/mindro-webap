import { getAccessToken } from "@/services/authService";

const BASE_URL = (import.meta as any).env?.VITE_API_URL ?? "http://localhost:6001/api";

function headers(): HeadersInit {
  const token = getAccessToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, { ...init, headers: headers() });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.message ?? `Request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export interface TimeSlotPayload {
  time: string;
  available: boolean;
}

export interface CreateAvailabilityPayload {
  date: string;
  professionalId: string;
  timeSlots: TimeSlotPayload[];
}

export interface CreatePublicAppointmentPayload {
  availabilityId: string;
  date: string;
  time: string;
  patientName: string;
  patientPhone: string;
  professionalId: string;
}

export interface CreateScheduleEventPayload {
  patientId: string;
  patientName: string;
  patientPhone?: string;
  date: string;
  duration: number;
  notes?: string;
  status?: string;
  videoLink?: string;
  professionalId: string;
}

export type UpdateScheduleEventPayload = Partial<CreateScheduleEventPayload>;

const scheduleService = {
  // ─── Availabilities ──────────────────────────────────────────────────────

  getAvailabilities(professionalId: string, month?: string) {
    const params = new URLSearchParams({ professionalId });
    if (month) params.set("month", month);
    return request(`/schedule/availabilities?${params.toString()}`);
  },

  createAvailability(data: CreateAvailabilityPayload) {
    return request("/schedule/availabilities", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  deleteAvailability(id: string) {
    return request(`/schedule/availabilities/${id}`, { method: "DELETE" });
  },

  removeTimeSlot(availabilityId: string, time: string) {
    return request(
      `/schedule/availabilities/${availabilityId}/slots?time=${encodeURIComponent(time)}`,
      { method: "DELETE" }
    );
  },

  // ─── Public Appointments ─────────────────────────────────────────────────

  getPublicAppointments(professionalId: string) {
    return request(`/schedule/appointments?professionalId=${encodeURIComponent(professionalId)}`);
  },

  createPublicAppointment(data: CreatePublicAppointmentPayload) {
    return request("/schedule/appointments", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  deletePublicAppointment(id: string) {
    return request(`/schedule/appointments/${id}`, { method: "DELETE" });
  },

  updateAppointmentStatus(id: string, status: string) {
    return request(`/schedule/appointments/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },

  // ─── Schedule Events ─────────────────────────────────────────────────────

  getScheduleEvents(professionalId: string) {
    return request(`/schedule/events?professionalId=${encodeURIComponent(professionalId)}`);
  },

  createScheduleEvent(data: CreateScheduleEventPayload) {
    return request("/schedule/events", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  updateScheduleEvent(id: string, data: UpdateScheduleEventPayload) {
    return request(`/schedule/events/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  deleteScheduleEvent(id: string) {
    return request(`/schedule/events/${id}`, { method: "DELETE" });
  },
};

export default scheduleService;
