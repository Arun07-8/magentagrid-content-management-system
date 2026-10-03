import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postManagementApi, type CreatePostPayload, type UpdatePostPayload } from '../api/postManagementApi';
import { POSTS_QUERY_KEY, PUBLIC_POSTS_QUERY_KEY } from '../../../entities/post';

/**
 * Mutation: Create Post
 */
export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePostPayload) => postManagementApi.createPost(payload),
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
      postManagementApi.updatePost(id, payload),
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
    mutationFn: (id: string) => postManagementApi.publishPost(id),
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
    mutationFn: (id: string) => postManagementApi.unpublishPost(id),
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
    mutationFn: (id: string) => postManagementApi.deletePost(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: POSTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: PUBLIC_POSTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['cms-post', id] });
      queryClient.invalidateQueries({ queryKey: ['public-post', id] });
    },
  });
};
