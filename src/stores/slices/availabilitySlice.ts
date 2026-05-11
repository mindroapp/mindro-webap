import { StateCreator } from "zustand";
import scheduleService from "@/services/scheduleService";

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface Availability {
  id: string;
  date: string;
  timeSlots: TimeSlot[];
  professionalId: string;
}

export interface PublicAppointment {
  id: string;
  availabilityId: string;
  date: string;
  time: string;
  patientName: string;
  patientPhone: string;
  professionalId: string;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
}

export interface AvailabilitySlice {
  availabilities: Availability[];
  publicAppointments: PublicAppointment[];
  fetchAvailabilities: (professionalId: string) => Promise<void>;
  fetchPublicAppointments: (professionalId: string) => Promise<void>;
  addAvailability: (availability: Omit<Availability, "id">) => Promise<void>;
  deleteAvailability: (id: string) => Promise<void>;
  removeTimeSlot: (availabilityId: string, slotTime: string) => Promise<void>;
  createPublicAppointment: (
    appointment: Omit<PublicAppointment, "id" | "createdAt" | "status">
  ) => Promise<void>;
  deletePublicAppointment: (id: string) => Promise<void>;
  getAvailabilitiesByProfessional: (professionalId: string) => Availability[];
  getPublicAppointmentsByProfessional: (professionalId: string) => PublicAppointment[];
}

export const createAvailabilitySlice: StateCreator<
  AvailabilitySlice,
  [],
  [],
  AvailabilitySlice
> = (set, get) => ({
  availabilities: [],
  publicAppointments: [],

  fetchAvailabilities: async (professionalId) => {
    const data = await scheduleService.getAvailabilities(professionalId) as Availability[];
    set((state) => ({
      availabilities: [
        ...state.availabilities.filter((av) => av.professionalId !== professionalId),
        ...data,
      ],
    }));
  },

  fetchPublicAppointments: async (professionalId) => {
    const data = await scheduleService.getPublicAppointments(professionalId) as PublicAppointment[];
    set((state) => ({
      publicAppointments: [
        ...state.publicAppointments.filter((ap) => ap.professionalId !== professionalId),
        ...data,
      ],
    }));
  },

  addAvailability: async (availabilityData) => {
    const created = await scheduleService.createAvailability(availabilityData) as Availability;
    set((state) => ({
      availabilities: [...state.availabilities, created],
    }));
  },

  deleteAvailability: async (id) => {
    await scheduleService.deleteAvailability(id);
    set((state) => ({
      availabilities: state.availabilities.filter((av) => av.id !== id),
    }));
  },

  removeTimeSlot: async (availabilityId, slotTime) => {
    const updated = await scheduleService.removeTimeSlot(availabilityId, slotTime) as Availability;
    set((state) => ({
      availabilities: state.availabilities.map((av) =>
        av.id === availabilityId ? { ...av, timeSlots: updated.timeSlots } : av
      ),
    }));
  },

  createPublicAppointment: async (appointmentData) => {
    const created = await scheduleService.createPublicAppointment(appointmentData) as PublicAppointment;
    set((state) => ({
      publicAppointments: [...state.publicAppointments, created],
    }));
  },

  deletePublicAppointment: async (id) => {
    await scheduleService.deletePublicAppointment(id);
    set((state) => ({
      publicAppointments: state.publicAppointments.filter((apt) => apt.id !== id),
    }));
  },

  getAvailabilitiesByProfessional: (professionalId) => {
    return get().availabilities.filter((av) => av.professionalId === professionalId);
  },

  getPublicAppointmentsByProfessional: (professionalId) => {
    return get().publicAppointments.filter((ap) => ap.professionalId === professionalId);
  },
});
