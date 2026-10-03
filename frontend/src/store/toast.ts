import { create } from 'zustand';

export interface ToastItemData {
  id: string;
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
}

export interface ToastState {
  toasts: ToastItemData[];
  addToast: (message: string, type?: 'success' | 'error' | 'info', duration?: number) => string;
  removeToast: (id: string) => void;
  success: (message: string, duration?: number) => string;
  error: (message: string, duration?: number) => string;
  info: (message: string, duration?: number) => string;
}

export const useToast = create<ToastState>((set, get) => ({
  toasts: [],

  addToast: (message: string, type: 'success' | 'error' | 'info' = 'success', duration = 4000): string => {
    const id = Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
    set((state) => ({
      toasts: [...state.toasts, { id, message, type, duration }],
    }));

    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      }, duration);
    }

    return id;
  },

  removeToast: (id: string) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },

  success: (message: string, duration?: number): string => {
    return get().addToast(message, 'success', duration);
  },

  error: (message: string, duration?: number): string => {
    return get().addToast(message, 'error', duration);
  },

  info: (message: string, duration?: number): string => {
    return get().addToast(message, 'info', duration);
  },
}));

export const toast = {
  success: (message: string, duration?: number) => useToast.getState().success(message, duration),
  error: (message: string, duration?: number) => useToast.getState().error(message, duration),
  info: (message: string, duration?: number) => useToast.getState().info(message, duration),
  add: (message: string, type?: 'success' | 'error' | 'info', duration?: number) =>
    useToast.getState().addToast(message, type, duration),
  remove: (id: string) => useToast.getState().removeToast(id),
};
