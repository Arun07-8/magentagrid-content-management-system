import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Monitor, Tablet, Smartphone, ArrowLeft, AlertCircle } from 'lucide-react';
import { AdminLayout } from '../../../widgets';
import { Logo, Spinner, Badge } from '../../../shared/ui';
import { PostView, useCmsPost, useCmsPosts } from '../../../entities/post';
import { formatDate } from '../../../shared/lib';

type DeviceMode = 'desktop' | 'tablet' | 'mobile';

export default function PostPreviewPage() {
  const navigate = useNavigate();
  const { id: paramId } = useParams<{ id: string }>();
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop');

  const { data: allPosts } = useCmsPosts();
  const effectiveId =
    paramId || (allPosts && allPosts.length > 0 ? allPosts[0]._id || allPosts[0].id : undefined);

  const { data: post, isLoading, isError } = useCmsPost(effectiveId);

  const getContainerWidth = () => {
    switch (deviceMode) {
      case 'desktop':
        return 'max-w-4xl w-full';
      case 'tablet':
        return 'max-w-2xl w-full';
      case 'mobile':
        return 'max-w-sm w-full';
    }
  };

  const formattedDate = formatDate(post?.createdAt) || 'Preview date';

  return (
    <AdminLayout currentTab="post-preview" showSearch={false}>
      {/* Top Header Card with Device Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/posts')}
            className="p-1.5 text-slate-500 hover:text-slate-900 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
            title="Back to posts"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                Preview Article
              </h1>
              <Badge variant="neutral">Live Preview</Badge>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Simulate how this article renders for public readers across viewports.
            </p>
          </div>
        </div>

        {/* Viewport Switcher */}
        <div className="flex items-center bg-slate-100/90 border border-slate-200/80 rounded-lg p-0.5 self-start sm:self-auto text-xs">
          <button
            onClick={() => setDeviceMode('desktop')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all cursor-pointer font-medium ${
              deviceMode === 'desktop'
                ? 'bg-white text-slate-900 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Monitor className="w-3.5 h-3.5 text-slate-500" />
            <span>Desktop</span>
          </button>

          <button
            onClick={() => setDeviceMode('tablet')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all cursor-pointer font-medium ${
              deviceMode === 'tablet'
                ? 'bg-white text-slate-900 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Tablet className="w-3.5 h-3.5 text-slate-500" />
            <span>Tablet</span>
          </button>

          <button
            onClick={() => setDeviceMode('mobile')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all cursor-pointer font-medium ${
              deviceMode === 'mobile'
                ? 'bg-white text-slate-900 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-slate-500" />
            <span>Mobile</span>
          </button>
        </div>
      </div>

      {/* Frame simulation container */}
      <div className="flex justify-center transition-all duration-200 py-2">
        <div
          className={`${getContainerWidth()} bg-white rounded-xl shadow-md border border-slate-200/90 overflow-hidden transition-all duration-200`}
        >
          {/* Simulated public top navigation */}
          <div className="bg-white border-b border-slate-100 px-5 py-3.5 flex items-center justify-between">
            <Logo variant="dark" />
            <div className="hidden sm:flex items-center gap-5 text-xs font-medium text-slate-500">
              <span className="hover:text-slate-900 cursor-pointer">Home</span>
              <span className="hover:text-slate-900 cursor-pointer">About</span>
              <span className="text-slate-900 font-semibold cursor-pointer">Blog</span>
            </div>
          </div>

          <div className="p-6 sm:p-10">
            {isLoading ? (
              <Spinner fullHeight text="Loading article preview..." />
            ) : isError || !post ? (
              <div className="py-14 text-center text-slate-500 space-y-2">
                <AlertCircle className="w-7 h-7 mx-auto text-amber-500" />
                <p className="text-sm font-semibold text-slate-800">Article preview unavailable</p>
                <p className="text-xs text-slate-400">
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
