import {
  FileText,
  LogOut,
  X,
  Plus,
  LayoutGrid,
  Sparkles,
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Logo } from '../shared/ui';
import { useUserStore } from '../entities/user';
import { useAuth } from '../features/auth';

export type AdminTab =
  | 'posts'
  | 'post-create'
  | 'post-edit'
  | 'post-preview'
  | 'create-post'
  | 'edit-post'
  | 'preview-post'
  | 'empty-posts';

export interface AdminSidebarProps {
  currentTab?: AdminTab;
  onNavigate?: (tab: string) => void;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function AdminSidebar({
  currentTab,
  onNavigate,
  mobileOpen = false,
  onCloseMobile,
}: AdminSidebarProps = {}) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUserStore();
  const { logout } = useAuth();

  const isPostsActive =
    currentTab === 'posts' ||
    location.pathname === '/admin/posts' ||
    location.pathname === '/admin/dashboard';

  const isCreateActive =
    currentTab === 'post-create' ||
    currentTab === 'create-post' ||
    location.pathname === '/admin/posts/create';

  const handleNav = (tabId: string, path: string) => {
    if (onNavigate) {
      onNavigate(tabId);
    }
    navigate(path);
    if (onCloseMobile) onCloseMobile();
  };

  const handleLogout = () => {
    logout();
    if (onCloseMobile) onCloseMobile();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white rounded-[28px] p-5 shadow-[0_12px_40px_rgba(0,0,0,0.08),0_4px_12px_rgba(0,0,0,0.04)] border-2 border-zinc-200 select-none justify-between overflow-y-auto">
      {/* Top Part: Logo & Menu */}
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="flex items-center justify-between px-1 pb-4 border-b-2 border-zinc-100">
          <Link
            to="/admin/posts"
            onClick={() => onCloseMobile?.()}
            className="flex items-center gap-2 focus:outline-none cursor-pointer group"
          >
            <Logo imageClassName="h-7 sm:h-8" />
            <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700 border border-zinc-200/80">
              Studio
            </span>
          </Link>

          {onCloseMobile ? (
            <button
              onClick={onCloseMobile}
              className="lg:hidden w-7 h-7 rounded-lg text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 flex items-center justify-center cursor-pointer transition"
              aria-label="Close menu"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              className="w-7 h-7 rounded-lg border border-zinc-200/60 flex items-center justify-center text-zinc-400 hover:text-zinc-700 hover:bg-zinc-50 transition cursor-pointer"
              title="Toggle sidebar"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* MENU Section with bottom divider line */}
        <div className="pb-5 border-b-2 border-zinc-100">
          <div className="px-3 mb-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
            Menu
          </div>
          <nav className="space-y-1">
            <Link
              to="/admin/posts"
              onClick={() => handleNav('posts', '/admin/posts')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-[14px] leading-[16.1px] tracking-[0px] transition-all cursor-pointer ${
                isPostsActive
                  ? 'bg-[#F1F3F7] text-[#2A3039] font-semibold shadow-2xs border border-white/80'
                  : 'text-zinc-500 hover:text-[#2A3039] hover:bg-[#F8F9FA] font-medium'
              }`}
            >
              <FileText className="w-4 h-4 flex-shrink-0" />
              <span>Posts</span>
            </Link>

            <Link
              to="/admin/posts/create"
              onClick={() => handleNav('post-create', '/admin/posts/create')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-[14px] leading-[16.1px] tracking-[0px] transition-all cursor-pointer ${
                isCreateActive
                  ? 'bg-[#F1F3F7] text-[#2A3039] font-semibold shadow-2xs border border-white/80'
                  : 'text-zinc-500 hover:text-[#2A3039] hover:bg-[#F8F9FA] font-medium'
              }`}
            >
              <Plus className="w-4 h-4 flex-shrink-0" />
              <span>New Article</span>
            </Link>

            <Link
              to="/blog"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-[14px] leading-[16.1px] tracking-[0px] font-medium text-zinc-500 hover:text-[#2A3039] hover:bg-[#F8F9FA] transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 flex-shrink-0 text-[#FCD06B]" />
              <span>Public Feed</span>
            </Link>
          </nav>
        </div>
      </div>

      {/* Bottom Part: User Profile & Logout Action */}
      <div className="pt-3 border-t-2 border-zinc-100 space-y-2">
        {/* User Profile Pill Card (Positioned directly above Sign Out) */}
        <div className="bg-[#F8F9FA] rounded-2xl p-2.5 flex items-center gap-2.5 border border-zinc-100 hover:bg-zinc-100/70 transition cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-[#FCD06B] border border-[#eabf55] text-zinc-950 font-bold flex items-center justify-center text-xs flex-shrink-0 shadow-xs">
            {user?.username ? user.username[0].toUpperCase() : 'A'}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[14px] leading-[16.1px] font-semibold text-[#2A3039] truncate">
              {user?.username || 'Administrator'}
            </span>
            <span className="text-[11px] text-zinc-400 truncate leading-tight font-normal mt-0.5">
              {user?.email || 'admin@magentagrid.com'}
            </span>
          </div>
        </div>

        {/* Sign Out Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[14px] leading-[16.1px] font-medium text-zinc-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Floating Sidebar */}
      <aside className="hidden lg:block w-[260px] flex-shrink-0 h-[calc(100vh-2.5rem)] sticky top-5">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex p-3">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative flex-1 flex flex-col max-w-[280px] w-full z-10">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}

export const Sidebar = AdminSidebar;

