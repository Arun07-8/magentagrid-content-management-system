import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useRealtimePosts } from '../../entities/post';
import { useUserStore } from '../../entities/user';
import { authApi } from '../../features/auth';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 30, 
    },
  },
});

function RealtimeListener({ children }: { children: React.ReactNode }) {
  useRealtimePosts();
  const { initialize, setAuth, logout } = useUserStore();

  useEffect(() => {
    initialize();

    // Verify session with the backend database
    const token = localStorage.getItem('cms_token');
    if (token) {
      authApi
        .getMe()
        .then((freshUser) => {
          setAuth(freshUser, token);
        })
        .catch(() => {
          // Token is expired or user was removed from database
          logout();
        });
    }
  }, [initialize, setAuth, logout]);

  return <>{children}</>;
}

export function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <RealtimeListener>{children}</RealtimeListener>
    </QueryClientProvider>
  );
}
