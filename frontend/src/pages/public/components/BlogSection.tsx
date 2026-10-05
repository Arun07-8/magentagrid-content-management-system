import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Post } from '../../../shared/types';
import { ArticleCard, getArticleCategory } from '../../../entities/post';
import { EmptyState } from '../../../shared/ui';

interface BlogSectionProps {
  posts: Post[];
  isLoading?: boolean;
}

const CATEGORIES = ['All', 'Insights', 'Technology', 'Design', 'Culture', 'News'];

export function BlogSection({ posts }: BlogSectionProps) {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Filter posts by category and search
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const category = getArticleCategory(post);
      const matchesCategory =
        selectedCategory === 'All' || category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (post.description && post.description.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  }, [posts, selectedCategory, searchQuery]);

  const itemsPerPage = 7; // 1 featured + 6 grid items
  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / itemsPerPage));
  const paginatedFeed = filteredPosts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const featuredPost = paginatedFeed[0];
  const gridPosts = paginatedFeed.slice(1);

  return (
    <section id="blog" className="scroll-mt-20 py-20 sm:py-28 bg-white border-t border-zinc-200/80 relative">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider mb-4 border border-amber-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>EDITORIAL DISPATCHES &amp; NEWS</span>
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-zinc-950 tracking-tight leading-[1.1] mb-5 font-['Plus_Jakarta_Sans']">
            Stories, Ideas &amp; News
          </h2>
          <p className="text-base sm:text-lg text-zinc-600 font-normal leading-relaxed">
            Explore our dynamic publication feed covering technology, design, and content strategy published directly through the CMS.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 mb-10 border-b border-zinc-200/70">
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
                    setCurrentPage(1);
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
                setCurrentPage(1);
              }}
              placeholder="Search published articles..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-zinc-50 border border-zinc-200 rounded-full focus:bg-white focus:outline-none focus:border-zinc-950 transition-colors"
            />
          </div>
        </div>

        {/* Post Grid or Empty State */}
        {filteredPosts.length > 0 ? (
          <div className="space-y-10">
            {/* 1. Lead Featured Post (When on Page 1) */}
            {featuredPost && currentPage === 1 && (
              <ArticleCard
                post={featuredPost}
                variant="featured"
                onClick={() => navigate(`/blog/${featuredPost._id || (featuredPost as any).id}`)}
              />
            )}

            {/* 2. Secondary Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {(currentPage === 1 ? gridPosts : paginatedFeed).map((story) => {
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pt-10 border-t border-zinc-200/80 flex items-center justify-between text-sm text-zinc-500">
                <div>
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 font-semibold hover:text-zinc-950 disabled:opacity-40 disabled:hover:text-zinc-500 transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" /> Previous
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
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
            title="No published stories found"
            description="No articles match the current filter. Try adjusting your search query."
          />
        )}

      </div>
    </section>
  );
}
