import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
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
  RotateCw,
  Check,
} from 'lucide-react'
import { AdminSidebar } from './components/AdminSidebar'
import { AdminHeader } from './components/AdminHeader'

export default function EditPost() {
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [title, setTitle] = useState('Better Ways to Build a Website')
  const [description, setDescription] = useState(
    'Learn the best practices to build modern websites using React, TypeScript and more.'
  )
  const [content, setContent] = useState(
    "Building a modern website is easier than ever with the right tools and technologies. In this post, we'll explore the best practices, tools and tips for building a fast, scalable and user-friendly website."
  )
  const [status, setStatus] = useState<'Draft' | 'Published'>('Published')
  const [isUpdated, setIsUpdated] = useState(false)

  const handleUpdate = () => {
    setIsUpdated(true)
    setTimeout(() => {
      setIsUpdated(false)
      navigate('/admin/posts')
    }, 1200)
  }

  return (
    <div className="min-h-screen bg-slate-50/60 flex">
      {/* Sidebar */}
      <AdminSidebar
        currentTab="edit-post"
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
                  Edit Post
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Update your post content and publish settings.
                </p>
              </div>
            </div>

            {isUpdated && (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
                <Check className="w-3.5 h-3.5" />
                <span>Post updated successfully!</span>
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
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                />
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Short Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
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
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full p-4 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none resize-y leading-relaxed"
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Featured Image & Status & Actions */}
            <div className="lg:col-span-4 space-y-6">
              {/* Featured Image Card with Preview & Change Button */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Featured Image
                </label>

                {/* Current Image Thumbnail */}
                <div className="relative rounded-xl overflow-hidden aspect-[16/10] bg-slate-100 border border-slate-200/80">
                  <img
                    src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80"
                    alt="Current Featured Image"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Change Image Button */}
                <button
                  type="button"
                  className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <RotateCw className="w-3.5 h-3.5 text-slate-500" />
                  <span>Change Image</span>
                </button>
              </div>

              {/* Status Card */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as 'Draft' | 'Published')}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer font-medium"
                >
                  <option value="Published">Published</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>

              {/* Action Buttons Row */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => navigate('/admin/posts')}
                  className="px-3 py-2 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={() => setIsUpdated(true)}
                  className="py-2 px-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Save Draft
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/admin/posts/preview')}
                  className="py-2 px-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Preview
                </button>

                <button
                  type="button"
                  onClick={handleUpdate}
                  className="py-2 px-3.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded-xl shadow-xs shadow-blue-600/25 transition-all cursor-pointer"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
