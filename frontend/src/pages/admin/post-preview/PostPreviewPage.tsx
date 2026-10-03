import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { AdminLayout } from '../../../widgets';
import { Logo, Spinner, Badge } from '../../../shared/ui';
import { PostView, useCmsPost, useCmsPosts } from '../../../entities/post';
import { formatDate } from '../../../shared/lib';

export default function PostPreviewPage() {
  const navigate = useNavigate();
  const { id: paramId } = useParams<{ id: string }>();

  const { data: allPosts } = useCmsPosts();
  const effectiveId =
    paramId || (allPosts && allPosts.length > 0 ? allPosts[0]._id || allPosts[0].id : undefined);

  const { data: post, isLoading, isError } = useCmsPost(effectiveId);

  const formattedDate = formatDate(post?.createdAt) || 'Preview date';

  return (
    <AdminLayout currentTab="post-preview" showSearch={false}>
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-xl border border-zinc-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/posts')}
            className="p-1.5 text-zinc-500 hover:text-zinc-950 rounded-lg hover:bg-zinc-100 transition-colors cursor-pointer"
            title="Back to posts"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold text-zinc-900 tracking-tight">
                Preview Article
              </h1>
              <Badge variant="neutral">Live Preview</Badge>
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">
              Preview how this article appears to readers on the website.
            </p>
          </div>
        </div>
      </div>

      {/* Frame simulation container */}
      <div className="flex justify-center transition-all duration-200 py-2">
        <div className="max-w-4xl w-full bg-white rounded-xl shadow-sm border border-zinc-200/90 overflow-hidden transition-all duration-200">
          {/* Simulated public top navigation */}
          <div className="bg-white border-b border-zinc-100 px-5 py-3.5 flex items-center justify-between">
            <Logo variant="dark" />
            <div className="hidden sm:flex items-center gap-5 text-xs font-medium text-zinc-500">
              <span className="hover:text-zinc-900 cursor-pointer">Home</span>
              <span className="hover:text-zinc-900 cursor-pointer">About</span>
              <span className="text-zinc-900 font-semibold cursor-pointer">Blog</span>
            </div>
          </div>

          <div className="p-6 sm:p-10">
            {isLoading ? (
              <Spinner fullHeight text="Loading article preview..." />
            ) : isError || !post ? (
              <div className="py-14 text-center text-zinc-500 space-y-2">
                <AlertCircle className="w-7 h-7 mx-auto text-amber-500" />
                <p className="text-sm font-semibold text-zinc-800">Article preview unavailable</p>
                <p className="text-xs text-zinc-400">
                  Select an existing article from the posts table to preview.
                </p>
              </div>
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
        </div>
      </div>
    </AdminLayout>
  );
}

export const PreviewPostPage = PostPreviewPage;
