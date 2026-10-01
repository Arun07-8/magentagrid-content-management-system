import { Search, Bell, Menu, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'

interface AdminHeaderProps {
  searchQuery?: string
  onSearchChange?: (q: string) => void
  onToggleMobileMenu?: () => void
  onNavigatePublic?: () => void
}

export function AdminHeader({
  searchQuery = '',
  onSearchChange,
  onToggleMobileMenu,
  onNavigatePublic,
}: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-20 bg-white border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between transition-all">
      {/* Left: Mobile Toggle & Search */}
      <div className="flex items-center gap-3 sm:gap-4 flex-1 max-w-md">
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 focus:outline-none cursor-pointer"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="relative w-full max-w-xs sm:max-w-sm">
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
        </div>
      </div>

      {/* Right: Actions & User Info */}
      <div className="flex items-center gap-4 sm:gap-6">
        {/* Public Website Preview Link */}
        <Link
          to="/"
          onClick={() => onNavigatePublic?.()}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-blue-600 transition-colors"
          title="View Public Website"
        >
          <span>Public Site</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        {/* Notifications Bell */}
        <button
          className="relative p-2 text-slate-500 hover:text-slate-800 rounded-full hover:bg-slate-50 transition-colors cursor-pointer"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
        </button>

        {/* User Profile Pill */}
        <div className="flex items-center gap-2.5 pl-2 sm:border-l sm:border-slate-200">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center text-xs">
            A
          </div>
          <div className="hidden md:flex flex-col text-left">
            <span className="text-xs font-semibold text-slate-800 leading-tight">Admin</span>
            <span className="text-[11px] text-slate-400 leading-tight">Administrator</span>
          </div>
        </div>
      </div>
    </header>
  )
}
