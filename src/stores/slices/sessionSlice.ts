
import { StateCreator } from "zustand";
import { Session } from "@/stores/patientStore";
import { PatientSlice } from "./patientSlice";

export interface SessionSlice {
  addSession: (patientId: string, sessionData: Omit<Session, "id">) => Promise<void>;
  updateSession: (patientId: string, sessionId: string, sessionData: Partial<Session>) => Promise<void>;
  deleteSession: (patientId: string, sessionId: string) => Promise<void>;
}

export const createSessionSlice: StateCreator<
  PatientSlice & SessionSlice,
  [],
  [],
  SessionSlice
> = (set) => ({
  addSession: async (patientId, sessionData) => {
    set({ isLoading: true });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newSession = {
        ...sessionData,
        id: `s${Date.now()}`
      };
      
      set(state => ({
        patients: state.patients.map(p => 
          p.id === patientId 
            ? { ...p, sessions: [...p.sessions, newSession] } 
            : p
        ),
        selectedPatient: state.selectedPatient?.id === patientId 
          ? { ...state.selectedPatient, sessions: [...state.selectedPatient.sessions, newSession] } 
          : state.selectedPatient,
        isLoading: false
      }));
    } catch (error) {
      console.error("Error adding session:", error);
      set({ isLoading: false });
    }
  },

  updateSession: async (patientId, sessionId, sessionData) => {
    set({ isLoading: true });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      set(state => ({
        patients: state.patients.map(p => 
          p.id === patientId 
            ? { 
                ...p, 
                sessions: p.sessions.map(s => 
                  s.id === sessionId 
                    ? { ...s, ...sessionData } 
                    : s
                ) 
              }
            : p
        ),
        selectedPatient: state.selectedPatient?.id === patientId 
          ? {
              ...state.selectedPatient,
              sessions: state.selectedPatient.sessions.map(s =>
                s.id === sessionId
                  ? { ...s, ...sessionData }
                  : s
              )
            }
          : state.selectedPatient,
        isLoading: false
      }));
    } catch (error) {
      console.error("Error updating session:", error);
      set({ isLoading: false });
    }
  },

  deleteSession: async (patientId, sessionId) => {
    set({ isLoading: true });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      set(state => ({
        patients: state.patients.map(p => 
          p.id === patientId 
            ? { ...p, sessions: p.sessions.filter(s => s.id !== sessionId) } 
            : p
        ),
        selectedPatient: state.selectedPatient?.id === patientId 
          ? {
              ...state.selectedPatient,
              sessions: state.selectedPatient.sessions.filter(s => s.id !== sessionId)
            }
          : state.selectedPatient,
        isLoading: false
      }));
    } catch (error) {
      console.error("Error deleting session:", error);
      set({ isLoading: false });
    }
  }
});
