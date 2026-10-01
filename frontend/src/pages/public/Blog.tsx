import { useState, useMemo } from 'react'
import { Search, Calendar, ArrowRight, ChevronLeft, ChevronRight, Loader2, AlertCircle } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Navbar } from '../../components/Navbar'
import { Footer } from '../../components/Footer'
import { usePublicPosts } from '../../entities/post/hooks/usePosts'

export default function Blog() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const initialQuery = searchParams.get('q') || ''

  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [currentPageNum, setCurrentPageNum] = useState<number>(1)

  const { data: posts = [], isLoading, isError, error } = usePublicPosts({
    search: searchQuery,
    category: selectedCategory === 'All' ? undefined : selectedCategory,
  })

  // Calculate dynamic category counts
  const categories = useMemo(() => {
    const counts: Record<string, number> = {
      All: posts.length,
      Technology: 0,
      Lifestyle: 0,
      Business: 0,
      Design: 0,
    }

    posts.forEach((post) => {
      const cat = post.category || 'Technology'
      counts[cat] = (counts[cat] || 0) + 1
    })

    return [
      { name: 'All', count: posts.length },
      { name: 'Technology', count: counts['Technology'] || 0 },
      { name: 'Lifestyle', count: counts['Lifestyle'] || 0 },
      { name: 'Business', count: counts['Business'] || 0 },
      { name: 'Design', count: counts['Design'] || 0 },
    ]
  }, [posts])

  // Pagination (6 articles per page)
  const itemsPerPage = 6
  const totalPages = Math.max(1, Math.ceil(posts.length / itemsPerPage))
  const paginatedArticles = posts.slice(
    (currentPageNum - 1) * itemsPerPage,
    currentPageNum * itemsPerPage
  )

  const getCategoryColor = (category?: string) => {
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
            OUR BLOG &amp; NEWS
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-3">
            Latest News &amp; Articles
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl">
            Stay updated with our latest published insights, product announcements, and articles.
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
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setCurrentPageNum(1)
                  }}
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
                        onClick={() => {
                          setSelectedCategory(cat.name)
                          setCurrentPageNum(1)
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-blue-50 text-blue-600 font-semibold'
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span>{cat.name}</span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            isSelected
                              ? 'bg-blue-100 text-blue-700'
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

            {/* Right Articles Grid */}
            <div className="lg:col-span-9">
              {isLoading ? (
                <div className="py-24 flex flex-col items-center justify-center text-slate-400">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-2" />
                  <p className="text-sm">Loading articles...</p>
                </div>
              ) : isError ? (
                <div className="py-20 text-center text-red-500 space-y-2">
                  <AlertCircle className="w-8 h-8 mx-auto" />
                  <p className="font-semibold text-sm">Failed to load articles</p>
                  <p className="text-xs text-slate-400">{(error as any)?.message}</p>
                </div>
              ) : paginatedArticles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedArticles.map((article) => {
                    const articleId = article._id || article.id!
                    const formattedDate = new Date(
                      article.createdAt || article.updatedAt
                    ).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })

                    return (
                      <article
                        key={articleId}
                        onClick={() => navigate(`/blog/${articleId}`)}
                        className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-all duration-200 cursor-pointer group"
                      >
                        {/* Image */}
                        <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                          <img
                            src={
                              article.imageUrl ||
                              'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80'
                            }
                            alt={article.title}
                            onError={(e) => {
                              ;(e.target as HTMLImageElement).src =
                                'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80'
                            }}
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
                              {article.category || 'Technology'}
                            </span>

                            {/* Title */}
                            <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2">
                              {article.title}
                            </h4>

                            {/* Excerpt */}
                            <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                              {article.description}
                            </p>
                          </div>

                          {/* Meta */}
                          <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-slate-400" />
                              <span>{formattedDate}</span>
                            </div>
                            <span className="w-5 h-5 rounded-full flex items-center justify-center text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all">
                              <ArrowRight className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        </div>
                      </article>
                    )
                  })}
                </div>
              ) : (
                <div className="col-span-full py-20 text-center text-slate-500">
                  <p className="text-base font-semibold text-slate-800">No published articles found</p>
                  <p className="text-xs text-slate-400 mt-1">Try adjusting your category or search keywords.</p>
                  {(selectedCategory !== 'All' || searchQuery) && (
                    <button
                      onClick={() => {
                        setSelectedCategory('All')
                        setSearchQuery('')
                      }}
                      className="mt-4 px-4 py-2 bg-blue-50 text-blue-600 text-xs font-semibold rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
                    >
                      Reset filters
                    </button>
                  )}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-center gap-2">
                  <button
                    disabled={currentPageNum === 1}
                    onClick={() => setCurrentPageNum(Math.max(1, currentPageNum - 1))}
                    className="w-8 h-8 rounded border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-40"
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                    <button
                      key={num}
                      onClick={() => setCurrentPageNum(num)}
                      className={`w-8 h-8 rounded text-sm font-medium transition-colors cursor-pointer ${
                        currentPageNum === num
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {num}
                    </button>
                  ))}

                  <button
                    disabled={currentPageNum === totalPages}
                    onClick={() => setCurrentPageNum(Math.min(totalPages, currentPageNum + 1))}
                    className="w-8 h-8 rounded border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-40"
                    aria-label="Next page"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
