import { getAccessToken } from '@/services/authService';

const BASE_URL = (import.meta as any).env?.VITE_API_URL ?? 'http://localhost:6001/api';

async function apiFetch<T>(path: string): Promise<T> {
  const token = getAccessToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(Array.isArray(data.message) ? data.message.join(', ') : data.message || `Erro ${res.status}`);
  return data as T;
}

export interface DashboardStats {
  totalPatients: number;
  eventsThisMonth: number;
  eventsToday: number;
  availabilitiesThisMonth: number;
  avgSessionsPerPatient: number;
  ageDistribution: { ageRange: string; count: number }[];
  genderDistribution: { gender: string; count: number; color: string }[];
  sessionsByStatus: { status: string; label: string; count: number }[];
}

export interface AdminStats {
  pendingProfessionals: number;
  activeProfessionals: number;
  inactiveProfessionals: number;
  totalPatients: number;
  totalSessions: number;
}

export const dashboardService = {
  getStats(): Promise<DashboardStats> {
    return apiFetch<DashboardStats>('/dashboard/stats');
  },

  getAdminStats(): Promise<AdminStats> {
    return apiFetch<AdminStats>('/dashboard/admin-stats');
  },
};
