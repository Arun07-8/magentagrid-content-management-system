import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { PageCtaSection } from '../entities/page';
import { DEFAULT_HOME_SECTIONS } from '../entities/page';

interface FooterProps {
  content?: PageCtaSection;
  showContactSection?: boolean;
}

export function Footer({ content, showContactSection = true }: FooterProps) {
  const cta = content || DEFAULT_HOME_SECTIONS.cta;

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
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 border-t border-zinc-200/80">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 lg:gap-16">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-400 block mb-3 font-mono">
              {cta.badgeText || 'SAY HI TO US'}
            </span>
            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black text-zinc-950 tracking-tight leading-none uppercase font-['Plus_Jakarta_Sans']">
              {cta.heading || "LET'S CONNECT"}
            </h2>
            <p className="text-base sm:text-lg text-zinc-600 mt-4 max-w-xl font-normal">
              {cta.description}
            </p>
          </div>

          <div className="flex-shrink-0">
            <a
              href={`mailto:${cta.contactEmail || 'contact@editorial.io'}`}
              className="inline-flex items-center gap-2 text-lg sm:text-xl font-bold text-zinc-950 hover:text-amber-600 transition-colors pb-1 border-b-2 border-zinc-950 hover:border-amber-600 group"
            >
              <span>Start a conversation</span>
              <ArrowUpRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </a>
          </div>
        </div>

        {/* Contact info and working hours */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-14 pt-10 border-t border-zinc-200/60">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-400 block mb-2">
              Contact Email
            </span>
            <p className="text-base font-bold text-zinc-900">{cta.contactEmail || 'contact@editorial.io'}</p>
            <p className="text-xs text-zinc-400 mt-0.5">Editorial desk response in &lt; 24h</p>
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-400 block mb-2">
              Working time
            </span>
            <p className="text-sm font-semibold text-zinc-800">{cta.workingHours || 'Monday – Friday : 08 AM – 06 PM'}</p>
            <p className="text-xs text-zinc-400 mt-0.5">Saturday – Sunday : Closed</p>
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-400 block mb-2">
              Location
            </span>
            <p className="text-sm font-semibold text-zinc-800">{cta.location || 'New York & Global Remote'}</p>
            <p className="text-xs text-zinc-400 mt-0.5">Worldwide</p>
          </div>
        </div>
      </div>
      )}

      {/* Deep Black Editorial Footer Section */}
      <div className="bg-[#0A0A0A] text-white pt-16 pb-12 border-t border-zinc-900">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-14 pb-14 border-b border-zinc-800">
            {/* Left Brand Col */}
            <div className="md:col-span-5 flex flex-col justify-between">
              <div>
                <p className="text-sm text-zinc-400 max-w-sm leading-relaxed font-normal">
                  A modern publishing platform and digital publication engineered for high-impact content, bold ideas, and seamless storytelling.
                </p>
              </div>

              {/* Minimal social icons / marks */}
              <div className="flex items-center gap-4 mt-6 text-zinc-400 font-mono text-xs font-bold">
                <a href="#twitter" aria-label="Twitter" className="hover:text-white transition-colors">TW</a>
                <span className="text-zinc-700">/</span>
                <a href="#instagram" aria-label="Instagram" className="hover:text-white transition-colors">IG</a>
                <span className="text-zinc-700">/</span>
                <a href="#linkedin" aria-label="LinkedIn" className="hover:text-white transition-colors">IN</a>
                <span className="text-zinc-700">/</span>
                <a href="#github" aria-label="GitHub" className="hover:text-white transition-colors">GH</a>
              </div>
            </div>

            {/* Quick Navigation Links */}
            <div className="md:col-span-3 md:col-start-7 flex flex-col gap-3">
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-zinc-300 block mb-1 font-mono">
                NAVIGATION
              </span>
              <button
                type="button"
                onClick={() => scrollToSection('home')}
                className="text-sm text-zinc-400 hover:text-white transition-colors text-left cursor-pointer"
              >
                Home / Hero
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('about')}
                className="text-sm text-zinc-400 hover:text-white transition-colors text-left cursor-pointer"
              >
                About
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('services')}
                className="text-sm text-zinc-400 hover:text-white transition-colors text-left cursor-pointer"
              >
                Services &amp; Capabilities
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('blog')}
                className="text-sm text-zinc-400 hover:text-white transition-colors text-left cursor-pointer"
              >
                Stories &amp; News
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('contact')}
                className="text-sm text-zinc-400 hover:text-white transition-colors text-left cursor-pointer"
              >
                Contact Desk
              </button>
            </div>

            {/* Platform & Admin */}
            <div className="md:col-span-4 flex flex-col gap-3">
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-zinc-300 block mb-1 font-mono">
                RESOURCES
              </span>
              <Link to="/about" className="text-sm text-zinc-400 hover:text-white transition-colors w-fit">
                Editorial Guidelines
              </Link>
              <Link to="/blog" className="text-sm text-zinc-400 hover:text-white transition-colors w-fit">
                Latest Dispatches
              </Link>
              <span className="text-xs text-zinc-600 mt-2 font-mono">
                v2.4 · Production Build
              </span>
            </div>
          </div>

          {/* Bottom copyright */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 font-mono">
            <p>© {new Date().getFullYear()} All rights reserved.</p>
            <div className="flex items-center gap-4">
              <span>READER-FIRST ARCHITECTURE</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-zinc-400">OPERATIONAL</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
