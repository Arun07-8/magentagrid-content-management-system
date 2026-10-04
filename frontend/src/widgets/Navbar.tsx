import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Logo } from '../shared/ui';
import { Link, useLocation } from 'react-router-dom';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Blog / News', path: '/blog' },
  ];

  const isItemActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="bg-white border-b border-zinc-200 shadow-sm sticky top-0 z-40">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Brand Logo (Left) */}
          <div className="flex-shrink-0 flex items-center">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center focus:outline-none"
              aria-label="CMS Home"
            >
              <Logo variant="dark" />
            </Link>
          </div>

          {/* Desktop Nav Items (Centered) */}
          <nav className="hidden md:flex flex-1 items-center justify-center gap-8">
            {navItems.map((item) => {
              const isActive = isItemActive(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`font-sans text-[14px] leading-[16.1px] tracking-[0px] font-semibold transition-all border-b-[2.5px] py-1 ${
                    isActive
                      ? 'text-[#2A3039] border-[#FCD06B]'
                      : 'text-[#2A3039]/70 border-transparent hover:text-zinc-950 hover:border-[#FCD06B]/60'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Right Spacer */}
          <div className="hidden md:block w-32 flex-shrink-0" />

          {/* Mobile Menu Hamburger Button */}
          <div className="flex md:hidden items-center justify-end">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 -mr-2 text-zinc-700 hover:text-zinc-950 focus:outline-none cursor-pointer"
              aria-label="Open navigation menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer (Left to Right) */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative flex-1 max-w-[280px] w-full bg-white h-full shadow-2xl z-10 flex flex-col justify-between p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center focus:outline-none"
                >
                  <Logo variant="dark" />
                </Link>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-zinc-500 hover:text-zinc-900 rounded-lg hover:bg-zinc-100 cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex flex-col gap-2">
                {navItems.map((item) => {
                  const isActive = isItemActive(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block px-4 py-3 rounded-xl font-sans text-base font-semibold transition-all ${
                        isActive
                          ? 'bg-[#FCD06B]/20 text-zinc-950 font-bold border-l-4 border-[#FCD06B]'
                          : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50'
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="pt-6 border-t border-zinc-100 text-xs text-zinc-400 font-medium text-center">
              © {new Date().getFullYear()} CMS Platform
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
