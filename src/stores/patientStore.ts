
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createPatientSlice, PatientSlice } from "./slices/patientSlice";
import { createSessionSlice, SessionSlice } from "./slices/sessionSlice";
import { createDocumentSlice, DocumentSlice } from "./slices/documentSlice";
import { createScheduleSlice, ScheduleSlice } from "./slices/scheduleSlice";
import { createFinancialSlice, FinancialSlice, mockPayments, mockPackages } from "./slices/financialSlice";

// Types
export interface Session {
  id: string;
  date: string;
  notes: string;
  mood: number;
  objectives: string;
  interventions: string;
  nextSteps: string;
  
  // New fields for electronic patient record
  clinicalNotes?: string;
  diagnosis?: string;
  approach?: "cognitive" | "psychoanalysis" | "behavioral" | "humanistic" | "other";
  medications?: string;
  treatmentProgress?: string;
  privateNotes?: string; // Notes only visible to the professional
  evolution?: string;
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
  gender?: "male" | "female" | "";
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
}

// Mock data for schedule events
export const mockScheduleEvents: ScheduleEvent[] = [
  {
    id: "e1",
    patientId: "p1",
    patientName: "Ana Silva",
    patientPhone: "(11) 98765-4321",
    date: new Date(new Date().setHours(10, 0, 0, 0)).toISOString(),
    duration: 60,
    notes: "Initial consultation",
    status: "confirmed",
    videoLink: "https://meet.google.com/abc-defg-hij"
  },
  {
    id: "e2",
    patientId: "p2",
    patientName: "Carlos Mendes",
    patientPhone: "(11) 91234-5678",
    date: new Date(new Date().setHours(14, 0, 0, 0)).toISOString(),
    duration: 45,
    status: "scheduled"
  },
  {
    id: "e3",
    patientId: "p1",
    patientName: "Ana Silva",
    patientPhone: "(11) 98765-4321",
    date: new Date(new Date(new Date().setDate(new Date().getDate() + 1)).setHours(11, 0, 0, 0)).toISOString(),
    duration: 60,
    status: "scheduled"
  }
];

// Mock data
export const mockPatients: Patient[] = [
  {
    id: "p1",
    name: "Ana Silva",
    email: "ana.silva@example.com",
    phone: "(11) 98765-4321",
    birthdate: "1985-06-15",
    gender: "female",
    createdAt: "2023-01-10T14:30:00Z",
    avatar: "https://i.pravatar.cc/150?img=1",
    sessions: [
      {
        id: "s1",
        date: "2023-05-10T14:00:00Z",
        notes: "Patient reported feeling anxious about work deadlines.",
        mood: 3,
        objectives: "Reduce anxiety related to work",
        interventions: "Breathing exercises, cognitive restructuring",
        nextSteps: "Practice daily mindfulness",
        clinicalNotes: "Patient exhibits symptoms consistent with mild generalized anxiety disorder, primarily triggered by work situations.",
        diagnosis: "Generalized Anxiety Disorder (F41.1) - Mild",
        approach: "cognitive",
        medications: "None prescribed",
        treatmentProgress: "Initial phase - establishing rapport and intervention strategies",
        privateNotes: "Patient seems hesitant to discuss family history, consider exploring in future sessions",
        evolution: "Baseline assessment completed. Patient receptive to CBT techniques."
      },
      {
        id: "s2",
        date: "2023-05-17T14:00:00Z",
        notes: "Improvement in anxiety levels. Patient applied suggested techniques.",
        mood: 4,
        objectives: "Continue anxiety management techniques",
        interventions: "Reviewed mindfulness practice, added journaling",
        nextSteps: "Continue daily exercises, start stress journal",
        clinicalNotes: "Patient reports 30% reduction in anxiety symptoms. Successfully implemented mindfulness techniques 4 of 7 days.",
        diagnosis: "Generalized Anxiety Disorder (F41.1) - Mild",
        approach: "cognitive",
        medications: "None prescribed",
        treatmentProgress: "Beginning treatment phase - patient showing good engagement with homework assignments",
        privateNotes: "Patient opened up more about childhood experiences today - possible connection to current anxiety patterns",
        evolution: "Showing positive response to treatment. GAD-7 score decreased from 12 to 9."
      }
    ],
    documents: [
      {
        id: "d1",
        name: "Initial Assessment",
        type: "pdf",
        uploadDate: "2023-01-10T14:35:00Z",
        url: "#"
      }
    ],
    initialRecord: {
      reasonForConsultation: "Work-related anxiety and stress management",
      familyHistory: "Mother with history of anxiety disorder",
      medicalHistory: "No significant medical conditions",
      previousTreatment: "Brief therapy 5 years ago for 6 months",
      mentalStatusExam: "Alert, oriented, anxious affect, no thought disorders",
      initialDiagnosis: "Generalized Anxiety Disorder (F41.1)",
      treatmentPlan: "Weekly CBT sessions focusing on stress management"
    }
  },
  {
    id: "p2",
    name: "Carlos Mendes",
    email: "carlos.m@example.com",
    phone: "(11) 91234-5678",
    birthdate: "1992-11-23",
    gender: "male",
    createdAt: "2023-02-05T10:15:00Z",
    avatar: "https://i.pravatar.cc/150?img=11",
    sessions: [
      {
        id: "s3",
        date: "2023-05-12T16:00:00Z",
        notes: "First session. Patient discussed relationship difficulties.",
        mood: 2,
        objectives: "Improve communication in relationships",
        interventions: "Initial assessment, active listening",
        nextSteps: "Relationship pattern analysis"
      }
    ],
    documents: [],
    initialRecord: {
      reasonForConsultation: "Relationship difficulties and communication problems",
      familyHistory: "Parents divorced when patient was 12",
      medicalHistory: "No significant conditions",
      previousTreatment: "No previous psychological treatment",
      mentalStatusExam: "Oriented, depressed mood, logical thought process",
      initialDiagnosis: "Adjustment Disorder with Depressed Mood (F43.21)",
      treatmentPlan: "Weekly sessions focused on communication skills and relationship patterns"
    }
  },
  {
    id: "p3",
    name: "Julia Santos",
    email: "julia.santos@example.com",
    phone: "(11) 99876-5432",
    birthdate: "1988-03-30",
    gender: "female",
    createdAt: "2023-03-22T09:00:00Z",
    avatar: "https://i.pravatar.cc/150?img=5",
    sessions: [],
    documents: [],
    initialRecord: undefined
  }
];

export type PatientState = PatientSlice & SessionSlice & DocumentSlice & ScheduleSlice & FinancialSlice;

export const usePatientStore = create<PatientState>()(
  persist(
    (set, get, ...rest) => ({
      ...createPatientSlice(set, get, ...rest),
      ...createSessionSlice(set, get, ...rest),
      ...createDocumentSlice(set, get, ...rest),
      ...createScheduleSlice(set, get, ...rest),
      ...createFinancialSlice(set, get, ...rest),
      
      // Initialize mock data
      patients: mockPatients,
      scheduleEvents: mockScheduleEvents,
      payments: mockPayments,
      packages: mockPackages
    }),
    {
      name: "patient-storage",
      partialize: (state) => ({ 
        patients: state.patients,
        scheduleEvents: state.scheduleEvents,
        payments: state.payments,
        packages: state.packages
      }),
    }
  )
);
