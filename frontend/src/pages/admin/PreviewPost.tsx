import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Monitor, Tablet, Smartphone, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { AdminSidebar } from './components/AdminSidebar';
import { AdminHeader } from './components/AdminHeader';
import { Logo } from '../../components/Logo';
import { PostView } from '../../entities/post/ui/PostView';
import { useCmsPost, useCmsPosts } from '../../entities/post/hooks/usePosts';

type DeviceMode = 'desktop' | 'tablet' | 'mobile';

export default function PreviewPost() {
  const navigate = useNavigate();
  const { id: paramId } = useParams<{ id: string }>();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop');

  const { data: allPosts } = useCmsPosts();
  const effectiveId = paramId || (allPosts && allPosts.length > 0 ? (allPosts[0]._id || allPosts[0].id) : undefined);

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

  const formattedDate = post?.createdAt
    ? new Date(post.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Preview date';

  return (
    <div className="min-h-screen bg-slate-100/70 flex">
      {/* Sidebar */}
      <AdminSidebar
        currentTab="preview-post"
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <AdminHeader onToggleMobileMenu={() => setMobileMenuOpen(true)} />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 flex-1">
          {/* Top Controls: Title & Device Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/admin/posts')}
                className="p-2 text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                title="Back to posts"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Preview Post
                </h1>
                <p className="text-xs text-slate-500">
                  See how your post renders on the live website across devices.
                </p>
              </div>
            </div>

            {/* Device Switcher Buttons */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200/60 self-start sm:self-auto">
              <button
                onClick={() => setDeviceMode('desktop')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  deviceMode === 'desktop'
                    ? 'bg-white text-blue-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Desktop</span>
              </button>

              <button
                onClick={() => setDeviceMode('tablet')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  deviceMode === 'tablet'
                    ? 'bg-white text-blue-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Tablet className="w-3.5 h-3.5" />
                <span>Tablet</span>
              </button>

              <button
                onClick={() => setDeviceMode('mobile')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  deviceMode === 'mobile'
                    ? 'bg-white text-blue-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile</span>
              </button>
            </div>
          </div>

          {/* Device Preview Viewport Container */}
          <div className="flex justify-center transition-all duration-300 py-4">
            <div
              className={`${getContainerWidth()} bg-white rounded-2xl shadow-xl border border-slate-200/80 overflow-hidden transition-all duration-300`}
            >
              {/* Simulated Public Website Preview Header */}
              <div className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
                <Logo variant="dark" />
                <div className="hidden sm:flex items-center gap-6 text-xs font-medium text-slate-600">
                  <span className="hover:text-blue-600 cursor-pointer">Home</span>
                  <span className="hover:text-blue-600 cursor-pointer">About</span>
                  <span className="hover:text-blue-600 cursor-pointer">News</span>
                  <span className="text-blue-600 font-semibold cursor-pointer">Blog</span>
                </div>
              </div>

              {/* Post Content using shared PostView */}
              <div className="p-6 sm:p-10">
                {isLoading ? (
                  <div className="py-20 flex flex-col items-center justify-center text-slate-400">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-2" />
                    <p className="text-xs">Loading post preview...</p>
                  </div>
                ) : isError || !post ? (
                  <div className="py-16 text-center text-slate-500 space-y-2">
                    <AlertCircle className="w-8 h-8 mx-auto text-amber-500" />
                    <p className="text-sm font-semibold">Post preview unavailable</p>
                    <p className="text-xs text-slate-400">Select an existing post from the post list to preview.</p>
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
        </main>
      </div>
    </div>
  );
}
