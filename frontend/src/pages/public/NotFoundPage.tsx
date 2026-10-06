import { useCmsPage, type NotFoundPageSections } from '../../entities/page';
import { PublicLayout } from '../../widgets';
import { NotFoundContent } from './components/NotFoundContent';

export default function NotFoundPage() {
  const { data: page } = useCmsPage('404');
  const sections = (page?.sections as NotFoundPageSections) || undefined;

  return (
    <PublicLayout showContactSection={false}>
      <NotFoundContent content={sections?.general} />
    </PublicLayout>
  );
}



