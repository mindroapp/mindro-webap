export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4002/api';

export function getApiUrl(endpoint: string): string {
  return `${API_BASE_URL}${endpoint}`;
}

export function getApiHeaders(token?: string | null): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}

export async function apiFetch(
  endpoint: string,
  options: RequestInit = {},
  token?: string | null,
): Promise<Response> {
  const url = getApiUrl(endpoint);
  const headers = getApiHeaders(token);

  return fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      ...headers,
      ...(options.headers as Record<string, string> | undefined),
    },
  });
}

let isRefreshing = false;

export async function apiFetchJson<T = unknown>(
  endpoint: string,
  options: RequestInit = {},
  token?: string | null,
): Promise<T> {
  const response = await apiFetch(endpoint, options, token);

  if (response.status === 204) return undefined as T;

  // Auto-refresh: tenta renovar o access_token e repetir a requisição em caso de 401
  if (response.status === 401 && !endpoint.includes('/auth/') && !isRefreshing) {
    isRefreshing = true;
    try {
      const refreshResponse = await fetch(getApiUrl('/auth/refresh'), {
        method: 'POST',
        credentials: 'include',
      });

      if (refreshResponse.ok) {
        isRefreshing = false;
        const retryResponse = await apiFetch(endpoint, options, token);
        if (retryResponse.status === 204) return undefined as T;
        const retryData = await retryResponse.json().catch(() => ({}));
        if (!retryResponse.ok) {
          throw new Error(
            Array.isArray(retryData.message)
              ? retryData.message.join(', ')
              : retryData.message || `Erro ${retryResponse.status}`,
          );
        }
        return retryData as T;
      } else {
        isRefreshing = false;
        window.dispatchEvent(new Event('auth:session-expired'));
        throw new Error('Sessão expirada. Por favor, faça login novamente.');
      }
    } catch (error) {
      isRefreshing = false;
      if (error instanceof Error && error.message.includes('Sessão expirada')) throw error;
      window.dispatchEvent(new Event('auth:session-expired'));
      throw new Error('Sessão expirada. Por favor, faça login novamente.');
    }
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      Array.isArray(data.message)
        ? data.message.join(', ')
        : data.message || `Erro ${response.status}`,
    );
  }

  return data as T;
}
