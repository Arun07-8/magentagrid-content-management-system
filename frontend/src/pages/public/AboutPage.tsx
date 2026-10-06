import { useNavigate } from 'react-router-dom';
import {
  PenTool,
  Layers,
  ShieldCheck,
  Eye,
  Compass,
  Sparkles,
  ArrowRight,
  FileText,
} from 'lucide-react';
import { PublicLayout } from '../../widgets';
import { motion } from 'framer-motion';

export default function AboutPage() {
  const navigate = useNavigate();

  const coreCapabilities = [
    {
      icon: PenTool,
      title: 'Editorial Authoring',
      description:
        'A distraction-free writing environment equipped with Markdown formatting, excerpt generation, and estimated reading time calculations.',
    },
    {
      icon: Layers,
      title: 'Structured Taxonomy',
      description:
        'Logical classification across topics, custom tags, and categories to keep large editorial archives organized and easily discoverable.',
    },
    {
      icon: ShieldCheck,
      title: 'Role-Based Governance',
      description:
        'Granular permissions distinguishing administrators from contributing editors, with protected draft and publication workflows.',
    },
    {
      icon: Eye,
      title: 'Instant Multi-Device Preview',
      description:
        'Multi-screen preview modes for desktop, tablet, and mobile displays ensuring typography and layout render correctly before going live.',
    },
  ];

  const coreValues = [
    {
      number: '01',
      title: 'Clarity Over Complexity',
      description:
        'We believe content management should be straightforward. Every button, input, and panel serves a practical editorial purpose without unnecessary bloat.',
    },
    {
      number: '02',
      title: 'Editorial Craft & Typography',
      description:
        'Words matter. We treat typography, line height, and whitespace as foundational design elements so long-form publications remain effortless to read.',
    },
    {
      number: '03',
      title: 'Operational Reliability',
      description:
        'Content is a critical asset. We prioritize dependable data persistence, automated error handling, and robust JWT authentication across all workflows.',
    },
    {
      number: '04',
      title: 'Speed & Headless Architecture',
      description:
        'Clean semantic markup, optimized bundle sizes, and efficient database indexing provide instant page transitions for readers and editors alike.',
    },
  ];

  return (
    <PublicLayout>
      <main className="min-h-screen bg-white text-zinc-900">
        {/* 1. Page Header Section */}
        <section className="bg-gradient-to-b from-amber-50/40 via-white to-white border-b border-zinc-200/80 pt-24 sm:pt-32 lg:pt-36 pb-12 sm:pb-20">
          <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-4 sm:mb-6 border border-amber-200">
                <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>ABOUT US</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-zinc-950 tracking-tight leading-[1.1] mb-5 sm:mb-6 font-['Plus_Jakarta_Sans'] break-words">
                We believe good content should{' '}
                <span className="relative inline-block px-2 py-0.5 rounded-xl bg-[#FCD06B] text-zinc-950 my-0.5">
                  move people
                </span>
                .
              </h1>

              <p className="text-base sm:text-xl text-zinc-600 font-normal leading-relaxed">
                A modern publishing platform and digital publication engineered for writers, publishers, and creative thinkers who prioritize craft, speed, and reader-first presentation.
              </p>
            </div>

            {/* Quick Pillars Strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-zinc-200/70 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-zinc-600">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FCD06B] shrink-0" />
                <span className="truncate">Editorial Integrity</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#52B788] shrink-0" />
                <span className="truncate">Lightweight Core</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#E76F51] shrink-0" />
                <span className="truncate">Structured Taxonomies</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#9D4EDD] shrink-0" />
                <span className="truncate">Real-time Distribution</span>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Who We Are Narrative */}
        <section className="py-14 sm:py-20 lg:py-28 bg-white border-b border-zinc-100">
          <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
              <div className="lg:col-span-5">
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-zinc-400 block mb-2 sm:mb-3">
                  OUR PHILOSOPHY
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-zinc-950 tracking-tight leading-snug font-['Plus_Jakarta_Sans'] break-words">
                  Built by teams who value writing, precision, and visual craft.
                </h2>
              </div>

              <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-sm sm:text-base lg:text-lg text-zinc-600 leading-relaxed font-normal">
                <p>
                  Modern digital publishing often gets weighed down by excessive configuration, convoluted plugin ecosystems, and cluttered administrative dashboards that pull attention away from the actual content.
                </p>
                <p>
                  We built this platform to bring simplicity and dignity back to digital publishing. By focusing strictly on the essential requirements of content creation—writing, editing, categorizing, and distributing—we provide writers and editors with a calm, predictable environment.
                </p>
                <p>
                  Whether publishing industry analysis, technical essays, or daily dispatches, our publication platform ensures every article looks polished and remains comfortable to read across every device.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Core Capabilities */}
        <section className="py-14 sm:py-20 lg:py-28 bg-zinc-50/60 border-b border-zinc-200/80">
          <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-10 sm:mb-14">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-zinc-400 block mb-2 sm:mb-3">
                PLATFORM CAPABILITIES
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-zinc-950 tracking-tight leading-snug mb-3 sm:mb-4 font-['Plus_Jakarta_Sans'] break-words">
                Streamlining the entire editorial lifecycle.
              </h2>
              <p className="text-xs sm:text-sm lg:text-base text-zinc-500 font-normal leading-relaxed">
                From initial notes to multi-channel distribution, the platform handles each phase of content creation with purpose-built tools.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {coreCapabilities.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                    className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-zinc-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:border-zinc-300 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-zinc-900 mb-4 sm:mb-6 shadow-2xs shrink-0">
                        <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 text-amber-700 stroke-[1.75]" />
                      </div>
                      <h3 className="text-sm sm:text-base lg:text-lg font-bold text-zinc-950 mb-2 tracking-tight">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed font-normal">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 4. Purpose & Vision Cards */}
        <section className="py-14 sm:py-20 lg:py-28 bg-white border-b border-zinc-100">
          <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
              {/* Mission Card */}
              <div className="bg-gradient-to-br from-amber-50/50 via-white to-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 border border-amber-200/60 shadow-xs">
                <div className="flex items-center gap-2 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-amber-700 mb-3 sm:mb-4">
                  <Compass className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Our Purpose &amp; Mission</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-zinc-950 tracking-tight mb-3 font-['Plus_Jakarta_Sans'] break-words">
                  Empowering creators with dependable, distraction-free tools.
                </h3>
                <p className="text-xs sm:text-sm lg:text-base text-zinc-600 leading-relaxed font-normal">
                  Our mission is to eliminate technical friction from the writing process. We believe quality thinking deserves quality presentation, and we are committed to building software that respects the time of writers and the attention of readers.
                </p>
              </div>

              {/* Vision Card */}
              <div className="bg-gradient-to-br from-purple-50/50 via-white to-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 border border-purple-200/60 shadow-xs">
                <div className="flex items-center gap-2 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-purple-700 mb-3 sm:mb-4">
                  <Sparkles className="w-4 h-4 text-purple-500 shrink-0" />
                  <span>Our Long-term Vision</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-zinc-950 tracking-tight mb-3 font-['Plus_Jakarta_Sans'] break-words">
                  A calmer, more thoughtful web for long-form knowledge and discourse.
                </h3>
                <p className="text-xs sm:text-sm lg:text-base text-zinc-600 leading-relaxed font-normal">
                  We envision a publishing landscape where digital publications prioritize depth, clarity, and durability over transient algorithmic engagement. We strive to be the steady foundation upon which impactful publications are built.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Core Values */}
        <section className="py-14 sm:py-20 lg:py-28 bg-zinc-50/60 border-b border-zinc-200/80">
          <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-10 sm:mb-14">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-zinc-400 block mb-2 sm:mb-3">
                GUIDING PRINCIPLES
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-zinc-950 tracking-tight leading-snug mb-3 sm:mb-4 font-['Plus_Jakarta_Sans'] break-words">
                Core values that inform every product decision.
              </h2>
              <p className="text-xs sm:text-sm lg:text-base text-zinc-500 font-normal leading-relaxed">
                These principles guide how we structure code, design workflows, and shape the editorial tools we deliver.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8">
              {coreValues.map((val) => (
                <div
                  key={val.number}
                  className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-zinc-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.02)]"
                >
                  <span className="inline-flex items-center gap-2 text-xs font-mono font-bold text-amber-600 uppercase tracking-widest block mb-2.5 sm:mb-3">
                    <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                    PRINCIPLE {val.number}
                  </span>
                  <h3 className="text-base sm:text-lg lg:text-xl font-bold text-zinc-950 tracking-tight mb-2 sm:mb-3 font-['Plus_Jakarta_Sans'] break-words">
                    {val.title}
                  </h3>
                  <p className="text-xs sm:text-sm lg:text-base text-zinc-600 leading-relaxed font-normal">
                    {val.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. Closing CTA Section */}
        <section className="py-14 sm:py-20 lg:py-28 bg-white">
          <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 rounded-[28px] sm:rounded-[36px] p-6 sm:p-12 lg:p-16 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 sm:gap-8 shadow-xl">
              <div className="max-w-xl">
                <div className="flex items-center gap-2 text-[11px] sm:text-xs font-bold uppercase tracking-widest text-amber-400 mb-2 sm:mb-3 font-mono">
                  <FileText className="w-4 h-4 shrink-0" />
                  <span>START PUBLISHING</span>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight mb-3 sm:mb-4 font-['Plus_Jakarta_Sans'] break-words">
                  Ready to read our latest dispatches or write your next story?
                </h2>
                <p className="text-xs sm:text-sm lg:text-base text-zinc-400 font-normal leading-relaxed">
                  Explore our curated publications or connect with our editorial team for inquiries.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => navigate('/blog')}
                  className="w-full sm:w-auto h-11 sm:h-12 px-6 sm:px-8 rounded-full bg-[#FCD06B] hover:bg-[#f0be4d] text-zinc-950 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer inline-flex items-center justify-center gap-2"
                >
                  <span>Explore Articles</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </PublicLayout>
  );
}
