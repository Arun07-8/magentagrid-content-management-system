import { motion } from 'framer-motion';
import type { PageProcessSection } from '../../../entities/page';
import { DEFAULT_HOME_SECTIONS } from '../../../entities/page';

interface ProcessSectionProps {
  content?: PageProcessSection;
}

export function ProcessSection({ content }: ProcessSectionProps) {
  const proc = content || DEFAULT_HOME_SECTIONS.process;
  const steps = proc.steps && proc.steps.length > 0 ? proc.steps : DEFAULT_HOME_SECTIONS.process.steps;

  return (
    <section className="scroll-mt-20 py-14 sm:py-20 lg:py-28 bg-gradient-to-b from-white via-zinc-50/50 to-white relative">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16">
          {proc.badgeText && (
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-zinc-400 block mb-2">
              {proc.badgeText}
            </span>
          )}
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-zinc-950 tracking-tight mb-3 sm:mb-4 font-['Plus_Jakarta_Sans'] break-words">
            {proc.heading}
          </h2>
          <p className="text-xs sm:text-sm lg:text-base text-zinc-500 font-normal leading-relaxed">
            {proc.description}
          </p>
        </div>

        {/* 3 Process Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8">
          {steps.map((step, idx) => (
            <motion.div
              key={step.num || idx}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-white border border-zinc-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.03)] hover:shadow-md transition-all relative overflow-hidden flex flex-col justify-between"
            >
              {/* Subtle decorative background watermark */}
              <div className="absolute top-3 sm:top-4 right-4 sm:right-6 text-zinc-100 font-black text-5xl sm:text-6xl select-none pointer-events-none font-['Plus_Jakarta_Sans']">
                {step.num}
              </div>

              <div>
                <span className="text-xs font-mono font-bold text-amber-500 uppercase tracking-widest block mb-2">
                  STEP {step.num}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-zinc-950 tracking-tight mb-4 sm:mb-6 font-['Plus_Jakarta_Sans'] break-words">
                  {step.title}
                </h3>

                <ul className="space-y-2.5 sm:space-y-3">
                  {step.items && step.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-600 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-zinc-100">
                <span className="text-[11px] sm:text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Phase {step.num} Completed
                </span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
