import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Edit3, Zap, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import type { PageWhyUsSection } from '../../../entities/page';
import { DEFAULT_HOME_SECTIONS } from '../../../entities/page';

interface WhyUsSectionProps {
  content?: PageWhyUsSection;
}

export function WhyUsSection({ content }: WhyUsSectionProps) {
  const navigate = useNavigate();
  const whyUs = content || DEFAULT_HOME_SECTIONS.whyUs;
  const features = whyUs.features && whyUs.features.length > 0 ? whyUs.features : DEFAULT_HOME_SECTIONS.whyUs.features;

  const icons = [ShieldCheck, Edit3, Zap];
  const colors = ['bg-emerald-500 text-white', 'bg-amber-500 text-white', 'bg-rose-500 text-white'];

  return (
    <section className="scroll-mt-20 py-14 sm:py-20 lg:py-28 bg-gradient-to-b from-white via-amber-50/20 to-white relative overflow-hidden">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          
          {/* Left Visual Card with Sunny Yellow Backdrop */}
          <div className="lg:col-span-6 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="w-full max-w-xs sm:max-w-md aspect-[4/4.6] rounded-[28px] sm:rounded-[36px] bg-[#F4A261] p-4 sm:p-6 pt-8 sm:pt-10 flex flex-col justify-end overflow-hidden relative shadow-xl"
            >
              {/* Decorative sunburst doodle / badge */}
              <div className="absolute top-4 sm:top-6 right-4 sm:right-6 text-white/30 text-2xl sm:text-3xl font-black select-none">
                ☀
              </div>
              <img
                src={whyUs.image || "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80"}
                alt="CMS Editorial Specialist"
                className="w-full h-auto object-cover rounded-xl sm:rounded-2xl shadow-md"
              />
            </motion.div>
          </div>

          {/* Right Why Choose Us Narrative & Checklist */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            {whyUs.badgeText && (
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-zinc-400 block mb-2 sm:mb-3">
                {whyUs.badgeText}
              </span>
            )}
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-zinc-950 tracking-tight leading-[1.15] mb-3 sm:mb-5 font-['Plus_Jakarta_Sans'] break-words">
              {whyUs.heading}
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 leading-relaxed font-normal mb-6 sm:mb-8">
              {whyUs.description}
            </p>

            {/* Checklist */}
            <div className="space-y-4 sm:space-y-6 mb-8 sm:mb-10">
              {features.map((feat, i) => {
                const Icon = icons[i % icons.length];
                const color = colors[i % colors.length];
                return (
                  <motion.div
                    key={feat.title}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className="flex items-start gap-3 sm:gap-4"
                  >
                    <div
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl ${color} flex items-center justify-center shrink-0 shadow-xs mt-0.5`}
                    >
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-zinc-900 mb-0.5 sm:mb-1 break-words">{feat.title}</h4>
                      <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed font-normal">{feat.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div>
              <button
                type="button"
                onClick={() => navigate('/about')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-zinc-950 hover:bg-zinc-800 text-white text-xs sm:text-sm font-bold uppercase tracking-wider px-6 sm:px-7 py-3.5 rounded-full transition-all duration-300 shadow-sm cursor-pointer"
              >
                <span>Learn More</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
