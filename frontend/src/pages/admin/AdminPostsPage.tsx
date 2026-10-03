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
import { AdminLayout } from '../../widgets';
import {
  useCmsPosts,
  useDeletePost,
  usePublishPost,
  useUnpublishPost,
} from '../../entities/post';
import { DeleteModal } from '../../features/post-management';
import { useUserStore } from '../../entities/user';
import { Spinner, ErrorState } from '../../shared/ui';
import { formatDate } from '../../shared/lib';
import type { Post } from '../../shared/types';

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

  const itemsPerPage = 8;
  const totalPages = Math.max(1, Math.ceil(posts.length / itemsPerPage));
  const paginatedPosts = posts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-[4px] flex items-center justify-between text-sm text-red-700 font-medium">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span>{actionError}</span>
          </div>
          <button
            onClick={() => setActionError(null)}
            className="text-red-500 hover:text-red-700 transition-colors"
          >
            ✕
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8 border-b border-zinc-200 pb-6">
        <div>
          <h1 className="text-[28px] font-bold text-zinc-900 tracking-tight mb-1.5">
            Posts
          </h1>
          <p className="text-[15px] font-medium text-zinc-500">
            Manage your articles and publishing workflow.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-4 text-sm font-medium">
            {(['All', 'Published', 'Draft'] as const).map((st) => (
              <button
                key={st}
                onClick={() => {
                  setStatusFilter(st);
                  setCurrentPage(1);
                }}
                className={`pb-1 border-b-2 transition-colors ${statusFilter === st
                    ? 'border-zinc-900 text-zinc-900'
                    : 'border-transparent text-zinc-500 hover:text-zinc-900'
                  }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="w-px h-6 bg-zinc-200 hidden sm:block mx-2" />

          <button
            onClick={() => navigate('/admin/posts/create')}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white text-sm font-medium rounded-[6px] hover:bg-zinc-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Post
          </button>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="w-full">
        {isLoading ? (
          <Spinner fullHeight text="Loading posts..." />
        ) : isError ? (
          <ErrorState
            title="Failed to load posts"
            message={error?.message}
            onRetry={() => refetch()}
          />
        ) : posts.length === 0 ? (
          <div className="py-24 text-center">
            <h3 className="text-xl font-bold text-zinc-900 mb-2">No articles yet</h3>
            <p className="text-zinc-500 mb-6">Create your first article and start publishing.</p>
            <button
              onClick={() => navigate('/admin/posts/create')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white text-sm font-medium rounded-[6px] hover:bg-zinc-800 transition-colors"
            >
              Create article
            </button>
          </div>
        ) : (
          <div className="flex flex-col border border-zinc-200 bg-white rounded-lg overflow-hidden shadow-sm">
            <div className="grid grid-cols-12 gap-4 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider py-3 px-6 bg-zinc-50 border-b border-zinc-200">
              <div className="col-span-6 sm:col-span-8">Article</div>
              <div className="col-span-2 hidden sm:block">Status</div>
              <div className="col-span-3 sm:col-span-2 text-right">Actions</div>
            </div>

            <div className="divide-y divide-zinc-200">
              {paginatedPosts.map((post) => {
                const postId = post._id || post.id!;
                const isMenuOpen = activeMenuId === postId;
                const formattedDate = formatDate(post.updatedAt || post.createdAt);

                return (
                  <div
                    key={postId}
                    className="grid grid-cols-12 gap-4 items-center py-4 px-6 hover:bg-zinc-50 transition-colors group cursor-pointer"
                    onClick={() => navigate(`/admin/posts/edit/${postId}`)}
                  >
                    <div className="col-span-9 sm:col-span-8 flex items-center gap-4">
                      <div className="w-10 h-10 rounded overflow-hidden bg-zinc-100 flex-shrink-0 border border-zinc-200">
                        {post.imageUrl ? (
                          <img
                            src={post.imageUrl}
                            alt={post.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <FileText className="w-4 h-4 text-zinc-300" />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-[15px] text-zinc-900 truncate pr-4 leading-snug">
                          {post.title}
                        </span>
                        <span className="text-[13px] text-zinc-500 mt-0.5 truncate">
                          {formattedDate}
                        </span>
                      </div>
                    </div>
                    <div className="col-span-2 hidden sm:flex items-center">
                      <div className="flex items-center gap-1.5 text-[13px] font-medium text-zinc-700">
                        <span className={`w-1.5 h-1.5 rounded-full ${post.status === 'Published' ? 'bg-green-500' : 'bg-amber-500'}`} />
                        {post.status}
                      </div>
                    </div>

                    <div className="col-span-3 sm:col-span-2 text-right relative flex justify-end">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isMenuOpen) {
                            setActiveMenuId(null);
                            setMenuPosition(null);
                          } else {
                            const rect = (e.currentTarget as HTMLButtonElement).getBoundingClientRect();
                            setMenuPosition({
                              top: rect.bottom + 4,
                              right: window.innerWidth - rect.right,
                            });
                            setActiveMenuId(postId);
                          }
                        }}
                        className="p-1.5 text-zinc-400 hover:text-zinc-900 rounded hover:bg-zinc-100 transition-colors focus:outline-none"
                        aria-label="Actions"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="py-6 mt-4 border-t border-zinc-200/60 flex items-center justify-between text-sm text-zinc-500 font-medium">
                <div>
                  Page {currentPage} of {totalPages}
                </div>

                <div className="flex items-center gap-4">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    className="flex items-center gap-1 hover:text-zinc-900 disabled:opacity-30 disabled:hover:text-zinc-500 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" /> Previous
                  </button>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    className="flex items-center gap-1 hover:text-zinc-900 disabled:opacity-30 disabled:hover:text-zinc-500 transition-colors"
                  >
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Fixed-position dropdown */}
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
              className="fixed z-50 w-48 bg-white border border-zinc-200 rounded-[6px] shadow-lg py-1.5 text-left"
              style={{ top: menuPosition.top, right: menuPosition.right }}
            >
              <button
                onClick={() => {
                  setActiveMenuId(null); setMenuPosition(null);
                  navigate(`/admin/posts/edit/${postId}`);
                }}
                className="w-full px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 flex items-center gap-3 font-medium transition-colors"
              >
                <Edit className="w-4 h-4 text-zinc-400" />
                Edit Article
              </button>
              <button
                onClick={() => {
                  setActiveMenuId(null); setMenuPosition(null);
                  navigate(`/admin/posts/preview/${postId}`);
                }}
                className="w-full px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 flex items-center gap-3 font-medium transition-colors"
              >
                <Eye className="w-4 h-4 text-zinc-400" />
                Preview
              </button>

              {isAdmin ? (
                <button
                  onClick={(e) => handleTogglePublish(post, e)}
                  className="w-full px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 flex items-center gap-3 border-t border-zinc-100 font-medium transition-colors"
                >
                  {post.status === 'Published' ? (
                    <><Clock className="w-4 h-4 text-zinc-400" /> Unpublish</>
                  ) : (
                    <><CheckCircle2 className="w-4 h-4 text-zinc-400" /> Publish</>
                  )}
                </button>
              ) : null}

              {isAdmin ? (
                <>
                  <div className="my-1 border-t border-zinc-100" />
                  <button
                    onClick={(e) => handleDeleteClick(post, e)}
                    className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 font-medium transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Article
                  </button>
                </>
              ) : (
                <div className="px-4 py-2 text-xs text-zinc-400 border-t border-zinc-100">
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
