import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { pageApi } from './pageApi';
import type { HomePageSections, AboutPageSections, NotFoundPageSections, PageSectionMeta, PageSEO } from './types';
import { DEFAULT_HOME_SECTIONS, DEFAULT_ABOUT_SECTIONS, DEFAULT_NOT_FOUND_SECTIONS } from './defaultPageContent';
import { getSocket } from '../../shared/api/socket';

export const PAGE_KEYS = {
  all: ['pages'] as const,
  public: (slug: string) => ['public-pages', slug] as const,
  adminDetail: (slug: string) => ['admin-pages', slug] as const,
};

// 1. Hook for public pages with automatic fallbacks
export function usePublicPage<T = any>(slug: string, defaultFallback: T) {
  return useQuery({
    queryKey: PAGE_KEYS.public(slug),
    queryFn: async () => {
      try {
        const data = await pageApi.getPublicPage<T>(slug);
        return data || defaultFallback;
      } catch (err) {
        return defaultFallback;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });
}

export function usePublicHomePage() {
  return usePublicPage<HomePageSections>('home', DEFAULT_HOME_SECTIONS);
}

export function usePublicAboutPage() {
  return usePublicPage<AboutPageSections>('about', DEFAULT_ABOUT_SECTIONS);
}

export function usePublicNotFoundPage() {
  return usePublicPage<NotFoundPageSections>('404', DEFAULT_NOT_FOUND_SECTIONS);
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
    onSuccess: (updatedPage) => {
      queryClient.invalidateQueries({ queryKey: PAGE_KEYS.all });
      queryClient.invalidateQueries({ queryKey: PAGE_KEYS.adminDetail(updatedPage.slug) });
      queryClient.invalidateQueries({ queryKey: PAGE_KEYS.public(updatedPage.slug) });
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

    const handlePageChange = (payload: { slug?: string }) => {
      if (payload?.slug) {
        queryClient.invalidateQueries({ queryKey: PAGE_KEYS.public(payload.slug) });
        queryClient.invalidateQueries({ queryKey: PAGE_KEYS.adminDetail(payload.slug) });
      }
      queryClient.invalidateQueries({ queryKey: PAGE_KEYS.all });
    };

    socket.on('pages:changed', handlePageChange);
    return () => {
      socket.off('pages:changed', handlePageChange);
    };
  }, [queryClient]);
}
