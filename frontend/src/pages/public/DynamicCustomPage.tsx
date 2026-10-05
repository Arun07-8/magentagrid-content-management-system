import { useParams } from 'react-router-dom';
import { PublicLayout } from '../../widgets';
import { usePublicPage, useRealtimePages, usePublicHomePage } from '../../entities/page';
import type { Page } from '../../entities/page';
import { usePublicPosts } from '../../entities/post';
import { DynamicSectionsRenderer } from './components/DynamicSectionsRenderer';
import { Spinner } from '../../shared/ui';
import NotFoundPage from './NotFoundPage';

export default function DynamicCustomPage() {
  const { slug = '' } = useParams<{ slug: string }>();
  useRealtimePages();

  const { data: homeData } = usePublicHomePage();
  const { data: pageData, isLoading, isError } = usePublicPage<Page | null>(slug, null);
  const { data: posts = [] } = usePublicPosts();

  if (isLoading) {
    return (
      <PublicLayout footerContent={homeData?.cta}>
        <div className="py-32 flex justify-center items-center">
          <Spinner text={`Loading /${slug}...`} />
        </div>
      </PublicLayout>
    );
  }

  if (isError || !pageData) {
    return <NotFoundPage />;
  }

  return (
    <PublicLayout footerContent={pageData.sections?.cta || homeData?.cta}>
      <DynamicSectionsRenderer
        sectionOrder={pageData.sectionOrder}
        sections={pageData.sections}
        posts={posts}
      />
    </PublicLayout>
  );
}
