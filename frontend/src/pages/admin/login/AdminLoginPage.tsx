import { Link } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';
import { LoginForm } from '../../../features/auth';
import { Logo } from '../../../shared/ui';

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-[#f8f9fd] relative flex flex-col justify-between items-center p-4 sm:p-6 lg:p-8 selection:bg-[#6332ec]/20 selection:text-[#6332ec] overflow-hidden">
      {/* Background Decorative Mesh & Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#e0e7ff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-60" />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-200/40 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar on Login Page */}
      <div className="w-full max-w-4xl lg:max-w-[940px] flex items-center justify-between py-2 relative z-10">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors py-1.5 px-3 rounded-lg hover:bg-white/80 border border-transparent hover:border-slate-200/60"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Magentagrid</span>
        </Link>

        <div className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-500 bg-white/80 border border-slate-200/70 px-3 py-1 rounded-full shadow-xs">
          <Shield className="w-3.5 h-3.5 text-emerald-600" />
          <span>256-bit Encrypted Session</span>
        </div>
      </div>

      {/* Centered Main Login Card */}
      <div className="my-auto w-full max-w-4xl lg:max-w-[940px] bg-white rounded-3xl sm:rounded-[28px] shadow-[0_25px_60px_-15px_rgba(99,102,241,0.12),0_10px_25px_-5px_rgba(0,0,0,0.04)] border border-slate-200/80 overflow-hidden flex flex-col md:flex-row relative z-10">
        {/* Subtle top hairline accent */}
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#6332ec]/50 to-transparent pointer-events-none" />

        {/* Left column: Illustration & Brand Showcase */}
        <div className="md:w-1/2 bg-gradient-to-br from-[#f8faff] via-[#f3f5fe] to-[#edf1fe] p-8 sm:p-10 flex flex-col justify-between items-center text-center border-b md:border-b-0 md:border-r border-slate-100 relative overflow-hidden">
          {/* Brand Logo at top */}
          <div className="w-full flex justify-start mb-4">
            <Logo variant="dark" />
          </div>

          {/* Clean 3D Illustration */}
          <div className="my-auto py-2">
            <img
              src="/admin-login-illustration.png"
              alt="Admin Login Security Illustration"
              className="w-full max-w-[320px] h-auto object-contain rounded-2xl shadow-sm transition-transform duration-300 hover:scale-[1.02] select-none"
            />
          </div>

          {/* Bottom Security Highlights */}
          <div className="w-full pt-4 mt-2 border-t border-indigo-100/60 flex flex-col items-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-indigo-100 text-[#6332ec] text-[11px] font-semibold shadow-xs mb-1.5">
              <span>Admin Portal Access</span>
            </div>
            <p className="text-[11px] text-slate-500 max-w-xs leading-relaxed">
              Protected authentication for authorized publishers and content managers.
            </p>
          </div>
        </div>

        {/* Right column: Login Form */}
        <div className="md:w-1/2 p-8 sm:p-10 lg:p-12 flex flex-col justify-center bg-white">
          <LoginForm />
        </div>
      </div>

      {/* Bottom Mini Footer */}
      <div className="w-full max-w-4xl lg:max-w-[940px] text-center py-2 text-[11px] text-slate-400 relative z-10">
        <p>© 2025 Magentagrid CMS. All rights reserved.</p>
      </div>
    </div>
  );
}

export const LoginPage = AdminLoginPage;

