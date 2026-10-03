import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { postApi, type CreatePostPayload, type UpdatePostPayload } from '../api/postApi';
import { getSocket } from '../../../shared/api/socket';

export const POSTS_QUERY_KEY = ['posts'];
export const PUBLIC_POSTS_QUERY_KEY = ['public-posts'];

/**
 * Fetch published posts for public website
 */
export const usePublicPosts = (params?: { search?: string }) => {
  return useQuery({
    queryKey: [...PUBLIC_POSTS_QUERY_KEY, params?.search || ''],
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
 * Fetch all posts for CMS list
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

    const handlePostsChanged = (payload: any) => {
      // Invalidate both CMS and public query caches
      queryClient.invalidateQueries({ queryKey: POSTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: PUBLIC_POSTS_QUERY_KEY });

      // Targeted single-post cache invalidation if an ID was emitted
      const targetId = payload?.post?._id || payload?.post?.id || payload?.id;
      if (targetId) {
        queryClient.invalidateQueries({ queryKey: ['cms-post', targetId] });
        queryClient.invalidateQueries({ queryKey: ['public-post', targetId] });
      }
    };

    socket.on('posts:changed', handlePostsChanged);

    return () => {
      socket.off('posts:changed', handlePostsChanged);
    };
  }, [queryClient]);
};

/**
 * Mutation: Create Post
 */
export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePostPayload) => postApi.createPost(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: POSTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: PUBLIC_POSTS_QUERY_KEY });
    },
  });
};

/**
 * Mutation: Update Post
 */
export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdatePostPayload }) =>
      postApi.updatePost(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: POSTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: PUBLIC_POSTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['cms-post', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['public-post', variables.id] });
    },
  });
};

/**
 * Mutation: Publish Post (Admin only)
 */
export const usePublishPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => postApi.publishPost(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: POSTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: PUBLIC_POSTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['cms-post', id] });
      queryClient.invalidateQueries({ queryKey: ['public-post', id] });
    },
  });
};

/**
 * Mutation: Unpublish Post (Admin only)
 */
export const useUnpublishPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => postApi.unpublishPost(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: POSTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: PUBLIC_POSTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['cms-post', id] });
      queryClient.invalidateQueries({ queryKey: ['public-post', id] });
    },
  });
};

/**
 * Mutation: Delete Post (Admin only)
 */
export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => postApi.deletePost(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: POSTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: PUBLIC_POSTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['cms-post', id] });
      queryClient.invalidateQueries({ queryKey: ['public-post', id] });
    },
  });
};
