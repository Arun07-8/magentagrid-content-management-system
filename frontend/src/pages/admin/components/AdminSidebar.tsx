import { LayoutDashboard, FileText, Users, Settings, LogOut, X } from 'lucide-react'
import { Logo } from '../../../components/Logo'
import { Link, useLocation, useNavigate } from 'react-router-dom'

export type AdminTab = 'dashboard' | 'posts' | 'create-post' | 'edit-post' | 'preview-post' | 'empty-posts'

interface AdminSidebarProps {
  currentTab?: AdminTab
  onNavigate?: (tab: string) => void
  mobileOpen?: boolean
  onCloseMobile?: () => void
}

export function AdminSidebar({
  currentTab,
  onNavigate,
  mobileOpen = false,
  onCloseMobile,
}: AdminSidebarProps = {}) {
  const location = useLocation()
  const navigate = useNavigate()

  const menuItems = [
    {
      id: 'admin-dashboard',
      path: '/admin/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      isActive:
        currentTab === 'dashboard' ||
        location.pathname === '/admin/dashboard',
    },
    {
      id: 'admin-posts',
      path: '/admin/posts',
      label: 'Posts',
      icon: FileText,
      isActive:
        currentTab === 'posts' ||
        currentTab === 'create-post' ||
        currentTab === 'edit-post' ||
        currentTab === 'preview-post' ||
        currentTab === 'empty-posts' ||
        location.pathname.startsWith('/admin/posts'),
    },
   
  ]

  const handleNav = (tabId: string, path: string) => {
    if (onNavigate) {
      onNavigate(tabId)
    }
    navigate(path)
    if (onCloseMobile) onCloseMobile()
  }

  const handleLogout = () => {
    if (onNavigate) {
      onNavigate('admin-login')
    }
    navigate('/admin/login')
    if (onCloseMobile) onCloseMobile()
  }

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#0d1726] text-slate-300 w-64 border-r border-slate-800/80 select-none">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800/60 flex items-center justify-between">
        <Link
          to="/admin/dashboard"
          onClick={() => {
            if (onNavigate) onNavigate('admin-dashboard')
            if (onCloseMobile) onCloseMobile()
          }}
          className="flex items-center focus:outline-none cursor-pointer"
        >
          <Logo variant="light" />
        </Link>
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Admin Profile Section */}
      <div className="px-6 py-5 border-b border-slate-800/60 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-blue-600/30 border border-blue-500/40 text-blue-400 flex items-center justify-center font-bold text-sm">
          A
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-semibold text-white truncate">Admin</span>
          <span className="text-xs text-slate-400 truncate">Administrator</span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.id}
              to={item.path}
              onClick={() => handleNav(item.id, item.path)}
              className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer ${
                item.isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Bottom Logout */}
      <div className="p-4 border-t border-slate-800/60">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:block fixed inset-y-0 left-0 z-30 w-64">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-[#0d1726] shadow-2xl">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  )
}
