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
  Users,
  Settings,
  ListFilter,
} from 'lucide-react'
import { AdminSidebar } from './components/AdminSidebar'
import { AdminHeader } from './components/AdminHeader'
import { ADMIN_POSTS } from './data/adminData'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const stats = [
    {
      title: 'Total Posts',
      value: '12',
      trend: '+2 this week',
      icon: FileText,
      iconBg: 'bg-blue-50 text-blue-600',
    },
    {
      title: 'Published',
      value: '8',
      trend: '+1 this week',
      icon: CheckCircle2,
      iconBg: 'bg-emerald-50 text-emerald-600',
    },
    {
      title: 'Drafts',
      value: '4',
      trend: '0 this week',
      icon: Clock,
      iconBg: 'bg-amber-50 text-amber-600',
    },
    {
      title: 'Total Views',
      value: '1.2K',
      trend: '+18% this week',
      icon: Eye,
      iconBg: 'bg-blue-50 text-blue-600',
    },
  ]

  const recentPosts = ADMIN_POSTS.slice(0, 5)

  const recentActivity = [
    {
      action: 'New post published',
      target: 'Better Ways to Build a Website',
      time: '2 hours ago',
    },
    {
      action: 'Post updated',
      target: 'React 19 New Features',
      time: '6 hours ago',
    },
    {
      action: 'New post created',
      target: 'Modern UI/UX Trends',
      time: '1 day ago',
    },
  ]

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
          {/* Page Heading */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Dashboard
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Here&apos;s what&apos;s happening with your content.
            </p>
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
                      {stat.value}
                    </div>
                    <span className="text-xs font-semibold text-emerald-600 block">
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

          {/* Two-Column Grid: Recent Posts (Left) & Quick Actions / Activity (Right) */}
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
                    {recentPosts.map((post) => (
                      <tr
                        key={post.id}
                        className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                        onClick={() => navigate('/admin/posts/edit')}
                      >
                        {/* Title with image */}
                        <td className="py-3.5 px-4 sm:px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200/60">
                              <img
                                src={post.imageUrl}
                                alt={post.title}
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
                          {post.updatedDate}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              navigate('/admin/posts')
                            }}
                            className="p-1 text-slate-400 hover:text-slate-600 rounded hover:bg-slate-100"
                            aria-label="Actions"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right: Quick Actions & Recent Activity */}
            <div className="lg:col-span-4 space-y-6">
              {/* Quick Actions Card */}
              <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                <h3 className="text-base font-bold text-slate-900 tracking-tight mb-4">
                  Quick Actions
                </h3>

                <button
                  onClick={() => navigate('/admin/posts/create')}
                  className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-xl shadow-xs shadow-blue-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create New Post</span>
                </button>

                <button
                  onClick={() => navigate('/admin/posts')}
                  className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium text-sm rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <ListFilter className="w-4 h-4 text-slate-400" />
                  <span>View All Posts</span>
                </button>

                <button
                  onClick={() => {}}
                  className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium text-sm rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Users className="w-4 h-4 text-slate-400" />
                  <span>Manage Users</span>
                </button>

                <button
                  onClick={() => {}}
                  className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium text-sm rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  <span>Settings</span>
                </button>
              </div>

              {/* Recent Activity Card */}
              <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs">
                <h3 className="text-base font-bold text-slate-900 tracking-tight mb-5">
                  Recent Activity
                </h3>

                <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                  {recentActivity.map((act, idx) => (
                    <div key={idx} className="relative">
                      {/* Circle dot */}
                      <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-blue-600 ring-4 ring-white" />
                      <div className="text-xs font-semibold text-slate-900">{act.action}</div>
                      <div className="text-xs text-slate-500 truncate mt-0.5">{act.target}</div>
                      <span className="text-[11px] text-slate-400 mt-1 block">{act.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
