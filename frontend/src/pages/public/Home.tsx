import { ArrowRight, Calendar } from 'lucide-react'
import { Navbar } from '../../components/Navbar'
import { Footer } from '../../components/Footer'
import { ARTICLES } from '../../data/blogData'
import { useNavigate } from 'react-router-dom'

export default function Home() {

  const navigate = useNavigate()
  // 3 static article cards for Home page
  const latestArticles = ARTICLES.slice(0, 3)

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Technology':
        return 'bg-blue-50 text-blue-600'
      case 'Lifestyle':
        return 'bg-emerald-50 text-emerald-600'
      case 'Business':
        return 'bg-amber-50 text-amber-600'
      default:
        return 'bg-blue-50 text-blue-600'
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navbar */}
      <Navbar />


      {/* Hero Section */}
      <section className="relative w-full h-[460px] sm:h-[520px] lg:h-[580px] bg-slate-900 overflow-hidden flex items-center">
        {/* Background Landscape with Hiker Image */}
        <div
          className="absolute inset-0 bg-cover bg-center sm:bg-[center_top_30%]"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2000&q=80')`,
          }}
        >
          {/* Subtle Dark Gradient Overlay for left legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/40 to-transparent sm:to-black/10" />
        </div>

        {/* Content Container */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-xl text-left">
            <span className="inline-block text-xs font-semibold tracking-widest text-slate-300 uppercase mb-3 drop-shadow-sm">
              LATEST UPDATES
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1] mb-4 drop-shadow-md">
              Stories, Ideas &amp; Insights
            </h1>

            <p className="text-slate-200 text-sm sm:text-base lg:text-lg leading-relaxed mb-8 max-w-lg drop-shadow-sm">
              Discover the latest news, articles and insights from our team. Stay informed and be
              part of our journey.
            </p>

            <button
              onClick={() => navigate('/blog')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Explore Blog</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Latest Articles Section */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-semibold tracking-wider text-blue-600 uppercase">
                FEATURED POSTS
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
                Latest Articles
              </h2>
            </div>

            <button
              onClick={() => navigate('/blog')}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 group cursor-pointer"
            >
              <span>View All Posts</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          {/* Articles Grid (3 cards) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {latestArticles.map((article) => (
              <article
                key={article.id}
                onClick={() => navigate('/blog-detail')}
                className="group flex flex-col bg-white rounded-xl border border-slate-200/90 overflow-hidden hover:border-slate-300 hover:shadow-lg transition-all duration-200 cursor-pointer"
              >
                {/* Image */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Category */}
                    <span
                      className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full mb-3 ${getCategoryColor(
                        article.category
                      )}`}
                    >
                      {article.category}
                    </span>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug mb-2">
                      {article.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-slate-600 text-xs sm:text-sm line-clamp-2 leading-relaxed">
                      {article.excerpt}
                    </p>
                  </div>

                  {/* Bottom Meta */}
                  <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{article.date}</span>
                    </div>
                    <span className="w-6 h-6 rounded-full flex items-center justify-center text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all">
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
