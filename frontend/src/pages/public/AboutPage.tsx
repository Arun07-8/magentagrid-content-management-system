import { Link, useNavigate } from 'react-router-dom';
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
        'Granular permissions distinguishing administrators from contributing editors, with protected draft and publication state workflows.',
    },
    {
      icon: Eye,
      title: 'Instant Device Preview',
      description:
        'Multi-screen preview modes for desktop, tablet, and mobile displays ensuring typography and layout render correctly before going live.',
    },
  ];

  const coreValues = [
    {
      number: '01',
      title: 'Clarity Over Complexity',
      description:
        'We believe a content management system should be straightforward. Every button, input, and panel serves a practical editorial purpose without unnecessary feature bloat.',
    },
    {
      number: '02',
      title: 'Editorial Craft & Typography',
      description:
        'Words matter. We treat typography, line height, and whitespace as foundational design elements so that long-form publications remain effortless to read.',
    },
    {
      number: '03',
      title: 'Operational Reliability',
      description:
        'Content is a critical business asset. We prioritize dependable data persistence, automated error handling, and robust authentication across all workflows.',
    },
    {
      number: '04',
      title: 'Speed & Lightweight Architecture',
      description:
        'Clean semantic markup, optimized bundle sizes, and efficient database indexing provide instant page transitions for readers and editors alike.',
    },
  ];

  const differentiators = [
    {
      label: 'Focused Workspace',
      detail:
        'Unlike bloated generic site builders, our interface is purposefully dedicated to writing, organizing, and distributing editorial articles.',
    },
    {
      label: 'Zero Digital Noise',
      detail:
        'No popups, no distracting tracking widgets, and no clutter. Just clean pages designed for focused thought and uninterrupted reading.',
    },
    {
      label: 'Unified Design System',
      detail:
        'The administrative studio and public reading experiences share cohesive typographic rules, color harmony, and accessibility standards.',
    },
    {
      label: 'Maintainable Content Model',
      detail:
        'Structured REST APIs and normalized database models make extending or integrating content across downstream platforms simple and predictable.',
    },
  ];

  return (
    <PublicLayout>
      <main className="min-h-screen bg-white text-[#2A3039]">
        {/* 1. Page Header / Overview Section */}
        <section className="bg-gradient-to-b from-[#F4F5F8] to-white border-b border-zinc-200/80 pt-16 sm:pt-24 pb-14 sm:pb-20">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              {/* Breadcrumbs / Label */}
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-4">
                <Link to="/" className="hover:text-zinc-700 transition-colors">
                  Home
                </Link>
                <span>/</span>
                <span className="text-zinc-700 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FCD06B]" />
                  About the Platform
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-zinc-900 tracking-tight leading-[1.12] mb-6">
                A purpose-built content platform designed for{' '}
                <span className="relative inline-block">
                  <span className="relative z-10">editorial clarity</span>
                  <span className="absolute bottom-1 left-0 w-full h-2.5 bg-[#FCD06B]/50 -z-0 rounded-xs" />
                </span>{' '}
                and control.
              </h1>

              {/* Lead Paragraph */}
              <p className="text-base sm:text-lg text-zinc-600 font-normal leading-relaxed">
                CMS is a modern content management platform engineered for editorial teams,
                publishers, and digital writers who prioritize focused writing workflows, clean
                architecture, and reader-first presentation.
              </p>
            </div>

            {/* Quick Pillars Horizontal Strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 pt-8 border-t border-zinc-200/80 text-xs font-medium text-zinc-600">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FCD06B] flex-shrink-0" />
                <span>Editorial Integrity</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FCD06B] flex-shrink-0" />
                <span>Lightweight Core</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FCD06B] flex-shrink-0" />
                <span>Structured Taxonomies</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FCD06B] flex-shrink-0" />
                <span>Production-Ready Publishing</span>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Who We Are Section */}
        <section className="py-16 sm:py-24 border-b border-zinc-100">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
              <div className="lg:col-span-4">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-2">
                  Who We Are
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight leading-snug">
                  Built by teams who value writing, precision, and simplicity.
                </h2>
              </div>

              <div className="lg:col-span-8 space-y-5 text-base sm:text-[17px] text-zinc-600 leading-relaxed font-normal">
                <p>
                  Modern digital publishing often gets bogged down by excessive configuration,
                  convoluted plugin ecosystems, and cluttered administrative dashboards that pull
                  attention away from the actual content.
                </p>
                <p>
                  We built this platform to bring simplicity back to digital publishing. By focusing
                  strictly on the essential requirements of content creation—writing, editing,
                  categorizing, and distributing—we provide writers and editors with a calm,
                  predictable environment that gets out of their way.
                </p>
                <p>
                  Whether publishing industry analysis, technical documentation, or regular company
                  dispatches, our platform ensures every article looks polished and remains
                  accessible across every device.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. What We Do / Platform Capabilities */}
        <section className="py-16 sm:py-24 bg-[#FAFBFD] border-b border-zinc-200/80">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-2">
                What We Do
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight leading-snug mb-3">
                Streamlining the entire editorial lifecycle.
              </h2>
              <p className="text-sm sm:text-base text-zinc-500 font-normal leading-relaxed">
                From initial rough notes to final multi-channel distribution, the platform handles
                each phase of content creation with purpose-built tools.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {coreCapabilities.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl p-6 border border-zinc-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:border-zinc-300 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-[#FCD06B]/15 border border-[#FCD06B]/35 flex items-center justify-center text-zinc-900 mb-5 shadow-2xs">
                        <IconComponent className="w-5 h-5 stroke-[1.75]" />
                      </div>
                      <h3 className="text-base font-bold text-zinc-900 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-[13px] text-zinc-500 leading-relaxed font-normal">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 4. Mission & Vision (Side-by-Side Selective Cards) */}
        <section className="py-16 sm:py-24 border-b border-zinc-100">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
              {/* Mission Card */}
              <div className="bg-[#FAFBFD] rounded-2xl p-8 lg:p-10 border border-zinc-200/80 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-500 mb-4">
                    <Compass className="w-4 h-4 text-[#FCD06B]" />
                    <span>Our Purpose & Mission</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight mb-4">
                    Empowering creators with dependable, distraction-free publishing tools.
                  </h3>
                  <p className="text-sm sm:text-base text-zinc-600 leading-relaxed font-normal">
                    Our mission is to eliminate technical friction from the writing process. We
                    believe quality thinking deserves quality presentation, and we are committed to
                    building software that respects the time of writers and the attention of
                    readers.
                  </p>
                </div>
              </div>

              {/* Vision Card */}
              <div className="bg-[#FAFBFD] rounded-2xl p-8 lg:p-10 border border-zinc-200/80 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-500 mb-4">
                    <Sparkles className="w-4 h-4 text-[#FCD06B]" />
                    <span>Our Long-term Vision</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight mb-4">
                    A calmer, more thoughtful web for long-form knowledge and discourse.
                  </h3>
                  <p className="text-sm sm:text-base text-zinc-600 leading-relaxed font-normal">
                    We envision a publishing landscape where digital publications prioritize
                    depth, clarity, and durability over transient algorithmic engagement. We
                    strive to be the steady foundation upon which impactful publications are built.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Core Values */}
        <section className="py-16 sm:py-24 bg-[#FAFBFD] border-b border-zinc-200/80">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-14">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-2">
                Guiding Principles
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight leading-snug mb-3">
                Core values that inform every product decision.
              </h2>
              <p className="text-sm sm:text-base text-zinc-500 font-normal leading-relaxed">
                These principles guide how we structure code, design workflows, and shape the
                editorial tools we deliver.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {coreValues.map((val) => (
                <div
                  key={val.number}
                  className="bg-white rounded-2xl p-7 border border-zinc-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.03)]"
                >
                  <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-zinc-500 uppercase tracking-widest block mb-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FCD06B]" />
                    {val.number}
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-zinc-900 tracking-tight mb-2.5">
                    {val.title}
                  </h3>
                  <p className="text-sm text-zinc-600 leading-relaxed font-normal">
                    {val.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. What Makes Us Different / Our Approach */}
        <section className="py-16 sm:py-24 border-b border-zinc-100">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
              <div className="lg:col-span-5">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-2">
                  Why Choose Us
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight leading-snug mb-4">
                  What makes our approach fundamentally different.
                </h2>
                <p className="text-sm sm:text-base text-zinc-500 font-normal leading-relaxed">
                  We engineered this platform specifically for teams who want control over their
                  editorial assets without the operational overhead of monolithic legacy systems.
                </p>
              </div>

              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {differentiators.map((diff, index) => (
                  <div
                    key={index}
                    className="p-6 rounded-2xl bg-[#FAFBFD] border border-zinc-200/70"
                  >
                    <h3 className="text-base font-bold text-zinc-900 mb-2">
                      {diff.label}
                    </h3>
                    <p className="text-xs sm:text-[13px] text-zinc-600 leading-relaxed font-normal">
                      {diff.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 7. Simple, Professional Closing Section */}
        <section className="py-16 sm:py-24 bg-[#F8F9FA]">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-3xl p-8 sm:p-12 lg:p-16 border-2 border-zinc-200 shadow-[0_12px_40px_rgba(0,0,0,0.04)] flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="max-w-xl">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
                  <FileText className="w-4 h-4 text-zinc-900" />
                  <span>Start Publishing</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight mb-3">
                  Ready to read our latest dispatches or write your next story?
                </h2>
                <p className="text-sm sm:text-base text-zinc-500 font-normal leading-relaxed">
                  Explore our curated publications or log in to the administrative studio to manage
                  your workspace.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => navigate('/blog')}
                  className="h-11 px-6 rounded-full bg-[#FCD06B] hover:bg-[#f0be4d] text-zinc-950 text-xs sm:text-sm font-bold transition-all shadow-[0_4px_14px_rgba(252,208,107,0.35)] cursor-pointer inline-flex items-center gap-2"
                >
                  <span>Explore Articles</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => navigate('/admin/posts')}
                  className="h-11 px-6 rounded-full bg-white hover:bg-zinc-50 text-zinc-800 text-xs sm:text-sm font-semibold transition-all border border-zinc-200 cursor-pointer"
                >
                  Access Studio
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </PublicLayout>
  );
}
