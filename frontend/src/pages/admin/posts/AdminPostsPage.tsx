import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  AlertCircle,
} from 'lucide-react';
import { AdminLayout } from '../../../widgets';
import { useCmsPosts } from '../../../entities/post';
import {
  useDeletePost,
  usePublishPost,
  useUnpublishPost,
  DeleteModal,
} from '../../../features/post-management';
import { useUserStore } from '../../../entities/user';
import { Button, Badge, Spinner, EmptyState, ErrorState } from '../../../shared/ui';
import { formatDate } from '../../../shared/lib';
import type { Post } from '../../../shared/types';

export default function AdminPostsPage() {
  const navigate = useNavigate();
  const { role } = useUserStore();
  const isAdmin = role === 'admin';

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Draft' | 'Published'>('All');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [actionError, setActionError] = useState<string | null>(null);

  const {
    data: posts = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useCmsPosts({
    search: searchQuery,
    status: statusFilter === 'All' ? undefined : statusFilter,
  });

  const deleteMutation = useDeletePost();
  const publishMutation = usePublishPost();
  const unpublishMutation = useUnpublishPost();

  const itemsPerPage = 6;
  const totalPages = Math.max(1, Math.ceil(posts.length / itemsPerPage));
  const paginatedPosts = posts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleSelectAll = () => {
    if (selectedIds.length === paginatedPosts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedPosts.map((p) => p._id || p.id!));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleDeleteClick = (post: Post, e: React.MouseEvent) => {
    e.stopPropagation();
    setPostToDelete(post);
    setActiveMenuId(null);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!postToDelete) return;
    const id = postToDelete._id || postToDelete.id!;
    setActionError(null);

    try {
      await deleteMutation.mutateAsync(id);
      setDeleteModalOpen(false);
      setPostToDelete(null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete post';
      setActionError(message);
      setDeleteModalOpen(false);
    }
  };

  const handleTogglePublish = async (post: Post, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveMenuId(null);
    setActionError(null);

    const id = post._id || post.id!;

    try {
      if (post.status === 'Published') {
        await unpublishMutation.mutateAsync(id);
      } else {
        await publishMutation.mutateAsync(id);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Permission denied or update failed';
      setActionError(message);
    }
  };

  return (
    <AdminLayout
      currentTab="posts"
      searchQuery={searchQuery}
      onSearchChange={(q) => {
        setSearchQuery(q);
        setCurrentPage(1);
      }}
    >
      {actionError && (
        <div className="bg-white border border-rose-200 rounded-xl p-3.5 flex items-center justify-between text-xs text-rose-600 shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500" />
            <span>{actionError}</span>
          </div>
          <button
            onClick={() => setActionError(null)}
            className="text-slate-400 hover:text-slate-700 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Posts
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage your articles, drafts, categories, and publishing workflows.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Status Filter Segmented Control */}
          <div className="flex items-center bg-slate-100/90 border border-slate-200/80 rounded-lg p-0.5 text-xs">
            {(['All', 'Published', 'Draft'] as const).map((st) => (
              <button
                key={st}
                onClick={() => {
                  setStatusFilter(st);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-md transition-all cursor-pointer font-medium ${
                  statusFilter === st
                    ? 'bg-white text-slate-900 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <Button
            onClick={() => navigate('/admin/posts/create')}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Create Post
          </Button>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        {isLoading ? (
          <Spinner fullHeight text="Loading posts..." />
        ) : isError ? (
          <ErrorState
            title="Failed to load posts"
            message={error?.message}
            onRetry={() => refetch()}
          />
        ) : posts.length === 0 ? (
          <EmptyState
            title="No posts found"
            description={
              searchQuery || statusFilter !== 'All'
                ? 'No posts match your search or filter criteria.'
                : 'Get started by creating your first article.'
            }
            action={
              <Button
                onClick={() => navigate('/admin/posts/create')}
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Create Post
              </Button>
            }
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm text-slate-600">
                <thead className="bg-slate-50/75 text-[11px] uppercase font-semibold text-slate-400 border-b border-slate-100">
                  <tr>
                    <th className="py-3 px-4 w-10">
                      <input
                        type="checkbox"
                        checked={
                          selectedIds.length === paginatedPosts.length &&
                          paginatedPosts.length > 0
                        }
                        onChange={toggleSelectAll}
                        className="w-4 h-4 rounded text-slate-900 focus:ring-slate-900/20 border-slate-300 cursor-pointer"
                      />
                    </th>
                    <th className="py-3 px-4">Article</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Updated</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 font-normal">
                  {paginatedPosts.map((post) => {
                    const postId = post._id || post.id!;
                    const isSelected = selectedIds.includes(postId);
                    const isMenuOpen = activeMenuId === postId;
                    const formattedDate = formatDate(post.updatedAt || post.createdAt);

                    return (
                      <tr
                        key={postId}
                        className={`hover:bg-slate-50/60 transition-colors group ${
                          isSelected ? 'bg-slate-50/90' : ''
                        }`}
                      >
                        <td className="py-3 px-4">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectOne(postId)}
                            className="w-4 h-4 rounded text-slate-900 focus:ring-slate-900/20 border-slate-300 cursor-pointer"
                          />
                        </td>

                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-md overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200/60">
                              <img
                                src={
                                  post.imageUrl ||
                                  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80'
                                }
                                alt={post.title}
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src =
                                    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80';
                                }}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <span
                              onClick={() => navigate(`/admin/posts/edit/${postId}`)}
                              className="font-medium text-slate-900 hover:text-slate-700 transition-colors cursor-pointer truncate max-w-xs sm:max-w-sm"
                            >
                              {post.title}
                            </span>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <span className="text-xs text-slate-600 font-medium">
                            {post.category || 'Technology'}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <Badge variant={post.status === 'Published' ? 'success' : 'warning'}>
                            {post.status}
                          </Badge>
                        </td>

                        <td className="py-3 px-4 text-xs text-slate-400 whitespace-nowrap">
                          {formattedDate}
                        </td>

                        <td className="py-3 px-4 text-right relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMenuId(isMenuOpen ? null : postId);
                            }}
                            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-100 focus:outline-none cursor-pointer"
                            aria-label="Actions"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {isMenuOpen && (
                            <>
                              <div
                                className="fixed inset-0 z-30"
                                onClick={() => setActiveMenuId(null)}
                              />
                              <div className="absolute right-4 mt-1 w-40 bg-white border border-slate-200/90 rounded-xl shadow-lg py-1.5 z-40 text-left animate-in fade-in zoom-in-95 duration-100">
                                <button
                                  onClick={() => {
                                    setActiveMenuId(null);
                                    navigate(`/admin/posts/edit/${postId}`);
                                  }}
                                  className="w-full px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer font-medium"
                                >
                                  <Edit className="w-3.5 h-3.5 text-slate-400" />
                                  <span>Edit</span>
                                </button>
                                <button
                                  onClick={() => {
                                    setActiveMenuId(null);
                                    navigate(`/admin/posts/preview/${postId}`);
                                  }}
                                  className="w-full px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer font-medium"
                                >
                                  <Eye className="w-3.5 h-3.5 text-slate-400" />
                                  <span>Preview</span>
                                </button>

                                {isAdmin ? (
                                  <button
                                    onClick={(e) => handleTogglePublish(post, e)}
                                    className="w-full px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer border-t border-slate-100 font-medium"
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

                                {isAdmin ? (
                                  <>
                                    <div className="my-1 border-t border-slate-100" />
                                    <button
                                      onClick={(e) => handleDeleteClick(post, e)}
                                      className="w-full px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer font-medium"
                                    >
                                      <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                                      <span>Delete</span>
                                    </button>
                                  </>
                                ) : (
                                  <div className="px-3 py-1 text-[10px] text-slate-400 border-t border-slate-100">
                                    Editor: Read/Edit only
                                  </div>
                                )}
                              </div>
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="p-3.5 sm:p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-slate-400 font-normal order-2 sm:order-1">
                Showing {Math.min((currentPage - 1) * itemsPerPage + 1, posts.length)}-
                {Math.min(currentPage * itemsPerPage, posts.length)} of {posts.length} posts
              </span>

              <div className="flex items-center gap-1 order-1 sm:order-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  className="w-7 h-7 rounded-md border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Previous"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                  <button
                    key={num}
                    onClick={() => setCurrentPage(num)}
                    className={`w-7 h-7 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                      currentPage === num
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {num}
                  </button>
                ))}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  className="w-7 h-7 rounded-md border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Next"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        postTitle={postToDelete?.title}
        isDeleting={deleteMutation.isPending}
      />
    </AdminLayout>
  );
}

export const PostsPage = AdminPostsPage;
