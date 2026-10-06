import mongoose, { Document, Schema } from 'mongoose';

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
  height?: number;
}

export interface ISiteSettings extends Document {
  key: string; // 'site-settings'
  logo: ISiteLogo;
  navigationItems: INavigationItem[];
  footer?: Record<string, any>;

  // Draft working fields
  draftLogo?: ISiteLogo;
  draftNavigationItems?: INavigationItem[];
  draftFooter?: Record<string, any>;

  // Published snapshot fields
  publishedLogo?: ISiteLogo;
  publishedNavigationItems?: INavigationItem[];
  publishedFooter?: Record<string, any>;

  updatedAt: Date;
  createdAt: Date;
}

const settingsSchema = new Schema<ISiteSettings>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: 'site-settings',
    },
    logo: {
      url: { type: String, default: '/logo/logo.png' },
      text: { type: String, default: 'Grido' },
      link: { type: String, default: '/' },
      height: { type: Number, default: 32 },
    },
    navigationItems: {
      type: [
        {
          id: { type: String, required: true },
          label: { type: String, required: true },
          url: { type: String, required: true },
          isExternal: { type: Boolean, default: false },
          isEnabled: { type: Boolean, default: true },
        },
      ],
      default: [
        { id: 'nav-1', label: 'Home', url: '/', isExternal: false, isEnabled: true },
        { id: 'nav-2', label: 'About', url: '/about', isExternal: false, isEnabled: true },
        { id: 'nav-3', label: 'Services', url: '/services', isExternal: false, isEnabled: true },
        { id: 'nav-4', label: 'Contact', url: '/contact', isExternal: false, isEnabled: true },
      ],
    },
    footer: {
      type: Schema.Types.Mixed,
      default: {},
    },

    // Draft fields
    draftLogo: { type: Schema.Types.Mixed },
    draftNavigationItems: { type: Schema.Types.Mixed },
    draftFooter: { type: Schema.Types.Mixed },

    // Published fields
    publishedLogo: { type: Schema.Types.Mixed },
    publishedNavigationItems: { type: Schema.Types.Mixed },
    publishedFooter: { type: Schema.Types.Mixed },
  },
  {
    timestamps: true,
  }
);

export const SettingsModel = mongoose.model<ISiteSettings>('SiteSettings', settingsSchema);
