import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../widgets';
import { PostForm } from '../../features/post-management';
import type { PostFormPreviewData } from '../../features/post-management';
import { useCreatePost } from '../../entities/post';
import type { PostStatus } from '../../shared/types';

import { toast } from '../../store/toast';

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
        status: formData.status,
      });
      toast.success('Post created successfully!');
      navigate('/admin/pages?section=blog');
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to create post. Please try again.';
      setSubmitError(message);
      toast.error(message);
      throw err;
    }
  };

  const handlePreview = (previewData: PostFormPreviewData) => {
    navigate('/admin/posts/preview', { state: { previewData } });
  };

  return (
    <AdminLayout currentTab="post-create" showSearch={false}>
      <PostForm
        mode="create"
        onSubmit={handleCreate}
        isSubmitting={createMutation.isPending}
        errorMessage={submitError}
        onPreview={handlePreview}
      />
    </AdminLayout>
  );
}

export const CreatePostPage = PostCreatePage;
