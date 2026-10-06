import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import type { User, UserRole, ApiResponse } from '../../shared/types';
import { apiClient } from '../../shared/api/apiClient';
import { authApi } from '../../features/auth/api/authApi';

interface AuthContextValue {
  user: User | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  isLoading: boolean;
  setAuth: (user: User, token?: string | null) => void;
  logout: () => Promise<void>;
  checkAuth: () => Promise<User | null>;
  login: (credentials: { email: string; password: string }) => Promise<any>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// Safely load initial cached user if available for fast UI restoration
function getInitialUser(): User | null {
  try {
    const userStr = typeof window !== 'undefined' ? localStorage.getItem('cms_user') : null;
    return userStr ? (JSON.parse(userStr) as User) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(getInitialUser);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const setAuth = useCallback((newUser: User, _token?: string | null) => {
    localStorage.removeItem('cms_token');
    localStorage.setItem('cms_user', JSON.stringify(newUser));
    setUser(newUser);
    setIsInitialized(true);
    setIsLoading(false);
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (e) {
      console.error('Logout error:', e);
    } finally {
      localStorage.removeItem('cms_token');
      localStorage.removeItem('cms_user');
      setUser(null);
      setIsInitialized(true);
      setIsLoading(false);
    }
  }, []);

  const checkAuth = useCallback(async (): Promise<User | null> => {
    setIsLoading(true);
    try {
      const res = await apiClient.get<ApiResponse<User>>('/auth/me');
      const freshUser = res.data;
      setAuth(freshUser);
      return freshUser;
    } catch {
      localStorage.removeItem('cms_token');
      localStorage.removeItem('cms_user');
      setUser(null);
      return null;
    } finally {
      setIsInitialized(true);
      setIsLoading(false);
    }
  }, [setAuth]);

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setAuth(data.user, data.token);
    },
  });

  const login = useCallback(
    async (credentials: { email: string; password: string }) => {
      return loginMutation.mutateAsync(credentials);
    },
    [loginMutation]
  );

  // Initial session restoration on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const value: AuthContextValue = {
    user,
    role: user?.role ?? null,
    isAuthenticated: !!user,
    isInitialized,
    isLoading: isLoading || loginMutation.isPending,
    setAuth,
    logout,
    checkAuth,
    login,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
