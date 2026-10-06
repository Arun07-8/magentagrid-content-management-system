import { useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import {
  useCmsPage,
  DEFAULT_HOME_SECTIONS,
  DEFAULT_ABOUT_SECTIONS,
  DEFAULT_NOT_FOUND_SECTIONS,
  type HomePageSections,
  type AboutPageSections,
  type NotFoundPageSections,
} from '../../entities/page';
import { Navbar, Footer } from '../../widgets';
import { HeroSection } from '../public/components/HeroSection';
import { AboutSection } from '../public/components/AboutSection';
import { ServicesSection } from '../public/components/ServicesSection';
import { WhyUsSection } from '../public/components/WhyUsSection';
import { ProcessSection } from '../public/components/ProcessSection';
import { TestimonialsSection } from '../public/components/TestimonialsSection';
import { NotFoundContent } from '../public/components/NotFoundContent';
import { Spinner } from '../../shared/ui';

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

export default function PagePreviewFrame() {
  const { slug = 'home' } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const { data: page, isLoading } = useCmsPage(slug);

  const isHomePage = slug === 'home';
  const is404Page = slug === '404' || slug === 'not-found';

  const homeSections: HomePageSections =
    isHomePage && page?.sections
      ? { ...DEFAULT_HOME_SECTIONS, ...(page.sections as HomePageSections) }
      : DEFAULT_HOME_SECTIONS;

  const aboutSections: AboutPageSections =
    !isHomePage && !is404Page && page?.sections
      ? { ...DEFAULT_ABOUT_SECTIONS, ...(page.sections as AboutPageSections) }
      : DEFAULT_ABOUT_SECTIONS;

  const notFoundSections: NotFoundPageSections =
    is404Page && page?.sections
      ? { ...DEFAULT_NOT_FOUND_SECTIONS, ...(page.sections as NotFoundPageSections) }
      : DEFAULT_NOT_FOUND_SECTIONS;

  // Auto-scroll on initial mount or when searchParams change
  useEffect(() => {
    if (isLoading) return;
    const targetSection = searchParams.get('section') || (window.location.hash ? window.location.hash.replace('#', '') : null);
    if (targetSection) {
      const targetId = SECTION_ELEMENT_ID_MAP[targetSection] || targetSection;
      const timeout = setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 200);
      return () => clearTimeout(timeout);
    }
  }, [isLoading, searchParams]);

  // Listen for live postMessage scroll commands from parent preview controller
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data && e.data.type === 'SCROLL_TO_SECTION' && e.data.section) {
        const targetId = SECTION_ELEMENT_ID_MAP[e.data.section] || e.data.section;
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Spinner fullHeight text="Loading live preview..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white overflow-x-hidden">
      <Navbar />
      <main className="flex-1 flex flex-col">
        {isHomePage ? (
          <>
            <HeroSection content={homeSections.hero} />
            <AboutSection content={aboutSections} />
            <ServicesSection content={homeSections.services} />
            <WhyUsSection content={homeSections.whyUs} />
            <ProcessSection content={homeSections.process} />
            <TestimonialsSection content={homeSections.testimonials} />
          </>
        ) : is404Page ? (
          <NotFoundContent content={notFoundSections.general} isInsidePreview={true} />
        ) : (
          <AboutSection content={aboutSections} />
        )}
      </main>
      <Footer
        content={homeSections.cta}
        showContactSection={!is404Page}
      />
    </div>
  );
}


