import { useState } from 'react';
import { Link2, Check, ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { PublicLayout } from '../../widgets';
import { PostView, usePublicPost, usePublicPosts } from '../../entities/post';
import { Spinner, ErrorState, Button } from '../../shared/ui';
import { formatDate } from '../../shared/lib';

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
    .slice(0, 3);

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedDate = formatDate(post?.createdAt);

  return (
    <PublicLayout>
      <main className="flex-1 bg-white pt-10 pb-24">
        {/* Top Navigation */}
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 mb-12 flex justify-between items-center border-b border-zinc-200/60 pb-6">
          <button
            onClick={() => navigate('/blog')}
            className="flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dispatches
          </button>
          
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700">Link Copied</span>
              </>
            ) : (
              <>
                <Link2 className="w-4 h-4" /> Share Article
              </>
            )}
          </button>
        </div>

        {/* Article Body */}
        <div className="px-4 sm:px-6 lg:px-8">
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
              date={formattedDate}
              readTime={post.readTime}
              authorName={post.author?.name}
            />
          )}
        </div>

        {/* Related Articles */}
        {relatedPosts.length > 0 && !isLoading && !isError && post && (
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 mt-24 pt-16 border-t border-zinc-200/60">
            <h3 className="text-xl font-bold text-zinc-900 tracking-tight mb-10">More to Read</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((item, index) => {
                const itemId = item._id || item.id;
                const isLarge = index === 0;
                
                return (
                  <article
                    key={itemId}
                    onClick={() => {
                      navigate(`/blog/${itemId}`);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`group cursor-pointer flex flex-col ${isLarge ? 'md:col-span-2 md:grid md:grid-cols-2 md:gap-8' : ''}`}
                  >
                    <div className={isLarge ? '' : 'mb-4'}>
                      {item.imageUrl ? (
                        <div className={`aspect-[16/10] overflow-hidden rounded-[4px] bg-zinc-100 ${isLarge ? 'h-full' : ''}`}>
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        </div>
                      ) : (
                        <div className={`aspect-[16/10] overflow-hidden rounded-[4px] bg-zinc-100 flex items-center justify-center ${isLarge ? 'h-full' : ''}`}>
                          <span className="text-zinc-400 font-medium">No Image</span>
                        </div>
                      )}
                    </div>
                    
                    <div className={`flex flex-col justify-center ${isLarge ? '' : ''}`}>
                      <h4 className={`font-bold text-zinc-900 group-hover:text-zinc-600 transition-colors mb-2 leading-snug ${isLarge ? 'text-2xl mb-3' : 'text-lg'}`}>
                        {item.title}
                      </h4>
                      {isLarge && (
                         <p className="text-zinc-500 text-base line-clamp-2 mb-4">
                           {item.description || item.content}
                         </p>
                      )}
                      <div className="text-[13px] font-medium text-zinc-400 mt-auto">
                        {formatDate(item.createdAt)}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </PublicLayout>
  );
}
