import { useState, useEffect, useRef, useCallback } from 'react';
import { Menu, X } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { usePublicSettings, useRealtimeSettings } from '../entities/settings';

// Helper to normalize navigation items to standard one-page section keys
function getSectionKey(url: string, label: string = '', id: string = ''): string {
  const cleanUrl = (url || '').replace(/^(\/|#)+/, '').toLowerCase().trim();
  const cleanLabel = (label || '').toLowerCase().trim();
  const cleanId = (id || '').toLowerCase().trim();

  // 1. Home
  if (
    !cleanUrl ||
    cleanUrl === 'home' ||
    cleanLabel === 'home' ||
    cleanId === 'nav-1' ||
    cleanId === 'home'
  ) {
    return 'home';
  }

  // 2. About
  if (
    cleanUrl === 'about' ||
    cleanUrl.startsWith('about') ||
    cleanLabel.includes('about') ||
    cleanId === 'nav-2' ||
    cleanId === 'about'
  ) {
    return 'about';
  }

  // 3. Services
  if (
    cleanUrl === 'services' ||
    cleanUrl === 'service' ||
    cleanUrl.startsWith('service') ||
    cleanLabel.includes('service') ||
    cleanLabel.includes('capabilit') ||
    cleanId === 'nav-3' ||
    cleanId === 'services'
  ) {
    return 'services';
  }


  // 5. Contact
  if (
    cleanUrl === 'contact' ||
    cleanUrl.startsWith('contact') ||
    cleanLabel.includes('contact') ||
    cleanLabel.includes('connect') ||
    cleanLabel.includes('reach') ||
    cleanId === 'nav-5' ||
    cleanId === 'contact'
  ) {
    return 'contact';
  }

  return cleanUrl || cleanId || cleanLabel;
}

export function Navbar() {
  useRealtimeSettings();
  const { data: siteSettings } = usePublicSettings();

  const location = useLocation();
  const navigate = useNavigate();

  // Dynamic CMS Navigation items with fallback
  const rawNavItems = siteSettings?.navigationItems || [
    { id: 'nav-1', label: 'Home', url: '/', isEnabled: true },
    { id: 'nav-2', label: 'About', url: '/about', isEnabled: true },
    { id: 'nav-3', label: 'Services', url: '/services', isEnabled: true },
    { id: 'nav-4', label: 'Contact', url: '/contact', isEnabled: true },
  ];

  const navItems = rawNavItems.filter((item) => item.isEnabled !== false);
  const logoData = siteSettings?.logo || { url: '/logo/logo.png', link: '/', text: 'Grido' };

  // Compute initial active section from path/hash
  const computeActiveFromUrl = useCallback(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const hashKey = window.location.hash.replace('#', '').toLowerCase();
      if (hashKey) return getSectionKey(hashKey, hashKey);
    }
    const pathKey = location.pathname.replace('/', '').toLowerCase();
    if (pathKey) return getSectionKey(pathKey, pathKey);
    return 'home';
  }, [location.pathname]);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>(computeActiveFromUrl);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const isManualScrollRef = useRef(false);
  const manualScrollTimeoutRef = useRef<number | null>(null);

  // Sync active section when path or hash changes
  useEffect(() => {
    const current = computeActiveFromUrl();
    setActiveSection(current);
  }, [computeActiveFromUrl]);

  // Track active navigation state and scroll on the single-page layout
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // If user just clicked a nav link and smooth scroll is in progress, don't overwrite
      if (isManualScrollRef.current) return;

      // Single-page scroll spy when on root or section anchors
      if (location.pathname === '/' || location.pathname === '') {
        const sections = ['home', 'about', 'services', 'contact'];
        const scrollY = window.scrollY;

        // If at top of the page
        if (scrollY < 80) {
          setActiveSection('home');
          setSelectedItemId(null);
          return;
        }

        // If at bottom of the page
        const isNearBottom =
          window.innerHeight + Math.round(scrollY) >= document.documentElement.scrollHeight - 60;
        if (isNearBottom) {
          setActiveSection('contact');
          setSelectedItemId(null);
          return;
        }

        let currentActive = 'home';
        const scrollOffset = scrollY + 160;

        for (const sectionId of sections) {
          const el = document.getElementById(sectionId);
          if (el) {
            const top = el.offsetTop;
            if (scrollOffset >= top) {
              currentActive = sectionId;
            }
          }
        }

        setActiveSection(currentActive);
        setSelectedItemId(null);
      } else {
        const pathKey = location.pathname.replace('/', '').toLowerCase();
        setActiveSection(getSectionKey(pathKey, pathKey));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  // Handle URL hash on initial load or navigation
  useEffect(() => {
    const hash = window.location.hash.replace('#', '').toLowerCase();

    if (hash && ['home', 'about', 'services', 'contact'].includes(hash)) {
      setActiveSection(hash);
      if (hash === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const timer = setTimeout(() => {
          const el = document.getElementById(hash);
          if (el) {
            const top = el.getBoundingClientRect().top + window.scrollY - 75;
            window.scrollTo({ top, behavior: 'smooth' });
          }
        }, 120);
        return () => clearTimeout(timer);
      }
    }
  }, [location.pathname, location.hash]);

  const handleNavClick = (item: { id: string; url: string; label: string; isExternal?: boolean }) => {
    setMobileMenuOpen(false);

    if (item.isExternal || item.url.startsWith('http://') || item.url.startsWith('https://')) {
      window.open(item.url, '_blank', 'noopener,noreferrer');
      return;
    }

    const sectionKey = getSectionKey(item.url, item.label, item.id);
    const ONE_PAGE_SECTIONS = ['home', 'about', 'services', 'contact'];

    // Lock scroll spy temporarily during smooth scrolling animation
    isManualScrollRef.current = true;
    if (manualScrollTimeoutRef.current) clearTimeout(manualScrollTimeoutRef.current);
    manualScrollTimeoutRef.current = window.setTimeout(() => {
      isManualScrollRef.current = false;
    }, 900);

    setSelectedItemId(item.id);
    setActiveSection(sectionKey);

    if (ONE_PAGE_SECTIONS.includes(sectionKey)) {
      if (location.pathname === '/' || location.pathname === '') {
        if (sectionKey === 'home') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          if (window.location.hash) {
            window.history.replaceState(null, '', '/');
          }
        } else {
          const el = document.getElementById(sectionKey);
          if (el) {
            const top = el.getBoundingClientRect().top + window.scrollY - 75;
            window.scrollTo({ top, behavior: 'smooth' });
            window.history.replaceState(null, '', `/#${sectionKey}`);
          }
        }
      } else {
        navigate(sectionKey === 'home' ? '/' : `/#${sectionKey}`);
      }
      return;
    }

    // Dynamic custom route
    const cleanUrl = item.url.startsWith('/') ? item.url : `/${item.url}`;
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

  // Helper to determine if an item is currently active
  const checkIsActive = (item: { id: string; url: string; label: string }) => {
    if (selectedItemId === item.id) return true;
    const itemKey = getSectionKey(item.url, item.label, item.id);
    return activeSection === itemKey;
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-zinc-200/80 py-3 sm:py-3.5 shadow-xs'
          : 'bg-white/80 backdrop-blur-xs py-3.5 sm:py-5 border-b border-zinc-100/60'
        }`}
    >
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Brand / Logo from CMS Settings */}
        <button
          type="button"
          onClick={() =>
            handleNavClick({
              id: 'nav-1',
              url: logoData.link || '/',
              label: 'Home',
            })
          }
          className="flex items-center gap-2 focus:outline-none cursor-pointer select-none shrink-0"
          aria-label="Home"
        >
          <img
            src={logoData.url?.trim() ? logoData.url : '/logo/logo.png'}
            alt={logoData.text || 'Logo'}
            style={{
              height: logoData.height ? `${logoData.height}px` : undefined,
              maxHeight: '52px',
            }}
            className="h-7 sm:h-8 md:h-9 w-auto max-w-[180px] sm:max-w-none object-contain transition-transform duration-300 hover:scale-105"
            onError={(e) => {
              const target = e.currentTarget;
              if (!target.src.endsWith('/logo/logo.png')) {
                target.src = '/logo/logo.png';
              }
            }}
          />
        </button>

        {/* Desktop / Tablet Navigation Links */}
        <nav className="hidden md:flex items-center gap-5 lg:gap-8 xl:gap-10 shrink-0">
          {navItems.map((item) => {
            const isActive = checkIsActive(item);

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item)}
                className={`relative text-[14px] lg:text-[15px] font-semibold transition-colors py-1.5 cursor-pointer whitespace-nowrap ${isActive ? 'text-zinc-950 font-bold' : 'text-zinc-500 hover:text-zinc-950'
                  }`}
              >
                {item.label}
                <span
                  className={`absolute bottom-0 left-0 h-[3px] bg-[#F59E0B] transition-all duration-300 ease-out rounded-full ${isActive ? 'w-full opacity-100' : 'w-0 opacity-0'
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
                    onClick={() =>
                      handleNavClick({
                        id: 'nav-1',
                        url: logoData.link || '/',
                        label: 'Home',
                      })
                    }
                    className="focus:outline-none cursor-pointer"
                    aria-label="Home"
                  >
                    <img
                      src={logoData.url?.trim() ? logoData.url : '/logo/logo.png'}
                      alt={logoData.text || 'Logo'}
                      className="h-7 sm:h-8 w-auto object-contain max-w-[140px]"
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (!target.src.endsWith('/logo/logo.png')) {
                          target.src = '/logo/logo.png';
                        }
                      }}
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
                    const isActive = checkIsActive(item);

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleNavClick(item)}
                        className={`text-left text-base sm:text-lg font-bold tracking-tight transition-all py-2.5 px-3.5 rounded-xl cursor-pointer flex items-center justify-between ${isActive
                            ? 'bg-amber-50 text-zinc-950 font-black border border-amber-300/80 shadow-xs'
                            : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50'
                          }`}
                      >
                        <span>{item.label}</span>
                        {isActive && <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="pt-6 mt-6 border-t border-zinc-100 text-xs text-zinc-400 font-mono tracking-wider text-center shrink-0">
                © {new Date().getFullYear()} Grido CMS
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
}
