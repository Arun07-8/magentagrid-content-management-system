import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminSidebar } from './components/AdminSidebar';
import { AdminHeader } from './components/AdminHeader';
import { PostForm } from '../../features/post/ui/PostForm';
import { useCreatePost } from '../../entities/post/hooks/usePosts';
import type { PostStatus } from '../../shared/types';

export default function CreatePost() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const createMutation = useCreatePost();

  const handleCreate = async (formData: {
    title: string;
    description: string;
    content: string;
    imageUrl?: string;
    category?: string;
    status: PostStatus;
  }) => {
    setSubmitError(null);
    try {
      await createMutation.mutateAsync(formData);
      navigate(`/admin/posts`);
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to create post. Please try again.');
      throw err;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 flex">
      {/* Sidebar */}
      <AdminSidebar
        currentTab="create-post"
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <AdminHeader onToggleMobileMenu={() => setMobileMenuOpen(true)} />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 flex-1">
          <PostForm
            mode="create"
            onSubmit={handleCreate}
            isSubmitting={createMutation.isPending}
            errorMessage={submitError}
            onPreview={() => navigate('/admin/posts/preview')}
          />
        </main>
      </div>
    </div>
  );
}
