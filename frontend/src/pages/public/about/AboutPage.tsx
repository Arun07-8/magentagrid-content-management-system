import { Users, FileText, Heart, Clock, Target, Eye, Award } from 'lucide-react';
import { PublicLayout } from '../../../widgets';

export default function AboutPage() {
  const stats = [
    {
      icon: Users,
      value: '100+',
      label: 'Editorial Clients',
    },
    {
      icon: FileText,
      value: '500+',
      label: 'Articles Published',
    },
    {
      icon: Heart,
      value: '99.9%',
      label: 'Platform Uptime',
    },
    {
      icon: Clock,
      value: '24/7',
      label: 'Dedicated Support',
    },
  ];

  const values = [
    {
      icon: Target,
      title: 'Our Mission',
      description: 'Empower creators and organizations with focused, reliable tools to publish impactful long-form content.',
    },
    {
      icon: Eye,
      title: 'Our Vision',
      description: 'Create a calmer, more thoughtful digital ecosystem where high-quality ideas reach the audiences they deserve.',
    },
    {
      icon: Award,
      title: 'Our Values',
      description: 'Quality craft, editorial integrity, and uncompromising performance guide every line of code we ship.',
    },
  ];

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'Founder & Editor-in-Chief',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    },
    {
      name: 'Michael Chen',
      role: 'Head of Engineering',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    },
    {
      name: 'Emily Davis',
      role: 'Content Director',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80',
    },
    {
      name: 'David Kim',
      role: 'Lead Product Designer',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    },
  ];

  return (
    <PublicLayout>
      {/* Editorial Header */}
      <section className="bg-slate-50/70 py-16 sm:py-24 border-b border-slate-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-600 text-xs font-medium mb-4 shadow-xs">
            <span>About Magentagrid</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-5 leading-tight">
            We help thoughtful ideas travel farther.
          </h1>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto font-normal">
            Magentagrid is a modern, lightweight content management platform built to help editors, writers, and businesses publish stories with precision and craft.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-14 sm:py-16 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-xl p-5 sm:p-6 text-left border border-slate-200/80 shadow-xs"
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center mb-4 border border-slate-200/60">
                    <Icon className="w-4 h-4 stroke-[1.75]" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-1">
                    {item.value}
                  </div>
                  <div className="text-xs sm:text-sm text-slate-500 font-medium">
                    {item.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 sm:py-20 bg-slate-50/70 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
              Core Principles
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              What Drives Our Platform
            </h2>
            <p className="text-slate-500 text-sm mt-2 leading-relaxed">
              Our principles shape every feature we build, every interface we design, and every article we publish.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {values.map((v, idx) => {
              const Icon = v.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200/80 shadow-xs"
                >
                  <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center mb-5 border border-slate-200/60">
                    <Icon className="w-4 h-4 stroke-[1.75]" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">{v.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{v.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 sm:py-20 bg-white flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
              The People
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Editorial &amp; Engineering Team
            </h2>
            <p className="text-slate-500 text-sm mt-2 leading-relaxed">
              Passionate professionals committed to exceptional publishing craft and editorial performance.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 sm:gap-6">
            {team.map((member, idx) => (
              <div key={idx} className="group">
                <div className="aspect-[4/5] rounded-xl overflow-hidden bg-slate-100 mb-3 border border-slate-200/80 shadow-xs">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-102"
                  />
                </div>
                <h4 className="text-sm font-semibold text-slate-900">{member.name}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
