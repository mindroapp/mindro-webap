
// Configuração de variáveis de ambiente
export const config = {
  apiUrl: import.meta.env.MINDRO_BACKEND_BASE_URL || 'http://localhost:3000/api',
  tokenExpiryTime: 15 * 60 * 1000, // 15 minutos em milissegundos
};

// Funções auxiliares para verificar o ambiente
export const isProduction = import.meta.env.MODE === 'production';
export const isDevelopment = import.meta.env.MODE === 'development';
