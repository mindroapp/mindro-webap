// src/services/api.ts
import { getAccessToken } from "@/services/authService";
import { mockPatients, mockScheduleEvents } from "@/stores/patientStore";
import { mockPayments, mockPackages } from "@/stores/slices/financialSlice";

// Variáveis locais para simular estado mutável dos mocks
let patients = [...mockPatients];
let payments = [...mockPayments];
let packages = [...mockPackages];
let scheduleEvents = [...mockScheduleEvents];

interface ApiOptions extends RequestInit {
  withAuth?: boolean;
}

export async function apiFetch<T = unknown>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> {
  await new Promise(resolve => setTimeout(resolve, 400));
  const token = getAccessToken();
  if (options.withAuth && !token) {
    const error = new Error("Não autenticado") as Error & { status: number };
    error.status = 401;
    throw error;
  }

  // --- Auth ---
  if (endpoint === "/auth/login" && options.method === "POST") {
    const { email } = JSON.parse(options.body as string);
    
    // Admin
    if (email === "admin@exemplo.com") {
      return {
        accessToken: "mock-access-token-admin",
        refreshToken: "mock-refresh-token-admin",
        user: {
          id: "99",
          fullName: "Administrador",
          email: "admin@exemplo.com",
          role: "admin",
          isVerified: true
        }
      } as T;
    }
    
    // Usuário verificado
    if (email === "joao@exemplo.com") {
      return {
        accessToken: "mock-access-token-verified",
        refreshToken: "mock-refresh-token-verified",
        user: {
          id: "1",
          fullName: "João Silva",
          email: "joao@exemplo.com",
          role: "professional",
          isVerified: true
        }
      } as T;
    }
    
    // Usuário não verificado
    if (email === "maria@exemplo.com") {
      return {
        accessToken: "mock-access-token-unverified",
        refreshToken: "mock-refresh-token-unverified",
        user: {
          id: "2",
          fullName: "Maria Santos",
          email: "maria@exemplo.com",
          role: "professional",
          isVerified: false
        }
      } as T;
    }
    
    // padrão: profissional verificado
    return {
      accessToken: "mock-access-token",
      refreshToken: "mock-refresh-token",
      user: {
        id: "1",
        fullName: "Usuário Mock",
        email,
        role: "professional",
        isVerified: true
      }
    } as T;
  }
  if (endpoint === "/users/register" && options.method === "POST") {
    return {
      accessToken: "mock-access-token",
      refreshToken: "mock-refresh-token",
      user: {
        id: "2",
        fullName: "Novo Usuário",
        email: "novo@mock.com",
        role: "professional",
        isVerified: false
      }
    } as T;
  }
  if (endpoint === "/auth/refresh-token" && options.method === "POST") {
    return {
      accessToken: "mock-access-token-refreshed",
      refreshToken: "mock-refresh-token-refreshed",
      user: {
        id: "1",
        fullName: "Usuário Mock",
        email: "mock@mock.com",
        role: "professional",
        isVerified: true
      }
    } as T;
  }
  if (endpoint === "/auth/reset-password" && options.method === "POST") {
    return { message: "E-mail de redefinição enviado" } as T;
  }

  // --- Pacientes ---
  if (endpoint === "/patients" && (!options.method || options.method === "GET")) {
    return patients as T;
  }
  if (endpoint.startsWith("/patients/") && (!options.method || options.method === "GET")) {
    const id = endpoint.split("/").pop();
    const patient = patients.find(p => p.id === id);
    if (!patient) throw new Error("Paciente não encontrado");
    return patient as T;
  }
  if (endpoint === "/patients" && options.method === "POST") {
    const data = JSON.parse(options.body as string);
    const newPatient = { 
      ...data, 
      id: `p${Date.now()}`, 
      createdAt: new Date().toISOString(),
      sessions: [], 
      documents: [] 
    };
    patients.push(newPatient);
    return newPatient as T;
  }
  if (endpoint.startsWith("/patients/") && options.method === "PUT") {
    const id = endpoint.split("/").pop();
    const data = JSON.parse(options.body as string);
    patients = patients.map(p => p.id === id ? { ...p, ...data } : p);
    const updated = patients.find(p => p.id === id);
    return updated as T;
  }
  if (endpoint.match(/^\/patients\/[^/]+\/initial-assessment$/) && options.method === "POST") {
    const id = endpoint.split("/")[2];
    const data = JSON.parse(options.body as string);
    patients = patients.map(p => p.id === id ? { ...p, initialRecord: data } : p);
    return patients.find(p => p.id === id) as T;
  }

  // --- Sessões ---
  if (endpoint.match(/^\/patients\/[^/]+\/sessions$/) && options.method === "POST") {
    const id = endpoint.split("/")[2];
    const data = JSON.parse(options.body as string);
    const newSession = { ...data, id: `s${Date.now()}` };
    patients = patients.map(p => p.id === id ? { ...p, sessions: [...p.sessions, newSession] } : p);
    return newSession as T;
  }
  if (endpoint.match(/^\/patients\/[^/]+\/sessions\/[^/]+$/) && options.method === "PUT") {
    const [id, sessionId] = endpoint.split("/").slice(2, 4);
    const data = JSON.parse(options.body as string);
    patients = patients.map(p => p.id === id ? {
      ...p,
      sessions: p.sessions.map(s => s.id === sessionId ? { ...s, ...data } : s)
    } : p);
    return patients.find(p => p.id === id)?.sessions.find(s => s.id === sessionId) as T;
  }
  if (endpoint.match(/^\/patients\/[^/]+\/sessions\/[^/]+$/) && options.method === "DELETE") {
    const [id, sessionId] = endpoint.split("/").slice(2, 4);
    patients = patients.map(p => p.id === id ? {
      ...p,
      sessions: p.sessions.filter(s => s.id !== sessionId)
    } : p);
    return { success: true } as T;
  }

  // --- Documentos ---
  if (endpoint.match(/^\/patients\/[^/]+\/documents$/) && options.method === "POST") {
    const id = endpoint.split("/")[2];
    const data = JSON.parse(options.body as string);
    const newDocument = { ...data, id: `d${Date.now()}`, uploadDate: new Date().toISOString() };
    patients = patients.map(p => p.id === id ? { ...p, documents: [newDocument, ...p.documents] } : p);
    return newDocument as T;
  }
  if (endpoint.match(/^\/patients\/[^/]+\/initial-record$/) && options.method === "PUT") {
    const id = endpoint.split("/")[2];
    const data = JSON.parse(options.body as string);
    patients = patients.map(p => p.id === id ? { ...p, initialRecord: data } : p);
    return patients.find(p => p.id === id) as T;
  }

  // --- Agendamentos ---
  if (endpoint === "/schedule" && (!options.method || options.method === "GET")) {
    return scheduleEvents as T;
  }
  if (endpoint === "/schedule" && options.method === "POST") {
    const data = JSON.parse(options.body as string);
    const newEvent = { ...data, id: `e${Date.now()}` };
    scheduleEvents.push(newEvent);
    return newEvent as T;
  }
  if (endpoint.match(/^\/schedule\/[^/]+$/) && options.method === "PUT") {
    const id = endpoint.split("/").pop();
    scheduleEvents = scheduleEvents.map(e => e.id === id ? { ...e, ...JSON.parse(options.body as string) } : e);
    return scheduleEvents.find(e => e.id === id) as T;
  }
  if (endpoint.match(/^\/schedule\/[^/]+$/) && options.method === "DELETE") {
    const id = endpoint.split("/").pop();
    scheduleEvents = scheduleEvents.filter(e => e.id !== id);
    return { success: true } as T;
  }

  // --- Financeiro: Pagamentos ---
  if (endpoint === "/payments" && (!options.method || options.method === "GET")) {
    return payments as T;
  }
  if (endpoint === "/payments" && options.method === "POST") {
    const data = JSON.parse(options.body as string);
    const newPayment = { ...data, id: `pay${Date.now()}` };
    payments.push(newPayment);
    return newPayment as T;
  }
  if (endpoint.match(/^\/payments\/[^/]+$/) && options.method === "PUT") {
    const id = endpoint.split("/").pop();
    payments = payments.map(p => p.id === id ? { ...p, ...JSON.parse(options.body as string) } : p);
    return payments.find(p => p.id === id) as T;
  }
  if (endpoint.match(/^\/payments\/[^/]+$/) && options.method === "DELETE") {
    const id = endpoint.split("/").pop();
    payments = payments.filter(p => p.id !== id);
    return { success: true } as T;
  }
  if (endpoint.match(/^\/payments\/[^/]+\/receipt$/) && (!options.method || options.method === "GET")) {
    const id = endpoint.split("/")[2];
    const payment = payments.find(p => p.id === id);
    if (!payment) throw new Error("Pagamento não encontrado");
    return { receiptNumber: payment.receiptNumber || `REC-${Date.now()}` } as T;
  }

  // --- Financeiro: Pacotes ---
  if (endpoint === "/packages" && (!options.method || options.method === "GET")) {
    return packages as T;
  }
  if (endpoint === "/packages" && options.method === "POST") {
    const data = JSON.parse(options.body as string);
    const newPackage = { ...data, id: `pkg${Date.now()}` };
    packages.push(newPackage);
    return newPackage as T;
  }
  if (endpoint.match(/^\/packages\/[^/]+$/) && options.method === "PUT") {
    const id = endpoint.split("/").pop();
    packages = packages.map(p => p.id === id ? { ...p, ...JSON.parse(options.body as string) } : p);
    return packages.find(p => p.id === id) as T;
  }
  if (endpoint.match(/^\/packages\/[^/]+$/) && options.method === "DELETE") {
    const id = endpoint.split("/").pop();
    packages = packages.filter(p => p.id !== id);
    return { success: true } as T;
  }

  throw new Error(`Endpoint mock não implementado: ${endpoint}`);
}

export const BASE_URL = "mock://";
