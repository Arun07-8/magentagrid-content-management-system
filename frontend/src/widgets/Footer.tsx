import { Logo } from '../shared/ui';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-zinc-950 text-zinc-400 py-12 sm:py-16 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand & Tagline */}
          <div className="md:col-span-1 space-y-3">
            <Link to="/">
              <Logo variant="light" />
            </Link>
            <p className="text-xs sm:text-sm text-zinc-400 tracking-normal font-normal leading-relaxed">
              Modern content management and publishing infrastructure for thoughtful writers.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link to="/" className="text-zinc-400 hover:text-zinc-100 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-zinc-400 hover:text-zinc-100 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-zinc-400 hover:text-zinc-100 transition-colors">
                  Articles &amp; Dispatches
                </Link>
              </li>
           
            </ul>
          </div>

          {/* Follow Us */}
          <div className="space-y-3">
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider">Connect</h4>
            <div className="flex items-center gap-2.5">
              <a
                href="#facebook"
                aria-label="Facebook"
                className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>

              <a
                href="#twitter"
                aria-label="Twitter"
                className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              <a
                href="#linkedin"
                aria-label="LinkedIn"
                className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>

              <a
                href="#youtube"
                aria-label="YouTube"
                className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Copyright Section */}
          <div className="md:text-right flex flex-col justify-end text-xs text-zinc-500">
            <p>© {new Date().getFullYear()} CMS. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
