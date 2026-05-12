import { StateCreator } from "zustand";
import { financialService } from "@/services/financialService";

export type PaymentMethod = "pix" | "cash" | "creditCard" | "debitCard" | "bankTransfer" | "other";
export type PaymentStatus = "paid" | "pending" | "cancelled" | "partial";

export interface Payment {
  id: string;
  patientId: string;
  patientName?: string | null;
  amount: number;
  date: string;
  description: string;
  method: PaymentMethod;
  status: PaymentStatus;
  receiptNumber?: string;
  notes?: string;
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

// kept for backward compatibility — no longer pre-populated
export const mockPayments: Payment[] = [];
export const mockPackages: SessionPackage[] = [];

export interface FinancialSlice {
  payments: Payment[];
  packages: SessionPackage[];

  fetchPayments: () => Promise<void>;
  fetchPaymentsByPatient: (patientId: string) => Promise<Payment[]>;
  addPayment: (payment: Omit<Payment, "id">) => Promise<Payment>;
  updatePayment: (id: string, data: Partial<Payment>) => Promise<void>;
  deletePayment: (id: string) => Promise<void>;
  generateReceipt: (paymentId: string) => Promise<string>;

  fetchPackagesByPatient: (patientId: string) => Promise<SessionPackage[]>;
  addPackage: (pkg: Omit<SessionPackage, "id">) => Promise<SessionPackage>;
  updatePackage: (id: string, data: Partial<SessionPackage>) => Promise<void>;
  deletePackage: (id: string) => Promise<void>;
  useSessionFromPackage: (packageId: string) => Promise<void>;

  getMonthlyIncome: (year: number, month: number) => number;
  getYearlyIncome: (year: number) => Record<string, number>;
  getPendingPayments: () => Payment[];
}

export const createFinancialSlice: StateCreator<FinancialSlice> = (set, get) => ({
  payments: [],
  packages: [],

  fetchPayments: async () => {
    try {
      const payments = await financialService.getPayments();
      set({ payments: payments as Payment[] });
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
  },

  fetchPaymentsByPatient: async (patientId) => {
    try {
      const payments = await financialService.getPayments(patientId);
      set((state) => {
        const others = state.payments.filter((p) => p.patientId !== patientId);
        return { payments: [...others, ...(payments as Payment[])] };
      });
      return payments as Payment[];
    } catch (error) {
      console.error("Error fetching patient payments:", error);
      return [];
    }
  },

  addPayment: async (paymentData) => {
    const newPayment = await financialService.createPayment({
      patientId: paymentData.patientId,
      amount: paymentData.amount,
      date: paymentData.date,
      description: paymentData.description,
      method: paymentData.method as any,
      status: paymentData.status as any,
      receiptNumber: paymentData.receiptNumber,
      notes: paymentData.notes,
    });
    set((state) => ({ payments: [...state.payments, newPayment as Payment] }));
    return newPayment as Payment;
  },

  updatePayment: async (id, data) => {
    const updated = await financialService.updatePayment(id, {
      amount: data.amount,
      date: data.date,
      description: data.description,
      method: data.method as any,
      status: data.status as any,
      receiptNumber: data.receiptNumber,
      notes: data.notes,
    });
    set((state) => ({
      payments: state.payments.map((p) => (p.id === id ? { ...p, ...(updated as Payment) } : p)),
    }));
  },

  deletePayment: async (id) => {
    await financialService.deletePayment(id);
    set((state) => ({ payments: state.payments.filter((p) => p.id !== id) }));
  },

  generateReceipt: async (paymentId) => {
    const payment = get().payments.find((p) => p.id === paymentId);
    if (!payment) throw new Error("Pagamento não encontrado");
    if (payment.receiptNumber) return payment.receiptNumber;
    const receiptNumber = `REC-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0")}`;
    await financialService.updatePayment(paymentId, { receiptNumber } as any);
    set((state) => ({
      payments: state.payments.map((p) => (p.id === paymentId ? { ...p, receiptNumber } : p)),
    }));
    return receiptNumber;
  },

  // ─── Packages (local only — no backend module yet) ───────────────────────

  fetchPackagesByPatient: async (patientId) => {
    return get().packages.filter((p) => p.patientId === patientId);
  },

  addPackage: async (packageData) => {
    const newPackage: SessionPackage = { ...packageData, id: `pkg${Date.now()}` };
    set((state) => ({ packages: [...state.packages, newPackage] }));
    return newPackage;
  },

  updatePackage: async (id, data) => {
    set((state) => ({
      packages: state.packages.map((p) => (p.id === id ? { ...p, ...data } : p)),
    }));
  },

  deletePackage: async (id) => {
    set((state) => ({ packages: state.packages.filter((p) => p.id !== id) }));
  },

  useSessionFromPackage: async (packageId) => {
    set((state) => ({
      packages: state.packages.map((p) => {
        if (p.id === packageId && p.remainingSessions > 0) {
          const remainingSessions = p.remainingSessions - 1;
          return { ...p, remainingSessions, status: remainingSessions === 0 ? "completed" : p.status };
        }
        return p;
      }),
    }));
  },

  // ─── Local computed helpers ──────────────────────────────────────────────

  getMonthlyIncome: (year, month) => {
    return get()
      .payments.filter((p) => {
        const d = new Date(p.date);
        return d.getFullYear() === year && d.getMonth() === month && p.status === "paid";
      })
      .reduce((s, p) => s + p.amount, 0);
  },

  getYearlyIncome: (year) => {
    const monthly: Record<string, number> = {};
    for (let i = 0; i < 12; i++) monthly[i] = 0;
    get()
      .payments.filter((p) => new Date(p.date).getFullYear() === year && p.status === "paid")
      .forEach((p) => {
        const m = new Date(p.date).getMonth();
        monthly[m] = (monthly[m] || 0) + p.amount;
      });
    return monthly;
  },

  getPendingPayments: () => get().payments.filter((p) => p.status === "pending"),
});
