import { apiClient } from '../../../shared/api/apiClient';
import type { Post, ApiResponse } from '../../../shared/types';

export const postApi = {
  // Public
  getPublicPosts: async (params?: { search?: string; category?: string }): Promise<Post[]> => {
    const res = await apiClient.get<ApiResponse<Post[]>>('/posts/public', params);
    return res.data;
  },

  getPublicPostById: async (id: string): Promise<Post> => {
    const res = await apiClient.get<ApiResponse<Post>>(`/posts/public/${id}`);
    return res.data;
  },

  // CMS
  getCmsPosts: async (params?: { search?: string; status?: string }): Promise<Post[]> => {
    const res = await apiClient.get<ApiResponse<Post[]>>('/posts', params);
    return res.data;
  },

  getCmsPostById: async (id: string): Promise<Post> => {
    const res = await apiClient.get<ApiResponse<Post>>(`/posts/${id}`);
    return res.data;
  },

  createPost: async (payload: {
    title: string;
    description: string;
    content: string;
    imageUrl?: string;
    category?: string;
    status?: 'Draft' | 'Published';
  }): Promise<Post> => {
    const res = await apiClient.post<ApiResponse<Post>>('/posts', payload);
    return res.data;
  },

  updatePost: async (
    id: string,
    payload: {
      title?: string;
      description?: string;
      content?: string;
      imageUrl?: string;
      category?: string;
      status?: 'Draft' | 'Published';
    }
  ): Promise<Post> => {
    const res = await apiClient.put<ApiResponse<Post>>(`/posts/${id}`, payload);
    return res.data;
  },

  publishPost: async (id: string): Promise<Post> => {
    const res = await apiClient.patch<ApiResponse<Post>>(`/posts/${id}/publish`);
    return res.data;
  },

  unpublishPost: async (id: string): Promise<Post> => {
    const res = await apiClient.patch<ApiResponse<Post>>(`/posts/${id}/unpublish`);
    return res.data;
  },

  deletePost: async (id: string): Promise<void> => {
    await apiClient.delete<ApiResponse<null>>(`/posts/${id}`);
  },
};
