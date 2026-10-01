import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Plus,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit,
  Trash2,
} from 'lucide-react'
import { AdminSidebar } from './components/AdminSidebar'
import { AdminHeader } from './components/AdminHeader'
import { DeleteModal } from './components/DeleteModal'
import { ADMIN_POSTS } from './data/adminData'
import type { AdminPost } from './data/adminData'

export default function Posts() {
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [postToDelete, setPostToDelete] = useState<AdminPost | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)

  const posts = ADMIN_POSTS

  const toggleSelectAll = () => {
    if (selectedIds.length === posts.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(posts.map((p) => p.id))
    }
  }

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleDeleteClick = (post: AdminPost, e: React.MouseEvent) => {
    e.stopPropagation()
    setPostToDelete(post)
    setActiveMenuId(null)
    setDeleteModalOpen(true)
  }

  const handleConfirmDelete = () => {
    setDeleteModalOpen(false)
    setPostToDelete(null)
  }

  return (
    <div className="min-h-screen bg-slate-50/60 flex">
      {/* Sidebar */}
      <AdminSidebar
        currentTab="posts"
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

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 flex-1">
          {/* Page Heading & Create Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Posts
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Manage your blog posts and content.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/admin/posts/empty')}
                className="text-xs font-medium text-slate-500 hover:text-slate-800 bg-white border border-slate-200 px-3 py-2 rounded-xl cursor-pointer"
                title="View Empty State design"
              >
                Empty State UI
              </button>

              <button
                onClick={() => navigate('/admin/posts/create')}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-xl shadow-xs shadow-blue-600/20 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create Post</span>
              </button>
            </div>
          </div>

          {/* Posts Table Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50/75 text-xs uppercase font-semibold text-slate-400 border-b border-slate-100">
                  <tr>
                    <th className="py-3.5 px-4 w-10">
                      <input
                        type="checkbox"
                        checked={selectedIds.length === posts.length}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
                      />
                    </th>
                    <th className="py-3.5 px-4">Image</th>
                    <th className="py-3.5 px-4">Title</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Updated</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 font-normal">
                  {posts.map((post) => {
                    const isSelected = selectedIds.includes(post.id)
                    const isMenuOpen = activeMenuId === post.id

                    return (
                      <tr
                        key={post.id}
                        className={`hover:bg-slate-50/80 transition-colors group ${
                          isSelected ? 'bg-blue-50/40' : ''
                        }`}
                      >
                        {/* Checkbox */}
                        <td className="py-4 px-4">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectOne(post.id)}
                            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
                          />
                        </td>

                        {/* Image */}
                        <td className="py-4 px-4">
                          <div className="w-12 h-9 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200/60">
                            <img
                              src={post.imageUrl}
                              alt={post.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </td>

                        {/* Title */}
                        <td className="py-4 px-4">
                          <span
                            onClick={() => navigate('/admin/posts/edit')}
                            className="font-semibold text-slate-900 hover:text-blue-600 transition-colors cursor-pointer line-clamp-1"
                          >
                            {post.title}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="py-4 px-4">
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
                        <td className="py-4 px-4 text-xs text-slate-500 whitespace-nowrap">
                          {post.updatedDate}
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-4 text-right relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setActiveMenuId(isMenuOpen ? null : post.id)
                            }}
                            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 focus:outline-none cursor-pointer"
                            aria-label="Actions"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {/* Context Action Menu Dropdown */}
                          {isMenuOpen && (
                            <>
                              <div
                                className="fixed inset-0 z-30"
                                onClick={() => setActiveMenuId(null)}
                              />
                              <div className="absolute right-4 mt-1 w-36 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 z-40 text-left animate-in fade-in zoom-in-95 duration-100">
                                <button
                                  onClick={() => {
                                    setActiveMenuId(null)
                                    navigate('/admin/posts/edit')
                                  }}
                                  className="w-full px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                                >
                                  <Edit className="w-3.5 h-3.5 text-slate-400" />
                                  <span>Edit</span>
                                </button>
                                <button
                                  onClick={() => {
                                    setActiveMenuId(null)
                                    navigate('/admin/posts/preview')
                                  }}
                                  className="w-full px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                                >
                                  <Eye className="w-3.5 h-3.5 text-slate-400" />
                                  <span>Preview</span>
                                </button>
                                <div className="my-1 border-t border-slate-100" />
                                <button
                                  onClick={(e) => handleDeleteClick(post, e)}
                                  className="w-full px-3.5 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5 text-red-500" />
                                  <span>Delete</span>
                                </button>
                              </div>
                            </>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer: < 1 2 3 > and Count */}
            <div className="p-4 sm:p-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors cursor-pointer"
                  aria-label="Previous"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {[1, 2, 3].map((num) => (
                  <button
                    key={num}
                    onClick={() => setCurrentPage(num)}
                    className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      currentPage === num
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {num}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage(Math.min(3, currentPage + 1))}
                  className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors cursor-pointer"
                  aria-label="Next"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <span className="text-xs text-slate-500 font-medium">
                Showing 1-5 of 12 posts
              </span>
            </div>
          </div>
        </main>
      </div>

      {/* Delete Confirmation Modal (Screen 7) */}
      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        postTitle={postToDelete?.title}
      />
    </div>
  )
}
