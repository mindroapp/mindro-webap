import { apiFetchJson } from '@/services/apiClient';

export interface LoginResponse {
  user: {
    id: string;
    fullName: string;
    email: string;
    phone?: string | null;
    role: string;
    isVerified?: boolean;
    professionalCouncil?: string | null;
    professionalRegister?: string | null;
  };
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  profession: string;
  professionalRegister: string;
  professionalCouncil?: string;
}

async function authFetch<T>(path: string, body: unknown): Promise<T> {
  return apiFetchJson<T>(path, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    return authFetch<LoginResponse>('/auth/login', { email, password });
  },

  async register(data: RegisterRequest): Promise<LoginResponse> {
    const phone = data.phone.replace(/\D/g, '');
    return authFetch<LoginResponse>('/auth/register', { ...data, phone });
  },

  async resetPassword(email: string) {
    return authFetch('/auth/reset-password', { email });
  },

  async logout() {
    return apiFetchJson('/auth/logout', { method: 'POST' });
  },
};

// Mantido para compatibilidade — tokens agora ficam em httpOnly cookie
export function getAccessToken(): string | null {
  return null;
}

export function clearAuthTokens() {
  // no-op: tokens são gerenciados pelo browser via httpOnly cookie
}

export default authService;
