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

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-zinc-200/80 py-3.5 shadow-xs'
          : 'bg-white/80 backdrop-blur-xs py-5 border-b border-zinc-100/60'
        }`}
    >
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand / Logo from CMS Settings */}
        <button
          type="button"
          onClick={() => handleNavClick(logoData.link || '/')}
          className="flex items-center gap-2.5 focus:outline-none cursor-pointer select-none"
          aria-label="Home"
        >
          {logoData.url ? (
            <img
              src={logoData.url}
              alt={logoData.text || 'Logo'}
              className="h-8 sm:h-9 w-auto object-contain transition-transform duration-300 hover:scale-105"
            />
          ) : (
            <span className="text-xl font-bold font-serif tracking-tight text-zinc-900">
              {logoData.text || 'Editorial'}
            </span>
          )}
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-10">
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
                className={`relative text-[14px] font-semibold transition-colors py-1 cursor-pointer ${isActive ? 'text-zinc-950 font-bold' : 'text-zinc-500 hover:text-zinc-950'
                  }`}
              >
                {item.label}
                <span
                  className={`absolute bottom-0 left-0 h-[2px] bg-amber-400 transition-all duration-300 ease-out rounded-full ${isActive ? 'w-full' : 'w-0 hover:w-full'
                    }`}
                />
              </button>
            );
          })}
        </nav>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 text-zinc-900 hover:text-zinc-600 focus:outline-none cursor-pointer"
            aria-label="Open navigation menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm md:hidden flex justify-end"
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full max-w-xs bg-white h-full shadow-2xl p-6 sm:p-8 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-5 border-b border-zinc-100">
                  <button
                    type="button"
                    onClick={() => handleNavClick(logoData.link || '/')}
                    className="focus:outline-none cursor-pointer"
                    aria-label="Home"
                  >
                    <img
                      src={logoData.url || '/logo/logo.png'}
                      alt={logoData.text || 'Logo'}
                      className="h-7 sm:h-8 w-auto object-contain"
                    />
                  </button>
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 text-zinc-500 hover:text-zinc-950 rounded-full hover:bg-zinc-100 transition-colors cursor-pointer"
                    aria-label="Close navigation menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="mt-8 flex flex-col gap-5">
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
                        className={`text-left text-xl font-bold tracking-tight transition-colors py-1 cursor-pointer flex items-center justify-between ${isActive ? 'text-zinc-950 font-black' : 'text-zinc-600 hover:text-zinc-950'
                          }`}
                      >
                        <span>{item.label}</span>
                        {isActive && <span className="w-2 h-2 rounded-full bg-amber-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="text-xs text-zinc-400 font-mono tracking-wider text-center">
                © {new Date().getFullYear()}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
