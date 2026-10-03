import { apiClient } from '../../../shared/api/apiClient';
import type { Post, ApiResponse } from '../../../shared/types';

export interface CreatePostPayload {
  title: string;
  description: string;
  content: string;
  imageUrl?: string;
  image?: File | null;
  category?: string;
  status?: 'Draft' | 'Published';
}

export interface UpdatePostPayload {
  title?: string;
  description?: string;
  content?: string;
  imageUrl?: string;
  image?: File | null;
  category?: string;
  status?: 'Draft' | 'Published';
}

export const postManagementApi = {
  createPost: async (payload: CreatePostPayload): Promise<Post> => {
    let body: unknown = payload;
    if (payload.image instanceof File) {
      const formData = new FormData();
      formData.append('title', payload.title);
      formData.append('description', payload.description);
      formData.append('content', payload.content);
      if (payload.category) formData.append('category', payload.category);
      if (payload.status) formData.append('status', payload.status);
      formData.append('image', payload.image);
      body = formData;
    }
    const res = await apiClient.post<ApiResponse<Post>>('/posts', body);
    return res.data;
  },

  updatePost: async (id: string, payload: UpdatePostPayload): Promise<Post> => {
    let body: unknown = payload;
    if (payload.image instanceof File) {
      const formData = new FormData();
      if (payload.title !== undefined) formData.append('title', payload.title);
      if (payload.description !== undefined) formData.append('description', payload.description);
      if (payload.content !== undefined) formData.append('content', payload.content);
      if (payload.category !== undefined) formData.append('category', payload.category);
      if (payload.status !== undefined) formData.append('status', payload.status);
      if (payload.imageUrl !== undefined) formData.append('imageUrl', payload.imageUrl);
      formData.append('image', payload.image);
      body = formData;
    }
    const res = await apiClient.put<ApiResponse<Post>>(`/posts/${id}`, body);
    return res.data;
  },

  uploadImage: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);
    const res = await apiClient.post<ApiResponse<{ url: string }>>('/posts/upload', formData);
    return res.data?.url || (res as unknown as { url: string }).url;
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
