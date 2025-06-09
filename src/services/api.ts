// src/services/api.ts
import { getAccessToken } from "@/services/authService";

const BASE_URL = 'http://localhost:3000';

interface ApiOptions extends RequestInit {
  withAuth?: boolean;
}

export async function apiFetch<T = unknown>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> {
  const { withAuth, headers, ...rest } = options;
  const token = getAccessToken();
  const fetchOptions: RequestInit = {
    ...rest,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, fetchOptions);

  let data: unknown;
  try {
    data = await response.json();
  } catch (e) {
    data = null;
  }

  if (!response.ok) {
    const errorMessage = typeof data === 'object' && data && 'message' in data ? (data as { message?: string }).message : response.statusText;
    const error = new Error(errorMessage || response.statusText) as Error & { status?: number; data?: unknown };
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data as T;
}

export { BASE_URL };
