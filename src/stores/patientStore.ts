import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createPatientSlice, PatientSlice } from "./slices/patientSlice";
import { createSessionSlice, SessionSlice } from "./slices/sessionSlice";
import { createDocumentSlice, DocumentSlice } from "./slices/documentSlice";
import { createScheduleSlice, ScheduleSlice } from "./slices/scheduleSlice";
import { createAvailabilitySlice, AvailabilitySlice } from "./slices/availabilitySlice";
import { createFinancialSlice, FinancialSlice, mockPayments, mockPackages } from "./slices/financialSlice";
import { mockPatients } from "./mockData";

// Types
export interface Session {
  id: string;
  date: string;
  notes: string;
  mood: number;
  objectives: string;
  interventions: string;
  nextSteps: string;
  patientId: string;
  status?: "Agendada" | "Realizada" | "Cancelada";
  
  // New fields for electronic patient record
  clinicalNotes?: string;
  diagnosis?: string;
  approach?: "cognitive" | "psychoanalysis" | "behavioral" | "humanistic" | "other";
  medications?: string;
  treatmentProgress?: string;
  privateNotes?: string; // Notes only visible to the professional
  evolution?: string;
  sessionValue?: number;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
  url: string;
}

export interface InitialRecord {
  reasonForConsultation: string;
  familyHistory: string;
  medicalHistory: string;
  previousTreatment: string;
  mentalStatusExam: string;
  initialDiagnosis: string;
  treatmentPlan: string;
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  birthdate: string;
  createdAt: string;
  avatar?: string;
  sessions: Session[];
  documents: Document[];
  initialRecord?: InitialRecord;
}

export interface ScheduleEvent {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone?: string;
  date: string;
  duration: number; // in minutes
  notes?: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  videoLink?: string;
  professionalId?: string;
}

// Mock data is now imported from mockData.ts

export type PatientState = PatientSlice & SessionSlice & DocumentSlice & ScheduleSlice & AvailabilitySlice & FinancialSlice;

export const usePatientStore = create<PatientState>()(
  persist(
    (set, get, ...rest) => ({
      ...createPatientSlice(set, get, ...rest),
      ...createSessionSlice(set, get, ...rest),
      ...createDocumentSlice(set, get, ...rest),
      ...createScheduleSlice(set, get, ...rest),
      ...createAvailabilitySlice(set, get, ...rest),
      ...createFinancialSlice(set, get, ...rest),

      patients: mockPatients,
      scheduleEvents: [],
      payments: mockPayments,
      packages: mockPackages,
      availabilities: [],
      publicAppointments: [],
    }),
    {
      name: "patient-storage",
      partialize: (state) => ({ 
        patients: state.patients,
        scheduleEvents: state.scheduleEvents,
        payments: state.payments,
        packages: state.packages,
        availabilities: state.availabilities,
        publicAppointments: state.publicAppointments
      }),
    }
  )
);
