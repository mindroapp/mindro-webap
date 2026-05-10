import { StateCreator } from "zustand";

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
  addAvailability: (availability: Omit<Availability, "id">) => Promise<void>;
  deleteAvailability: (id: string) => Promise<void>;
  removeTimeSlot: (availabilityId: string, slotTime: string) => Promise<void>;
  createPublicAppointment: (appointment: Omit<PublicAppointment, "id" | "createdAt" | "status">) => Promise<void>;
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

  addAvailability: async (availabilityData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newAvailability: Availability = {
      ...availabilityData,
      id: `av${Date.now()}`,
    };
    
    set(state => ({
      availabilities: [...state.availabilities, newAvailability],
    }));
  },

  deleteAvailability: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    set(state => ({
      availabilities: state.availabilities.filter(av => av.id !== id),
    }));
  },

  removeTimeSlot: async (availabilityId, slotTime) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    set(state => ({
      availabilities: state.availabilities.map(av => 
        av.id === availabilityId 
          ? {
              ...av,
              timeSlots: av.timeSlots.filter(slot => slot.time !== slotTime)
            }
          : av
      ),
    }));
  },

  createPublicAppointment: async (appointmentData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newAppointment: PublicAppointment = {
      ...appointmentData,
      id: `pa${Date.now()}`,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    
    set(state => ({
      publicAppointments: [...state.publicAppointments, newAppointment],
    }));
  },

  deletePublicAppointment: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    set(state => ({
      publicAppointments: state.publicAppointments.filter(apt => apt.id !== id),
    }));
  },

  getAvailabilitiesByProfessional: (professionalId) => {
    return get().availabilities.filter(av => av.professionalId === professionalId);
  },

  getPublicAppointmentsByProfessional: (professionalId) => {
    return get().publicAppointments.filter(ap => ap.professionalId === professionalId);
  },
});
