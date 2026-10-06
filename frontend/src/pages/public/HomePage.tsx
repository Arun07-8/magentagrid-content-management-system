import { PublicLayout } from '../../widgets';
import { usePublicHomePage, usePublicAboutPage, useRealtimePages } from '../../entities/page';
import { Spinner } from '../../shared/ui';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { ServicesSection } from './components/ServicesSection';
import { WhyUsSection } from './components/WhyUsSection';
import { ProcessSection } from './components/ProcessSection';
import { TestimonialsSection } from './components/TestimonialsSection';

export default function HomePage() {
  // Listen to real-time socket events for pages
  useRealtimePages();

  const { data: homeSections, isLoading: isHomeLoading } = usePublicHomePage();
  const { data: aboutSections, isLoading: isAboutLoading } = usePublicAboutPage();

  const isLoading = isHomeLoading || isAboutLoading;

  // Individual section-level publish checks
  const isHeroPublished =
    homeSections?.hero &&
    (homeSections.hero as any).isPublished !== false &&
    (homeSections.hero as any).status !== 'Draft';

  const isServicesPublished =
    homeSections?.services &&
    (homeSections.services as any).isPublished !== false &&
    (homeSections.services as any).status !== 'Draft';

  const isWhyUsPublished =
    homeSections?.whyUs &&
    (homeSections.whyUs as any).isPublished !== false &&
    (homeSections.whyUs as any).status !== 'Draft';

  const isProcessPublished =
    homeSections?.process &&
    (homeSections.process as any).isPublished !== false &&
    (homeSections.process as any).status !== 'Draft';

  const isTestimonialsPublished =
    homeSections?.testimonials &&
    (homeSections.testimonials as any).isPublished !== false &&
    (homeSections.testimonials as any).status !== 'Draft';

  const isAboutPublished = aboutSections
    ? (aboutSections as any).isPublished !== false && (aboutSections as any).status !== 'Draft'
    : true;

  return (
    <PublicLayout footerContent={homeSections?.cta}>
      {isLoading ? (
        <Spinner fullHeight text="Loading editorial platform..." />
      ) : (
        <div className="w-full flex flex-col overflow-x-hidden">
          {/* 1. Home / Hero Section (id="home") */}
          {isHeroPublished && <HeroSection content={homeSections!.hero} />}

          {/* 2. About Section (id="about") */}
          {isAboutPublished && <AboutSection content={aboutSections || undefined} />}

          {/* 3. Services Section (id="services") */}
          {isServicesPublished && <ServicesSection content={homeSections!.services} />}

          {/* 4. Why Choose Us Section */}
          {isWhyUsPublished && <WhyUsSection content={homeSections!.whyUs} />}

          {/* 5. How We Do (3-Step Methodology) */}
          {isProcessPublished && <ProcessSection content={homeSections!.process} />}

          {/* 6. Reader & Editor Testimonials */}
          {isTestimonialsPublished && <TestimonialsSection content={homeSections!.testimonials} />}
        </div>
      )}
    </PublicLayout>
  );
}
