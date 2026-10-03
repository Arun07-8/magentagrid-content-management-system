import { useState, useEffect, useRef } from 'react';
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
  Trash2,
} from 'lucide-react';
import type { Post, PostStatus } from '../../../shared/types';
import { useUserStore } from '../../../entities/user';
import { Button } from '../../../shared/ui';
import { ImageCropModal } from './ImageCropModal';

interface PostFormProps {
  initialData?: Partial<Post>;
  onSubmit: (formData: {
    title: string;
    description: string;
    content: string;
    imageUrl?: string;
    imageFile?: File | null;
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

  // Image handling state
  const [imageTab, setImageTab] = useState<'upload' | 'url'>(
    initialData?.imageUrl && !initialData.imageUrl.includes('/uploads/') ? 'url' : 'upload'
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || '');
  const [previewUrl, setPreviewUrl] = useState(initialData?.imageUrl || '');
  const [imageRemoved, setImageRemoved] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageValidationError, setImageValidationError] = useState<string | null>(null);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [cropFileName, setCropFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      if (initialData.title !== undefined) setTitle(initialData.title);
      if (initialData.description !== undefined) setDescription(initialData.description);
      if (initialData.content !== undefined) setContent(initialData.content);
      const existingImg = initialData.imageUrl || '';
      setImageUrl(existingImg);
      setPreviewUrl(existingImg);
      setImageError(false);
      setImageValidationError(null);
      setCropSrc(null);
      setImageFile(null);
      setImageRemoved(false);
      if (existingImg) {
        setImageTab(existingImg.includes('/uploads/') ? 'upload' : 'url');
      }
      if (initialData.category !== undefined) setCategory(initialData.category);
      if (initialData.status !== undefined) setStatus(initialData.status);
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
      let finalImageUrl: string | undefined = undefined;
      if (imageFile) {
        finalImageUrl = undefined;
      } else if (imageRemoved) {
        finalImageUrl = '';
      } else if (imageUrl.trim()) {
        finalImageUrl = imageUrl.trim();
      } else {
        finalImageUrl = '';
      }

      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        content: content.trim(),
        imageUrl: finalImageUrl,
        imageFile: imageFile || undefined,
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

  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  const handleFileSelect = (file: File) => {
    // Validate type
    if (!ALLOWED_TYPES.includes(file.type)) {
      setImageValidationError('Only JPG, PNG, and WebP images are supported.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }
    // Validate size
    if (file.size > MAX_FILE_SIZE) {
      setImageValidationError('Image must be smaller than 10MB.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }
    setImageValidationError(null);
    // Open crop modal
    const objectUrl = URL.createObjectURL(file);
    setCropFileName(file.name);
    setCropSrc(objectUrl);
  };

  const handleCropConfirm = (croppedFile: File) => {
    // Clean up old object URL if any
    if (cropSrc) URL.revokeObjectURL(cropSrc);
    setCropSrc(null);
    setImageFile(croppedFile);
    setImageRemoved(false);
    setImageError(false);
    setImageUrl('');
    const preview = URL.createObjectURL(croppedFile);
    setPreviewUrl(preview);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleCropCancel = () => {
    if (cropSrc) URL.revokeObjectURL(cropSrc);
    setCropSrc(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImageUrl('');
    setPreviewUrl('');
    setImageError(false);
    setImageRemoved(true);
    setImageValidationError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-6">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/admin/posts')}
            className="p-1.5 text-zinc-500 hover:text-zinc-950 rounded-lg hover:bg-white border border-zinc-200 transition-colors cursor-pointer shadow-xs"
            title="Back to posts"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
              {mode === 'create' ? 'Create Post' : 'Edit Post'}
            </h1>
            <p className="text-xs text-zinc-500 mt-0.5">
              {mode === 'create'
                ? 'Draft a new article with title, description, and markdown content.'
                : 'Modify article contents and manage publication settings.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {showSavedFeedback && (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 animate-in fade-in">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
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
        <div className="lg:col-span-8 space-y-5 bg-white p-5 sm:p-7 rounded-xl border border-zinc-200/80 shadow-xs">
          {/* Post Title */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider">
                Title <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-zinc-400 font-mono">{title.length}/200</span>
            </div>
            <input
              type="text"
              placeholder="e.g. Building Modern Applications with Clean Architecture"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (fieldErrors.title) setFieldErrors({ ...fieldErrors, title: undefined });
              }}
              className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-900 transition-all font-medium ${
                fieldErrors.title
                  ? 'border-rose-300 bg-rose-50/20'
                  : 'border-zinc-200 focus:border-zinc-900'
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
              <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider">
                Short Description <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-zinc-400 font-mono">
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
              className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-900 transition-all resize-none leading-relaxed ${
                fieldErrors.description
                  ? 'border-rose-300 bg-rose-50/20'
                  : 'border-zinc-200 focus:border-zinc-900'
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
            <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1.5">
              Article Content <span className="text-rose-500">*</span>
            </label>

            <div
              className={`border rounded-lg overflow-hidden bg-white focus-within:ring-1 focus-within:ring-zinc-900 transition-all ${
                fieldErrors.content
                  ? 'border-rose-300'
                  : 'border-zinc-200 focus-within:border-zinc-900'
              }`}
            >
              {/* Markdown Toolbar */}
              <div className="bg-zinc-50 border-b border-zinc-200 px-2.5 py-1.5 flex flex-wrap items-center gap-1 text-zinc-600">
                <button
                  type="button"
                  onClick={() => insertFormatting('**', '**')}
                  className="p-1 rounded hover:bg-zinc-200/80 hover:text-zinc-900 transition-colors cursor-pointer"
                  title="Bold (**text**)"
                >
                  <Bold className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('*', '*')}
                  className="p-1 rounded hover:bg-zinc-200/80 hover:text-zinc-900 transition-colors cursor-pointer"
                  title="Italic (*text*)"
                >
                  <Italic className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('<u>', '</u>')}
                  className="p-1 rounded hover:bg-zinc-200/80 hover:text-zinc-900 transition-colors cursor-pointer"
                  title="Underline"
                >
                  <Underline className="w-3.5 h-3.5" />
                </button>

                <div className="w-px h-3.5 bg-zinc-300 mx-1" />

                <button
                  type="button"
                  onClick={() => insertFormatting('## ')}
                  className="p-1 rounded hover:bg-zinc-200/80 hover:text-zinc-900 transition-colors cursor-pointer"
                  title="Heading 2 (## text)"
                >
                  <Heading className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('- ')}
                  className="p-1 rounded hover:bg-zinc-200/80 hover:text-zinc-900 transition-colors cursor-pointer"
                  title="Bullet list"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('1. ')}
                  className="p-1 rounded hover:bg-zinc-200/80 hover:text-zinc-900 transition-colors cursor-pointer"
                  title="Numbered list"
                >
                  <ListOrdered className="w-3.5 h-3.5" />
                </button>

                <div className="w-px h-3.5 bg-zinc-300 mx-1" />

                <button
                  type="button"
                  onClick={() => insertFormatting('[Link Title](', ')')}
                  className="p-1 rounded hover:bg-zinc-200/80 hover:text-zinc-900 transition-colors cursor-pointer"
                  title="Link"
                >
                  <LinkIcon className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('`', '`')}
                  className="p-1 rounded hover:bg-zinc-200/80 hover:text-zinc-900 transition-colors cursor-pointer"
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
                className="w-full p-4 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none resize-y leading-relaxed font-sans"
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
        <div className="lg:col-span-4 space-y-4">
          {/* Classification & Status */}
          <div className="bg-white p-5 rounded-xl border border-zinc-200/80 shadow-xs space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-xs sm:text-sm text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 cursor-pointer font-medium"
              >
                <option value="Technology">Technology</option>
                <option value="Lifestyle">Lifestyle</option>
                <option value="Business">Business</option>
                <option value="Design">Design</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider">
                  Publication Status
                </label>
                {!isAdmin && (
                  <span className="text-[10px] font-medium text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    Drafts only
                  </span>
                )}
              </div>
              <select
                value={status}
                disabled={!isAdmin}
                onChange={(e) => setStatus(e.target.value as PostStatus)}
                className={`w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-xs sm:text-sm text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 font-medium ${
                  !isAdmin ? 'opacity-70 cursor-not-allowed bg-zinc-100' : 'cursor-pointer'
                }`}
              >
                <option value="Draft">Draft</option>
                {isAdmin && <option value="Published">Published</option>}
              </select>
              {!isAdmin && (
                <p className="text-[11px] text-zinc-400 mt-1">
                  Only Admins can directly publish articles.
                </p>
              )}
            </div>
          </div>

          {/* Featured Image */}
          <div className="bg-white p-5 rounded-xl border border-zinc-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider">
                Featured Image
              </label>
              <span className="text-[11px] font-medium text-zinc-400">Optional</span>
            </div>

            {/* Mode Selector Tabs */}
            <div className="grid grid-cols-2 p-1 bg-zinc-100 rounded-lg text-xs font-medium text-zinc-600">
              <button
                type="button"
                onClick={() => setImageTab('upload')}
                className={`py-1.5 px-3 rounded-md transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  imageTab === 'upload'
                    ? 'bg-white text-zinc-900 shadow-xs font-semibold'
                    : 'text-zinc-500 hover:text-zinc-900'
                }`}
              >
                <UploadCloud className="w-3.5 h-3.5" />
                Upload File
              </button>
              <button
                type="button"
                onClick={() => setImageTab('url')}
                className={`py-1.5 px-3 rounded-md transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  imageTab === 'url'
                    ? 'bg-white text-zinc-900 shadow-xs font-semibold'
                    : 'text-zinc-500 hover:text-zinc-900'
                }`}
              >
                <LinkIcon className="w-3.5 h-3.5" />
                Image URL
              </button>
            </div>

            {/* Tab 1: Upload File */}
            {imageTab === 'upload' && (
              <div className="space-y-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg, image/png, image/webp"
                  multiple={false}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileSelect(file);
                  }}
                  className="hidden"
                  id="featured-image-file-input"
                />
                <label
                  htmlFor="featured-image-file-input"
                  className="border-2 border-dashed border-zinc-200 hover:border-zinc-400 hover:bg-zinc-50 rounded-lg p-4 text-center cursor-pointer transition-colors flex flex-col items-center justify-center gap-1.5 group block"
                >
                  <UploadCloud className="w-6 h-6 text-zinc-400 group-hover:text-zinc-600 transition-colors" />
                  <p className="text-xs font-medium text-zinc-700">
                    {imageFile ? imageFile.name : 'Click to choose an image file'}
                  </p>
                  <p className="text-[10px] text-zinc-400">JPG, PNG, WebP · Max 10MB</p>
                </label>
                {imageValidationError && (
                  <div className="flex items-center gap-1.5 text-xs text-rose-600 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{imageValidationError}</span>
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Image URL */}
            {imageTab === 'url' && (
              <div className="space-y-1.5">
                <input
                  type="text"
                  placeholder="https://example.com/image.jpg"
                  value={imageUrl}
                  onChange={(e) => {
                    const val = e.target.value;
                    setImageUrl(val);
                    setImageFile(null);
                    setImageRemoved(false);
                    setImageError(false);
                    setImageValidationError(null);
                    setPreviewUrl(val.trim());
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="w-full px-3 py-1.5 bg-white border border-zinc-200 rounded-lg text-xs text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900"
                />
                <p className="text-[11px] text-zinc-400">Enter a direct image link</p>
              </div>
            )}

            {/* Single Preview & Remove */}
            {previewUrl ? (
              <div className="space-y-2 pt-1">
                <div className="relative rounded-lg overflow-hidden aspect-[16/10] bg-zinc-100 border border-zinc-200/80">
                  {!imageError ? (
                    <img
                      src={previewUrl}
                      alt="Featured preview"
                      onError={() => setImageError(true)}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-zinc-400 gap-2 bg-zinc-50">
                      <AlertCircle className="w-6 h-6 text-zinc-400" />
                      <span className="text-xs font-medium text-zinc-500">Preview not available</span>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 p-1.5 bg-zinc-900/80 hover:bg-red-600 text-white rounded-lg transition-colors cursor-pointer shadow-sm"
                    title="Remove image"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                {/* Filename below preview */}
                <p className="text-[11px] text-zinc-400 truncate">
                  {imageFile ? imageFile.name : imageUrl ? imageUrl : 'Preview'}
                </p>
              </div>
            ) : (
              <div className="py-2 text-center text-[11px] text-zinc-400">
                No image selected. You can publish without an image.
              </div>
            )}
          </div>

          {/* Publishing Action Card */}
          <div className="bg-white p-4 rounded-xl border border-zinc-200/80 shadow-xs flex flex-col gap-2">
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
                leftIcon={<Eye className="w-4 h-4 text-zinc-500" />}
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

      {/* Crop Modal — rendered above everything */}
      {cropSrc && (
        <ImageCropModal
          imageSrc={cropSrc}
          fileName={cropFileName}
          onConfirm={handleCropConfirm}
          onCancel={handleCropCancel}
        />
      )}
    </div>
  );
}
