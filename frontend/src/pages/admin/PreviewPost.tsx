import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Monitor, Tablet, Smartphone, ArrowLeft, Calendar, Clock } from 'lucide-react'
import { AdminSidebar } from './components/AdminSidebar'
import { AdminHeader } from './components/AdminHeader'
import { Logo } from '../../components/Logo'

type DeviceMode = 'desktop' | 'tablet' | 'mobile'

export default function PreviewPost() {
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop')

  const getContainerWidth = () => {
    switch (deviceMode) {
      case 'desktop':
        return 'max-w-4xl w-full'
      case 'tablet':
        return 'max-w-2xl w-full'
      case 'mobile':
        return 'max-w-sm w-full'
    }
  }

  return (
    <div className="min-h-screen bg-slate-100/70 flex">
      {/* Sidebar */}
      <AdminSidebar
        currentTab="preview-post"
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <AdminHeader
          onToggleMobileMenu={() => setMobileMenuOpen(true)}
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 flex-1">
          {/* Top Controls: Title & Device Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/admin/posts')}
                className="p-2 text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                title="Back to posts"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Preview Post
                </h1>
                <p className="text-xs text-slate-500">
                  See how your post renders on the live website across devices.
                </p>
              </div>
            </div>

            {/* Device Switcher Buttons */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200/60 self-start sm:self-auto">
              <button
                onClick={() => setDeviceMode('desktop')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  deviceMode === 'desktop'
                    ? 'bg-white text-blue-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Desktop</span>
              </button>

              <button
                onClick={() => setDeviceMode('tablet')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  deviceMode === 'tablet'
                    ? 'bg-white text-blue-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Tablet className="w-3.5 h-3.5" />
                <span>Tablet</span>
              </button>

              <button
                onClick={() => setDeviceMode('mobile')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  deviceMode === 'mobile'
                    ? 'bg-white text-blue-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile</span>
              </button>
            </div>
          </div>

          {/* Device Preview Viewport Container */}
          <div className="flex justify-center transition-all duration-300 py-4">
            <div
              className={`${getContainerWidth()} bg-white rounded-2xl shadow-xl border border-slate-200/80 overflow-hidden transition-all duration-300`}
            >
              {/* Public Website Preview Header */}
              <div className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
                <Logo variant="dark" />
                <div className="hidden sm:flex items-center gap-6 text-xs font-medium text-slate-600">
                  <span className="hover:text-blue-600 cursor-pointer">Home</span>
                  <span className="hover:text-blue-600 cursor-pointer">About</span>
                  <span className="hover:text-blue-600 cursor-pointer">News</span>
                  <span className="text-blue-600 font-semibold cursor-pointer">Blog</span>
                </div>
              </div>

              {/* Public Post Content */}
              <div className="p-6 sm:p-10 space-y-6">
                {/* Featured Image */}
                <div className="relative rounded-2xl overflow-hidden aspect-[16/9] bg-slate-100 border border-slate-100 shadow-xs">
                  <img
                    src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80"
                    alt="Better Ways to Build a Website"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Title & Metadata */}
                <div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight mb-3">
                    Better Ways to Build a Website
                  </h2>

                  <div className="flex items-center gap-4 text-xs text-slate-400 pb-5 border-b border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Apr 28, 2025</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>5 min read</span>
                    </div>
                  </div>
                </div>

                {/* Article Text Content */}
                <div className="prose prose-slate max-w-none text-slate-600 text-sm sm:text-base leading-relaxed space-y-4">
                  <p>
                    Building a modern website is easier than ever with the right tools and
                    technologies. In this post, we&apos;ll explore the best practices, tools and
                    tips for building a fast, scalable and user-friendly website.
                  </p>
                  <p>
                    From modular component design to optimized assets and accessible color
                    hierarchies, crafting high-performance user interfaces requires attention to
                    both aesthetic details and engineering principles.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
