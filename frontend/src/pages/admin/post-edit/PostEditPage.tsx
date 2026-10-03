import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { AdminLayout } from '../../../widgets';
import { PostForm, useUpdatePost } from '../../../features/post-management';
import { useCmsPost, useCmsPosts } from '../../../entities/post';
import { Spinner, ErrorState, Button } from '../../../shared/ui';
import type { PostStatus } from '../../../shared/types';

export default function PostEditPage() {
  const navigate = useNavigate();
  const { id: paramId } = useParams<{ id: string }>();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { data: allPosts } = useCmsPosts();
  const effectiveId =
    paramId || (allPosts && allPosts.length > 0 ? allPosts[0]._id || allPosts[0].id : undefined);

  const { data: post, isLoading, isError, error } = useCmsPost(effectiveId);
  const updateMutation = useUpdatePost();

  const handleUpdate = async (formData: {
    title: string;
    description: string;
    content: string;
    imageUrl?: string;
    imageFile?: File | null;
    category?: string;
    status: PostStatus;
  }) => {
    if (!effectiveId) return;
    setSubmitError(null);

    try {
      await updateMutation.mutateAsync({
        id: effectiveId,
        payload: {
          title: formData.title,
          description: formData.description,
          content: formData.content,
          imageUrl: formData.imageUrl,
          image: formData.imageFile,
          category: formData.category,
          status: formData.status,
        },
      });
      navigate('/admin/posts');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update post.';
      setSubmitError(message);
      throw err;
    }
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
              onClick={() => navigate('/admin/posts')}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Return to Posts
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
          onPreview={() => navigate(`/admin/posts/preview/${effectiveId}`)}
        />
      )}
    </AdminLayout>
  );
}

export const EditPostPage = PostEditPage;
