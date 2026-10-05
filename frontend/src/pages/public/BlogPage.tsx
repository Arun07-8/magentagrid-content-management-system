import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Search, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PublicLayout } from '../../widgets';
import { usePublicPosts, ArticleCard, getArticleCategory } from '../../entities/post';
import { Spinner, EmptyState, ErrorState } from '../../shared/ui';

const CATEGORIES = ['All', 'Insights', 'Technology', 'Design', 'Culture', 'News'];

export default function BlogPage() {
  const navigate = useNavigate();
  const [currentPageNum, setCurrentPageNum] = useState<number>(1);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const { data: allPosts = [], isLoading, isError, error, refetch } = usePublicPosts();

  // Filter posts by category & search query
  const filteredPosts = useMemo(() => {
    return allPosts.filter((post) => {
      const category = getArticleCategory(post);
      const matchesCategory =
        selectedCategory === 'All' || category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (post.description && post.description.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  }, [allPosts, selectedCategory, searchQuery]);

  const itemsPerPage = 7; // 1 featured + 6 grid items
  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / itemsPerPage));
  const paginatedFeed = filteredPosts.slice(
    (currentPageNum - 1) * itemsPerPage,
    currentPageNum * itemsPerPage
  );

  const featuredPost = paginatedFeed[0];
  const gridPosts = paginatedFeed.slice(1);

  return (
    <PublicLayout>
      {/* Editorial Header Section */}
      <section className="bg-gradient-to-b from-amber-50/40 via-white to-white pt-28 sm:pt-36 pb-12 border-b border-zinc-200/80">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider mb-4 border border-amber-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>EDITORIAL ARCHIVE</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-black text-zinc-950 tracking-tight leading-[1.1] mb-5 font-['Plus_Jakarta_Sans']">
              Stories &amp; Dispatches
            </h1>
            <p className="text-base sm:text-lg text-zinc-600 font-normal leading-relaxed">
              Explore perspectives, essays, and architectural case studies published by our creators and editorial team.
            </p>
          </div>

          {/* Search & Category Filter Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-6 border-t border-zinc-200/60">
            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat);
                      setCurrentPageNum(1);
                    }}
                    className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'bg-zinc-950 text-white shadow-xs'
                        : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPageNum(1);
                }}
                placeholder="Search articles..."
                className="w-full pl-10 pr-4 py-2 text-sm bg-zinc-50 border border-zinc-200 rounded-full focus:bg-white focus:outline-none focus:border-zinc-950 transition-colors"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Stories Grid */}
      <main className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 w-full flex-1">
        {isLoading ? (
          <Spinner fullHeight text="Loading articles..." />
        ) : isError ? (
          <ErrorState
            title="Failed to load articles"
            message={error?.message}
            onRetry={() => refetch()}
          />
        ) : filteredPosts.length > 0 ? (
          <div className="flex flex-col gap-12">
            
            {/* 1. Lead Featured Story (Top of Page 1) */}
            {featuredPost && currentPageNum === 1 && (
              <ArticleCard
                post={featuredPost}
                variant="featured"
                onClick={() => navigate(`/blog/${featuredPost._id || (featuredPost as any).id}`)}
              />
            )}

            {/* 2. Asymmetric Secondary Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {(currentPageNum === 1 ? gridPosts : paginatedFeed).map((story) => {
                const storyId = story._id || (story as any).id;
                return (
                  <ArticleCard
                    key={storyId}
                    post={story}
                    variant="grid"
                    onClick={() => navigate(`/blog/${storyId}`)}
                  />
                );
              })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="pt-10 border-t border-zinc-200/80 flex items-center justify-between text-sm text-zinc-500">
                <div>
                  Page {currentPageNum} of {totalPages}
                </div>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setCurrentPageNum((p) => Math.max(1, p - 1))}
                    disabled={currentPageNum === 1}
                    className="flex items-center gap-1 font-semibold hover:text-zinc-950 disabled:opacity-40 disabled:hover:text-zinc-500 transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" /> Previous
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentPageNum((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPageNum === totalPages}
                    className="flex items-center gap-1 font-semibold hover:text-zinc-950 disabled:opacity-40 disabled:hover:text-zinc-500 transition-colors cursor-pointer"
                  >
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <EmptyState
            title="No articles found"
            description="Try adjusting your search query or selecting a different category."
          />
        )}
      </main>
    </PublicLayout>
  );
}
