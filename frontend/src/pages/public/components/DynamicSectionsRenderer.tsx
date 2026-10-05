import { HeroSection } from './HeroSection';
import { AboutSection } from './AboutSection';
import { ServicesSection } from './ServicesSection';
import { WhyUsSection } from './WhyUsSection';
import { CaseStudiesSection } from './CaseStudiesSection';
import { BlogSection } from './BlogSection';
import { ProcessSection } from './ProcessSection';
import { TestimonialsSection } from './TestimonialsSection';
import { LogoCloudSection } from './LogoCloudSection';
import { NotFoundContent } from './NotFoundContent';
import { RichContentSectionView } from './RichContentSectionView';
import type { PageSectionMeta } from '../../../entities/page';

interface DynamicSectionsRendererProps {
  sectionOrder?: PageSectionMeta[];
  sections?: Record<string, any>;
  posts?: any[];
  aboutContent?: any;
  isInsidePreview?: boolean;
}

export function DynamicSectionsRenderer({
  sectionOrder = [],
  sections = {},
  posts = [],
  aboutContent,
  isInsidePreview = false,
}: DynamicSectionsRendererProps) {
  // If no explicit sectionOrder is defined, fallback to rendering based on available section keys
  if (!sectionOrder || sectionOrder.length === 0) {
    return (
      <div className="w-full flex flex-col overflow-x-hidden">
        {sections.hero && <HeroSection content={sections.hero} />}
        {aboutContent && <AboutSection content={aboutContent} />}
        {sections.services && <ServicesSection content={sections.services} />}
        {sections.whyUs && <WhyUsSection content={sections.whyUs} />}
        {sections.process && <ProcessSection content={sections.process} />}
        {sections.testimonials && <TestimonialsSection content={sections.testimonials} />}
        {sections.general && <NotFoundContent content={sections.general} isInsidePreview={isInsidePreview} />}
      </div>
    );
  }

  // Filter only enabled sections
  const enabledSections = sectionOrder.filter((s) => s.isEnabled !== false);

  return (
    <div className="w-full flex flex-col overflow-x-hidden">
      {enabledSections.map((secMeta) => {
        const secData = sections[secMeta.id];

        switch (secMeta.type) {
          case 'hero':
            return <HeroSection key={secMeta.id} content={secData || sections.hero} />;

          case 'about':
          case 'header':
          case 'philosophy':
          case 'capabilities':
          case 'missionVision':
          case 'values':
            return (
              <AboutSection
                key={secMeta.id}
                content={aboutContent || sections}
              />
            );

          case 'services':
            return <ServicesSection key={secMeta.id} content={secData || sections.services} />;

          case 'whyUs':
            return <WhyUsSection key={secMeta.id} content={secData || sections.whyUs} />;

          case 'caseStudies':
            return <CaseStudiesSection key={secMeta.id} posts={posts} />;

          case 'blog':
            return <BlogSection key={secMeta.id} posts={posts} />;

          case 'process':
            return <ProcessSection key={secMeta.id} content={secData || sections.process} />;

          case 'testimonials':
            return <TestimonialsSection key={secMeta.id} content={secData || sections.testimonials} />;

          case 'logoCloud':
            return <LogoCloudSection key={secMeta.id} />;

          case 'notFound':
            return (
              <NotFoundContent
                key={secMeta.id}
                content={secData || sections.general}
                isInsidePreview={isInsidePreview}
              />
            );

          case 'richText':
            return <RichContentSectionView key={secMeta.id} content={secData} id={secMeta.id} />;

          default:
            return null;
        }
      })}
    </div>
  );
}
