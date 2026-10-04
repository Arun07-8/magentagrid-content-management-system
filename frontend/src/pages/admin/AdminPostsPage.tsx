import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Eye,
  Pencil,
  Trash2,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Image as ImageIcon,
  Search,
  SlidersHorizontal,
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
  const { role, user } = useUserStore();
  const isAdmin = role === 'admin';

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Draft' | 'Published'>('All');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
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

  const totalPosts = posts.length;
  const totalPages = Math.max(1, Math.ceil(totalPosts / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalPosts);
  const paginatedPosts = posts.slice(startIndex, endIndex);

  const handleDeleteClick = (post: Post, e: React.MouseEvent) => {
    e.stopPropagation();
    setPostToDelete(post);
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
      showSearch={false}
    >
      {actionError && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center justify-between text-xs text-red-700 font-semibold shadow-xs">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <span>{actionError}</span>
          </div>
          <button
            onClick={() => setActionError(null)}
            className="text-red-500 hover:text-red-800 transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Articles Directory Section */}
      <section className="bg-white rounded-[28px] p-5 sm:p-6 lg:p-7 shadow-[0_12px_40px_rgba(0,0,0,0.08),0_4px_12px_rgba(0,0,0,0.04)] border-2 border-zinc-200 flex flex-col flex-1 h-full lg:h-[calc(100vh-2.5rem)] min-h-0 justify-between overflow-hidden">
        {/* Section Header with Title, Filter Tabs, and Action Buttons */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 sm:mb-5 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-[#F8F9FA] border border-zinc-200/80 flex items-center justify-center text-zinc-700 shadow-2xs">
              <ImageIcon className="w-4 h-4 stroke-[2]" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-base sm:text-lg font-bold text-[#2A3039] tracking-tight leading-none">
                  Articles Directory
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#F4F5F8] text-zinc-600 border border-zinc-200/80">
                  {totalPosts} {totalPosts === 1 ? 'article' : 'articles'}
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                Manage, edit and publish all articles in your workspace
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Filter Pills */}
            <div className="flex items-center gap-1 bg-[#F4F5F8] p-1 rounded-full border border-zinc-200/60">
              {(['All', 'Published', 'Draft'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => {
                    setStatusFilter(st);
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                    statusFilter === st
                      ? 'bg-white text-zinc-900 shadow-xs'
                      : 'text-zinc-500 hover:text-zinc-800'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <button
              onClick={() => navigate('/admin/posts/create')}
              className="h-9 px-4 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs hover:shadow-sm cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Article</span>
            </button>
          </div>
        </div>

        {/* Full-width Search Bar spanning end-to-end below heading */}
        <div className="w-full mb-4 sm:mb-5 flex-shrink-0">
          <div className="w-full h-11 sm:h-12 px-4 sm:px-5 rounded-full bg-white border-2 border-zinc-200 shadow-[0_4px_16px_rgba(0,0,0,0.04)] flex items-center gap-3 transition-all focus-within:border-zinc-400 focus-within:shadow-md">
            <Search className="w-4 h-4 text-zinc-400 stroke-[2] flex-shrink-0" />
            <input
              type="text"
              placeholder="Search for articles, drafts..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-transparent text-[14px] leading-[16.1px] tracking-[0px] text-[#2A3039] placeholder:text-zinc-400 focus:outline-none font-medium truncate"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setCurrentPage(1);
                }}
                className="text-zinc-400 hover:text-zinc-700 text-xs font-semibold px-2 py-0.5 rounded-full hover:bg-zinc-100 transition cursor-pointer flex-shrink-0"
              >
                Clear
              </button>
            )}
            <div className="text-zinc-400 flex items-center justify-center flex-shrink-0 pl-1 border-l border-zinc-200">
              <SlidersHorizontal className="w-3.5 h-3.5 stroke-[1.75]" />
            </div>
          </div>
        </div>

        {/* Content Body: Table or Loading / Empty States */}
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center py-10 min-h-0">
            <Spinner fullHeight text="Loading articles..." />
          </div>
        ) : isError ? (
          <div className="flex-1 flex items-center justify-center min-h-0">
            <ErrorState
              title="Failed to load posts"
              message={error?.message}
              onRetry={() => refetch()}
            />
          </div>
        ) : posts.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-12 text-center bg-[#FAFBFD] rounded-2xl border border-zinc-100 min-h-0">
            <h3 className="text-base font-bold text-zinc-900 mb-1">No articles found</h3>
            <p className="text-xs text-zinc-400 mb-5">
              {searchQuery ? 'Try a different search query.' : 'Start writing your first publication to populate the workspace.'}
            </p>
            <button
              onClick={() => navigate('/admin/posts/create')}
              className="inline-flex items-center gap-2 h-9 px-5 bg-zinc-900 text-white text-xs font-semibold rounded-full hover:bg-zinc-800 transition cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create article</span>
            </button>
          </div>
        ) : (
          <div className="flex-1 min-h-0 flex flex-col justify-between gap-3 sm:gap-4">
            {/* Mobile Card Grid View (< md screen size) */}
            <div className="md:hidden flex-1 min-h-0 overflow-y-auto space-y-3 pr-0.5">
              {paginatedPosts.map((post) => {
                const postId = post._id || post.id!;
                const isPublished = post.status === 'Published';
                const formattedDate = formatDate(post.updatedAt || post.createdAt);
                const authorName = post.author?.name || user?.username || 'Arun';
                const authorInitial = authorName[0]?.toUpperCase() || 'A';

                return (
                  <div
                    key={postId}
                    onClick={() => navigate(`/admin/posts/edit/${postId}`)}
                    className="bg-white rounded-2xl p-4 border border-zinc-200/90 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex flex-col gap-2.5 group"
                  >
                    <div className="flex items-start gap-3">
                      {/* Thumbnail */}
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#F8F9FA] border border-zinc-200/80 flex-shrink-0 flex items-center justify-center">
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
                          <FileText className="w-5 h-5 text-zinc-300 stroke-[1.5]" />
                        )}
                      </div>

                      {/* Title & Status */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              isPublished
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/70'
                                : 'bg-[#FCD06B]/25 text-amber-950 border border-[#FCD06B]/70'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                isPublished ? 'bg-emerald-500' : 'bg-[#e5b33d]'
                              }`}
                            />
                            {post.status}
                          </span>
                          <span className="text-[11px] font-medium text-zinc-400">
                            {formattedDate}
                          </span>
                        </div>

                        <h3 className="text-[14px] leading-[1.35] font-bold text-[#2A3039] group-hover:text-zinc-600 transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                      </div>
                    </div>

                    {post.description && (
                      <p className="text-xs text-zinc-400 font-normal line-clamp-2">
                        {post.description}
                      </p>
                    )}

                    {/* Footer Meta & Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-zinc-100">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-700 text-[9px] font-bold flex items-center justify-center flex-shrink-0">
                          {authorInitial}
                        </div>
                        <span className="text-xs font-medium text-zinc-600 truncate max-w-[110px]">
                          {authorName}
                        </span>
                      </div>

                      <div
                        className="flex items-center gap-1.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={() => navigate(`/admin/posts/preview/${postId}`)}
                          className="w-8 h-8 rounded-full bg-zinc-50 border border-zinc-200 text-zinc-600 hover:text-zinc-900 flex items-center justify-center transition cursor-pointer"
                          title="Preview article"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => navigate(`/admin/posts/edit/${postId}`)}
                          className="w-8 h-8 rounded-full bg-zinc-50 border border-zinc-200 text-zinc-600 hover:text-zinc-900 flex items-center justify-center transition cursor-pointer"
                          title="Edit article"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>

                        {isAdmin && (
                          <button
                            type="button"
                            onClick={(e) => handleTogglePublish(post, e)}
                            className="w-8 h-8 rounded-full bg-zinc-50 border border-zinc-200 text-zinc-600 hover:text-zinc-900 flex items-center justify-center transition cursor-pointer"
                            title={isPublished ? 'Set to draft' : 'Publish article'}
                          >
                            {isPublished ? (
                              <Clock className="w-3.5 h-3.5 text-[#FCD06B]" />
                            ) : (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            )}
                          </button>
                        )}

                        {isAdmin && (
                          <button
                            type="button"
                            onClick={(e) => handleDeleteClick(post, e)}
                            className="w-8 h-8 rounded-full bg-zinc-50 border border-zinc-200 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition cursor-pointer"
                            title="Delete article"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Clean, Modern Articles Data Table (hidden on mobile md:block) */}
            <div className="hidden md:block overflow-x-auto overflow-y-auto flex-1 min-h-0 rounded-2xl border border-zinc-200/90 shadow-2xs bg-white">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-[#F8F9FA] z-10">
                  <tr className="border-b border-zinc-200/90 text-[11px] font-bold text-zinc-400 uppercase tracking-wider select-none">
                    <th className="py-3.5 px-4 sm:px-5 font-bold">Article</th>
                    <th className="py-3.5 px-4 font-bold">Author</th>
                    <th className="py-3.5 px-4 font-bold">Date</th>
                    <th className="py-3.5 px-4 font-bold">Status</th>
                    <th className="py-3.5 px-4 sm:px-5 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 text-sm">
                  {paginatedPosts.map((post) => {
                    const postId = post._id || post.id!;
                    const isPublished = post.status === 'Published';
                    const formattedDate = formatDate(post.updatedAt || post.createdAt);
                    const authorName = post.author?.name || user?.username || 'Arun';
                    const authorInitial = authorName[0]?.toUpperCase() || 'A';

                    return (
                      <tr
                        key={postId}
                        onClick={() => navigate(`/admin/posts/edit/${postId}`)}
                        className="hover:bg-[#F9FAFB] transition-colors cursor-pointer group"
                      >
                        {/* Column 1: Featured Thumbnail + Title + Excerpt */}
                        <td className="py-3.5 px-4 sm:px-5">
                          <div className="flex items-center gap-3.5 min-w-[260px]">
                            <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#F8F9FA] border border-zinc-200/80 flex-shrink-0 flex items-center justify-center shadow-2xs">
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
                                <FileText className="w-5 h-5 text-zinc-300 stroke-[1.5]" />
                              )}
                            </div>

                            <div className="min-w-0 flex-1">
                              <h3 className="text-[14px] leading-[1.35] font-semibold text-[#2A3039] group-hover:text-[#FCD06B] transition-colors truncate max-w-xs sm:max-w-md">
                                {post.title}
                              </h3>
                              {post.description && (
                                <p className="text-xs text-zinc-400 font-normal truncate max-w-xs sm:max-w-md mt-0.5">
                                  {post.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Column 2: Author */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-700 text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                              {authorInitial}
                            </div>
                            <span className="text-xs font-medium text-zinc-700">
                              {authorName}
                            </span>
                          </div>
                        </td>

                        {/* Column 3: Formatted Date */}
                        <td className="py-3.5 px-4 whitespace-nowrap text-xs font-medium text-zinc-500">
                          {formattedDate}
                        </td>

                        {/* Column 4: Compact Status Badge */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              isPublished
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/70'
                                : 'bg-[#FCD06B]/25 text-amber-950 border border-[#FCD06B]/70'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                isPublished ? 'bg-emerald-500' : 'bg-[#e5b33d]'
                              }`}
                            />
                            {post.status}
                          </span>
                        </td>

                        {/* Column 5: Action Buttons */}
                        <td className="py-3.5 px-4 sm:px-5 whitespace-nowrap text-right">
                          <div
                            className="flex items-center justify-end gap-1.5"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              type="button"
                              onClick={() => navigate(`/admin/posts/preview/${postId}`)}
                              className="w-8 h-8 rounded-full bg-white border border-zinc-200/80 hover:border-zinc-300 hover:bg-zinc-50 text-zinc-500 hover:text-zinc-900 shadow-2xs flex items-center justify-center transition cursor-pointer"
                              title="Preview article"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => navigate(`/admin/posts/edit/${postId}`)}
                              className="w-8 h-8 rounded-full bg-white border border-zinc-200/80 hover:border-zinc-300 hover:bg-zinc-50 text-zinc-500 hover:text-zinc-900 shadow-2xs flex items-center justify-center transition cursor-pointer"
                              title="Edit article"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>

                            {isAdmin && (
                              <button
                                type="button"
                                onClick={(e) => handleTogglePublish(post, e)}
                                className="w-8 h-8 rounded-full bg-white border border-zinc-200/80 hover:border-zinc-300 hover:bg-zinc-50 text-zinc-500 hover:text-zinc-900 shadow-2xs flex items-center justify-center transition cursor-pointer"
                                title={isPublished ? 'Set to draft' : 'Publish article'}
                              >
                                {isPublished ? (
                                  <Clock className="w-3.5 h-3.5 text-[#FCD06B]" />
                                ) : (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                )}
                              </button>
                            )}

                            {isAdmin && (
                              <button
                                type="button"
                                onClick={(e) => handleDeleteClick(post, e)}
                                className="w-8 h-8 rounded-full bg-white border border-zinc-200/80 hover:border-rose-200 hover:bg-rose-50 text-zinc-400 hover:text-rose-600 shadow-2xs flex items-center justify-center transition cursor-pointer"
                                title="Delete article"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {posts.length > 0 && (
              <div className="pt-3 sm:pt-4 border-t-2 border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-medium text-zinc-500 flex-shrink-0">
                {/* Left: Showing range + Per-page selector */}
                <div className="flex flex-wrap items-center gap-3">
                  <span>
                    Showing <span className="font-bold text-zinc-900">{totalPosts === 0 ? 0 : startIndex + 1}–{endIndex}</span> of{' '}
                    <span className="font-bold text-zinc-900">{totalPosts}</span> posts
                  </span>

                  <div className="flex items-center gap-1.5 sm:ml-2 text-zinc-400">
                    <span className="text-[11px]">Per page:</span>
                    <div className="inline-flex bg-[#F4F5F8] p-0.5 rounded-full border border-zinc-200/60">
                      {[5, 10, 15, 25].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => {
                            setItemsPerPage(num);
                            setCurrentPage(1);
                          }}
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                            itemsPerPage === num
                              ? 'bg-white text-zinc-900 shadow-xs'
                              : 'text-zinc-400 hover:text-zinc-700'
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: Page Numbers + Prev/Next Buttons */}
                <div className="flex items-center gap-1.5 self-center sm:self-auto">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="h-8 px-3 rounded-full bg-white border border-zinc-200/80 shadow-2xs text-xs font-semibold text-zinc-700 hover:bg-zinc-50 disabled:opacity-40 disabled:hover:bg-white flex items-center gap-1 transition cursor-pointer"
                    title="Previous page"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Prev</span>
                  </button>

                  {/* Numbered Page Pills */}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-8 h-8 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center justify-center ${
                          currentPage === pageNum
                            ? 'bg-zinc-900 text-white shadow-xs'
                            : 'bg-white border border-zinc-200/70 text-zinc-600 hover:bg-zinc-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}
                  </div>

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="h-8 px-3 rounded-full bg-white border border-zinc-200/80 shadow-2xs text-xs font-semibold text-zinc-700 hover:bg-zinc-50 disabled:opacity-40 disabled:hover:bg-white flex items-center gap-1 transition cursor-pointer"
                    title="Next page"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </section>



      {/* Delete Modal Confirmation */}
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

