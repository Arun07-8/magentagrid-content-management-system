import { Search, Bell, Menu, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUserStore } from '../entities/user';

export interface AdminHeaderProps {
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  onToggleMobileMenu?: () => void;
  onNavigatePublic?: () => void;
  showSearch?: boolean;
}

export function AdminHeader({
  searchQuery = '',
  onSearchChange,
  onToggleMobileMenu,
  onNavigatePublic,
  showSearch = true,
}: AdminHeaderProps) {
  const { user, role } = useUserStore();

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 h-14 sm:h-15 flex items-center justify-between transition-all">
      {/* Left: Mobile Toggle & Search */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-1.5 text-slate-500 hover:text-slate-800 rounded-md hover:bg-slate-100 focus:outline-none cursor-pointer"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {showSearch && onSearchChange && (
          <div className="relative w-full max-w-xs sm:max-w-sm">
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200/90 rounded-md text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
          </div>
        )}
      </div>

      {/* Right: Actions & User Info */}
      <div className="flex items-center gap-3 sm:gap-5">
        {/* Public Website Preview Link */}
        <Link
          to="/"
          onClick={() => onNavigatePublic?.()}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors"
          title="View Public Website"
        >
          <span>Public Site</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        {/* Notifications Bell */}
        <button
          className="relative p-1.5 text-slate-500 hover:text-slate-800 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-rose-500 rounded-full" />
        </button>

        {/* User Profile Pill */}
        <div className="flex items-center gap-2 pl-2 sm:border-l sm:border-slate-200">
          <div className="w-7 h-7 rounded-md bg-slate-100 border border-slate-200/90 text-slate-700 font-semibold flex items-center justify-center text-xs uppercase">
            {user?.name ? user.name[0] : 'A'}
          </div>
          <div className="hidden md:flex flex-col text-left">
            <span className="text-xs font-semibold text-slate-800 leading-tight">
              {user?.name || 'Administrator'}
            </span>
            <span className="text-[11px] text-slate-400 leading-tight capitalize">
              {role || 'admin'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
