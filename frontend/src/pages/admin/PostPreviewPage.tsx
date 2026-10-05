import { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ArrowLeft, AlertCircle, Monitor, Tablet, Smartphone } from 'lucide-react';
import { AdminLayout } from '../../widgets';
import { Spinner, Badge } from '../../shared/ui';
import { useCmsPost } from '../../entities/post';
import type { PostFormPreviewData } from '../../features/post-management';

interface LocationState {
  previewData?: PostFormPreviewData;
}

type DeviceMode = 'desktop' | 'tablet' | 'mobile';

const DEVICE_CONFIG: Record<DeviceMode, { label: string; icon: React.ElementType; maxWidth: string; title: string }> = {
  desktop: { label: 'Desktop', icon: Monitor,    maxWidth: 'max-w-4xl',   title: 'Desktop (~1280px)' },
  tablet:  { label: 'Tablet',  icon: Tablet,     maxWidth: 'max-w-[768px]', title: 'Tablet (~768px)' },
  mobile:  { label: 'Mobile',  icon: Smartphone, maxWidth: 'max-w-[390px]', title: 'Mobile (~390px)' },
};

export default function PostPreviewPage() {
  const navigate = useNavigate();
  const { id: paramId } = useParams<{ id: string }>();
  const location = useLocation();
  const state = location.state as LocationState | null;
  const previewData = state?.previewData;

  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop');
  const device = DEVICE_CONFIG[deviceMode];

  // Only fetch from DB if we have a real post ID AND no form state was passed
  const shouldFetchFromDb = Boolean(paramId) && !previewData;
  const { data: dbPost, isLoading, isError } = useCmsPost(shouldFetchFromDb ? paramId : undefined);

  // Resolve what to render: form state takes priority over DB data
  const displayData = previewData
    ? {
        title: previewData.title || '(No title)',
        description: previewData.description,
        content: previewData.content || '(No content)',
        imageUrl: previewData.previewObjectUrl || previewData.imageUrl || '',
        readTime: undefined,
        authorName: undefined,
        createdAt: undefined,
      }
    : dbPost
    ? {
        title: dbPost.title,
        description: dbPost.description,
        content: dbPost.content,
        imageUrl: dbPost.imageUrl,
        readTime: dbPost.readTime,
        authorName: dbPost.author?.name,
        createdAt: dbPost.createdAt,
      }
    : null;

  return (
    <AdminLayout currentTab="post-preview" showSearch={false}>
      <div className="w-full h-full flex flex-col min-h-0 overflow-hidden">
        {/* Top Header Card */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-[28px] border-2 border-zinc-200 shadow-[0_12px_40px_rgba(0,0,0,0.08),0_4px_12px_rgba(0,0,0,0.04)] mb-4 shrink-0">
          {/* Left: back + title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-zinc-600 bg-zinc-100 hover:bg-zinc-200 hover:text-zinc-900 rounded-full transition-colors cursor-pointer"
              title="Go back"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-zinc-900 tracking-tight">
                  Preview Article
                </h1>
                <Badge variant="neutral">
                  {previewData ? 'Draft Preview' : 'Live Preview'}
                </Badge>
              </div>
              <p className="text-xs text-zinc-500 mt-0.5">
                {previewData
                  ? 'Previewing unsaved draft — this content is not yet published.'
                  : 'Preview how this article appears to readers on the live website.'}
              </p>
            </div>
          </div>

          {/* Right: device mode toggle (hidden on mobile screens) */}
          <div className="hidden sm:flex items-center gap-1 bg-zinc-100 p-1 rounded-full border border-zinc-200/60 self-start sm:self-auto overflow-x-auto max-w-full shrink-0">
            {(Object.entries(DEVICE_CONFIG) as [DeviceMode, typeof DEVICE_CONFIG[DeviceMode]][]).map(
              ([mode, cfg]) => {
                const Icon = cfg.icon;
                const isActive = deviceMode === mode;
                const isMobileOption = mode === 'mobile';
                return (
                  <button
                    key={mode}
                    onClick={() => setDeviceMode(mode)}
                    title={cfg.title}
                    className={`items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                      isMobileOption ? 'hidden sm:inline-flex' : 'inline-flex'
                    } ${
                      isActive
                        ? 'bg-white text-zinc-900 shadow-sm'
                        : 'text-zinc-500 hover:text-zinc-800'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{cfg.label}</span>
                  </button>
                );
              }
            )}
          </div>
        </div>

        {/* Frame simulation container — width driven by selected device mode */}
        <div className="w-full flex justify-center items-center flex-1 min-h-0 pb-1 overflow-hidden">
          <div
            className={`w-full ${device.maxWidth} h-full bg-white rounded-[28px] shadow-[0_12px_40px_rgba(0,0,0,0.08),0_4px_12px_rgba(0,0,0,0.04)] border-2 border-zinc-200 overflow-hidden transition-all duration-300 mx-auto flex flex-col`}
          >
            {isLoading ? (
              <div className="py-24 flex justify-center items-center flex-1">
                <Spinner fullHeight text="Loading article preview..." />
              </div>
            ) : isError || !displayData ? (
              <div className="py-14 text-center text-zinc-500 space-y-2 flex-1 flex flex-col items-center justify-center">
                <AlertCircle className="w-7 h-7 mx-auto text-[#FCD06B]" />
                <p className="text-sm font-semibold text-zinc-800">Article preview unavailable</p>
                <p className="text-xs text-zinc-400">
                  Select an existing article from the posts table to preview.
                </p>
              </div>
            ) : (
              <iframe
                src={paramId ? `/admin/preview-frame/post/${paramId}` : '/admin/preview-frame/post'}
                title="Article Preview"
                className="w-full h-full border-0 bg-white"
              />
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export const PreviewPostPage = PostPreviewPage;
