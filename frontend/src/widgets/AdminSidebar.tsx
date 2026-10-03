import { LayoutDashboard, FileText, LogOut, X } from 'lucide-react';
import { Logo } from '../shared/ui';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useUserStore } from '../entities/user';
import { useAuth } from '../features/auth';

export type AdminTab =
  | 'dashboard'
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
  const { user, role } = useUserStore();
  const { logout } = useAuth();

  const isPostsActive =
    currentTab === 'posts' ||
    currentTab === 'post-create' ||
    currentTab === 'post-edit' ||
    currentTab === 'post-preview' ||
    currentTab === 'create-post' ||
    currentTab === 'edit-post' ||
    currentTab === 'preview-post' ||
    currentTab === 'empty-posts' ||
    location.pathname.startsWith('/admin/posts');

  const menuItems = [
    {
      id: 'admin-dashboard',
      path: '/admin/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      isActive:
        currentTab === 'dashboard' || location.pathname === '/admin/dashboard',
    },
    {
      id: 'admin-posts',
      path: '/admin/posts',
      label: 'Posts',
      icon: FileText,
      isActive: isPostsActive,
    },
  ];

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
    <div className="flex flex-col h-full bg-zinc-950 text-zinc-400 w-64 border-r border-zinc-800/80 select-none">
      {/* Brand Header */}
      <div className="h-14 px-5 border-b border-zinc-800/80 flex items-center justify-between">
        <Link
          to="/admin/dashboard"
          onClick={() => {
            if (onNavigate) onNavigate('admin-dashboard');
            if (onCloseMobile) onCloseMobile();
          }}
          className="flex items-center focus:outline-none cursor-pointer"
        >
          <Logo variant="light" />
        </Link>
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1 text-zinc-400 hover:text-white rounded-md hover:bg-zinc-800 cursor-pointer"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
          Platform
        </div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.id}
              to={item.path}
              onClick={() => handleNav(item.id, item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                item.isActive
                  ? 'bg-zinc-900 text-white font-medium border border-zinc-800/90 shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Profile & Logout */}
      <div className="p-3 border-t border-zinc-800/80 space-y-2">
        {/* Admin Profile Section */}
        <div className="px-3 py-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800/80 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700/80 text-zinc-200 flex items-center justify-center font-semibold text-xs uppercase flex-shrink-0">
            {user?.username ? user.username[0].toUpperCase() : 'A'}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-semibold text-zinc-100 truncate">
              {user?.username || 'Administrator'}
            </span>
            <span className="text-[11px] text-zinc-400 truncate font-normal">
              {user?.email || 'admin@example.com'}
            </span>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium text-zinc-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:block fixed inset-y-0 left-0 z-30 w-64">
        {sidebarContent}
      </aside>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-zinc-950 shadow-2xl">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}

export const Sidebar = AdminSidebar;
