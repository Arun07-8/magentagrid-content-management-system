import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Share2, Check, Clock } from 'lucide-react';

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
}

export function PostView({
  title,
  content,
  description,
  imageUrl,
  category = 'Guides',
  date,
  readTime = '4 min read',
  authorName = 'Editorial Team',
  onShare,
  copied = false,
}: PostViewProps) {
  const [imageError, setImageError] = useState(false);
  const paragraphs = content.split('\n\n').filter((p) => p.trim().length > 0);
  const formattedDate = date || 'July 29, 2026';
  const authorInitial = authorName ? authorName[0]?.toUpperCase() : 'E';

  return (
    <article className="w-full">
      {/* Two-Column Hero Banner Matching Reference Image */}
      <section className="w-full bg-gradient-to-r from-[#F0F2F6] via-[#F3F4F8] to-[#EBE7F6] border-b border-zinc-200/70 overflow-hidden relative">
        {/* Soft decorative background ambient bubbles on the right half */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-32 bottom-0 w-64 h-64 bg-indigo-200/20 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-14">
            
            {/* Left Column: Breadcrumbs, Title, Description, Published Date */}
            <div className="w-full lg:w-[54%] flex flex-col justify-center">
              {/* Breadcrumbs: Blog / Category / Title */}
              <nav className="flex items-center flex-wrap gap-1.5 text-xs sm:text-[13px] font-medium text-zinc-500 mb-5">
                <Link
                  to="/blog"
                  className="text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                >
                  Blog
                </Link>
                <span className="text-zinc-400">/</span>
                <Link
                  to="/blog"
                  className="text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                >
                  {category}
                </Link>
                <span className="text-zinc-400">/</span>
                <span className="text-zinc-600 truncate max-w-[240px] sm:max-w-[340px]">
                  {title}
                </span>
              </nav>

              {/* Massive Bold Article Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-bold text-zinc-900 tracking-tight leading-[1.16] mb-5">
                {title}
              </h1>

              {/* Subheading / Description */}
              {description && (
                <p className="text-[17px] sm:text-[18px] text-zinc-600 font-normal leading-relaxed mb-6 max-w-[620px]">
                  {description}
                </p>
              )}

              {/* Date & Metadata */}
              <div className="flex items-center flex-wrap gap-3 text-xs sm:text-[13px] text-zinc-500 font-medium pt-1">
                <span>Published on {formattedDate}</span>
                {readTime && (
                  <>
                    <span className="text-zinc-300">·</span>
                    <span>{readTime}</span>
                  </>
                )}
                {onShare && (
                  <>
                    <span className="text-zinc-300">·</span>
                    <button
                      type="button"
                      onClick={onShare}
                      className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 transition cursor-pointer font-semibold ml-1"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700">Link Copied</span>
                        </>
                      ) : (
                        <>
                          <Share2 className="w-3.5 h-3.5" />
                          <span>Share</span>
                        </>
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Right Column: Featured Image / Graphic */}
            <div className="w-full lg:w-[46%] flex items-center justify-center">
              {imageUrl && !imageError ? (
                <div className="w-full aspect-[16/11] max-h-[400px] rounded-2xl lg:rounded-3xl overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.06)] bg-white/80 border border-zinc-200/80 relative">
                  <img
                    src={imageUrl}
                    alt={title}
                    onError={() => setImageError(true)}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                /* Elegant illustration placeholder when no image */
                <div className="w-full aspect-[16/11] max-h-[400px] rounded-2xl lg:rounded-3xl bg-gradient-to-br from-[#ECE8F8] to-[#DDD4F4] p-8 flex flex-col items-center justify-center relative overflow-hidden border border-purple-200/60 shadow-[0_12px_40px_rgba(147,112,219,0.08)]">
                  <div className="w-20 h-20 rounded-3xl bg-zinc-950 text-white flex items-center justify-center mb-4 shadow-xl z-10">
                    <Sparkles className="w-10 h-10 text-[#FCD06B]" />
                  </div>
                  <span className="text-base font-bold text-zinc-900 tracking-tight z-10">{category}</span>
                  <span className="text-xs text-zinc-500 font-medium mt-1 z-10">Editorial Dispatch</span>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-[760px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Author Byline ("Written by...") matching reference */}
        <div className="flex items-center justify-between py-5 border-b border-zinc-100 mb-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-zinc-900 text-white font-bold flex items-center justify-center text-sm shadow-xs">
              {authorInitial}
            </div>
            <div>
              <div className="text-[11px] text-zinc-400 font-medium uppercase tracking-wider">Written by</div>
              <div className="text-[15px] font-bold text-zinc-900">{authorName}</div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-zinc-400 font-medium">
            <Clock className="w-3.5 h-3.5" />
            <span>{readTime}</span>
          </div>
        </div>

        {/* Prose Paragraphs */}
        <div className="prose prose-zinc prose-lg max-w-none text-[18px] sm:text-[19px] text-zinc-800 leading-[1.8]">
          {paragraphs.map((para, idx) => (
            <p key={idx} className="mb-8 whitespace-pre-wrap">
              {para}
            </p>
          ))}
        </div>
      </div>
    </article>
  );
}
