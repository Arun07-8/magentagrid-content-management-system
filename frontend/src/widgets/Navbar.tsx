import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { usePublicSettings, useRealtimeSettings } from '../entities/settings';

export function Navbar() {
  useRealtimeSettings();
  const { data: siteSettings } = usePublicSettings();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const location = useLocation();
  const navigate = useNavigate();

  // Dynamic CMS Navigation items with fallback
  const rawNavItems = siteSettings?.navigationItems || [
    { id: 'nav-1', label: 'Home', url: '/', isEnabled: true },
    { id: 'nav-2', label: 'About', url: '/about', isEnabled: true },
    { id: 'nav-3', label: 'Services', url: '/services', isEnabled: true },
    { id: 'nav-4', label: 'Blog / News', url: '/blog', isEnabled: true },
    { id: 'nav-5', label: 'Contact', url: '/contact', isEnabled: true },
  ];

  const navItems = rawNavItems.filter((item) => item.isEnabled !== false);
  const logoData = siteSettings?.logo || { url: '/logo/logo.png', link: '/', text: 'Editorial' };

  // Track active navigation state and scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      if (location.pathname === '/' || location.pathname === '/services' || location.pathname === '/contact') {
        const sections = ['home', 'services', 'contact'];
        const scrollPosition = window.scrollY + 120;

        for (let i = sections.length - 1; i >= 0; i--) {
          const el = document.getElementById(sections[i]);
          if (el && el.offsetTop <= scrollPosition) {
            setActiveSection(sections[i]);
            break;
          }
        }
      } else if (location.pathname === '/about') {
        setActiveSection('about');
      } else if (location.pathname === '/blog' || location.pathname.startsWith('/blog/')) {
        setActiveSection('blog');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  // If page opens with a hash symbol (#home, #about, etc.), automatically strip the # symbol from the URL
  useEffect(() => {
    if (window.location.hash) {
      const targetId = window.location.hash.replace('#', '');
      const cleanPath = targetId === 'home' ? '/' : `/${targetId}`;

      // Clean the URL in address bar by removing the # hash
      window.history.replaceState(null, '', cleanPath);

      if (targetId === 'about') {
        navigate('/about');
        return;
      }
      if (targetId === 'blog') {
        navigate('/blog');
        return;
      }

      const el = document.getElementById(targetId);
      if (el) {
        setTimeout(() => {
          const top = el.getBoundingClientRect().top + window.scrollY - 75;
          window.scrollTo({ top, behavior: 'smooth' });
        }, 100);
      }
    } else if (location.pathname === '/services' || location.pathname === '/contact') {
      const sectionName = location.pathname.replace('/', '');
      const el = document.getElementById(sectionName);
      if (el) {
        setTimeout(() => {
          const top = el.getBoundingClientRect().top + window.scrollY - 75;
          window.scrollTo({ top, behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location.pathname, navigate]);

  const handleNavClick = (url: string, isExternal?: boolean) => {
    setMobileMenuOpen(false);

    if (isExternal || url.startsWith('http')) {
      window.open(url, '_blank', 'noopener,noreferrer');
      return;
    }

    const cleanUrl = url.startsWith('/') ? url : `/${url}`;
    const targetSection = cleanUrl.replace(/^\/(#)?/, '').toLowerCase();

    // If it is an anchor on the one-page website or one of the core sections
    if (
      cleanUrl === '/' ||
      cleanUrl === '/home' ||
      cleanUrl === '/#home' ||
      targetSection === 'home' ||
      targetSection === ''
    ) {
      if (location.pathname === '/') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        navigate('/');
      }
      return;
    }

    if (['about', 'blog', 'services', 'contact', 'footer'].includes(targetSection)) {
      if (location.pathname === '/') {
        const el = document.getElementById(targetSection);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY - 75;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      } else {
        navigate(`/#${targetSection}`);
      }
      return;
    }

    // Dynamic custom route
    navigate(cleanUrl);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [mobileMenuOpen]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-zinc-200/80 py-3 sm:py-3.5 shadow-xs'
          : 'bg-white/80 backdrop-blur-xs py-3.5 sm:py-5 border-b border-zinc-100/60'
      }`}
    >
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Brand / Logo from CMS Settings */}
        <button
          type="button"
          onClick={() => handleNavClick(logoData.link || '/')}
          className="flex items-center gap-2 focus:outline-none cursor-pointer select-none shrink-0"
          aria-label="Home"
        >
          {logoData.url ? (
            <img
              src={logoData.url}
              alt={logoData.text || 'Logo'}
              className="h-7 sm:h-8 md:h-9 w-auto max-w-[160px] sm:max-w-none object-contain transition-transform duration-300 hover:scale-105"
            />
          ) : (
            <span className="text-lg sm:text-xl font-bold font-serif tracking-tight text-zinc-900 truncate">
              {logoData.text || 'Editorial'}
            </span>
          )}
        </button>

        {/* Desktop / Tablet Navigation Links */}
        <nav className="hidden md:flex items-center gap-5 lg:gap-8 xl:gap-10 shrink-0">
          {navItems.map((item) => {
            const itemCleanUrl = item.url.startsWith('/') ? item.url : `/${item.url}`;
            const isActive =
              itemCleanUrl === '/'
                ? location.pathname === '/' && activeSection === 'home'
                : location.pathname === itemCleanUrl ||
                  (location.pathname === '/' && activeSection === itemCleanUrl.replace('/', ''));

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.url, item.isExternal)}
                className={`relative text-[13px] lg:text-[14px] font-semibold transition-colors py-1 cursor-pointer whitespace-nowrap ${
                  isActive ? 'text-zinc-950 font-bold' : 'text-zinc-500 hover:text-zinc-950'
                }`}
              >
                {item.label}
                <span
                  className={`absolute bottom-0 left-0 h-[2px] bg-amber-400 transition-all duration-300 ease-out rounded-full ${
                    isActive ? 'w-full' : 'w-0 hover:w-full'
                  }`}
                />
              </button>
            );
          })}
        </nav>

        {/* Mobile Hamburger Button on the Right */}
        <div className="flex md:hidden items-center">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="w-10 h-10 -mr-2 rounded-xl flex items-center justify-center text-zinc-900 hover:text-zinc-600 hover:bg-zinc-100/80 active:bg-zinc-200 transition-colors focus:outline-none cursor-pointer"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu (Right -> Left Slide) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-xs"
              aria-hidden="true"
            />

            {/* Sidebar / Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              className="relative z-10 w-[85vw] max-w-[320px] bg-white h-[100dvh] max-h-[100dvh] shadow-2xl p-5 sm:p-6 flex flex-col justify-between overflow-y-auto"
            >
              <div className="flex flex-col min-h-0">
                {/* Drawer Header */}
                <div className="flex items-center justify-between pb-4 border-b border-zinc-100 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleNavClick(logoData.link || '/')}
                    className="focus:outline-none cursor-pointer"
                    aria-label="Home"
                  >
                    <img
                      src={logoData.url || '/logo/logo.png'}
                      alt={logoData.text || 'Logo'}
                      className="h-7 sm:h-8 w-auto object-contain max-w-[140px]"
                    />
                  </button>
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-9 h-9 text-zinc-500 hover:text-zinc-950 rounded-full hover:bg-zinc-100 flex items-center justify-center transition-colors cursor-pointer"
                    aria-label="Close navigation menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Nav Links */}
                <div className="mt-6 flex flex-col gap-2 overflow-y-auto">
                  {navItems.map((item) => {
                    const itemCleanUrl = item.url.startsWith('/') ? item.url : `/${item.url}`;
                    const isActive =
                      itemCleanUrl === '/'
                        ? location.pathname === '/' && activeSection === 'home'
                        : location.pathname === itemCleanUrl ||
                          (location.pathname === '/' && activeSection === itemCleanUrl.replace('/', ''));

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleNavClick(item.url, item.isExternal)}
                        className={`text-left text-base sm:text-lg font-bold tracking-tight transition-all py-2.5 px-3 rounded-xl cursor-pointer flex items-center justify-between ${
                          isActive
                            ? 'bg-amber-50 text-zinc-950 font-black'
                            : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50'
                        }`}
                      >
                        <span>{item.label}</span>
                        {isActive && <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="pt-6 mt-6 border-t border-zinc-100 text-xs text-zinc-400 font-mono tracking-wider text-center shrink-0">
                © {new Date().getFullYear()} Editorial CMS
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
}
