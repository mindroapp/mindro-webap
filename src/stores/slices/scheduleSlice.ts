
import { StateCreator } from "zustand";
import { ScheduleEvent } from "@/stores/patientStore";
import { PatientSlice } from "./patientSlice";
import { SessionSlice } from "./sessionSlice";
import { DocumentSlice } from "./documentSlice";

export interface ScheduleSlice {
  scheduleEvents: ScheduleEvent[];
  addScheduleEvent: (eventData: Omit<ScheduleEvent, "id">) => Promise<void>;
  updateScheduleEvent: (eventId: string, eventData: Partial<ScheduleEvent>) => Promise<void>;
  deleteScheduleEvent: (eventId: string) => Promise<void>;
  getPatientEvents: (patientId: string) => ScheduleEvent[];
  getDateEvents: (date: string) => ScheduleEvent[];
}

export const createScheduleSlice: StateCreator<
  PatientSlice & SessionSlice & DocumentSlice & ScheduleSlice,
  [],
  [],
  ScheduleSlice
> = (set, get) => ({
  scheduleEvents: [],
  
  addScheduleEvent: async (eventData) => {
    set({ isLoading: true });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Find the patient to get the phone number
      const patient = get().patients.find(p => p.id === eventData.patientId);
      
      const newEvent: ScheduleEvent = {
        ...eventData,
        id: `e${Date.now()}`,
        patientPhone: patient?.phone || "",
        videoLink: "",
      };
      
      set(state => ({
        scheduleEvents: [...state.scheduleEvents, newEvent],
        isLoading: false
      }));
    } catch (error) {
      console.error("Error adding schedule event:", error);
      set({ isLoading: false });
    }
  },
  
  updateScheduleEvent: async (eventId, eventData) => {
    set({ isLoading: true });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      set(state => ({
        scheduleEvents: state.scheduleEvents.map(event => 
          event.id === eventId 
            ? { ...event, ...eventData } 
            : event
        ),
        isLoading: false
      }));
    } catch (error) {
      console.error("Error updating schedule event:", error);
      set({ isLoading: false });
    }
  },
  
  deleteScheduleEvent: async (eventId) => {
    set({ isLoading: true });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      set(state => ({
        scheduleEvents: state.scheduleEvents.filter(event => event.id !== eventId),
        isLoading: false
      }));
    } catch (error) {
      console.error("Error deleting schedule event:", error);
      set({ isLoading: false });
    }
  },
  
  getPatientEvents: (patientId) => {
    return get().scheduleEvents.filter(event => event.patientId === patientId);
  },
  
  getDateEvents: (date) => {
    return get().scheduleEvents.filter(event => {
      // Compare dates without time
      const eventDate = new Date(event.date).toISOString().split('T')[0];
      const compareDate = new Date(date).toISOString().split('T')[0];
      return eventDate === compareDate;
    });
  }
});
