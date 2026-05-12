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

export interface ApiUser {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  profession: string | null;
  professionalRegister: string | null;
  professionalCouncil: string | null;
  role: string;
  approvalStatus: string;
  accountStatus: string;
  approvedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

const usersService = {
  findAll(): Promise<ApiUser[]> {
    return request("/users");
  },

  getById(id: string): Promise<ApiUser> {
    return request(`/users/${id}`);
  },

  async getCurrentProfile(): Promise<ApiUser> {
    return request("/users/profile/me");
  },

  async updateProfile(data: {
    fullName?: string;
    email?: string;
    phone?: string;
    profession?: string;
    professionalRegister?: string;
    professionalCouncil?: string;
  }): Promise<ApiUser> {
    // Remove caracteres não numéricos do telefone
    const updateData = { ...data };
    if (updateData.phone) {
      updateData.phone = updateData.phone.replace(/\D/g, '');
    }
    return request("/users/profile", {
      method: "PATCH",
      body: JSON.stringify(updateData),
    });
  },

  async updateUser(id: string, data: {
    fullName?: string;
    email?: string;
    phone?: string;
    profession?: string;
    professionalRegister?: string;
    professionalCouncil?: string;
  }): Promise<ApiUser> {
    // Remove caracteres não numéricos do telefone
    const updateData = { ...data };
    if (updateData.phone) {
      updateData.phone = updateData.phone.replace(/\D/g, '');
    }
    return request(`/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify(updateData),
    });
  },

  approve(id: string): Promise<ApiUser> {
    return request(`/users/${id}/approve`, { method: "PATCH" });
  },

  reject(id: string): Promise<ApiUser> {
    return request(`/users/${id}/reject`, { method: "PATCH" });
  },

  activate(id: string): Promise<ApiUser> {
    return request(`/users/${id}/activate`, { method: "PATCH" });
  },

  deactivate(id: string): Promise<ApiUser> {
    return request(`/users/${id}/deactivate`, { method: "PATCH" });
  },

  delete(id: string): Promise<void> {
    return request(`/users/${id}`, { method: "DELETE" });
  },

  async changePassword(data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }): Promise<ApiUser> {
    return request("/users/profile/change-password", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },
};

export default usersService;
