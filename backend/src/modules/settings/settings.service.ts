import mongoose from 'mongoose';
import { SettingsModel, ISiteSettings, INavigationItem, ISiteLogo } from './settings.model.js';
import { broadcastEvent } from '../../config/socket.js';

const DEFAULT_SETTINGS = {
  key: 'site-settings',
  logo: {
    url: '/logo/logo.png',
    text: 'Editorial',
    link: '/',
  },
  navigationItems: [
    { id: 'nav-1', label: 'Home', url: '/', isExternal: false, isEnabled: true },
    { id: 'nav-2', label: 'About', url: '/about', isExternal: false, isEnabled: true },
    { id: 'nav-3', label: 'Services', url: '/services', isExternal: false, isEnabled: true },
    { id: 'nav-4', label: 'Blog / News', url: '/blog', isExternal: false, isEnabled: true },
    { id: 'nav-5', label: 'Contact', url: '/contact', isExternal: false, isEnabled: true },
  ],
  footer: {},
};

export class SettingsService {
  private isDbConnected(): boolean {
    return mongoose.connection.readyState === 1;
  }

  async getSettings(): Promise<any> {
    if (!this.isDbConnected()) {
      return DEFAULT_SETTINGS;
    }

    let settings = await SettingsModel.findOne({ key: 'site-settings' });
    if (!settings) {
      settings = await SettingsModel.create(DEFAULT_SETTINGS);
    }

    return settings;
  }

  async updateSettings(payload: {
    logo?: ISiteLogo;
    navigationItems?: INavigationItem[];
    footer?: Record<string, any>;
  }): Promise<ISiteSettings> {
    if (!this.isDbConnected()) {
      return { ...DEFAULT_SETTINGS, ...payload } as any;
    }

    let settings = await SettingsModel.findOne({ key: 'site-settings' });
    if (!settings) {
      settings = new SettingsModel(DEFAULT_SETTINGS);
    }

    if (payload.logo !== undefined) settings.logo = payload.logo;
    if (payload.navigationItems !== undefined) settings.navigationItems = payload.navigationItems;
    if (payload.footer !== undefined) settings.footer = payload.footer;

    const saved = await settings.save();

    broadcastEvent('settings:changed', {
      action: 'update',
      settings: saved,
    });

    return saved;
  }
}
