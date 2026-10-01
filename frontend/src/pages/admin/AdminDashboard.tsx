import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FileText,
  CheckCircle2,
  Clock,
  Eye,
  Plus,
  ArrowRight,
  MoreVertical,
  Loader2,
  Calendar,
} from 'lucide-react'
import { AdminSidebar } from './components/AdminSidebar'
import { AdminHeader } from './components/AdminHeader'
import { useCmsPosts } from '../../entities/post/hooks/usePosts'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const { data: posts = [], isLoading } = useCmsPosts({
    search: searchQuery,
  })

  const totalPosts = posts.length
  const publishedCount = posts.filter((p) => p.status === 'Published').length
  const draftCount = posts.filter((p) => p.status === 'Draft').length
  const totalViews = posts.reduce((acc, p) => acc + (p.views || 0), 0)

  const stats = [
    {
      title: 'Total Posts',
      value: String(totalPosts),
      trend: `${publishedCount} live, ${draftCount} draft`,
      icon: FileText,
      iconBg: 'bg-blue-50 text-blue-600',
    },
    {
      title: 'Published',
      value: String(publishedCount),
      trend: `${Math.round((publishedCount / (totalPosts || 1)) * 100)}% of content`,
      icon: CheckCircle2,
      iconBg: 'bg-emerald-50 text-emerald-600',
    },
    {
      title: 'Drafts',
      value: String(draftCount),
      trend: 'Ready for review',
      icon: Clock,
      iconBg: 'bg-amber-50 text-amber-600',
    },
    {
      title: 'Total Views',
      value: totalViews >= 1000 ? `${(totalViews / 1000).toFixed(1)}K` : String(totalViews),
      trend: 'Article reads',
      icon: Eye,
      iconBg: 'bg-purple-50 text-purple-600',
    },
  ]

  const recentPosts = posts.slice(0, 5)

  return (
    <div className="min-h-screen bg-slate-50/60 flex">
      {/* Sidebar */}
      <AdminSidebar
        currentTab="dashboard"
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Top Header */}
        <AdminHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onToggleMobileMenu={() => setMobileMenuOpen(true)}
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-8 flex-1">
          {/* Page Heading & Quick Create */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Dashboard
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Overview of your published content, drafts and activity.
              </p>
            </div>

            <button
              onClick={() => navigate('/admin/posts/create')}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-xl shadow-xs shadow-blue-600/20 transition-all cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Create Post</span>
            </button>
          </div>

          {/* 4 Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {stats.map((stat, idx) => {
              const Icon = stat.icon
              return (
                <div
                  key={idx}
                  className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow flex items-start justify-between"
                >
                  <div className="space-y-1">
                    <span className="text-xs font-medium text-slate-500">{stat.title}</span>
                    <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                      {isLoading ? (
                        <span className="inline-block w-8 h-7 bg-slate-200 animate-pulse rounded" />
                      ) : (
                        stat.value
                      )}
                    </div>
                    <span className="text-xs font-semibold text-slate-500 block">
                      {stat.trend}
                    </span>
                  </div>

                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${stat.iconBg}`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Two-Column Grid: Recent Posts (Left) & Quick Actions / Info (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Recent Posts Table Card */}
            <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
              <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                  Recent Posts
                </h2>
                <button
                  onClick={() => navigate('/admin/posts')}
                  className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 group cursor-pointer"
                >
                  <span>View all</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>

              {/* Table */}
              {isLoading ? (
                <div className="py-16 flex flex-col items-center justify-center text-slate-400">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-2" />
                  <p className="text-xs">Loading posts...</p>
                </div>
              ) : recentPosts.length === 0 ? (
                <div className="py-16 text-center text-slate-400">
                  <FileText className="w-10 h-10 mx-auto mb-2 text-slate-300 stroke-[1.5]" />
                  <p className="text-sm font-medium text-slate-600">No posts created yet</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Click &quot;Create Post&quot; above to start drafting articles.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50/75 text-xs uppercase font-semibold text-slate-400 border-b border-slate-100">
                      <tr>
                        <th className="py-3 px-4 sm:px-6">Title</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Updated</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-normal">
                      {recentPosts.map((post) => {
                        const postId = post._id || post.id
                        const formattedDate = new Date(post.updatedAt || post.createdAt).toLocaleDateString(
                          'en-US',
                          {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          }
                        )

                        return (
                          <tr
                            key={postId}
                            className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                            onClick={() => navigate(`/admin/posts/edit/${postId}`)}
                          >
                            {/* Title with image */}
                            <td className="py-3.5 px-4 sm:px-6">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200/60">
                                  <img
                                    src={
                                      post.imageUrl ||
                                      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80'
                                    }
                                    alt={post.title}
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src =
                                        'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80'
                                    }}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <span className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors truncate max-w-xs sm:max-w-sm">
                                  {post.title}
                                </span>
                              </div>
                            </td>

                            {/* Status */}
                            <td className="py-3.5 px-4">
                              <span
                                className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                                  post.status === 'Published'
                                    ? 'bg-emerald-50 text-emerald-600'
                                    : 'bg-amber-50 text-amber-600'
                                }`}
                              >
                                {post.status}
                              </span>
                            </td>

                            {/* Updated */}
                            <td className="py-3.5 px-4 text-xs text-slate-500 whitespace-nowrap">
                              {formattedDate}
                            </td>

                            {/* Actions */}
                            <td className="py-3.5 px-4 text-right">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  navigate(`/admin/posts/edit/${postId}`)
                                }}
                                className="p-1 text-slate-400 hover:text-slate-600 rounded hover:bg-slate-100 cursor-pointer"
                                aria-label="Edit post"
                              >
                                <MoreVertical className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Right: Quick Overview Box */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => navigate('/admin/posts/create')}
                    className="w-full py-2.5 px-4 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs rounded-xl flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span>Create a new article</span>
                    <Plus className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => navigate('/admin/posts')}
                    className="w-full py-2.5 px-4 bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium text-xs rounded-xl flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span>Manage all posts</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <a
                    href="/"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 px-4 bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium text-xs rounded-xl flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span>View live public website</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-2xl text-white shadow-md shadow-blue-600/20 space-y-3">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-white" />
                </div>
                <h4 className="text-base font-bold">Real-Time Sync Active</h4>
                <p className="text-xs text-blue-100 leading-relaxed">
                  Post changes published or edited here sync automatically across open tabs and the public website via Socket.IO.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
