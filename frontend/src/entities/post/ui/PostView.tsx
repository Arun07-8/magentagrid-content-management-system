

interface PostViewProps {
  title: string;
  content: string;
  description?: string;
  imageUrl?: string;
  date?: string;
  readTime?: string;
  authorName?: string;
}

export function PostView({
  title,
  content,
  description,
  imageUrl,
  date,
  readTime = '4 min read',
  authorName = 'Editorial Team',
}: PostViewProps) {
  const paragraphs = content.split('\n\n').filter((p) => p.trim().length > 0);

  return (
    <article className="max-w-[720px] mx-auto w-full">
      <header className="mb-12 text-left">
        <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-bold text-zinc-900 tracking-tight leading-[1.05] mb-6">
          {title}
        </h1>

        {description && (
          <p className="text-[22px] text-zinc-500 font-medium leading-[1.6] mb-8 max-w-[680px]">
            {description}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-start gap-4 text-sm font-semibold text-zinc-500 pt-6 border-t border-zinc-200">
          {authorName && (
            <div className="flex items-center gap-2">
              <span className="text-zinc-900">{authorName}</span>
            </div>
          )}
          {date && (
            <>
              <span className="text-zinc-300">·</span>
              <div className="flex items-center gap-1.5">
                <span>{date}</span>
              </div>
            </>
          )}
          {readTime && (
            <>
              <span className="text-zinc-300">·</span>
              <div className="flex items-center gap-1.5">
                <span className="lowercase">{readTime}</span>
              </div>
            </>
          )}
        </div>
      </header>

      {imageUrl && (
        <div className="mb-14 aspect-[16/9] w-full overflow-hidden bg-zinc-100 border border-zinc-200">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      )}

      <div className="prose prose-zinc prose-lg max-w-none text-[19px] text-zinc-800 leading-[1.8] font-serif-optional">
        {paragraphs.map((para, idx) => (
          <p key={idx} className="mb-8 whitespace-pre-wrap">
            {para}
          </p>
        ))}
      </div>
    </article>
  );
}
