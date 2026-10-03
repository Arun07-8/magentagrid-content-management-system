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
    <div className="flex flex-col h-full bg-white max-w-[1400px] mx-auto">
      {/* Editor Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 lg:px-10 py-6 border-b border-zinc-200 bg-white">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate('/admin/posts')}
            className="flex items-center gap-2 text-[14px] font-semibold text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div className="w-px h-4 bg-zinc-300" />
          <h1 className="text-[18px] font-bold text-zinc-900 tracking-tight">
            {mode === 'create' ? 'New Article' : 'Edit Article'}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {showSavedFeedback && (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-[4px] border border-emerald-100 animate-in fade-in">
              <Check className="w-3.5 h-3.5" />
              Saved
            </span>
          )}

          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleAction('Draft')}
            className="px-4 py-2.5 text-sm font-semibold text-zinc-700 bg-white border border-zinc-200 rounded-[6px] hover:bg-zinc-50 transition-colors disabled:opacity-50"
          >
            Save Draft
          </button>

          {isAdmin && (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleAction('Published')}
              className="px-4 py-2.5 text-sm font-semibold text-white bg-zinc-900 border border-transparent rounded-[6px] hover:bg-zinc-800 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Publishing...' : 'Publish'}
            </button>
          )}
        </div>
      </div>

      {errorMessage && (
        <div className="mx-6 lg:mx-10 mt-6 p-4 bg-red-50 text-red-700 text-sm font-medium rounded-md border border-red-100 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500" />
          {errorMessage}
        </div>
      )}

      {/* Editor Body */}
      <div className="flex flex-col lg:flex-row flex-1 divide-y lg:divide-y-0 lg:divide-x divide-zinc-200">
        
        {/* Main Content Area */}
        <div className="flex-1 p-6 lg:p-10 space-y-10 overflow-y-auto">
          
          <div>
            <input
              type="text"
              placeholder="Article Title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (fieldErrors.title) setFieldErrors({ ...fieldErrors, title: undefined });
              }}
              className={`w-full text-3xl sm:text-4xl font-bold text-zinc-900 placeholder:text-zinc-300 border-0 outline-none p-0 focus:ring-0 resize-none ${
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
              placeholder="A short introductory excerpt..."
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (fieldErrors.description)
                  setFieldErrors({ ...fieldErrors, description: undefined });
              }}
              className={`w-full text-xl text-zinc-500 placeholder:text-zinc-400 border-0 outline-none p-0 focus:ring-0 resize-none leading-relaxed font-medium ${
                fieldErrors.description ? 'text-red-700 placeholder:text-red-300' : ''
              }`}
            />
            {fieldErrors.description && (
              <p className="text-xs text-red-600 mt-1 font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {fieldErrors.description}
              </p>
            )}
          </div>

          <div className="pt-6 border-t border-zinc-100">
            {/* Markdown Toolbar */}
            <div className="flex flex-wrap items-center gap-1 mb-4 text-zinc-500">
              <button onClick={() => insertFormatting('**', '**')} className="p-1.5 hover:text-zinc-900 hover:bg-zinc-100 rounded-[4px] transition-colors"><Bold className="w-4 h-4" /></button>
              <button onClick={() => insertFormatting('*', '*')} className="p-1.5 hover:text-zinc-900 hover:bg-zinc-100 rounded-[4px] transition-colors"><Italic className="w-4 h-4" /></button>
              <button onClick={() => insertFormatting('<u>', '</u>')} className="p-1.5 hover:text-zinc-900 hover:bg-zinc-100 rounded-[4px] transition-colors"><Underline className="w-4 h-4" /></button>
              <div className="w-px h-4 bg-zinc-200 mx-2" />
              <button onClick={() => insertFormatting('## ')} className="p-1.5 hover:text-zinc-900 hover:bg-zinc-100 rounded-[4px] transition-colors"><Heading className="w-4 h-4" /></button>
              <button onClick={() => insertFormatting('- ')} className="p-1.5 hover:text-zinc-900 hover:bg-zinc-100 rounded-[4px] transition-colors"><List className="w-4 h-4" /></button>
              <button onClick={() => insertFormatting('1. ')} className="p-1.5 hover:text-zinc-900 hover:bg-zinc-100 rounded-[4px] transition-colors"><ListOrdered className="w-4 h-4" /></button>
              <div className="w-px h-4 bg-zinc-200 mx-2" />
              <button onClick={() => insertFormatting('[Link Title](', ')')} className="p-1.5 hover:text-zinc-900 hover:bg-zinc-100 rounded-[4px] transition-colors"><LinkIcon className="w-4 h-4" /></button>
              <button onClick={() => insertFormatting('`', '`')} className="p-1.5 hover:text-zinc-900 hover:bg-zinc-100 rounded-[4px] transition-colors"><Code className="w-4 h-4" /></button>
            </div>

            <textarea
              id="post-content-area"
              rows={16}
              placeholder="Write your article content here..."
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                if (fieldErrors.content) setFieldErrors({ ...fieldErrors, content: undefined });
              }}
              className="w-full text-lg text-zinc-800 placeholder:text-zinc-300 border-0 outline-none p-0 focus:ring-0 resize-y leading-[1.8]"
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
        <div className="w-full lg:w-[320px] p-6 lg:p-8 bg-zinc-50/30 overflow-y-auto space-y-10">
          
          {mode === 'edit' && (
            <div className="space-y-4">
              <h3 className="text-[12px] font-bold text-zinc-900 uppercase tracking-widest">Metadata</h3>
              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-2">Status</label>
                <select
                  value={status}
                  disabled={!isAdmin}
                  onChange={(e) => setStatus(e.target.value as PostStatus)}
                  className={`w-full h-10 px-3 border border-zinc-200 rounded-[6px] text-sm text-zinc-900 focus:outline-none focus:border-zinc-400 font-medium ${
                    !isAdmin ? 'bg-zinc-100 cursor-not-allowed text-zinc-500' : 'bg-white cursor-pointer'
                  }`}
                >
                  <option value="Draft">Draft</option>
                  {isAdmin && <option value="Published">Published</option>}
                </select>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <h3 className="text-[12px] font-bold text-zinc-900 uppercase tracking-widest">Cover Image</h3>
            
            <div className="flex bg-white rounded-[6px] border border-zinc-200 overflow-hidden text-sm font-medium">
              <button
                type="button"
                onClick={() => setImageTab('upload')}
                className={`flex-1 py-2 text-center transition-colors ${
                  imageTab === 'upload' ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900'
                }`}
              >
                Upload
              </button>
              <button
                type="button"
                onClick={() => setImageTab('url')}
                className={`flex-1 py-2 text-center transition-colors border-l border-zinc-200 ${
                  imageTab === 'url' ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900'
                }`}
              >
                URL
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
                  className="border-2 border-dashed border-zinc-200 hover:border-zinc-400 rounded-[6px] p-6 flex flex-col items-center justify-center cursor-pointer transition-colors text-center"
                >
                  <UploadCloud className="w-6 h-6 text-zinc-400 mb-2" />
                  <span className="text-sm font-medium text-zinc-700">Choose file</span>
                  <span className="text-xs text-zinc-400 mt-1">JPG, PNG, WebP</span>
                </label>
              </div>
            )}

            {imageTab === 'url' && (
              <div>
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
                    setPreviewUrl(val.trim());
                  }}
                  className="w-full h-10 px-3 bg-white border border-zinc-200 rounded-[6px] text-sm text-zinc-900 focus:outline-none focus:border-zinc-400"
                />
              </div>
            )}

            {imageValidationError && (
              <p className="text-xs text-red-600 font-medium">{imageValidationError}</p>
            )}

            {previewUrl && (
              <div className="relative aspect-[16/10] bg-zinc-100 rounded-[4px] border border-zinc-200 overflow-hidden group mt-4">
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
                  className="absolute top-2 right-2 p-1.5 bg-white/90 hover:bg-red-50 text-zinc-700 hover:text-red-600 rounded-[4px] opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <div className="space-y-4 pt-4 border-t border-zinc-200/60">
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
                className="w-full h-10 flex items-center justify-center gap-2 bg-white border border-zinc-200 text-sm font-medium text-zinc-700 rounded-[6px] hover:bg-zinc-50 transition-colors"
              >
                <Eye className="w-4 h-4" /> Preview
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
