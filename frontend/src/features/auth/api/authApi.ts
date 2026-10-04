import { apiClient } from '../../../shared/api/apiClient';
import type { User, ApiResponse } from '../../../shared/types';

export const authApi = {
  login: async (credentials: { email: string; password: string }): Promise<{ user: User; token: string }> => {
    const res = await apiClient.post<ApiResponse<{ user: User; token: string }>>('/auth/login', credentials);
    return res.data;
  },

  refresh: async (): Promise<{ user: User; token: string }> => {
    const res = await apiClient.post<ApiResponse<{ user: User; token: string }>>('/auth/refresh');
    return res.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post<ApiResponse<null>>('/auth/logout');
  },

  getMe: async (): Promise<User> => {
    const res = await apiClient.get<ApiResponse<User>>('/auth/me');
    return res.data;
  },
};
