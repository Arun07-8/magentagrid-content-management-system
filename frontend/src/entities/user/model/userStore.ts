import { create } from 'zustand';
import type { User, UserRole, ApiResponse } from '../../../shared/types';
import { apiClient } from '../../../shared/api/apiClient';

interface UserState {
  user: User | null;
  token?: string | null;
  isAuthenticated: boolean;
  role: UserRole | null;
  isInitialized: boolean;
  isLoading: boolean;
  setAuth: (user: User, token?: string | null) => void;
  logout: () => void;
  initialize: () => void;
  checkAuth: () => Promise<User | null>;
}

// Safely load initial cached user if available for fast UI restoration
let initialUser: User | null = null;
try {
  const userStr = typeof window !== 'undefined' ? localStorage.getItem('cms_user') : null;
  if (userStr) {
    initialUser = JSON.parse(userStr) as User;
  }
} catch {
  initialUser = null;
}

export const useUserStore = create<UserState>((set, get) => ({
  user: initialUser,
  token: null,
  isAuthenticated: !!initialUser,
  role: initialUser?.role ?? null,
  isInitialized: false,
  isLoading: true,

  setAuth: (user: User, token?: string | null) => {
    localStorage.removeItem('cms_token');
    localStorage.setItem('cms_user', JSON.stringify(user));

    set({
      user,
      token: token ?? null,
      isAuthenticated: true,
      role: user.role,
      isInitialized: true,
      isLoading: false,
    });
  },

  logout: () => {
    localStorage.removeItem('cms_token');
    localStorage.removeItem('cms_user');
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      role: null,
      isInitialized: true,
      isLoading: false,
    });
  },

  initialize: () => {
    try {
      localStorage.removeItem('cms_token');
      const userStr = localStorage.getItem('cms_user');

      if (userStr) {
        const user = JSON.parse(userStr) as User;
        set({
          user,
          isAuthenticated: true,
          role: user.role,
        });
      }
    } catch (e) {
      console.error('Failed to restore cached authentication state:', e);
      localStorage.removeItem('cms_token');
      localStorage.removeItem('cms_user');
    }
  },

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      // apiClient.get automatically attempts token refresh on 401 via /auth/refresh cookie
      const res = await apiClient.get<ApiResponse<User>>('/auth/me');
      const freshUser = res.data;
      get().setAuth(freshUser);
      return freshUser;
    } catch {
      get().logout();
      return null;
    } finally {
      set({ isInitialized: true, isLoading: false });
    }
  },
}));


