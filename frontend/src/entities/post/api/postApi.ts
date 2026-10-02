import { apiClient } from '../../../shared/api/apiClient';
import type { Post, ApiResponse } from '../../../shared/types';

export const postApi = {
  // Public domain queries
  getPublicPosts: async (params?: { category?: string }): Promise<Post[]> => {
    const res = await apiClient.get<ApiResponse<Post[]>>('/posts/public', params);
    return res.data;
  },

  getPublicPostById: async (id: string): Promise<Post> => {
    const res = await apiClient.get<ApiResponse<Post>>(`/posts/public/${id}`);
    return res.data;
  },

  // CMS domain queries
  getCmsPosts: async (params?: { search?: string; status?: string }): Promise<Post[]> => {
    const res = await apiClient.get<ApiResponse<Post[]>>('/posts', params);
    return res.data;
  },

  getCmsPostById: async (id: string): Promise<Post> => {
    const res = await apiClient.get<ApiResponse<Post>>(`/posts/${id}`);
    return res.data;
  },
};
