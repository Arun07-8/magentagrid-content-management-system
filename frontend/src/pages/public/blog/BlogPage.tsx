import { useState, useMemo } from 'react';
import { Calendar, ArrowRight, ChevronLeft, ChevronRight, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PublicLayout } from '../../../widgets';
import { usePublicPosts } from '../../../entities/post';
import { Spinner, EmptyState, ErrorState, Badge } from '../../../shared/ui';
import { formatDate } from '../../../shared/lib';

export default function BlogPage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [currentPageNum, setCurrentPageNum] = useState<number>(1);

  const { data: allPosts = [], isLoading, isError, error, refetch } = usePublicPosts();

  const categories = useMemo(() => {
    const counts: Record<string, number> = {
      All: allPosts.length,
      Technology: 0,
      Lifestyle: 0,
      Business: 0,
      Design: 0,
    };

    allPosts.forEach((post) => {
      const cat = post.category || 'Technology';
      counts[cat] = (counts[cat] || 0) + 1;
    });

    return [
      { name: 'All', count: allPosts.length },
      { name: 'Technology', count: counts['Technology'] || 0 },
      { name: 'Lifestyle', count: counts['Lifestyle'] || 0 },
      { name: 'Business', count: counts['Business'] || 0 },
      { name: 'Design', count: counts['Design'] || 0 },
    ];
  }, [allPosts]);

  const filteredArticles = useMemo(() => {
    if (selectedCategory === 'All') return allPosts;
    return allPosts.filter((p) => (p.category || 'Technology') === selectedCategory);
  }, [allPosts, selectedCategory]);

  const itemsPerPage = 6;
  const totalPages = Math.max(1, Math.ceil(filteredArticles.length / itemsPerPage));
  const paginatedArticles = filteredArticles.slice(
    (currentPageNum - 1) * itemsPerPage,
    currentPageNum * itemsPerPage
  );

  const handleCategorySelect = (catName: string) => {
    setSelectedCategory(catName);
    setCurrentPageNum(1);
  };

  return (
    <PublicLayout>
      {/* Editorial Header */}
      <section className="bg-zinc-50/70 py-14 sm:py-16 border-b border-zinc-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block mb-1">
              Archive &amp; Feed
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-950 tracking-tight mb-2">
              Articles &amp; Dispatches
            </h1>
            <p className="text-zinc-600 text-sm sm:text-base leading-relaxed">
              Explore perspectives, technical essays, and industry analysis published by the CMS editorial team.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Categories Sidebar */}
          <aside className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-xl p-4 border border-zinc-200/80 shadow-xs">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3 px-1">
                Categories
              </h3>
              <div className="space-y-1">
                {categories.map((cat) => {
                  const isSelected = selectedCategory === cat.name;
                  return (
                    <button
                      key={cat.name}
                      onClick={() => handleCategorySelect(cat.name)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-zinc-100 text-zinc-900 font-semibold'
                          : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                          isSelected
                            ? 'bg-zinc-900 text-white'
                            : 'bg-zinc-100 text-zinc-500'
                        }`}
                      >
                        {cat.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Main Content Articles */}
          <main className="lg:col-span-9 space-y-8">
            {isLoading ? (
              <Spinner fullHeight text="Loading articles..." />
            ) : isError ? (
              <ErrorState
                title="Failed to load articles"
                message={error?.message}
                onRetry={() => refetch()}
              />
            ) : paginatedArticles.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {paginatedArticles.map((article) => {
                    const articleId = article._id || article.id;
                    const formattedDate = formatDate(article.createdAt) || 'Recent';

                    return (
                      <article
                        key={articleId}
                        onClick={() => navigate(`/blog/${articleId}`)}
                        className="group bg-white rounded-xl overflow-hidden border border-zinc-200/80 shadow-xs hover:border-zinc-300 hover:shadow-sm transition-all duration-150 flex flex-col cursor-pointer"
                      >
                        {article.imageUrl ? (
                          <div className="relative aspect-[16/10] overflow-hidden bg-zinc-100 border-b border-zinc-100">
                            <img
                              src={article.imageUrl}
                              alt={article.title}
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                              className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-102"
                            />
                            <div className="absolute top-3 left-3">
                              <Badge variant="neutral">
                                {article.category || 'Technology'}
                              </Badge>
                            </div>
                          </div>
                        ) : (
                          <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-zinc-50 to-zinc-100 border-b border-zinc-100 flex items-center justify-center">
                            <FileText className="w-8 h-8 text-zinc-300" />
                            <div className="absolute top-3 left-3">
                              <Badge variant="neutral">
                                {article.category || 'Technology'}
                              </Badge>
                            </div>
                          </div>
                        )}

                        <div className="p-5 flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center gap-2.5 text-xs text-zinc-400 mb-2.5">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-zinc-400" />
                                <span>{formattedDate}</span>
                              </div>
                              {article.readTime && (
                                <>
                                  <span>•</span>
                                  <span>{article.readTime}</span>
                                </>
                              )}
                            </div>

                            <h3 className="text-base sm:text-lg font-bold text-zinc-950 group-hover:text-zinc-700 transition-colors line-clamp-2 mb-2 leading-snug">
                              {article.title}
                            </h3>

                            <p className="text-zinc-500 text-xs sm:text-sm line-clamp-2 leading-relaxed mb-4">
                              {article.description || article.content}
                            </p>
                          </div>

                          <div className="pt-2 flex items-center gap-1.5 text-xs font-semibold text-zinc-900 group-hover:text-zinc-600 transition-colors">
                            <span>Read article</span>
                            <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>

                {totalPages > 1 && (
                  <div className="pt-8 border-t border-zinc-200/80 flex items-center justify-between text-xs text-zinc-500">
                    <div>
                      Page {currentPageNum} of {totalPages}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setCurrentPageNum((p) => Math.max(1, p - 1))}
                        disabled={currentPageNum === 1}
                        className="p-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                        aria-label="Previous page"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>

                      {Array.from({ length: totalPages }).map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentPageNum(i + 1)}
                          className={`w-7 h-7 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                            currentPageNum === i + 1
                              ? 'bg-zinc-900 text-white'
                              : 'text-zinc-600 hover:bg-zinc-100'
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}

                      <button
                        onClick={() => setCurrentPageNum((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPageNum === totalPages}
                        className="p-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                        aria-label="Next page"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <EmptyState
                title="No articles found"
                description="No articles have been published in this category yet."
              />
            )}
          </main>
        </div>
      </div>
    </PublicLayout>
  );
}
