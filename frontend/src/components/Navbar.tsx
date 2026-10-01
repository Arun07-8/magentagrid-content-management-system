import { useState } from 'react'
import { Search, Menu, X } from 'lucide-react'
import { Logo } from './Logo'
import { Link, useLocation, useNavigate } from 'react-router-dom'

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const location = useLocation()
  const navigate = useNavigate()

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Blog', path: '/blog' },
  ]

  const isItemActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/blog?q=${encodeURIComponent(searchQuery.trim())}`)
    } else {
      navigate('/blog')
    }
    setSearchOpen(false)
    setMobileMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-100 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center focus:outline-none group cursor-pointer"
            aria-label="Magentagrid Home"
          >
            <Logo variant="dark" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-8 text-sm">
              {navItems.map((item) => {
                const isActive = isItemActive(item.path)

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`font-medium transition-colors cursor-pointer py-1 relative ${
                      isActive
                        ? 'text-blue-600 font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {item.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
                    )}
                  </Link>
                )
              })}
            </div>

            {/* Search Icon & Dropdown */}
            <div className="relative">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-slate-500 hover:text-slate-800 rounded-full hover:bg-slate-50 transition-colors focus:outline-none cursor-pointer"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {searchOpen && (
                <form
                  onSubmit={handleSearchSubmit}
                  className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-xl shadow-lg p-2.5 flex items-center gap-2 z-50 transition-all duration-150"
                >
                  <Search className="w-4 h-4 text-slate-400 ml-1.5" />
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    className="w-full text-sm outline-none text-slate-700 placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => navigate('/blog')}
              className="p-2 text-slate-600 hover:text-slate-900 cursor-pointer"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 focus:outline-none cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-5 space-y-2 shadow-xl">
          {/* Mobile Search Input */}
          <form onSubmit={handleSearchSubmit} className="pb-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            </div>
          </form>

          {navItems.map((item) => {
            const isActive = isItemActive(item.path)
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block w-full text-left px-3 py-2.5 rounded-lg text-base font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </div>
      )}
    </header>
  )
}
