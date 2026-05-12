import { StateCreator } from "zustand";
import { Patient, InitialRecord } from "@/stores/patientStore";
import { patientsService } from "@/services/patientsService";

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

export const createPatientSlice: StateCreator<PatientSlice> = (set, get) => ({
  patients: [],
  selectedPatient: null,
  isLoading: false,

  fetchPatients: async () => {
    set({ isLoading: true });
    try {
      const apiPatients = await patientsService.list();
      set((state) => {
        const merged = apiPatients.map((p) => {
          const existing = state.patients.find((ep) => ep.id === p.id);
          return {
            ...p,
            sessions: existing?.sessions ?? [],
            documents: existing?.documents ?? [],
            initialRecord: existing?.initialRecord,
          } as Patient;
        });
        return { patients: merged, isLoading: false };
      });
    } catch (error) {
      console.error("Error fetching patients:", error);
      set({ isLoading: false });
    }
  },

  fetchPatient: async (id: string) => {
    set({ isLoading: true });
    try {
      const patient = await patientsService.get(id);
      set((state) => {
        const existing = state.patients.find((p) => p.id === id);
        const merged: Patient = {
          ...patient,
          sessions: existing?.sessions ?? [],
          documents: existing?.documents ?? [],
          initialRecord: existing?.initialRecord,
        };
        return { selectedPatient: merged, isLoading: false };
      });
    } catch (error) {
      console.error("Error fetching patient:", error);
      set({ isLoading: false });
    }
  },

  addPatient: async (patientData) => {
    set({ isLoading: true });
    try {
      const newPatient = await patientsService.create({
        name: patientData.name,
        email: patientData.email,
        phone: patientData.phone,
        birthdate: patientData.birthdate,
      });
      const full: Patient = {
        ...newPatient,
        sessions: [],
        documents: [],
        initialRecord: undefined,
      };
      set((state) => ({
        patients: [full, ...state.patients],
        isLoading: false,
      }));
      return full;
    } catch (error) {
      console.error("Error adding patient:", error);
      set({ isLoading: false });
      throw error;
    }
  },

  updatePatient: async (id, data) => {
    set({ isLoading: true });
    try {
      await patientsService.update(id, {
        name: data.name,
        email: data.email,
        phone: data.phone,
        birthdate: data.birthdate,
      });
      set((state) => ({
        patients: state.patients.map((p) => (p.id === id ? { ...p, ...data } : p)),
        selectedPatient:
          state.selectedPatient?.id === id
            ? { ...state.selectedPatient, ...data }
            : state.selectedPatient,
        isLoading: false,
      }));
    } catch (error) {
      console.error("Error updating patient:", error);
      set({ isLoading: false });
      throw error;
    }
  },

  addInitialAssessment: async (patientId, data) => {
    set({ isLoading: true });
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      set((state) => ({
        patients: state.patients.map((p) =>
          p.id === patientId ? { ...p, initialRecord: data } : p,
        ),
        selectedPatient:
          state.selectedPatient?.id === patientId
            ? { ...state.selectedPatient, initialRecord: data }
            : state.selectedPatient,
        isLoading: false,
      }));
    } catch (error) {
      console.error("Error adding initial assessment:", error);
      set({ isLoading: false });
      throw error;
    }
  },
});
