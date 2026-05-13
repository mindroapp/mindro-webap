import { getAccessToken } from '@/services/authService';
import { apiFetchJson } from '@/services/apiClient';

async function apiFetch<T>(path: string): Promise<T> {
  const token = getAccessToken();
  return apiFetchJson<T>(path, {}, token);
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
