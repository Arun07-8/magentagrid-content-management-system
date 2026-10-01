import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { AdminSidebar } from './components/AdminSidebar';
import { AdminHeader } from './components/AdminHeader';
import { PostForm } from '../../features/post/ui/PostForm';
import { useCmsPost, useCmsPosts, useUpdatePost } from '../../entities/post/hooks/usePosts';
import type { PostStatus } from '../../shared/types';

export default function EditPost() {
  const navigate = useNavigate();
  const { id: paramId } = useParams<{ id: string }>();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // If no ID passed directly in route, get first post from list as fallback
  const { data: allPosts } = useCmsPosts();
  const effectiveId = paramId || (allPosts && allPosts.length > 0 ? (allPosts[0]._id || allPosts[0].id) : undefined);

  const { data: post, isLoading, isError, error } = useCmsPost(effectiveId);
  const updateMutation = useUpdatePost();

  const handleUpdate = async (formData: {
    title: string;
    description: string;
    content: string;
    imageUrl?: string;
    category?: string;
    status: PostStatus;
  }) => {
    if (!effectiveId) return;
    setSubmitError(null);

    try {
      await updateMutation.mutateAsync({
        id: effectiveId,
        payload: formData,
      });
      navigate('/admin/posts');
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to update post.');
      throw err;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 flex">
      {/* Sidebar */}
      <AdminSidebar
        currentTab="edit-post"
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <AdminHeader onToggleMobileMenu={() => setMobileMenuOpen(true)} />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 flex-1">
          {isLoading ? (
            <div className="py-24 flex flex-col items-center justify-center text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-2" />
              <p className="text-sm font-medium">Loading post details...</p>
            </div>
          ) : isError ? (
            <div className="py-16 text-center text-red-500 space-y-3">
              <AlertCircle className="w-10 h-10 mx-auto text-red-500" />
              <p className="text-base font-semibold">Post could not be loaded</p>
              <p className="text-xs text-slate-400">{(error as any)?.message}</p>
              <button
                onClick={() => navigate('/admin/posts')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Posts</span>
              </button>
            </div>
          ) : !post ? (
            <div className="py-16 text-center text-slate-400">
              <p>No post found to edit.</p>
            </div>
          ) : (
            <PostForm
              mode="edit"
              initialData={post}
              onSubmit={handleUpdate}
              isSubmitting={updateMutation.isPending}
              errorMessage={submitError}
              onPreview={() => navigate(`/admin/posts/preview/${effectiveId}`)}
            />
          )}
        </main>
      </div>
    </div>
  );
}
