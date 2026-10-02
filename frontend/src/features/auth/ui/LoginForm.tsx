import { useState } from 'react';
import { User, Lock, Eye, EyeOff, ArrowRight, AlertCircle, Loader2, Info, Sparkles } from 'lucide-react';
import { useAuth } from '../model/useAuth';

export function LoginForm() {
  const { login, isLoading, error } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [localError, setLocalError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setInfoMessage(null);

    const identifier = usernameOrEmail.trim();
    if (!identifier || !password) {
      setLocalError('Please fill in both admin username and password.');
      return;
    }

    // Automatically resolve admin username or email for seamless authentication
    const emailToSubmit = identifier.includes('@')
      ? identifier
      : identifier.toLowerCase() === 'admin'
        ? 'admin@example.com'
        : identifier.toLowerCase() === 'editor'
          ? 'editor@example.com'
          : `${identifier}@example.com`;

    try {
      await login({ email: emailToSubmit, password });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Login failed. Please check your credentials.';
      setLocalError(message);
    }
  };

  const fillDemoCredentials = () => {
    setUsernameOrEmail('admin');
    setPassword('password123');
    setLocalError(null);
    setInfoMessage('Demo credentials filled: "admin" / "password123". Click Login to enter.');
  };

  const displayedError = localError || (error?.message ? String(error.message) : null);

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col justify-center">
      {/* Title & Subtitle */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
          Welcome Back
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 font-normal mt-1.5">
          Sign in to your admin account to continue
        </p>
      </div>

      {/* Quick Demo Helper Chip */}
      <div className="mb-5 flex items-center justify-between bg-purple-50/70 border border-purple-100 rounded-xl px-3 py-2 text-xs">
        <div className="flex items-center gap-1.5 text-[#6332ec] font-medium">
          <Sparkles className="w-3.5 h-3.5" />
          <span className="text-[11px]">Testing demo?</span>
        </div>
        <button
          type="button"
          onClick={fillDemoCredentials}
          className="text-[11px] font-semibold text-[#6332ec] hover:text-[#4d23c2] bg-white px-2 py-0.5 rounded-md border border-purple-200/80 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
        >
          Quick Fill Admin
        </button>
      </div>

      {/* Error Alert */}
      {displayedError && (
        <div className="mb-5 bg-rose-50 border border-rose-200 rounded-xl p-3 flex items-start gap-2.5 text-xs text-rose-700 animate-in fade-in shadow-xs">
          <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
          <p className="leading-snug">{displayedError}</p>
        </div>
      )}

      {/* Helper Info Message */}
      {infoMessage && (
        <div className="mb-5 bg-indigo-50 border border-indigo-200/80 rounded-xl p-3 flex items-start gap-2.5 text-xs text-indigo-800 animate-in fade-in shadow-xs">
          <Info className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="leading-snug">{infoMessage}</p>
          </div>
          <button
            type="button"
            onClick={() => setInfoMessage(null)}
            className="text-indigo-400 hover:text-indigo-600 text-xs font-bold"
          >
            ✕
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Admin Username Field */}
        <div>
          <div className="relative group">
            <input
              type="text"
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
              placeholder="Admin Username"
              required
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50/70 hover:bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#6332ec] focus:ring-4 focus:ring-[#6332ec]/12 transition-all font-medium"
            />
            <User className="w-4 h-4 text-slate-400 group-focus-within:text-[#6332ec] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors stroke-[2]" />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <div className="relative group">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full pl-11 pr-11 py-2.5 bg-slate-50/70 hover:bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#6332ec] focus:ring-4 focus:ring-[#6332ec]/12 transition-all font-medium"
            />
            <Lock className="w-4 h-4 text-slate-400 group-focus-within:text-[#6332ec] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors stroke-[2]" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="p-1 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 focus:outline-none cursor-pointer rounded"
              aria-label="Toggle password visibility"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4 stroke-[2]" />
              ) : (
                <Eye className="w-4 h-4 stroke-[2]" />
              )}
            </button>
          </div>
        </div>

        {/* Remember me & Forgot password */}
        <div className="flex items-center justify-between text-xs pt-0.5 select-none">
          <label className="flex items-center gap-2 cursor-pointer text-slate-600 font-medium">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded text-[#6332ec] focus:ring-[#6332ec] border-slate-300 accent-[#6332ec] cursor-pointer"
            />
            <span>Remember me</span>
          </label>

          <button
            type="button"
            onClick={() =>
              setInfoMessage(
                'Default Admin credentials: Username: "admin" (or "admin@example.com") with password: "password123"'
              )
            }
            className="text-xs font-semibold text-[#6332ec] hover:text-[#5024cf] hover:underline cursor-pointer"
          >
            Forgot password?
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="group w-full mt-2 py-3 px-6 bg-gradient-to-r from-[#6332ec] via-[#6d3cf2] to-[#794df7] hover:from-[#5425db] hover:to-[#6a3de8] active:translate-y-0 text-white font-semibold text-sm rounded-xl shadow-md shadow-[#6332ec]/30 hover:shadow-lg hover:shadow-[#6332ec]/40 flex items-center justify-center gap-2 transition-all duration-150 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed hover:-translate-y-0.5"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Signing in...</span>
            </>
          ) : (
            <>
              <span>Login</span>
              <ArrowRight className="w-4 h-4 stroke-[2.2] transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </button>
      </form>

      {/* Need help divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200/80" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-white px-3 text-slate-400 font-normal">Need help?</span>
        </div>
      </div>

      {/* Get help signed in */}
      <div className="text-center">
        <button
          type="button"
          onClick={() =>
            setInfoMessage(
              'Sign in with username "admin" and password "password123" to access the CMS.'
            )
          }
          className="text-xs sm:text-sm font-semibold text-[#6332ec] hover:text-[#5024cf] hover:underline cursor-pointer"
        >
          Get help signed in.
        </button>
      </div>

      {/* Footer Terms & Privacy */}
      <div className="text-center text-[11px] text-slate-400 mt-6 space-x-1.5 select-none">
        <a href="#terms" className="hover:text-slate-600 transition-colors">
          Terms of use
        </a>
        <span>•</span>
        <a href="#privacy" className="hover:text-slate-600 transition-colors">
          Privacy policy
        </a>
      </div>
    </div>
  );
}
