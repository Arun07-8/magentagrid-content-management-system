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
    paramId || slug || (allPosts.length > 0 ? allPosts[0]._id || (allPosts[0] as any).id : undefined);

  const { data: post, isLoading, isError, error, refetch } = usePublicPost(effectiveId);
  const [copied, setCopied] = useState(false);

  const relatedPosts = allPosts
    .filter((a) => (a._id || (a as any).id) !== effectiveId)
    .slice(0, 3);

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const displayCategory = post ? getArticleCategory(post) : 'Editorial';
  const formattedDate = post ? formatFullDate(post.createdAt || post.updatedAt) : '';

  return (
    <PublicLayout>
      <main className="flex-1 bg-white pb-24">
        {isLoading ? (
          <div className="py-32">
            <Spinner fullHeight text="Loading article..." />
          </div>
        ) : isError || !post ? (
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-24">
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

        {/* Related Articles Strip */}
        {relatedPosts.length > 0 && !isLoading && !isError && post && (
          <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 mt-14 sm:mt-20 pt-12 border-t border-zinc-200">
            <div className="flex items-end justify-between mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-400 block mb-1">
                  CURATED DISPATCHES
                </span>
                <h3 className="text-2xl font-black text-zinc-950 tracking-tight font-['Plus_Jakarta_Sans']">
                  More Stories to Read
                </h3>
              </div>
              <button
                type="button"
                onClick={() => navigate('/blog')}
                className="text-xs sm:text-sm font-bold text-zinc-900 hover:text-amber-600 transition-colors cursor-pointer"
              >
                View all stories →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
              {relatedPosts.map((item) => {
                const itemId = item._id || (item as any).id;
                return (
                  <ArticleCard
                    key={itemId}
                    post={item}
                    variant="grid"
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
