import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { PageCtaSection } from '../entities/page';
import { DEFAULT_HOME_SECTIONS } from '../entities/page';
import { usePublicSettings } from '../entities/settings';

interface FooterProps {
  content?: PageCtaSection;
  showContactSection?: boolean;
  deviceMode?: 'desktop' | 'tablet' | 'mobile';
}

export function Footer({ content, showContactSection = true, deviceMode = 'desktop' }: FooterProps) {
  const { data: siteSettings } = usePublicSettings();
  const cta = content || DEFAULT_HOME_SECTIONS.cta;
  const footer = siteSettings?.footer;
  const isMobile = deviceMode === 'mobile';

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 75;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <footer id="contact" className="scroll-mt-20 w-full bg-white">
      {/* Upper Editorial Contact Block */}
      {showContactSection && (
        <div className={`max-w-[1320px] mx-auto ${isMobile ? 'px-3 sm:px-4 py-10' : 'px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-28'} border-t border-zinc-200/80`}>
          <div className={`flex flex-col ${isMobile ? 'gap-6' : 'lg:flex-row lg:items-end justify-between gap-8 sm:gap-10 lg:gap-16'}`}>
            <div className="max-w-3xl">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-zinc-400 block mb-2 sm:mb-3 font-mono">
                {cta.badgeText || 'SAY HI TO US'}
              </span>
              <h2 className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-zinc-950 tracking-tight leading-none uppercase font-['Plus_Jakarta_Sans'] break-words">
                {cta.heading || "LET'S CONNECT"}
              </h2>
              <p className="text-sm sm:text-base lg:text-lg text-zinc-600 mt-3 sm:mt-4 max-w-xl font-normal">
                {cta.description}
              </p>
            </div>

            <div className="shrink-0">
              <a
                href={`mailto:${cta.contactEmail || 'contact@grido.io'}`}
                className="inline-flex items-center gap-2 text-base sm:text-lg lg:text-xl font-bold text-zinc-950 hover:text-amber-600 transition-colors pb-1 border-b-2 border-zinc-950 hover:border-amber-600 group break-all"
              >
                <span>Start a conversation</span>
                <ArrowUpRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 shrink-0" />
              </a>
            </div>
          </div>

          {/* Contact info and working hours */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mt-10 sm:mt-14 pt-8 sm:pt-10 border-t border-zinc-200/60">
            <div>
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-zinc-400 block mb-1 sm:mb-2">
                Contact Email
              </span>
              <p className="text-sm sm:text-base font-bold text-zinc-900 break-all">{cta.contactEmail || 'contact@grido.io'}</p>
              <p className="text-xs text-zinc-400 mt-0.5">Editorial desk response in &lt; 24h</p>
            </div>

            <div>
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-zinc-400 block mb-1 sm:mb-2">
                Working time
              </span>
              <p className="text-xs sm:text-sm font-semibold text-zinc-800">{cta.workingHours || 'Monday – Friday : 08 AM – 06 PM'}</p>
              <p className="text-xs text-zinc-400 mt-0.5">Saturday – Sunday : Closed</p>
            </div>

            <div>
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-zinc-400 block mb-1 sm:mb-2">
                Location
              </span>
              <p className="text-xs sm:text-sm font-semibold text-zinc-800">{cta.location || 'New York & Global Remote'}</p>
              <p className="text-xs text-zinc-400 mt-0.5">Worldwide</p>
            </div>
          </div>
        </div>
      )}

      {/* Deep Black Editorial Footer Section */}
      <div id="footer" className="scroll-mt-20 bg-[#0A0A0A] text-white pt-12 sm:pt-16 pb-10 sm:pb-12 border-t border-zinc-900">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-10 lg:gap-14 pb-10 sm:pb-14 border-b border-zinc-800">
            {/* Left Brand Col */}
            <div className="md:col-span-5 flex flex-col justify-between">
              <div>
                <p className="text-xs sm:text-sm text-zinc-400 max-w-sm leading-relaxed font-normal">
                  {footer?.description ||
                    'A modern publishing platform and digital publication engineered for high-impact content, bold ideas, and seamless storytelling.'}
                </p>
              </div>

              {/* Minimal social icons / marks */}
              <div className="flex items-center gap-3 sm:gap-4 mt-6 text-zinc-400 font-mono text-xs font-bold">
                {footer?.twitterUrl ? (
                  <a href={footer.twitterUrl} target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="hover:text-white transition-colors">TW</a>
                ) : (
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="hover:text-white transition-colors">TW</a>
                )}
                <span className="text-zinc-700">/</span>
                {footer?.instagramUrl ? (
                  <a href={footer.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-white transition-colors">IG</a>
                ) : (
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-white transition-colors">IG</a>
                )}
                <span className="text-zinc-700">/</span>
                {footer?.linkedinUrl ? (
                  <a href={footer.linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-white transition-colors">IN</a>
                ) : (
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-white transition-colors">IN</a>
                )}
                <span className="text-zinc-700">/</span>
                {footer?.githubUrl ? (
                  <a href={footer.githubUrl} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="hover:text-white transition-colors">GH</a>
                ) : (
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="hover:text-white transition-colors">GH</a>
                )}
              </div>
            </div>

            {/* Quick Navigation Links */}
            <div className="md:col-span-3 md:col-start-7 flex flex-col gap-2.5 sm:gap-3">
              <span className="text-[11px] sm:text-xs font-bold tracking-[0.2em] uppercase text-zinc-300 block mb-1 font-mono">
                NAVIGATION
              </span>
              <button
                type="button"
                onClick={() => scrollToSection('home')}
                className="text-xs sm:text-sm text-zinc-400 hover:text-white transition-colors text-left cursor-pointer"
              >
                Home / Hero
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('about')}
                className="text-xs sm:text-sm text-zinc-400 hover:text-white transition-colors text-left cursor-pointer"
              >
                About
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('services')}
                className="text-xs sm:text-sm text-zinc-400 hover:text-white transition-colors text-left cursor-pointer"
              >
                Services &amp; Capabilities
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('contact')}
                className="text-xs sm:text-sm text-zinc-400 hover:text-white transition-colors text-left cursor-pointer"
              >
                Contact Desk
              </button>
            </div>

            {/* Platform & Admin */}
            <div className="md:col-span-4 flex flex-col gap-2.5 sm:gap-3">
              <span className="text-[11px] sm:text-xs font-bold tracking-[0.2em] uppercase text-zinc-300 block mb-1 font-mono">
                RESOURCES
              </span>
              <Link to="/about" className="text-xs sm:text-sm text-zinc-400 hover:text-white transition-colors w-fit">
                Editorial Guidelines
              </Link>
              <Link to="/contact" className="text-xs sm:text-sm text-zinc-400 hover:text-white transition-colors w-fit">
                Contact &amp; Inquiries
              </Link>
              <span className="text-xs text-zinc-600 mt-1 sm:mt-2 font-mono">
                v2.4 · Production Build
              </span>
            </div>
          </div>

          {/* Bottom copyright */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 font-mono text-center sm:text-left">
            <p>{footer?.copyright || `© ${new Date().getFullYear()} Grido Publishing Platform. All rights reserved.`}</p>
            <div className="flex items-center gap-3 sm:gap-4">
              <span>READER-FIRST ARCHITECTURE</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              <span className="text-zinc-400">OPERATIONAL</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
