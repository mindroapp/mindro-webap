import { getAccessToken } from "@/services/authService";

const BASE_URL = (import.meta as any).env?.VITE_API_URL ?? "http://localhost:6001/api";

function headers(): HeadersInit {
  const token = getAccessToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, { ...init, headers: headers() });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.message ?? `Request failed: ${res.status}`);
  }
  if (res.status === 204 || init.method === "DELETE") {
    return undefined as T;
  }
  return res.json() as Promise<T>;
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
