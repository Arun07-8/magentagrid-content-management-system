import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../../widgets';
import { PostForm, useCreatePost } from '../../../features/post-management';
import type { PostStatus } from '../../../shared/types';

export default function PostCreatePage() {
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const createMutation = useCreatePost();

  const handleCreate = async (formData: {
    title: string;
    description: string;
    content: string;
    imageUrl?: string;
    imageFile?: File | null;
    category?: string;
    status: PostStatus;
  }) => {
    setSubmitError(null);
    try {
      await createMutation.mutateAsync({
        title: formData.title,
        description: formData.description,
        content: formData.content,
        imageUrl: formData.imageUrl,
        image: formData.imageFile,
        category: formData.category,
        status: formData.status,
      });
      navigate(`/admin/posts`);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to create post. Please try again.';
      setSubmitError(message);
      throw err;
    }
  };

  return (
    <AdminLayout currentTab="post-create" showSearch={false}>
      <PostForm
        mode="create"
        onSubmit={handleCreate}
        isSubmitting={createMutation.isPending}
        errorMessage={submitError}
        onPreview={() => navigate('/admin/posts/preview')}
      />
    </AdminLayout>
  );
}

export const CreatePostPage = PostCreatePage;
