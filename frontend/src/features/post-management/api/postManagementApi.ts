import { apiClient } from '../../../shared/api/apiClient';
import type { Post, ApiResponse } from '../../../shared/types';

export interface CreatePostPayload {
  title: string;
  description: string;
  content: string;
  imageUrl?: string;
  category?: string;
  status?: 'Draft' | 'Published';
}

export interface UpdatePostPayload {
  title?: string;
  description?: string;
  content?: string;
  imageUrl?: string;
  category?: string;
  status?: 'Draft' | 'Published';
}

export const postManagementApi = {
  createPost: async (payload: CreatePostPayload): Promise<Post> => {
    const res = await apiClient.post<ApiResponse<Post>>('/posts', payload);
    return res.data;
  },

  updatePost: async (id: string, payload: UpdatePostPayload): Promise<Post> => {
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
