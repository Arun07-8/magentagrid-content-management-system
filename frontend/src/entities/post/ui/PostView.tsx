import { Calendar, Clock, User as UserIcon } from 'lucide-react';

interface PostViewProps {
  title: string;
  content: string;
  description?: string;
  imageUrl?: string;
  category?: string;
  date?: string;
  readTime?: string;
  authorName?: string;
}

export function PostView({
  title,
  content,
  imageUrl,
  category = 'Technology',
  date,
  readTime = '4 min read',
  authorName = 'Magentagrid Editorial',
}: PostViewProps) {
  // Format content paragraphs
  const paragraphs = content.split('\n\n').filter((p) => p.trim().length > 0);

  return (
    <article className="space-y-6">
      {/* Featured Image */}
      {imageUrl && (
        <div className="relative rounded-2xl overflow-hidden aspect-[16/9] bg-slate-100 shadow-xs border border-slate-100">
          <img
            src={imageUrl}
            alt={title}
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80';
            }}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Category Badge */}
      {category && (
        <div>
          <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-600">
            {category}
          </span>
        </div>
      )}

      {/* Article Title */}
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
        {title}
      </h1>

      {/* Meta Row */}
      <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-400 pb-5 border-b border-slate-100">
        {authorName && (
          <div className="flex items-center gap-1.5 text-slate-600 font-medium">
            <UserIcon className="w-3.5 h-3.5 text-slate-400" />
            <span>{authorName}</span>
          </div>
        )}
        {date && (
          <>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{date}</span>
            </div>
          </>
        )}
        {readTime && (
          <>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{readTime}</span>
            </div>
          </>
        )}
      </div>

      {/* Article Content */}
      <div className="prose prose-slate max-w-none text-slate-600 text-base sm:text-lg leading-relaxed space-y-5">
        {paragraphs.map((para, idx) => (
          <p key={idx} className="whitespace-pre-line">
            {para}
          </p>
        ))}
      </div>
    </article>
  );
}
