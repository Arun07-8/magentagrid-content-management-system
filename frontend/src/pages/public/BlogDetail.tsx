import { useState } from 'react'
import { Calendar, Clock, Link2, Check, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Navbar } from '../../components/Navbar'
import { Footer } from '../../components/Footer'
import { ARTICLES } from '../../data/blogData'

export default function BlogDetail() {
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)

  // 4 related posts as shown in reference design
  const relatedPosts = ARTICLES.filter((a) => a.id !== 'future-of-web-dev-2025').slice(0, 4)

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 py-10 sm:py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back to Blog link (subtle helper) */}
          <div className="mb-6">
            <button
              onClick={() => navigate('/blog')}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Articles</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
            {/* Left Column: Main Article */}
            <article className="lg:col-span-8">
              {/* Featured Image */}
              <div className="rounded-2xl overflow-hidden aspect-[16/9] bg-slate-100 shadow-sm border border-slate-100 mb-6">
                <img
                  src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80"
                  alt="The Future of Web Development in 2025"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Category Badge */}
              <div className="mb-3">
                <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-600">
                  Technology
                </span>
              </div>

              {/* Article Title */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
                The Future of Web Development in 2025
              </h1>

              {/* Meta Row: Date & Read Time */}
              <div className="flex items-center gap-4 text-xs sm:text-sm text-slate-400 pb-6 mb-8 border-b border-slate-100">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>Apr 22, 2025</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>5 min read</span>
                </div>
              </div>

              {/* Article Body Content */}
              <div className="prose prose-slate max-w-none text-slate-600 space-y-6 text-base sm:text-lg leading-relaxed">
                <p>
                  Web development is evolving faster than ever. In 2025, we can expect new tools,
                  frameworks and practices that will make the web more powerful, accessible and
                  intelligent.
                </p>

                <div className="space-y-3 pt-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                    1. The Rise of AI-Powered Development
                  </h2>
                  <p className="text-base text-slate-600 leading-relaxed">
                    Artificial intelligence is not just a buzzword anymore. In 2025, AI tools will
                    help developers write, debug and optimize code faster than ever before.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                    2. Better Performance &amp; Core Web Vitals
                  </h2>
                  <p className="text-base text-slate-600 leading-relaxed">
                    Performance will continue to be a major focus. Frameworks like Next.js, React
                    and Svelte are making websites faster and more efficient.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                    3. More Focus on Accessibility
                  </h2>
                  <p className="text-base text-slate-600 leading-relaxed">
                    Web apps will be more inclusive, with better accessibility standards and
                    built-in tools to support everyone.
                  </p>
                </div>

                <p className="pt-2 text-base text-slate-600 leading-relaxed">
                  The future of web development is bright, and it&apos;s an exciting time to be
                  part of it.
                </p>
              </div>
            </article>

            {/* Right Column: Sidebar */}
            <aside className="lg:col-span-4 space-y-10">
              {/* Related Posts */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-5 tracking-tight">
                  Related Posts
                </h3>
                <div className="space-y-4">
                  {relatedPosts.map((post) => (
                    <div
                      key={post.id}
                      onClick={() => {
                        window.scrollTo({ top: 0, behavior: 'smooth' })
                      }}
                      className="group flex items-center gap-3.5 p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      {/* Thumbnail */}
                      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100">
                        <img
                          src={post.imageUrl}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs sm:text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2">
                          {post.title}
                        </h4>
                        <span className="text-[11px] text-slate-400 mt-1 block">
                          {post.date}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Share This Article */}
              <div className="pt-6 border-t border-slate-100">
                <h3 className="text-base font-bold text-slate-900 mb-4 tracking-tight">
                  Share this article
                </h3>
                <div className="flex items-center gap-2.5">
                  {/* Facebook */}
                  <a
                    href="#share-facebook"
                    aria-label="Share on Facebook"
                    className="w-9 h-9 rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-colors shadow-xs"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                    </svg>
                  </a>

                  {/* Twitter / X */}
                  <a
                    href="#share-twitter"
                    aria-label="Share on Twitter"
                    className="w-9 h-9 rounded-lg bg-sky-500 hover:bg-sky-600 text-white flex items-center justify-center transition-colors shadow-xs"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>

                  {/* LinkedIn */}
                  <a
                    href="#share-linkedin"
                    aria-label="Share on LinkedIn"
                    className="w-9 h-9 rounded-lg bg-blue-700 hover:bg-blue-800 text-white flex items-center justify-center transition-colors shadow-xs"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a>

                  {/* Copy Link */}
                  <button
                    onClick={handleCopyLink}
                    aria-label="Copy article link"
                    className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                    title={copied ? 'Link copied!' : 'Copy link'}
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Link2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
