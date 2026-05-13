/**
 * API Client Centralizador
 * 
 * Este arquivo centraliza toda a configuração de conexão com a API.
 * A URL base é carregada apenas de .env (VITE_API_URL)
 */

/**
 * URL base da API
 * Variável de ambiente: VITE_API_URL
 * Padrão: http://localhost:6001/api (para desenvolvimento local)
 */
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:6001/api';

/**
 * Cria uma URL completa para um endpoint da API
 * @param endpoint - Endpoint da API (ex: '/patients', '/auth/login')
 * @returns URL completa (ex: 'http://localhost:6001/api/patients')
 */
export function getApiUrl(endpoint: string): string {
  return `${API_BASE_URL}${endpoint}`;
}

/**
 * Configuração de headers padrão para requisições
 */
export function getApiHeaders(token?: string | null): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}

/**
 * Realiza uma requisição autenticada para a API
 * @param endpoint - Endpoint da API
 * @param options - Opções de requisição (RequestInit)
 * @param token - Token de autenticação (opcional)
 * @returns Response da API
 */
export async function apiFetch<T = unknown>(
  endpoint: string,
  options: RequestInit = {},
  token?: string | null,
): Promise<Response> {
  const url = getApiUrl(endpoint);
  const headers = getApiHeaders(token);

  const response = await fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...(options.headers as Record<string, string> | undefined),
    },
  });

  return response;
}

/**
 * Realiza uma requisição para a API e retorna JSON
 * Lança erro se a resposta não for ok
 * @param endpoint - Endpoint da API
 * @param options - Opções de requisição (RequestInit)
 * @param token - Token de autenticação (opcional)
 * @returns Dados da resposta como JSON
 */
export async function apiFetchJson<T = unknown>(
  endpoint: string,
  options: RequestInit = {},
  token?: string | null,
): Promise<T> {
  const response = await apiFetch(endpoint, options, token);

  // Retornar undefined para respostas 204 No Content
  if (response.status === 204) {
    return undefined as T;
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
