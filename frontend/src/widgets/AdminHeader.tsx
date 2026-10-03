import { Search, Bell, Menu } from 'lucide-react';
import { useUserStore } from '../entities/user';

export interface AdminHeaderProps {
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  onToggleMobileMenu?: () => void;
  showSearch?: boolean;
}

export function AdminHeader({
  searchQuery = '',
  onSearchChange,
  onToggleMobileMenu,
  showSearch = true,
}: AdminHeaderProps) {
  const { user } = useUserStore();

  return (
    <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-zinc-200/80 px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between transition-all">
      {/* Left: Mobile Toggle & Search */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-1.5 text-zinc-500 hover:text-zinc-900 rounded-lg hover:bg-zinc-100 focus:outline-none transition-colors cursor-pointer"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5 stroke-[1.75]" />
          </button>
        )}

        {showSearch && onSearchChange && (
          <div className="relative w-full max-w-xs sm:max-w-sm">
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-8 pr-12 py-1.5 bg-zinc-50/80 hover:bg-zinc-50 focus:bg-white border border-zinc-200/90 rounded-lg text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-300 focus:ring-2 focus:ring-zinc-900/5 transition-all shadow-2xs"
            />
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none stroke-[2]" />
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none hidden sm:flex items-center">
              <span className="text-[10px] font-mono text-zinc-400 bg-white border border-zinc-200 rounded px-1.5 py-0.5 leading-none shadow-2xs">
                /
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Right: Actions & User Info */}
      <div className="flex items-center gap-3">
        {/* Notifications Button */}
        <button
          className="relative p-2 text-zinc-500 hover:text-zinc-900 rounded-lg hover:bg-zinc-100 border border-transparent hover:border-zinc-200/60 transition-all cursor-pointer"
          aria-label="Notifications"
          title="Notifications"
        >
          <Bell className="w-4 h-4 stroke-[1.75]" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-zinc-900 rounded-full ring-2 ring-white" />
        </button>

        {/* User Profile Pill */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-zinc-200/80">
          <div className="w-7 h-7 rounded-lg bg-zinc-900 text-white font-semibold flex items-center justify-center text-xs uppercase shadow-2xs">
            {user?.username ? user.username[0].toUpperCase() : 'A'}
          </div>
          <div className="hidden md:flex flex-col text-left">
            <span className="text-xs font-semibold text-zinc-900 leading-tight">
              {user?.username || 'Administrator'}
            </span>
            <span className="text-[11px] text-zinc-400 leading-tight font-normal">
              {user?.email || 'admin@example.com'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
