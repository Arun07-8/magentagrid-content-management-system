import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PublicLayout } from '../../widgets';
import { PostView, usePublicPost, usePublicPosts, ArticleCard, getArticleCategory } from '../../entities/post';
import { Spinner, ErrorState, Button } from '../../shared/ui';
import { formatFullDate } from '../../shared/lib';

export default function BlogDetailPage() {
  const navigate = useNavigate();
  const { id: paramId, slug } = useParams<{ id?: string; slug?: string }>();

  const { data: allPosts = [] } = usePublicPosts();
  const effectiveId =
    paramId || slug || (allPosts.length > 0 ? allPosts[0]._id || allPosts[0].id : undefined);

  const { data: post, isLoading, isError, error, refetch } = usePublicPost(effectiveId);
  const [copied, setCopied] = useState(false);

  const relatedPosts = allPosts
    .filter((a) => (a._id || a.id) !== effectiveId)
    .slice(0, 3);

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const displayCategory = post ? getArticleCategory(post) : 'Guides';
  const formattedDate = post ? formatFullDate(post.createdAt || post.updatedAt) : '';

  return (
    <PublicLayout>
      <main className="flex-1 bg-white pb-24">
        {isLoading ? (
          <div className="py-24">
            <Spinner fullHeight text="Loading article..." />
          </div>
        ) : isError || !post ? (
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <ErrorState
              title="Article not found"
              message={
                error?.message ||
                'The article you are trying to view is either unavailable or has been removed.'
              }
              onRetry={() => refetch()}
              action={
                <Button onClick={() => navigate('/blog')} size="sm">
                  Browse All Articles
                </Button>
              }
            />
          </div>
        ) : (
          <PostView
            title={post.title}
            description={post.description}
            content={post.content}
            imageUrl={post.imageUrl}
            category={displayCategory}
            date={formattedDate}
            readTime={post.readTime}
            authorName={post.author?.name}
            onShare={handleCopyLink}
            copied={copied}
          />
        )}

        {/* Related Articles */}
        {relatedPosts.length > 0 && !isLoading && !isError && post && (
          <div className="max-w-[1000px] mx-auto px-4 sm:px-6 mt-14 sm:mt-16 pt-10 sm:pt-12 border-t border-zinc-200/60">
            <div className="flex items-end justify-between mb-6">
              <h3 className="text-lg sm:text-xl font-bold text-zinc-900 tracking-tight">More to Read</h3>
              <button
                onClick={() => navigate('/blog')}
                className="text-xs sm:text-[13px] font-semibold text-zinc-500 hover:text-zinc-900 transition-colors"
              >
                View all →
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6">
              {relatedPosts.map((item) => {
                const itemId = item._id || item.id;
                return (
                  <ArticleCard
                    key={itemId}
                    post={item}
                    size="sm"
                    onClick={() => {
                      navigate(`/blog/${itemId}`);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  />
                );
              })}
            </div>
          </div>
        )}
      </main>
    </PublicLayout>
  );
}
