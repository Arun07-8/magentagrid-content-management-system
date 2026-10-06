import {
  PenTool,
  Layers,
  ShieldCheck,
  Eye,
  Compass,
  Sparkles,
  Award,
} from 'lucide-react';
import { motion } from 'framer-motion';
import type { AboutPageSections } from '../../../entities/page';
import { DEFAULT_ABOUT_SECTIONS } from '../../../entities/page';

interface AboutSectionProps {
  content?: AboutPageSections;
}

export function AboutSection({ content }: AboutSectionProps) {
  const about = content || DEFAULT_ABOUT_SECTIONS;
  const header = about.header || DEFAULT_ABOUT_SECTIONS.header;
  const philosophy = about.philosophy || DEFAULT_ABOUT_SECTIONS.philosophy;
  const capabilities = about.capabilities || DEFAULT_ABOUT_SECTIONS.capabilities;
  const missionVision = about.missionVision || DEFAULT_ABOUT_SECTIONS.missionVision;
  const values = about.values || DEFAULT_ABOUT_SECTIONS.values;

  const capabilityIcons = [PenTool, Layers, ShieldCheck, Eye];
  const pillarColors = ['bg-[#FCD06B]', 'bg-[#52B788]', 'bg-[#E76F51]', 'bg-[#9D4EDD]'];

  return (
    <section id="about" className="scroll-mt-20 py-14 sm:py-20 lg:py-28 bg-white border-t border-zinc-200/80 relative">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 1. Header Overview */}
        <div className="max-w-3xl mb-10 sm:mb-16">
          {header.badgeText && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-4 sm:mb-6 border border-amber-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>{header.badgeText}</span>
            </div>
          )}

          <h2 className="text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-zinc-950 tracking-tight leading-[1.15] mb-4 sm:mb-6 font-['Plus_Jakarta_Sans'] break-words">
            {header.heading}{' '}
            {header.highlightWord && (
              <span className="relative inline-block px-2 py-0.5 rounded-xl bg-[#FCD06B] text-zinc-950 my-0.5">
                {header.highlightWord}
              </span>
            )}
          </h2>

          <p className="text-sm sm:text-lg lg:text-xl text-zinc-600 font-normal leading-relaxed">
            {header.description}
          </p>
        </div>

        {/* Quick Pillars Strip */}
        {header.pillars && header.pillars.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pb-10 sm:pb-16 border-b border-zinc-200/70 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-zinc-600">
            {header.pillars.map((pillar, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full shrink-0 ${pillarColors[i % pillarColors.length]}`} />
                <span className="truncate">{pillar}</span>
              </div>
            ))}
          </div>
        )}

        {/* 2. Philosophy Split Section */}
        {philosophy && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start py-12 sm:py-16 lg:py-20 border-b border-zinc-100">
            <div className="lg:col-span-5">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-zinc-400 block mb-2 sm:mb-3">
                {philosophy.badgeText || 'OUR PHILOSOPHY'}
              </span>
              <h3 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-black text-zinc-950 tracking-tight leading-snug font-['Plus_Jakarta_Sans'] break-words">
                {philosophy.heading}
              </h3>
            </div>

            <div className="lg:col-span-7 space-y-4 sm:space-y-5 text-sm sm:text-base lg:text-lg text-zinc-600 leading-relaxed font-normal">
              {philosophy.paragraphs && philosophy.paragraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>
          </div>
        )}

        {/* 3. Platform Capabilities */}
        {capabilities && capabilities.items && (
          <div className="py-12 sm:py-16 lg:py-20">
            <div className="max-w-2xl mb-8 sm:mb-12">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-zinc-400 block mb-2">
                {capabilities.badgeText || 'PLATFORM CAPABILITIES'}
              </span>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-zinc-950 tracking-tight leading-snug mb-3 font-['Plus_Jakarta_Sans'] break-words">
                {capabilities.heading}
              </h3>
              <p className="text-xs sm:text-sm lg:text-base text-zinc-500 font-normal leading-relaxed">
                {capabilities.description}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {capabilities.items.map((item, idx) => {
                const IconComponent = capabilityIcons[idx % capabilityIcons.length];
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                    className="bg-zinc-50/70 rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-zinc-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:border-zinc-300 hover:bg-white transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-zinc-900 mb-4 sm:mb-6 shadow-2xs shrink-0">
                        <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 text-amber-700 stroke-[1.75]" />
                      </div>
                      <h4 className="text-sm sm:text-base lg:text-lg font-bold text-zinc-950 mb-2 tracking-tight">
                        {item.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed font-normal">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* 4. Purpose & Vision Cards */}
        {missionVision && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 py-8 sm:py-10 border-t border-zinc-100">
            <div className="bg-gradient-to-br from-amber-50/50 via-white to-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 border border-amber-200/60 shadow-xs">
              <div className="flex items-center gap-2 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-amber-700 mb-3 sm:mb-4">
                <Compass className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Our Purpose &amp; Mission</span>
              </div>
              <h4 className="text-lg sm:text-xl lg:text-2xl font-black text-zinc-950 tracking-tight mb-2 sm:mb-3 font-['Plus_Jakarta_Sans'] break-words">
                {missionVision.missionTitle}
              </h4>
              <p className="text-xs sm:text-sm lg:text-base text-zinc-600 leading-relaxed font-normal">
                {missionVision.missionDescription}
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50/50 via-white to-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 border border-purple-200/60 shadow-xs">
              <div className="flex items-center gap-2 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-purple-700 mb-3 sm:mb-4">
                <Award className="w-4 h-4 text-purple-500 shrink-0" />
                <span>Our Long-term Vision</span>
              </div>
              <h4 className="text-lg sm:text-xl lg:text-2xl font-black text-zinc-950 tracking-tight mb-2 sm:mb-3 font-['Plus_Jakarta_Sans'] break-words">
                {missionVision.visionTitle}
              </h4>
              <p className="text-xs sm:text-sm lg:text-base text-zinc-600 leading-relaxed font-normal">
                {missionVision.visionDescription}
              </p>
            </div>
          </div>
        )}

        {/* 5. Guiding Principles */}
        {values && values.items && (
          <div className="pt-12 sm:pt-16 lg:pt-20 border-t border-zinc-200/80">
            <div className="max-w-2xl mb-8 sm:mb-12">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-zinc-400 block mb-2">
                {values.badgeText || 'GUIDING PRINCIPLES'}
              </span>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-zinc-950 tracking-tight leading-snug mb-3 font-['Plus_Jakarta_Sans'] break-words">
                {values.heading}
              </h3>
              <p className="text-xs sm:text-sm lg:text-base text-zinc-500 font-normal leading-relaxed">
                {values.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              {values.items.map((val) => (
                <div
                  key={val.number}
                  className="bg-zinc-50/60 rounded-2xl sm:rounded-3xl p-5 sm:p-7 lg:p-8 border border-zinc-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.02)]"
                >
                  <span className="inline-flex items-center gap-2 text-xs font-mono font-bold text-amber-600 uppercase tracking-widest block mb-2.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                    PRINCIPLE {val.number}
                  </span>
                  <h4 className="text-base sm:text-lg lg:text-xl font-bold text-zinc-950 tracking-tight mb-2 font-['Plus_Jakarta_Sans'] break-words">
                    {val.title}
                  </h4>
                  <p className="text-xs sm:text-sm lg:text-base text-zinc-600 leading-relaxed font-normal">
                    {val.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
