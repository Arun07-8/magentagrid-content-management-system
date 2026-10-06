import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { pageApi } from './pageApi';
import type { HomePageSections, AboutPageSections, NotFoundPageSections, PageSectionMeta, PageSEO } from './types';
import { getSocket } from '../../shared/api/socket';

export const PAGE_KEYS = {
  all: ['pages'] as const,
  public: (slug: string) => ['public-pages', slug] as const,
  adminDetail: (slug: string) => ['admin-pages', slug] as const,
};

// 1. Hook for public pages (strictly only returns data if published)
export function usePublicPage<T = any>(slug: string) {
  return useQuery({
    queryKey: PAGE_KEYS.public(slug),
    queryFn: async () => {
      try {
        const data = await pageApi.getPublicPage<any>(slug);
        if (!data) return null;
        if (data.status && data.status !== 'Published') {
          return null;
        }
        return data as T;
      } catch (err) {
        return null;
      }
    },
    staleTime: 1000 * 30, // 30 seconds cache for immediate updates
  });
}

export function usePublicHomePage() {
  return useQuery({
    queryKey: PAGE_KEYS.public('home'),
    queryFn: async () => {
      try {
        const data = await pageApi.getPublicPage<any>('home');
        if (!data) return null;
        return (data.sections || data) as HomePageSections;
      } catch (err) {
        return null;
      }
    },
    staleTime: 1000 * 30,
  });
}

export function usePublicAboutPage() {
  return useQuery({
    queryKey: PAGE_KEYS.public('about'),
    queryFn: async () => {
      try {
        const data = await pageApi.getPublicPage<any>('about');
        if (!data || (data.status && data.status !== 'Published')) return null;
        return (data.sections || data) as AboutPageSections;
      } catch (err) {
        return null;
      }
    },
    staleTime: 1000 * 30,
  });
}

export function usePublicNotFoundPage() {
  return useQuery({
    queryKey: PAGE_KEYS.public('404'),
    queryFn: async () => {
      try {
        const data = await pageApi.getPublicPage<any>('404');
        if (!data || (data.status && data.status !== 'Published')) return null;
        return (data.sections || data) as NotFoundPageSections;
      } catch (err) {
        return null;
      }
    },
    staleTime: 1000 * 30,
  });
}

// 2. Hooks for Admin CMS
export function useCmsPages() {
  return useQuery({
    queryKey: PAGE_KEYS.all,
    queryFn: () => pageApi.getAllPages(),
  });
}

export function useCmsPage<T = any>(slug: string) {
  return useQuery({
    queryKey: PAGE_KEYS.adminDetail(slug),
    queryFn: () => pageApi.getPageBySlug<T>(slug),
    enabled: Boolean(slug),
  });
}

export function useCreatePage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: {
      title: string;
      slug: string;
      status?: 'Draft' | 'Published';
      seo?: PageSEO;
      sectionOrder?: PageSectionMeta[];
      sections?: any;
    }) => pageApi.createPage(payload),
    onSuccess: (newPage) => {
      queryClient.invalidateQueries({ queryKey: PAGE_KEYS.all });
      queryClient.invalidateQueries({ queryKey: PAGE_KEYS.adminDetail(newPage.slug) });
    },
  });
}

export function useUpdatePage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      slug,
      title,
      newSlug,
      status,
      seo,
      sectionOrder,
      sections,
    }: {
      slug: string;
      title?: string;
      newSlug?: string;
      status?: 'Draft' | 'Published';
      seo?: PageSEO;
      sectionOrder?: PageSectionMeta[];
      sections?: any;
    }) => pageApi.updatePage(slug, { title, newSlug, status, seo, sectionOrder, sections }),
    onSuccess: (updatedPage, variables) => {
      queryClient.invalidateQueries({ queryKey: PAGE_KEYS.all });
      queryClient.invalidateQueries({ queryKey: PAGE_KEYS.adminDetail(updatedPage.slug) });

      // ONLY invalidate public website cache if status was explicitly published or unpublished
      if (variables.status === 'Published' || variables.status === 'Draft') {
        queryClient.invalidateQueries({ queryKey: PAGE_KEYS.public(updatedPage.slug) });
      }
    },
  });
}

export function useDeletePage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slug: string) => pageApi.deletePage(slug),
    onSuccess: (_, deletedSlug) => {
      queryClient.invalidateQueries({ queryKey: PAGE_KEYS.all });
      queryClient.removeQueries({ queryKey: PAGE_KEYS.adminDetail(deletedSlug) });
      queryClient.removeQueries({ queryKey: PAGE_KEYS.public(deletedSlug) });
    },
  });
}

export function usePublishPage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slug: string) => pageApi.publishPage(slug),
    onSuccess: (updatedPage) => {
      queryClient.invalidateQueries({ queryKey: PAGE_KEYS.all });
      queryClient.invalidateQueries({ queryKey: PAGE_KEYS.adminDetail(updatedPage.slug) });
      queryClient.invalidateQueries({ queryKey: PAGE_KEYS.public(updatedPage.slug) });
    },
  });
}

export function useUnpublishPage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slug: string) => pageApi.unpublishPage(slug),
    onSuccess: (updatedPage) => {
      queryClient.invalidateQueries({ queryKey: PAGE_KEYS.all });
      queryClient.invalidateQueries({ queryKey: PAGE_KEYS.adminDetail(updatedPage.slug) });
      queryClient.invalidateQueries({ queryKey: PAGE_KEYS.public(updatedPage.slug) });
    },
  });
}

// Realtime sync hook
export function useRealtimePages() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    // Public changes (Publish / Unpublish / Delete)
    const handlePageChange = (payload: { slug?: string }) => {
      if (payload?.slug) {
        queryClient.invalidateQueries({ queryKey: PAGE_KEYS.public(payload.slug) });
        queryClient.invalidateQueries({ queryKey: PAGE_KEYS.adminDetail(payload.slug) });
      }
      queryClient.invalidateQueries({ queryKey: PAGE_KEYS.all });
    };

    // Internal CMS Draft updates (Does NOT invalidate public queries)
    const handleDraftUpdate = (payload: { slug?: string }) => {
      if (payload?.slug) {
        queryClient.invalidateQueries({ queryKey: PAGE_KEYS.adminDetail(payload.slug) });
      }
      queryClient.invalidateQueries({ queryKey: PAGE_KEYS.all });
    };

    socket.on('pages:changed', handlePageChange);
    socket.on('pages:draft_updated', handleDraftUpdate);
    return () => {
      socket.off('pages:changed', handlePageChange);
      socket.off('pages:draft_updated', handleDraftUpdate);
    };
  }, [queryClient]);
}
