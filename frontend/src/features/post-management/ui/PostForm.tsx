import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UploadCloud,
  Bold,
  Italic,
  Underline,
  Heading,
  List,
  ListOrdered,
  Link as LinkIcon,
  Code,
  ArrowLeft,
  Check,
  AlertCircle,
  Eye,
} from 'lucide-react';
import type { Post, PostStatus } from '../../../shared/types';
import { useUserStore } from '../../../entities/user';
import { Button } from '../../../shared/ui';

interface PostFormProps {
  initialData?: Partial<Post>;
  onSubmit: (formData: {
    title: string;
    description: string;
    content: string;
    imageUrl?: string;
    category?: string;
    status: PostStatus;
  }) => Promise<void>;
  isSubmitting: boolean;
  errorMessage?: string | null;
  mode: 'create' | 'edit';
  onPreview?: () => void;
}

export function PostForm({
  initialData,
  onSubmit,
  isSubmitting,
  errorMessage,
  mode,
  onPreview,
}: PostFormProps) {
  const navigate = useNavigate();
  const { role } = useUserStore();
  const isAdmin = role === 'admin';

  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [imageUrl, setImageUrl] = useState(
    initialData?.imageUrl ||
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80'
  );
  const [category, setCategory] = useState(initialData?.category || 'Technology');
  const [status, setStatus] = useState<PostStatus>(initialData?.status || 'Draft');

  const [fieldErrors, setFieldErrors] = useState<{
    title?: string;
    description?: string;
    content?: string;
  }>({});
  const [showSavedFeedback, setShowSavedFeedback] = useState(false);

  useEffect(() => {
    if (initialData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (initialData.title) setTitle(initialData.title);
      if (initialData.description) setDescription(initialData.description);
      if (initialData.content) setContent(initialData.content);
      if (initialData.imageUrl) setImageUrl(initialData.imageUrl);
      if (initialData.category) setCategory(initialData.category);
      if (initialData.status) setStatus(initialData.status);
    }
  }, [initialData]);

  const validate = (): boolean => {
    const errors: { title?: string; description?: string; content?: string } = {};

    if (!title.trim()) {
      errors.title = 'Title is required';
    } else if (title.trim().length > 200) {
      errors.title = 'Title cannot exceed 200 characters';
    }

    if (!description.trim()) {
      errors.description = 'Short description is required';
    } else if (description.trim().length > 500) {
      errors.description = 'Short description cannot exceed 500 characters';
    }

    if (!content.trim()) {
      errors.content = 'Main content is required';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAction = async (targetStatus?: PostStatus) => {
    if (!validate() || isSubmitting) return;

    const finalStatus = targetStatus || status;
    const safeStatus = !isAdmin && finalStatus === 'Published' ? 'Draft' : finalStatus;

    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        content: content.trim(),
        imageUrl: imageUrl.trim(),
        category,
        status: safeStatus,
      });

      setShowSavedFeedback(true);
      setTimeout(() => setShowSavedFeedback(false), 2500);
    } catch {
      // Retain values on error
    }
  };

  const insertFormatting = (prefix: string, suffix: string = '') => {
    const textarea = document.getElementById('post-content-area') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.substring(start, end);
    const replacement = `${prefix}${selected || 'text'}${suffix}`;

    const newContent = content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + (selected ? selected.length : 4)
      );
    }, 0);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/admin/posts')}
            className="p-1.5 text-slate-500 hover:text-slate-900 rounded-md hover:bg-white border border-slate-200 transition-colors cursor-pointer"
            title="Back to posts"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {mode === 'create' ? 'Create Post' : 'Edit Post'}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {mode === 'create'
                ? 'Draft a new article with title, description, and content.'
                : 'Modify article contents and manage publication settings.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {showSavedFeedback && (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 px-3 py-1 rounded-md border border-emerald-200 animate-in fade-in">
              <Check className="w-3.5 h-3.5" />
              <span>Saved successfully</span>
            </span>
          )}

          <Button
            variant="secondary"
            size="sm"
            disabled={isSubmitting}
            onClick={() => handleAction('Draft')}
          >
            Save Draft
          </Button>

          {isAdmin && (
            <Button
              size="sm"
              isLoading={isSubmitting}
              onClick={() => handleAction('Published')}
            >
              {mode === 'create' ? 'Publish Post' : 'Save Changes'}
            </Button>
          )}
        </div>
      </div>

      {errorMessage && (
        <div className="bg-white border border-rose-200 rounded-xl p-4 flex items-start gap-3 text-rose-700 text-sm shadow-xs">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-500 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-xs">Unable to save post</p>
            <p className="text-xs text-rose-600 mt-0.5">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Editor Grid: 8 cols main, 4 cols sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-5 bg-white p-5 sm:p-7 rounded-xl border border-slate-200/80 shadow-xs">
          {/* Post Title */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Title <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400 font-mono">{title.length}/200</span>
            </div>
            <input
              type="text"
              placeholder="e.g. Building Modern Applications with Clean Architecture"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (fieldErrors.title) setFieldErrors({ ...fieldErrors, title: undefined });
              }}
              className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-slate-900/10 transition-all font-medium ${
                fieldErrors.title
                  ? 'border-rose-300 bg-rose-50/20'
                  : 'border-slate-200 focus:border-slate-900'
              }`}
            />
            {fieldErrors.title && (
              <p className="text-xs text-rose-600 mt-1 font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {fieldErrors.title}
              </p>
            )}
          </div>

          {/* Short Description */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Short Description <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400 font-mono">
                {description.length}/500
              </span>
            </div>
            <textarea
              rows={3}
              placeholder="A brief editorial summary of your article..."
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (fieldErrors.description)
                  setFieldErrors({ ...fieldErrors, description: undefined });
              }}
              className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-slate-900/10 transition-all resize-none leading-relaxed ${
                fieldErrors.description
                  ? 'border-rose-300 bg-rose-50/20'
                  : 'border-slate-200 focus:border-slate-900'
              }`}
            />
            {fieldErrors.description && (
              <p className="text-xs text-rose-600 mt-1 font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {fieldErrors.description}
              </p>
            )}
          </div>

          {/* Markdown Content Editor */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Article Content <span className="text-rose-500">*</span>
            </label>

            <div
              className={`border rounded-lg overflow-hidden bg-white focus-within:ring-2 focus-within:ring-slate-900/10 transition-all ${
                fieldErrors.content
                  ? 'border-rose-300'
                  : 'border-slate-200 focus-within:border-slate-900'
              }`}
            >
              {/* Markdown Toolbar */}
              <div className="bg-slate-50 border-b border-slate-200/80 px-2.5 py-1.5 flex flex-wrap items-center gap-1 text-slate-600">
                <button
                  type="button"
                  onClick={() => insertFormatting('**', '**')}
                  className="p-1 rounded hover:bg-slate-200/80 hover:text-slate-900 transition-colors cursor-pointer"
                  title="Bold (**text**)"
                >
                  <Bold className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('*', '*')}
                  className="p-1 rounded hover:bg-slate-200/80 hover:text-slate-900 transition-colors cursor-pointer"
                  title="Italic (*text*)"
                >
                  <Italic className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('<u>', '</u>')}
                  className="p-1 rounded hover:bg-slate-200/80 hover:text-slate-900 transition-colors cursor-pointer"
                  title="Underline"
                >
                  <Underline className="w-3.5 h-3.5" />
                </button>

                <div className="w-px h-3.5 bg-slate-300 mx-1" />

                <button
                  type="button"
                  onClick={() => insertFormatting('## ')}
                  className="p-1 rounded hover:bg-slate-200/80 hover:text-slate-900 transition-colors cursor-pointer"
                  title="Heading 2 (## text)"
                >
                  <Heading className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('- ')}
                  className="p-1 rounded hover:bg-slate-200/80 hover:text-slate-900 transition-colors cursor-pointer"
                  title="Bullet list"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('1. ')}
                  className="p-1 rounded hover:bg-slate-200/80 hover:text-slate-900 transition-colors cursor-pointer"
                  title="Numbered list"
                >
                  <ListOrdered className="w-3.5 h-3.5" />
                </button>

                <div className="w-px h-3.5 bg-slate-300 mx-1" />

                <button
                  type="button"
                  onClick={() => insertFormatting('[Link Title](', ')')}
                  className="p-1 rounded hover:bg-slate-200/80 hover:text-slate-900 transition-colors cursor-pointer"
                  title="Link"
                >
                  <LinkIcon className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('`', '`')}
                  className="p-1 rounded hover:bg-slate-200/80 hover:text-slate-900 transition-colors cursor-pointer"
                  title="Code snippet"
                >
                  <Code className="w-3.5 h-3.5" />
                </button>
              </div>

              <textarea
                id="post-content-area"
                rows={12}
                placeholder="Write your article paragraphs here. Double line-break for new paragraphs..."
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                  if (fieldErrors.content)
                    setFieldErrors({ ...fieldErrors, content: undefined });
                }}
                className="w-full p-4 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none resize-y leading-relaxed font-sans"
              />
            </div>
            {fieldErrors.content && (
              <p className="text-xs text-rose-600 mt-1 font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {fieldErrors.content}
              </p>
            )}
          </div>
        </div>

        {/* Sidebar Settings Area */}
        <div className="lg:col-span-4 space-y-5">
          {/* Classification & Status */}
          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 cursor-pointer"
              >
                <option value="Technology">Technology</option>
                <option value="Lifestyle">Lifestyle</option>
                <option value="Business">Business</option>
                <option value="Design">Design</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Publication Status
                </label>
                {!isAdmin && (
                  <span className="text-[10px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    Drafts only
                  </span>
                )}
              </div>
              <select
                value={status}
                disabled={!isAdmin}
                onChange={(e) => setStatus(e.target.value as PostStatus)}
                className={`w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 font-medium ${
                  !isAdmin ? 'opacity-70 cursor-not-allowed bg-slate-100' : 'cursor-pointer'
                }`}
              >
                <option value="Draft">Draft</option>
                {isAdmin && <option value="Published">Published</option>}
              </select>
              {!isAdmin && (
                <p className="text-[11px] text-slate-400 mt-1">
                  Only Admins can directly publish articles.
                </p>
              )}
            </div>
          </div>

          {/* Featured Image */}
          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Featured Image URL
            </label>

            <input
              type="text"
              placeholder="https://images.unsplash.com/..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
            />

            {imageUrl ? (
              <div className="relative rounded-lg overflow-hidden aspect-[16/10] bg-slate-100 border border-slate-200/80">
                <img
                  src={imageUrl}
                  alt="Featured preview"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80';
                  }}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="border border-dashed border-slate-200 rounded-lg p-5 text-center bg-slate-50/60 flex flex-col items-center justify-center">
                <UploadCloud className="w-6 h-6 text-slate-400 mb-1" />
                <p className="text-xs text-slate-500 font-medium">Enter an image URL</p>
              </div>
            )}
          </div>

          {/* Publishing Action Card */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col gap-2">
            <Button
              variant="secondary"
              disabled={isSubmitting}
              onClick={() => handleAction('Draft')}
              className="w-full"
            >
              Save as Draft
            </Button>

            {onPreview && (
              <Button
                variant="secondary"
                onClick={onPreview}
                leftIcon={<Eye className="w-4 h-4 text-slate-500" />}
                className="w-full"
              >
                Preview Article
              </Button>
            )}

            {isAdmin && (
              <Button
                disabled={isSubmitting}
                isLoading={isSubmitting}
                onClick={() => handleAction('Published')}
                className="w-full"
              >
                {mode === 'create' ? 'Publish Now' : 'Save Changes'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
