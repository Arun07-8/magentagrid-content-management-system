import { PublicLayout } from '../../widgets';

export default function AboutPage() {
  const values = [
    {
      number: '01',
      title: 'Mission',
      description: 'Empower creators and organizations with focused, reliable tools to publish impactful long-form content. We believe in providing the best possible writing and reading experience, stripped of unnecessary distractions.',
    },
    {
      number: '02',
      title: 'Vision',
      description: 'Create a calmer, more thoughtful digital ecosystem where high-quality ideas reach the audiences they deserve. We envision a web where reading feels like a retreat rather than a chaotic feed.',
    },
    {
      number: '03',
      title: 'Values',
      description: 'Quality craft, editorial integrity, and uncompromising performance guide every line of code we ship. We prioritize human-centered design, typography, and accessibility in everything we build.',
    },
  ];



  return (
    <PublicLayout>
      {/* Editorial Header */}
      <section className="bg-white pt-20 pb-16 sm:pt-32 sm:pb-24 border-b border-zinc-200/60">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <span className="text-[13px] font-semibold uppercase tracking-widest text-zinc-500 block">
                About The Platform
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-[64px] font-bold text-zinc-900 tracking-tight leading-[1.05]">
                We help thoughtful ideas travel farther.
              </h1>
              <p className="text-zinc-500 text-lg sm:text-xl leading-relaxed max-w-lg font-medium pt-2">
                CMS is a modern, lightweight content management platform built to help editors, writers, and businesses publish stories with precision and craft.
              </p>
            </div>
            
            <div className="lg:col-span-5 hidden lg:block">
              <div className="aspect-[4/5] rounded-[4px] overflow-hidden bg-zinc-100">
                <img 
                  src="https://images.unsplash.com/photo-1455390582262-044cdead27d8?auto=format&fit=crop&w=800&q=80" 
                  alt="Editorial Desk" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Principles Section */}
      <section className="py-20 sm:py-32 bg-[#FAFAFA] border-b border-zinc-200">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <span className="text-[13px] font-semibold uppercase tracking-widest text-zinc-500 block mb-3">
              Our Principles
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-zinc-900 tracking-tight">
              What Drives Our Platform
            </h2>
          </div>

          <div className="flex flex-col border-t border-zinc-200">
            {values.map((v, idx) => (
              <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-8 py-12 border-b border-zinc-200 last:border-0 items-start">
                <div className="md:col-span-3">
                  <div className="text-[15px] font-bold text-zinc-400 font-mono tracking-widest uppercase">
                    {v.number}
                  </div>
                </div>
                <div className="md:col-span-3">
                  <h3 className="text-2xl sm:text-3xl font-bold text-zinc-900">{v.title}</h3>
                </div>
                <div className="md:col-span-6">
                  <p className="text-lg text-zinc-600 leading-relaxed font-medium max-w-2xl">
                    {v.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


    </PublicLayout>
  );
}
