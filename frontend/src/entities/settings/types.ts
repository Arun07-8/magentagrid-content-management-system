export interface INavigationItem {
  id: string;
  label: string;
  url: string;
  isExternal?: boolean;
  isEnabled?: boolean;
}

export interface ISiteLogo {
  url: string;
  text?: string;
  link?: string;
}

export interface ISiteSettings {
  key: string;
  logo: ISiteLogo;
  navigationItems: INavigationItem[];
  footer?: Record<string, any>;
  updatedAt?: string;
  createdAt?: string;
}

export const DEFAULT_SITE_SETTINGS: ISiteSettings = {
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
