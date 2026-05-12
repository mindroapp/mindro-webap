export function buildPublicBookingUrl(
  council: string | null | undefined,
  register: string | null | undefined
): string {
  if (!council && !register) return "";
  const slug = [council, register].filter(Boolean).join("-");
  return `${window.location.origin}/agendamento/${encodeURIComponent(slug)}`;
}

/**
 * Formata um número de telefone para o padrão brasileiro
 * Aceita: 10 dígitos (XX) XXXX-XXXX ou 11 dígitos (XX) 9XXXX-XXXX
 * @param phone - String contendo apenas números ou com caracteres
 * @returns String formatada ou vazia se inválida
 */
export function formatPhoneNumber(phone: string | null | undefined): string {
  if (!phone) return "";

  // Remove tudo que não é número
  const cleaned = phone.replace(/\D/g, "");

  // Se não tiver pelo menos 10 dígitos, retorna vazio
  if (cleaned.length < 10) return "";

  // Se tiver 10 dígitos: (XX) XXXX-XXXX
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
  }

  // Se tiver 11 dígitos: (XX) 9XXXX-XXXX
  if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
  }

  // Se tiver mais, apenas formata como se fosse 11
  return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
}
