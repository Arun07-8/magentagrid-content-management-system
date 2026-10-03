import { Calendar, Clock, User as UserIcon } from 'lucide-react';
import { Badge } from '../../../shared/ui';

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
  description,
  imageUrl,
  category = 'Technology',
  date,
  readTime = '4 min read',
  authorName = 'CMS Editorial',
}: PostViewProps) {
  // Format content paragraphs
  const paragraphs = content.split('\n\n').filter((p) => p.trim().length > 0);

  return (
    <article className="space-y-6">
      {/* Category Tag */}
      {category && (
        <div>
          <Badge variant="neutral">
            {category}
          </Badge>
        </div>
      )}

      {/* Article Title */}
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-zinc-900 tracking-tight leading-[1.2]">
        {title}
      </h1>

      {/* Short Subtitle / Lead Excerpt */}
      {description && (
        <p className="text-base sm:text-lg text-zinc-600 font-normal leading-relaxed">
          {description}
        </p>
      )}

      {/* Meta Byline Row */}
      <div className="flex flex-wrap items-center gap-3.5 text-xs text-zinc-500 py-3.5 border-y border-zinc-200/80">
        {authorName && (
          <div className="flex items-center gap-1.5 font-medium text-zinc-800">
            <UserIcon className="w-3.5 h-3.5 text-zinc-400" />
            <span>{authorName}</span>
          </div>
        )}
        {date && (
          <>
            <span className="text-zinc-300">•</span>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-zinc-400" />
              <span>{date}</span>
            </div>
          </>
        )}
        {readTime && (
          <>
            <span className="text-zinc-300">•</span>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-zinc-400" />
              <span>{readTime}</span>
            </div>
          </>
        )}
      </div>

      {/* Featured Image */}
      {imageUrl && (
        <div className="relative rounded-xl overflow-hidden aspect-[16/9] bg-zinc-100 shadow-xs border border-zinc-200/80">
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

      {/* Article Content */}
      <div className="text-zinc-800 text-base sm:text-[17px] leading-[1.8] space-y-6 pt-2">
        {paragraphs.map((para, idx) => (
          <p key={idx} className="whitespace-pre-line font-normal">
            {para}
          </p>
        ))}
      </div>
    </article>
  );
}
