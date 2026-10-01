import { Users, FileText, Heart, Clock, Target, Eye, Award } from 'lucide-react'
import { Navbar } from '../../components/Navbar'
import { Footer } from '../../components/Footer'

export default function About() {
  const stats = [
    {
      icon: Users,
      value: '100+',
      label: 'Happy Clients',
    },
    {
      icon: FileText,
      value: '500+',
      label: 'Articles Published',
    },
    {
      icon: Heart,
      value: '99.9%',
      label: 'Uptime',
    },
    {
      icon: Clock,
      value: '24/7',
      label: 'Support',
    },
  ]

  const values = [
    {
      icon: Target,
      title: 'Our Mission',
      description: 'Empower people with the right tools to create, manage and share amazing content.',
    },
    {
      icon: Eye,
      title: 'Our Vision',
      description: 'Build a connected world through meaningful stories and ideas.',
    },
    {
      icon: Award,
      title: 'Our Values',
      description: 'Innovation, simplicity, collaboration and impact.',
    },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-[#162736] text-white py-16 sm:py-20 lg:py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Story Text */}
            <div className="lg:col-span-7">
              <span className="inline-block text-xs font-semibold tracking-widest text-blue-400 uppercase mb-3">
                ABOUT US
              </span>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-6">
                Our Story
              </h1>
              <p className="text-slate-300 text-sm sm:text-base lg:text-lg leading-relaxed max-w-xl">
                We are a team of passionate creators, developers and storytellers who believe in the
                power of great content. We built Magentagrid to share knowledge, ideas and
                inspiration with the world.
              </p>
            </div>

            {/* Right Image Banner */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-700/50 bg-slate-800">
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1000&q=80"
                  alt="Our Story workspace"
                  className="w-full h-64 sm:h-72 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who We Are Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Office/Workspace Image */}
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-100 aspect-[4/3] bg-slate-100">
                <img
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80"
                  alt="Modern office workspace"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Right: Content & Mission/Vision/Values */}
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-4">
                  Who We Are
                </h2>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  Magentagrid is a modern content platform designed to help businesses, creators and
                  teams share their stories. Our mission is to make content management simple, fast
                  and effective.
                </p>
              </div>

              {/* 3 Icon Feature items */}
              <div className="space-y-5 pt-4">
                {values.map((item, index) => {
                  const Icon = item.icon
                  return (
                    <div key={index} className="flex items-start gap-4">
                      <div className="w-11 h-11 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-900 mb-1">{item.title}</h3>
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-slate-50/70 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div
                  key={index}
                  className="flex flex-col items-center text-center p-6 bg-white rounded-xl border border-slate-100 shadow-xs hover:shadow-md hover:border-slate-200 transition-all duration-200"
                >
                  <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-1">
                    {stat.value}
                  </span>
                  <span className="text-xs sm:text-sm font-medium text-slate-500">
                    {stat.label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
