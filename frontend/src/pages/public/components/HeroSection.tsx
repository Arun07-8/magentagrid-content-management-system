import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import type { PageHeroSection } from '../../../entities/page';
import { DEFAULT_HOME_SECTIONS } from '../../../entities/page';

interface HeroSectionProps {
  content?: PageHeroSection;
  deviceMode?: 'desktop' | 'tablet' | 'mobile';
}

export function HeroSection({ content, deviceMode = 'desktop' }: HeroSectionProps) {
  const hero = content || DEFAULT_HOME_SECTIONS.hero;
  const isMobile = deviceMode === 'mobile';

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 75;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  const handleLinkClick = (link: string) => {
    if (!link) return;
    if (link.startsWith('#')) {
      scrollToSection(link.replace('#', ''));
    } else if (link.startsWith('http://') || link.startsWith('https://')) {
      window.open(link, '_blank');
    } else {
      const clean = link.replace(/^\//, '').toLowerCase();
      if (['about', 'services', 'contact', 'home'].includes(clean)) {
        scrollToSection(clean);
      } else {
        window.location.href = link;
      }
    }
  };

  return (
    <section id="home" className={`scroll-mt-20 relative ${isMobile ? 'pt-10 pb-8' : 'pt-24 sm:pt-32 lg:pt-36 pb-16 sm:pb-24'} overflow-hidden bg-gradient-to-b from-amber-50/30 via-white to-white`}>
      {/* Soft Ambient Background Glows */}
      <div className="absolute top-12 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-purple-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-20 right-10 w-72 sm:w-96 h-72 sm:h-96 bg-amber-100/40 rounded-full blur-3xl pointer-events-none" />

      <div className={`max-w-[1320px] mx-auto ${isMobile ? 'px-3 sm:px-4' : 'px-4 sm:px-6 lg:px-8'} relative z-10`}>
        <div className={`grid ${isMobile ? 'grid-cols-1 gap-6' : 'grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8'} items-center`}>

          {/* Left Hero Content */}
          <div className="lg:col-span-7 flex flex-col justify-center">

            {/* Main Headline with Highlighted Keyword */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl sm:text-5xl lg:text-[62px] xl:text-[68px] font-black text-zinc-950 tracking-tight leading-[1.1] mb-5 sm:mb-6 font-['Plus_Jakarta_Sans'] break-words"
            >
              {hero.heading}{' '}
              {hero.highlightWord && (
                <span className="relative inline-block px-2 py-0.5 rounded-xl bg-[#FCD06B] text-zinc-950 my-0.5">
                  {hero.highlightWord}
                </span>
              )}
            </motion.h1>

            {/* Supporting Copy */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg text-zinc-600 font-normal leading-relaxed max-w-xl mb-6 sm:mb-8"
            >
              {hero.description}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-8 sm:mb-12"
            >
              {hero.primaryButtonText && (
                <button
                  type="button"
                  onClick={() => handleLinkClick(hero.primaryButtonLink || '#services')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-zinc-950 hover:bg-zinc-800 text-white text-sm sm:text-base font-bold px-6 sm:px-8 py-3.5 sm:py-4 rounded-full transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
                >
                  <span>{hero.primaryButtonText}</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </button>
              )}

              {hero.secondaryButtonText && (
                <button
                  type="button"
                  onClick={() => handleLinkClick(hero.secondaryButtonLink || 'about')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-white hover:bg-zinc-50 text-zinc-900 text-sm sm:text-base font-bold px-6 sm:px-7 py-3.5 sm:py-4 rounded-full border border-zinc-200 transition-all cursor-pointer shadow-2xs"
                >
                  <div className="w-6 h-6 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-900 text-xs shrink-0">
                    ▶
                  </div>
                  <span>{hero.secondaryButtonText}</span>
                </button>
              )}
            </motion.div>

            {/* Readers & Metrics Counter */}
            {hero.showReadersStats !== false && (hero.readersCount || hero.readersLabel || (hero.readersAvatars && hero.readersAvatars.length > 0)) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="flex flex-wrap sm:flex-nowrap items-center gap-4 sm:gap-6 pt-5 sm:pt-6 border-t border-zinc-200/70"
              >
                {(hero.readersCount || hero.readersLabel) && (
                  <div>
                    {hero.readersCount && (
                      <span className="text-2xl sm:text-3xl font-black text-zinc-950 font-['Plus_Jakarta_Sans']">
                        {hero.readersCount}
                      </span>
                    )}
                    {hero.readersLabel && (
                      <span className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                        {hero.readersLabel}
                      </span>
                    )}
                  </div>
                )}

                {(hero.readersCount || hero.readersLabel) && (hero.readersAvatars?.length || hero.readersBadgeText) && (
                  <div className="hidden sm:block h-8 w-px bg-zinc-200" />
                )}

                {((hero.readersAvatars && hero.readersAvatars.length > 0) || hero.readersBadgeText) && (
                  <div className="flex items-center -space-x-2.5 overflow-hidden">
                    {(hero.readersAvatars && hero.readersAvatars.length > 0
                      ? hero.readersAvatars
                      : [
                          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
                          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
                          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
                        ]
                    ).map((avatarUrl, idx) => (
                      <img
                        key={idx}
                        className="inline-block h-9 w-9 sm:h-10 sm:w-10 rounded-full ring-2 ring-white object-cover"
                        src={avatarUrl}
                        alt={`Reader profile ${idx + 1}`}
                        onError={(e) => {
                          e.currentTarget.src =
                            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80';
                        }}
                      />
                    ))}
                    {hero.readersBadgeText && (
                      <div className="inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-zinc-950 text-[10px] sm:text-[11px] font-bold text-white ring-2 ring-white shrink-0">
                        {hero.readersBadgeText}
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </div>

          {/* Right Hero Visuals */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-none flex items-end justify-center gap-3 sm:gap-6">

              {/* Card 1 - Emerald/Green Backdrop */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="w-1/2 aspect-[3/4.5] rounded-2xl sm:rounded-3xl bg-[#52B788] p-2.5 sm:p-3 pt-5 sm:pt-6 flex flex-col justify-end overflow-hidden relative shadow-lg"
              >
                <div className="absolute top-3 sm:top-4 left-3 sm:left-4 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-white text-xs font-bold">
                  ✦
                </div>
                <img
                  src={hero.card1Image || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80'}
                  alt="Editorial Strategist"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80';
                  }}
                  className="w-full h-auto object-cover rounded-xl sm:rounded-2xl"
                />
              </motion.div>

              {/* Card 2 - Terracotta/Orange Backdrop */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.35 }}
                className="w-1/2 aspect-[3/4.2] rounded-2xl sm:rounded-3xl bg-[#E76F51] p-2.5 sm:p-3 pt-5 sm:pt-6 flex flex-col justify-end overflow-hidden relative shadow-lg -mb-3 sm:-mb-4"
              >
                <div className="absolute top-3 sm:top-4 left-3 sm:left-4 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-white text-xs font-bold">
                  ★
                </div>
                <img
                  src={hero.card2Image || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80'}
                  alt="Editorial Director"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80';
                  }}
                  className="w-full h-auto object-cover rounded-xl sm:rounded-2xl"
                />
              </motion.div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
