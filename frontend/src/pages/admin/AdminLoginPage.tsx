import { Shield, FileText, Zap } from 'lucide-react';
import { LoginForm } from '../../features/auth';
import { Logo } from '../../shared/ui';

export default function AdminLoginPage() {
  const highlights = [
    { icon: FileText, text: 'Real-time publishing workflows' },
    { icon: Zap, text: 'Responsive multi-device preview' },
    { icon: Shield, text: 'Secure editorial access control' },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8">
      <main className="w-full max-w-[900px] bg-white rounded-lg shadow-sm border border-zinc-200 overflow-hidden flex flex-col md:flex-row">

        {/* Left column: Brand Narrative */}
        <div className="md:w-1/2 bg-zinc-50 border-r border-zinc-200 p-10 lg:p-14 flex flex-col justify-between">
          <div>
            <div className="mb-16">
              <Logo />
            </div>

            <div className="space-y-4">
              <span className="text-[12px] font-semibold text-zinc-500 uppercase tracking-widest">
                Workspace Entry
              </span>
              <h2 className="text-2xl sm:text-[28px] font-bold tracking-tight text-zinc-900 leading-[1.2]">
                Publishing infrastructure for professional teams.
              </h2>
              <p className="text-sm text-zinc-500 leading-relaxed max-w-sm mt-3">
                A content management environment designed for typography, clarity, and performance.
              </p>
            </div>
          </div>

          <div className="pt-12 mt-12 border-t border-zinc-200 space-y-4">
            {highlights.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="flex items-center gap-3 text-sm text-zinc-600">
                  <Icon className="w-4 h-4 text-zinc-400 flex-shrink-0" />
                  <span>{item.text}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right column: Login Form */}
        <div className="md:w-1/2 p-10 lg:p-14 flex flex-col justify-center bg-white">
          <LoginForm />
        </div>
      </main>

      <footer className="w-full max-w-[900px] text-center md:text-left py-8 text-xs font-medium text-zinc-400">
        <p>© {new Date().getFullYear()} CMS Platform. All rights reserved.</p>
      </footer>
    </div>
  );
}

export const LoginPage = AdminLoginPage;
