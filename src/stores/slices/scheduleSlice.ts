import { StateCreator } from "zustand";
import { ScheduleEvent } from "@/stores/patientStore";
import { PatientSlice } from "./patientSlice";
import { SessionSlice } from "./sessionSlice";
import { DocumentSlice } from "./documentSlice";
import scheduleService from "@/services/scheduleService";

export interface ScheduleSlice {
  scheduleEvents: ScheduleEvent[];
  fetchScheduleEvents: (professionalId: string) => Promise<void>;
  addScheduleEvent: (eventData: Omit<ScheduleEvent, "id"> & { professionalId: string }) => Promise<void>;
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

  fetchScheduleEvents: async (professionalId) => {
    const data = await scheduleService.getScheduleEvents(professionalId) as ScheduleEvent[];
    set({ scheduleEvents: data });
  },

  addScheduleEvent: async (eventData) => {
    set({ isLoading: true });
    try {
      const created = await scheduleService.createScheduleEvent(eventData) as ScheduleEvent;
      set((state) => ({
        scheduleEvents: [...state.scheduleEvents, created],
        isLoading: false,
      }));
    } catch (error) {
      console.error("Error adding schedule event:", error);
      set({ isLoading: false });
      throw error;
    }
  },

  updateScheduleEvent: async (eventId, eventData) => {
    set({ isLoading: true });
    try {
      const updated = await scheduleService.updateScheduleEvent(eventId, eventData) as ScheduleEvent;
      set((state) => ({
        scheduleEvents: state.scheduleEvents.map((event) =>
          event.id === eventId ? updated : event
        ),
        isLoading: false,
      }));
    } catch (error) {
      console.error("Error updating schedule event:", error);
      set({ isLoading: false });
      throw error;
    }
  },

  deleteScheduleEvent: async (eventId) => {
    set({ isLoading: true });
    try {
      await scheduleService.deleteScheduleEvent(eventId);
      set((state) => ({
        scheduleEvents: state.scheduleEvents.filter((event) => event.id !== eventId),
        isLoading: false,
      }));
    } catch (error) {
      console.error("Error deleting schedule event:", error);
      set({ isLoading: false });
      throw error;
    }
  },

  getPatientEvents: (patientId) => {
    return get().scheduleEvents.filter((event) => event.patientId === patientId);
  },

  getDateEvents: (date) => {
    return get().scheduleEvents.filter((event) => {
      const eventDate = new Date(event.date).toISOString().split("T")[0];
      const compareDate = new Date(date).toISOString().split("T")[0];
      return eventDate === compareDate;
    });
  },
});
