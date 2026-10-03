import { CheckCircle2 } from 'lucide-react';
import { LoginForm } from '../../../features/auth';
import { Logo } from '../../../shared/ui';

export default function AdminLoginPage() {
  const highlights = [
    'Real-time editorial and draft management',
    'Multi-device responsive article preview',
    'Role-based publishing and access controls',
  ];

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col justify-between items-center p-4 sm:p-6 lg:p-8 select-none">

      {/* Centered Main Login Container */}
      <main className="my-auto w-full max-w-4xl bg-white rounded-2xl shadow-sm border border-zinc-200/90 overflow-hidden flex flex-col md:flex-row">
        {/* Left column: Brand Narrative & Key Capabilities */}
        <div className="md:w-5/12 bg-zinc-950 text-white p-8 sm:p-10 flex flex-col justify-between border-b md:border-b-0 md:border-r border-zinc-800">
          <div>
            <div className="mb-8">
              <Logo variant="light" />
            </div>

            <div className="space-y-3">
              <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                Editorial Suite
              </span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-snug">
                Publishing infrastructure crafted for thoughtful teams.
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 font-normal leading-relaxed pt-1">
                A focused content management platform with real-time editorial previews, instant drafts, and calm workflows.
              </p>
            </div>
          </div>

          <div className="pt-8 mt-6 border-t border-zinc-800/80 space-y-2.5">
            {highlights.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2.5 text-xs text-zinc-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right column: Login Form */}
        <div className="md:w-7/12 p-8 sm:p-10 lg:p-12 flex flex-col justify-center bg-white">
          <LoginForm />
        </div>
      </main>

      {/* Bottom Mini Footer */}
      <footer className="w-full max-w-4xl text-center py-2 text-xs text-zinc-400">
        <p>© {new Date().getFullYear()} CMS. All rights reserved.</p>
      </footer>
    </div>
  );
}

export const LoginPage = AdminLoginPage;
