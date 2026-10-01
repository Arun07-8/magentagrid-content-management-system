import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  UploadCloud,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading,
  List,
  ListOrdered,
  Link as LinkIcon,
  Image as ImageIcon,
  Code,
  ArrowLeft,
  Check,
} from 'lucide-react'
import { AdminSidebar } from './components/AdminSidebar'
import { AdminHeader } from './components/AdminHeader'

export default function CreatePost() {
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [content, setContent] = useState('')
  const [status, setStatus] = useState<'Draft' | 'Published'>('Draft')
  const [isSaved, setIsSaved] = useState(false)

  const handleSave = () => {
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 2000)
  }

  return (
    <div className="min-h-screen bg-slate-50/60 flex">
      {/* Sidebar */}
      <AdminSidebar
        currentTab="create-post"
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <AdminHeader
          onToggleMobileMenu={() => setMobileMenuOpen(true)}
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 flex-1">
          {/* Top Bar with Back and Title */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/admin/posts')}
                className="p-2 text-slate-500 hover:text-slate-800 rounded-xl hover:bg-white border border-transparent hover:border-slate-200 transition-all cursor-pointer"
                title="Back to posts"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  Create Post
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Draft and publish a new article for your website.
                </p>
              </div>
            </div>

            {isSaved && (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
                <Check className="w-3.5 h-3.5" />
                <span>Saved as Draft</span>
              </span>
            )}
          </div>

          {/* Two-Column Form Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Post Details & Editor */}
            <div className="lg:col-span-8 space-y-6 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs">
              {/* Title Field */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter post title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Short Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Enter a short description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                />
              </div>

              {/* Main Content & Editor Toolbar */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Main Content <span className="text-red-500">*</span>
                </label>

                {/* Editor Container */}
                <div className="border border-slate-200 rounded-xl overflow-hidden bg-white focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
                  {/* Formatting Toolbar */}
                  <div className="bg-slate-50/90 border-b border-slate-200/80 p-2 flex flex-wrap items-center gap-1 text-slate-600">
                    <button
                      type="button"
                      className="p-1.5 rounded hover:bg-slate-200 hover:text-slate-900 transition-colors"
                      title="Bold"
                    >
                      <Bold className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      className="p-1.5 rounded hover:bg-slate-200 hover:text-slate-900 transition-colors"
                      title="Italic"
                    >
                      <Italic className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      className="p-1.5 rounded hover:bg-slate-200 hover:text-slate-900 transition-colors"
                      title="Underline"
                    >
                      <Underline className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      className="p-1.5 rounded hover:bg-slate-200 hover:text-slate-900 transition-colors"
                      title="Strikethrough"
                    >
                      <Strikethrough className="w-4 h-4" />
                    </button>

                    <div className="w-px h-4 bg-slate-300 mx-1" />

                    <button
                      type="button"
                      className="p-1.5 rounded hover:bg-slate-200 hover:text-slate-900 transition-colors"
                      title="Heading"
                    >
                      <Heading className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      className="p-1.5 rounded hover:bg-slate-200 hover:text-slate-900 transition-colors"
                      title="Bullet list"
                    >
                      <List className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      className="p-1.5 rounded hover:bg-slate-200 hover:text-slate-900 transition-colors"
                      title="Numbered list"
                    >
                      <ListOrdered className="w-4 h-4" />
                    </button>

                    <div className="w-px h-4 bg-slate-300 mx-1" />

                    <button
                      type="button"
                      className="p-1.5 rounded hover:bg-slate-200 hover:text-slate-900 transition-colors"
                      title="Link"
                    >
                      <LinkIcon className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      className="p-1.5 rounded hover:bg-slate-200 hover:text-slate-900 transition-colors"
                      title="Image"
                    >
                      <ImageIcon className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      className="p-1.5 rounded hover:bg-slate-200 hover:text-slate-900 transition-colors"
                      title="Code"
                    >
                      <Code className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Content Textarea */}
                  <textarea
                    rows={10}
                    placeholder="Write your content here..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full p-4 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none resize-y leading-relaxed"
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Featured Image & Status & Actions */}
            <div className="lg:col-span-4 space-y-6">
              {/* Featured Image Card */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Featured Image <span className="text-slate-400 font-normal lowercase">(optional)</span>
                </label>

                {/* Dropzone UI */}
                <div className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-xl p-8 text-center bg-slate-50/60 hover:bg-blue-50/30 transition-all cursor-pointer flex flex-col items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-semibold text-slate-700">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Max size 5MB
                  </p>
                </div>
              </div>

              {/* Status Card */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as 'Draft' | 'Published')}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
                >
                  <option value="Draft">Draft</option>
                  <option value="Published">Published</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between gap-2.5">
                <button
                  type="button"
                  onClick={handleSave}
                  className="flex-1 py-2.5 px-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium text-xs rounded-xl transition-colors cursor-pointer text-center"
                >
                  Save Draft
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/admin/posts/preview')}
                  className="flex-1 py-2.5 px-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium text-xs rounded-xl transition-colors cursor-pointer text-center"
                >
                  Preview
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/admin/posts')}
                  className="flex-1 py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded-xl shadow-xs shadow-blue-600/25 transition-all cursor-pointer text-center"
                >
                  Publish
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
