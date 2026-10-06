import { Layout, PenTool, Terminal } from 'lucide-react';
import { motion } from 'framer-motion';
import type { PageServicesSection } from '../../../entities/page';
import { DEFAULT_HOME_SECTIONS } from '../../../entities/page';

interface ServicesSectionProps {
  content?: PageServicesSection;
}

export function ServicesSection({ content }: ServicesSectionProps) {
  const srv = content || DEFAULT_HOME_SECTIONS.services;
  const items = srv.items && srv.items.length > 0 ? srv.items : DEFAULT_HOME_SECTIONS.services.items;

  const icons = [PenTool, Layout, Terminal];
  const colorConfigs = [
    { badgeColor: 'text-purple-600 border-purple-200 bg-purple-50', borderColor: 'border-purple-200/80 hover:border-purple-300' },
    { badgeColor: 'text-emerald-600 border-emerald-200 bg-emerald-50', borderColor: 'border-emerald-200/80 hover:border-emerald-300' },
    { badgeColor: 'text-amber-600 border-amber-200 bg-amber-50', borderColor: 'border-amber-200/80 hover:border-amber-300' },
  ];

  return (
    <section id="services" className="scroll-mt-20 py-14 sm:py-20 lg:py-28 bg-white relative">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          
          {/* Staggered Services Cards (Left) */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 items-start">
            {items.map((item, idx) => {
              const Icon = icons[idx % icons.length];
              const cfg = colorConfigs[idx % colorConfigs.length];
              const isStaggered = idx === 1;
              const isWide = idx === 2;

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 + idx * 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.12 }}
                  className={`p-5 sm:p-7 rounded-2xl sm:rounded-3xl bg-white border ${cfg.borderColor} shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-md transition-all ${
                    isStaggered ? 'sm:mt-6 md:mt-8' : ''
                  } ${isWide ? 'sm:col-span-2' : ''}`}
                >
                  <div className={`w-10 h-10 rounded-2xl border ${cfg.badgeColor} flex items-center justify-center mb-4 sm:mb-6 shadow-2xs shrink-0`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-zinc-950 mb-2 sm:mb-3 tracking-tight break-words">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed font-normal">
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* Right Section Heading & Narrative */}
          <div className="lg:col-span-4 flex flex-col justify-center">
            {srv.badgeText && (
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-zinc-400 block mb-2 sm:mb-3">
                {srv.badgeText}
              </span>
            )}
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-zinc-950 tracking-tight leading-[1.15] mb-3 sm:mb-5 font-['Plus_Jakarta_Sans'] break-words">
              {srv.heading}
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 leading-relaxed font-normal mb-6 sm:mb-8">
              {srv.description}
            </p>
            <div className="w-12 h-1 bg-[#FCD06B] rounded-full" />
          </div>

        </div>
      </div>
    </section>
  );
}
