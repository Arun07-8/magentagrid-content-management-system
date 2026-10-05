import { useParams } from 'react-router-dom';
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

export default function PagePreviewFrame() {
  const { slug = 'home' } = useParams<{ slug: string }>();
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

