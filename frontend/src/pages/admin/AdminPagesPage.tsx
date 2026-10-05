import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
  BookOpen,
  Mail,
  PanelBottom,
  AlertTriangle,
  FilePlus,
  LayoutTemplate,
  GripVertical,
} from 'lucide-react';
import { AdminLayout } from '../../widgets';
import { Badge, Spinner } from '../../shared/ui';
import {
  useCmsPages,
  useCmsPage,
  useCreatePage,
  useUpdatePage,
  useDeletePage,
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
  type INavigationItem,
  type ISiteLogo,
} from '../../entities/settings';
import { useUserStore } from '../../entities/user';
import { usePublicPosts } from '../../entities/post';
import { ImageCropModal } from '../../features/post-management/ui/ImageCropModal';
import { HeroSection } from '../public/components/HeroSection';
import { AboutSection } from '../public/components/AboutSection';
import { ServicesSection } from '../public/components/ServicesSection';
import { WhyUsSection } from '../public/components/WhyUsSection';
import { BlogSection } from '../public/components/BlogSection';
import { NotFoundContent } from '../public/components/NotFoundContent';
import { DynamicSectionsRenderer } from '../public/components/DynamicSectionsRenderer';
import { Footer } from '../../widgets/Footer';

type ViewMode = 'list' | 'editor';
type SectionKey = 'navbar' | 'home' | 'about' | 'blog' | 'contact' | 'footer' | '404' | string;
type DeviceMode = 'desktop' | 'tablet' | 'mobile';

interface CmsSectionItem {
  key: SectionKey;
  title: string;
  badge: string;
  targetAnchor: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  isCustomPage?: boolean;
}

const STATIC_CMS_SECTIONS: CmsSectionItem[] = [
  {
    key: 'navbar',
    title: 'Navbar Section',
    badge: '',
    targetAnchor: '#navbar',
    description: 'Logo, navigation items, ordering and navbar configuration across the entire public website.',
    icon: Compass,
  },
  {
    key: 'home',
    title: 'Home Section',
    badge: 'HERO & CAPABILITIES',
    targetAnchor: '#home',
    description: 'Hero headline, highlight word, description copy, action buttons, featured cards, and capability overview.',
    icon: Home,
  },
  {
    key: 'about',
    title: 'About Section',
    badge: 'PHILOSOPHY & PILLARS',
    targetAnchor: '#about',
    description: 'Studio philosophy essay, core pillars, agency capabilities, mission/vision, and guiding values.',
    icon: Info,
  },
  {
    key: 'blog',
    title: 'Blog Section',
    badge: 'PUBLICATIONS FEED',
    targetAnchor: '#blog',
    description: 'Dynamic editorial publication feed, category filters, and published stories management via Posts CMS.',
    icon: BookOpen,
  },
  {
    key: 'contact',
    title: 'Contact Section',
    badge: 'EDITORIAL DESK & INQUIRIES',
    targetAnchor: '#contact',
    description: 'Contact email, working hours, location address, desk response time, and conversation CTA.',
    icon: Mail,
  },
  {
    key: 'footer',
    title: 'Footer Section',
    badge: 'GLOBAL BRANDING & FOOTER',
    targetAnchor: '#footer',
    description: 'Brand summary description, brand logo graphic, navigation menu links, social links, and copyright text.',
    icon: PanelBottom,
  },
  {
    key: '404',
    title: '404 Section',
    badge: 'INVALID ROUTE FALLBACK',
    targetAnchor: '/404',
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

export default function AdminPagesPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useUserStore();
  const isAdmin = user?.role?.toLowerCase() === 'admin';

  // Navigation workflow state
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [activeSectionKey, setActiveSectionKey] = useState<SectionKey>('navbar');

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

  // Queries
  const { data: pages = [], isLoading: isPagesLoading } = useCmsPages();
  const { data: homePageData } = useCmsPage('home');
  const { data: aboutPageData } = useCmsPage('about');
  const { data: notFoundPageData } = useCmsPage('404');
  const { data: activeCustomPageData } = useCmsPage(
    !['navbar', 'home', 'about', 'blog', 'contact', 'footer', '404'].includes(activeSectionKey)
      ? activeSectionKey
      : 'home'
  );
  const { data: siteSettings } = useSiteSettings();
  const { data: posts = [] } = usePublicPosts();

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
    contactEmail: 'contact@editorial.io',
    workingHours: 'Monday – Friday : 08 AM – 06 PM',
    location: 'London · New York · San Francisco',
  });

  // Working state for Footer & Brand Logo
  const [footerData, setFooterData] = useState({
    description: 'A modern publishing platform and digital publication engineered for high-impact content, bold ideas, and seamless storytelling.',
    copyright: '© 2026 Editorial Publishing Platform. All rights reserved.',
    twitterUrl: 'https://twitter.com',
    instagramUrl: 'https://instagram.com',
    linkedinUrl: 'https://linkedin.com',
    githubUrl: 'https://github.com',
  });
  const [settingsNavItems, setSettingsNavItems] = useState<INavigationItem[]>([]);
  const [settingsLogo, setSettingsLogo] = useState<ISiteLogo>({ url: '/logo/logo.png', link: '/', text: 'Editorial' });

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
        setHomeSections(homePageData.sections as HomePageSections);
        if (homePageData.sections.cta) {
          setContactData({
            badgeText: homePageData.sections.cta.badgeText || 'SAY HI TO US',
            heading: homePageData.sections.cta.heading || "LET'S CONNECT",
            description: homePageData.sections.cta.description || '',
            contactEmail: homePageData.sections.cta.contactEmail || 'contact@editorial.io',
            workingHours: homePageData.sections.cta.workingHours || 'Monday – Friday : 08 AM – 06 PM',
            location: homePageData.sections.cta.location || 'London · New York · San Francisco',
          });
        }
      }
      setHomeStatus(homePageData.status || 'Published');
    }
  }, [homePageData]);

  useEffect(() => {
    if (aboutPageData) {
      if (aboutPageData.sections && Object.keys(aboutPageData.sections).length > 0) {
        setAboutSections(aboutPageData.sections as AboutPageSections);
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
      if (siteSettings.navigationItems) setSettingsNavItems(siteSettings.navigationItems);
      if (siteSettings.logo) setSettingsLogo(siteSettings.logo);
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
      !['navbar', 'home', 'about', 'blog', 'contact', 'footer', '404'].includes(activeSectionKey)
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

  // Merge static sections with dynamic custom pages
  const customPageSections: CmsSectionItem[] = pages
    .filter((p: Page) => !['home', 'about', '404', 'contact'].includes(p.slug))
    .map((p: Page) => ({
      key: p.slug,
      title: `${p.title} Page`,
      badge: `CUSTOM PAGE (/${p.slug})`,
      targetAnchor: `/${p.slug}`,
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
  const handleSaveNavbar = async () => {
    try {
      await updateSettingsMutation.mutateAsync({
        logo: settingsLogo,
        navigationItems: settingsNavItems,
        footer: footerData,
      });
      showNotification('Navbar settings & branding saved and published live!');
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
    const nextStatus = targetStatus || homeStatus;
    try {
      await updatePageMutation.mutateAsync({
        slug: 'home',
        title: 'Home Page',
        status: nextStatus,
        sections: {
          ...homeSections,
          cta: {
            ...homeSections.cta,
            ...contactData,
          },
        },
      });
      setHomeStatus(nextStatus);
      showNotification(`Home section saved as ${nextStatus}!`);
    } catch (err: any) {
      showNotification(err?.message || 'Failed to save Home section.', 'error');
    }
  };

  // Save About Section
  const handleSaveAbout = async (targetStatus?: 'Draft' | 'Published') => {
    const nextStatus = targetStatus || aboutStatus;
    try {
      await updatePageMutation.mutateAsync({
        slug: 'about',
        title: 'About Page',
        status: nextStatus,
        sections: aboutSections,
      });
      setAboutStatus(nextStatus);
      showNotification(`About section saved as ${nextStatus}!`);
    } catch (err: any) {
      showNotification(err?.message || 'Failed to save About section.', 'error');
    }
  };

  // Save Contact Section
  const handleSaveContact = async () => {
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
        status: homeStatus,
        sections: updatedHomeSections,
      });
      showNotification('Contact section saved & published live!');
    } catch (err: any) {
      showNotification(err?.message || 'Failed to save Contact section.', 'error');
    }
  };

  // Save Footer & Logo Settings
  const handleSaveFooter = async () => {
    try {
      await updateSettingsMutation.mutateAsync({
        logo: settingsLogo,
        navigationItems: settingsNavItems,
        footer: footerData,
      });
      showNotification('Footer content & branding saved and published live!');
    } catch (err: any) {
      showNotification(err?.message || 'Failed to save Footer settings.', 'error');
    }
  };

  // Save 404 Section
  const handleSaveNotFound = async (targetStatus?: 'Draft' | 'Published') => {
    const nextStatus = targetStatus || notFoundStatus;
    try {
      await updatePageMutation.mutateAsync({
        slug: '404',
        title: '404 Not Found Page',
        status: nextStatus,
        sections: notFoundSections,
      });
      setNotFoundStatus(nextStatus);
      showNotification(`404 page saved as ${nextStatus}!`);
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
          metaTitle: `${newPageTitle.trim()} | Editorial`,
          metaDescription: `Discover ${newPageTitle.trim()} on Editorial publishing platform.`,
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
    const nextStatus = targetStatus || customPageStatus;
    try {
      await updatePageMutation.mutateAsync({
        slug: activeSectionKey,
        title: customPageTitle.trim(),
        status: nextStatus,
        sectionOrder: customSectionOrder,
        sections: customSectionsData,
      });
      setCustomPageStatus(nextStatus);
      showNotification(`Page "${customPageTitle}" saved as ${nextStatus}!`);
    } catch (err: any) {
      showNotification(err?.message || 'Failed to save page.', 'error');
    }
  };

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
    const previewUrl = URL.createObjectURL(croppedFile);

    if (cropFieldPath === 'settings.logo') {
      setSettingsLogo((prev) => ({ ...prev, url: previewUrl }));
    } else if (cropFieldPath === 'home.hero.card1Image') {
      setHomeSections((prev) => ({
        ...prev,
        hero: { ...prev.hero, card1Image: previewUrl },
      }));
    } else if (cropFieldPath === 'home.hero.card2Image') {
      setHomeSections((prev) => ({
        ...prev,
        hero: { ...prev.hero, card2Image: previewUrl },
      }));
    } else if (cropFieldPath === 'home.whyUs.image') {
      setHomeSections((prev) => ({
        ...prev,
        whyUs: { ...prev.whyUs, image: previewUrl },
      }));
    }

    setCropSrc(null);
    setCropFieldPath(null);
    showNotification('Image updated.');
  };

  const currentSectionItem = allCmsSections.find((s) => s.key === activeSectionKey) || allCmsSections[0];
  const isCustomPageActive = !['navbar', 'home', 'about', 'blog', 'contact', 'footer', '404'].includes(activeSectionKey);

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
                  Website Pages &amp; Sections CMS
                </h1>
                <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                  Manage the sections of your public website: Navbar, Home, About, Blog, Contact, Footer, 404 Fallback, and custom pages.
                </p>
              </div>

              <div className="flex items-center gap-3">
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => setShowNewPageModal(true)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold transition shadow-xs cursor-pointer"
                  >
                    <Plus className="w-4 h-4 text-[#FCD06B]" />
                    <span>+ Add New Page</span>
                  </button>
                )}
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
                        ? homeStatus === 'Published'
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
                              <span className="text-xs font-mono text-zinc-400 font-semibold">
                                {section.targetAnchor}
                              </span>
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
                  <span className="text-[10px] font-mono text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-md">
                    {currentSectionItem.targetAnchor}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {activeSectionKey === 'navbar' && (
                  <button
                    type="button"
                    onClick={handleSaveNavbar}
                    disabled={updateSettingsMutation.isPending}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold transition shadow-2xs cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5 text-[#FCD06B]" />
                    <span>Save &amp; Publish Navbar</span>
                  </button>
                )}

                {activeSectionKey === 'home' && (
                  <>
                    <button
                      type="button"
                      disabled={updatePageMutation.isPending}
                      onClick={() => handleSaveHome('Draft')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-700 text-xs font-bold transition cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Draft</span>
                    </button>
                    {isAdmin && (
                      <button
                        type="button"
                        disabled={updatePageMutation.isPending}
                        onClick={() => handleSaveHome(homeStatus === 'Published' ? 'Draft' : 'Published')}
                        className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold transition shadow-2xs cursor-pointer ${
                          homeStatus === 'Published'
                            ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                            : 'bg-[#52B788] text-white hover:bg-emerald-600'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{homeStatus === 'Published' ? 'Unpublish' : 'Publish Section'}</span>
                      </button>
                    )}
                  </>
                )}

                {activeSectionKey === 'about' && (
                  <>
                    <button
                      type="button"
                      disabled={updatePageMutation.isPending}
                      onClick={() => handleSaveAbout('Draft')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-700 text-xs font-bold transition cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Draft</span>
                    </button>
                    {isAdmin && (
                      <button
                        type="button"
                        disabled={updatePageMutation.isPending}
                        onClick={() => handleSaveAbout(aboutStatus === 'Published' ? 'Draft' : 'Published')}
                        className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold transition shadow-2xs cursor-pointer ${
                          aboutStatus === 'Published'
                            ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                            : 'bg-[#52B788] text-white hover:bg-emerald-600'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{aboutStatus === 'Published' ? 'Unpublish' : 'Publish Section'}</span>
                      </button>
                    )}
                  </>
                )}

                {activeSectionKey === 'blog' && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => navigate('/admin/posts/create')}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold transition shadow-2xs cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#FCD06B]" />
                      <span>+ New Article</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate('/admin/posts')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-700 text-xs font-bold transition cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Manage All Posts</span>
                    </button>
                  </div>
                )}

                {activeSectionKey === 'contact' && (
                  <button
                    type="button"
                    onClick={handleSaveContact}
                    disabled={updatePageMutation.isPending}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold transition shadow-2xs cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5 text-[#FCD06B]" />
                    <span>Save &amp; Publish Contact</span>
                  </button>
                )}

                {activeSectionKey === 'footer' && (
                  <button
                    type="button"
                    onClick={handleSaveFooter}
                    disabled={updateSettingsMutation.isPending}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold transition shadow-2xs cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5 text-[#FCD06B]" />
                    <span>Save &amp; Publish Footer</span>
                  </button>
                )}

                {activeSectionKey === '404' && (
                  <button
                    type="button"
                    onClick={() => handleSaveNotFound(notFoundStatus === 'Published' ? 'Draft' : 'Published')}
                    disabled={updatePageMutation.isPending}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold transition shadow-2xs cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5 text-[#FCD06B]" />
                    <span>Save &amp; Publish 404 Page</span>
                  </button>
                )}

                {isCustomPageActive && (
                  <>
                    <button
                      type="button"
                      disabled={updatePageMutation.isPending}
                      onClick={() => handleSaveCustomPage('Draft')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-700 text-xs font-bold transition cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Draft</span>
                    </button>
                    {isAdmin && (
                      <button
                        type="button"
                        disabled={updatePageMutation.isPending}
                        onClick={() => handleSaveCustomPage(customPageStatus === 'Published' ? 'Draft' : 'Published')}
                        className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold transition shadow-2xs cursor-pointer ${
                          customPageStatus === 'Published'
                            ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                            : 'bg-[#52B788] text-white hover:bg-emerald-600'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{customPageStatus === 'Published' ? 'Unpublish' : 'Publish Page'}</span>
                      </button>
                    )}
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
                  <span className="text-[11px] font-bold text-zinc-800 font-mono">
                    {currentSectionItem.targetAnchor}
                  </span>
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
                            {settingsLogo.url ? (
                              <img
                                src={settingsLogo.url}
                                alt={settingsLogo.text || 'Brand Logo'}
                                className="max-h-full max-w-full object-contain"
                              />
                            ) : (
                              <span className="text-[10px] font-mono text-zinc-400">No logo</span>
                            )}
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

                            {settingsLogo.url && (
                              <button
                                type="button"
                                onClick={() => setSettingsLogo((prev) => ({ ...prev, url: '' }))}
                                className="px-3 py-1.5 rounded-xl border border-zinc-200 hover:bg-zinc-100 text-zinc-600 text-xs font-semibold transition"
                              >
                                Remove Logo
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <FormField
                            label="Brand / Alt Text"
                            value={settingsLogo.text || ''}
                            onChange={(val) => setSettingsLogo((prev) => ({ ...prev, text: val }))}
                            placeholder="e.g. Editorial"
                          />
                          <FormField
                            label="Logo Link URL"
                            value={settingsLogo.link || '/'}
                            onChange={(val) => setSettingsLogo((prev) => ({ ...prev, link: val }))}
                            placeholder="/"
                          />
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
                          placeholder="Explore Stories"
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
                          placeholder="#blog"
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

                      {/* Featured Card Images */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-zinc-100">
                        <ImagePickerField
                          label="Hero Card 1 Image"
                          value={homeSections.hero.card1Image || ''}
                          onChange={(url) =>
                            setHomeSections((prev) => ({
                              ...prev,
                              hero: { ...prev.hero, card1Image: url },
                            }))
                          }
                          onUploadClick={(e) => handleImageFileSelect(e, 'home.hero.card1Image')}
                        />
                        <ImagePickerField
                          label="Hero Card 2 Image"
                          value={homeSections.hero.card2Image || ''}
                          onChange={(url) =>
                            setHomeSections((prev) => ({
                              ...prev,
                              hero: { ...prev.hero, card2Image: url },
                            }))
                          }
                          onUploadClick={(e) => handleImageFileSelect(e, 'home.hero.card2Image')}
                        />
                      </div>

                      {/* Service Overview fields */}
                      <div className="pt-3 border-t border-zinc-100 space-y-3">
                        <span className="text-xs font-bold text-zinc-900 block">Capabilities &amp; Services Block</span>
                        <FormField
                          label="Services Heading"
                          value={homeSections.services.heading || ''}
                          onChange={(val) =>
                            setHomeSections((prev) => ({
                              ...prev,
                              services: { ...prev.services, heading: val },
                            }))
                          }
                        />
                        <FormTextarea
                          label="Services Description"
                          value={homeSections.services.description || ''}
                          onChange={(val) =>
                            setHomeSections((prev) => ({
                              ...prev,
                              services: { ...prev.services, description: val },
                            }))
                          }
                        />
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

                      {/* Philosophy Essay */}
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
                      </div>
                    </div>
                  )}

                  {/* 4. BLOG SECTION MANAGEMENT */}
                  {activeSectionKey === 'blog' && (
                    <div className="space-y-4">
                      {/* Action Header Card */}
                      <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200/80 space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-xs font-bold text-zinc-900 block">Article Management</span>
                            <span className="text-[11px] text-zinc-400">Create, edit and publish blog stories</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => navigate('/admin/posts/create')}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold transition shadow-2xs cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5 text-[#FCD06B]" />
                            <span>New Article</span>
                          </button>
                        </div>
                      </div>

                      {/* Current Articles List */}
                      <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-zinc-900">Articles in CMS</span>
                          <span className="text-xs font-mono font-bold bg-zinc-200 px-2 py-0.5 rounded-md">
                            {posts.length} Stories
                          </span>
                        </div>

                        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                          {posts.map((post) => (
                            <div
                              key={post.id || post._id}
                              className="p-3 bg-white rounded-xl border border-zinc-200/90 flex items-center justify-between gap-3 hover:border-zinc-400 transition"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                {post.imageUrl ? (
                                  <img
                                    src={post.imageUrl}
                                    alt=""
                                    className="w-10 h-10 rounded-lg object-cover bg-zinc-100 shrink-0 border border-zinc-200"
                                  />
                                ) : (
                                  <div className="w-10 h-10 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-400 text-[10px] shrink-0 font-mono">
                                    No img
                                  </div>
                                )}
                                <div className="min-w-0">
                                  <h5 className="text-xs font-bold text-zinc-900 truncate">{post.title}</h5>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-[10px] text-zinc-400 font-mono">
                                      {post.category || 'Article'}
                                    </span>
                                    <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded font-mono ${
                                      post.status === 'Published'
                                        ? 'bg-emerald-50 text-emerald-700'
                                        : 'bg-amber-50 text-amber-700'
                                    }`}>
                                      {post.status || 'Draft'}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => navigate(`/admin/posts/edit/${post.id || post._id}`)}
                                  className="px-2.5 py-1 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-[11px] font-bold transition cursor-pointer"
                                >
                                  Edit
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Link to Full Posts CMS */}
                      <button
                        type="button"
                        onClick={() => navigate('/admin/posts')}
                        className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-800 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                      >
                        <BookOpen className="w-4 h-4 text-amber-700" />
                        <span>Open Full Posts Manager</span>
                      </button>
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
                        placeholder="contact@editorial.io"
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
                        placeholder="© 2026 Editorial. All rights reserved."
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
                                className={`p-3 rounded-xl border flex items-center justify-between gap-2 cursor-pointer transition ${
                                  isSelected
                                    ? 'bg-zinc-950 text-white border-zinc-950 shadow-xs'
                                    : 'bg-zinc-50 text-zinc-800 border-zinc-200 hover:bg-zinc-100'
                                }`}
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <span
                                    className={`w-1.5 h-1.5 rounded-full ${
                                      isSelected ? 'bg-[#FCD06B]' : 'bg-emerald-500'
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
                                    className="p-1 disabled:opacity-20 hover:bg-white/20 rounded"
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
                                    className="p-1 disabled:opacity-20 hover:bg-white/20 rounded"
                                  >
                                    <ArrowDown className="w-3 h-3" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setCustomSectionOrder((prev) =>
                                        prev.filter((s) => s.id !== sec.id)
                                      );
                                    }}
                                    className="p-1 hover:bg-white/20 rounded text-rose-400"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
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
                            Edit Selected Section Content
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
                            rows={4}
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
                    <span className="hidden xl:inline text-[10px] font-mono text-zinc-400 bg-zinc-100 px-1.5 py-0.5 rounded">
                      Live Synced DOM
                    </span>
                  </div>

                  {/* Device mode switcher */}
                  <div className="flex items-center bg-zinc-100 p-0.5 rounded-xl border border-zinc-200/80">
                    <button
                      type="button"
                      onClick={() => {
                        setDeviceMode('desktop');
                        setMobileDrawerOpen(false);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer ${
                        deviceMode === 'desktop' ? 'bg-white text-zinc-950 shadow-2xs' : 'text-zinc-500 hover:text-zinc-900'
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
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer ${
                        deviceMode === 'tablet' ? 'bg-white text-zinc-950 shadow-2xs' : 'text-zinc-500 hover:text-zinc-900'
                      }`}
                    >
                      <Tablet className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Tablet</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeviceMode('mobile')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer ${
                        deviceMode === 'mobile' ? 'bg-white text-zinc-950 shadow-2xs' : 'text-zinc-500 hover:text-zinc-900'
                      }`}
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Mobile</span>
                    </button>
                  </div>
                </div>

                {/* Canvas Frame Container */}
                <div className="flex-1 flex justify-center items-stretch overflow-y-auto overflow-x-hidden min-h-0 relative">
                  <div
                    className={`bg-white rounded-2xl shadow-md border border-zinc-200/90 overflow-y-auto overflow-x-hidden transition-all duration-300 w-full flex flex-col relative ${
                      deviceMode === 'tablet'
                        ? 'max-w-[768px]'
                        : deviceMode === 'mobile'
                        ? 'max-w-[390px]'
                        : 'max-w-full'
                    }`}
                  >
                    {/* Live Navbar Header Simulation */}
                    <header className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-md border-b border-zinc-100 px-4 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {settingsLogo.url ? (
                          <img
                            src={settingsLogo.url}
                            alt={settingsLogo.text || 'Logo'}
                            className="h-6 sm:h-7 w-auto object-contain"
                          />
                        ) : (
                          <span className="text-sm font-bold text-zinc-900 font-['Plus_Jakarta_Sans']">
                            {settingsLogo.text || 'Editorial'}
                          </span>
                        )}
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
                                  className={`transition cursor-pointer ${
                                    isNavActive
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

                    {/* Mobile Slide-in Drawer in Simulator */}
                    <AnimatePresence>
                      {deviceMode === 'mobile' && mobileDrawerOpen && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 z-40 bg-black/40 backdrop-blur-xs flex"
                          onClick={() => setMobileDrawerOpen(false)}
                        >
                          <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-[280px] h-full bg-white shadow-2xl p-5 flex flex-col justify-between"
                          >
                            <div className="space-y-6">
                              <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
                                <span className="text-sm font-bold text-zinc-900">{settingsLogo.text || 'Editorial'}</span>
                                <button
                                  type="button"
                                  onClick={() => setMobileDrawerOpen(false)}
                                  className="p-1 rounded-lg hover:bg-zinc-100 text-zinc-500"
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
                      {activeSectionKey === 'navbar' && (
                        <div className="w-full flex flex-col">
                          <HeroSection content={homeSections.hero} />
                          <ServicesSection content={homeSections.services} />
                          <WhyUsSection content={homeSections.whyUs} />
                          <AboutSection content={aboutSections} />
                          <BlogSection posts={posts} />
                          <Footer
                            content={{
                              ...homeSections.cta,
                              ...contactData,
                            }}
                            showContactSection={true}
                          />
                        </div>
                      )}

                      {activeSectionKey === 'home' && (
                        <div className="w-full flex flex-col">
                          <HeroSection content={homeSections.hero} />
                          <ServicesSection content={homeSections.services} />
                          <WhyUsSection content={homeSections.whyUs} />
                        </div>
                      )}

                      {activeSectionKey === 'about' && (
                        <div className="w-full flex flex-col">
                          <AboutSection content={aboutSections} />
                        </div>
                      )}

                      {activeSectionKey === 'blog' && (
                        <div className="w-full flex flex-col">
                          <BlogSection posts={posts} />
                        </div>
                      )}

                      {activeSectionKey === 'contact' && (
                        <div className="w-full flex flex-col">
                          <Footer
                            content={{
                              ...homeSections.cta,
                              ...contactData,
                            }}
                            showContactSection={true}
                          />
                        </div>
                      )}

                      {activeSectionKey === 'footer' && (
                        <div className="w-full flex flex-col">
                          <Footer
                            content={{
                              ...homeSections.cta,
                              ...contactData,
                            }}
                            showContactSection={false}
                          />
                        </div>
                      )}

                      {activeSectionKey === '404' && (
                        <div className="w-full flex flex-col">
                          <NotFoundContent
                            content={notFoundSections.general}
                            isInsidePreview={true}
                          />
                        </div>
                      )}

                      {isCustomPageActive && (
                        <div className="w-full flex flex-col">
                          <DynamicSectionsRenderer
                            sectionOrder={customSectionOrder}
                            sections={customSectionsData}
                            posts={posts}
                            isInsidePreview={true}
                          />
                          <Footer content={DEFAULT_HOME_SECTIONS.cta} showContactSection={true} />
                        </div>
                      )}
                    </main>
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
                  className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
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
                  className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
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
                className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-zinc-800"
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
              className={`px-4 py-3 rounded-2xl shadow-xl text-xs font-bold flex items-center gap-2 text-white ${
                notification.type === 'error' ? 'bg-rose-600' : 'bg-zinc-950 border border-zinc-800'
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

// ---------------------------------------------------------------------------
// Reusable Form Components
// ---------------------------------------------------------------------------

function FormField({
  label,
  value,
  onChange,
  placeholder,
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-1">
      <label className="text-[11px] font-bold text-zinc-700 uppercase tracking-wider font-mono">
        {label}
      </label>
      <input
        type="text"
        disabled={disabled}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200/90 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-zinc-950 focus:bg-white transition disabled:opacity-50 font-medium shadow-2xs"
      />
    </div>
  );
}

function FormTextarea({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <div className="space-y-1">
      <label className="text-[11px] font-bold text-zinc-700 uppercase tracking-wider font-mono">
        {label}
      </label>
      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200/90 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-zinc-950 focus:bg-white transition font-medium shadow-2xs resize-none"
      />
    </div>
  );
}

function ImagePickerField({
  label,
  value,
  onChange,
  onUploadClick,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  onUploadClick: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-bold text-zinc-700 uppercase tracking-wider font-mono">
        {label}
      </label>
      <div className="flex items-center gap-3">
        {value ? (
          <div className="w-14 h-14 rounded-xl border border-zinc-200 overflow-hidden bg-zinc-100 shrink-0">
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="w-14 h-14 rounded-xl border border-dashed border-zinc-300 flex items-center justify-center text-zinc-400 text-[10px] shrink-0 font-mono">
            No image
          </div>
        )}

        <div className="flex-1 space-y-1.5">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="/uploads/graphic.jpg or URL"
            className="w-full px-2.5 py-1.5 bg-zinc-50 border border-zinc-200 rounded-lg text-xs text-zinc-900 focus:outline-none focus:border-zinc-950"
          />
          <label className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-[11px] font-bold cursor-pointer transition">
            <Upload className="w-3 h-3" />
            <span>Upload Image</span>
            <input type="file" accept="image/*" onChange={onUploadClick} className="hidden" />
          </label>
        </div>
      </div>
    </div>
  );
}
