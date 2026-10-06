import { PublicLayout } from '../../widgets';
import { usePublicAboutPage, usePublicHomePage, useRealtimePages } from '../../entities/page';
import { Spinner } from '../../shared/ui';
import { AboutSection } from './components/AboutSection';

export default function AboutPage() {
  useRealtimePages();

  const { data: aboutSections, isLoading: isAboutLoading } = usePublicAboutPage();
  const { data: homeSections } = usePublicHomePage();

  if (isAboutLoading) {
    return (
      <PublicLayout footerContent={homeSections?.cta}>
        <div className="py-32 flex justify-center items-center">
          <Spinner text="Loading About page..." />
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout footerContent={homeSections?.cta}>
      <main className="min-h-screen bg-white text-zinc-900 pt-20 sm:pt-24">
        <AboutSection content={aboutSections || undefined} />
      </main>
    </PublicLayout>
  );
}
