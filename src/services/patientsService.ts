import { getAccessToken } from '@/services/authService';

const BASE_URL = (import.meta as any).env?.VITE_API_URL ?? 'http://localhost:6001/api';

async function patientsFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
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
  if (!res.ok) {
    throw new Error(
      Array.isArray(data.message) ? data.message.join(', ') : data.message || `Erro ${res.status}`,
    );
  }
  return data as T;
}

export interface PatientApiData {
  id: string;
  name: string;
  email: string;
  phone: string;
  birthdate: string;
  notes?: string | null;
  professionalId: string;
  createdAt: string;
  updatedAt: string;
  sessions: unknown[];
  documents: unknown[];
}

export interface CreatePatientPayload {
  name: string;
  email: string;
  phone: string;
  birthdate: string;
}

export const patientsService = {
  list(): Promise<PatientApiData[]> {
    return patientsFetch<PatientApiData[]>('/patients');
  },

  get(id: string): Promise<PatientApiData> {
    return patientsFetch<PatientApiData>(`/patients/${id}`);
  },

  create(payload: CreatePatientPayload): Promise<PatientApiData> {
    return patientsFetch<PatientApiData>('/patients', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  update(id: string, payload: Partial<CreatePatientPayload>): Promise<PatientApiData> {
    return patientsFetch<PatientApiData>(`/patients/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  delete(id: string): Promise<void> {
    return patientsFetch<void>(`/patients/${id}`, { method: 'DELETE' });
  },
};
