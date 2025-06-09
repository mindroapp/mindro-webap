
import { StateCreator } from "zustand";
import { Patient, ScheduleEvent } from "@/stores/patientStore";

export type PaymentMethod = "pix" | "cash" | "creditCard" | "debitCard" | "bankTransfer" | "other";
export type PaymentStatus = "paid" | "pending" | "cancelled" | "partial";

export interface Payment {
  id: string;
  patientId: string;
  amount: number;
  date: string;
  description: string;
  method: PaymentMethod;
  status: PaymentStatus;
  receiptNumber?: string;
  notes?: string;
  sessionId?: string; // Opcional - para pagamentos vinculados a sessões específicas
  packageId?: string; // Opcional - para pagamentos vinculados a pacotes
}

export interface SessionPackage {
  id: string;
  patientId: string;
  name: string;
  totalSessions: number;
  remainingSessions: number;
  valuePerSession: number;
  totalValue: number;
  startDate: string;
  endDate?: string;
  status: "active" | "completed" | "cancelled";
  notes?: string;
}

// Mock data para pagamentos
export const mockPayments: Payment[] = [
  {
    id: "pay1",
    patientId: "p1",
    amount: 200.0,
    date: new Date(2023, 4, 10).toISOString(),
    description: "Sessão de terapia",
    method: "pix",
    status: "paid",
    receiptNumber: "REC-2023-001"
  },
  {
    id: "pay2",
    patientId: "p1",
    amount: 200.0,
    date: new Date(2023, 4, 17).toISOString(),
    description: "Sessão de terapia",
    method: "creditCard",
    status: "paid",
    receiptNumber: "REC-2023-002"
  },
  {
    id: "pay3",
    patientId: "p2",
    amount: 180.0,
    date: new Date(2023, 4, 12).toISOString(),
    description: "Sessão de terapia",
    method: "cash",
    status: "paid",
    receiptNumber: "REC-2023-003"
  },
  {
    id: "pay4", 
    patientId: "p3",
    amount: 200.0,
    date: new Date(2023, 4, 20).toISOString(),
    description: "Sessão de terapia",
    method: "bankTransfer",
    status: "pending"
  }
];

// Mock data para pacotes de sessão
export const mockPackages: SessionPackage[] = [
  {
    id: "pkg1",
    patientId: "p1",
    name: "Pacote Mensal",
    totalSessions: 4,
    remainingSessions: 2,
    valuePerSession: 190,
    totalValue: 760,
    startDate: new Date(2023, 4, 1).toISOString(),
    status: "active"
  },
  {
    id: "pkg2",
    patientId: "p2",
    name: "Pacote Trimestral",
    totalSessions: 12,
    remainingSessions: 10,
    valuePerSession: 170,
    totalValue: 2040,
    startDate: new Date(2023, 4, 1).toISOString(),
    status: "active"
  }
];

export interface FinancialSlice {
  payments: Payment[];
  packages: SessionPackage[];
  
  // Métodos para pagamentos
  fetchPaymentsByPatient: (patientId: string) => Promise<Payment[]>;
  addPayment: (payment: Omit<Payment, "id">) => Promise<Payment>;
  updatePayment: (id: string, data: Partial<Payment>) => Promise<void>;
  deletePayment: (id: string) => Promise<void>;
  generateReceipt: (paymentId: string) => Promise<string>;
  
  // Métodos para pacotes de sessão
  fetchPackagesByPatient: (patientId: string) => Promise<SessionPackage[]>;
  addPackage: (pkg: Omit<SessionPackage, "id">) => Promise<SessionPackage>;
  updatePackage: (id: string, data: Partial<SessionPackage>) => Promise<void>;
  deletePackage: (id: string) => Promise<void>;
  useSessionFromPackage: (packageId: string) => Promise<void>;
  
  // Métodos para relatórios financeiros
  getMonthlyIncome: (year: number, month: number) => number;
  getYearlyIncome: (year: number) => Record<string, number>; // Mês -> valor
  getPendingPayments: () => Payment[];
}

export const createFinancialSlice: StateCreator<FinancialSlice> = (set, get) => ({
  payments: mockPayments,
  packages: mockPackages,
  
  fetchPaymentsByPatient: async (patientId) => {
    // Simulated API call
    await new Promise(resolve => setTimeout(resolve, 500));
    const payments = get().payments.filter(p => p.patientId === patientId);
    return payments;
  },
  
  addPayment: async (paymentData) => {
    // Simulated API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newPayment: Payment = {
      ...paymentData,
      id: `pay${Date.now()}`
    };
    
    set(state => ({
      payments: [...state.payments, newPayment]
    }));
    
    return newPayment;
  },
  
  updatePayment: async (id, data) => {
    // Simulated API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    set(state => ({
      payments: state.payments.map(p => 
        p.id === id ? { ...p, ...data } : p
      )
    }));
  },
  
  deletePayment: async (id) => {
    // Simulated API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    set(state => ({
      payments: state.payments.filter(p => p.id !== id)
    }));
  },
  
  generateReceipt: async (paymentId) => {
    // Simulated API call to generate a receipt
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const payment = get().payments.find(p => p.id === paymentId);
    if (!payment) throw new Error("Pagamento não encontrado");
    
    // Generate a receipt number if doesn't exist
    if (!payment.receiptNumber) {
      const receiptNumber = `REC-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
      
      set(state => ({
        payments: state.payments.map(p => 
          p.id === paymentId ? { ...p, receiptNumber } : p
        )
      }));
      
      return receiptNumber;
    }
    
    return payment.receiptNumber;
  },
  
  fetchPackagesByPatient: async (patientId) => {
    // Simulated API call
    await new Promise(resolve => setTimeout(resolve, 500));
    const packages = get().packages.filter(p => p.patientId === patientId);
    return packages;
  },
  
  addPackage: async (packageData) => {
    // Simulated API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newPackage: SessionPackage = {
      ...packageData,
      id: `pkg${Date.now()}`
    };
    
    set(state => ({
      packages: [...state.packages, newPackage]
    }));
    
    return newPackage;
  },
  
  updatePackage: async (id, data) => {
    // Simulated API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    set(state => ({
      packages: state.packages.map(p => 
        p.id === id ? { ...p, ...data } : p
      )
    }));
  },
  
  deletePackage: async (id) => {
    // Simulated API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    set(state => ({
      packages: state.packages.filter(p => p.id !== id)
    }));
  },
  
  useSessionFromPackage: async (packageId) => {
    // Simulated API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    set(state => ({
      packages: state.packages.map(p => {
        if (p.id === packageId && p.remainingSessions > 0) {
          const remainingSessions = p.remainingSessions - 1;
          const status = remainingSessions === 0 ? "completed" : p.status;
          return { ...p, remainingSessions, status };
        }
        return p;
      })
    }));
  },
  
  getMonthlyIncome: (year, month) => {
    const payments = get().payments;
    const monthPayments = payments.filter(p => {
      const paymentDate = new Date(p.date);
      return paymentDate.getFullYear() === year && paymentDate.getMonth() === month && p.status === "paid";
    });
    
    return monthPayments.reduce((total, p) => total + p.amount, 0);
  },
  
  getYearlyIncome: (year) => {
    const payments = get().payments;
    const yearPayments = payments.filter(p => {
      const paymentDate = new Date(p.date);
      return paymentDate.getFullYear() === year && p.status === "paid";
    });
    
    const monthlyIncome: Record<string, number> = {};
    
    // Initialize all months to zero
    for (let i = 0; i < 12; i++) {
      monthlyIncome[i] = 0;
    }
    
    // Sum payments by month
    yearPayments.forEach(p => {
      const month = new Date(p.date).getMonth();
      monthlyIncome[month] = (monthlyIncome[month] || 0) + p.amount;
    });
    
    return monthlyIncome;
  },
  
  getPendingPayments: () => {
    return get().payments.filter(p => p.status === "pending");
  }
});
