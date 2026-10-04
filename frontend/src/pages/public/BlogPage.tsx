import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PublicLayout } from '../../widgets';
import { usePublicPosts, ArticleCard } from '../../entities/post';
import { Spinner, EmptyState, ErrorState } from '../../shared/ui';

export default function BlogPage() {
  const navigate = useNavigate();
  const [currentPageNum, setCurrentPageNum] = useState<number>(1);

  const { data: allPosts = [], isLoading, isError, error, refetch } = usePublicPosts();

  const itemsPerPage = 9;
  const totalPages = Math.max(1, Math.ceil(allPosts.length / itemsPerPage));
  const paginatedFeed = allPosts.slice(
    (currentPageNum - 1) * itemsPerPage,
    currentPageNum * itemsPerPage
  );

  return (
    <PublicLayout>
      {/* Editorial Header */}
      <section className="bg-white pt-20 sm:pt-28 pb-10 border-b border-zinc-200">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto mb-14 text-center">
            <span className="text-[13px] font-semibold uppercase tracking-widest text-zinc-500 block mb-6">
              Blog / News
            </span>
            <h1 className="text-5xl sm:text-[56px] font-bold text-zinc-900 tracking-tight leading-[1.1] mb-6">
              Articles & Dispatches
            </h1>
            <p className="text-zinc-600 text-[17px] leading-relaxed max-w-2xl mx-auto">
              Explore perspectives, technical essays, and industry analysis published by our editorial team.
            </p>
          </div>
        </div>
      </section>

      <main className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 w-full">
        {isLoading ? (
          <Spinner fullHeight text="Loading articles..." />
        ) : isError ? (
          <ErrorState
            title="Failed to load articles"
            message={error?.message}
            onRetry={() => refetch()}
          />
        ) : allPosts.length > 0 ? (
          <div className="flex flex-col">
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6 lg:gap-10">
              {paginatedFeed.map((story) => {
                const storyId = story._id || story.id;
                return (
                  <ArticleCard
                    key={storyId}
                    post={story}
                    onClick={() => navigate(`/blog/${storyId}`)}
                  />
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pt-10 border-t border-zinc-200/60 flex items-center justify-between text-sm text-zinc-500">
                <div>
                  Page {currentPageNum} of {totalPages}
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setCurrentPageNum((p) => Math.max(1, p - 1))}
                    disabled={currentPageNum === 1}
                    className="flex items-center gap-1 font-medium hover:text-zinc-900 disabled:opacity-40 disabled:hover:text-zinc-500 transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" /> Previous
                  </button>
                  <button
                    onClick={() => setCurrentPageNum((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPageNum === totalPages}
                    className="flex items-center gap-1 font-medium hover:text-zinc-900 disabled:opacity-40 disabled:hover:text-zinc-500 transition-colors cursor-pointer"
                  >
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <EmptyState
            title="No articles found"
            description="No articles have been published yet."
          />
        )}
      </main>
    </PublicLayout>
  );
}
