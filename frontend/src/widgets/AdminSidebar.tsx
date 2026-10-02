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
    <div className="flex flex-col h-full bg-slate-900 text-slate-300 w-64 border-r border-slate-800 select-none">
      {/* Brand Header */}
      <div className="h-14 sm:h-15 px-5 border-b border-slate-800 flex items-center justify-between">
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
            className="lg:hidden p-1 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 cursor-pointer"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Admin Profile Section */}
      <div className="px-5 py-4 border-b border-slate-800 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 flex items-center justify-center font-semibold text-xs uppercase flex-shrink-0">
          {user?.name ? user.name[0] : 'A'}
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-semibold text-white truncate">
            {user?.name || 'Administrator'}
          </span>
          <span className="text-[11px] text-slate-400 truncate capitalize font-medium">
            {role || 'admin'}
          </span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.id}
              to={item.path}
              onClick={() => handleNav(item.id, item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                item.isActive
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Logout */}
      <div className="p-3 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium text-slate-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors cursor-pointer"
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
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-[2px] transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-slate-900 shadow-2xl">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}

export const Sidebar = AdminSidebar;
