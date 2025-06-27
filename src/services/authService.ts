
import { apiFetch } from "@/services/api";

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

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  role?: string;
}

const AUTH_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const USER_KEY = "user";

const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    return apiFetch<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  async register(fullName: string, email: string, password: string, phone: string) {
    return apiFetch<LoginResponse>("/users/register", {
      method: "POST",
      body: JSON.stringify({ fullName, email, password, phone }),
    });
  },

  async refreshToken() {
    return apiFetch<LoginResponse>("/auth/refresh-token", {
      method: "POST",
      body: JSON.stringify({}),
    });
  },

  async resetPassword(email: string) {
    return apiFetch("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
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
