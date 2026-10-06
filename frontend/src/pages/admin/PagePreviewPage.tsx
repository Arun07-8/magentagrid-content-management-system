import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  Monitor,
  Tablet,
  Smartphone,
  Edit3,
} from 'lucide-react';
import { AdminLayout } from '../../widgets';
import { Badge, Spinner } from '../../shared/ui';
import { useCmsPage } from '../../entities/page';

type DeviceMode = 'desktop' | 'tablet' | 'mobile';

const DEVICE_CONFIG: Record<
  DeviceMode,
  { label: string; icon: React.ElementType; frameClass: string; title: string }
> = {
  desktop: {
    label: 'Desktop',
    icon: Monitor,
    frameClass: 'w-full max-w-full h-full border border-zinc-200 shadow-sm rounded-none sm:rounded-lg',
    title: 'Desktop (100% Full Viewport)',
  },
  tablet: {
    label: 'Tablet',
    icon: Tablet,
    frameClass: 'w-[768px] max-w-full h-full border border-zinc-200 shadow-sm rounded-none sm:rounded-lg my-auto',
    title: 'Tablet (768px Viewport)',
  },
  mobile: {
    label: 'Mobile',
    icon: Smartphone,
    frameClass: 'w-[390px] max-w-full h-full border border-zinc-200 shadow-sm rounded-none sm:rounded-lg my-auto',
    title: 'Mobile (390px Viewport)',
  },
};

export default function PagePreviewPage() {
  const navigate = useNavigate();
  const { slug = 'home' } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const initialSection = searchParams.get('section') || 'home';

  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop');
  const [activeSection, setActiveSection] = useState<string>(initialSection);
  const device = DEVICE_CONFIG[deviceMode];
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const { data: page, isLoading } = useCmsPage(slug);

  useEffect(() => {
    const sec = searchParams.get('section');
    if (sec && sec !== activeSection) {
      setActiveSection(sec);
      iframeRef.current?.contentWindow?.postMessage(
        { type: 'SCROLL_TO_SECTION', section: sec },
        '*'
      );
    }
  }, [searchParams]);

  const handleIframeLoad = () => {
    if (activeSection) {
      setTimeout(() => {
        iframeRef.current?.contentWindow?.postMessage(
          { type: 'SCROLL_TO_SECTION', section: activeSection },
          '*'
        );
      }, 300);
    }
  };

  return (
    <AdminLayout currentTab="pages-preview" showSearch={false}>
      <div className="w-full h-full flex flex-col min-h-0 overflow-hidden gap-4">
        {/* Top Header Card */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-[28px] border-2 border-zinc-200 shadow-[0_12px_40px_rgba(0,0,0,0.08),0_4px_12px_rgba(0,0,0,0.04)] shrink-0">
          {/* Left: Back + Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/admin/pages')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-zinc-600 bg-zinc-100 hover:bg-zinc-200 hover:text-zinc-900 rounded-full transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-zinc-900 tracking-tight font-['Plus_Jakarta_Sans']">
                  Preview: {page?.title || (slug === '404' ? '404 Not Found Page' : slug)}
                </h1>
                <Badge variant={page?.status === 'Published' ? 'success' : 'neutral'}>
                  {page?.status || 'Draft'}
                </Badge>
              </div>
              <p className="text-xs text-zinc-500">
                Simulate responsiveness and exact typography before publishing live.
              </p>
            </div>
          </div>

          {/* Right: Device switchers + Edit button */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <div className="hidden sm:flex items-center gap-1 bg-zinc-100 p-1 rounded-2xl border border-zinc-200/60">
              {(
                Object.entries(DEVICE_CONFIG) as [
                  DeviceMode,
                  (typeof DEVICE_CONFIG)[DeviceMode]
                ][]
              ).map(([mode, cfg]) => {
                const Icon = cfg.icon;
                const isActive = deviceMode === mode;
                return (
                  <button
                    key={mode}
                    onClick={() => setDeviceMode(mode)}
                    title={cfg.title}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${isActive
                        ? 'bg-white text-zinc-900 shadow-2xs'
                        : 'text-zinc-500 hover:text-zinc-800'
                      }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span className="hidden md:inline">{cfg.label}</span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => navigate(`/admin/pages/edit/${slug}`)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold transition shadow-sm cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Page</span>
            </button>
          </div>
        </div>

        {/* Device Frame Simulator Canvas */}
        <div className="w-full flex justify-center items-center flex-1 min-h-[500px] lg:min-h-0 bg-zinc-100/80 p-2 sm:p-4 rounded-[28px] border-2 border-zinc-200 overflow-hidden relative select-none">
          <div
            className={`bg-white transition-all duration-300 mx-auto flex flex-col relative overflow-hidden ${device.frameClass}`}
          >
            {isLoading ? (
              <div className="py-24 flex justify-center items-center flex-1">
                <Spinner text="Rendering live preview..." />
              </div>
            ) : (
              <iframe
                ref={iframeRef}
                src={`/admin/preview-frame/page/${slug}?section=${activeSection}`}
                title="Page Preview"
                onLoad={handleIframeLoad}
                className="w-full h-full border-0 bg-white"
              />
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

