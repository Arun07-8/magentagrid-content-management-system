import { Search, Menu, SlidersHorizontal } from 'lucide-react';

export interface AdminHeaderProps {
  title?: string;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  onToggleMobileMenu?: () => void;
  showSearch?: boolean;
}

export function AdminHeader({
  title,
  searchQuery = '',
  onSearchChange,
  onToggleMobileMenu,
  showSearch = true,
}: AdminHeaderProps) {
  return (
    <header className={`flex items-center gap-3 min-w-0 ${!showSearch ? 'lg:hidden' : ''}`}>
      {/* Mobile Sidebar Toggle Button */}
      {onToggleMobileMenu && (
        <button
          type="button"
          onClick={onToggleMobileMenu}
          className="lg:hidden w-10 h-10 rounded-full bg-white border-2 border-zinc-200 shadow-[0_6px_24px_rgba(0,0,0,0.06),0_2px_6px_rgba(0,0,0,0.03)] flex items-center justify-center text-zinc-600 hover:text-zinc-900 transition shrink-0 cursor-pointer"
          aria-label="Open sidebar"
        >
          <Menu className="w-4 h-4 stroke-[2]" />
        </button>
      )}

      {/* Optional Title on mobile when search is off */}
      {!showSearch && title && (
        <div className="flex-1 min-w-0">
          <h1 className="text-base sm:text-lg font-bold text-[#2A3039] truncate">
            {title}
          </h1>
        </div>
      )}

      {/* Center Pill: Search input with Filter icon */}
      {showSearch && onSearchChange && (
        <div className="flex-1 max-w-xl min-w-0">
          <div className="w-full h-10 px-4 rounded-full bg-white border-2 border-zinc-200 shadow-[0_6px_24px_rgba(0,0,0,0.06),0_2px_6px_rgba(0,0,0,0.03)] flex items-center gap-2.5 transition-all focus-within:border-zinc-400 focus-within:shadow-md">
            <Search className="w-4 h-4 text-zinc-400 stroke-[2] shrink-0" />
            <input
              type="text"
              placeholder="Search for articles, drafts..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-transparent text-[14px] leading-[16.1px] tracking-[0px] text-[#2A3039] placeholder:text-zinc-400 focus:outline-none font-medium truncate"
            />
            <button
              type="button"
              title="Filters"
              className="text-zinc-400 hover:text-zinc-700 transition shrink-0 cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 stroke-[1.75]" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}


