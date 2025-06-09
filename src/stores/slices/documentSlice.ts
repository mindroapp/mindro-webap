
import { StateCreator } from "zustand";
import { Document, InitialRecord } from "@/stores/patientStore";
import { PatientSlice } from "./patientSlice";
import { SessionSlice } from "./sessionSlice";

export interface DocumentSlice {
  addDocument: (patientId: string, document: Omit<Document, "id" | "uploadDate">) => Promise<void>;
  updateInitialRecord: (patientId: string, data: InitialRecord) => Promise<void>;
}

export const createDocumentSlice: StateCreator<
  PatientSlice & SessionSlice & DocumentSlice,
  [],
  [],
  DocumentSlice
> = (set) => ({
  addDocument: async (patientId, documentData) => {
    set((state) => ({ isLoading: true }));
    try {
      // Simulated API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newDocument: Document = {
        ...documentData,
        id: `d${Date.now()}`,
        uploadDate: new Date().toISOString()
      };
      
      set(state => ({
        patients: state.patients.map(p => 
          p.id === patientId 
            ? { ...p, documents: [newDocument, ...p.documents] } 
            : p
        ),
        selectedPatient: state.selectedPatient?.id === patientId 
          ? { ...state.selectedPatient, documents: [newDocument, ...state.selectedPatient.documents] } 
          : state.selectedPatient,
        isLoading: false
      }));
    } catch (error) {
      console.error("Error adding document:", error);
      set({ isLoading: false });
    }
  },

  updateInitialRecord: async (patientId, data) => {
    set({ isLoading: true });
    try {
      // Simulated API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      set(state => ({
        patients: state.patients.map(p => 
          p.id === patientId 
            ? { ...p, initialRecord: data } 
            : p
        ),
        selectedPatient: state.selectedPatient?.id === patientId 
          ? { ...state.selectedPatient, initialRecord: data } 
          : state.selectedPatient,
        isLoading: false
      }));
    } catch (error) {
      console.error("Error updating initial record:", error);
      set({ isLoading: false });
    }
  }
});
