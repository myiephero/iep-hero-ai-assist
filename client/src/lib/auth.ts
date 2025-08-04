import { apiRequest } from "./queryClient";

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  role: string;
  planStatus?: string;
  subscriptionTier?: string;
  plan?: string;
}

export interface RegisterData {
  email: string;
  username: string;
  password: string;
  role: string;
  planStatus?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export const authApi = {
  register: async (data: RegisterData): Promise<{ user: AuthUser }> => {
    const response = await apiRequest("POST", "/api/register", data);
    return response.json();
  },

  login: async (data: LoginData): Promise<{ user: AuthUser }> => {
    const response = await apiRequest("POST", "/api/login", data);
    return response.json();
  },

  logout: async (): Promise<void> => {
    await apiRequest("POST", "/api/logout");
  },

  getCurrentUser: async (): Promise<{ user: AuthUser } | null> => {
    try {
      const response = await apiRequest("GET", "/api/me");
      return response.json();
    } catch (error) {
      return null;
    }
  },
};
