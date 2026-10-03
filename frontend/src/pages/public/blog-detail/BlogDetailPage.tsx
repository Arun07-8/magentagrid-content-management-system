import { useState } from 'react';
import { Link2, Check, ArrowLeft, FileText } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { PublicLayout } from '../../../widgets';
import { PostView, usePublicPost, usePublicPosts } from '../../../entities/post';
import { Spinner, ErrorState, Button } from '../../../shared/ui';
import { formatDate } from '../../../shared/lib';

export default function BlogDetailPage() {
  const navigate = useNavigate();
  const { id: paramId, slug } = useParams<{ id?: string; slug?: string }>();

  const { data: allPosts = [] } = usePublicPosts();
  const effectiveId =
    paramId || slug || (allPosts.length > 0 ? allPosts[0]._id || allPosts[0].id : undefined);

  const { data: post, isLoading, isError, error } = usePublicPost(effectiveId);
  const [copied, setCopied] = useState(false);

  const relatedPosts = allPosts
    .filter((a) => (a._id || a.id) !== effectiveId)
    .slice(0, 4);

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedDate = formatDate(post?.createdAt);

  return (
    <PublicLayout>
      <main className="flex-1 py-10 sm:py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <button
              onClick={() => navigate('/blog')}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-zinc-500 hover:text-zinc-950 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Articles</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-zinc-200 text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950 transition-colors cursor-pointer shadow-xs"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-medium">Link Copied!</span>
                </>
              ) : (
                <>
                  <Link2 className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Share</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-8">
              {isLoading ? (
                <Spinner fullHeight text="Loading article..." />
              ) : isError || !post ? (
                <ErrorState
                  title="Article not found"
                  message={
                    error?.message ||
                    'The article you are trying to view is either unavailable or has been removed.'
                  }
                  action={
                    <Button onClick={() => navigate('/blog')} size="sm">
                      Browse All Articles
                    </Button>
                  }
                />
              ) : (
                <PostView
                  title={post.title}
                  description={post.description}
                  content={post.content}
                  imageUrl={post.imageUrl}
                  category={post.category}
                  date={formattedDate}
                  readTime={post.readTime}
                  authorName={post.author?.name}
                />
              )}
            </div>

            <aside className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-xl p-5 border border-zinc-200/80 shadow-xs">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-4 px-1">
                  Related Dispatches
                </h3>

                {relatedPosts.length > 0 ? (
                  <div className="space-y-4">
                    {relatedPosts.map((item) => {
                      const itemId = item._id || item.id;
                      const itemDate = formatDate(item.createdAt);

                      return (
                        <div
                          key={itemId}
                          onClick={() => {
                            navigate(`/blog/${itemId}`);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="group flex items-start gap-3 cursor-pointer pt-3.5 first:pt-0 border-t border-zinc-100 first:border-0"
                        >
                          <div className="w-16 h-14 rounded-lg overflow-hidden bg-zinc-100 border border-zinc-200/60 flex-shrink-0 flex items-center justify-center">
                            {item.imageUrl ? (
                              <img
                                src={item.imageUrl}
                                alt={item.title}
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none';
                                }}
                                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-150"
                              />
                            ) : (
                              <FileText className="w-4 h-4 text-zinc-400" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-semibold text-zinc-900 group-hover:text-zinc-700 transition-colors line-clamp-2 leading-snug">
                              {item.title}
                            </h4>
                            <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 mt-1">
                              {itemDate && (
                                <div className="flex items-center gap-1">
                                  <span>{itemDate}</span>
                                </div>
                              )}
                              {item.readTime && (
                                <>
                                  <span>•</span>
                                  <span>{item.readTime}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-zinc-400">No other articles available.</p>
                )}
              </div>
            </aside>
          </div>
        </div>
      </main>
    </PublicLayout>
  );
}
