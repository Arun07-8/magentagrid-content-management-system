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
  FileText,
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
  const [menuPosition, setMenuPosition] = useState<{ top: number; right: number } | null>(null);
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
            className="text-zinc-400 hover:text-zinc-700 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
            Posts
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
            Manage your articles, drafts, categories, and publishing workflows.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Status Filter Segmented Control */}
          <div className="flex items-center bg-zinc-100 border border-zinc-200 rounded-lg p-0.5 text-xs">
            {(['All', 'Published', 'Draft'] as const).map((st) => (
              <button
                key={st}
                onClick={() => {
                  setStatusFilter(st);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-md transition-all cursor-pointer font-medium ${statusFilter === st
                    ? 'bg-white text-zinc-900 font-semibold shadow-xs'
                    : 'text-zinc-600 hover:text-zinc-900'
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
      <div className="bg-white rounded-xl border border-zinc-200/80 shadow-xs overflow-hidden">
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
              <table className="w-full text-left text-xs sm:text-sm text-zinc-600">
                <thead className="bg-zinc-50/75 text-[11px] uppercase font-semibold text-zinc-500 border-b border-zinc-100">
                  <tr>
                    <th className="py-3 px-4 w-10">
                      <input
                        type="checkbox"
                        checked={
                          selectedIds.length === paginatedPosts.length &&
                          paginatedPosts.length > 0
                        }
                        onChange={toggleSelectAll}
                        className="w-4 h-4 rounded text-zinc-900 focus:ring-zinc-900 border-zinc-300 cursor-pointer accent-zinc-900"
                      />
                    </th>
                    <th className="py-3 px-4">Article</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Updated</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-zinc-100 font-normal">
                  {paginatedPosts.map((post) => {
                    const postId = post._id || post.id!;
                    const isSelected = selectedIds.includes(postId);
                    const isMenuOpen = activeMenuId === postId;
                    const formattedDate = formatDate(post.updatedAt || post.createdAt);

                    return (
                      <tr
                        key={postId}
                        className={`hover:bg-zinc-50/70 transition-colors group ${isSelected ? 'bg-zinc-50' : ''
                          }`}
                      >
                        <td className="py-3 px-4">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectOne(postId)}
                            className="w-4 h-4 rounded text-zinc-900 focus:ring-zinc-900 border-zinc-300 cursor-pointer accent-zinc-900"
                          />
                        </td>

                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg overflow-hidden bg-zinc-100 flex-shrink-0 border border-zinc-200/60 flex items-center justify-center">
                              {post.imageUrl ? (
                                <img
                                  src={post.imageUrl}
                                  alt={post.title}
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                  }}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <FileText className="w-4 h-4 text-zinc-400" />
                              )}
                            </div>
                            <span
                              onClick={() => navigate(`/admin/posts/edit/${postId}`)}
                              className="font-medium text-zinc-900 hover:text-zinc-700 transition-colors cursor-pointer truncate max-w-xs sm:max-w-sm"
                            >
                              {post.title}
                            </span>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <span className="text-xs text-zinc-600 font-medium">
                            {post.category || 'Technology'}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <Badge variant={post.status === 'Published' ? 'success' : 'warning'}>
                            {post.status}
                          </Badge>
                        </td>

                        <td className="py-3 px-4 text-xs text-zinc-400 whitespace-nowrap">
                          {formattedDate}
                        </td>

                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (isMenuOpen) {
                                setActiveMenuId(null);
                                setMenuPosition(null);
                              } else {
                                const rect = (e.currentTarget as HTMLButtonElement).getBoundingClientRect();
                                setMenuPosition({
                                  top: rect.bottom + 6,
                                  right: window.innerWidth - rect.right,
                                });
                                setActiveMenuId(postId);
                              }
                            }}
                            className="p-1.5 text-zinc-400 hover:text-zinc-700 rounded-md hover:bg-zinc-100 focus:outline-none cursor-pointer"
                            aria-label="Actions"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="p-3.5 sm:p-4 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-zinc-400 font-normal order-2 sm:order-1">
                Showing {Math.min((currentPage - 1) * itemsPerPage + 1, posts.length)}-
                {Math.min(currentPage * itemsPerPage, posts.length)} of {posts.length} posts
              </span>

              <div className="flex items-center gap-1 order-1 sm:order-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  className="w-7 h-7 rounded-md border border-zinc-200 flex items-center justify-center text-zinc-500 hover:bg-zinc-50 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Previous"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                  <button
                    key={num}
                    onClick={() => setCurrentPage(num)}
                    className={`w-7 h-7 rounded-md text-xs font-semibold transition-colors cursor-pointer ${currentPage === num
                        ? 'bg-zinc-900 text-white'
                        : 'text-zinc-600 hover:bg-zinc-100'
                      }`}
                  >
                    {num}
                  </button>
                ))}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  className="w-7 h-7 rounded-md border border-zinc-200 flex items-center justify-center text-zinc-500 hover:bg-zinc-50 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Next"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Fixed-position dropdown — renders above all table overflow */}
      {activeMenuId && menuPosition && (() => {
        const post = paginatedPosts.find(p => (p._id || p.id) === activeMenuId);
        if (!post) return null;
        const postId = post._id || post.id!;
        return (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => { setActiveMenuId(null); setMenuPosition(null); }}
            />
            <div
              className="fixed z-50 w-44 bg-white border border-zinc-200 rounded-xl shadow-xl py-1.5 text-left animate-in fade-in zoom-in-95 duration-100"
              style={{ top: menuPosition.top, right: menuPosition.right }}
            >
              <button
                onClick={() => {
                  setActiveMenuId(null); setMenuPosition(null);
                  navigate(`/admin/posts/edit/${postId}`);
                }}
                className="w-full px-3 py-1.5 text-xs text-zinc-700 hover:bg-zinc-50 flex items-center gap-2 cursor-pointer font-medium"
              >
                <Edit className="w-3.5 h-3.5 text-zinc-400" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => {
                  setActiveMenuId(null); setMenuPosition(null);
                  navigate(`/admin/posts/preview/${postId}`);
                }}
                className="w-full px-3 py-1.5 text-xs text-zinc-700 hover:bg-zinc-50 flex items-center gap-2 cursor-pointer font-medium"
              >
                <Eye className="w-3.5 h-3.5 text-zinc-400" />
                <span>Preview</span>
              </button>

              {isAdmin ? (
                <button
                  onClick={(e) => handleTogglePublish(post, e)}
                  className="w-full px-3 py-1.5 text-xs text-zinc-700 hover:bg-zinc-50 flex items-center gap-2 cursor-pointer border-t border-zinc-100 font-medium"
                >
                  {post.status === 'Published' ? (
                    <><Clock className="w-3.5 h-3.5 text-amber-500" /><span>Unpublish</span></>
                  ) : (
                    <><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /><span>Publish</span></>
                  )}
                </button>
              ) : null}

              {isAdmin ? (
                <>
                  <div className="my-1 border-t border-zinc-100" />
                  <button
                    onClick={(e) => handleDeleteClick(post, e)}
                    className="w-full px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer font-medium"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </>
              ) : (
                <div className="px-3 py-1.5 text-[10px] text-zinc-400 border-t border-zinc-100">
                  Editor: Read/Edit only
                </div>
              )}
            </div>
          </>
        );
      })()}
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
