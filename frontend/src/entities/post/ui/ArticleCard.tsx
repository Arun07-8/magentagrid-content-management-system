import { useState } from 'react';
import type { Post } from '../../../shared/types';
import { formatFullDate } from '../../../shared/lib';

interface ArticleCardProps {
  post: Post;
  onClick?: () => void;
  category?: string;
  className?: string;
  size?: 'default' | 'sm';
}

// Helper to determine or format an appropriate category label like "Insights", "News", "Culture"
export function getArticleCategory(post: Post, customCategory?: string): string {
  if (customCategory) return customCategory;
  if (post.category) {
    return post.category;
  }
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
  return 'Insights';
}

export function ArticleCard({
  post,
  onClick,
  category,
  className = '',
  size = 'default',
}: ArticleCardProps) {
  const [imageError, setImageError] = useState(false);
  const displayCategory = getArticleCategory(post, category);
  const formattedDate = formatFullDate(post.createdAt || post.updatedAt);
  const isSmall = size === 'sm';

  return (
    <article
      onClick={onClick}
      className={`group flex flex-col cursor-pointer transition-all ${className}`}
    >
      {/* Featured Thumbnail */}
      <div
        className={`w-full aspect-[16/10] overflow-hidden ${
          isSmall ? 'rounded-2xl mb-3' : 'rounded-[20px] mb-4 sm:mb-5'
        } bg-[#F4F5F8] relative shadow-[0_4px_16px_rgba(0,0,0,0.03)] border border-zinc-200/50`}
      >
        {post.imageUrl && !imageError ? (
          <img
            src={post.imageUrl}
            alt={post.title}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-zinc-100 via-zinc-50 to-zinc-200 text-zinc-400">
            <div
              className={`${
                isSmall ? 'w-9 h-9 rounded-xl mb-1.5' : 'w-12 h-12 rounded-2xl mb-2'
              } bg-white/80 shadow-xs border border-zinc-200/60 flex items-center justify-center text-zinc-500`}
            >
              <svg className={`${isSmall ? 'w-4 h-4' : 'w-6 h-6'} stroke-[1.5]`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span className={`${isSmall ? 'text-[10px]' : 'text-xs'} font-semibold tracking-wider text-zinc-400 uppercase`}>
              Editorial
            </span>
          </div>
        )}
      </div>

      {/* Content Meta & Title */}
      <div className="flex flex-col flex-1">
        {/* Category Label */}
        <span
          className={`${
            isSmall
              ? 'text-[10px] sm:text-xs font-semibold text-zinc-500 mb-0.5 sm:mb-1'
              : 'text-[11px] sm:text-[13px] md:text-[14px] font-semibold text-zinc-600 mb-1 sm:mb-2'
          } block tracking-normal`}
        >
          {displayCategory}
        </span>

        {/* Article Title */}
        <h3
          className={`${
            isSmall
              ? 'text-[13px] sm:text-[15px] md:text-[16px] font-bold mb-1 sm:mb-1.5 leading-[1.3] line-clamp-2'
              : 'text-[14px] sm:text-[17px] md:text-[19px] lg:text-[20px] font-bold mb-1.5 sm:mb-2.5 leading-[1.3] line-clamp-2 sm:line-clamp-3'
          } text-zinc-900 group-hover:text-zinc-600 transition-colors tracking-tight`}
        >
          {post.title}
        </h3>

        {/* Formatted Date */}
        <div
          className={`${
            isSmall ? 'text-[10px] sm:text-xs text-zinc-400' : 'text-[11px] sm:text-[13px] text-zinc-400'
          } font-normal`}
        >
          {formattedDate}
        </div>
      </div>
    </article>
  );
}
