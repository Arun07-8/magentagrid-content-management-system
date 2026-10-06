import { apiClient } from '../../shared/api/apiClient';
import type { ISiteSettings, ISiteLogo, INavigationItem } from './types';
import type { ApiResponse } from '../../shared/types';

export const settingsApi = {
  async getPublicSettings(): Promise<ISiteSettings> {
    const res = await apiClient.get<ApiResponse<ISiteSettings>>('/settings/public');
    return res.data;
  },

  async getSettings(): Promise<ISiteSettings> {
    const res = await apiClient.get<ApiResponse<ISiteSettings>>('/settings');
    return res.data;
  },

  async updateSettings(payload: {
    logo?: ISiteLogo;
    navigationItems?: INavigationItem[];
    footer?: Record<string, any>;
  }): Promise<ISiteSettings> {
    const res = await apiClient.put<ApiResponse<ISiteSettings>>('/settings', payload);
    return res.data;
  },
};

