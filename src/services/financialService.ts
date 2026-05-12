import { getAccessToken } from '@/services/authService';

const BASE_URL = (import.meta as any).env?.VITE_API_URL ?? 'http://localhost:6001/api';

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getAccessToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers as Record<string, string> | undefined),
    },
  });
  if (res.status === 204) return undefined as T;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(Array.isArray(data.message) ? data.message.join(', ') : data.message || `Erro ${res.status}`);
  return data as T;
}

export type PaymentMethod = 'pix' | 'cash' | 'creditCard' | 'debitCard' | 'bankTransfer' | 'other';
export type PaymentStatus = 'paid' | 'pending' | 'cancelled' | 'partial';

export interface PaymentApi {
  id: string;
  patientId: string;
  patientName: string | null;
  professionalId: string;
  amount: number;
  date: string;
  description: string | null;
  method: PaymentMethod;
  status: PaymentStatus;
  receiptNumber: string | null;
  notes: string | null;
  createdAt: string;
}

export interface FinancialSummary {
  totalPatients: number;
  activePatientsThisMonth: number;
  paidCount: number;
  pendingCount: number;
  currentMonthRevenue: number;
  lastMonthRevenue: number;
  revenueChangePercent: number;
  conversionRate: number;
}

export interface MonthlyRevenue {
  month: string;
  value: number;
}

export interface Debtor {
  patientId: string;
  name: string;
  phone: string;
  totalDebt: number;
  pendingCount: number;
  lastPaymentDate: string | null;
}

export interface CreatePaymentPayload {
  patientId: string;
  amount: number;
  date: string;
  description?: string;
  method: PaymentMethod;
  status: PaymentStatus;
  receiptNumber?: string;
  notes?: string;
}

export const financialService = {
  getPayments(patientId?: string): Promise<PaymentApi[]> {
    const qs = patientId ? `?patientId=${patientId}` : '';
    return apiFetch<PaymentApi[]>(`/financial/payments${qs}`);
  },

  createPayment(payload: CreatePaymentPayload): Promise<PaymentApi> {
    return apiFetch<PaymentApi>('/financial/payments', { method: 'POST', body: JSON.stringify(payload) });
  },

  updatePayment(id: string, payload: Partial<CreatePaymentPayload>): Promise<PaymentApi> {
    return apiFetch<PaymentApi>(`/financial/payments/${id}`, { method: 'PATCH', body: JSON.stringify(payload) });
  },

  deletePayment(id: string): Promise<void> {
    return apiFetch<void>(`/financial/payments/${id}`, { method: 'DELETE' });
  },

  getSummary(): Promise<FinancialSummary> {
    return apiFetch<FinancialSummary>('/financial/summary');
  },

  getMonthlyRevenue(year?: number): Promise<MonthlyRevenue[]> {
    const qs = year ? `?year=${year}` : '';
    return apiFetch<MonthlyRevenue[]>(`/financial/monthly${qs}`);
  },

  getDebtors(): Promise<Debtor[]> {
    return apiFetch<Debtor[]>('/financial/debtors');
  },
};
