import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { RichContentSection } from '../../../entities/page';

interface RichContentSectionViewProps {
  content?: RichContentSection;
  id?: string;
}

export function RichContentSectionView({ content, id }: RichContentSectionViewProps) {
  if (!content) return null;

  return (
    <section id={id} className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-[1320px] mx-auto w-full">
      <div className="max-w-3xl">
        {content.badgeText && (
          <span className="text-xs font-bold uppercase tracking-widest text-amber-700 bg-amber-100/70 border border-amber-200/80 px-3 py-1 rounded-full inline-block mb-4 font-mono">
            {content.badgeText}
          </span>
        )}
        {content.heading && (
          <h2 className="text-3xl sm:text-5xl font-black text-zinc-950 tracking-tight leading-tight uppercase font-['Plus_Jakarta_Sans'] mb-6">
            {content.heading}
          </h2>
        )}
        {content.content && (
          <div className="prose prose-zinc max-w-none text-base sm:text-lg text-zinc-600 leading-relaxed space-y-4 whitespace-pre-line font-normal">
            {content.content}
          </div>
        )}
        {content.buttonText && content.buttonLink && (
          <div className="mt-8">
            <Link
              to={content.buttonLink}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-zinc-950 hover:bg-zinc-800 text-white text-sm font-bold tracking-wide transition shadow-sm"
            >
              <span>{content.buttonText}</span>
              <ArrowRight className="w-4 h-4 text-[#FCD06B]" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
