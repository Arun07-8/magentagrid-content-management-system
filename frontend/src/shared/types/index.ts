export type UserRole = 'admin' | 'editor';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  createdAt?: string;
}


export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  count?: number;
  data: T;
  errors?: Array<{ field: string; message: string }>;
}
