import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileText, Plus, ListFilter } from 'lucide-react'
import { AdminSidebar } from './components/AdminSidebar'
import { AdminHeader } from './components/AdminHeader'

export default function EmptyPosts() {
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="min-h-screen bg-slate-50/60 flex">
      {/* Sidebar */}
      <AdminSidebar
        currentTab="empty-posts"
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <AdminHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onToggleMobileMenu={() => setMobileMenuOpen(true)}
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 flex-1">
          {/* Page Heading & Toggle to Active Posts */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Posts
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Manage your blog posts and content.
              </p>
            </div>

            <button
              onClick={() => navigate('/admin/posts')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-white border border-slate-200 px-3 py-2 rounded-xl transition-colors cursor-pointer self-start sm:self-auto"
            >
              <ListFilter className="w-3.5 h-3.5" />
              <span>View Populated Posts</span>
            </button>
          </div>

          {/* Empty State Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs py-20 px-6 flex flex-col items-center justify-center text-center">
            {/* Document illustration badge */}
            <div className="w-20 h-20 rounded-full bg-slate-100/90 text-slate-400 flex items-center justify-center mb-5 border border-slate-200/50">
              <FileText className="w-10 h-10 stroke-[1.5]" />
            </div>

            {/* Title & Description */}
            <h3 className="text-lg font-bold text-slate-900 mb-1">No posts found</h3>
            <p className="text-sm text-slate-500 mb-6 max-w-xs">
              Get started by creating your first post.
            </p>

            {/* Create Post Button */}
            <button
              onClick={() => navigate('/admin/posts/create')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-xl shadow-xs shadow-blue-600/20 transition-all hover:-translate-y-0.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Post</span>
            </button>
          </div>
        </main>
      </div>
    </div>
  )
}
