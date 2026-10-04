export type UserRole = 'admin' | 'editor';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  createdAt?: string;
}

export type PostStatus = 'Draft' | 'Published';

export interface Post {
  _id: string;
  id?: string;
  title: string;
  description: string;
  content: string;
  imageUrl?: string;
  category?: string;
  status: PostStatus;
  author?: {
    id: string;
    name: string;
  };
  views?: number;
  readTime?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  count?: number;
  data: T;
  errors?: Array<{ field: string; message: string }>;
}
