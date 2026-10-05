import { useState } from 'react';
import type { Post } from '../../../shared/types';
import { formatFullDate } from '../../../shared/lib';
import { ArrowUpRight, Clock } from 'lucide-react';

export interface ArticleCardProps {
  post: Post;
  onClick?: () => void;
  category?: string;
  className?: string;
  variant?: 'featured' | 'grid' | 'compact' | 'minimal';
  size?: 'default' | 'sm';
}

const FALLBACK_EDITORIAL_IMAGES = [
  'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80',
];

export function getArticleCategory(post: Post, customCategory?: string): string {
  if (customCategory) return customCategory;
  if (post.category) return post.category;
  const text = `${post.title} ${post.description || ''}`.toLowerCase();
  if (text.includes('marketing') || text.includes('guide') || text.includes('insight') || text.includes('strategy')) {
    return 'Insights';
  }
  if (text.includes('ai') || text.includes('tech') || text.includes('code') || text.includes('web') || text.includes('react')) {
    return 'Technology';
  }
  if (text.includes('culture') || text.includes('people') || text.includes('team') || text.includes('community')) {
    return 'Culture';
  }
  if (text.includes('news') || text.includes('update') || text.includes('release') || text.includes('announc')) {
    return 'News';
  }
  if (text.includes('design') || text.includes('brand') || text.includes('art')) {
    return 'Design';
  }
  return 'Editorial';
}

export function ArticleCard({
  post,
  onClick,
  category,
  className = '',
  variant = 'grid',
  size = 'default',
}: ArticleCardProps) {
  const [imageError, setImageError] = useState(false);
  const displayCategory = getArticleCategory(post, category);
  const formattedDate = formatFullDate(post.createdAt || post.updatedAt);
  const isSmall = size === 'sm' || variant === 'compact';

  const titleHash = post.title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const fallbackImg = FALLBACK_EDITORIAL_IMAGES[titleHash % FALLBACK_EDITORIAL_IMAGES.length];
  const imageSrc = !imageError && post.imageUrl ? post.imageUrl : fallbackImg;

  if (variant === 'featured') {
    return (
      <article
        onClick={onClick}
        className={`group relative flex flex-col lg:flex-row gap-8 lg:gap-12 bg-white border border-zinc-200/80 rounded-3xl p-6 sm:p-8 lg:p-10 transition-all duration-300 hover:shadow-lg hover:border-zinc-300 cursor-pointer ${className}`}
      >
        {/* Large Feature Image */}
        <div className="w-full lg:w-3/5 aspect-[16/10] overflow-hidden rounded-2xl bg-zinc-100 relative">
          <img
            src={imageSrc}
            alt={post.title}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute top-4 left-4 bg-zinc-950/80 backdrop-blur-xs text-white text-[10px] font-mono tracking-widest uppercase px-3 py-1 rounded-full">
            FEATURED DISPATCH
          </div>
        </div>

        {/* Content Side */}
        <div className="w-full lg:w-2/5 flex flex-col justify-between py-2">
          <div>
            <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-widest text-zinc-500 mb-4">
              <span className="font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/60">
                {displayCategory}
              </span>
              <span>·</span>
              <span>{formattedDate}</span>
            </div>

            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-zinc-950 tracking-tight leading-[1.15] mb-4 group-hover:text-amber-600 transition-colors font-['Plus_Jakarta_Sans']">
              {post.title}
            </h3>

            {post.description && (
              <p className="text-zinc-600 text-sm sm:text-base leading-relaxed line-clamp-3 sm:line-clamp-4 font-normal">
                {post.description}
              </p>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-zinc-100 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
              <Clock className="w-3.5 h-3.5" />
              <span>{post.readTime || '3 min read'}</span>
            </div>

            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-950 group-hover:translate-x-1 transition-transform">
              <span>Read Story</span>
              <ArrowUpRight className="w-4 h-4 text-amber-600" />
            </div>
          </div>
        </div>
      </article>
    );
  }

  // Grid / Compact Layout
  return (
    <article
      onClick={onClick}
      className={`group flex flex-col bg-white rounded-3xl border border-zinc-200/80 p-5 sm:p-6 transition-all duration-300 hover:shadow-md hover:border-zinc-300 cursor-pointer ${className}`}
    >
      <div
        className={`w-full ${
          isSmall ? 'aspect-[16/10] mb-4' : 'aspect-[16/10] mb-5'
        } overflow-hidden rounded-2xl bg-zinc-100 relative`}
      >
        <img
          src={imageSrc}
          alt={post.title}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-zinc-950 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full shadow-2xs">
          {displayCategory}
        </div>
      </div>

      <div className="flex flex-col flex-1">
        <div className="flex items-center justify-between text-xs text-zinc-400 mb-2 font-medium">
          <span>{formattedDate}</span>
          <span>{post.readTime || '3 min'}</span>
        </div>

        <h3
          className={`${
            isSmall
              ? 'text-base sm:text-lg font-bold line-clamp-2'
              : 'text-lg sm:text-xl font-black line-clamp-2'
          } text-zinc-950 tracking-tight group-hover:text-amber-600 transition-colors leading-[1.25] mb-2 font-['Plus_Jakarta_Sans']`}
        >
          {post.title}
        </h3>

        {post.description && !isSmall && (
          <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed line-clamp-2 font-normal mb-4">
            {post.description}
          </p>
        )}

        <div className="mt-auto pt-4 border-t border-zinc-100 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-zinc-900 group-hover:text-amber-600 transition-colors">
          <span>Read Dispatch</span>
          <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>
    </article>
  );
}
