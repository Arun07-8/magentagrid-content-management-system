import { useEffect } from 'react';
import {
  LogOut,
  X,
  LayoutGrid,
  Layers,
  Globe,
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../app/context/AuthContext';
import { useSiteSettings } from '../entities/settings';

export type AdminTab =
  | 'pages'
  | 'pages-edit'
  | 'pages-preview';

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
  const { user, logout } = useAuth();
  const { data: siteSettings } = useSiteSettings();

  const logo = siteSettings?.logo;
  const logoUrl = '/logo/logo.png';
  const logoText = logo?.text || 'Grido';
  const logoHeight = logo?.height ? Math.min(38, Math.max(20, logo.height)) : 26;

  const isPagesActive =
    currentTab === 'pages' ||
    currentTab === 'pages-edit' ||
    currentTab === 'pages-preview' ||
    location.pathname.startsWith('/admin/pages');

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

  // Prevent background scroll when mobile sidebar is open
  useEffect(() => {
    if (mobileOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [mobileOpen]);

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white rounded-[24px] sm:rounded-[28px] p-4 sm:p-5 shadow-[0_12px_40px_rgba(0,0,0,0.08),0_4px_12px_rgba(0,0,0,0.04)] border-2 border-zinc-200 select-none justify-between overflow-y-auto min-h-0">
      {/* Top Part: Logo & Menu */}
      <div className="space-y-5 sm:space-y-6">
        {/* Brand Header */}
        <div className="flex items-center justify-between px-2 pb-3 sm:pb-4 border-b-2 border-zinc-100 shrink-0">
          <Link
            to="/admin/pages"
            onClick={() => onCloseMobile?.()}
            className="flex items-center pl-2 focus:outline-none cursor-pointer group min-w-0"
          >
            <img
              src={logoUrl}
              alt={logoText}
              style={{
                height: `${logoHeight}px`,
                maxHeight: '36px',
              }}
              className="w-auto max-w-[135px] object-contain transition-transform duration-300 group-hover:scale-105 shrink-0"
              onError={(e) => {
                if (logo?.url && e.currentTarget.src !== logo.url) {
                  e.currentTarget.src = logo.url;
                }
              }}
            />
          </Link>

          {onCloseMobile ? (
            <button
              type="button"
              onClick={onCloseMobile}
              className="lg:hidden w-8 h-8 rounded-lg text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 flex items-center justify-center cursor-pointer transition"
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
        <div className="pb-4 sm:pb-5 border-b-2 border-zinc-100">
          <div className="px-3 mb-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
            Menu
          </div>
          <nav className="space-y-1">
            <Link
              to="/admin/pages"
              onClick={() => handleNav('pages', '/admin/pages')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-[14px] leading-[16.1px] tracking-[0px] transition-all cursor-pointer ${isPagesActive
                  ? 'bg-[#F1F3F7] text-[#2A3039] font-semibold shadow-2xs border border-white/80'
                  : 'text-zinc-500 hover:text-[#2A3039] hover:bg-[#F8F9FA] font-medium'
                }`}
            >
              <Layers className="w-4 h-4 shrink-0" />
              <span>Pages</span>
            </Link>

            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-[14px] leading-[16.1px] tracking-[0px] font-medium text-zinc-500 hover:text-[#2A3039] hover:bg-[#F8F9FA] transition-all cursor-pointer"
            >
              <Globe className="w-4 h-4 shrink-0 text-[#FCD06B]" />
              <span>View Website</span>
            </Link>
          </nav>
        </div>
      </div>

      {/* Bottom Part: User Profile & Logout Action */}
      <div className="pt-3 border-t-2 border-zinc-100 space-y-2 shrink-0">
        {/* User Profile Pill Card */}
        <div className="bg-[#F8F9FA] rounded-2xl p-2.5 flex items-center gap-2.5 border border-zinc-100 hover:bg-zinc-100/70 transition cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-[#FCD06B] border border-[#eabf55] text-zinc-950 font-bold flex items-center justify-center text-xs shrink-0 shadow-xs">
            {user?.username ? user.username[0].toUpperCase() : 'A'}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[14px] leading-[16.1px] font-semibold text-[#2A3039] truncate">
              {user?.username || 'Administrator'}
            </span>
            <span className="text-[11px] text-zinc-400 truncate leading-tight font-normal mt-0.5">
              {user?.email || 'admin@grido.io'}
            </span>
          </div>
        </div>

        {/* Sign Out Button */}
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[14px] leading-[16.1px] font-medium text-zinc-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Floating Sidebar */}
      <aside className="hidden lg:block w-[260px] shrink-0 h-[calc(100vh-2.5rem)] sticky top-5">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer (Left -> Right Slide) */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex p-3">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <div className="relative flex-1 flex flex-col max-w-[280px] w-[82vw] z-10 h-[calc(100dvh-1.5rem)] max-h-[calc(100dvh-1.5rem)]">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}

export const Sidebar = AdminSidebar;


