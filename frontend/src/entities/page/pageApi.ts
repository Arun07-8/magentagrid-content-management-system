import { apiClient } from '../../shared/api/apiClient';
import type { Page, PageSectionMeta, PageSEO } from './types';
import type { ApiResponse } from '../../shared/types';

export const pageApi = {
  // Public
  getPublicPage: async <T = any>(slug: string): Promise<T> => {
    const res = await apiClient.get<ApiResponse<T>>(`/pages/public/${slug}`);
    return res.data;
  },

  // Admin CMS
  getAllPages: async (): Promise<Page[]> => {
    const res = await apiClient.get<ApiResponse<Page[]>>('/pages');
    return res.data;
  },

  getPageBySlug: async <T = any>(slug: string): Promise<Page<T>> => {
    const res = await apiClient.get<ApiResponse<Page<T>>>(`/pages/${slug}`);
    return res.data;
  },

  createPage: async (payload: {
    title: string;
    slug: string;
    status?: 'Draft' | 'Published';
    seo?: PageSEO;
    sectionOrder?: PageSectionMeta[];
    sections?: any;
  }): Promise<Page> => {
    const res = await apiClient.post<ApiResponse<Page>>('/pages', payload);
    return res.data;
  },

  updatePage: async (
    slug: string,
    payload: {
      title?: string;
      newSlug?: string;
      status?: 'Draft' | 'Published';
      seo?: PageSEO;
      sectionOrder?: PageSectionMeta[];
      sections?: any;
    }
  ): Promise<Page> => {
    const res = await apiClient.put<ApiResponse<Page>>(`/pages/${slug}`, payload);
    return res.data;
  },

  deletePage: async (slug: string): Promise<void> => {
    await apiClient.delete<ApiResponse<any>>(`/pages/${slug}`);
  },

  publishPage: async (slug: string): Promise<Page> => {
    const res = await apiClient.patch<ApiResponse<Page>>(`/pages/${slug}/publish`);
    return res.data;
  },

  unpublishPage: async (slug: string): Promise<Page> => {
    const res = await apiClient.patch<ApiResponse<Page>>(`/pages/${slug}/unpublish`);
    return res.data;
  },
};
