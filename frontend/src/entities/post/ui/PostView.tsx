import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Share2, Check, ArrowUpRight } from 'lucide-react';

export interface PostViewProps {
  title: string;
  content: string;
  description?: string;
  imageUrl?: string;
  category?: string;
  date?: string;
  readTime?: string;
  authorName?: string;
  onShare?: () => void;
  copied?: boolean;
  isPreview?: boolean;
}

const FALLBACK_ARTICLE_IMAGE =
  'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1600&q=80';

export function PostView({
  title,
  content,
  description,
  imageUrl,
  category = 'Insights',
  date,
  readTime = '3 min read',
  authorName = 'Editorial Team',
  onShare,
  copied = false,
  isPreview = false,
}: PostViewProps) {
  const [imageError, setImageError] = useState(false);
  const paragraphs = content.split('\n\n').filter((p) => p.trim().length > 0);
  const formattedDate = date || 'October 2026';
  const displayImage = !imageError && imageUrl ? imageUrl : FALLBACK_ARTICLE_IMAGE;
  const authorInitial = authorName ? authorName[0]?.toUpperCase() : 'E';

  return (
    <article className="w-full bg-white text-zinc-900">
      {/* Article Header Section */}
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16 pb-8">
        {!isPreview && (
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 hover:text-zinc-950 transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to All Stories</span>
          </Link>
        )}

        {/* Category Pill & Date */}
        <div className="flex items-center flex-wrap gap-3 mb-6">
          <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-amber-100 text-amber-900 border border-amber-200">
            {category}
          </span>
          <span className="text-xs text-zinc-400 font-medium">·</span>
          <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-medium">
            <Calendar className="w-3.5 h-3.5 text-zinc-400" />
            <span>{formattedDate}</span>
          </div>
          <span className="text-xs text-zinc-400 font-medium">·</span>
          <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-medium">
            <Clock className="w-3.5 h-3.5 text-zinc-400" />
            <span>{readTime}</span>
          </div>
        </div>

        {/* Large Article Title */}
        <h1 className="text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-zinc-950 tracking-tight leading-[1.1] mb-6 break-words font-['Plus_Jakarta_Sans']">
          {title}
        </h1>

        {/* Excerpt / Lead Description */}
        {description && (
          <p className="text-base sm:text-lg lg:text-xl text-zinc-600 leading-relaxed max-w-3xl mb-8 font-normal break-words">
            {description}
          </p>
        )}

        {/* Author Byline & Share Bar */}
        <div className="flex items-center justify-between flex-wrap gap-4 py-5 sm:py-6 border-y border-zinc-200/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-zinc-950 text-white font-bold flex items-center justify-center text-sm shadow-xs flex-shrink-0">
              {authorInitial}
            </div>
            <div>
              <div className="text-[10px] sm:text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                PUBLISHED BY
              </div>
              <div className="text-xs sm:text-sm font-bold text-zinc-950 capitalize">{authorName}</div>
            </div>
          </div>

          {onShare && (
            <button
              type="button"
              onClick={onShare}
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full border border-zinc-200 hover:border-zinc-950 text-xs font-bold uppercase tracking-wider text-zinc-900 transition-all bg-white hover:bg-zinc-50 cursor-pointer shadow-2xs"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Link Copied</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share Article</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Hero Featured Image */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-12 lg:mb-16">
        <div className="w-full aspect-[16/10] sm:aspect-[16/9] max-h-[560px] rounded-2xl sm:rounded-3xl overflow-hidden bg-zinc-100 border border-zinc-200/80 shadow-sm">
          <img
            src={displayImage}
            alt={title}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Main Content Body */}
      <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20">
        <div className="prose prose-zinc prose-lg max-w-none text-base sm:text-[18px] lg:text-[19px] text-zinc-800 leading-[1.8] break-words">
          {paragraphs.map((para, idx) => {
            if (idx === 0) {
              return (
                <p
                  key={idx}
                  className="text-base sm:text-lg lg:text-xl leading-relaxed text-zinc-900 font-normal mb-6 sm:mb-8 first-letter:float-left first-letter:text-4xl sm:first-letter:text-5xl first-letter:font-black first-letter:mr-2.5 sm:first-letter:mr-3 first-letter:leading-none first-letter:text-zinc-950 break-words"
                >
                  {para}
                </p>
              );
            }

            if (idx === Math.floor(paragraphs.length / 2) && paragraphs.length > 2) {
              return (
                <div key={idx} className="my-8 sm:my-10">
                  <blockquote className="p-4 sm:p-6 lg:p-8 rounded-2xl bg-amber-50/60 border-l-4 border-amber-400 text-lg sm:text-xl lg:text-2xl text-zinc-900 font-semibold leading-snug my-4 sm:my-6 break-words">
                    "{para.slice(0, 160)}..."
                  </blockquote>
                  <p className="mb-6 sm:mb-8 whitespace-pre-wrap break-words">{para}</p>
                </div>
              );
            }

            return (
              <p key={idx} className="mb-6 sm:mb-8 whitespace-pre-wrap break-words">
                {para}
              </p>
            );
          })}
        </div>

        {/* Footer Endmark */}
        <div className="mt-14 pt-8 border-t border-zinc-200 flex items-center justify-between text-xs text-zinc-500 font-medium">
          <span>Editorial Publication</span>
          {!isPreview && (
            <Link
              to="/blog"
              className="inline-flex items-center gap-1.5 font-bold text-zinc-950 hover:text-amber-600 transition-colors"
            >
              <span>Explore all articles</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
