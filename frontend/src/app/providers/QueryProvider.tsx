import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useRealtimePosts } from '../../entities/post/hooks/usePosts';
import { useUserStore } from '../../entities/user/model/userStore';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 30, // 30 seconds
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
