import { HeroSection } from './HeroSection';
import { AboutSection } from './AboutSection';
import { ServicesSection } from './ServicesSection';
import { WhyUsSection } from './WhyUsSection';
import { ProcessSection } from './ProcessSection';
import { TestimonialsSection } from './TestimonialsSection';
import { NotFoundContent } from './NotFoundContent';
import { RichContentSectionView } from './RichContentSectionView';
import type { PageSectionMeta } from '../../../entities/page';

interface DynamicSectionsRendererProps {
  sectionOrder?: PageSectionMeta[];
  sections?: Record<string, any>;
  aboutContent?: any;
  isInsidePreview?: boolean;
  isAdminControls?: boolean;
  deviceMode?: 'desktop' | 'tablet' | 'mobile';
}

export function DynamicSectionsRenderer({
  sectionOrder = [],
  sections = {},
  aboutContent,
  isInsidePreview = false,
  deviceMode = 'desktop',
}: DynamicSectionsRendererProps) {
  // If no explicit sectionOrder is defined, fallback to rendering based on available section keys
  if (!sectionOrder || sectionOrder.length === 0) {
    return (
      <div className="w-full flex flex-col overflow-x-hidden">
        {sections.hero && <HeroSection content={sections.hero} deviceMode={deviceMode} />}
        {aboutContent && <AboutSection content={aboutContent} deviceMode={deviceMode} />}
        {sections.services && <ServicesSection content={sections.services} deviceMode={deviceMode} />}
        {sections.whyUs && <WhyUsSection content={sections.whyUs} deviceMode={deviceMode} />}
        {sections.process && <ProcessSection content={sections.process} />}
        {sections.testimonials && <TestimonialsSection content={sections.testimonials} />}
        {sections.general && <NotFoundContent content={sections.general} isInsidePreview={isInsidePreview} />}
      </div>
    );
  }

  // Filter only enabled and published sections
  const enabledSections = sectionOrder.filter((s) => {
    if (s.isEnabled === false) return false;
    const secData = sections[s.id];
    if (secData && (secData.isPublished === false || secData.status === 'Draft')) {
      return false;
    }
    return true;
  });

  return (
    <div className="w-full flex flex-col overflow-x-hidden">
      {enabledSections.map((secMeta) => {
        const secData = sections[secMeta.id];

        switch (secMeta.type) {
          case 'hero':
            return <HeroSection key={secMeta.id} content={secData || sections.hero} deviceMode={deviceMode} />;

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
                deviceMode={deviceMode}
              />
            );

          case 'services':
            return <ServicesSection key={secMeta.id} content={secData || sections.services} deviceMode={deviceMode} />;

          case 'whyUs':
            return <WhyUsSection key={secMeta.id} content={secData || sections.whyUs} deviceMode={deviceMode} />;

          case 'process':
            return <ProcessSection key={secMeta.id} content={secData || sections.process} />;

          case 'testimonials':
            return <TestimonialsSection key={secMeta.id} content={secData || sections.testimonials} />;

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
