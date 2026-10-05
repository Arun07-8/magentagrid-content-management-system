import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { AdminLayout } from '../../widgets';
import { PostForm } from '../../features/post-management';
import type { PostFormPreviewData } from '../../features/post-management';
import { useCmsPost, useUpdatePost } from '../../entities/post';
import { Spinner, ErrorState, Button } from '../../shared/ui';
import type { PostStatus } from '../../shared/types';
import { toast } from '../../store/toast';

export default function PostEditPage() {
  const navigate = useNavigate();
  const { id: postId } = useParams<{ id: string }>();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { data: post, isLoading, isError, error } = useCmsPost(postId);
  const updateMutation = useUpdatePost();

  const handleUpdate = async (formData: {
    title: string;
    description: string;
    content: string;
    imageUrl?: string;
    imageFile?: File | null;
    status: PostStatus;
  }) => {
    if (!postId) return;
    setSubmitError(null);

    try {
      await updateMutation.mutateAsync({
        id: postId,
        payload: {
          title: formData.title,
          description: formData.description,
          content: formData.content,
          imageUrl: formData.imageUrl,
          image: formData.imageFile,
          status: formData.status,
        },
      });
      toast.success('Post updated successfully!');
      navigate('/admin/pages?section=blog');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update post.';
      setSubmitError(message);
      toast.error(message);
      throw err;
    }
  };

  const handlePreview = (previewData: PostFormPreviewData) => {
    // Always use current form state; pass postId so Preview page can show it
    // but the actual content always comes from navigation state
    navigate(`/admin/posts/preview/${postId ?? ''}`, { state: { previewData } });
  };

  return (
    <AdminLayout currentTab="post-edit" showSearch={false}>
      {isLoading ? (
        <Spinner fullHeight text="Loading post details..." />
      ) : isError ? (
        <ErrorState
          title="Post could not be loaded"
          message={error?.message}
          action={
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/admin/pages?section=blog')}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Return to Blog Section
            </Button>
          }
        />
      ) : !post ? (
        <div className="py-16 text-center text-zinc-400">
          <p>No post found to edit.</p>
        </div>
      ) : (
        <PostForm
          mode="edit"
          initialData={post}
          onSubmit={handleUpdate}
          isSubmitting={updateMutation.isPending}
          errorMessage={submitError}
          onPreview={handlePreview}
        />
      )}
    </AdminLayout>
  );
}

export const EditPostPage = PostEditPage;
