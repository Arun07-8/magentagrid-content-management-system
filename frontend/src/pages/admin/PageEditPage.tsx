import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Check,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Sparkles,
  AlertTriangle,
  Layers,
  Monitor,
  Tablet,
  Smartphone,
  Eye,
  EyeOff,
  Columns,
  ListOrdered,
  Save,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { AdminLayout } from '../../widgets';
import {
  Badge,
  Spinner,
  ImageCropModal,
  FormInput as FormField,
  FormTextarea,
  ImagePickerField,
  SectionAccordion,
} from '../../shared/ui';
import {
  useCmsPage,
  useUpdatePage,
  usePublishPage,
  useUnpublishPage,
  DEFAULT_HOME_SECTIONS,
  DEFAULT_ABOUT_SECTIONS,
  DEFAULT_NOT_FOUND_SECTIONS,
  type HomePageSections,
  type AboutPageSections,
  type NotFoundPageSections,
} from '../../entities/page';
import { useAuth } from '../../app/context/AuthContext';
import { HeroSection } from '../public/components/HeroSection';
import { AboutSection } from '../public/components/AboutSection';
import { ServicesSection } from '../public/components/ServicesSection';
import { WhyUsSection } from '../public/components/WhyUsSection';
import { ProcessSection } from '../public/components/ProcessSection';
import { TestimonialsSection } from '../public/components/TestimonialsSection';
import { NotFoundContent } from '../public/components/NotFoundContent';
import { Footer } from '../../widgets/Footer';

type ViewMode = 'tree' | 'split' | 'preview';
type DeviceMode = 'desktop' | 'tablet' | 'mobile';

export default function PageEditPage() {
  const { slug = 'home' } = useParams<{ slug: string }>();
  const is404 = slug === '404' || slug === 'not-found';
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role?.toLowerCase() === 'admin';

  const { data: page, isLoading } = useCmsPage(slug);
  const updateMutation = useUpdatePage();
  const publishMutation = usePublishPage();
  const unpublishMutation = useUnpublishPage();

  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop');

  // Working state for Home, About, and 404 sections
  const [homeState, setHomeState] = useState<HomePageSections>(DEFAULT_HOME_SECTIONS);
  const [aboutState, setAboutState] = useState<AboutPageSections>(DEFAULT_ABOUT_SECTIONS);
  const [notFoundState, setNotFoundState] = useState<NotFoundPageSections>(DEFAULT_NOT_FOUND_SECTIONS);
  const [pageStatus, setPageStatus] = useState<'Draft' | 'Published'>('Published');
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const editPreviewScrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll the live preview in PageEditPage
  useEffect(() => {
    if (!activeSection) return;
    const SECTION_ID_MAP: Record<string, string> = {
      hero: 'home',
      about: 'about',
      services: 'services',
      whyUs: 'why-us',
      process: 'process',
      testimonials: 'testimonials',
      cta: 'contact',
      header: 'about',
      philosophy: 'about',
      values: 'about',
      team: 'about',
    };
    const targetId = SECTION_ID_MAP[activeSection] || activeSection;
    const timer = setTimeout(() => {
      if (editPreviewScrollRef.current) {
        if (activeSection === 'hero') {
          editPreviewScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          const el = editPreviewScrollRef.current.querySelector(`#${targetId}`) as HTMLElement | null;
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      }
    }, 150);
    return () => clearTimeout(timer);
  }, [activeSection, viewMode, deviceMode]);

  // Crop modal state
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [cropFieldPath, setCropFieldPath] = useState<string | null>(null);
  const [cropFileName, setCropFileName] = useState<string>('image.jpg');

  // Success / notification toast
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (page?.sections) {
      if (slug === 'home') {
        setHomeState({ ...DEFAULT_HOME_SECTIONS, ...(page.sections as HomePageSections) });
      } else if (slug === 'about') {
        const sec = page.sections as any;
        setAboutState({
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
        });
      } else if (is404) {
        setNotFoundState({ ...DEFAULT_NOT_FOUND_SECTIONS, ...(page.sections as NotFoundPageSections) });
      }
      setPageStatus(page.status || 'Published');
    }
  }, [page, slug, is404]);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3500);
  };

  // Compute issue count / validation warnings
  const issues = useMemo(() => {
    const list: string[] = [];
    if (slug === 'home') {
      if (!homeState.hero?.heading) list.push('Hero section is missing a main heading');
      if (!homeState.hero?.description) list.push('Hero section is missing a description');
      if (!homeState.services?.heading) list.push('Services section is missing a heading');
      if (!homeState.whyUs?.heading) list.push('Why Choose Us section is missing a heading');
    } else if (slug === 'about') {
      if (!aboutState.header?.heading) list.push('About header is missing a main heading');
      if (!aboutState.philosophy?.heading) list.push('Philosophy section is missing a heading');
    } else if (is404) {
      if (!notFoundState.general?.heading) list.push('404 heading is missing');
      if (!notFoundState.general?.badgeCode) list.push('404 badge code is missing');
    }
    return list;
  }, [slug, is404, homeState, aboutState, notFoundState]);

  // Save changes handler
  const handleSave = async (statusOverride?: 'Draft' | 'Published') => {
    const sectionsToSave = slug === 'home' ? homeState : is404 ? notFoundState : aboutState;
    const finalStatus = !isAdmin ? 'Draft' : (statusOverride || pageStatus);
    try {
      await updateMutation.mutateAsync({
        slug,
        title: page?.title || (slug === 'home' ? 'Home Page' : is404 ? '404 Not Found Page' : 'About Page'),
        status: finalStatus,
        sections: sectionsToSave,
      });
      setPageStatus(finalStatus);
      showNotification(
        finalStatus === 'Published'
          ? 'Page published successfully! Public site updated in real time.'
          : 'Draft saved successfully.'
      );
    } catch (err: any) {
      showNotification(err?.message || 'Failed to save page changes', 'error');
    }
  };

  const handleTogglePublish = async () => {
    if (!isAdmin) {
      showNotification('Publishing actions are restricted to Administrators.', 'error');
      return;
    }
    if (pageStatus === 'Published') {
      await unpublishMutation.mutateAsync(slug);
      setPageStatus('Draft');
      showNotification('Page unpublished. Now set to Draft mode.');
    } else {
      await handleSave('Published');
    }
  };

  // Image cropping confirmation
  const handleCropConfirm = (croppedFile: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      if (cropFieldPath) {
        if (slug === 'home') {
          setHomeState((prev) => {
            const next = { ...prev };
            if (cropFieldPath === 'hero.card1Image') next.hero.card1Image = dataUrl;
            if (cropFieldPath === 'hero.card2Image') next.hero.card2Image = dataUrl;
            if (cropFieldPath === 'whyUs.image') next.whyUs.image = dataUrl;
            if (cropFieldPath.startsWith('hero.readersAvatars.')) {
              const idx = parseInt(cropFieldPath.replace('hero.readersAvatars.', ''), 10);
              const avatars = [...(next.hero.readersAvatars || DEFAULT_HOME_SECTIONS.hero.readersAvatars || [])];
              avatars[idx] = dataUrl;
              next.hero.readersAvatars = avatars;
            }
            return next;
          });
        } else if (slug === 'about') {
          setAboutState((prev) => {
            const next = { ...prev };
            if (cropFieldPath === 'about.header.image') {
              next.header = { ...next.header, image: dataUrl };
            }
            if (cropFieldPath === 'about.philosophy.image') {
              next.philosophy = { ...next.philosophy, image: dataUrl };
            }
            return next;
          });
        }
      }
      setCropSrc(null);
      setCropFieldPath(null);
    };
    reader.readAsDataURL(croppedFile);
  };

  const handleImageFileSelect = (e: React.ChangeEvent<HTMLInputElement>, fieldPath: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCropSrc(reader.result as string);
        setCropFileName(file.name);
        setCropFieldPath(fieldPath);
      };
      reader.readAsDataURL(file);
    }
  };

  const pageTitle = page?.title || (slug === 'home' ? 'Home' : 'About');

  if (isLoading) {
    return (
      <AdminLayout currentTab="pages-edit" showSearch={false}>
        <div className="w-full h-full flex items-center justify-center min-h-[400px]">
          <Spinner text={`Loading visual editor for ${slug}...`} />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout currentTab="pages-edit" showSearch={false}>
      <div className="w-full h-full flex flex-col min-h-0 gap-4">

        {/* Top Sticky Header & Control Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-[28px] border-2 border-zinc-200 shadow-[0_12px_40px_rgba(0,0,0,0.08),0_4px_12px_rgba(0,0,0,0.04)] flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">

          {/* Left: Back + Title + Status */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/admin/pages')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-zinc-600 bg-zinc-100 hover:bg-zinc-200 hover:text-zinc-900 rounded-full transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Pages</span>
            </button>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-zinc-950 font-['Plus_Jakarta_Sans']">
                  {pageTitle} (Page CMS)
                </h1>
                <Badge variant={pageStatus === 'Published' ? 'success' : 'neutral'}>
                  {pageStatus.toUpperCase()}
                </Badge>
              </div>
              <span className="text-[11px] font-mono text-zinc-400">
                slug: /{slug === 'home' ? '' : slug}
              </span>
            </div>
          </div>

          {/* Center: View Mode Switcher + Device Toggle (if preview/split) */}
          <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
            <div className="flex items-center bg-[#F1F3F7] p-1 rounded-2xl border border-zinc-200/70">
              <button
                type="button"
                onClick={() => setViewMode('tree')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${viewMode === 'tree' ? 'bg-white text-zinc-950 shadow-2xs' : 'text-zinc-500 hover:text-zinc-900'
                  }`}
                title="Structured Content Tree View"
              >
                <ListOrdered className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Tree Editor</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('split')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${viewMode === 'split' ? 'bg-white text-zinc-950 shadow-2xs' : 'text-zinc-500 hover:text-zinc-900'
                  }`}
                title="Split Editor & Live Preview"
              >
                <Columns className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Split View</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('preview')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${viewMode === 'preview' ? 'bg-white text-zinc-950 shadow-2xs' : 'text-zinc-500 hover:text-zinc-900'
                  }`}
                title="Full Live Public Preview"
              >
                <Eye className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Live Preview</span>
              </button>
            </div>

            {/* Device Mode Toggle */}
            {viewMode !== 'tree' && (
              <div className="hidden lg:flex items-center bg-[#F1F3F7] p-1 rounded-2xl border border-zinc-200/70">
                <button
                  type="button"
                  onClick={() => setDeviceMode('desktop')}
                  className={`p-1.5 rounded-xl text-xs transition cursor-pointer ${deviceMode === 'desktop' ? 'bg-white text-zinc-900 shadow-2xs' : 'text-zinc-400 hover:text-zinc-800'
                    }`}
                  title="Desktop View (~1280px)"
                >
                  <Monitor className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeviceMode('tablet')}
                  className={`p-1.5 rounded-xl text-xs transition cursor-pointer ${deviceMode === 'tablet' ? 'bg-white text-zinc-900 shadow-2xs' : 'text-zinc-400 hover:text-zinc-800'
                    }`}
                  title="Tablet View (~768px)"
                >
                  <Tablet className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeviceMode('mobile')}
                  className={`p-1.5 rounded-xl text-xs transition cursor-pointer ${deviceMode === 'mobile' ? 'bg-white text-zinc-900 shadow-2xs' : 'text-zinc-400 hover:text-zinc-800'
                    }`}
                  title="Mobile View (~390px)"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Right: Actions (Save Draft, Publish) */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            <button
              type="button"
              disabled={updateMutation.isPending}
              onClick={() => handleSave('Draft')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold text-zinc-700 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 transition cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Draft</span>
            </button>

            {isAdmin && (
              <button
                type="button"
                disabled={updateMutation.isPending || publishMutation.isPending}
                onClick={handleTogglePublish}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold transition shadow-sm cursor-pointer ${pageStatus === 'Published'
                    ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                    : 'bg-[#52B788] text-white hover:bg-emerald-600'
                  }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{pageStatus === 'Published' ? 'Unpublish' : 'Publish Changes'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Validation Bar (Inspired by Reference UI: "X issues require attention") */}
        {issues.length > 0 ? (
          <div className="bg-amber-50 border border-amber-200/80 px-4 py-2.5 rounded-2xl flex items-center justify-between gap-3 text-xs text-amber-900 font-medium shrink-0">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>{issues.length} {issues.length === 1 ? 'issue requires' : 'issues require'} attention: {issues.join(' · ')}</span>
            </div>
            <span className="text-[11px] font-mono text-amber-700">DRAFT</span>
          </div>
        ) : (
          <div className="bg-emerald-50/70 border border-emerald-200/70 px-4 py-2 rounded-2xl flex items-center justify-between gap-3 text-xs text-emerald-900 font-medium shrink-0">
            <div className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              <span>All structured sections validated and ready for real-time publishing.</span>
            </div>
            <span className="text-[11px] font-mono text-emerald-700">READY</span>
          </div>
        )}

        {/* Toast Notification */}
        {notification && (
          <div
            className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-xl border text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 ${notification.type === 'success'
                ? 'bg-zinc-950 text-white border-zinc-800'
                : 'bg-rose-600 text-white border-rose-700'
              }`}
          >
            <Sparkles className="w-4 h-4 text-[#FCD06B]" />
            <span>{notification.message}</span>
          </div>
        )}

        {/* MAIN CONTENT AREA: Render based on viewMode */}
        <div className="flex-1 flex gap-5 min-h-0 overflow-hidden">

          {/* 1. Hierarchical Structured Tree Editor */}
          {(viewMode === 'tree' || viewMode === 'split') && (
            <div
              className={`flex-1 flex flex-col bg-white rounded-[28px] border-2 border-zinc-200 shadow-[0_12px_40px_rgba(0,0,0,0.08),0_4px_12px_rgba(0,0,0,0.04)] overflow-y-auto p-5 sm:p-6 min-h-0 ${viewMode === 'split' ? 'lg:max-w-[48%] xl:max-w-[45%]' : 'w-full'
                }`}
            >
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-100">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-500 font-mono">
                  <Layers className="w-3.5 h-3.5 text-amber-500" />
                  <span>STRUCTURED PAGE TREE</span>
                </div>
                <span className="text-[11px] text-zinc-400">Click section to configure</span>
              </div>

              {/* Sections Tree List */}
              <div className="space-y-3">
                {slug === 'home' && (
                  <>
                    {/* SECTION: Hero */}
                    <SectionAccordion
                      title="Hero Section"
                      subtitle="Top editorial headline, highlight word, CTAs, and card images"
                      isOpen={activeSection === 'hero' || !activeSection}
                      onToggle={() => setActiveSection(activeSection === 'hero' ? null : 'hero')}
                    >
                      <div className="space-y-4 pt-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <FormField
                            label="Badge Text"
                            value={homeState.hero.badgeText}
                            onChange={(val) => setHomeState({ ...homeState, hero: { ...homeState.hero, badgeText: val } })}
                            placeholder="e.g. Modern Editorial CMS"
                          />
                          <FormField
                            label="Highlight Keyword"
                            value={homeState.hero.highlightWord}
                            onChange={(val) => setHomeState({ ...homeState, hero: { ...homeState.hero, highlightWord: val } })}
                            placeholder="e.g. Problems"
                          />
                        </div>

                        <FormField
                          label="Main Headline"
                          value={homeState.hero.heading}
                          onChange={(val) => setHomeState({ ...homeState, hero: { ...homeState.hero, heading: val } })}
                          placeholder="e.g. We Solve Problems Through Design"
                        />

                        <FormTextarea
                          label="Description / Supporting Copy"
                          value={homeState.hero.description}
                          onChange={(val) => setHomeState({ ...homeState, hero: { ...homeState.hero, description: val } })}
                          placeholder="A purpose-built digital publishing platform..."
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <FormField
                            label="Primary Button Text"
                            value={homeState.hero.primaryButtonText}
                            onChange={(val) => setHomeState({ ...homeState, hero: { ...homeState.hero, primaryButtonText: val } })}
                            placeholder="Explore Stories"
                          />
                          <FormField
                            label="Primary Button Link"
                            value={homeState.hero.primaryButtonLink}
                            onChange={(val) => setHomeState({ ...homeState, hero: { ...homeState.hero, primaryButtonLink: val } })}
                            placeholder="#blog"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <FormField
                            label="Secondary Button Text"
                            value={homeState.hero.secondaryButtonText}
                            onChange={(val) => setHomeState({ ...homeState, hero: { ...homeState.hero, secondaryButtonText: val } })}
                            placeholder="About Studio"
                          />
                          <FormField
                            label="Secondary Button Link"
                            value={homeState.hero.secondaryButtonLink}
                            onChange={(val) => setHomeState({ ...homeState, hero: { ...homeState.hero, secondaryButtonLink: val } })}
                            placeholder="about"
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
                                setHomeState((prev) => ({
                                  ...prev,
                                  hero: {
                                    ...prev.hero,
                                    showReadersStats: prev.hero.showReadersStats === false ? true : false,
                                  },
                                }))
                              }
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                                homeState.hero.showReadersStats !== false
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-zinc-200 text-zinc-600'
                              }`}
                            >
                              {homeState.hero.showReadersStats !== false ? (
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
                              value={homeState.hero.readersCount || ''}
                              onChange={(val) =>
                                setHomeState({
                                  ...homeState,
                                  hero: { ...homeState.hero, readersCount: val },
                                })
                              }
                              placeholder="e.g. 2.5M+ or 5.8M+"
                            />
                            <FormField
                              label="Statistic Label"
                              value={homeState.hero.readersLabel || ''}
                              onChange={(val) =>
                                setHomeState({
                                  ...homeState,
                                  hero: { ...homeState.hero, readersLabel: val },
                                })
                              }
                              placeholder="e.g. ACTIVE READERS"
                            />
                            <FormField
                              label="Final Badge Count"
                              value={homeState.hero.readersBadgeText ?? '+10k'}
                              onChange={(val) =>
                                setHomeState({
                                  ...homeState,
                                  hero: { ...homeState.hero, readersBadgeText: val },
                                })
                              }
                              placeholder="e.g. +10k or +25k"
                            />
                          </div>

                          {/* Profile / Avatar Images List */}
                          <div className="space-y-3 pt-2 border-t border-zinc-200/60">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold text-zinc-700 uppercase tracking-wider font-mono">
                                Avatar Profiles ({(homeState.hero.readersAvatars || DEFAULT_HOME_SECTIONS.hero.readersAvatars || []).length})
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  const currentAvatars = [
                                    ...(homeState.hero.readersAvatars ||
                                      DEFAULT_HOME_SECTIONS.hero.readersAvatars ||
                                      []),
                                  ];
                                  currentAvatars.push(
                                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'
                                  );
                                  setHomeState({
                                    ...homeState,
                                    hero: { ...homeState.hero, readersAvatars: currentAvatars },
                                  });
                                }}
                                className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-[11px] font-bold cursor-pointer transition"
                              >
                                <Plus className="w-3 h-3" />
                                <span>Add Avatar</span>
                              </button>
                            </div>

                            <div className="space-y-2.5">
                              {(
                                homeState.hero.readersAvatars ||
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
                                        ...(homeState.hero.readersAvatars ||
                                          DEFAULT_HOME_SECTIONS.hero.readersAvatars ||
                                          []),
                                      ];
                                      next[aIdx] = e.target.value;
                                      setHomeState({
                                        ...homeState,
                                        hero: { ...homeState.hero, readersAvatars: next },
                                      });
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
                                        handleImageFileSelect(e, `hero.readersAvatars.${aIdx}`)
                                      }
                                      className="hidden"
                                    />
                                  </label>
                                  <button
                                    type="button"
                                    disabled={aIdx === 0}
                                    onClick={() => {
                                      const next = [
                                        ...(homeState.hero.readersAvatars ||
                                          DEFAULT_HOME_SECTIONS.hero.readersAvatars ||
                                          []),
                                      ];
                                      const temp = next[aIdx - 1];
                                      next[aIdx - 1] = next[aIdx];
                                      next[aIdx] = temp;
                                      setHomeState({
                                        ...homeState,
                                        hero: { ...homeState.hero, readersAvatars: next },
                                      });
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
                                      (homeState.hero.readersAvatars ||
                                        DEFAULT_HOME_SECTIONS.hero.readersAvatars ||
                                        []).length -
                                        1
                                    }
                                    onClick={() => {
                                      const next = [
                                        ...(homeState.hero.readersAvatars ||
                                          DEFAULT_HOME_SECTIONS.hero.readersAvatars ||
                                          []),
                                      ];
                                      const temp = next[aIdx + 1];
                                      next[aIdx + 1] = next[aIdx];
                                      next[aIdx] = temp;
                                      setHomeState({
                                        ...homeState,
                                        hero: { ...homeState.hero, readersAvatars: next },
                                      });
                                    }}
                                    className="p-1 rounded-md text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 disabled:opacity-30 cursor-pointer"
                                    title="Move Down"
                                  >
                                    <ArrowDown className="w-3.5 h-3.5" />
                                  </button>
                                  {isAdmin && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const next = (
                                          homeState.hero.readersAvatars ||
                                          DEFAULT_HOME_SECTIONS.hero.readersAvatars ||
                                          []
                                        ).filter((_, i) => i !== aIdx);
                                        setHomeState({
                                          ...homeState,
                                          hero: { ...homeState.hero, readersAvatars: next },
                                        });
                                      }}
                                      className="p-1 rounded-md text-zinc-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                                      title="Remove Avatar"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Card Images */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                          <ImagePickerField
                            label="Card 1 Image (Green backdrop)"
                            value={homeState.hero.card1Image || ''}
                            onChange={(url) => setHomeState({ ...homeState, hero: { ...homeState.hero, card1Image: url } })}
                            onUploadClick={(e) => handleImageFileSelect(e, 'hero.card1Image')}
                            onRemove={() => setHomeState({ ...homeState, hero: { ...homeState.hero, card1Image: '' } })}
                          />
                          <ImagePickerField
                            label="Card 2 Image (Orange backdrop)"
                            value={homeState.hero.card2Image || ''}
                            onChange={(url) => setHomeState({ ...homeState, hero: { ...homeState.hero, card2Image: url } })}
                            onUploadClick={(e) => handleImageFileSelect(e, 'hero.card2Image')}
                            onRemove={() => setHomeState({ ...homeState, hero: { ...homeState.hero, card2Image: '' } })}
                          />
                        </div>
                      </div>
                    </SectionAccordion>

                    {/* SECTION: Services */}
                    <SectionAccordion
                      title="Services Section"
                      subtitle="What we offer cards, icons, and capabilities"
                      isOpen={activeSection === 'services'}
                      onToggle={() => setActiveSection(activeSection === 'services' ? null : 'services')}
                    >
                      <div className="space-y-4 pt-2">
                        <FormField
                          label="Badge Text"
                          value={homeState.services.badgeText}
                          onChange={(val) => setHomeState({ ...homeState, services: { ...homeState.services, badgeText: val } })}
                        />
                        <FormField
                          label="Heading"
                          value={homeState.services.heading}
                          onChange={(val) => setHomeState({ ...homeState, services: { ...homeState.services, heading: val } })}
                        />
                        <FormTextarea
                          label="Description"
                          value={homeState.services.description}
                          onChange={(val) => setHomeState({ ...homeState, services: { ...homeState.services, description: val } })}
                        />

                        {/* Cards List */}
                        <div className="space-y-2 pt-2">
                          <div className="flex items-center justify-between text-xs font-bold text-zinc-600">
                            <span>Service Cards ({homeState.services.items.length})</span>
                            <button
                              type="button"
                              onClick={() =>
                                setHomeState({
                                  ...homeState,
                                  services: {
                                    ...homeState.services,
                                    items: [
                                      ...homeState.services.items,
                                      { title: 'New Service', description: 'Description of service capabilities.' },
                                    ],
                                  },
                                })
                              }
                              className="inline-flex items-center gap-1 text-amber-700 hover:text-amber-900 cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Add Card</span>
                            </button>
                          </div>

                          {homeState.services.items.map((item, idx) => (
                            <div key={idx} className="p-3 bg-zinc-50 rounded-2xl border border-zinc-200/70 space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-zinc-800">Card #{idx + 1}</span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setHomeState({
                                      ...homeState,
                                      services: {
                                        ...homeState.services,
                                        items: homeState.services.items.filter((_, i) => i !== idx),
                                      },
                                    })
                                  }
                                  className="text-zinc-400 hover:text-rose-600 p-1 cursor-pointer"
                                  title="Delete card"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              <FormField
                                label="Title"
                                value={item.title}
                                onChange={(val) => {
                                  const next = [...homeState.services.items];
                                  next[idx].title = val;
                                  setHomeState({ ...homeState, services: { ...homeState.services, items: next } });
                                }}
                              />
                              <FormTextarea
                                label="Description"
                                value={item.description}
                                onChange={(val) => {
                                  const next = [...homeState.services.items];
                                  next[idx].description = val;
                                  setHomeState({ ...homeState, services: { ...homeState.services, items: next } });
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </SectionAccordion>

                    {/* SECTION: Why Us */}
                    <SectionAccordion
                      title="Why Choose Us Section"
                      subtitle="Key platform advantages, image, and checklist"
                      isOpen={activeSection === 'whyUs'}
                      onToggle={() => setActiveSection(activeSection === 'whyUs' ? null : 'whyUs')}
                    >
                      <div className="space-y-4 pt-2">
                        <FormField
                          label="Badge Text"
                          value={homeState.whyUs.badgeText}
                          onChange={(val) => setHomeState({ ...homeState, whyUs: { ...homeState.whyUs, badgeText: val } })}
                        />
                        <FormField
                          label="Heading"
                          value={homeState.whyUs.heading}
                          onChange={(val) => setHomeState({ ...homeState, whyUs: { ...homeState.whyUs, heading: val } })}
                        />
                        <FormTextarea
                          label="Description"
                          value={homeState.whyUs.description}
                          onChange={(val) => setHomeState({ ...homeState, whyUs: { ...homeState.whyUs, description: val } })}
                        />
                        <ImagePickerField
                          label="Feature Image (Orange Card)"
                          value={homeState.whyUs.image || ''}
                          onChange={(url) => setHomeState({ ...homeState, whyUs: { ...homeState.whyUs, image: url } })}
                          onUploadClick={(e) => handleImageFileSelect(e, 'whyUs.image')}
                          onRemove={() => setHomeState({ ...homeState, whyUs: { ...homeState.whyUs, image: '' } })}
                        />
                      </div>
                    </SectionAccordion>

                    {/* SECTION: Methodology / Process */}
                    <SectionAccordion
                      title="Methodology / Process Section"
                      subtitle="3-step structured workflow (Ideate, Design, Frontend & Publish)"
                      isOpen={activeSection === 'process'}
                      onToggle={() => setActiveSection(activeSection === 'process' ? null : 'process')}
                    >
                      <div className="space-y-4 pt-2">
                        <FormField
                          label="Badge Text"
                          value={homeState.process.badgeText}
                          onChange={(val) => setHomeState({ ...homeState, process: { ...homeState.process, badgeText: val } })}
                        />
                        <FormField
                          label="Heading"
                          value={homeState.process.heading}
                          onChange={(val) => setHomeState({ ...homeState, process: { ...homeState.process, heading: val } })}
                        />
                        <FormTextarea
                          label="Description"
                          value={homeState.process.description}
                          onChange={(val) => setHomeState({ ...homeState, process: { ...homeState.process, description: val } })}
                        />
                      </div>
                    </SectionAccordion>

                    {/* SECTION: Testimonials */}
                    <SectionAccordion
                      title="Testimonials Section"
                      subtitle="Reader and editor endorsements with quotes and avatars"
                      isOpen={activeSection === 'testimonials'}
                      onToggle={() => setActiveSection(activeSection === 'testimonials' ? null : 'testimonials')}
                    >
                      <div className="space-y-4 pt-2">
                        <FormField
                          label="Badge Text"
                          value={homeState.testimonials.badgeText}
                          onChange={(val) => setHomeState({ ...homeState, testimonials: { ...homeState.testimonials, badgeText: val } })}
                        />
                        <FormField
                          label="Heading"
                          value={homeState.testimonials.heading}
                          onChange={(val) => setHomeState({ ...homeState, testimonials: { ...homeState.testimonials, heading: val } })}
                        />

                        {homeState.testimonials.items.map((item, idx) => (
                          <div key={idx} className="p-3 bg-zinc-50 rounded-2xl border border-zinc-200/70 space-y-2">
                            <span className="text-xs font-bold text-zinc-800">Testimonial #{idx + 1}</span>
                            <FormTextarea
                              label="Quote"
                              value={item.quote}
                              onChange={(val) => {
                                const next = [...homeState.testimonials.items];
                                next[idx].quote = val;
                                setHomeState({ ...homeState, testimonials: { ...homeState.testimonials, items: next } });
                              }}
                            />
                            <div className="grid grid-cols-2 gap-2">
                              <FormField
                                label="Author"
                                value={item.author}
                                onChange={(val) => {
                                  const next = [...homeState.testimonials.items];
                                  next[idx].author = val;
                                  setHomeState({ ...homeState, testimonials: { ...homeState.testimonials, items: next } });
                                }}
                              />
                              <FormField
                                label="Role"
                                value={item.role}
                                onChange={(val) => {
                                  const next = [...homeState.testimonials.items];
                                  next[idx].role = val;
                                  setHomeState({ ...homeState, testimonials: { ...homeState.testimonials, items: next } });
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </SectionAccordion>

                    {/* SECTION: CTA / Footer Desk */}
                    <SectionAccordion
                      title="Contact &amp; CTA Desk"
                      subtitle="Email, working hours, and physical studio location"
                      isOpen={activeSection === 'cta'}
                      onToggle={() => setActiveSection(activeSection === 'cta' ? null : 'cta')}
                    >
                      <div className="space-y-4 pt-2">
                        <FormField
                          label="Heading"
                          value={homeState.cta.heading}
                          onChange={(val) => setHomeState({ ...homeState, cta: { ...homeState.cta, heading: val } })}
                        />
                        <FormField
                          label="Contact Email"
                          value={homeState.cta.contactEmail}
                          onChange={(val) => setHomeState({ ...homeState, cta: { ...homeState.cta, contactEmail: val } })}
                        />
                        <FormField
                          label="Working Hours"
                          value={homeState.cta.workingHours}
                          onChange={(val) => setHomeState({ ...homeState, cta: { ...homeState.cta, workingHours: val } })}
                        />
                        <FormField
                          label="Studio Location"
                          value={homeState.cta.location}
                          onChange={(val) => setHomeState({ ...homeState, cta: { ...homeState.cta, location: val } })}
                        />
                      </div>
                    </SectionAccordion>
                  </>
                )}

                {/* About Page Tree Sections */}
                {slug === 'about' && (
                  <>
                    <SectionAccordion
                      title="About Header Section"
                      subtitle="Page title, highlight word, editorial introduction, and pillars"
                      isOpen={activeSection === 'aboutHeader' || !activeSection}
                      onToggle={() => setActiveSection(activeSection === 'aboutHeader' ? null : 'aboutHeader')}
                    >
                      <div className="space-y-4 pt-2">
                        <FormField
                          label="Badge Text"
                          value={aboutState.header.badgeText}
                          onChange={(val) => setAboutState({ ...aboutState, header: { ...aboutState.header, badgeText: val } })}
                        />
                        <FormField
                          label="Main Heading"
                          value={aboutState.header.heading}
                          onChange={(val) => setAboutState({ ...aboutState, header: { ...aboutState.header, heading: val } })}
                        />
                        <FormField
                          label="Highlight Word"
                          value={aboutState.header.highlightWord}
                          onChange={(val) => setAboutState({ ...aboutState, header: { ...aboutState.header, highlightWord: val } })}
                        />
                        <FormTextarea
                          label="Description"
                          value={aboutState.header.description}
                          onChange={(val) => setAboutState({ ...aboutState, header: { ...aboutState.header, description: val } })}
                        />
                        <ImagePickerField
                          label="About Studio Feature Image"
                          value={aboutState.header.image || ''}
                          onChange={(url) => setAboutState({ ...aboutState, header: { ...aboutState.header, image: url } })}
                          onUploadClick={(e) => handleImageFileSelect(e, 'about.header.image')}
                          onRemove={() => setAboutState({ ...aboutState, header: { ...aboutState.header, image: '' } })}
                        />
                      </div>
                    </SectionAccordion>

                    <SectionAccordion
                      title="Philosophy Section"
                      subtitle="Studio manifesto and editorial craft paragraphs"
                      isOpen={activeSection === 'philosophy'}
                      onToggle={() => setActiveSection(activeSection === 'philosophy' ? null : 'philosophy')}
                    >
                      <div className="space-y-4 pt-2">
                        <FormField
                          label="Heading"
                          value={aboutState.philosophy.heading}
                          onChange={(val) => setAboutState({ ...aboutState, philosophy: { ...aboutState.philosophy, heading: val } })}
                        />
                        {aboutState.philosophy.paragraphs.map((p, idx) => (
                          <FormTextarea
                            key={idx}
                            label={`Paragraph ${idx + 1}`}
                            value={p}
                            onChange={(val) => {
                              const next = [...aboutState.philosophy.paragraphs];
                              next[idx] = val;
                              setAboutState({ ...aboutState, philosophy: { ...aboutState.philosophy, paragraphs: next } });
                            }}
                          />
                        ))}
                        <ImagePickerField
                          label="Philosophy Workspace Image"
                          value={aboutState.philosophy.image || ''}
                          onChange={(url) => setAboutState({ ...aboutState, philosophy: { ...aboutState.philosophy, image: url } })}
                          onUploadClick={(e) => handleImageFileSelect(e, 'about.philosophy.image')}
                          onRemove={() => setAboutState({ ...aboutState, philosophy: { ...aboutState.philosophy, image: '' } })}
                        />
                      </div>
                    </SectionAccordion>

                    <SectionAccordion
                      title="Capabilities Section"
                      subtitle="Platform feature cards"
                      isOpen={activeSection === 'capabilities'}
                      onToggle={() => setActiveSection(activeSection === 'capabilities' ? null : 'capabilities')}
                    >
                      <div className="space-y-4 pt-2">
                        <FormField
                          label="Heading"
                          value={aboutState.capabilities.heading}
                          onChange={(val) => setAboutState({ ...aboutState, capabilities: { ...aboutState.capabilities, heading: val } })}
                        />
                        {aboutState.capabilities.items.map((item, idx) => (
                          <div key={idx} className="p-3 bg-zinc-50 rounded-2xl border border-zinc-200/70 space-y-2">
                            <FormField
                              label="Title"
                              value={item.title}
                              onChange={(val) => {
                                const next = [...aboutState.capabilities.items];
                                next[idx].title = val;
                                setAboutState({ ...aboutState, capabilities: { ...aboutState.capabilities, items: next } });
                              }}
                            />
                            <FormTextarea
                              label="Description"
                              value={item.description}
                              onChange={(val) => {
                                const next = [...aboutState.capabilities.items];
                                next[idx].description = val;
                                setAboutState({ ...aboutState, capabilities: { ...aboutState.capabilities, items: next } });
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </SectionAccordion>
                  </>
                )}

                {/* 404 NOT FOUND PAGE SECTIONS */}
                {is404 && (
                  <SectionAccordion
                    title="404 Error Content & Action Button"
                    subtitle="Customize the 404 badge, main heading, 3 guidance lines, and action button"
                    isOpen={activeSection === '404' || !activeSection}
                    onToggle={() => setActiveSection(activeSection === '404' ? null : '404')}
                  >
                    <div className="space-y-4 pt-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <FormField
                          label="404 Badge Code Text"
                          value={notFoundState.general.badgeCode}
                          onChange={(val) =>
                            setNotFoundState({
                              ...notFoundState,
                              general: { ...notFoundState.general, badgeCode: val },
                            })
                          }
                          placeholder="404"
                        />
                        <FormField
                          label="Action Button Text"
                          value={notFoundState.general.buttonText}
                          onChange={(val) =>
                            setNotFoundState({
                              ...notFoundState,
                              general: { ...notFoundState.general, buttonText: val },
                            })
                          }
                          placeholder="Go Back Home"
                        />
                      </div>

                      <FormField
                        label="Main Heading"
                        value={notFoundState.general.heading}
                        onChange={(val) =>
                          setNotFoundState({
                            ...notFoundState,
                            general: { ...notFoundState.general, heading: val },
                          })
                        }
                        placeholder="PAGE NOT FOUND"
                      />

                      <FormField
                        label="Action Button Link Target"
                        value={notFoundState.general.buttonLink}
                        onChange={(val) =>
                          setNotFoundState({
                            ...notFoundState,
                            general: { ...notFoundState.general, buttonLink: val },
                          })
                        }
                        placeholder="/"
                      />

                      <div className="space-y-3 pt-2">
                        <span className="text-xs font-bold text-zinc-700 uppercase tracking-wider block">
                          Descriptive Guidance Lines (Exact 3-Line Layout)
                        </span>
                        <FormField
                          label="Line 1"
                          value={notFoundState.general.line1}
                          onChange={(val) =>
                            setNotFoundState({
                              ...notFoundState,
                              general: { ...notFoundState.general, line1: val },
                            })
                          }
                          placeholder="We looked everywhere for this page."
                        />
                        <FormField
                          label="Line 2"
                          value={notFoundState.general.line2}
                          onChange={(val) =>
                            setNotFoundState({
                              ...notFoundState,
                              general: { ...notFoundState.general, line2: val },
                            })
                          }
                          placeholder="Are you sure the website URL is correct?"
                        />
                        <FormField
                          label="Line 3"
                          value={notFoundState.general.line3}
                          onChange={(val) =>
                            setNotFoundState({
                              ...notFoundState,
                              general: { ...notFoundState.general, line3: val },
                            })
                          }
                          placeholder="Get in touch with the site owner."
                        />
                      </div>
                    </div>
                  </SectionAccordion>
                )}
              </div>
            </div>
          )}

          {/* 2. Interactive Real-Time Visual Live Preview Panel */}
          {(viewMode === 'split' || viewMode === 'preview') && (
            <div
              className={`flex-1 flex flex-col bg-zinc-100 rounded-[28px] border-2 border-zinc-200 shadow-[0_12px_40px_rgba(0,0,0,0.08),0_4px_12px_rgba(0,0,0,0.04)] overflow-hidden min-h-0 p-3 sm:p-4`}
            >
              {/* Preview top frame bar */}
              <div className="flex items-center justify-between px-3 py-2 bg-white rounded-2xl border border-zinc-200/80 mb-3 shadow-2xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-zinc-900">Live Visual Simulation</span>
                  <span className="text-[11px] text-zinc-400 font-mono">
                    (Instant DOM rendering)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-500 font-medium">
                    {deviceMode.toUpperCase()}
                  </span>
                  <a
                    href={is404 ? '/non-existent-page' : slug === 'home' ? '/' : `/${slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-400 hover:text-zinc-900 transition"
                    title="Open live site"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Device Frame Simulation Container */}
              <div className="flex-1 flex justify-center items-center overflow-hidden min-h-0 relative p-0 sm:p-3 bg-zinc-100/80 select-none">
                <div
                  className={`bg-white transition-all duration-300 flex flex-col relative overflow-hidden ${deviceMode === 'tablet'
                      ? 'w-[768px] max-w-full h-full border border-zinc-200 shadow-sm rounded-none sm:rounded-lg my-auto'
                      : deviceMode === 'mobile'
                        ? 'w-[390px] max-w-full h-full border border-zinc-200 shadow-sm rounded-none sm:rounded-lg my-auto'
                        : 'w-full h-full max-w-full border border-zinc-200 shadow-sm rounded-none sm:rounded-lg'
                    }`}
                >
                  <div
                    ref={editPreviewScrollRef}
                    className="flex-1 flex flex-col w-full h-full overflow-y-auto overflow-x-hidden relative scroll-smooth bg-white"
                  >
                    {slug === 'home' ? (
                      <div className="w-full flex flex-col pointer-events-auto">
                        <HeroSection content={homeState.hero} />
                        <AboutSection content={aboutState} />
                        <ServicesSection content={homeState.services} />
                        <WhyUsSection content={homeState.whyUs} />
                        <ProcessSection content={homeState.process} />
                        <TestimonialsSection content={homeState.testimonials} />
                        <Footer content={homeState.cta} />
                      </div>
                    ) : is404 ? (
                      <div className="w-full flex flex-col pointer-events-auto">
                        <NotFoundContent content={notFoundState.general} isInsidePreview={true} />
                        <Footer content={homeState.cta} showContactSection={false} />
                      </div>
                    ) : (
                      <div className="w-full flex flex-col pointer-events-auto">
                        <AboutSection content={aboutState} />
                        <Footer content={homeState.cta} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Crop Modal */}
      {cropSrc && (
        <ImageCropModal
          imageSrc={cropSrc}
          fileName={cropFileName}
          onConfirm={handleCropConfirm}
          onCancel={() => {
            setCropSrc(null);
            setCropFieldPath(null);
          }}
        />
      )}
    </AdminLayout>
  );
}

