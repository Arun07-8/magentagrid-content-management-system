import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-black pt-24 pb-12 border-t border-zinc-900">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Massive Statement Section */}
        {/* <div className="max-w-4xl mb-24">
          <h2 className="text-[32px] sm:text-[40px] lg:text-[48px] font-bold text-white tracking-tight leading-[1.1] mb-6">
            A modern content management platform built to create, manage, organize, and publish digital content with simplicity and control.
          </h2>
          <p className="text-lg text-zinc-400 font-medium max-w-2xl leading-relaxed">
            Engineered for editorial teams and developers who demand exceptional craft, speed, and reliability in their publishing workflows.
          </p>
        </div> */}

        {/* Navigation Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 lg:gap-16 pb-20">
          
          <div className="flex flex-col gap-6">
            <h4 className="text-white font-bold tracking-wide uppercase text-sm">Platform</h4>
            <div className="flex flex-col gap-4 text-[15px] font-medium text-zinc-400">
              <Link to="/" className="hover:text-white transition-colors w-fit">Features</Link>
              <Link to="/" className="hover:text-white transition-colors w-fit">Content Management</Link>
              <Link to="/" className="hover:text-white transition-colors w-fit">Publishing</Link>
              <Link to="/" className="hover:text-white transition-colors w-fit">Media</Link>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <h4 className="text-white font-bold tracking-wide uppercase text-sm">Resources</h4>
            <div className="flex flex-col gap-4 text-[15px] font-medium text-zinc-400">
              <Link to="/blog" className="hover:text-white transition-colors w-fit">Blog / News</Link>
              <Link to="/blog" className="hover:text-white transition-colors w-fit">Documentation</Link>
              <Link to="/blog" className="hover:text-white transition-colors w-fit">Guides</Link>
              <Link to="/blog" className="hover:text-white transition-colors w-fit">Help Center</Link>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <h4 className="text-white font-bold tracking-wide uppercase text-sm">Company</h4>
            <div className="flex flex-col gap-4 text-[15px] font-medium text-zinc-400">
              <Link to="/about" className="hover:text-white transition-colors w-fit">About</Link>
              <Link to="/about" className="hover:text-white transition-colors w-fit">Contact</Link>
              <Link to="/about" className="hover:text-white transition-colors w-fit">Careers</Link>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <h4 className="text-white font-bold tracking-wide uppercase text-sm">Legal</h4>
            <div className="flex flex-col gap-4 text-[15px] font-medium text-zinc-400">
              <Link to="/" className="hover:text-white transition-colors w-fit">Privacy Policy</Link>
              <Link to="/" className="hover:text-white transition-colors w-fit">Terms of Service</Link>
            </div>
          </div>

        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-zinc-900 flex flex-col md:flex-row items-center justify-between gap-6 text-[14px] font-medium text-zinc-500">
          <p>© {new Date().getFullYear()} CMS Platform. All rights reserved.</p>
          <div className="flex items-center gap-8">
            <a href="#twitter" className="hover:text-zinc-300 transition-colors">Twitter</a>
            <a href="#linkedin" className="hover:text-zinc-300 transition-colors">LinkedIn</a>
            <a href="#github" className="hover:text-zinc-300 transition-colors">GitHub</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
