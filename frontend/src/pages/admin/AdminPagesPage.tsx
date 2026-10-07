import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Monitor,
  Tablet,
  Smartphone,
  Save,
  CheckCircle2,
  Plus,
  Trash2,
  Upload,
  Menu,
  X,
  Compass,
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Check,
  Home,
  Info,
  Mail,
  PanelBottom,
  AlertTriangle,
  FilePlus,
  LayoutTemplate,
  GripVertical,
  Layers,
  ShieldCheck,
  ListOrdered,
  Quote,
  RotateCcw,
} from 'lucide-react';
import { AdminLayout } from '../../widgets';
import {
  Badge,
  Spinner,
  ImageCropModal,
  FormField,
  FormTextarea,
  ImagePickerField,
} from '../../shared/ui';
import {
  useCmsPages,
  useCmsPage,
  useCreatePage,
  useUpdatePage,
  useDeletePage,
  pageApi,
  DEFAULT_HOME_SECTIONS,
  DEFAULT_ABOUT_SECTIONS,
  DEFAULT_NOT_FOUND_SECTIONS,
  type Page,
  type PageSectionMeta,
  type HomePageSections,
  type AboutPageSections,
  type NotFoundPageSections,
} from '../../entities/page';
import {
  useSiteSettings,
  useUpdateSettings,
  settingsApi,
  type INavigationItem,
  type ISiteLogo,
} from '../../entities/settings';
import { useAuth } from '../../app/context/AuthContext';
import { HeroSection } from '../public/components/HeroSection';
import { AboutSection } from '../public/components/AboutSection';
import { ServicesSection } from '../public/components/ServicesSection';
import { WhyUsSection } from '../public/components/WhyUsSection';
import { ProcessSection } from '../public/components/ProcessSection';
import { TestimonialsSection } from '../public/components/TestimonialsSection';
import { NotFoundContent } from '../public/components/NotFoundContent';
import { DynamicSectionsRenderer } from '../public/components/DynamicSectionsRenderer';
import { Footer } from '../../widgets/Footer';

type ViewMode = 'list' | 'editor';
type SectionKey = 'navbar' | 'home' | 'about' | 'contact' | 'footer' | '404' | string;
type DeviceMode = 'desktop' | 'tablet' | 'mobile';

interface CmsSectionItem {
  key: SectionKey;
  title: string;
  badge: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  isCustomPage?: boolean;
}

const STATIC_CMS_SECTIONS: CmsSectionItem[] = [
  {
    key: 'navbar',
    title: 'Navbar Section',
    badge: 'GLOBAL NAVIGATION',
    description: 'Logo, navigation items, ordering and navbar configuration across the entire public website.',
    icon: Compass,
  },
  {
    key: 'home',
    title: 'Hero Header Section',
    badge: 'HERO BANNER',
    description: 'Hero headline, highlight word, description copy, action buttons, active reader metrics, and featured cards.',
    icon: Home,
  },
  {
    key: 'services',
    title: 'Services & Capabilities',
    badge: 'SOLUTIONS GRID',
    description: 'Service capability showcase cards, custom feature descriptions, and staggered solutions overview.',
    icon: Layers,
  },
  {
    key: 'whyUs',
    title: 'Why Choose Us Section',
    badge: 'ADVANTAGE & VALUES',
    description: 'Studio differentiators, security highlights, editorial advantages, and visual feature graphic.',
    icon: ShieldCheck,
  },
  {
    key: 'about',
    title: 'About & Philosophy Section',
    badge: 'PHILOSOPHY & PILLARS',
    description: 'Studio philosophy essay, core pillars, platform capabilities, mission/vision, and guiding values.',
    icon: Info,
  },
  {
    key: 'process',
    title: 'Process & Methodology',
    badge: '3-STEP WORKFLOW',
    description: 'Methodology timeline, execution phases (Ideate, Design, Publish), and milestone deliverables.',
    icon: ListOrdered,
  },
  {
    key: 'testimonials',
    title: 'Testimonials Section',
    badge: 'READER STATEMENTS',
    description: 'Reader and editor endorsements, quote statements, author roles, and portrait photo management.',
    icon: Quote,
  },
  {
    key: 'contact',
    title: 'Contact Desk Section',
    badge: 'EDITORIAL DESK & INQUIRIES',
    description: 'Contact email, working hours, location address, desk response time, and conversation CTA.',
    icon: Mail,
  },
  {
    key: 'footer',
    title: 'Footer & Branding Section',
    badge: 'GLOBAL BRANDING & FOOTER',
    description: 'Brand summary description, brand logo graphic, navigation menu links, social links, and copyright text.',
    icon: PanelBottom,
  },
  {
    key: '404',
    title: '404 Fallback Section',
    badge: 'INVALID ROUTE FALLBACK',
    description: 'Page not found error code, missing route guidance instructions, and return home CTA button.',
    icon: AlertTriangle,
  },
];

const SECTION_TEMPLATES = [
  { type: 'hero', name: 'Hero Header Banner', description: 'Headline, sub-badge, dual action buttons & imagery' },
  { type: 'about', name: 'About & Pillars', description: 'Editorial summary, philosophy pillars & vision statements' },
  { type: 'services', name: 'Services & Capabilities', description: 'Multi-card capability showcase & core solutions' },
  { type: 'whyUs', name: 'Philosophy / Why Us', description: 'Key differentiators, values & mission highlights' },
  { type: 'process', name: 'Process & Methodology', description: 'Step-by-step workflow timeline & execution' },
  { type: 'testimonials', name: 'Client Testimonials', description: 'Curated feedback cards, client names & ratings' },
  { type: 'richText', name: 'Custom Content Section', description: 'Free-form headline, badge, copy & action button' },
  { type: 'cta', name: 'Footer / CTA Block', description: 'Contact email, hours, location & connect prompt' },
];

const SECTION_ELEMENT_ID_MAP: Record<string, string> = {
  home: 'home',
  hero: 'home',
  navbar: 'home',
  about: 'about',
  services: 'services',
  whyUs: 'why-us',
  'why-us': 'why-us',
  process: 'process',
  testimonials: 'testimonials',
  contact: 'contact',
  cta: 'contact',
  footer: 'footer',
};

export default function AdminPagesPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role?.toLowerCase() === 'admin';

  // Navigation workflow state
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [activeSectionKey, setActiveSectionKey] = useState<SectionKey>('navbar');
  const previewScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sec = searchParams.get('section');
    if (sec) {
      setActiveSectionKey(sec);
      setViewMode('editor');
    }
  }, [searchParams]);

  // Responsive device simulator mode
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop');
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState<boolean>(false);

  // Automatically close simulator mobile drawer when section or device changes or on scroll
  useEffect(() => {
    setMobileDrawerOpen(false);
  }, [activeSectionKey, viewMode, deviceMode]);

  // Auto-scroll the live preview simulator when activeSectionKey changes
  useEffect(() => {
    if (viewMode !== 'editor') return;
    const targetId = SECTION_ELEMENT_ID_MAP[activeSectionKey] || activeSectionKey;
    const timer = setTimeout(() => {
      if (previewScrollRef.current) {
        if (activeSectionKey === 'navbar' || activeSectionKey === 'home') {
          previewScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          const el = previewScrollRef.current.querySelector(`#${targetId}`) as HTMLElement | null;
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      }
    }, 150);
    return () => clearTimeout(timer);
  }, [activeSectionKey, viewMode, deviceMode]);

  useEffect(() => {
    if (!mobileDrawerOpen) return;
    const handleGlobalScroll = () => {
      setMobileDrawerOpen(false);
    };
    window.addEventListener('scroll', handleGlobalScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleGlobalScroll);
    };
  }, [mobileDrawerOpen]);

  // Queries
  const { data: pages = [], isLoading: isPagesLoading } = useCmsPages();
  const { data: homePageData } = useCmsPage('home');
  const { data: aboutPageData } = useCmsPage('about');
  const { data: notFoundPageData } = useCmsPage('404');
  const { data: activeCustomPageData } = useCmsPage(
    !['navbar', 'home', 'about', 'contact', 'footer', '404'].includes(activeSectionKey)
      ? activeSectionKey
      : 'home'
  );
  const { data: siteSettings } = useSiteSettings();

  // Mutations
  const createPageMutation = useCreatePage();
  const updatePageMutation = useUpdatePage();
  const deletePageMutation = useDeletePage();
  const updateSettingsMutation = useUpdateSettings();

  // Working state for Home section
  const [homeSections, setHomeSections] = useState<HomePageSections>(DEFAULT_HOME_SECTIONS);
  const [homeStatus, setHomeStatus] = useState<'Draft' | 'Published'>('Published');

  // Working state for About section
  const [aboutSections, setAboutSections] = useState<AboutPageSections>(DEFAULT_ABOUT_SECTIONS);
  const [aboutStatus, setAboutStatus] = useState<'Draft' | 'Published'>('Published');

  // Working state for Contact section
  const [contactData, setContactData] = useState({
    badgeText: 'SAY HI TO US',
    heading: "LET'S CONNECT",
    description: 'Have a question, feedback on an editorial piece, or a proposal for our publishing platform? Reach out directly.',
    contactEmail: 'contact@grido.io',
    workingHours: 'Monday – Friday : 08 AM – 06 PM',
    location: 'London · New York · San Francisco',
  });

  // Working state for Footer & Brand Logo
  const [footerData, setFooterData] = useState({
    description: 'A modern publishing platform and digital publication engineered for high-impact content, bold ideas, and seamless storytelling.',
    copyright: '© 2026 Grido Publishing Platform. All rights reserved.',
    twitterUrl: 'https://twitter.com',
    instagramUrl: 'https://instagram.com',
    linkedinUrl: 'https://linkedin.com',
    githubUrl: 'https://github.com',
  });
  const [settingsNavItems, setSettingsNavItems] = useState<INavigationItem[]>([]);
  const [settingsLogo, setSettingsLogo] = useState<ISiteLogo>({ url: '/logo/logo.png', link: '/', text: 'Grido' });

  // Working state for 404 page
  const [notFoundSections, setNotFoundSections] = useState<NotFoundPageSections>(DEFAULT_NOT_FOUND_SECTIONS);
  const [notFoundStatus, setNotFoundStatus] = useState<'Draft' | 'Published'>('Published');

  // Working state for dynamic custom page
  const [customPageTitle, setCustomPageTitle] = useState<string>('Custom Page');
  const [customPageSlug, setCustomPageSlug] = useState<string>('services');
  const [customPageStatus, setCustomPageStatus] = useState<'Draft' | 'Published'>('Published');
  const [customSectionOrder, setCustomSectionOrder] = useState<PageSectionMeta[]>([]);
  const [customSectionsData, setCustomSectionsData] = useState<Record<string, any>>({});
  const [selectedCustomSecId, setSelectedCustomSecId] = useState<string>('hero');

  // Modals state
  const [showAddNavModal, setShowAddNavModal] = useState<boolean>(false);
  const [newNavLabel, setNewNavLabel] = useState<string>('');
  const [newNavUrl, setNewNavUrl] = useState<string>('');
  const [newNavEnabled, setNewNavEnabled] = useState<boolean>(true);

  const [showNewPageModal, setShowNewPageModal] = useState<boolean>(false);
  const [newPageTitle, setNewPageTitle] = useState<string>('');
  const [newPageSlug, setNewPageSlug] = useState<string>('');
  const [newPageStatus, setNewPageStatus] = useState<'Draft' | 'Published'>('Published');
  const [addPageToNav, setAddPageToNav] = useState<boolean>(true);

  const [showAddSectionModal, setShowAddSectionModal] = useState<boolean>(false);
  const [showDeletePageModal, setShowDeletePageModal] = useState<boolean>(false);

  // Image cropping state
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [cropFieldPath, setCropFieldPath] = useState<string | null>(null);
  const [cropFileName, setCropFileName] = useState<string>('image.jpg');

  // Feedback notifications
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const notificationTimeoutRef = useRef<any>(null);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    if (notificationTimeoutRef.current) clearTimeout(notificationTimeoutRef.current);
    setNotification({ type, message });
    notificationTimeoutRef.current = setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Sync initial data from backend
  useEffect(() => {
    if (homePageData) {
      if (homePageData.sections && Object.keys(homePageData.sections).length > 0) {
        const sec = homePageData.sections as any;
        setHomeSections({
          ...DEFAULT_HOME_SECTIONS,
          ...sec,
          hero: {
            ...DEFAULT_HOME_SECTIONS.hero,
            ...sec.hero,
            readersBadgeText: sec.hero?.readersBadgeText ?? DEFAULT_HOME_SECTIONS.hero.readersBadgeText,
            readersAvatars: sec.hero?.readersAvatars || DEFAULT_HOME_SECTIONS.hero.readersAvatars,
            showReadersStats: sec.hero?.showReadersStats !== undefined ? sec.hero.showReadersStats : DEFAULT_HOME_SECTIONS.hero.showReadersStats,
            card1Image: sec.hero?.card1Image || DEFAULT_HOME_SECTIONS.hero.card1Image,
            card2Image: sec.hero?.card2Image || DEFAULT_HOME_SECTIONS.hero.card2Image,
          },
          whyUs: {
            ...DEFAULT_HOME_SECTIONS.whyUs,
            ...sec.whyUs,
            image: sec.whyUs?.image || DEFAULT_HOME_SECTIONS.whyUs.image,
          },
        });
        if (homePageData.sections.cta) {
          setContactData({
            badgeText: homePageData.sections.cta.badgeText || 'SAY HI TO US',
            heading: homePageData.sections.cta.heading || "LET'S CONNECT",
            description: homePageData.sections.cta.description || '',
            contactEmail: homePageData.sections.cta.contactEmail || 'contact@grido.io',
            workingHours: homePageData.sections.cta.workingHours || 'Monday – Friday : 08 AM – 06 PM',
            location: homePageData.sections.cta.location || 'London · New York · San Francisco',
          });
        }
        const heroData = (homePageData.sections as any)?.hero;
        if (heroData) {
          const heroIsDraft = heroData.isPublished === false || heroData.status === 'Draft';
          setHomeStatus(heroIsDraft ? 'Draft' : 'Published');
        } else {
          setHomeStatus(homePageData.status || 'Published');
        }
      } else {
        setHomeStatus(homePageData.status || 'Published');
      }
    }
  }, [homePageData]);

  useEffect(() => {
    if (aboutPageData) {
      if (aboutPageData.sections && Object.keys(aboutPageData.sections).length > 0) {
        const sec = aboutPageData.sections as any;
        setAboutSections({
          ...DEFAULT_ABOUT_SECTIONS,
          ...sec,
          header: {
            ...DEFAULT_ABOUT_SECTIONS.header,
            ...sec?.header,
            image: sec?.header?.image || DEFAULT_ABOUT_SECTIONS.header.image,
          },
          philosophy: {
            ...DEFAULT_ABOUT_SECTIONS.philosophy,
            ...sec?.philosophy,
            image: sec?.philosophy?.image || DEFAULT_ABOUT_SECTIONS.philosophy.image,
          },
          capabilities: {
            ...DEFAULT_ABOUT_SECTIONS.capabilities,
            ...sec?.capabilities,
          },
          missionVision: {
            ...DEFAULT_ABOUT_SECTIONS.missionVision,
            ...sec?.missionVision,
          },
          values: {
            ...DEFAULT_ABOUT_SECTIONS.values,
            ...sec?.values,
          },
        });
      }
      setAboutStatus(aboutPageData.status || 'Published');
    }
  }, [aboutPageData]);

  useEffect(() => {
    if (notFoundPageData) {
      if (notFoundPageData.sections && Object.keys(notFoundPageData.sections).length > 0) {
        setNotFoundSections(notFoundPageData.sections as NotFoundPageSections);
      }
      setNotFoundStatus(notFoundPageData.status || 'Published');
    }
  }, [notFoundPageData]);

  useEffect(() => {
    if (siteSettings) {
      if (siteSettings.navigationItems) {
        setSettingsNavItems(
          siteSettings.navigationItems.map((item) => ({
            id: item.id,
            label: item.label,
            url: item.url,
            isEnabled: item.isEnabled !== false,
            isExternal: Boolean(item.isExternal),
          }))
        );
      }
      if (siteSettings.logo) {
        setSettingsLogo({
          url: siteSettings.logo.url || '/logo/logo.png',
          link: siteSettings.logo.link || '/',
          text: siteSettings.logo.text || 'Grido',
          height: siteSettings.logo.height || 32,
        });
      }
      if (siteSettings.footer) {
        setFooterData((prev) => ({
          ...prev,
          ...siteSettings.footer,
        }));
      }
    }
  }, [siteSettings]);

  // Sync custom page detail
  useEffect(() => {
    if (
      activeCustomPageData &&
      !['navbar', 'home', 'about', 'contact', 'footer', '404'].includes(activeSectionKey)
    ) {
      setCustomPageTitle(activeCustomPageData.title || 'Custom Page');
      setCustomPageSlug(activeCustomPageData.slug || activeSectionKey);
      setCustomPageStatus(activeCustomPageData.status || 'Published');

      const order = activeCustomPageData.sectionOrder && activeCustomPageData.sectionOrder.length > 0
        ? activeCustomPageData.sectionOrder
        : [
          { id: 'hero', type: 'hero', name: 'Hero Section', isEnabled: true },
          { id: 'services', type: 'services', name: 'Services Grid', isEnabled: true },
          { id: 'cta', type: 'cta', name: 'CTA Banner', isEnabled: true },
        ];
      setCustomSectionOrder(order);
      setCustomSectionsData(activeCustomPageData.sections || DEFAULT_HOME_SECTIONS);
      if (order.length > 0) setSelectedCustomSecId(order[0].id);
    }
  }, [activeCustomPageData, activeSectionKey]);

  // Baseline data snapshots for detecting unsaved changes per section
  const [initialSnapshots, setInitialSnapshots] = useState<Record<string, string>>({});

  useEffect(() => {
    if (homePageData) {
      setInitialSnapshots((prev) => ({
        ...prev,
        home: JSON.stringify((homePageData.sections as any)?.hero || DEFAULT_HOME_SECTIONS.hero),
        services: JSON.stringify((homePageData.sections as any)?.services || DEFAULT_HOME_SECTIONS.services),
        whyUs: JSON.stringify((homePageData.sections as any)?.whyUs || DEFAULT_HOME_SECTIONS.whyUs),
        process: JSON.stringify((homePageData.sections as any)?.process || DEFAULT_HOME_SECTIONS.process),
        testimonials: JSON.stringify((homePageData.sections as any)?.testimonials || DEFAULT_HOME_SECTIONS.testimonials),
        contact: JSON.stringify({
          badgeText: homePageData.sections?.cta?.badgeText || 'SAY HI TO US',
          heading: homePageData.sections?.cta?.heading || "LET'S CONNECT",
          description: homePageData.sections?.cta?.description || '',
          contactEmail: homePageData.sections?.cta?.contactEmail || 'contact@grido.io',
          workingHours: homePageData.sections?.cta?.workingHours || 'Monday – Friday : 08 AM – 06 PM',
          location: homePageData.sections?.cta?.location || 'London · New York · San Francisco',
        }),
      }));
    }
  }, [homePageData]);

  useEffect(() => {
    if (aboutPageData) {
      setInitialSnapshots((prev) => ({
        ...prev,
        about: JSON.stringify(aboutPageData.sections || DEFAULT_ABOUT_SECTIONS),
      }));
    }
  }, [aboutPageData]);

  useEffect(() => {
    if (notFoundPageData) {
      setInitialSnapshots((prev) => ({
        ...prev,
        '404': JSON.stringify(notFoundPageData.sections || DEFAULT_NOT_FOUND_SECTIONS),
      }));
    }
  }, [notFoundPageData]);

  useEffect(() => {
    if (siteSettings) {
      const normalizedLogo = {
        url: siteSettings.logo?.url || '/logo/logo.png',
        link: siteSettings.logo?.link || '/',
        text: siteSettings.logo?.text || 'Grido',
        height: siteSettings.logo?.height || 32,
      };
      const normalizedNav = (siteSettings.navigationItems || []).map((item) => ({
        id: item.id,
        label: item.label,
        url: item.url,
        isEnabled: item.isEnabled !== false,
        isExternal: Boolean(item.isExternal),
      }));

      setInitialSnapshots((prev) => ({
        ...prev,
        navbar: JSON.stringify({
          logo: normalizedLogo,
          nav: normalizedNav,
        }),
        footer: JSON.stringify(siteSettings.footer || footerData),
      }));
    }
  }, [siteSettings]);

  useEffect(() => {
    if (activeCustomPageData && !['navbar', 'home', 'about', 'contact', 'footer', '404'].includes(activeSectionKey)) {
      setInitialSnapshots((prev) => ({
        ...prev,
        [activeSectionKey]: JSON.stringify({
          title: activeCustomPageData.title || 'Custom Page',
          order: activeCustomPageData.sectionOrder || [],
          sections: activeCustomPageData.sections || {},
        }),
      }));
    }
  }, [activeCustomPageData, activeSectionKey]);

  // Merge static sections with dynamic custom pages
  const customPageSections: CmsSectionItem[] = pages
    .filter((p: Page) => !['home', 'about', '404', 'contact'].includes(p.slug))
    .map((p: Page) => ({
      key: p.slug,
      title: `${p.title} Page`,
      badge: `CUSTOM PAGE (/${p.slug})`,
      description: p.seo?.metaDescription || `Custom website page /${p.slug} with dynamic modular sections.`,
      icon: LayoutTemplate,
      isCustomPage: true,
    }));

  const allCmsSections: CmsSectionItem[] = [...STATIC_CMS_SECTIONS, ...customPageSections];

  // Open editor
  const handleOpenEditor = (key: SectionKey) => {
    setActiveSectionKey(key);
    setViewMode('editor');
    setMobileDrawerOpen(false);
  };

  // Save Navbar Settings
  const handleSaveNavbar = async (isPublishing: boolean = false) => {
    try {
      const normalizedNav = settingsNavItems.map((item) => ({
        id: item.id,
        label: item.label,
        url: item.url,
        isEnabled: item.isEnabled !== false,
        isExternal: Boolean(item.isExternal),
      }));

      await updateSettingsMutation.mutateAsync({
        logo: settingsLogo,
        navigationItems: normalizedNav,
        footer: footerData,
        isPublishing,
      });

      const savedSnapshot = JSON.stringify({
        logo: settingsLogo,
        nav: normalizedNav,
      });

      setInitialSnapshots((prev) => ({
        ...prev,
        navbar: savedSnapshot,
        footer: JSON.stringify(footerData),
      }));

      showNotification(
        isPublishing
          ? 'Navbar settings & branding published live!'
          : 'Navbar draft settings saved.'
      );
    } catch (err: any) {
      showNotification(err?.message || 'Failed to save Navbar settings.', 'error');
    }
  };

  // Add Navigation Item
  const handleAddNavItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNavLabel.trim() || !newNavUrl.trim()) {
      showNotification('Navigation Label and URL are required.', 'error');
      return;
    }

    const newItem: INavigationItem = {
      id: `nav_${Date.now()}`,
      label: newNavLabel.trim(),
      url: newNavUrl.trim(),
      isEnabled: newNavEnabled,
      isExternal: newNavUrl.startsWith('http'),
    };

    setSettingsNavItems((prev) => [...prev, newItem]);
    setShowAddNavModal(false);
    setNewNavLabel('');
    setNewNavUrl('');
    setNewNavEnabled(true);
    showNotification(`Navigation link "${newItem.label}" added.`);
  };

  // Reorder Navigation Items
  const handleMoveNavItem = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= settingsNavItems.length) return;

    const next = [...settingsNavItems];
    const temp = next[index];
    next[index] = next[targetIdx];
    next[targetIdx] = temp;
    setSettingsNavItems(next);
  };

  // Save Home Section
  const handleSaveHome = async (targetStatus?: 'Draft' | 'Published') => {
    const isPublishing = targetStatus === 'Published';
    try {
      const updatedHero = {
        ...homeSections.hero,
        isPublished: isPublishing,
        status: isPublishing ? 'Published' : 'Draft',
      };
      const updatedHomeSections = {
        ...homeSections,
        hero: updatedHero,
        cta: {
          ...homeSections.cta,
          ...contactData,
        },
      };
      setHomeSections(updatedHomeSections);
      if (isPublishing) setHomeStatus('Published');

      await updatePageMutation.mutateAsync({
        slug: 'home',
        title: 'Home Page',
        status: isPublishing ? 'Published' : undefined,
        sections: updatedHomeSections,
      });
      setInitialSnapshots((prev) => ({
        ...prev,
        home: JSON.stringify(updatedHero),
        contact: JSON.stringify(contactData),
      }));
      showNotification(isPublishing ? 'Hero section published live!' : 'Hero section draft saved.');
    } catch (err: any) {
      showNotification(err?.message || 'Failed to save Home section.', 'error');
    }
  };

  // Save Services Section
  const handleSaveServices = async (targetStatus?: 'Draft' | 'Published') => {
    const isPublishing = targetStatus === 'Published';
    try {
      const updatedServices = {
        ...homeSections.services,
        isPublished: isPublishing,
        status: isPublishing ? 'Published' : 'Draft',
      };
      const updatedHomeSections = {
        ...homeSections,
        services: updatedServices,
      };
      setHomeSections(updatedHomeSections);

      await updatePageMutation.mutateAsync({
        slug: 'home',
        title: 'Home Page',
        status: isPublishing ? 'Published' : undefined,
        sections: updatedHomeSections,
      });
      setInitialSnapshots((prev) => ({
        ...prev,
        services: JSON.stringify(updatedServices),
      }));
      showNotification(isPublishing ? 'Services section published live!' : 'Services section draft saved.');
    } catch (err: any) {
      showNotification(err?.message || 'Failed to save Services section.', 'error');
    }
  };

  // Save Why Choose Us Section
  const handleSaveWhyUs = async (targetStatus?: 'Draft' | 'Published') => {
    const isPublishing = targetStatus === 'Published';
    try {
      const updatedWhyUs = {
        ...homeSections.whyUs,
        isPublished: isPublishing,
        status: isPublishing ? 'Published' : 'Draft',
      };
      const updatedHomeSections = {
        ...homeSections,
        whyUs: updatedWhyUs,
      };
      setHomeSections(updatedHomeSections);

      await updatePageMutation.mutateAsync({
        slug: 'home',
        title: 'Home Page',
        status: isPublishing ? 'Published' : undefined,
        sections: updatedHomeSections,
      });
      setInitialSnapshots((prev) => ({
        ...prev,
        whyUs: JSON.stringify(updatedWhyUs),
      }));
      showNotification(isPublishing ? 'Why Choose Us section published live!' : 'Why Choose Us section draft saved.');
    } catch (err: any) {
      showNotification(err?.message || 'Failed to save Why Choose Us section.', 'error');
    }
  };

  // Save Process & Methodology Section
  const handleSaveProcess = async (targetStatus?: 'Draft' | 'Published') => {
    const isPublishing = targetStatus === 'Published';
    try {
      const updatedProcess = {
        ...homeSections.process,
        isPublished: isPublishing,
        status: isPublishing ? 'Published' : 'Draft',
      };
      const updatedHomeSections = {
        ...homeSections,
        process: updatedProcess,
      };
      setHomeSections(updatedHomeSections);

      await updatePageMutation.mutateAsync({
        slug: 'home',
        title: 'Home Page',
        status: isPublishing ? 'Published' : undefined,
        sections: updatedHomeSections,
      });
      setInitialSnapshots((prev) => ({
        ...prev,
        process: JSON.stringify(updatedProcess),
      }));
      showNotification(isPublishing ? 'Process section published live!' : 'Process section draft saved.');
    } catch (err: any) {
      showNotification(err?.message || 'Failed to save Process section.', 'error');
    }
  };

  // Save Testimonials Section
  const handleSaveTestimonials = async (targetStatus?: 'Draft' | 'Published') => {
    const isPublishing = targetStatus === 'Published';
    try {
      const updatedTestimonials = {
        ...homeSections.testimonials,
        isPublished: isPublishing,
        status: isPublishing ? 'Published' : 'Draft',
      };
      const updatedHomeSections = {
        ...homeSections,
        testimonials: updatedTestimonials,
      };
      setHomeSections(updatedHomeSections);

      await updatePageMutation.mutateAsync({
        slug: 'home',
        title: 'Home Page',
        status: isPublishing ? 'Published' : undefined,
        sections: updatedHomeSections,
      });
      setInitialSnapshots((prev) => ({
        ...prev,
        testimonials: JSON.stringify(updatedTestimonials),
      }));
      showNotification(isPublishing ? 'Testimonials section published live!' : 'Testimonials section draft saved.');
    } catch (err: any) {
      showNotification(err?.message || 'Failed to save Testimonials section.', 'error');
    }
  };

  // Save About Section
  const handleSaveAbout = async (targetStatus?: 'Draft' | 'Published') => {
    const isPublishing = targetStatus === 'Published';
    try {
      await updatePageMutation.mutateAsync({
        slug: 'about',
        title: 'About Page',
        status: isPublishing ? 'Published' : undefined,
        sections: aboutSections,
      });
      if (isPublishing) setAboutStatus('Published');
      setInitialSnapshots((prev) => ({
        ...prev,
        about: JSON.stringify(aboutSections),
      }));
      showNotification(isPublishing ? 'About page published live!' : 'About page draft saved.');
    } catch (err: any) {
      showNotification(err?.message || 'Failed to save About section.', 'error');
    }
  };

  // Save Contact Section
  const handleSaveContact = async (targetStatus?: 'Draft' | 'Published') => {
    const isPublishing = targetStatus === 'Published';
    try {
      const updatedHomeSections = {
        ...homeSections,
        cta: {
          ...homeSections.cta,
          ...contactData,
        },
      };
      setHomeSections(updatedHomeSections);

      await updatePageMutation.mutateAsync({
        slug: 'home',
        title: 'Home Page',
        status: isPublishing ? 'Published' : undefined,
        sections: updatedHomeSections,
      });
      setInitialSnapshots((prev) => ({
        ...prev,
        contact: JSON.stringify(contactData),
      }));
      showNotification(isPublishing ? 'Contact section published live!' : 'Contact section draft saved.');
    } catch (err: any) {
      showNotification(err?.message || 'Failed to save Contact section.', 'error');
    }
  };

  // Save Footer & Logo Settings
  const handleSaveFooter = async (isPublishing: boolean = false) => {
    try {
      await updateSettingsMutation.mutateAsync({
        logo: settingsLogo,
        navigationItems: settingsNavItems,
        footer: footerData,
        isPublishing,
      });
      setInitialSnapshots((prev) => ({
        ...prev,
        footer: JSON.stringify(footerData),
      }));
      showNotification(
        isPublishing
          ? 'Footer content & branding published live!'
          : 'Footer draft settings saved.'
      );
    } catch (err: any) {
      showNotification(err?.message || 'Failed to save Footer settings.', 'error');
    }
  };

  // Save 404 Section
  const handleSaveNotFound = async (targetStatus?: 'Draft' | 'Published') => {
    const isPublishing = targetStatus === 'Published';
    try {
      await updatePageMutation.mutateAsync({
        slug: '404',
        title: '404 Not Found Page',
        status: isPublishing ? 'Published' : undefined,
        sections: notFoundSections,
      });
      if (isPublishing) setNotFoundStatus('Published');
      setInitialSnapshots((prev) => ({
        ...prev,
        '404': JSON.stringify(notFoundSections),
      }));
      showNotification(isPublishing ? '404 page published live!' : '404 page draft saved.');
    } catch (err: any) {
      showNotification(err?.message || 'Failed to save 404 page.', 'error');
    }
  };

  // Create New Page
  const handleCreateNewPage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPageTitle.trim() || !newPageSlug.trim()) {
      showNotification('Page Name and Slug are required.', 'error');
      return;
    }

    const cleanSlug = newPageSlug.toLowerCase().trim().replace(/[^a-z0-9-_]/g, '-');
    try {
      const created = await createPageMutation.mutateAsync({
        title: newPageTitle.trim(),
        slug: cleanSlug,
        status: newPageStatus,
        seo: {
          metaTitle: `${newPageTitle.trim()} | Grido`,
          metaDescription: `Discover ${newPageTitle.trim()} on Grido publishing platform.`,
        },
        sectionOrder: [
          { id: 'hero', type: 'hero', name: 'Hero Banner', isEnabled: true },
          { id: 'richText', type: 'richText', name: 'Content Block', isEnabled: true },
          { id: 'cta', type: 'cta', name: 'CTA Banner', isEnabled: true },
        ],
        sections: {
          hero: {
            badgeText: newPageTitle.toUpperCase(),
            heading: newPageTitle,
            highlightWord: 'Studio',
            description: `Explore ${newPageTitle} and our dedicated services.`,
            primaryButtonText: 'Get Started',
            primaryButtonLink: '#contact',
          },
          richText: {
            badgeText: 'OVERVIEW',
            heading: `About ${newPageTitle}`,
            content: 'Write your bespoke page content and publish directly through CMS.',
          },
          cta: DEFAULT_HOME_SECTIONS.cta,
        },
      });

      // Optionally add to navbar
      if (addPageToNav) {
        const newNav: INavigationItem = {
          id: `nav_${Date.now()}`,
          label: newPageTitle.trim(),
          url: `/${cleanSlug}`,
          isEnabled: true,
          isExternal: false,
        };
        const nextNavItems = [...settingsNavItems, newNav];
        setSettingsNavItems(nextNavItems);
        await updateSettingsMutation.mutateAsync({
          navigationItems: nextNavItems,
        });
      }

      setShowNewPageModal(false);
      setNewPageTitle('');
      setNewPageSlug('');
      handleOpenEditor(created.slug);
      showNotification(`Page "${created.title}" created successfully!`);
    } catch (err: any) {
      showNotification(err?.message || 'Failed to create page.', 'error');
    }
  };

  // Save Custom Page
  const handleSaveCustomPage = async (targetStatus?: 'Draft' | 'Published') => {
    const isPublishing = targetStatus === 'Published';
    try {
      await updatePageMutation.mutateAsync({
        slug: activeSectionKey,
        title: customPageTitle.trim(),
        status: isPublishing ? 'Published' : undefined,
        sectionOrder: customSectionOrder,
        sections: customSectionsData,
      });
      if (isPublishing) setCustomPageStatus('Published');
      setInitialSnapshots((prev) => ({
        ...prev,
        [activeSectionKey]: JSON.stringify({
          title: customPageTitle.trim(),
          order: customSectionOrder,
          sections: customSectionsData,
        }),
      }));
      showNotification(isPublishing ? `Page "${customPageTitle}" published live!` : `Page "${customPageTitle}" draft saved.`);
    } catch (err: any) {
      showNotification(err?.message || 'Failed to save page.', 'error');
    }
  };

  // Unified Save / Publish current active section or page
  const handlePublishCurrentSection = async () => {
    if (!isAdmin) {
      showNotification('Publishing changes is restricted to Administrators.', 'error');
      return;
    }
    if (activeSectionKey === 'navbar') {
      await handleSaveNavbar(true);
    } else if (activeSectionKey === 'home') {
      await handleSaveHome('Published');
    } else if (activeSectionKey === 'services') {
      await handleSaveServices('Published');
    } else if (activeSectionKey === 'whyUs') {
      await handleSaveWhyUs('Published');
    } else if (activeSectionKey === 'process') {
      await handleSaveProcess('Published');
    } else if (activeSectionKey === 'testimonials') {
      await handleSaveTestimonials('Published');
    } else if (activeSectionKey === 'about') {
      await handleSaveAbout('Published');
    } else if (activeSectionKey === 'contact') {
      await handleSaveContact();
    } else if (activeSectionKey === 'footer') {
      await handleSaveFooter(true);
    } else if (activeSectionKey === '404') {
      await handleSaveNotFound('Published');
    } else {
      // Custom page
      await handleSaveCustomPage('Published');
    }
  };

  const handleSaveDraftCurrentSection = async () => {
    if (activeSectionKey === 'navbar') {
      await handleSaveNavbar(false);
    } else if (activeSectionKey === 'home') {
      await handleSaveHome('Draft');
    } else if (activeSectionKey === 'services') {
      await handleSaveServices('Draft');
    } else if (activeSectionKey === 'whyUs') {
      await handleSaveWhyUs('Draft');
    } else if (activeSectionKey === 'process') {
      await handleSaveProcess('Draft');
    } else if (activeSectionKey === 'testimonials') {
      await handleSaveTestimonials('Draft');
    } else if (activeSectionKey === 'about') {
      await handleSaveAbout('Draft');
    } else if (activeSectionKey === 'contact') {
      await handleSaveContact();
    } else if (activeSectionKey === 'footer') {
      await handleSaveFooter(false);
    } else if (activeSectionKey === '404') {
      await handleSaveNotFound('Draft');
    } else {
      // Custom page
      await handleSaveCustomPage('Draft');
    }
  };

  const handleDiscardChanges = () => {
    try {
      if (activeSectionKey === 'navbar') {
        if (siteSettings) {
          if (siteSettings.navigationItems) {
            setSettingsNavItems(
              siteSettings.navigationItems.map((item) => ({
                id: item.id,
                label: item.label,
                url: item.url,
                isEnabled: item.isEnabled !== false,
                isExternal: Boolean(item.isExternal),
              }))
            );
          }
          if (siteSettings.logo) {
            setSettingsLogo({
              url: siteSettings.logo.url || '/logo/logo.png',
              link: siteSettings.logo.link || '/',
              text: siteSettings.logo.text || 'Grido',
              height: siteSettings.logo.height || 32,
            });
          }
        }
      } else if (activeSectionKey === 'home') {
        const heroData = (homePageData?.sections as any)?.hero || DEFAULT_HOME_SECTIONS.hero;
        setHomeSections((prev) => ({ ...prev, hero: heroData }));
      } else if (activeSectionKey === 'services') {
        const sec = (homePageData?.sections as any)?.services || DEFAULT_HOME_SECTIONS.services;
        setHomeSections((prev) => ({ ...prev, services: sec }));
      } else if (activeSectionKey === 'whyUs') {
        const sec = (homePageData?.sections as any)?.whyUs || DEFAULT_HOME_SECTIONS.whyUs;
        setHomeSections((prev) => ({ ...prev, whyUs: sec }));
      } else if (activeSectionKey === 'process') {
        const sec = (homePageData?.sections as any)?.process || DEFAULT_HOME_SECTIONS.process;
        setHomeSections((prev) => ({ ...prev, process: sec }));
      } else if (activeSectionKey === 'testimonials') {
        const sec = (homePageData?.sections as any)?.testimonials || DEFAULT_HOME_SECTIONS.testimonials;
        setHomeSections((prev) => ({ ...prev, testimonials: sec }));
      } else if (activeSectionKey === 'contact') {
        if (homePageData?.sections?.cta) {
          setContactData({
            badgeText: homePageData.sections.cta.badgeText || 'SAY HI TO US',
            heading: homePageData.sections.cta.heading || "LET'S CONNECT",
            description: homePageData.sections.cta.description || '',
            contactEmail: homePageData.sections.cta.contactEmail || 'contact@grido.io',
            workingHours: homePageData.sections.cta.workingHours || 'Monday – Friday : 08 AM – 06 PM',
            location: homePageData.sections.cta.location || 'London · New York · San Francisco',
          });
        }
      } else if (activeSectionKey === 'about') {
        if (aboutPageData?.sections) {
          setAboutSections({ ...DEFAULT_ABOUT_SECTIONS, ...(aboutPageData.sections as any) });
        }
      } else if (activeSectionKey === 'footer') {
        if (siteSettings?.footer) {
          setFooterData((prev) => ({ ...prev, ...siteSettings.footer }));
        }
      } else if (activeSectionKey === '404') {
        if (notFoundPageData?.sections) {
          setNotFoundSections(notFoundPageData.sections as NotFoundPageSections);
        }
      } else if (activeCustomPageData) {
        setCustomPageTitle(activeCustomPageData.title || 'Custom Page');
        setCustomSectionOrder(activeCustomPageData.sectionOrder || []);
        setCustomSectionsData(activeCustomPageData.sections || {});
      }
      showNotification('Unsaved changes discarded. Restored saved version.');
    } catch {
      showNotification('Failed to reset changes.', 'error');
    }
  };

  // Revert draft version to currently published live version (Admin only)
  const handleRevertDraftToPublished = async () => {
    if (!isAdmin) {
      showNotification('Reverting drafts is restricted to Administrators.', 'error');
      return;
    }
    try {
      if (['navbar', 'footer'].includes(activeSectionKey)) {
        const pubSettings = await settingsApi.getPublicSettings();
        if (activeSectionKey === 'navbar') {
          setSettingsNavItems(pubSettings.navigationItems || []);
          setSettingsLogo(pubSettings.logo || siteSettings?.logo);
          await updateSettingsMutation.mutateAsync({
            logo: pubSettings.logo,
            navigationItems: pubSettings.navigationItems,
            isPublishing: false,
          });
        } else {
          setFooterData((prev) => ({ ...prev, ...(pubSettings.footer || {}) }));
          await updateSettingsMutation.mutateAsync({
            footer: pubSettings.footer,
            isPublishing: false,
          });
        }
      } else {
        const pubSlug = ['navbar', 'home', 'about', 'contact', 'footer', '404'].includes(activeSectionKey) ? 'home' : activeSectionKey;
        const targetSlug = activeSectionKey === 'about' ? 'about' : activeSectionKey === '404' ? '404' : pubSlug;
        const pubPage = await pageApi.getPublicPage(targetSlug);
        if (pubPage && pubPage.sections) {
          if (targetSlug === 'home') {
            setHomeSections((prev) => ({ ...prev, ...pubPage.sections }));
          } else if (targetSlug === 'about') {
            setAboutSections((prev) => ({ ...prev, ...pubPage.sections }));
          } else if (targetSlug === '404') {
            setNotFoundSections((prev) => ({ ...prev, ...pubPage.sections }));
          } else {
            setCustomSectionsData(pubPage.sections || {});
          }
          await updatePageMutation.mutateAsync({
            slug: targetSlug,
            sections: pubPage.sections,
          });
        }
      }
      showNotification('Draft discarded. Restored live published version!');
    } catch (err: any) {
      showNotification(err?.message || 'Failed to revert draft.', 'error');
    }
  };

  const isPendingSave = updatePageMutation.isPending || updateSettingsMutation.isPending;

  // Delete Custom Page
  const handleDeleteCustomPage = async () => {
    try {
      await deletePageMutation.mutateAsync(activeSectionKey);
      // Remove from navbar if present
      const cleanedNav = settingsNavItems.filter(
        (n) => n.url !== `/${activeSectionKey}` && n.url !== activeSectionKey
      );
      setSettingsNavItems(cleanedNav);
      await updateSettingsMutation.mutateAsync({ navigationItems: cleanedNav });

      setShowDeletePageModal(false);
      setViewMode('list');
      setActiveSectionKey('navbar');
      showNotification(`Page deleted and removed from Navbar.`);
    } catch (err: any) {
      showNotification(err?.message || 'Failed to delete page.', 'error');
    }
  };

  // Add Section to Custom Page
  const handleAddSectionToCustomPage = (type: string, name: string) => {
    const newId = `${type}_${Date.now()}`;
    const newMeta: PageSectionMeta = {
      id: newId,
      type,
      name,
      isEnabled: true,
    };

    let defaultPayload: any = {
      badgeText: 'FEATURE SPOTLIGHT',
      heading: name,
      content: 'Write editorial content and preview changes live.',
      buttonText: 'Learn More',
      buttonLink: '#contact',
    };

    if (type === 'hero') defaultPayload = DEFAULT_HOME_SECTIONS.hero;
    else if (type === 'services') defaultPayload = DEFAULT_HOME_SECTIONS.services;
    else if (type === 'whyUs') defaultPayload = DEFAULT_HOME_SECTIONS.whyUs;
    else if (type === 'testimonials') defaultPayload = DEFAULT_HOME_SECTIONS.testimonials;
    else if (type === 'cta') defaultPayload = DEFAULT_HOME_SECTIONS.cta;

    setCustomSectionOrder((prev) => [...prev, newMeta]);
    setCustomSectionsData((prev) => ({ ...prev, [newId]: defaultPayload }));
    setSelectedCustomSecId(newId);
    setShowAddSectionModal(false);
    showNotification(`Added section "${name}".`);
  };

  // Handle Image File Upload for Cropping
  const handleImageFileSelect = (e: React.ChangeEvent<HTMLInputElement>, fieldPath: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCropFileName(file.name);
    setCropFieldPath(fieldPath);

    const reader = new FileReader();
    reader.onload = () => {
      setCropSrc(reader.result as string);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Confirm Cropped Image
  const handleCropConfirm = (croppedFile: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      if (cropFieldPath === 'settings.logo') {
        setSettingsLogo((prev) => ({ ...prev, url: dataUrl }));
      } else if (cropFieldPath === 'home.hero.card1Image') {
        setHomeSections((prev) => ({
          ...prev,
          hero: { ...prev.hero, card1Image: dataUrl },
        }));
      } else if (cropFieldPath === 'home.hero.card2Image') {
        setHomeSections((prev) => ({
          ...prev,
          hero: { ...prev.hero, card2Image: dataUrl },
        }));
      } else if (cropFieldPath === 'home.whyUs.image') {
        setHomeSections((prev) => ({
          ...prev,
          whyUs: { ...prev.whyUs, image: dataUrl },
        }));
      } else if (cropFieldPath?.startsWith('home.hero.readersAvatars.')) {
        const idx = parseInt(cropFieldPath.replace('home.hero.readersAvatars.', ''), 10);
        setHomeSections((prev) => {
          const nextAvatars = [
            ...(prev.hero?.readersAvatars || DEFAULT_HOME_SECTIONS.hero.readersAvatars || []),
          ];
          if (nextAvatars[idx] !== undefined) {
            nextAvatars[idx] = dataUrl;
          }
          return {
            ...prev,
            hero: {
              ...prev.hero,
              readersAvatars: nextAvatars,
            },
          };
        });
      } else if (cropFieldPath === 'about.header.image') {
        setAboutSections((prev) => ({
          ...prev,
          header: { ...prev.header, image: dataUrl },
        }));
      } else if (cropFieldPath === 'about.philosophy.image') {
        setAboutSections((prev) => ({
          ...prev,
          philosophy: { ...prev.philosophy, image: dataUrl },
        }));
      } else if (cropFieldPath?.startsWith('home.testimonials.')) {
        const idx = parseInt(cropFieldPath.replace('home.testimonials.', ''), 10);
        setHomeSections((prev) => {
          const nextItems = [...(prev.testimonials?.items || DEFAULT_HOME_SECTIONS.testimonials.items)];
          if (nextItems[idx]) {
            nextItems[idx] = { ...nextItems[idx], image: dataUrl };
          }
          return {
            ...prev,
            testimonials: {
              ...prev.testimonials,
              items: nextItems,
            },
          };
        });
      }
      setCropSrc(null);
      setCropFieldPath(null);
      showNotification('Image updated.');
    };
    reader.readAsDataURL(croppedFile);
  };

  const currentSectionItem = allCmsSections.find((s) => s.key === activeSectionKey) || allCmsSections[0];
  const isCustomPageActive = !['navbar', 'home', 'services', 'whyUs', 'about', 'process', 'testimonials', 'contact', 'footer', '404'].includes(activeSectionKey);
  const activeCustomSecMeta = customSectionOrder.find((s) => s.id === selectedCustomSecId);

  const hasCurrentSectionChanges = React.useMemo(() => {
    try {
      if (activeSectionKey === 'navbar') {
        const normalizedNav = settingsNavItems.map((item) => ({
          id: item.id,
          label: item.label,
          url: item.url,
          isEnabled: item.isEnabled !== false,
          isExternal: Boolean(item.isExternal),
        }));
        const current = JSON.stringify({ logo: settingsLogo, nav: normalizedNav });
        const baseline = initialSnapshots['navbar'];
        return baseline !== undefined ? current !== baseline : false;
      }
      if (activeSectionKey === 'home') {
        const current = JSON.stringify(homeSections?.hero);
        const baseline = initialSnapshots['home'];
        return baseline !== undefined ? current !== baseline : false;
      }
      if (activeSectionKey === 'services') {
        const current = JSON.stringify(homeSections?.services);
        const baseline = initialSnapshots['services'];
        return baseline !== undefined ? current !== baseline : false;
      }
      if (activeSectionKey === 'whyUs') {
        const current = JSON.stringify(homeSections?.whyUs);
        const baseline = initialSnapshots['whyUs'];
        return baseline !== undefined ? current !== baseline : false;
      }
      if (activeSectionKey === 'process') {
        const current = JSON.stringify(homeSections?.process);
        const baseline = initialSnapshots['process'];
        return baseline !== undefined ? current !== baseline : false;
      }
      if (activeSectionKey === 'testimonials') {
        const current = JSON.stringify(homeSections?.testimonials);
        const baseline = initialSnapshots['testimonials'];
        return baseline !== undefined ? current !== baseline : false;
      }
      if (activeSectionKey === 'about') {
        const current = JSON.stringify(aboutSections);
        const baseline = initialSnapshots['about'];
        return baseline !== undefined ? current !== baseline : false;
      }
      if (activeSectionKey === 'contact') {
        const current = JSON.stringify(contactData);
        const baseline = initialSnapshots['contact'];
        return baseline !== undefined ? current !== baseline : false;
      }
      if (activeSectionKey === 'footer') {
        const current = JSON.stringify(footerData);
        const baseline = initialSnapshots['footer'];
        return baseline !== undefined ? current !== baseline : false;
      }
      if (activeSectionKey === '404') {
        const current = JSON.stringify(notFoundSections);
        const baseline = initialSnapshots['404'];
        return baseline !== undefined ? current !== baseline : false;
      }
      if (isCustomPageActive) {
        const current = JSON.stringify({
          title: customPageTitle,
          order: customSectionOrder,
          sections: customSectionsData,
        });
        const baseline = initialSnapshots[activeSectionKey];
        return baseline !== undefined ? current !== baseline : false;
      }
      return false;
    } catch {
      return false;
    }
  }, [
    activeSectionKey,
    initialSnapshots,
    settingsLogo,
    settingsNavItems,
    homeSections,
    aboutSections,
    contactData,
    footerData,
    notFoundSections,
    isCustomPageActive,
    customPageTitle,
    customSectionOrder,
    customSectionsData,
  ]);

  return (
    <AdminLayout currentTab="pages" showSearch={false}>
      <div className="w-full h-full flex flex-col min-h-0 overflow-hidden">

        {/* ========================================================================= */}
        {/* VIEW 1: WEBSITE SECTIONS & PAGES LIST DIRECTORY (viewMode === 'list')     */}
        {/* ========================================================================= */}
        {viewMode === 'list' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
            {/* Top Overview Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-zinc-200">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-zinc-950 font-['Plus_Jakarta_Sans'] tracking-tight">
                  Website Pages
                </h1>
                <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                  Manage the sections of your public website: Navbar, Home, About, Contact, Footer, 404 Fallback, and custom pages.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowNewPageModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold transition shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-[#FCD06B]" />
                  <span>+ Add New Page</span>
                </button>
              </div>
            </div>

            {/* List of Website Sections & Pages (One by One) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 font-mono">
                  Website Sections ({allCmsSections.length})
                </h2>
                <span className="text-xs text-zinc-400">Click any card or Edit Section to manage content &amp; preview</span>
              </div>

              {isPagesLoading ? (
                <div className="py-20 flex justify-center items-center">
                  <Spinner text="Loading CMS Sections..." />
                </div>
              ) : (
                <div className="space-y-3">
                  {allCmsSections.map((section) => {
                    const IconComponent = section.icon;
                    const isPublished =
                      section.key === 'home'
                        ? (homeSections?.hero as any)?.isPublished !== false && (homeSections?.hero as any)?.status !== 'Draft' && homeStatus === 'Published'
                        : section.key === 'services'
                          ? (homeSections?.services as any)?.isPublished !== false && (homeSections?.services as any)?.status !== 'Draft'
                          : section.key === 'whyUs'
                            ? (homeSections?.whyUs as any)?.isPublished !== false && (homeSections?.whyUs as any)?.status !== 'Draft'
                            : section.key === 'process'
                              ? (homeSections?.process as any)?.isPublished !== false && (homeSections?.process as any)?.status !== 'Draft'
                              : section.key === 'testimonials'
                                ? (homeSections?.testimonials as any)?.isPublished !== false && (homeSections?.testimonials as any)?.status !== 'Draft'
                                : section.key === 'about'
                                  ? aboutStatus === 'Published'
                                  : section.key === '404'
                                    ? notFoundStatus === 'Published'
                                    : section.isCustomPage
                                      ? (pages.find((p: Page) => p.slug === section.key)?.status || 'Published') === 'Published'
                                      : true;

                    return (
                      <div
                        key={section.key}
                        onClick={() => handleOpenEditor(section.key)}
                        className="p-4 sm:p-5 rounded-2xl border-2 border-zinc-200/90 bg-white hover:border-zinc-950 transition-all duration-200 cursor-pointer flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group hover:shadow-md select-none"
                      >
                        {/* Section Identity */}
                        <div className="flex items-start gap-4 min-w-[280px]">
                          <div className="w-11 h-11 rounded-xl border bg-zinc-100 group-hover:bg-amber-100 border-zinc-200/80 group-hover:border-amber-300 text-zinc-700 group-hover:text-amber-900 flex items-center justify-center transition shrink-0">
                            <IconComponent className="w-5 h-5" />
                          </div>

                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-base font-bold text-zinc-950 group-hover:text-amber-800 transition font-['Plus_Jakarta_Sans']">
                                {section.title}
                              </h3>
                              {section.badge ? (
                                <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded font-mono bg-zinc-100 text-zinc-600">
                                  {section.badge}
                                </span>
                              ) : null}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant={isPublished ? 'success' : 'neutral'}>
                                {isPublished ? 'Published' : 'Draft'}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-xs text-zinc-500 line-clamp-2 max-w-xl leading-relaxed flex-1">
                          {section.description}
                        </p>

                        {/* Actions */}
                        <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenEditor(section.key);
                            }}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-950 group-hover:bg-amber-700 text-white text-xs font-bold transition shadow-2xs cursor-pointer"
                          >
                            <span>Edit Section</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>

                          {section.isCustomPage && isAdmin && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveSectionKey(section.key);
                                setShowDeletePageModal(true);
                              }}
                              className="p-2 rounded-xl hover:bg-rose-50 text-zinc-400 hover:text-rose-600 transition cursor-pointer"
                              title="Delete custom page"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: DEDICATED SECTION EDITOR & LIVE PREVIEW (viewMode === 'editor')    */}
        {/* ========================================================================= */}
        {viewMode === 'editor' && (
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {/* Top Bar */}
            <div className="px-4 py-3 bg-white border-b border-zinc-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold transition cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Sections</span>
                </button>

                <div className="h-4 w-px bg-zinc-200" />

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-zinc-950 font-['Plus_Jakarta_Sans']">
                    {currentSectionItem.title}
                  </span>
                </div>
              </div>

              {/* Unified Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => navigate(`/admin/pages/preview/home?section=${activeSectionKey}`)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-800 text-xs font-bold transition cursor-pointer"
                  title="Open full public website preview scrolled to this section"
                >
                  <Eye className="w-3.5 h-3.5 text-zinc-600" />
                  <span>Full Preview</span>
                </button>

                {hasCurrentSectionChanges && (
                  <button
                    type="button"
                    disabled={isPendingSave}
                    onClick={handleDiscardChanges}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 bg-rose-50/70 hover:bg-rose-100/80 text-rose-700 text-xs font-semibold transition cursor-pointer disabled:opacity-60"
                    title="Discard unsaved edits and restore saved content"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
                    <span>Reset</span>
                  </button>
                )}

                <button
                  type="button"
                  disabled={isPendingSave || !hasCurrentSectionChanges || ((activeSectionKey === 'navbar' || activeSectionKey === 'footer') && !isAdmin)}
                  onClick={handleSaveDraftCurrentSection}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border text-xs font-bold transition ${
                    hasCurrentSectionChanges
                      ? 'bg-zinc-900 hover:bg-zinc-800 text-white border-zinc-900 shadow-xs cursor-pointer'
                      : 'bg-zinc-100 border-zinc-200 text-zinc-500 cursor-not-allowed opacity-80'
                  }`}
                  title={
                    (activeSectionKey === 'navbar' || activeSectionKey === 'footer') && !isAdmin
                      ? 'Site Settings require Admin permissions'
                      : !hasCurrentSectionChanges
                      ? 'No unsaved changes - Draft saved'
                      : 'Save draft changes'
                  }
                >
                  {hasCurrentSectionChanges ? <Save className="w-3.5 h-3.5" /> : <Check className="w-3.5 h-3.5 text-emerald-600" />}
                  <span>{hasCurrentSectionChanges ? 'Save Draft' : 'Draft Saved'}</span>
                </button>

                {isAdmin && (
                  <>
                    <button
                      type="button"
                      disabled={isPendingSave}
                      onClick={handleRevertDraftToPublished}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-200 bg-zinc-100 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-700 text-zinc-700 text-xs font-semibold transition cursor-pointer disabled:opacity-60"
                      title="Discard current draft and restore the live published version"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-zinc-500" />
                      <span>Discard Draft</span>
                    </button>

                    <button
                      type="button"
                      disabled={isPendingSave}
                      onClick={handlePublishCurrentSection}
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#52B788] hover:bg-emerald-600 text-white text-xs font-bold transition shadow-2xs cursor-pointer disabled:opacity-60"
                      title="Publish saved draft changes live to the public website"
                    >
                      {isPendingSave ? <Spinner size="sm" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                      <span>Publish Changes</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Split Workspace: Left Editor, Right Live Section Preview */}
            <div className="flex-1 flex flex-col lg:flex-row gap-4 p-3 sm:p-4 min-h-0 overflow-hidden bg-zinc-50/60">

              {/* LEFT COLUMN: Section-Specific Form Inputs */}
              <div className="w-full lg:w-[460px] xl:w-[500px] shrink-0 bg-white rounded-3xl border border-zinc-200/90 shadow-sm flex flex-col min-h-0 overflow-hidden">
                <div className="p-3.5 border-b border-zinc-100 bg-zinc-50/70 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-amber-700 uppercase font-mono tracking-wider">
                      EDITING {currentSectionItem.badge || currentSectionItem.title}
                    </span>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-5">

                  {/* 1. NAVBAR SECTION EDITOR (Full CRUD & Drag Ordering) */}
                  {activeSectionKey === 'navbar' && (
                    <div className="space-y-5">
                      {/* Logo Card */}
                      <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200/80 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-zinc-900">Website Brand Logo</span>
                          <span className="text-[10px] font-mono text-zinc-400">PNG, SVG, or JPG</span>
                        </div>

                        <div className="flex items-center gap-3.5">
                          <div className="w-20 h-14 bg-white rounded-xl border border-zinc-200 flex items-center justify-center p-2 shrink-0">
                            <img
                              src={settingsLogo.url?.trim() ? settingsLogo.url : '/logo/logo.png'}
                              alt={settingsLogo.text || 'Brand Logo'}
                              className="max-h-full max-w-full object-contain"
                              onError={(e) => {
                                const target = e.currentTarget;
                                if (!target.src.endsWith('/logo/logo.png')) {
                                  target.src = '/logo/logo.png';
                                }
                              }}
                            />
                          </div>

                          <div className="flex-1 flex flex-wrap gap-2">
                            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold cursor-pointer transition shadow-2xs">
                              <Upload className="w-3.5 h-3.5" />
                              <span>Change Logo</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageFileSelect(e, 'settings.logo')}
                                className="hidden"
                              />
                            </label>

                            {settingsLogo.url && settingsLogo.url !== '/logo/logo.png' ? (
                              <button
                                type="button"
                                onClick={() => setSettingsLogo((prev) => ({ ...prev, url: '/logo/logo.png' }))}
                                className="px-3 py-1.5 rounded-xl border border-zinc-200 hover:bg-zinc-100 text-zinc-600 text-xs font-semibold transition cursor-pointer"
                              >
                                Reset Logo
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setSettingsLogo((prev) => ({ ...prev, url: '' }))}
                                className="px-3 py-1.5 rounded-xl border border-zinc-200 hover:bg-rose-50 hover:text-rose-600 text-zinc-500 text-xs font-semibold transition cursor-pointer"
                                title="Remove logo"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <FormField
                            label="Brand / Alt Text"
                            value={settingsLogo.text || ''}
                            onChange={(val) => setSettingsLogo((prev) => ({ ...prev, text: val }))}
                            placeholder="e.g. Grido"
                          />
                          <FormField
                            label="Logo Link URL"
                            value={settingsLogo.link || '/'}
                            onChange={(val) => setSettingsLogo((prev) => ({ ...prev, link: val }))}
                            placeholder="/"
                          />
                        </div>

                        {/* Logo Display Size Adjustment (Height Slider & Quick Presets) */}
                        <div className="pt-2 border-t border-zinc-200/60 space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="text-[11px] font-bold text-zinc-700 uppercase tracking-wider font-mono">
                              Logo Display Size (Height)
                            </label>
                            <span className="text-xs font-mono font-bold text-zinc-800 bg-white px-2 py-0.5 rounded border border-zinc-200">
                              {settingsLogo.height || 32}px
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <input
                              type="range"
                              min={20}
                              max={56}
                              step={2}
                              value={settingsLogo.height || 32}
                              onChange={(e) =>
                                setSettingsLogo((prev) => ({
                                  ...prev,
                                  height: parseInt(e.target.value, 10),
                                }))
                              }
                              className="flex-1 h-1.5 bg-zinc-200 rounded-full appearance-none cursor-pointer accent-zinc-900"
                            />
                            <div className="flex items-center gap-1">
                              {[
                                { label: 'S', size: 26 },
                                { label: 'M', size: 32 },
                                { label: 'L', size: 42 },
                                { label: 'XL', size: 50 },
                              ].map((preset) => (
                                <button
                                  key={preset.label}
                                  type="button"
                                  onClick={() =>
                                    setSettingsLogo((prev) => ({
                                      ...prev,
                                      height: preset.size,
                                    }))
                                  }
                                  className={`px-2 py-0.5 rounded-md text-[11px] font-bold font-mono transition cursor-pointer ${(settingsLogo.height || 32) === preset.size
                                    ? 'bg-zinc-900 text-white shadow-2xs'
                                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                                    }`}
                                >
                                  {preset.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Navigation Items CRUD */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-xs font-bold text-zinc-900 block">
                              Navigation Items ({settingsNavItems.length})
                            </span>
                            <p className="text-[11px] text-zinc-400">Ordered sequence appears left-to-right in navbar</p>
                          </div>

                          <button
                            type="button"
                            onClick={() => setShowAddNavModal(true)}
                            className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 hover:text-amber-950 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>+ Add Navigation Item</span>
                          </button>
                        </div>

                        <div className="space-y-2.5">
                          {settingsNavItems.map((nav, idx) => (
                            <div
                              key={nav.id}
                              className="p-3.5 bg-zinc-50 rounded-2xl border border-zinc-200/80 space-y-2.5 group"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <GripVertical className="w-3.5 h-3.5 text-zinc-400" />
                                  <span className="text-[11px] font-bold font-mono text-zinc-700">
                                    Item #{idx + 1}
                                  </span>
                                  <Badge variant={nav.isEnabled !== false ? 'success' : 'neutral'}>
                                    {nav.isEnabled !== false ? 'Published' : 'Disabled'}
                                  </Badge>
                                </div>

                                <div className="flex items-center gap-1">
                                  <button
                                    type="button"
                                    disabled={idx === 0}
                                    onClick={() => handleMoveNavItem(idx, 'up')}
                                    className="p-1 text-zinc-400 hover:text-zinc-800 disabled:opacity-20 cursor-pointer"
                                    title="Move Up"
                                  >
                                    <ArrowUp className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    disabled={idx === settingsNavItems.length - 1}
                                    onClick={() => handleMoveNavItem(idx, 'down')}
                                    className="p-1 text-zinc-400 hover:text-zinc-800 disabled:opacity-20 cursor-pointer"
                                    title="Move Down"
                                  >
                                    <ArrowDown className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setSettingsNavItems((prev) =>
                                        prev.map((n, i) => (i === idx ? { ...n, isEnabled: !n.isEnabled } : n))
                                      )
                                    }
                                    className="p-1 text-zinc-400 hover:text-zinc-800 cursor-pointer"
                                    title="Toggle Enable/Disable"
                                  >
                                    {nav.isEnabled !== false ? (
                                      <Eye className="w-3.5 h-3.5 text-emerald-600" />
                                    ) : (
                                      <EyeOff className="w-3.5 h-3.5 text-rose-400" />
                                    )}
                                  </button>
                                  {isAdmin && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setSettingsNavItems((prev) => prev.filter((_, i) => i !== idx))
                                      }
                                      className="p-1 text-zinc-400 hover:text-rose-600 cursor-pointer"
                                      title="Delete Navigation Item"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <FormField
                                  label="Navigation Label"
                                  value={nav.label}
                                  onChange={(val) => {
                                    const next = [...settingsNavItems];
                                    next[idx].label = val;
                                    setSettingsNavItems(next);
                                  }}
                                  placeholder="e.g. Services"
                                />
                                <FormField
                                  label="URL / Anchor"
                                  value={nav.url}
                                  onChange={(val) => {
                                    const next = [...settingsNavItems];
                                    next[idx].url = val;
                                    setSettingsNavItems(next);
                                  }}
                                  placeholder="e.g. /services"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 2. HOME SECTION FORM */}
                  {activeSectionKey === 'home' && (
                    <div className="space-y-4">
                      <FormField
                        label="Hero Headline"
                        value={homeSections.hero.heading || ''}
                        onChange={(val) =>
                          setHomeSections((prev) => ({
                            ...prev,
                            hero: { ...prev.hero, heading: val },
                          }))
                        }
                        placeholder="e.g. We Solve"
                      />

                      <FormField
                        label="Highlight Word"
                        value={homeSections.hero.highlightWord || ''}
                        onChange={(val) =>
                          setHomeSections((prev) => ({
                            ...prev,
                            hero: { ...prev.hero, highlightWord: val },
                          }))
                        }
                        placeholder="e.g. Problems"
                      />

                      <FormField
                        label="Badge Text"
                        value={homeSections.hero.badgeText || ''}
                        onChange={(val) =>
                          setHomeSections((prev) => ({
                            ...prev,
                            hero: { ...prev.hero, badgeText: val },
                          }))
                        }
                        placeholder="e.g. Modern Editorial CMS"
                      />

                      <FormTextarea
                        label="Hero Description"
                        rows={4}
                        value={homeSections.hero.description || ''}
                        onChange={(val) =>
                          setHomeSections((prev) => ({
                            ...prev,
                            hero: { ...prev.hero, description: val },
                          }))
                        }
                        placeholder="Describe your publishing studio..."
                      />

                      <div className="grid grid-cols-2 gap-2">
                        <FormField
                          label="Primary Button Text"
                          value={homeSections.hero.primaryButtonText || ''}
                          onChange={(val) =>
                            setHomeSections((prev) => ({
                              ...prev,
                              hero: { ...prev.hero, primaryButtonText: val },
                            }))
                          }
                          placeholder="Our Services"
                        />
                        <FormField
                          label="Primary Button Link"
                          value={homeSections.hero.primaryButtonLink || ''}
                          onChange={(val) =>
                            setHomeSections((prev) => ({
                              ...prev,
                              hero: { ...prev.hero, primaryButtonLink: val },
                            }))
                          }
                          placeholder="#services"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <FormField
                          label="Secondary Button Text"
                          value={homeSections.hero.secondaryButtonText || ''}
                          onChange={(val) =>
                            setHomeSections((prev) => ({
                              ...prev,
                              hero: { ...prev.hero, secondaryButtonText: val },
                            }))
                          }
                          placeholder="About Studio"
                        />
                        <FormField
                          label="Secondary Button Link"
                          value={homeSections.hero.secondaryButtonLink || ''}
                          onChange={(val) =>
                            setHomeSections((prev) => ({
                              ...prev,
                              hero: { ...prev.hero, secondaryButtonLink: val },
                            }))
                          }
                          placeholder="#about"
                        />
                      </div>

                      {/* Readers Statistics & Avatar Showcase Management */}
                      <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b border-zinc-200/60">
                          <div>
                            <h4 className="text-xs font-bold text-zinc-900 font-['Plus_Jakarta_Sans']">
                              Readers & Statistics Counter
                            </h4>
                            <p className="text-[11px] text-zinc-500">
                              Manage the large statistic number, supporting label, final count badge, and avatars.
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              setHomeSections((prev) => ({
                                ...prev,
                                hero: {
                                  ...prev.hero,
                                  showReadersStats: prev.hero.showReadersStats === false ? true : false,
                                },
                              }))
                            }
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${homeSections.hero.showReadersStats !== false
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-zinc-200 text-zinc-600'
                              }`}
                          >
                            {homeSections.hero.showReadersStats !== false ? (
                              <>
                                <Eye className="w-3.5 h-3.5" />
                                <span>Visible</span>
                              </>
                            ) : (
                              <>
                                <EyeOff className="w-3.5 h-3.5" />
                                <span>Hidden</span>
                              </>
                            )}
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <FormField
                            label="Main Statistic Number"
                            value={homeSections.hero.readersCount || ''}
                            onChange={(val) =>
                              setHomeSections((prev) => ({
                                ...prev,
                                hero: { ...prev.hero, readersCount: val },
                              }))
                            }
                            placeholder="e.g. 2.5M+ or 5.8M+"
                          />
                          <FormField
                            label="Statistic Label"
                            value={homeSections.hero.readersLabel || ''}
                            onChange={(val) =>
                              setHomeSections((prev) => ({
                                ...prev,
                                hero: { ...prev.hero, readersLabel: val },
                              }))
                            }
                            placeholder="e.g. ACTIVE READERS"
                          />
                          <FormField
                            label="Final Badge Count"
                            value={homeSections.hero.readersBadgeText ?? '+10k'}
                            onChange={(val) =>
                              setHomeSections((prev) => ({
                                ...prev,
                                hero: { ...prev.hero, readersBadgeText: val },
                              }))
                            }
                            placeholder="e.g. +10k or +25k"
                          />
                        </div>

                        {/* Profile / Avatar Images List */}
                        <div className="space-y-3 pt-2 border-t border-zinc-200/60">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-zinc-700 uppercase tracking-wider font-mono">
                              Avatar Profiles ({(homeSections.hero.readersAvatars || DEFAULT_HOME_SECTIONS.hero.readersAvatars || []).length})
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                const currentAvatars = [
                                  ...(homeSections.hero.readersAvatars ||
                                    DEFAULT_HOME_SECTIONS.hero.readersAvatars ||
                                    []),
                                ];
                                currentAvatars.push(
                                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'
                                );
                                setHomeSections((prev) => ({
                                  ...prev,
                                  hero: { ...prev.hero, readersAvatars: currentAvatars },
                                }));
                              }}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-[11px] font-bold cursor-pointer transition"
                            >
                              <Plus className="w-3 h-3" />
                              <span>Add Avatar</span>
                            </button>
                          </div>

                          <div className="space-y-2.5">
                            {(
                              homeSections.hero.readersAvatars ||
                              DEFAULT_HOME_SECTIONS.hero.readersAvatars ||
                              []
                            ).map((avatarUrl, aIdx) => (
                              <div
                                key={aIdx}
                                className="flex items-center gap-2 p-2 bg-white rounded-xl border border-zinc-200/80 shadow-2xs"
                              >
                                <div className="w-8 h-8 rounded-full overflow-hidden bg-zinc-100 ring-2 ring-zinc-200 shrink-0">
                                  <img
                                    src={avatarUrl}
                                    alt={`Avatar ${aIdx + 1}`}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.currentTarget.src =
                                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80';
                                    }}
                                  />
                                </div>
                                <input
                                  type="text"
                                  value={avatarUrl}
                                  onChange={(e) => {
                                    const next = [
                                      ...(homeSections.hero.readersAvatars ||
                                        DEFAULT_HOME_SECTIONS.hero.readersAvatars ||
                                        []),
                                    ];
                                    next[aIdx] = e.target.value;
                                    setHomeSections((prev) => ({
                                      ...prev,
                                      hero: { ...prev.hero, readersAvatars: next },
                                    }));
                                  }}
                                  placeholder="Avatar Image URL"
                                  className="flex-1 px-2.5 py-1.5 text-xs text-zinc-900 bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-950 font-medium"
                                />
                                <label
                                  className="px-2 py-1 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-semibold cursor-pointer transition shrink-0"
                                  title="Upload & Crop Avatar"
                                >
                                  Upload
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                      handleImageFileSelect(e, `home.hero.readersAvatars.${aIdx}`)
                                    }
                                    className="hidden"
                                  />
                                </label>
                                <button
                                  type="button"
                                  disabled={aIdx === 0}
                                  onClick={() => {
                                    const next = [
                                      ...(homeSections.hero.readersAvatars ||
                                        DEFAULT_HOME_SECTIONS.hero.readersAvatars ||
                                        []),
                                    ];
                                    const temp = next[aIdx - 1];
                                    next[aIdx - 1] = next[aIdx];
                                    next[aIdx] = temp;
                                    setHomeSections((prev) => ({
                                      ...prev,
                                      hero: { ...prev.hero, readersAvatars: next },
                                    }));
                                  }}
                                  className="p-1 rounded-md text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 disabled:opacity-30 cursor-pointer"
                                  title="Move Up"
                                >
                                  <ArrowUp className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  disabled={
                                    aIdx ===
                                    (homeSections.hero.readersAvatars ||
                                      DEFAULT_HOME_SECTIONS.hero.readersAvatars ||
                                      []).length -
                                    1
                                  }
                                  onClick={() => {
                                    const next = [
                                      ...(homeSections.hero.readersAvatars ||
                                        DEFAULT_HOME_SECTIONS.hero.readersAvatars ||
                                        []),
                                    ];
                                    const temp = next[aIdx + 1];
                                    next[aIdx + 1] = next[aIdx];
                                    next[aIdx] = temp;
                                    setHomeSections((prev) => ({
                                      ...prev,
                                      hero: { ...prev.hero, readersAvatars: next },
                                    }));
                                  }}
                                  className="p-1 rounded-md text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 disabled:opacity-30 cursor-pointer"
                                  title="Move Down"
                                >
                                  <ArrowDown className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const next = (
                                      homeSections.hero.readersAvatars ||
                                      DEFAULT_HOME_SECTIONS.hero.readersAvatars ||
                                      []
                                    ).filter((_, i) => i !== aIdx);
                                    setHomeSections((prev) => ({
                                      ...prev,
                                      hero: { ...prev.hero, readersAvatars: next },
                                    }));
                                  }}
                                  className="p-1 rounded-md text-zinc-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                                  title="Remove Avatar"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Featured Card Images */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-zinc-100">
                        <ImagePickerField
                          label="Hero Card 1 Image"
                          value={homeSections.hero?.card1Image || ''}
                          onChange={(url) =>
                            setHomeSections((prev) => ({
                              ...prev,
                              hero: { ...prev.hero, card1Image: url },
                            }))
                          }
                          onUploadClick={(e) => handleImageFileSelect(e, 'home.hero.card1Image')}
                          onRemove={() =>
                            setHomeSections((prev) => ({
                              ...prev,
                              hero: { ...prev.hero, card1Image: '' },
                            }))
                          }
                        />
                        <ImagePickerField
                          label="Hero Card 2 Image"
                          value={homeSections.hero?.card2Image || ''}
                          onChange={(url) =>
                            setHomeSections((prev) => ({
                              ...prev,
                              hero: { ...prev.hero, card2Image: url },
                            }))
                          }
                          onUploadClick={(e) => handleImageFileSelect(e, 'home.hero.card2Image')}
                          onRemove={() =>
                            setHomeSections((prev) => ({
                              ...prev,
                              hero: { ...prev.hero, card2Image: '' },
                            }))
                          }
                        />
                      </div>
                    </div>
                  )}

                  {/* 2b. SERVICES SECTION FORM */}
                  {activeSectionKey === 'services' && (
                    <div className="space-y-4">
                      <FormField
                        label="Services Headline"
                        value={homeSections.services?.heading || ''}
                        onChange={(val) =>
                          setHomeSections((prev) => ({
                            ...prev,
                            services: { ...prev.services, heading: val },
                          }))
                        }
                        placeholder="The Services We Provide"
                      />

                      <FormField
                        label="Badge Text"
                        value={homeSections.services?.badgeText || ''}
                        onChange={(val) =>
                          setHomeSections((prev) => ({
                            ...prev,
                            services: { ...prev.services, badgeText: val },
                          }))
                        }
                        placeholder="WHAT WE OFFER"
                      />

                      <FormTextarea
                        label="Services Description"
                        rows={3}
                        value={homeSections.services?.description || ''}
                        onChange={(val) =>
                          setHomeSections((prev) => ({
                            ...prev,
                            services: { ...prev.services, description: val },
                          }))
                        }
                        placeholder="From creative concept to final publication..."
                      />

                      {/* 3 Service Cards */}
                      <div className="pt-2 border-t border-zinc-100 space-y-3">
                        <span className="text-xs font-bold text-zinc-900 block">Service Capability Cards</span>
                        {(homeSections.services?.items || DEFAULT_HOME_SECTIONS.services.items).map((item, idx) => (
                          <div key={idx} className="p-3.5 bg-zinc-50 rounded-2xl border border-zinc-200/80 space-y-2">
                            <span className="text-[11px] font-bold font-mono text-zinc-700">Card #{idx + 1}</span>
                            <FormField
                              label="Service Title"
                              value={item.title}
                              onChange={(val) => {
                                const next = [...(homeSections.services?.items || DEFAULT_HOME_SECTIONS.services.items)];
                                next[idx] = { ...next[idx], title: val };
                                setHomeSections((prev) => ({
                                  ...prev,
                                  services: { ...prev.services, items: next },
                                }));
                              }}
                              placeholder="e.g. Digital Publishing"
                            />
                            <FormTextarea
                              label="Service Description"
                              rows={2}
                              value={item.description}
                              onChange={(val) => {
                                const next = [...(homeSections.services?.items || DEFAULT_HOME_SECTIONS.services.items)];
                                next[idx] = { ...next[idx], description: val };
                                setHomeSections((prev) => ({
                                  ...prev,
                                  services: { ...prev.services, items: next },
                                }));
                              }}
                              placeholder="Describe this service capability..."
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 2c. WHY CHOOSE US SECTION FORM */}
                  {activeSectionKey === 'whyUs' && (
                    <div className="space-y-4">
                      <FormField
                        label="Why Us Headline"
                        value={homeSections.whyUs?.heading || ''}
                        onChange={(val) =>
                          setHomeSections((prev) => ({
                            ...prev,
                            whyUs: { ...prev.whyUs, heading: val },
                          }))
                        }
                        placeholder="Why You Choose Us?"
                      />

                      <FormField
                        label="Badge Text"
                        value={homeSections.whyUs?.badgeText || ''}
                        onChange={(val) =>
                          setHomeSections((prev) => ({
                            ...prev,
                            whyUs: { ...prev.whyUs, badgeText: val },
                          }))
                        }
                        placeholder="OUR ADVANTAGE"
                      />

                      <FormTextarea
                        label="Why Us Description"
                        rows={3}
                        value={homeSections.whyUs?.description || ''}
                        onChange={(val) =>
                          setHomeSections((prev) => ({
                            ...prev,
                            whyUs: { ...prev.whyUs, description: val },
                          }))
                        }
                        placeholder="We eliminate technical friction from digital content management..."
                      />

                      {/* Graphic Image */}
                      <div className="pt-2 border-t border-zinc-100">
                        <ImagePickerField
                          label="Advantage Feature Graphic"
                          value={homeSections.whyUs?.image || ''}
                          onChange={(url) =>
                            setHomeSections((prev) => ({
                              ...prev,
                              whyUs: { ...prev.whyUs, image: url },
                            }))
                          }
                          onUploadClick={(e) => handleImageFileSelect(e, 'home.whyUs.image')}
                          onRemove={() =>
                            setHomeSections((prev) => ({
                              ...prev,
                              whyUs: { ...prev.whyUs, image: '' },
                            }))
                          }
                        />
                      </div>

                      {/* 3 Advantage Features */}
                      <div className="pt-2 border-t border-zinc-100 space-y-3">
                        <span className="text-xs font-bold text-zinc-900 block">Advantage Features</span>
                        {(homeSections.whyUs?.features || DEFAULT_HOME_SECTIONS.whyUs.features).map((feat, idx) => (
                          <div key={idx} className="p-3.5 bg-zinc-50 rounded-2xl border border-zinc-200/80 space-y-2">
                            <span className="text-[11px] font-bold font-mono text-zinc-700">Feature #{idx + 1}</span>
                            <FormField
                              label="Feature Title"
                              value={feat.title}
                              onChange={(val) => {
                                const next = [...(homeSections.whyUs?.features || DEFAULT_HOME_SECTIONS.whyUs.features)];
                                next[idx] = { ...next[idx], title: val };
                                setHomeSections((prev) => ({
                                  ...prev,
                                  whyUs: { ...prev.whyUs, features: next },
                                }));
                              }}
                              placeholder="e.g. Fully Secured"
                            />
                            <FormTextarea
                              label="Feature Description"
                              rows={2}
                              value={feat.description}
                              onChange={(val) => {
                                const next = [...(homeSections.whyUs?.features || DEFAULT_HOME_SECTIONS.whyUs.features)];
                                next[idx] = { ...next[idx], description: val };
                                setHomeSections((prev) => ({
                                  ...prev,
                                  whyUs: { ...prev.whyUs, features: next },
                                }));
                              }}
                              placeholder="Describe this feature..."
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 2d. PROCESS & METHODOLOGY SECTION FORM */}
                  {activeSectionKey === 'process' && (
                    <div className="space-y-4">
                      <FormField
                        label="Process Headline"
                        value={homeSections.process?.heading || ''}
                        onChange={(val) =>
                          setHomeSections((prev) => ({
                            ...prev,
                            process: { ...prev.process, heading: val },
                          }))
                        }
                        placeholder="How We Do"
                      />

                      <FormField
                        label="Badge Text"
                        value={homeSections.process?.badgeText || ''}
                        onChange={(val) =>
                          setHomeSections((prev) => ({
                            ...prev,
                            process: { ...prev.process, badgeText: val },
                          }))
                        }
                        placeholder="OUR METHODOLOGY"
                      />

                      <FormTextarea
                        label="Process Description"
                        rows={3}
                        value={homeSections.process?.description || ''}
                        onChange={(val) =>
                          setHomeSections((prev) => ({
                            ...prev,
                            process: { ...prev.process, description: val },
                          }))
                        }
                        placeholder="A structured, repeatable approach..."
                      />

                      {/* 3 Steps */}
                      <div className="pt-2 border-t border-zinc-100 space-y-3">
                        <span className="text-xs font-bold text-zinc-900 block">Methodology Steps</span>
                        {(homeSections.process?.steps || DEFAULT_HOME_SECTIONS.process.steps).map((step, idx) => (
                          <div key={idx} className="p-3.5 bg-zinc-50 rounded-2xl border border-zinc-200/80 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold font-mono text-zinc-700">Step {step.num || `0${idx + 1}`}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                              <FormField
                                label="Number"
                                value={step.num}
                                onChange={(val) => {
                                  const next = [...(homeSections.process?.steps || DEFAULT_HOME_SECTIONS.process.steps)];
                                  next[idx] = { ...next[idx], num: val };
                                  setHomeSections((prev) => ({
                                    ...prev,
                                    process: { ...prev.process, steps: next },
                                  }));
                                }}
                                placeholder="01"
                              />
                              <div className="col-span-2">
                                <FormField
                                  label="Step Title"
                                  value={step.title}
                                  onChange={(val) => {
                                    const next = [...(homeSections.process?.steps || DEFAULT_HOME_SECTIONS.process.steps)];
                                    next[idx] = { ...next[idx], title: val };
                                    setHomeSections((prev) => ({
                                      ...prev,
                                      process: { ...prev.process, steps: next },
                                    }));
                                  }}
                                  placeholder="e.g. Ideate"
                                />
                              </div>
                            </div>
                            <FormTextarea
                              label="Deliverable Items (one per line)"
                              rows={3}
                              value={(step.items || []).join('\n')}
                              onChange={(val) => {
                                const next = [...(homeSections.process?.steps || DEFAULT_HOME_SECTIONS.process.steps)];
                                next[idx] = { ...next[idx], items: val.split('\n').filter(Boolean) };
                                setHomeSections((prev) => ({
                                  ...prev,
                                  process: { ...prev.process, steps: next },
                                }));
                              }}
                              placeholder="Content Strategy&#10;Topic Research&#10;Editorial Planning"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 2e. TESTIMONIALS SECTION FORM */}
                  {activeSectionKey === 'testimonials' && (
                    <div className="space-y-4">
                      <FormField
                        label="Testimonials Headline"
                        value={homeSections.testimonials?.heading || ''}
                        onChange={(val) =>
                          setHomeSections((prev) => ({
                            ...prev,
                            testimonials: { ...prev.testimonials, heading: val },
                          }))
                        }
                        placeholder="What Readers Are Saying"
                      />

                      <FormField
                        label="Badge Text"
                        value={homeSections.testimonials?.badgeText || ''}
                        onChange={(val) =>
                          setHomeSections((prev) => ({
                            ...prev,
                            testimonials: { ...prev.testimonials, badgeText: val },
                          }))
                        }
                        placeholder="TESTIMONIALS"
                      />

                      {/* Testimonial Cards */}
                      <div className="pt-2 border-t border-zinc-100 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-zinc-900 block">
                            Reader Statements ({homeSections.testimonials?.items?.length || 0})
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const next = [
                                ...(homeSections.testimonials?.items || DEFAULT_HOME_SECTIONS.testimonials.items),
                                {
                                  quote: 'This platform transformed our digital publishing workflow. The reading experience is exceptionally clean.',
                                  author: 'Elena Rostova',
                                  role: 'Lead Editorial Director, Apex Media',
                                  image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
                                },
                              ];
                              setHomeSections((prev) => ({
                                ...prev,
                                testimonials: { ...prev.testimonials, items: next },
                              }));
                            }}
                            className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 hover:text-amber-950 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>+ Add Testimonial</span>
                          </button>
                        </div>

                        {(homeSections.testimonials?.items || DEFAULT_HOME_SECTIONS.testimonials.items).map((item, idx) => (
                          <div key={idx} className="p-3.5 bg-zinc-50 rounded-2xl border border-zinc-200/80 space-y-2.5">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold font-mono text-zinc-700">Statement #{idx + 1}</span>
                              {(homeSections.testimonials?.items || []).length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const next = (homeSections.testimonials?.items || []).filter((_, i) => i !== idx);
                                    setHomeSections((prev) => ({
                                      ...prev,
                                      testimonials: { ...prev.testimonials, items: next },
                                    }));
                                  }}
                                  className="p-1 text-zinc-400 hover:text-rose-600 transition cursor-pointer"
                                  title="Delete Testimonial"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>

                            <FormTextarea
                              label="Quote Statement"
                              rows={3}
                              value={item.quote}
                              onChange={(val) => {
                                const next = [...(homeSections.testimonials?.items || DEFAULT_HOME_SECTIONS.testimonials.items)];
                                next[idx] = { ...next[idx], quote: val };
                                setHomeSections((prev) => ({
                                  ...prev,
                                  testimonials: { ...prev.testimonials, items: next },
                                }));
                              }}
                              placeholder="Write reader endorsement quote..."
                            />

                            <div className="grid grid-cols-2 gap-2">
                              <FormField
                                label="Author Name"
                                value={item.author}
                                onChange={(val) => {
                                  const next = [...(homeSections.testimonials?.items || DEFAULT_HOME_SECTIONS.testimonials.items)];
                                  next[idx] = { ...next[idx], author: val };
                                  setHomeSections((prev) => ({
                                    ...prev,
                                    testimonials: { ...prev.testimonials, items: next },
                                  }));
                                }}
                                placeholder="e.g. Elena Rostova"
                              />
                              <FormField
                                label="Author Role / Title"
                                value={item.role}
                                onChange={(val) => {
                                  const next = [...(homeSections.testimonials?.items || DEFAULT_HOME_SECTIONS.testimonials.items)];
                                  next[idx] = { ...next[idx], role: val };
                                  setHomeSections((prev) => ({
                                    ...prev,
                                    testimonials: { ...prev.testimonials, items: next },
                                  }));
                                }}
                                placeholder="e.g. Lead Editorial Director"
                              />
                            </div>

                            <ImagePickerField
                              label="Portrait Photo"
                              value={item.image || ''}
                              onChange={(url) => {
                                const next = [...(homeSections.testimonials?.items || DEFAULT_HOME_SECTIONS.testimonials.items)];
                                next[idx] = { ...next[idx], image: url };
                                setHomeSections((prev) => ({
                                  ...prev,
                                  testimonials: { ...prev.testimonials, items: next },
                                }));
                              }}
                              onUploadClick={(e) => handleImageFileSelect(e, `home.testimonials.${idx}`)}
                              onRemove={() => {
                                const next = [...(homeSections.testimonials?.items || DEFAULT_HOME_SECTIONS.testimonials.items)];
                                next[idx] = { ...next[idx], image: '' };
                                setHomeSections((prev) => ({
                                  ...prev,
                                  testimonials: { ...prev.testimonials, items: next },
                                }));
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 3. ABOUT SECTION FORM */}
                  {activeSectionKey === 'about' && (
                    <div className="space-y-4">
                      <FormField
                        label="About Heading"
                        value={aboutSections.header.heading || ''}
                        onChange={(val) =>
                          setAboutSections((prev) => ({
                            ...prev,
                            header: { ...prev.header, heading: val },
                          }))
                        }
                        placeholder="Crafting thoughtful digital publications..."
                      />

                      <FormField
                        label="Highlight Word"
                        value={aboutSections.header.highlightWord || ''}
                        onChange={(val) =>
                          setAboutSections((prev) => ({
                            ...prev,
                            header: { ...prev.header, highlightWord: val },
                          }))
                        }
                        placeholder="thoughtful"
                      />

                      <FormField
                        label="Badge Text"
                        value={aboutSections.header.badgeText || ''}
                        onChange={(val) =>
                          setAboutSections((prev) => ({
                            ...prev,
                            header: { ...prev.header, badgeText: val },
                          }))
                        }
                        placeholder="ABOUT OUR STUDIO"
                      />

                      <FormTextarea
                        label="About Overview Description"
                        rows={4}
                        value={aboutSections.header.description || ''}
                        onChange={(val) =>
                          setAboutSections((prev) => ({
                            ...prev,
                            header: { ...prev.header, description: val },
                          }))
                        }
                      />

                      {/* About Studio Feature Image */}
                      <div className="pt-2 border-t border-zinc-100">
                        <ImagePickerField
                          label="About Studio Feature Image"
                          value={aboutSections.header?.image || ''}
                          onChange={(url) =>
                            setAboutSections((prev) => ({
                              ...prev,
                              header: { ...prev.header, image: url },
                            }))
                          }
                          onUploadClick={(e) => handleImageFileSelect(e, 'about.header.image')}
                          onRemove={() =>
                            setAboutSections((prev) => ({
                              ...prev,
                              header: { ...prev.header, image: '' },
                            }))
                          }
                        />
                      </div>

                      {/* Philosophy Essay & Image */}
                      <div className="pt-3 border-t border-zinc-100 space-y-3">
                        <span className="text-xs font-bold text-zinc-900 block">Editorial Philosophy Essay</span>
                        <FormField
                          label="Philosophy Headline"
                          value={aboutSections.philosophy.heading || ''}
                          onChange={(val) =>
                            setAboutSections((prev) => ({
                              ...prev,
                              philosophy: { ...prev.philosophy, heading: val },
                            }))
                          }
                        />
                        <FormTextarea
                          label="Philosophy Essay (Paragraph 1)"
                          rows={3}
                          value={aboutSections.philosophy.paragraphs?.[0] || ''}
                          onChange={(val) => {
                            const p = [...(aboutSections.philosophy.paragraphs || [])];
                            p[0] = val;
                            setAboutSections((prev) => ({
                              ...prev,
                              philosophy: { ...prev.philosophy, paragraphs: p },
                            }));
                          }}
                        />
                        <ImagePickerField
                          label="Philosophy Workspace Image"
                          value={aboutSections.philosophy?.image || ''}
                          onChange={(url) =>
                            setAboutSections((prev) => ({
                              ...prev,
                              philosophy: { ...prev.philosophy, image: url },
                            }))
                          }
                          onUploadClick={(e) => handleImageFileSelect(e, 'about.philosophy.image')}
                          onRemove={() =>
                            setAboutSections((prev) => ({
                              ...prev,
                              philosophy: { ...prev.philosophy, image: '' },
                            }))
                          }
                        />
                      </div>
                    </div>
                  )}


                  {/* 5. CONTACT SECTION FORM */}
                  {activeSectionKey === 'contact' && (
                    <div className="space-y-4">
                      <FormField
                        label="Contact Headline"
                        value={contactData.heading}
                        onChange={(val) => setContactData((prev) => ({ ...prev, heading: val }))}
                        placeholder="LET'S CONNECT"
                      />

                      <FormField
                        label="Badge Text"
                        value={contactData.badgeText}
                        onChange={(val) => setContactData((prev) => ({ ...prev, badgeText: val }))}
                        placeholder="SAY HI TO US"
                      />

                      <FormTextarea
                        label="Contact Description"
                        rows={3}
                        value={contactData.description}
                        onChange={(val) => setContactData((prev) => ({ ...prev, description: val }))}
                      />

                      <FormField
                        label="Contact Email"
                        value={contactData.contactEmail}
                        onChange={(val) => setContactData((prev) => ({ ...prev, contactEmail: val }))}
                        placeholder="contact@grido.io"
                      />

                      <FormField
                        label="Working Hours"
                        value={contactData.workingHours}
                        onChange={(val) => setContactData((prev) => ({ ...prev, workingHours: val }))}
                        placeholder="Monday – Friday : 08 AM – 06 PM"
                      />

                      <FormField
                        label="Location Address"
                        value={contactData.location}
                        onChange={(val) => setContactData((prev) => ({ ...prev, location: val }))}
                        placeholder="London · New York · San Francisco"
                      />
                    </div>
                  )}

                  {/* 6. FOOTER SECTION FORM */}
                  {activeSectionKey === 'footer' && (
                    <div className="space-y-4">
                      <FormTextarea
                        label="Footer Summary Description"
                        rows={3}
                        value={footerData.description}
                        onChange={(val) => setFooterData((prev) => ({ ...prev, description: val }))}
                      />

                      <FormField
                        label="Copyright Notice"
                        value={footerData.copyright}
                        onChange={(val) => setFooterData((prev) => ({ ...prev, copyright: val }))}
                        placeholder="© 2026 Grido. All rights reserved."
                      />

                      {/* Social Links */}
                      <div className="pt-2 border-t border-zinc-100 space-y-2">
                        <span className="text-xs font-bold text-zinc-900 block">Social Media Profiles</span>
                        <div className="grid grid-cols-2 gap-2">
                          <FormField
                            label="Twitter / X"
                            value={footerData.twitterUrl}
                            onChange={(val) => setFooterData((prev) => ({ ...prev, twitterUrl: val }))}
                          />
                          <FormField
                            label="Instagram"
                            value={footerData.instagramUrl}
                            onChange={(val) => setFooterData((prev) => ({ ...prev, instagramUrl: val }))}
                          />
                          <FormField
                            label="LinkedIn"
                            value={footerData.linkedinUrl}
                            onChange={(val) => setFooterData((prev) => ({ ...prev, linkedinUrl: val }))}
                          />
                          <FormField
                            label="GitHub"
                            value={footerData.githubUrl}
                            onChange={(val) => setFooterData((prev) => ({ ...prev, githubUrl: val }))}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 7. 404 NOT FOUND PAGE FORM */}
                  {activeSectionKey === '404' && (
                    <div className="space-y-4">
                      <FormField
                        label="Error Badge Code"
                        value={notFoundSections.general.badgeCode || '404'}
                        onChange={(val) =>
                          setNotFoundSections((prev) => ({
                            ...prev,
                            general: { ...prev.general, badgeCode: val },
                          }))
                        }
                      />

                      <FormField
                        label="Headline / Title"
                        value={notFoundSections.general.heading || 'PAGE NOT FOUND'}
                        onChange={(val) =>
                          setNotFoundSections((prev) => ({
                            ...prev,
                            general: { ...prev.general, heading: val },
                          }))
                        }
                      />

                      <FormField
                        label="Guidance Line 1"
                        value={notFoundSections.general.line1 || ''}
                        onChange={(val) =>
                          setNotFoundSections((prev) => ({
                            ...prev,
                            general: { ...prev.general, line1: val },
                          }))
                        }
                      />

                      <FormField
                        label="Guidance Line 2"
                        value={notFoundSections.general.line2 || ''}
                        onChange={(val) =>
                          setNotFoundSections((prev) => ({
                            ...prev,
                            general: { ...prev.general, line2: val },
                          }))
                        }
                      />

                      <FormField
                        label="Guidance Line 3"
                        value={notFoundSections.general.line3 || ''}
                        onChange={(val) =>
                          setNotFoundSections((prev) => ({
                            ...prev,
                            general: { ...prev.general, line3: val },
                          }))
                        }
                      />

                      <div className="grid grid-cols-2 gap-2">
                        <FormField
                          label="Button Text"
                          value={notFoundSections.general.buttonText || 'Go Back Home'}
                          onChange={(val) =>
                            setNotFoundSections((prev) => ({
                              ...prev,
                              general: { ...prev.general, buttonText: val },
                            }))
                          }
                        />
                        <FormField
                          label="Button Link"
                          value={notFoundSections.general.buttonLink || '/'}
                          onChange={(val) =>
                            setNotFoundSections((prev) => ({
                              ...prev,
                              general: { ...prev.general, buttonLink: val },
                            }))
                          }
                        />
                      </div>
                    </div>
                  )}

                  {/* 8. DYNAMIC CUSTOM PAGE EDITOR */}
                  {isCustomPageActive && (
                    <div className="space-y-4">
                      <div className="p-3 bg-zinc-50 rounded-2xl border border-zinc-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-zinc-900">Page Configuration</span>
                          <Badge variant={customPageStatus === 'Published' ? 'success' : 'neutral'}>
                            {customPageStatus}
                          </Badge>
                        </div>
                        <FormField
                          label="Page Title"
                          value={customPageTitle}
                          onChange={setCustomPageTitle}
                          placeholder="e.g. Services"
                        />
                        <FormField
                          label="Page URL / Slug"
                          value={customPageSlug}
                          onChange={setCustomPageSlug}
                          placeholder="e.g. services"
                        />
                      </div>

                      {/* Section Ordering */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-zinc-900">
                            Page Sections ({customSectionOrder.length})
                          </span>
                          <button
                            type="button"
                            onClick={() => setShowAddSectionModal(true)}
                            className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 hover:text-amber-950 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>+ Add Section</span>
                          </button>
                        </div>

                        <div className="space-y-2">
                          {customSectionOrder.map((sec, secIdx) => {
                            const isSelected = selectedCustomSecId === sec.id;
                            return (
                              <div
                                key={sec.id}
                                onClick={() => setSelectedCustomSecId(sec.id)}
                                className={`p-3 rounded-xl border flex items-center justify-between gap-2 cursor-pointer transition ${isSelected
                                  ? 'bg-zinc-950 text-white border-zinc-950 shadow-xs'
                                  : 'bg-zinc-50 text-zinc-800 border-zinc-200 hover:bg-zinc-100'
                                  }`}
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <span
                                    className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-[#FCD06B]' : 'bg-emerald-500'
                                      }`}
                                  />
                                  <span className="text-xs font-bold truncate">{sec.name}</span>
                                </div>

                                <div className="flex items-center gap-1 shrink-0">
                                  <button
                                    type="button"
                                    disabled={secIdx === 0}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const next = [...customSectionOrder];
                                      const temp = next[secIdx];
                                      next[secIdx] = next[secIdx - 1];
                                      next[secIdx - 1] = temp;
                                      setCustomSectionOrder(next);
                                    }}
                                    className="p-1 disabled:opacity-20 hover:bg-white/20 rounded cursor-pointer"
                                  >
                                    <ArrowUp className="w-3 h-3" />
                                  </button>
                                  <button
                                    type="button"
                                    disabled={secIdx === customSectionOrder.length - 1}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const next = [...customSectionOrder];
                                      const temp = next[secIdx];
                                      next[secIdx] = next[secIdx + 1];
                                      next[secIdx + 1] = temp;
                                      setCustomSectionOrder(next);
                                    }}
                                    className="p-1 disabled:opacity-20 hover:bg-white/20 rounded cursor-pointer"
                                  >
                                    <ArrowDown className="w-3 h-3" />
                                  </button>
                                  {isAdmin && (
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setCustomSectionOrder((prev) =>
                                          prev.filter((s) => s.id !== sec.id)
                                        );
                                      }}
                                      className="p-1 hover:bg-white/20 rounded text-rose-400 cursor-pointer"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Selected Section Editor */}
                      {customSectionsData[selectedCustomSecId] && (
                        <div className="p-3.5 bg-zinc-50 rounded-2xl border border-zinc-200 space-y-3 pt-3">
                          <span className="text-[11px] font-bold uppercase font-mono text-amber-800 block">
                            Edit Selected Section ({activeCustomSecMeta?.name || 'Section'})
                          </span>
                          <FormField
                            label="Headline / Title"
                            value={customSectionsData[selectedCustomSecId]?.heading || ''}
                            onChange={(val) =>
                              setCustomSectionsData((prev) => ({
                                ...prev,
                                [selectedCustomSecId]: {
                                  ...prev[selectedCustomSecId],
                                  heading: val,
                                },
                              }))
                            }
                          />
                          <FormTextarea
                            label="Description / Paragraph"
                            rows={3}
                            value={customSectionsData[selectedCustomSecId]?.content || customSectionsData[selectedCustomSecId]?.description || ''}
                            onChange={(val) =>
                              setCustomSectionsData((prev) => ({
                                ...prev,
                                [selectedCustomSecId]: {
                                  ...prev[selectedCustomSecId],
                                  content: val,
                                  description: val,
                                },
                              }))
                            }
                          />

                        </div>
                      )}

                      {/* Delete Custom Page */}
                      {isAdmin && (
                        <div className="pt-4 border-t border-zinc-200">
                          <button
                            type="button"
                            onClick={() => setShowDeletePageModal(true)}
                            className="w-full py-2 px-3 rounded-xl border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete Custom Page</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                </div>
              </div>

              {/* RIGHT COLUMN: Live Responsive Multi-Device Section Simulator */}
              <div className="flex-1 bg-zinc-100/90 rounded-3xl border border-zinc-200/90 shadow-sm flex flex-col min-h-0 overflow-hidden p-3 sm:p-4">
                {/* Simulator Toolbar */}
                <div className="px-3.5 py-2.5 bg-white rounded-2xl border border-zinc-200/90 mb-3 shadow-2xs flex flex-wrap items-center justify-between gap-3 shrink-0">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                    <span className="text-xs font-bold text-zinc-900 truncate">
                      {currentSectionItem.title} Preview
                    </span>
                  </div>

                  {/* Device mode switcher (hidden on mobile screens) */}
                  <div className="hidden sm:flex items-center bg-zinc-100 p-0.5 rounded-xl border border-zinc-200/80">
                    <button
                      type="button"
                      onClick={() => {
                        setDeviceMode('desktop');
                        setMobileDrawerOpen(false);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer ${deviceMode === 'desktop' ? 'bg-white text-zinc-950 shadow-2xs' : 'text-zinc-500 hover:text-zinc-900'
                        }`}
                    >
                      <Monitor className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Desktop</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setDeviceMode('tablet');
                        setMobileDrawerOpen(false);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer ${deviceMode === 'tablet' ? 'bg-white text-zinc-950 shadow-2xs' : 'text-zinc-500 hover:text-zinc-900'
                        }`}
                    >
                      <Tablet className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Tablet</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeviceMode('mobile')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer ${deviceMode === 'mobile' ? 'bg-white text-zinc-950 shadow-2xs' : 'text-zinc-500 hover:text-zinc-900'
                        }`}
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Mobile</span>
                    </button>
                  </div>
                </div>

                {/* Canvas Frame Container */}
                <div className="flex-1 flex justify-center items-center overflow-hidden min-h-0 relative p-1.5 sm:p-3 bg-zinc-100/80 select-none">
                  {/* Device Viewport Preview Container */}
                  <div
                    className={`bg-white transition-all duration-300 flex flex-col relative overflow-hidden ${deviceMode === 'tablet'
                      ? 'preview-simulator-tablet w-[768px] max-w-full h-full border border-zinc-200 shadow-sm rounded-none sm:rounded-lg my-auto'
                      : deviceMode === 'mobile'
                        ? 'preview-simulator-mobile w-full max-w-[390px] h-full border border-zinc-200 shadow-sm rounded-none sm:rounded-lg my-auto'
                        : 'preview-simulator-desktop w-full h-full max-w-full border border-zinc-200 shadow-sm rounded-none sm:rounded-lg'
                      }`}
                  >
                    {/* Internal Scrollable Screen Viewport */}
                    <div
                      ref={previewScrollRef}
                      onScroll={() => {
                        if (mobileDrawerOpen) setMobileDrawerOpen(false);
                      }}
                      className="flex-1 flex flex-col w-full h-full overflow-y-auto overflow-x-hidden relative scroll-smooth bg-white"
                    >
                      {/* Live Navbar Header Simulation */}
                      <header className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-xs border-b border-zinc-100 px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img
                            src={settingsLogo.url?.trim() ? settingsLogo.url : '/logo/logo.png'}
                            alt={settingsLogo.text || 'Logo'}
                            style={{
                              height: settingsLogo.height ? `${settingsLogo.height}px` : undefined,
                              maxHeight: '48px',
                            }}
                            className="h-6 sm:h-7 w-auto object-contain"
                            onError={(e) => {
                              const target = e.currentTarget;
                              if (!target.src.endsWith('/logo/logo.png')) {
                                target.src = '/logo/logo.png';
                              }
                            }}
                          />
                        </div>

                        {deviceMode !== 'mobile' ? (
                          <nav className="flex items-center gap-5 text-xs font-semibold text-zinc-600">
                            {settingsNavItems
                              .filter((n) => n.isEnabled !== false)
                              .map((navItem) => {
                                const isNavActive =
                                  (navItem.url === '/' && activeSectionKey === 'home') ||
                                  navItem.url === `/#${activeSectionKey}` ||
                                  navItem.url === `/${activeSectionKey}` ||
                                  navItem.url === activeSectionKey;

                                return (
                                  <button
                                    key={navItem.id}
                                    type="button"
                                    onClick={() => {
                                      const targetKey = navItem.url.replace('/#', '').replace('/', '') || 'home';
                                      handleOpenEditor(targetKey);
                                    }}
                                    className={`transition cursor-pointer ${isNavActive
                                      ? 'text-zinc-950 font-bold border-b-2 border-zinc-950 pb-0.5'
                                      : 'hover:text-zinc-950'
                                      }`}
                                  >
                                    {navItem.label}
                                  </button>
                                );
                              })}
                          </nav>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
                            className="p-1.5 rounded-lg bg-zinc-100 text-zinc-800 cursor-pointer"
                          >
                            {mobileDrawerOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                          </button>
                        )}
                      </header>

                      {/* Mobile Slide-in Drawer in Simulator (Right to Left) */}
                      <AnimatePresence>
                        {deviceMode === 'mobile' && mobileDrawerOpen && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 z-40 bg-black/40 backdrop-blur-xs flex justify-end"
                            onClick={() => setMobileDrawerOpen(false)}
                          >
                            <motion.div
                              initial={{ x: '100%' }}
                              animate={{ x: 0 }}
                              exit={{ x: '100%' }}
                              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                              onClick={(e) => e.stopPropagation()}
                              className="w-[260px] max-w-[80%] h-full bg-white shadow-2xl p-5 flex flex-col justify-between overflow-y-auto"
                            >
                              <div className="space-y-6">
                                <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
                                  <img
                                    src={settingsLogo.url?.trim() ? settingsLogo.url : '/logo/logo.png'}
                                    alt={settingsLogo.text || 'Logo'}
                                    style={{
                                      height: settingsLogo.height ? `${Math.min(32, settingsLogo.height)}px` : '26px',
                                      maxHeight: '36px',
                                    }}
                                    className="h-6 sm:h-7 w-auto object-contain max-w-[130px]"
                                    onError={(e) => {
                                      const target = e.currentTarget;
                                      if (!target.src.endsWith('/logo/logo.png')) {
                                        target.src = '/logo/logo.png';
                                      }
                                    }}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setMobileDrawerOpen(false)}
                                    className="p-1 rounded-lg hover:bg-zinc-100 text-zinc-500 cursor-pointer"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                                <nav className="flex flex-col space-y-3 text-sm font-bold text-zinc-800">
                                  {settingsNavItems
                                    .filter((n) => n.isEnabled !== false)
                                    .map((navItem) => (
                                      <button
                                        key={navItem.id}
                                        type="button"
                                        onClick={() => {
                                          const targetKey = navItem.url.replace('/#', '').replace('/', '') || 'home';
                                          handleOpenEditor(targetKey);
                                          setMobileDrawerOpen(false);
                                        }}
                                        className="text-left py-1 hover:text-amber-600 transition cursor-pointer"
                                      >
                                        {navItem.label}
                                      </button>
                                    ))}
                                </nav>
                              </div>
                              <div className="pt-4 border-t border-zinc-100 text-[11px] text-zinc-400 font-mono">
                                Responsive Mobile Preview
                              </div>
                            </motion.div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Section Live Content */}
                      <main className="flex-1 flex flex-col">
                        {['navbar', 'home', 'about', 'services', 'whyUs', 'process', 'testimonials', 'contact', 'footer'].includes(activeSectionKey) ? (
                          <div className="w-full flex flex-col">
                            <HeroSection content={homeSections.hero} deviceMode={deviceMode} />
                            <AboutSection content={aboutSections} deviceMode={deviceMode} />
                            <ServicesSection content={homeSections.services} deviceMode={deviceMode} />
                            <WhyUsSection content={homeSections.whyUs} deviceMode={deviceMode} />
                            <ProcessSection content={homeSections.process} />
                            <TestimonialsSection content={homeSections.testimonials} />
                            <Footer
                              content={{
                                ...homeSections.cta,
                                ...contactData,
                              }}
                              deviceMode={deviceMode}
                              showContactSection={true}
                            />
                          </div>
                        ) : activeSectionKey === 'about' ? (
                          <div className="w-full flex flex-col">
                            <AboutSection content={aboutSections} deviceMode={deviceMode} />
                            <Footer
                              content={{
                                ...homeSections.cta,
                                ...contactData,
                              }}
                              deviceMode={deviceMode}
                              showContactSection={true}
                            />
                          </div>
                        ) : activeSectionKey === '404' ? (
                          <div className="w-full flex flex-col">
                            <NotFoundContent
                              content={notFoundSections.general}
                              isInsidePreview={true}
                            />
                            <Footer
                              content={{
                                ...homeSections.cta,
                                ...contactData,
                              }}
                              deviceMode={deviceMode}
                              showContactSection={false}
                            />
                          </div>
                        ) : isCustomPageActive ? (
                          <div className="w-full flex flex-col">
                            <DynamicSectionsRenderer
                              sectionOrder={customSectionOrder}
                              sections={customSectionsData}
                              deviceMode={deviceMode}
                              isInsidePreview={true}
                            />
                            <Footer content={DEFAULT_HOME_SECTIONS.cta} deviceMode={deviceMode} showContactSection={true} />
                          </div>
                        ) : null}
                      </main>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

      </div>

      {/* MODAL: Add Navigation Item */}
      {showAddNavModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-zinc-200 space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-amber-700" />
                <h3 className="text-base font-bold text-zinc-950">Add Navigation Item</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddNavModal(false)}
                className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-zinc-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddNavItem} className="space-y-3.5">
              <FormField
                label="Navigation Label *"
                value={newNavLabel}
                onChange={setNewNavLabel}
                placeholder="e.g. Services"
              />

              <FormField
                label="URL / Anchor Path *"
                value={newNavUrl}
                onChange={setNewNavUrl}
                placeholder="e.g. /services or /#services"
              />

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="navEnabled"
                  checked={newNavEnabled}
                  onChange={(e) => setNewNavEnabled(e.target.checked)}
                  className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900 cursor-pointer"
                />
                <label htmlFor="navEnabled" className="text-xs font-semibold text-zinc-700 cursor-pointer">
                  Enabled (Visible in public header)
                </label>
              </div>

              <div className="pt-3 border-t border-zinc-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddNavModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-600 hover:bg-zinc-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-zinc-950 hover:bg-zinc-800 transition shadow-xs cursor-pointer"
                >
                  Save Item
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* MODAL: Add New Page */}
      {showNewPageModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-zinc-200 space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <FilePlus className="w-5 h-5 text-amber-700" />
                <h3 className="text-base font-bold text-zinc-950">Add New Website Page</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowNewPageModal(false)}
                className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-zinc-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateNewPage} className="space-y-3.5">
              <FormField
                label="Page Name *"
                value={newPageTitle}
                onChange={(val) => {
                  setNewPageTitle(val);
                  if (!newPageSlug) {
                    setNewPageSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
                  }
                }}
                placeholder="e.g. Services"
              />

              <FormField
                label="Slug / Path *"
                value={newPageSlug}
                onChange={setNewPageSlug}
                placeholder="e.g. services"
              />

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-zinc-700 uppercase tracking-wider font-mono">
                  Initial Status
                </label>
                <select
                  value={newPageStatus}
                  onChange={(e) => setNewPageStatus(e.target.value as any)}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200/90 rounded-xl text-xs text-zinc-900 font-medium"
                >
                  <option value="Published">Published (Live)</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="addNavCheck"
                  checked={addPageToNav}
                  onChange={(e) => setAddPageToNav(e.target.checked)}
                  className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900 cursor-pointer"
                />
                <label htmlFor="addNavCheck" className="text-xs font-semibold text-zinc-700 cursor-pointer">
                  Automatically add this page to Navbar menu
                </label>
              </div>

              <div className="pt-3 border-t border-zinc-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewPageModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-600 hover:bg-zinc-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createPageMutation.isPending}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-zinc-950 hover:bg-zinc-800 transition shadow-xs cursor-pointer"
                >
                  {createPageMutation.isPending ? 'Creating...' : 'Create Page'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* MODAL: Add Section to Custom Page */}
      {showAddSectionModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-zinc-200 space-y-4 max-h-[85vh] flex flex-col"
          >
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 shrink-0">
              <div className="flex items-center gap-2">
                <LayoutTemplate className="w-5 h-5 text-amber-700" />
                <h3 className="text-base font-bold text-zinc-950">Add Section to {customPageTitle}</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddSectionModal(false)}
                className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-zinc-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {SECTION_TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.type}
                  type="button"
                  onClick={() => handleAddSectionToCustomPage(tmpl.type, tmpl.name)}
                  className="w-full p-3.5 rounded-2xl border border-zinc-200/80 hover:border-zinc-900 bg-zinc-50/50 hover:bg-zinc-100/80 text-left transition flex items-center justify-between gap-3 group cursor-pointer"
                >
                  <div>
                    <h4 className="text-xs font-bold text-zinc-900 group-hover:text-amber-800 transition">
                      {tmpl.name}
                    </h4>
                    <p className="text-[11px] text-zinc-500 mt-0.5">{tmpl.description}</p>
                  </div>
                  <Plus className="w-4 h-4 text-zinc-400 group-hover:text-zinc-950 shrink-0" />
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* MODAL: Delete Custom Page Confirmation */}
      {showDeletePageModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-zinc-200 space-y-4"
          >
            <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
              <Trash2 className="w-5 h-5" />
            </div>
            <div className="text-center">
              <h3 className="text-base font-bold text-zinc-950">Delete Page /{activeSectionKey}?</h3>
              <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                This will delete the page and remove its entry from the Navbar.
              </p>
            </div>
            <div className="pt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowDeletePageModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteCustomPage}
                disabled={deletePageMutation.isPending}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
              >
                {deletePageMutation.isPending ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Image Crop Modal */}
      {cropSrc && (
        <ImageCropModal
          imageSrc={cropSrc}
          fileName={cropFileName}
          onCancel={() => {
            setCropSrc(null);
            setCropFieldPath(null);
          }}
          onConfirm={handleCropConfirm}
        />
      )}

      {/* Notification Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <div
              className={`px-4 py-3 rounded-2xl shadow-xl text-xs font-bold flex items-center gap-2 text-white ${notification.type === 'error' ? 'bg-rose-600' : 'bg-zinc-950 border border-zinc-800'
                }`}
            >
              {notification.type === 'error' ? (
                <X className="w-4 h-4 text-white" />
              ) : (
                <Check className="w-4 h-4 text-[#FCD06B]" />
              )}
              <span>{notification.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}

