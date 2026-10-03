import { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ArrowLeft, AlertCircle, Monitor, Tablet, Smartphone } from 'lucide-react';
import { AdminLayout } from '../../widgets';
import { Logo, Spinner, Badge } from '../../shared/ui';
import { PostView, useCmsPost } from '../../entities/post';
import { formatDate } from '../../shared/lib';
import type { PostFormPreviewData } from '../../features/post-management';

interface LocationState {
  previewData?: PostFormPreviewData;
}

type DeviceMode = 'desktop' | 'tablet' | 'mobile';

const DEVICE_CONFIG: Record<DeviceMode, { label: string; icon: React.ElementType; maxWidth: string; title: string }> = {
  desktop: { label: 'Desktop',  icon: Monitor,    maxWidth: 'max-w-4xl',   title: 'Desktop (~1280px)' },
  tablet:  { label: 'Tablet',   icon: Tablet,     maxWidth: 'max-w-[768px]', title: 'Tablet (~768px)' },
  mobile:  { label: 'Mobile',   icon: Smartphone, maxWidth: 'max-w-[390px]', title: 'Mobile (~390px)' },
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

  const formattedDate = displayData?.createdAt
    ? formatDate(displayData.createdAt)
    : previewData
    ? 'Preview (Unsaved)'
    : 'Preview date';

  return (
    <AdminLayout currentTab="post-preview" showSearch={false}>
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-xl border border-zinc-200/80 shadow-xs mb-4">
        {/* Left: back + title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-1.5 text-zinc-500 hover:text-zinc-950 rounded-lg hover:bg-zinc-100 transition-colors cursor-pointer"
            title="Go back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold text-zinc-900 tracking-tight">
                Preview Article
              </h1>
              <Badge variant="neutral">
                {previewData ? 'Draft Preview' : 'Live Preview'}
              </Badge>
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">
              {previewData
                ? 'Previewing unsaved changes — this content is not yet published.'
                : 'Preview how this article appears to readers on the website.'}
            </p>
          </div>
        </div>

        {/* Right: device mode toggle */}
        <div className="flex items-center gap-1 bg-zinc-100 rounded-lg p-1 self-start sm:self-auto">
          {(Object.entries(DEVICE_CONFIG) as [DeviceMode, typeof DEVICE_CONFIG[DeviceMode]][]).map(
            ([mode, cfg]) => {
              const Icon = cfg.icon;
              const isActive = deviceMode === mode;
              return (
                <button
                  key={mode}
                  onClick={() => setDeviceMode(mode)}
                  title={cfg.title}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-white text-zinc-900 shadow-sm'
                      : 'text-zinc-500 hover:text-zinc-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{cfg.label}</span>
                </button>
              );
            }
          )}
        </div>
      </div>

      {/* Frame simulation container — width driven by selected device mode */}
      <div className="flex justify-center transition-all duration-300 py-2">
        <div
          className={`w-full ${device.maxWidth} bg-white rounded-xl shadow-sm border border-zinc-200/90 overflow-hidden transition-all duration-300`}
        >
          {/* Simulated public top navigation */}
          <div className="bg-white border-b border-zinc-100 px-5 py-3.5 flex items-center justify-between">
            <Logo variant="dark" />
            {deviceMode !== 'mobile' && (
              <div className="flex items-center gap-5 text-xs font-medium text-zinc-500">
                <span className="hover:text-zinc-900 cursor-pointer">Home</span>
                <span className="hover:text-zinc-900 cursor-pointer">About</span>
                <span className="text-zinc-900 font-semibold cursor-pointer">Blog</span>
              </div>
            )}
          </div>

          <div className="p-6 sm:p-10">
            {isLoading ? (
              <Spinner fullHeight text="Loading article preview..." />
            ) : isError || !displayData ? (
              <div className="py-14 text-center text-zinc-500 space-y-2">
                <AlertCircle className="w-7 h-7 mx-auto text-amber-500" />
                <p className="text-sm font-semibold text-zinc-800">Article preview unavailable</p>
                <p className="text-xs text-zinc-400">
                  Select an existing article from the posts table to preview.
                </p>
              </div>
            ) : (
              <PostView
                title={displayData.title}
                description={displayData.description}
                content={displayData.content}
                imageUrl={displayData.imageUrl}
                date={formattedDate}
                readTime={displayData.readTime}
                authorName={displayData.authorName}
              />
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export const PreviewPostPage = PostPreviewPage;

