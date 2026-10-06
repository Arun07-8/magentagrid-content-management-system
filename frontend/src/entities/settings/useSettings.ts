import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { settingsApi } from './settingsApi';
import { DEFAULT_SITE_SETTINGS, type ISiteSettings, type ISiteLogo, type INavigationItem } from './types';
import { getSocket } from '../../shared/api/socket';

export const SETTINGS_KEY = ['site-settings'] as const;

export function usePublicSettings() {
  return useQuery({
    queryKey: ['public-settings'],
    queryFn: async () => {
      try {
        const data = await settingsApi.getPublicSettings();
        return data || DEFAULT_SITE_SETTINGS;
      } catch (err) {
        return DEFAULT_SITE_SETTINGS;
      }
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useSiteSettings() {
  return useQuery({
    queryKey: SETTINGS_KEY,
    queryFn: async () => {
      try {
        const data = await settingsApi.getSettings();
        return data || DEFAULT_SITE_SETTINGS;
      } catch (err) {
        return DEFAULT_SITE_SETTINGS;
      }
    },
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: {
      logo?: ISiteLogo;
      navigationItems?: INavigationItem[];
      footer?: Record<string, any>;
      isPublishing?: boolean;
    }) => settingsApi.updateSettings(payload),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(SETTINGS_KEY, data);
      queryClient.invalidateQueries({ queryKey: SETTINGS_KEY });
      if (variables.isPublishing) {
        queryClient.setQueryData(['public-settings'], data);
        queryClient.invalidateQueries({ queryKey: ['public-settings'] });
      }
    },
  });
}

export function useRealtimeSettings() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    // Published changes
    const handleSettingsChange = (payload: { settings?: ISiteSettings }) => {
      if (payload?.settings) {
        queryClient.setQueryData(['public-settings'], payload.settings);
        queryClient.setQueryData(SETTINGS_KEY, payload.settings);
      }
      queryClient.invalidateQueries({ queryKey: SETTINGS_KEY });
      queryClient.invalidateQueries({ queryKey: ['public-settings'] });
    };

    // Internal CMS draft updates
    const handleDraftSettingsChange = (payload: { settings?: ISiteSettings }) => {
      if (payload?.settings) {
        queryClient.setQueryData(SETTINGS_KEY, payload.settings);
      }
      queryClient.invalidateQueries({ queryKey: SETTINGS_KEY });
    };

    socket.on('settings:changed', handleSettingsChange);
    socket.on('settings:draft_updated', handleDraftSettingsChange);
    return () => {
      socket.off('settings:changed', handleSettingsChange);
      socket.off('settings:draft_updated', handleDraftSettingsChange);
    };
  }, [queryClient]);
}
