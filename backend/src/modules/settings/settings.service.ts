import mongoose from 'mongoose';
import { SettingsModel, ISiteSettings, INavigationItem, ISiteLogo } from './settings.model.js';
import { broadcastEvent } from '../../config/socket.js';

const DEFAULT_SETTINGS = {
  key: 'site-settings',
  logo: {
    url: '/logo/logo.png',
    text: 'Grido',
    link: '/',
    height: 32,
  },
  navigationItems: [
    { id: 'nav-1', label: 'Home', url: '/', isExternal: false, isEnabled: true },
    { id: 'nav-2', label: 'About', url: '/about', isExternal: false, isEnabled: true },
    { id: 'nav-3', label: 'Services', url: '/services', isExternal: false, isEnabled: true },
    { id: 'nav-4', label: 'Contact', url: '/contact', isExternal: false, isEnabled: true },
  ],
  footer: {},
};

export class SettingsService {
  private isDbConnected(): boolean {
    return mongoose.connection.readyState === 1;
  }

  /**
   * Get published site settings for the public website
   */
  async getPublicSettings(): Promise<any> {
    if (!this.isDbConnected()) {
      return DEFAULT_SETTINGS;
    }

    let settings = await SettingsModel.findOne({ key: 'site-settings' });
    if (!settings) {
      settings = await SettingsModel.create({
        ...DEFAULT_SETTINGS,
        draftLogo: DEFAULT_SETTINGS.logo,
        draftNavigationItems: DEFAULT_SETTINGS.navigationItems,
        draftFooter: DEFAULT_SETTINGS.footer,
        publishedLogo: DEFAULT_SETTINGS.logo,
        publishedNavigationItems: DEFAULT_SETTINGS.navigationItems,
        publishedFooter: DEFAULT_SETTINGS.footer,
      });
    }

    return {
      key: settings.key,
      logo: settings.publishedLogo || settings.logo,
      navigationItems: settings.publishedNavigationItems || settings.navigationItems,
      footer: settings.publishedFooter || settings.footer || {},
      updatedAt: settings.updatedAt,
    };
  }

  /**
   * Get draft site settings for CMS admin editor and preview
   */
  async getSettings(): Promise<any> {
    if (!this.isDbConnected()) {
      return DEFAULT_SETTINGS;
    }

    let settings = await SettingsModel.findOne({ key: 'site-settings' });
    if (!settings) {
      settings = await SettingsModel.create({
        ...DEFAULT_SETTINGS,
        draftLogo: DEFAULT_SETTINGS.logo,
        draftNavigationItems: DEFAULT_SETTINGS.navigationItems,
        draftFooter: DEFAULT_SETTINGS.footer,
        publishedLogo: DEFAULT_SETTINGS.logo,
        publishedNavigationItems: DEFAULT_SETTINGS.navigationItems,
        publishedFooter: DEFAULT_SETTINGS.footer,
      });
    }

    return {
      key: settings.key,
      logo: settings.draftLogo || settings.logo,
      navigationItems: settings.draftNavigationItems || settings.navigationItems,
      footer: settings.draftFooter || settings.footer || {},
      updatedAt: settings.updatedAt,
    };
  }

  /**
   * Update site settings (Save Draft or Publish)
   */
  async updateSettings(
    payload: {
      logo?: ISiteLogo;
      navigationItems?: INavigationItem[];
      footer?: Record<string, any>;
      isPublishing?: boolean;
    }
  ): Promise<ISiteSettings> {
    if (!this.isDbConnected()) {
      return { ...DEFAULT_SETTINGS, ...payload } as any;
    }

    let settings = await SettingsModel.findOne({ key: 'site-settings' });
    if (!settings) {
      settings = new SettingsModel({
        ...DEFAULT_SETTINGS,
        draftLogo: DEFAULT_SETTINGS.logo,
        draftNavigationItems: DEFAULT_SETTINGS.navigationItems,
        draftFooter: DEFAULT_SETTINGS.footer,
        publishedLogo: DEFAULT_SETTINGS.logo,
        publishedNavigationItems: DEFAULT_SETTINGS.navigationItems,
        publishedFooter: DEFAULT_SETTINGS.footer,
      });
    }

    // Always update working draft state
    if (payload.logo !== undefined) {
      settings.logo = payload.logo;
      settings.draftLogo = payload.logo;
    }
    if (payload.navigationItems !== undefined) {
      settings.navigationItems = payload.navigationItems;
      settings.draftNavigationItems = payload.navigationItems;
    }
    if (payload.footer !== undefined) {
      settings.footer = payload.footer;
      settings.draftFooter = payload.footer;
    }

    // Only update published snapshot if explicitly requested (e.g. Publish Changes)
    const shouldPublish = Boolean(payload.isPublishing);
    if (shouldPublish) {
      settings.publishedLogo = JSON.parse(JSON.stringify(settings.draftLogo || settings.logo));
      settings.publishedNavigationItems = JSON.parse(JSON.stringify(settings.draftNavigationItems || settings.navigationItems));
      settings.publishedFooter = JSON.parse(JSON.stringify(settings.draftFooter || settings.footer || {}));
    }

    const saved = await settings.save();

    if (shouldPublish) {
      broadcastEvent('settings:changed', {
        action: 'update',
        settings: await this.getPublicSettings(),
      });
    } else {
      broadcastEvent('settings:draft_updated', {
        action: 'draft_update',
        settings: await this.getSettings(),
      });
    }

    return saved;
  }
}
