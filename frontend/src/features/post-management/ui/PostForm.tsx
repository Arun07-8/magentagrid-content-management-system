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
  Image as ImageIcon,
} from 'lucide-react';
import type { Post, PostStatus } from '../../../shared/types';
import { useUserStore } from '../../../entities/user';
import { ImageCropModal } from './ImageCropModal';

export interface PostFormPreviewData {
  title: string;
  description: string;
  content: string;
  imageUrl?: string;
  previewObjectUrl?: string; // temporary blob URL for local file preview
  status: PostStatus;
}

interface PostFormProps {
  initialData?: Partial<Post>;
  onSubmit: (formData: {
    title: string;
    description: string;
    content: string;
    imageUrl?: string;
    imageFile?: File | null;
    status: PostStatus;
  }) => Promise<void>;
  isSubmitting: boolean;
  errorMessage?: string | null;
  mode: 'create' | 'edit';
  onPreview?: (data: PostFormPreviewData) => void;
}

export function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).filter(Boolean).length;
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

  const [status, setStatus] = useState<PostStatus>(initialData?.status || 'Draft');

  const [fieldErrors, setFieldErrors] = useState<{
    title?: string;
    description?: string;
    content?: string;
  }>({});
  const [showSavedFeedback, setShowSavedFeedback] = useState(false);

  useEffect(() => {
    if (initialData) {
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
      if (initialData.status !== undefined) setStatus(initialData.status);
    }
  }, [initialData]);

  const validate = (): boolean => {
    const errors: { title?: string; description?: string; content?: string } = {};

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      errors.title = 'Title is required';
    } else if (trimmedTitle.length < 5) {
      errors.title = 'Title must be at least 5 characters';
    } else if (trimmedTitle.length > 100) {
      errors.title = 'Title cannot exceed 100 characters';
    }

    const trimmedDesc = description.trim();
    if (!trimmedDesc) {
      errors.description = 'Short description is required';
    } else if (trimmedDesc.length < 20) {
      errors.description = 'Short description must be at least 20 characters';
    } else if (trimmedDesc.length > 300) {
      errors.description = 'Short description cannot exceed 300 characters';
    }

    const trimmedContent = content.trim();
    const wordCount = countWords(trimmedContent);
    if (!trimmedContent) {
      errors.content = 'Main content is required';
    } else if (wordCount < 150) {
      errors.content = `Main content must be at least 150 words (currently ${wordCount} words)`;
    } else if (wordCount > 500) {
      errors.content = `Main content cannot exceed 500 words (currently ${wordCount} words)`;
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
    if (!ALLOWED_TYPES.includes(file.type)) {
      setImageValidationError('Only JPG, PNG, and WebP are supported.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setImageValidationError('Image must be smaller than 10MB.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }
    setImageValidationError(null);
    const objectUrl = URL.createObjectURL(file);
    setCropFileName(file.name);
    setCropSrc(objectUrl);
  };

  const handleCropConfirm = (croppedFile: File) => {
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
    <div className="flex flex-col flex-1 h-full min-h-0 bg-white rounded-[28px] border-2 border-zinc-200 shadow-[0_12px_40px_rgba(0,0,0,0.08),0_4px_12px_rgba(0,0,0,0.04)] overflow-hidden">
      {/* Editor Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 lg:px-8 py-5 border-b-2 border-zinc-100 bg-white flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/admin/pages?section=blog')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-zinc-600 bg-zinc-100 hover:bg-zinc-200 hover:text-zinc-900 rounded-full transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Blog CMS
          </button>
          <div className="w-px h-4 bg-zinc-200" />
          <h1 className="text-base sm:text-lg font-bold text-zinc-900 tracking-tight">
            {mode === 'create' ? 'Create Article' : 'Edit Article'}
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          {showSavedFeedback && (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
              <Check className="w-3.5 h-3.5" />
              Saved
            </span>
          )}

          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleAction('Draft')}
            className="px-4 py-2 text-xs font-semibold text-zinc-700 bg-white border border-zinc-200 rounded-full hover:bg-zinc-50 transition-colors disabled:opacity-50"
          >
            Save Draft
          </button>

          {isAdmin && (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleAction('Published')}
              className="px-5 py-2 text-xs font-semibold text-white bg-zinc-900 rounded-full hover:bg-zinc-800 transition-colors disabled:opacity-50 shadow-sm"
            >
              {isSubmitting ? 'Publishing...' : 'Publish'}
            </button>
          )}
        </div>
      </div>

      {errorMessage && (
        <div className="mx-6 lg:mx-8 mt-5 p-4 bg-red-50 text-red-700 text-xs font-medium rounded-2xl border border-red-100 flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          {errorMessage}
        </div>
      )}

      {/* Editor Body */}
      <div className="flex flex-col lg:flex-row flex-1 min-h-0 divide-y lg:divide-y-0 lg:divide-x divide-zinc-100 overflow-hidden">
        
        {/* Main Content Area */}
        <div className="flex-1 p-6 lg:p-8 space-y-8 overflow-y-auto">
          
          <div>
            <input
              type="text"
              placeholder="Article title..."
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (fieldErrors.title) setFieldErrors({ ...fieldErrors, title: undefined });
              }}
              className={`w-full text-2xl sm:text-3xl font-bold text-zinc-900 placeholder:text-zinc-300 border-0 outline-none p-0 focus:ring-0 resize-none ${
                fieldErrors.title ? 'text-red-900 placeholder:text-red-300' : ''
              }`}
            />
            {fieldErrors.title && (
              <p className="text-xs text-red-600 mt-2 font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {fieldErrors.title}
              </p>
            )}
          </div>

          <div>
            <textarea
              rows={2}
              placeholder="A short introductory excerpt for the card..."
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (fieldErrors.description)
                  setFieldErrors({ ...fieldErrors, description: undefined });
              }}
              className={`w-full text-base sm:text-lg text-zinc-500 placeholder:text-zinc-400 border-0 outline-none p-0 focus:ring-0 resize-none leading-relaxed font-normal ${
                fieldErrors.description ? 'text-red-700 placeholder:text-red-300' : ''
              }`}
            />
            <div className="flex items-center justify-between mt-1">
              {fieldErrors.description ? (
                <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {fieldErrors.description}
                </p>
              ) : <div />}
              <span
                className={`text-xs font-mono font-medium ml-auto ${
                  description.trim().length > 300
                    ? 'text-red-600 font-bold'
                    : description.trim().length > 0 && description.trim().length < 20
                    ? 'text-amber-600'
                    : 'text-zinc-400'
                }`}
              >
                {description.trim().length} / 300
              </span>
            </div>
          </div>

          <div className="pt-6 border-t border-zinc-100">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
              {/* Markdown Toolbar */}
              <div className="inline-flex flex-wrap items-center gap-1 p-1 bg-zinc-100/80 rounded-full text-zinc-500">
                <button onClick={() => insertFormatting('**', '**')} className="p-1.5 hover:text-zinc-900 hover:bg-white rounded-full transition-colors" title="Bold"><Bold className="w-3.5 h-3.5" /></button>
                <button onClick={() => insertFormatting('*', '*')} className="p-1.5 hover:text-zinc-900 hover:bg-white rounded-full transition-colors" title="Italic"><Italic className="w-3.5 h-3.5" /></button>
                <button onClick={() => insertFormatting('<u>', '</u>')} className="p-1.5 hover:text-zinc-900 hover:bg-white rounded-full transition-colors" title="Underline"><Underline className="w-3.5 h-3.5" /></button>
                <div className="w-px h-3.5 bg-zinc-300 mx-1" />
                <button onClick={() => insertFormatting('## ')} className="p-1.5 hover:text-zinc-900 hover:bg-white rounded-full transition-colors" title="Heading"><Heading className="w-3.5 h-3.5" /></button>
                <button onClick={() => insertFormatting('- ')} className="p-1.5 hover:text-zinc-900 hover:bg-white rounded-full transition-colors" title="Bullet List"><List className="w-3.5 h-3.5" /></button>
                <button onClick={() => insertFormatting('1. ')} className="p-1.5 hover:text-zinc-900 hover:bg-white rounded-full transition-colors" title="Numbered List"><ListOrdered className="w-3.5 h-3.5" /></button>
                <div className="w-px h-3.5 bg-zinc-300 mx-1" />
                <button onClick={() => insertFormatting('[Link Title](', ')')} className="p-1.5 hover:text-zinc-900 hover:bg-white rounded-full transition-colors" title="Link"><LinkIcon className="w-3.5 h-3.5" /></button>
                <button onClick={() => insertFormatting('`', '`')} className="p-1.5 hover:text-zinc-900 hover:bg-white rounded-full transition-colors" title="Code"><Code className="w-3.5 h-3.5" /></button>
              </div>

              {/* Live Word Counter */}
              <span
                className={`text-xs font-mono font-medium px-3 py-1 rounded-full border ${
                  countWords(content) > 500
                    ? 'text-red-600 bg-red-50 border-red-200 font-bold'
                    : countWords(content) > 0 && countWords(content) < 150
                    ? 'text-amber-700 bg-amber-50 border-amber-200'
                    : 'text-zinc-500 bg-zinc-100 border-zinc-200/60'
                }`}
              >
                {countWords(content)} / 500 words
              </span>
            </div>

            <textarea
              id="post-content-area"
              rows={8}
              placeholder="Write your article content here in markdown..."
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                if (fieldErrors.content) setFieldErrors({ ...fieldErrors, content: undefined });
              }}
              className="w-full min-h-[160px] text-base text-zinc-800 placeholder:text-zinc-300 border-0 outline-none p-0 focus:ring-0 resize-none leading-[1.8]"
            />
            {fieldErrors.content && (
              <p className="text-xs text-red-600 mt-2 font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {fieldErrors.content}
              </p>
            )}
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="w-full lg:w-[320px] p-6 lg:p-7 bg-[#FAFBFD]/60 space-y-6 overflow-y-auto flex-shrink-0 flex flex-col justify-between min-h-0">
          
          {mode === 'edit' && (
            <div className="space-y-3">
              <h3 className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Status</h3>
              <div>
                <select
                  value={status}
                  disabled={!isAdmin}
                  onChange={(e) => setStatus(e.target.value as PostStatus)}
                  className={`w-full h-10 px-3.5 border border-zinc-200/80 rounded-full text-xs text-zinc-900 focus:outline-none focus:border-zinc-400 font-semibold ${
                    !isAdmin ? 'bg-zinc-100 cursor-not-allowed text-zinc-500' : 'bg-white cursor-pointer'
                  }`}
                >
                  <option value="Draft">Draft</option>
                  {isAdmin && <option value="Published">Published</option>}
                </select>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <h3 className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Cover Image</h3>
            
            <div className="flex bg-zinc-100 p-1 rounded-full text-xs font-semibold">
              <button
                type="button"
                onClick={() => setImageTab('upload')}
                className={`flex-1 py-1.5 text-center rounded-full transition-all ${
                  imageTab === 'upload' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-900'
                }`}
              >
                Upload
              </button>
              <button
                type="button"
                onClick={() => setImageTab('url')}
                className={`flex-1 py-1.5 text-center rounded-full transition-all ${
                  imageTab === 'url' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-900'
                }`}
              >
                Image URL
              </button>
            </div>

            {imageTab === 'upload' && (
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg, image/png, image/webp"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileSelect(file);
                  }}
                  className="hidden"
                  id="featured-image-file"
                />
                <label
                  htmlFor="featured-image-file"
                  className="border-2 border-dashed border-zinc-200 hover:border-zinc-400 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors text-center bg-white"
                >
                  <UploadCloud className="w-6 h-6 text-zinc-400 mb-2" />
                  <span className="text-xs font-semibold text-zinc-700">Choose image</span>
                  <span className="text-[11px] text-zinc-400 mt-0.5">JPG, PNG, WebP up to 10MB</span>
                </label>
              </div>
            )}

            {imageTab === 'url' && (
              <div>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={imageUrl}
                  onChange={(e) => {
                    const val = e.target.value;
                    setImageUrl(val);
                    setImageFile(null);
                    setImageRemoved(false);
                    setImageError(false);
                    setPreviewUrl(val.trim());
                  }}
                  className="w-full h-10 px-4 bg-white border border-zinc-200/80 rounded-full text-xs text-zinc-900 focus:outline-none focus:border-zinc-400"
                />
              </div>
            )}

            {imageValidationError && (
              <p className="text-xs text-red-600 font-medium">{imageValidationError}</p>
            )}

            {previewUrl && (
              <div className="relative aspect-[16/10] bg-zinc-100 rounded-2xl border border-zinc-200/80 overflow-hidden group mt-3">
                {!imageError ? (
                  <img
                    src={previewUrl}
                    alt="Cover preview"
                    onError={() => setImageError(true)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-400">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                )}
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 p-1.5 bg-white/90 hover:bg-red-50 text-zinc-700 hover:text-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-zinc-200/60">
            {onPreview && (
              <button
                type="button"
                onClick={() => {
                  onPreview({
                    title: title.trim(),
                    description: description.trim(),
                    content: content.trim(),
                    imageUrl: imageFile ? undefined : (imageRemoved ? '' : imageUrl.trim()),
                    previewObjectUrl: previewUrl || undefined,
                    status,
                  });
                }}
                className="w-full h-10 flex items-center justify-center gap-2 bg-white border border-zinc-200/80 text-xs font-semibold text-zinc-700 rounded-full hover:bg-zinc-50 transition-colors shadow-xs"
              >
                <Eye className="w-3.5 h-3.5" /> Preview Article
              </button>
            )}
          </div>

        </div>
      </div>

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
