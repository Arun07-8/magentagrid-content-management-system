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
  Loader2,
  Eye,
} from 'lucide-react';
import type { Post, PostStatus } from '../../../shared/types';
import { useUserStore } from '../../../entities/user/model/userStore';

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

    // Safety check for role
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
    } catch (e) {
      // Retain values on error as required by test
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
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + (selected ? selected.length : 4));
    }, 0);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/admin/posts')}
            className="p-2 text-slate-500 hover:text-slate-800 rounded-xl hover:bg-white border border-transparent hover:border-slate-200 transition-all cursor-pointer"
            title="Back to posts"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {mode === 'create' ? 'Create Post' : 'Edit Post'}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {mode === 'create'
                ? 'Draft and publish a new article for your website.'
                : 'Update your post content and publish settings.'}
            </p>
          </div>
        </div>

        {showSavedFeedback && (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200 animate-in fade-in">
            <Check className="w-4 h-4" />
            <span>Changes saved successfully</span>
          </span>
        )}
      </div>

      {/* Global Form Error Message if any */}
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 text-red-700 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold">Unable to save post</p>
            <p className="text-xs text-red-600 mt-0.5">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Two-Column Form Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Post Details & Editor */}
        <div className="lg:col-span-8 space-y-6 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs">
          {/* Title Field */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Title <span className="text-red-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400">{title.length}/200</span>
            </div>
            <input
              type="text"
              placeholder="Enter post title..."
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (fieldErrors.title) setFieldErrors({ ...fieldErrors, title: undefined });
              }}
              className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium ${
                fieldErrors.title ? 'border-red-400 bg-red-50/20' : 'border-slate-200 focus:border-blue-500'
              }`}
            />
            {fieldErrors.title && (
              <p className="text-xs text-red-500 mt-1.5 font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {fieldErrors.title}
              </p>
            )}
          </div>

          {/* Short Description */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Short Description <span className="text-red-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400">{description.length}/500</span>
            </div>
            <textarea
              rows={3}
              placeholder="Enter a compelling short summary of your article..."
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (fieldErrors.description) setFieldErrors({ ...fieldErrors, description: undefined });
              }}
              className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all resize-none ${
                fieldErrors.description ? 'border-red-400 bg-red-50/20' : 'border-slate-200 focus:border-blue-500'
              }`}
            />
            {fieldErrors.description && (
              <p className="text-xs text-red-500 mt-1.5 font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {fieldErrors.description}
              </p>
            )}
          </div>

          {/* Main Content & Editor Toolbar */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Main Content <span className="text-red-500">*</span>
            </label>

            {/* Editor Container */}
            <div
              className={`border rounded-xl overflow-hidden bg-white focus-within:ring-2 focus-within:ring-blue-500/20 transition-all ${
                fieldErrors.content ? 'border-red-400' : 'border-slate-200 focus-within:border-blue-500'
              }`}
            >
              {/* Formatting Toolbar */}
              <div className="bg-slate-50/90 border-b border-slate-200/80 p-2 flex flex-wrap items-center gap-1 text-slate-600">
                <button
                  type="button"
                  onClick={() => insertFormatting('**', '**')}
                  className="p-1.5 rounded hover:bg-slate-200 hover:text-slate-900 transition-colors cursor-pointer"
                  title="Bold (**text**)"
                >
                  <Bold className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('*', '*')}
                  className="p-1.5 rounded hover:bg-slate-200 hover:text-slate-900 transition-colors cursor-pointer"
                  title="Italic (*text*)"
                >
                  <Italic className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('<u>', '</u>')}
                  className="p-1.5 rounded hover:bg-slate-200 hover:text-slate-900 transition-colors cursor-pointer"
                  title="Underline"
                >
                  <Underline className="w-4 h-4" />
                </button>

                <div className="w-px h-4 bg-slate-300 mx-1" />

                <button
                  type="button"
                  onClick={() => insertFormatting('## ')}
                  className="p-1.5 rounded hover:bg-slate-200 hover:text-slate-900 transition-colors cursor-pointer"
                  title="Heading 2 (## text)"
                >
                  <Heading className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('- ')}
                  className="p-1.5 rounded hover:bg-slate-200 hover:text-slate-900 transition-colors cursor-pointer"
                  title="Bullet list"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('1. ')}
                  className="p-1.5 rounded hover:bg-slate-200 hover:text-slate-900 transition-colors cursor-pointer"
                  title="Numbered list"
                >
                  <ListOrdered className="w-4 h-4" />
                </button>

                <div className="w-px h-4 bg-slate-300 mx-1" />

                <button
                  type="button"
                  onClick={() => insertFormatting('[Link Title](', ')')}
                  className="p-1.5 rounded hover:bg-slate-200 hover:text-slate-900 transition-colors cursor-pointer"
                  title="Link"
                >
                  <LinkIcon className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('`', '`')}
                  className="p-1.5 rounded hover:bg-slate-200 hover:text-slate-900 transition-colors cursor-pointer"
                  title="Code snippet"
                >
                  <Code className="w-4 h-4" />
                </button>
              </div>

              {/* Content Textarea */}
              <textarea
                id="post-content-area"
                rows={11}
                placeholder="Write your article content here..."
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                  if (fieldErrors.content) setFieldErrors({ ...fieldErrors, content: undefined });
                }}
                className="w-full p-4 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none resize-y leading-relaxed"
              />
            </div>
            {fieldErrors.content && (
              <p className="text-xs text-red-500 mt-1.5 font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {fieldErrors.content}
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Featured Image & Status & Actions */}
        <div className="lg:col-span-4 space-y-6">
          {/* Featured Image Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Featured Image URL
            </label>

            <input
              type="text"
              placeholder="https://images.unsplash.com/..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />

            {/* Thumbnail Preview */}
            {imageUrl ? (
              <div className="relative rounded-xl overflow-hidden aspect-[16/10] bg-slate-100 border border-slate-200/80">
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
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center bg-slate-50/60 flex flex-col items-center justify-center">
                <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
                <p className="text-xs font-semibold text-slate-600">Enter image URL above</p>
              </div>
            )}
          </div>

          {/* Category & Status Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
              >
                <option value="Technology">Technology</option>
                <option value="Lifestyle">Lifestyle</option>
                <option value="Business">Business</option>
                <option value="Design">Design</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Status
                </label>
                {!isAdmin && (
                  <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    Editor (Drafts only)
                  </span>
                )}
              </div>
              <select
                value={status}
                disabled={!isAdmin}
                onChange={(e) => setStatus(e.target.value as PostStatus)}
                className={`w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium ${
                  !isAdmin ? 'opacity-70 cursor-not-allowed bg-slate-100' : 'cursor-pointer'
                }`}
              >
                <option value="Draft">Draft</option>
                {isAdmin && <option value="Published">Published</option>}
              </select>
              {!isAdmin && (
                <p className="text-[11px] text-slate-400 mt-1">
                  Only Admins can publish posts directly.
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-2.5">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleAction('Draft')}
              className="flex-1 py-2.5 px-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium text-xs rounded-xl transition-colors cursor-pointer text-center disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin mx-auto text-slate-500" />
              ) : (
                'Save Draft'
              )}
            </button>

            {onPreview && (
              <button
                type="button"
                onClick={onPreview}
                className="flex-1 py-2.5 px-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium text-xs rounded-xl transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5 text-slate-400" />
                <span>Preview</span>
              </button>
            )}

            {isAdmin && (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleAction('Published')}
                className="flex-1 py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded-xl shadow-xs shadow-blue-600/25 transition-all cursor-pointer text-center disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin mx-auto text-white" />
                ) : (
                  'Publish'
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
