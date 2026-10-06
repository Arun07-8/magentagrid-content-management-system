import {
  PenTool,
  Layers,
  ShieldCheck,
  Eye,
  Compass,
  Award,
} from 'lucide-react';
import { motion } from 'framer-motion';
import type { AboutPageSections } from '../../../entities/page';
import { DEFAULT_ABOUT_SECTIONS } from '../../../entities/page';

interface AboutSectionProps {
  content?: AboutPageSections;
  deviceMode?: 'desktop' | 'tablet' | 'mobile';
}

export function AboutSection({ content, deviceMode = 'desktop' }: AboutSectionProps) {
  const about = content || DEFAULT_ABOUT_SECTIONS;
  const header = about.header || DEFAULT_ABOUT_SECTIONS.header;
  const philosophy = about.philosophy || DEFAULT_ABOUT_SECTIONS.philosophy;
  const capabilities = about.capabilities || DEFAULT_ABOUT_SECTIONS.capabilities;
  const missionVision = about.missionVision || DEFAULT_ABOUT_SECTIONS.missionVision;
  const values = about.values || DEFAULT_ABOUT_SECTIONS.values;
  const isMobile = deviceMode === 'mobile';

  const headerImage =
    header.image ||
    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80';
  const philosophyImage =
    philosophy.image ||
    'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80';

  const capabilityIcons = [PenTool, Layers, ShieldCheck, Eye];

  return (
    <section id="about" className={`scroll-mt-20 ${isMobile ? 'py-10' : 'py-14 sm:py-20 lg:py-28'} bg-white border-t border-zinc-200/80 relative`}>
      <div className={`max-w-[1320px] mx-auto ${isMobile ? 'px-3 sm:px-4' : 'px-4 sm:px-6 lg:px-8'}`}>

        {/* 1. Header Overview (Text + Large Feature Image) */}
        <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center ${isMobile ? 'mb-8' : 'mb-14 sm:mb-20'}`}>
          <div className="lg:col-span-7 flex flex-col justify-center">
            <h2 className="text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-zinc-950 tracking-tight leading-[1.12] mb-4 sm:mb-6 font-['Plus_Jakarta_Sans'] break-words">
              {header.heading}{' '}
              {header.highlightWord && (
                <span className="relative inline-block px-2 py-0.5 rounded-xl bg-[#FCD06B] text-zinc-950 my-0.5">
                  {header.highlightWord}
                </span>
              )}
            </h2>

            <p className="text-sm sm:text-lg lg:text-xl text-zinc-600 font-normal leading-relaxed max-w-2xl">
              {header.description}
            </p>
          </div>

          {/* Right Editorial Header Visual */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative aspect-[4/3.2] rounded-3xl overflow-hidden bg-zinc-100 border border-zinc-200 shadow-md group"
            >
              <img
                src={headerImage}
                alt="Studio Overview"
                onError={(e) => {
                  e.currentTarget.src =
                    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80';
                }}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </motion.div>
          </div>
        </div>

        {/* 2. Philosophy Split Section (Image + Text Narrative) */}
        {philosophy && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center py-12 sm:py-16 lg:py-20 border-t border-b border-zinc-200/80">
            <div className="lg:col-span-5 order-2 lg:order-1">
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="aspect-[4/3] rounded-3xl overflow-hidden bg-zinc-100 border border-zinc-200 shadow-md group"
              >
                <img
                  src={philosophyImage}
                  alt="Philosophy Workspace"
                  onError={(e) => {
                    e.currentTarget.src =
                      'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80';
                  }}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </motion.div>
            </div>

            <div className="lg:col-span-7 order-1 lg:order-2 space-y-4">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-zinc-400 block font-mono">
                {philosophy.badgeText || 'OUR PHILOSOPHY'}
              </span>
              <h3 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-black text-zinc-950 tracking-tight leading-snug font-['Plus_Jakarta_Sans'] break-words">
                {philosophy.heading}
              </h3>
              <div className="space-y-3.5 text-sm sm:text-base lg:text-lg text-zinc-600 leading-relaxed font-normal pt-2">
                {philosophy.paragraphs && philosophy.paragraphs.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>
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
