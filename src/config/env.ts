
import { API_BASE_URL } from '@/services/apiClient';

// Configuração de variáveis de ambiente
export const config = {
  apiUrl: API_BASE_URL,
  tokenExpiryTime: 15 * 60 * 1000, // 15 minutos em milissegundos
};

// Funções auxiliares para verificar o ambiente
export const isProduction = import.meta.env.MODE === 'production';
export const isDevelopment = import.meta.env.MODE === 'development';
