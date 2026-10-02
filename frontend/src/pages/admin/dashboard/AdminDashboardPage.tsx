import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  CheckCircle2,
  Clock,
  Eye,
  Plus,
  ArrowRight,
  MoreVertical,
} from 'lucide-react';
import { AdminLayout } from '../../../widgets';
import { useCmsPosts } from '../../../entities/post';
import { Spinner, Badge, Button } from '../../../shared/ui';
import { formatDate, formatViews } from '../../../shared/lib';

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const { data: posts = [], isLoading } = useCmsPosts({
    search: searchQuery,
  });

  const totalPosts = posts.length;
  const publishedCount = posts.filter((p) => p.status === 'Published').length;
  const draftCount = posts.filter((p) => p.status === 'Draft').length;
  const totalViews = posts.reduce((acc, p) => acc + (p.views || 0), 0);

  const stats = [
    {
      title: 'Total Posts',
      value: String(totalPosts),
      trend: `${publishedCount} live, ${draftCount} draft`,
      icon: FileText,
    },
    {
      title: 'Published',
      value: String(publishedCount),
      trend: `${Math.round((publishedCount / (totalPosts || 1)) * 100)}% of content`,
      icon: CheckCircle2,
    },
    {
      title: 'Drafts',
      value: String(draftCount),
      trend: 'Ready for editorial review',
      icon: Clock,
    },
    {
      title: 'Total Views',
      value: formatViews(totalViews),
      trend: 'Across published articles',
      icon: Eye,
    },
  ];

  const recentPosts = posts.slice(0, 5);

  return (
    <AdminLayout
      currentTab="dashboard"
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Overview of your publications, drafts, and editorial activity.
          </p>
        </div>

        <Button
          onClick={() => navigate('/admin/posts/create')}
          leftIcon={<Plus className="w-4 h-4" />}
          className="self-start sm:self-auto"
        >
          Create Post
        </Button>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex items-start justify-between"
            >
              <div className="space-y-1">
                <span className="text-xs font-medium text-slate-500">{stat.title}</span>
                <div className="text-2xl font-bold text-slate-900 tracking-tight">
                  {isLoading ? (
                    <span className="inline-block w-8 h-6 bg-slate-200 animate-pulse rounded" />
                  ) : (
                    stat.value
                  )}
                </div>
                <span className="text-xs text-slate-400 block font-normal">
                  {stat.trend}
                </span>
              </div>

              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center flex-shrink-0 border border-slate-200/60">
                <Icon className="w-4 h-4 stroke-[1.75]" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Recent Posts Table Card */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900 tracking-tight">
              Recent Posts
            </h2>
            <button
              onClick={() => navigate('/admin/posts')}
              className="text-xs font-medium text-slate-600 hover:text-slate-900 inline-flex items-center gap-1 group cursor-pointer"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>

          {isLoading ? (
            <Spinner fullHeight text="Loading posts..." />
          ) : recentPosts.length === 0 ? (
            <div className="py-14 text-center text-slate-400">
              <FileText className="w-8 h-8 mx-auto mb-2 text-slate-300 stroke-[1.5]" />
              <p className="text-xs sm:text-sm font-medium text-slate-700">No posts created yet</p>
              <p className="text-xs text-slate-400 mt-0.5">
                Click &quot;Create Post&quot; above to start drafting articles.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm text-slate-600">
                <thead className="bg-slate-50/75 text-[11px] uppercase font-semibold text-slate-400 border-b border-slate-100">
                  <tr>
                    <th className="py-2.5 px-4 sm:px-5">Title</th>
                    <th className="py-2.5 px-4">Status</th>
                    <th className="py-2.5 px-4">Updated</th>
                    <th className="py-2.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-normal">
                  {recentPosts.map((post) => {
                    const postId = post._id || post.id;
                    const formattedDate = formatDate(post.updatedAt || post.createdAt);

                    return (
                      <tr
                        key={postId}
                        className="hover:bg-slate-50/60 transition-colors group cursor-pointer"
                        onClick={() => navigate(`/admin/posts/edit/${postId}`)}
                      >
                        <td className="py-3 px-4 sm:px-5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-md overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200/60">
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
                            <span className="font-medium text-slate-900 group-hover:text-slate-700 transition-colors truncate max-w-xs sm:max-w-sm">
                              {post.title}
                            </span>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <Badge variant={post.status === 'Published' ? 'success' : 'warning'}>
                            {post.status}
                          </Badge>
                        </td>

                        <td className="py-3 px-4 text-xs text-slate-400 whitespace-nowrap">
                          {formattedDate}
                        </td>

                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/admin/posts/edit/${postId}`);
                            }}
                            className="p-1 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100 cursor-pointer"
                            aria-label="Edit post"
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
          )}
        </div>

        {/* Sidebar: Quick Actions & System Info */}
        <div className="lg:col-span-4 space-y-5">
          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-3.5">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Quick Actions
            </h3>
            <div className="space-y-1.5">
              <button
                onClick={() => navigate('/admin/posts/create')}
                className="w-full py-2 px-3 bg-slate-50 hover:bg-slate-100 text-slate-800 font-medium text-xs rounded-lg flex items-center justify-between transition-colors cursor-pointer border border-slate-200/60"
              >
                <span>Create a new article</span>
                <Plus className="w-3.5 h-3.5 text-slate-500" />
              </button>
              <button
                onClick={() => navigate('/admin/posts')}
                className="w-full py-2 px-3 bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium text-xs rounded-lg flex items-center justify-between transition-colors cursor-pointer border border-slate-200/60"
              >
                <span>Manage all posts</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
              </button>
              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                className="w-full py-2 px-3 bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium text-xs rounded-lg flex items-center justify-between transition-colors cursor-pointer border border-slate-200/60"
              >
                <span>View live public website</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
              </a>
            </div>
          </div>

          {/* Minimal Platform Status Note */}
          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <h4 className="text-xs font-semibold text-slate-900">Real-Time Sync Active</h4>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed font-normal">
              Post edits and publishing updates sync across browser tabs and public views instantly via WebSockets.
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export const DashboardPage = AdminDashboardPage;
