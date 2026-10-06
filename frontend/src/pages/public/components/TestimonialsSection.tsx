import { useState } from 'react';
import { ArrowLeft, ArrowRight, Quote } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PageTestimonialsSection } from '../../../entities/page';
import { DEFAULT_HOME_SECTIONS } from '../../../entities/page';

interface TestimonialsSectionProps {
  content?: PageTestimonialsSection;
}

export function TestimonialsSection({ content }: TestimonialsSectionProps) {
  const [current, setCurrent] = useState(0);
  const testSec = content || DEFAULT_HOME_SECTIONS.testimonials;
  const testimonials = testSec.items && testSec.items.length > 0 ? testSec.items : DEFAULT_HOME_SECTIONS.testimonials.items;

  const item = testimonials[current % testimonials.length] || DEFAULT_HOME_SECTIONS.testimonials.items[0];

  return (
    <section className="scroll-mt-20 py-14 sm:py-20 lg:py-28 bg-white relative">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">

          {/* Left Visual Card with Purple Backdrop */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <motion.div
              key={current}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-xs sm:max-w-sm aspect-[3/3.8] rounded-[28px] sm:rounded-[36px] bg-[#9D4EDD] p-4 sm:p-5 pt-6 sm:pt-8 flex flex-col justify-end overflow-hidden relative shadow-xl"
            >
              <div className="absolute top-4 sm:top-5 left-4 sm:left-5 text-white/30 text-xl sm:text-2xl font-black">
                ✦
              </div>
              <img
                src={item.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"}
                alt={item.author}
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80";
                }}
                className="w-full h-auto object-cover rounded-xl sm:rounded-2xl shadow-md"
              />
            </motion.div>
          </div>

          {/* Right Testimonial Statement */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {testSec.badgeText && (
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-zinc-400 block mb-2 sm:mb-3">
                {testSec.badgeText}
              </span>
            )}
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-zinc-950 tracking-tight leading-[1.15] mb-6 sm:mb-8 font-['Plus_Jakarta_Sans'] break-words">
              {testSec.heading}
            </h2>

            {/* Quote Icon */}
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 sm:mb-6 shadow-2xs shrink-0">
              <Quote className="w-5 h-5 sm:w-6 sm:h-6 rotate-180" />
            </div>

            {/* Testimonial Text with Fade Animation */}
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35 }}
              >
                <p className="text-lg sm:text-xl lg:text-2xl text-zinc-800 font-normal leading-relaxed mb-6 sm:mb-8 italic font-['Inter'] break-words">
                  "{item.quote}"
                </p>

                <div className="flex items-center justify-between flex-wrap gap-4 pt-4 sm:pt-6 border-t border-zinc-100">
                  <div>
                    <h4 className="text-base sm:text-lg font-bold text-zinc-950 break-words">{item.author}</h4>
                    <p className="text-xs sm:text-sm text-zinc-400 font-medium">{item.role}</p>
                  </div>

                  {/* Navigation Arrows */}
                  {testimonials.length > 1 && (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setCurrent((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))
                        }
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-zinc-200 hover:border-zinc-950 flex items-center justify-center text-zinc-700 hover:text-zinc-950 transition-colors cursor-pointer"
                        aria-label="Previous testimonial"
                      >
                        <ArrowLeft className="w-4 h-4 shrink-0" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setCurrent((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))
                        }
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-zinc-950 hover:bg-zinc-800 flex items-center justify-center text-white transition-colors cursor-pointer"
                        aria-label="Next testimonial"
                      >
                        <ArrowRight className="w-4 h-4 shrink-0" />
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>

          </div>

        </div>
      </div>
    </section>
  );
}
