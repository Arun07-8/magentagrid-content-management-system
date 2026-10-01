import { useState } from 'react'
import { Search, Calendar, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Navbar } from '../../components/Navbar'
import { Footer } from '../../components/Footer'
import { ARTICLES } from '../../data/blogData'
import type { Article } from '../../data/blogData'

export default function Blog() {
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPageNum, setCurrentPageNum] = useState<number>(1)

  const categories = [
    { name: 'All', count: 12 },
    { name: 'Technology', count: 5 },
    { name: 'Lifestyle', count: 3 },
    { name: 'Business', count: 3 },
    { name: 'Design', count: 1 },
  ]

  // Filter articles based on selected category & search query
  const filteredArticles = ARTICLES.filter((article: Article) => {
    const matchesCategory =
      selectedCategory === 'All' || article.category === selectedCategory
    const matchesSearch =
      searchQuery === '' ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Technology':
        return 'bg-blue-50 text-blue-600'
      case 'Lifestyle':
        return 'bg-emerald-50 text-emerald-600'
      case 'Business':
        return 'bg-amber-50 text-amber-600'
      case 'Design':
        return 'bg-purple-50 text-purple-600'
      default:
        return 'bg-blue-50 text-blue-600'
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navbar */}
      <Navbar />

      {/* Hero Banner */}
      <section className="bg-[#162736] text-white py-14 sm:py-18 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
          <span className="inline-block text-xs font-semibold tracking-widest text-blue-400 uppercase mb-2">
            OUR BLOG
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-3">
            Latest News &amp; Articles
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl">
            Stay updated with our latest articles, tips and insights.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
            {/* Left Sidebar */}
            <aside className="lg:col-span-3 space-y-8">
              {/* Search Box */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
                <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
              </div>

              {/* Categories */}
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-3 tracking-tight">
                  Categories
                </h3>
                <div className="space-y-1">
                  {categories.map((cat) => {
                    const isSelected = selectedCategory === cat.name
                    return (
                      <button
                        key={cat.name}
                        onClick={() => setSelectedCategory(cat.name)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${isSelected
                            ? 'bg-blue-50 text-blue-600 font-semibold'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                          }`}
                      >
                        <span>{cat.name}</span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${isSelected
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-100 text-slate-500'
                            }`}
                        >
                          {cat.count}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </aside>

            {/* Right Articles Grid & Pagination */}
            <div className="lg:col-span-9 flex flex-col justify-between">
              {/* Cards Grid (6 cards) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles.length > 0 ? (
                  filteredArticles.map((article) => (
                    <article
                      key={article.id}
                      onClick={() => navigate(`/blog/${article.id}`)}
                      className="group flex flex-col bg-white rounded-xl border border-slate-200/90 overflow-hidden hover:border-slate-300 hover:shadow-md transition-all duration-200 cursor-pointer"
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
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          {/* Category Badge */}
                          <span
                            className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full mb-2 ${getCategoryColor(
                              article.category
                            )}`}
                          >
                            {article.category}
                          </span>

                          {/* Title */}
                          <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2">
                            {article.title}
                          </h4>
                        </div>

                        {/* Meta */}
                        <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span>{article.date}</span>
                          </div>
                          <span className="w-5 h-5 rounded-full flex items-center justify-center text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all">
                            <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="col-span-full py-16 text-center text-slate-500">
                    <p className="text-base font-medium">No articles found in this category.</p>
                    <button
                      onClick={() => {
                        setSelectedCategory('All')
                        setSearchQuery('')
                      }}
                      className="mt-3 text-sm text-blue-600 hover:underline"
                    >
                      Clear filters
                    </button>
                  </div>
                )}
              </div>

              {/* Static Pagination: < 1 2 3 > */}
              <div className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-center gap-2">
                <button
                  onClick={() => setCurrentPageNum(Math.max(1, currentPageNum - 1))}
                  className="w-8 h-8 rounded border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors cursor-pointer"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {[1, 2, 3].map((num) => (
                  <button
                    key={num}
                    onClick={() => setCurrentPageNum(num)}
                    className={`w-8 h-8 rounded text-sm font-medium transition-colors cursor-pointer ${currentPageNum === num
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100'
                      }`}
                  >
                    {num}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPageNum(Math.min(3, currentPageNum + 1))}
                  className="w-8 h-8 rounded border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors cursor-pointer"
                  aria-label="Next page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
