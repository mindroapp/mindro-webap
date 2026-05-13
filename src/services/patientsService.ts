import { getAccessToken } from '@/services/authService';
import { apiFetchJson } from '@/services/apiClient';

async function patientsFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getAccessToken();
  return apiFetchJson<T>(path, options, token);
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
