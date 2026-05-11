export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    role: string;
    isVerified?: boolean;
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

const BASE_URL = (import.meta as any).env?.VITE_API_URL ?? 'http://localhost:6001/api';
const AUTH_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_KEY = 'user';

async function authFetch<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || `Request failed: ${res.status}`);
  }
  return res.json();
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
};

export function getAccessToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setAuthTokens({
  accessToken,
  refreshToken,
}: {
  accessToken: string;
  refreshToken: string;
}) {
  localStorage.setItem(AUTH_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function clearAuthTokens() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export default authService;
