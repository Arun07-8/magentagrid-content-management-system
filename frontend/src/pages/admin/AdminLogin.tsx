import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle2, AlertCircle, Loader2, UserCheck } from 'lucide-react';
import { useAuth } from '../../features/auth/hooks/useAuth';

export default function AdminLogin() {
  const { login, isLoading, error } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('password123');
  const [rememberMe, setRememberMe] = useState(true);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!email.trim() || !password) {
      setLocalError('Please fill in both email and password.');
      return;
    }

    try {
      await login({ email: email.trim(), password });
    } catch (err: any) {
      setLocalError(err.message || 'Login failed. Please check your credentials.');
    }
  };

  const handleSelectRole = (userEmail: string) => {
    setEmail(userEmail);
    setPassword('password123');
    setLocalError(null);
  };

  const features = [
    'Role-based permissions (Admin & Editor)',
    'Real-time live synchronization',
    'Draft and Publish workflow',
    'Multi-device responsive preview',
  ];

  const displayedError = localError || (error?.message ? String(error.message) : null);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">
      {/* Left Column: Dark Branding & Showcase */}
      <div className="lg:w-1/2 bg-[#0c1524] text-white p-8 sm:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="my-10 lg:my-0 relative z-10 max-w-md">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-3">
            Welcome Back
          </h1>
          <p className="text-slate-400 text-sm sm:text-base mb-8">
            Sign in to your CMS account
          </p>

          <div className="space-y-3.5 mb-10">
            {features.map((feat, idx) => (
              <div key={idx} className="flex items-center gap-3 text-sm text-slate-300">
                <div className="w-5 h-5 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span>{feat}</span>
              </div>
            ))}
          </div>

          <div className="rounded-xl overflow-hidden border border-slate-800 shadow-2xl relative aspect-[16/9] bg-slate-900">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80"
              alt="Magentagrid Workspace"
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
          </div>
        </div>

        <div className="text-xs text-slate-500 relative z-10 pt-6 border-t border-slate-800/60 flex items-center justify-between">
          <p>Magentagrid Technologies</p>
          <p className="text-[11px] text-slate-500">CMS Admin Panel</p>
        </div>
      </div>

      {/* Right Column: Sign In Form */}
      <div className="lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16 bg-slate-50/50">
        <div className="w-full max-w-md bg-white rounded-2xl p-8 sm:p-10 shadow-xl shadow-slate-200/50 border border-slate-100">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center mx-auto mb-4 shadow-md shadow-blue-600/30">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6 transform -translate-y-0.5"
              >
                <path d="M4 19V7l8 8 8-8v12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">CMS Login</h2>
            <p className="text-sm text-slate-500 mt-1">
              Select a test role or enter credentials to continue.
            </p>
          </div>

          {/* Quick Role Fill Buttons */}
          <div className="mb-6 p-3 bg-slate-50 rounded-xl border border-slate-200/70 space-y-2">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Quick Test Accounts:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleSelectRole('admin@example.com')}
                className={`py-2 px-2.5 rounded-lg text-xs font-semibold border transition-all text-left flex items-center justify-between cursor-pointer ${
                  email === 'admin@example.com'
                    ? 'bg-blue-50 border-blue-300 text-blue-700 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div>
                  <p className="font-bold">Admin</p>
                  <p className="text-[10px] text-slate-400">Full Access</p>
                </div>
                <UserCheck className="w-4 h-4 opacity-60" />
              </button>

              <button
                type="button"
                onClick={() => handleSelectRole('editor@example.com')}
                className={`py-2 px-2.5 rounded-lg text-xs font-semibold border transition-all text-left flex items-center justify-between cursor-pointer ${
                  email === 'editor@example.com'
                    ? 'bg-blue-50 border-blue-300 text-blue-700 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div>
                  <p className="font-bold">Editor</p>
                  <p className="text-[10px] text-slate-400">Drafts Only</p>
                </div>
                <UserCheck className="w-4 h-4 opacity-60" />
              </button>
            </div>
          </div>

          {/* Error Banner */}
          {displayedError && (
            <div className="mb-5 bg-red-50 border border-red-200 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-red-600 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <p>{displayedError}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                />
                <span>Remember me</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-xl shadow-md shadow-blue-600/25 flex items-center justify-center gap-2 transition-all duration-150 hover:-translate-y-0.5 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
