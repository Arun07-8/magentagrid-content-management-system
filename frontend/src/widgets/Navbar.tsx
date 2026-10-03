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
        <div className="flex items-center justify-between h-18">
          {/* Brand Logo (Left) */}
          <div className="w-48 flex-shrink-0 flex items-center ml-4">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center focus:outline-none"
              aria-label="CMS Home"
            >
              <Logo variant="dark" />
            </Link>
          </div>

          <nav className="hidden md:flex flex-1 items-center justify-center gap-8">
            {navItems.map((item) => {
              const isActive = isItemActive(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`font-sans text-[14px] leading-[16.1px] tracking-[0px] font-semibold transition-all  border-b-[2.5px] ${isActive
                      ? 'text-[#2A3039] border-[#2A3039]'
                      : 'text-[#2A3039]/70 border-transparent hover:text-blue-600'
                    }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Right Spacer (For perfect centering) */}
          <div className="hidden md:block w-48 flex-shrink-0 mr-4" />



          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center justify-end w-48">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-zinc-600 hover:text-zinc-900 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-100 bg-white px-6 py-6 flex flex-col gap-5 shadow-lg">
          {navItems.map((item) => {
            const isActive = isItemActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block w-fit font-sans text-[14px] leading-[16.1px] tracking-[0px] font-semibold transition-all pb-1 border-b-[2.5px] ${isActive ? 'text-[#2A3039] border-[#2A3039]' : 'text-[#2A3039]/70 border-transparent hover:text-blue-600'
                  }`}
              >
                {item.label}
              </Link>
            );
          })}

        </div>
      )}
    </header>
  );
}
