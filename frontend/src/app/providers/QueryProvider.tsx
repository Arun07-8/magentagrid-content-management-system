import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useRealtimePosts } from '../../entities/post';
import { useUserStore } from '../../entities/user';

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
  const initializeAuth = useUserStore((s) => s.initialize);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return <>{children}</>;
}

export function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <RealtimeListener>{children}</RealtimeListener>
    </QueryClientProvider>
  );
}
