import { create } from 'zustand';
import type { User, UserRole } from '../../../shared/types';

interface UserState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  role: UserRole | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  initialize: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  role: null,

  setAuth: (user: User, token: string) => {
    localStorage.setItem('cms_token', token);
    localStorage.setItem('cms_user', JSON.stringify(user));
    set({
      user,
      token,
      isAuthenticated: true,
      role: user.role,
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
    });
  },

  initialize: () => {
    try {
      const token = localStorage.getItem('cms_token');
      const userStr = localStorage.getItem('cms_user');

      if (token && userStr) {
        const user = JSON.parse(userStr) as User;
        set({
          user,
          token,
          isAuthenticated: true,
          role: user.role,
        });
      }
    } catch (e) {
      console.error('Failed to restore authentication state:', e);
      localStorage.removeItem('cms_token');
      localStorage.removeItem('cms_user');
    }
  },
}));
