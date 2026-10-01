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
  CheckCircle2,
  Clock,
  Loader2,
  AlertCircle,
  FileText,
} from 'lucide-react'
import { AdminSidebar } from './components/AdminSidebar'
import { AdminHeader } from './components/AdminHeader'
import { DeleteModal } from './components/DeleteModal'
import {
  useCmsPosts,
  useDeletePost,
  usePublishPost,
  useUnpublishPost,
} from '../../entities/post/hooks/usePosts'
import { useUserStore } from '../../entities/user/model/userStore'
import type { Post } from '../../shared/types'

export default function Posts() {
  const navigate = useNavigate()
  const { role } = useUserStore()
  const isAdmin = role === 'admin'

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'All' | 'Draft' | 'Published'>('All')
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [postToDelete, setPostToDelete] = useState<Post | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [actionError, setActionError] = useState<string | null>(null)

  const {
    data: posts = [],
    isLoading,
    isError,
    error,
  } = useCmsPosts({
    search: searchQuery,
    status: statusFilter === 'All' ? undefined : statusFilter,
  })

  const deleteMutation = useDeletePost()
  const publishMutation = usePublishPost()
  const unpublishMutation = useUnpublishPost()

  // Pagination logic (5 per page)
  const itemsPerPage = 5
  const totalPages = Math.max(1, Math.ceil(posts.length / itemsPerPage))
  const paginatedPosts = posts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const toggleSelectAll = () => {
    if (selectedIds.length === paginatedPosts.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(paginatedPosts.map((p) => p._id || p.id!))
    }
  }

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleDeleteClick = (post: Post, e: React.MouseEvent) => {
    e.stopPropagation()
    setPostToDelete(post)
    setActiveMenuId(null)
    setDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!postToDelete) return
    const id = postToDelete._id || postToDelete.id!
    setActionError(null)

    try {
      await deleteMutation.mutateAsync(id)
      setDeleteModalOpen(false)
      setPostToDelete(null)
    } catch (err: any) {
      setActionError(err.message || 'Failed to delete post')
      setDeleteModalOpen(false)
    }
  }

  const handleTogglePublish = async (post: Post, e: React.MouseEvent) => {
    e.stopPropagation()
    setActiveMenuId(null)
    setActionError(null)

    const id = post._id || post.id!

    try {
      if (post.status === 'Published') {
        await unpublishMutation.mutateAsync(id)
      } else {
        await publishMutation.mutateAsync(id)
      }
    } catch (err: any) {
      setActionError(err.message || 'Permission denied or update failed')
    }
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
          onSearchChange={(q) => {
            setSearchQuery(q)
            setCurrentPage(1)
          }}
          onToggleMobileMenu={() => setMobileMenuOpen(true)}
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 flex-1">
          {/* Action error banner */}
          {actionError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3.5 flex items-center justify-between text-xs text-red-600 animate-in fade-in">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <span>{actionError}</span>
              </div>
              <button
                onClick={() => setActionError(null)}
                className="text-red-400 hover:text-red-700 font-bold"
              >
                ✕
              </button>
            </div>
          )}

          {/* Page Heading & Create Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Posts
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Manage your blog posts, drafts, and publication status.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Filter Tabs */}
              <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 text-xs font-semibold text-slate-600">
                {(['All', 'Published', 'Draft'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => {
                      setStatusFilter(st)
                      setCurrentPage(1)
                    }}
                    className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      statusFilter === st
                        ? 'bg-blue-50 text-blue-600 font-bold'
                        : 'hover:text-slate-900'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

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
            {isLoading ? (
              <div className="py-20 flex flex-col items-center justify-center text-slate-400">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-2" />
                <p className="text-xs">Loading posts...</p>
              </div>
            ) : isError ? (
              <div className="py-16 text-center text-red-500 space-y-2">
                <AlertCircle className="w-8 h-8 mx-auto" />
                <p className="text-sm font-semibold">Failed to load posts</p>
                <p className="text-xs text-slate-400">{(error as any)?.message}</p>
              </div>
            ) : posts.length === 0 ? (
              <div className="py-20 px-6 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 rounded-full bg-slate-100/90 text-slate-400 flex items-center justify-center mb-5 border border-slate-200/50">
                  <FileText className="w-10 h-10 stroke-[1.5]" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">No posts found</h3>
                <p className="text-sm text-slate-500 mb-6 max-w-xs">
                  {searchQuery || statusFilter !== 'All'
                    ? 'No posts match your search or filter criteria.'
                    : 'Get started by creating your first post.'}
                </p>
                <button
                  onClick={() => navigate('/admin/posts/create')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-xl shadow-xs shadow-blue-600/20 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Post</span>
                </button>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50/75 text-xs uppercase font-semibold text-slate-400 border-b border-slate-100">
                      <tr>
                        <th className="py-3.5 px-4 w-10">
                          <input
                            type="checkbox"
                            checked={
                              selectedIds.length === paginatedPosts.length &&
                              paginatedPosts.length > 0
                            }
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
                      {paginatedPosts.map((post) => {
                        const postId = post._id || post.id!
                        const isSelected = selectedIds.includes(postId)
                        const isMenuOpen = activeMenuId === postId

                        const formattedDate = new Date(
                          post.updatedAt || post.createdAt
                        ).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })

                        return (
                          <tr
                            key={postId}
                            className={`hover:bg-slate-50/80 transition-colors group ${
                              isSelected ? 'bg-blue-50/40' : ''
                            }`}
                          >
                            {/* Checkbox */}
                            <td className="py-4 px-4">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleSelectOne(postId)}
                                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
                              />
                            </td>

                            {/* Image */}
                            <td className="py-4 px-4">
                              <div className="w-12 h-9 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200/60">
                                <img
                                  src={
                                    post.imageUrl ||
                                    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80'
                                  }
                                  alt={post.title}
                                  onError={(e) => {
                                    ;(e.target as HTMLImageElement).src =
                                      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80'
                                  }}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </td>

                            {/* Title */}
                            <td className="py-4 px-4">
                              <span
                                onClick={() => navigate(`/admin/posts/edit/${postId}`)}
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
                              {formattedDate}
                            </td>

                            {/* Actions */}
                            <td className="py-4 px-4 text-right relative">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setActiveMenuId(isMenuOpen ? null : postId)
                                }}
                                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 focus:outline-none cursor-pointer"
                                aria-label="Actions"
                              >
                                <MoreVertical className="w-4 h-4" />
                              </button>

                              {/* Dropdown Menu */}
                              {isMenuOpen && (
                                <>
                                  <div
                                    className="fixed inset-0 z-30"
                                    onClick={() => setActiveMenuId(null)}
                                  />
                                  <div className="absolute right-4 mt-1 w-40 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 z-40 text-left animate-in fade-in zoom-in-95 duration-100">
                                    <button
                                      onClick={() => {
                                        setActiveMenuId(null)
                                        navigate(`/admin/posts/edit/${postId}`)
                                      }}
                                      className="w-full px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                                    >
                                      <Edit className="w-3.5 h-3.5 text-slate-400" />
                                      <span>Edit</span>
                                    </button>
                                    <button
                                      onClick={() => {
                                        setActiveMenuId(null)
                                        navigate(`/admin/posts/preview/${postId}`)
                                      }}
                                      className="w-full px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                                    >
                                      <Eye className="w-3.5 h-3.5 text-slate-400" />
                                      <span>Preview</span>
                                    </button>

                                    {/* Publish/Unpublish (Admin only) */}
                                    {isAdmin ? (
                                      <button
                                        onClick={(e) => handleTogglePublish(post, e)}
                                        className="w-full px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer border-t border-slate-100"
                                      >
                                        {post.status === 'Published' ? (
                                          <>
                                            <Clock className="w-3.5 h-3.5 text-amber-500" />
                                            <span>Unpublish</span>
                                          </>
                                        ) : (
                                          <>
                                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                            <span>Publish</span>
                                          </>
                                        )}
                                      </button>
                                    ) : null}

                                    {/* Delete (Admin only) */}
                                    {isAdmin ? (
                                      <>
                                        <div className="my-1 border-t border-slate-100" />
                                        <button
                                          onClick={(e) => handleDeleteClick(post, e)}
                                          className="w-full px-3.5 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer"
                                        >
                                          <Trash2 className="w-3.5 h-3.5 text-red-500" />
                                          <span>Delete</span>
                                        </button>
                                      </>
                                    ) : (
                                      <div className="px-3.5 py-1.5 text-[10px] text-slate-400 border-t border-slate-100">
                                        Editor: Read/Edit only
                                      </div>
                                    )}
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

                {/* Pagination Footer */}
                <div className="p-4 sm:p-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-1.5">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                      aria-label="Previous"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
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
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                      aria-label="Next"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  <span className="text-xs text-slate-500 font-medium">
                    Showing {Math.min((currentPage - 1) * itemsPerPage + 1, posts.length)}-
                    {Math.min(currentPage * itemsPerPage, posts.length)} of {posts.length} posts
                  </span>
                </div>
              </>
            )}
          </div>
        </main>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        postTitle={postToDelete?.title}
      />
    </div>
  )
}
