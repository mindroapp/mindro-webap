import { StateCreator } from "zustand";
import { Patient, mockPatients, InitialRecord } from "@/stores/patientStore";
import { apiFetch } from "@/services/api";

export interface PatientSlice {
  patients: Patient[];
  selectedPatient: Patient | null;
  isLoading: boolean;
  
  fetchPatients: () => Promise<void>;
  fetchPatient: (id: string) => Promise<void>;
  addPatient: (patient: Omit<Patient, "id" | "createdAt" | "sessions" | "documents">) => Promise<Patient>;
  updatePatient: (id: string, data: Partial<Patient>) => Promise<void>;
  addInitialAssessment: (patientId: string, data: InitialRecord) => Promise<void>;
}

export const createPatientSlice: StateCreator<PatientSlice> = (set) => ({
  patients: [],
  selectedPatient: null,
  isLoading: false,

  fetchPatients: async () => {
    set({ isLoading: true });
    try {
      const patients = await apiFetch<Patient[]>("/patients");
      set({ patients, isLoading: false });
    } catch (error) {
      console.error("Error fetching patients:", error);
      set({ isLoading: false });
    }
  },

  fetchPatient: async (id: string) => {
    set({ isLoading: true });
    try {
      const patient = await apiFetch<Patient>(`/patients/${id}`);
      set({ selectedPatient: patient, isLoading: false });
    } catch (error) {
      console.error("Error fetching patient:", error);
      set({ isLoading: false });
    }
  },

  addPatient: async (patientData) => {
    set({ isLoading: true });
    try {
      const newPatient = await apiFetch<Patient>(
        "/patients",
        {
          method: "POST",
          body: JSON.stringify(patientData)
        }
      );
      set(state => ({
        patients: [...state.patients, newPatient],
        isLoading: false
      }));
      return newPatient;
    } catch (error) {
      console.error("Error adding patient:", error);
      set({ isLoading: false });
      throw error;
    }
  },

  updatePatient: async (id, data) => {
    set({ isLoading: true });
    try {
      // Simulated API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      set(state => ({
        patients: state.patients.map(p => 
          p.id === id ? { ...p, ...data } : p
        ),
        selectedPatient: state.selectedPatient?.id === id 
          ? { ...state.selectedPatient, ...data } 
          : state.selectedPatient,
        isLoading: false
      }));
    } catch (error) {
      console.error("Error updating patient:", error);
      set({ isLoading: false });
    }
  },
  
  addInitialAssessment: async (patientId, data) => {
    set({ isLoading: true });
    try {
      // Simulated API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      set(state => ({
        patients: state.patients.map(p => 
          p.id === patientId ? { ...p, initialRecord: data } : p
        ),
        selectedPatient: state.selectedPatient?.id === patientId 
          ? { ...state.selectedPatient, initialRecord: data } 
          : state.selectedPatient,
        isLoading: false
      }));
    } catch (error) {
      console.error("Error adding initial assessment:", error);
      set({ isLoading: false });
      throw error;
    }
  }
});
