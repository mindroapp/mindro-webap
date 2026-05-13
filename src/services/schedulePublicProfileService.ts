import { getAccessToken } from "@/services/authService";
import { apiFetchJson } from '@/services/apiClient';

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getAccessToken();
  return apiFetchJson<T>(path, init, token);
}

export interface PublicProfile {
  id: string;
  professionalId: string;
  avatar: string | null;
  pageName: string;
  address: string;
  bio: string;
  instagram: string;
  createdAt: string;
  updatedAt: string;
}

const schedulePublicProfileService = {
  getPublicProfile(): Promise<PublicProfile | null> {
    return request("/schedule/profile/public").catch(() => null);
  },

  getPublicProfileByProfessional(
    professionalId: string
  ): Promise<PublicProfile | null> {
    return request(
      `/schedule/profile/public/${encodeURIComponent(professionalId)}`
    ).catch(() => null);
  },

  updatePublicProfile(data: {
    avatar?: string | null;
    pageName?: string;
    address?: string;
    bio?: string;
    instagram?: string;
  }): Promise<PublicProfile> {
    return request("/schedule/profile/public", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },
};

export default schedulePublicProfileService;
