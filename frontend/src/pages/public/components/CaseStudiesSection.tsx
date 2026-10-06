import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import type { Post } from '../../../shared/types';
import { getArticleCategory } from '../../../entities/post';

interface CaseStudiesProps {
  posts: Post[];
}

const FALLBACK_CASE_IMAGES = [
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
];

export function CaseStudiesSection({ posts }: CaseStudiesProps) {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);

  // Take first 5 posts from CMS data or show curated items if empty
  const displayItems =
    posts.length > 0
      ? posts.slice(0, 5)
      : [
          {
            _id: 'default-1',
            title: 'Jabbers Web Design & Architecture',
            description: 'Building high-performance editorial websites for next-gen digital creators.',
            category: 'Web Design',
          },
          {
            _id: 'default-2',
            title: 'Lightweight Fast Content Delivery',
            description: 'Optimizing CMS response times and real-time database subscriptions.',
            category: 'Performance',
          },
          {
            _id: 'default-3',
            title: 'Octoplus Design Agency Rebranding',
            description: 'A comprehensive brand identity overhaul with modern typography systems.',
            category: 'Brand Direction',
          },
          {
            _id: 'default-4',
            title: 'Empire Publishing Platform Migration',
            description: 'Transitioning 50k+ articles to a resilient headless MongoDB CMS.',
            category: 'Publishing',
          },
          {
            _id: 'default-5',
            title: 'Disva Studio Mobile Reading Experience',
            description: 'Designing distraction-free mobile reading modes and offline caching.',
            category: 'UX Research',
          },
        ];

  const activeItem = displayItems[activeIndex] || displayItems[0];
  const activeImage =
    (activeItem as Post).imageUrl || FALLBACK_CASE_IMAGES[activeIndex % FALLBACK_CASE_IMAGES.length];
  const activeCategory = getArticleCategory(activeItem as Post, (activeItem as any).category);

  return (
    <section className="scroll-mt-20 py-14 sm:py-20 lg:py-28 bg-white relative">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-6 mb-8 sm:mb-14">
          <div>
            <div className="flex items-center gap-2 text-[11px] sm:text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>DISPATCHES &amp; SHOWCASE</span>
            </div>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-zinc-950 tracking-tight font-['Plus_Jakarta_Sans'] break-words">
              Latest Case Studies
            </h2>
          </div>

          <button
            type="button"
            onClick={() => navigate('/blog')}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-zinc-900 hover:text-amber-600 transition-colors cursor-pointer group self-start sm:self-auto"
          >
            <span>View All Stories</span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0" />
          </button>
        </div>

        {/* Interactive Case Studies Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 items-center">
          
          {/* Left List of Projects / Stories */}
          <div className="lg:col-span-6 space-y-2.5 sm:space-y-3">
            {displayItems.map((item, idx) => {
              const isActive = idx === activeIndex;
              const itemId = (item as Post)._id || (item as any).id;
              const category = getArticleCategory(item as Post, (item as any).category);

              return (
                <div
                  key={itemId || idx}
                  onMouseEnter={() => setActiveIndex(idx)}
                  onClick={() => {
                    if (itemId && !itemId.startsWith('default-')) {
                      navigate(`/blog/${itemId}`);
                    } else {
                      navigate('/blog');
                    }
                  }}
                  className={`group p-4 sm:p-5 lg:p-6 rounded-2xl transition-all duration-300 cursor-pointer flex items-center justify-between gap-3 sm:gap-4 border ${
                    isActive
                      ? 'bg-amber-50/70 border-amber-200/80 shadow-xs sm:translate-x-2'
                      : 'bg-white hover:bg-zinc-50/80 border-transparent hover:border-zinc-200'
                  }`}
                >
                  <div className="flex-1 min-w-0 pr-2 sm:pr-4">
                    <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-0.5 sm:mb-1">
                      {category}
                    </span>
                    <h3
                      className={`text-sm sm:text-base lg:text-xl font-bold tracking-tight transition-colors line-clamp-1 break-words ${
                        isActive ? 'text-zinc-950 font-black' : 'text-zinc-750 group-hover:text-zinc-950'
                      }`}
                    >
                      {item.title}
                    </h3>
                  </div>

                  <div className="shrink-0">
                    <div
                      className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all ${
                        isActive
                          ? 'bg-zinc-950 text-white shadow-xs'
                          : 'bg-zinc-100 text-zinc-400 group-hover:bg-zinc-200 group-hover:text-zinc-800'
                      }`}
                    >
                      <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Featured Image & Preview Capsule */}
          <div className="lg:col-span-6 flex items-center justify-center">
            <div className="w-full max-w-lg aspect-[4/3] rounded-2xl sm:rounded-3xl overflow-hidden bg-zinc-100 border border-zinc-200 shadow-xl relative group">
              <img
                src={activeImage}
                alt={activeItem.title}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent flex flex-col justify-end p-5 sm:p-8 text-white">
                <span className="inline-block px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-white mb-2 w-fit">
                  {activeCategory}
                </span>
                <h4 className="text-base sm:text-xl lg:text-2xl font-bold tracking-tight mb-1 sm:mb-2 line-clamp-2 break-words">
                  {activeItem.title}
                </h4>
                {activeItem.description && (
                  <p className="text-xs sm:text-sm text-zinc-200 line-clamp-2 leading-relaxed font-normal">
                    {activeItem.description}
                  </p>
                )}
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
