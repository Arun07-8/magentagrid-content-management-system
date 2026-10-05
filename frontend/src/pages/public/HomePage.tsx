import { PublicLayout } from '../../widgets';
import { usePublicPosts } from '../../entities/post';
import { usePublicHomePage, usePublicAboutPage, useRealtimePages } from '../../entities/page';
import { Spinner } from '../../shared/ui';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { ServicesSection } from './components/ServicesSection';
import { WhyUsSection } from './components/WhyUsSection';
import { CaseStudiesSection } from './components/CaseStudiesSection';
import { BlogSection } from './components/BlogSection';
import { ProcessSection } from './components/ProcessSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { LogoCloudSection } from './components/LogoCloudSection';

export default function HomePage() {
  // Listen to real-time socket events for pages
  useRealtimePages();

  const { data: posts = [], isLoading: isPostsLoading } = usePublicPosts();
  const { data: homeSections } = usePublicHomePage();
  const { data: aboutSections } = usePublicAboutPage();

  const isLoading = isPostsLoading && !homeSections;

  return (
    <PublicLayout footerContent={homeSections?.cta}>
      {isLoading ? (
        <Spinner fullHeight text="Loading editorial platform..." />
      ) : (
        <div className="w-full flex flex-col overflow-x-hidden">
          {/* 1. Home / Hero Section (id="home") */}
          <HeroSection content={homeSections?.hero} />

          {/* 2. About Section (id="about") */}
          <AboutSection content={aboutSections} />

          {/* 3. Services Section (id="services") */}
          <ServicesSection content={homeSections?.services} />

          {/* 4. Why Choose Us Section */}
          <WhyUsSection content={homeSections?.whyUs} />

          {/* 5. Interactive Case Studies Showcase */}
          <CaseStudiesSection posts={posts} />

          {/* 6. Dynamic Blog & News Section (id="blog") */}
          <BlogSection posts={posts} />

          {/* 7. How We Do (3-Step Methodology) */}
          <ProcessSection content={homeSections?.process} />

          {/* 8. Reader & Editor Testimonials */}
          <TestimonialsSection content={homeSections?.testimonials} />

          {/* 9. Partner & Publication Logo Cloud */}
          <LogoCloudSection />
        </div>
      )}
    </PublicLayout>
  );
}

