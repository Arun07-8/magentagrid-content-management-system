import { useParams, useLocation } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { Navbar, Footer } from '../../widgets';
import { PostView, useCmsPost } from '../../entities/post';
import { Spinner } from '../../shared/ui';
import { formatDate } from '../../shared/lib';
import type { PostFormPreviewData } from '../../features/post-management';

interface LocationState {
  previewData?: PostFormPreviewData;
}

export default function PostPreviewFrame() {
  const { id: paramId } = useParams<{ id: string }>();
  const location = useLocation();
  const state = location.state as LocationState | null;
  const previewData = state?.previewData;

  const shouldFetchFromDb = Boolean(paramId) && !previewData;
  const { data: dbPost, isLoading, isError } = useCmsPost(shouldFetchFromDb ? paramId : undefined);

  const displayData = previewData
    ? {
        title: previewData.title || '(No title)',
        description: previewData.description,
        content: previewData.content || '(No content)',
        imageUrl: previewData.previewObjectUrl || previewData.imageUrl || '',
        readTime: undefined,
        authorName: undefined,
        createdAt: undefined,
      }
    : dbPost
    ? {
        title: dbPost.title,
        description: dbPost.description,
        content: dbPost.content,
        imageUrl: dbPost.imageUrl,
        readTime: dbPost.readTime,
        authorName: dbPost.author?.name,
        createdAt: dbPost.createdAt,
      }
    : null;

  const formattedDate = displayData?.createdAt
    ? formatDate(displayData.createdAt)
    : 'Draft Preview';

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Spinner fullHeight text="Loading article preview..." />
      </div>
    );
  }

  if (isError || !displayData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6 text-center">
        <AlertCircle className="w-8 h-8 text-amber-500 mb-2" />
        <p className="text-sm font-semibold text-zinc-800">Article preview unavailable</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white overflow-x-hidden">
      <Navbar />
      <main className="flex-1 flex flex-col">
        <PostView
          title={displayData.title}
          description={displayData.description}
          content={displayData.content}
          imageUrl={displayData.imageUrl}
          date={formattedDate}
          readTime={displayData.readTime}
          authorName={displayData.authorName}
          isPreview={true}
        />
      </main>
      <Footer />
    </div>
  );
}
