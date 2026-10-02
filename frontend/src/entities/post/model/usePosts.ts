import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { postApi } from '../api/postApi';
import { getSocket } from '../../../shared/api/socket';

export const POSTS_QUERY_KEY = ['posts'];
export const PUBLIC_POSTS_QUERY_KEY = ['public-posts'];

/**
 * Fetch published posts for public website
 */
export const usePublicPosts = (params?: { category?: string }) => {
  return useQuery({
    queryKey: [...PUBLIC_POSTS_QUERY_KEY, params?.category || 'All'],
    queryFn: () => postApi.getPublicPosts(params),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

/**
 * Fetch single published post for public view
 */
export const usePublicPost = (id: string | undefined) => {
  return useQuery({
    queryKey: ['public-post', id],
    queryFn: () => postApi.getPublicPostById(id!),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * Fetch all posts for CMS dashboard
 */
export const useCmsPosts = (params?: { search?: string; status?: string }) => {
  return useQuery({
    queryKey: [...POSTS_QUERY_KEY, params?.search || '', params?.status || 'All'],
    queryFn: () => postApi.getCmsPosts(params),
    staleTime: 1000 * 60 * 1, // 1 minute
  });
};

/**
 * Fetch single post for CMS edit/preview
 */
export const useCmsPost = (id: string | undefined) => {
  return useQuery({
    queryKey: ['cms-post', id],
    queryFn: () => postApi.getCmsPostById(id!),
    enabled: Boolean(id),
  });
};

/**
 * Real-time subscription hook to automatically invalidate cache when posts change
 */
export const useRealtimePosts = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const socket = getSocket();

    const handlePostsChanged = (payload: unknown) => {
      console.log('Real-time update received:', payload);
      // Invalidate both CMS and public query caches
      queryClient.invalidateQueries({ queryKey: POSTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: PUBLIC_POSTS_QUERY_KEY });
    };

    socket.on('posts:changed', handlePostsChanged);

    return () => {
      socket.off('posts:changed', handlePostsChanged);
    };
  }, [queryClient]);
};
