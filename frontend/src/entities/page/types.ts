export type PageStatus = 'Draft' | 'Published';

export interface PageHeroSection {
  badgeText: string;
  heading: string;
  highlightWord: string;
  description: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
  readersCount: string;
  readersLabel: string;
  card1Image?: string;
  card2Image?: string;
}

export interface PageServiceItem {
  title: string;
  description: string;
}

export interface PageServicesSection {
  badgeText: string;
  heading: string;
  description: string;
  items: PageServiceItem[];
}

export interface PageWhyUsFeature {
  title: string;
  description: string;
}

export interface PageWhyUsSection {
  badgeText: string;
  heading: string;
  description: string;
  image?: string;
  features: PageWhyUsFeature[];
}

export interface PageProcessStep {
  num: string;
  title: string;
  items: string[];
}

export interface PageProcessSection {
  badgeText: string;
  heading: string;
  description: string;
  steps: PageProcessStep[];
}

export interface PageTestimonialItem {
  quote: string;
  author: string;
  role: string;
  image?: string;
}

export interface PageTestimonialsSection {
  badgeText: string;
  heading: string;
  items: PageTestimonialItem[];
}

export interface PageCtaSection {
  badgeText: string;
  heading: string;
  description: string;
  contactEmail: string;
  workingHours: string;
  location: string;
}

export interface HomePageSections {
  hero: PageHeroSection;
  services: PageServicesSection;
  whyUs: PageWhyUsSection;
  process: PageProcessSection;
  testimonials: PageTestimonialsSection;
  cta: PageCtaSection;
}

export interface AboutHeaderSection {
  badgeText: string;
  heading: string;
  highlightWord: string;
  description: string;
  pillars: string[];
}

export interface AboutPhilosophySection {
  badgeText: string;
  heading: string;
  paragraphs: string[];
}

export interface AboutCapabilityItem {
  title: string;
  description: string;
}

export interface AboutCapabilitiesSection {
  badgeText: string;
  heading: string;
  description: string;
  items: AboutCapabilityItem[];
}

export interface AboutMissionVisionSection {
  missionTitle: string;
  missionDescription: string;
  visionTitle: string;
  visionDescription: string;
}

export interface AboutValueItem {
  number: string;
  title: string;
  description: string;
}

export interface AboutValuesSection {
  badgeText: string;
  heading: string;
  description: string;
  items: AboutValueItem[];
}

export interface AboutPageSections {
  header: AboutHeaderSection;
  philosophy: AboutPhilosophySection;
  capabilities: AboutCapabilitiesSection;
  missionVision: AboutMissionVisionSection;
  values: AboutValuesSection;
}

export interface NotFoundGeneralSection {
  badgeCode: string;
  heading: string;
  line1: string;
  line2: string;
  line3: string;
  buttonText: string;
  buttonLink: string;
}

export interface NotFoundPageSections {
  general: NotFoundGeneralSection;
}

export interface PageSectionMeta {
  id: string;
  type: string;
  name: string;
  isEnabled: boolean;
}

export interface PageSEO {
  metaTitle?: string;
  metaDescription?: string;
}

export interface RichContentSection {
  badgeText?: string;
  heading?: string;
  content?: string;
  buttonText?: string;
  buttonLink?: string;
}

export interface Page<T = any> {
  _id: string;
  id?: string;
  slug: string;
  title: string;
  status: PageStatus;
  isSystem?: boolean;
  seo?: PageSEO;
  sectionOrder?: PageSectionMeta[];
  sections: T;
  updatedBy?: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

