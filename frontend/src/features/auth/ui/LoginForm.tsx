import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../model/useAuth';

export function LoginForm() {
  const { login, isLoading, error } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    const cleanEmail = email.trim();
    const errors: { email?: string; password?: string } = {};

    if (!cleanEmail) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!password) {
      errors.password = 'Password is required';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});

    try {
      await login({ email: cleanEmail, password });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Login failed. Please check your credentials.';
      setLocalError(message);
    }
  };

  const displayedError = localError || (error?.message ? String(error.message) : null);

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col justify-center">
      {/* Title & Subtitle */}
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
          Admin Sign In
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 font-normal mt-1">
          Enter your credentials to access the editorial dashboard.
        </p>
      </div>

      {/* Error Alert */}
      {displayedError && (
        <div className="mb-5 bg-rose-50 border border-rose-200 rounded-lg p-3 flex items-start gap-2.5 text-xs text-rose-700 animate-in fade-in shadow-xs">
          <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
          <p className="leading-snug">{displayedError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-2">
        {/* Email Field */}
        <div>
          <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1.5">
            Email <span className="text-rose-500">*</span>
          </label>
          <div className="relative group">
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (fieldErrors.email) {
                  setFieldErrors((prev) => ({ ...prev, email: undefined }));
                }
              }}
              placeholder="admin@example.com"
              autoComplete="email"
              className={`w-full pl-10 pr-3.5 py-2.5 bg-white border rounded-lg text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-1 transition-all font-medium ${
                fieldErrors.email
                  ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500 bg-rose-50/20'
                  : 'border-zinc-200 focus:border-zinc-900 focus:ring-zinc-900'
              }`}
            />
            <Mail
              className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none transition-colors stroke-[2] ${
                fieldErrors.email ? 'text-rose-400' : 'text-zinc-400 group-focus-within:text-zinc-900'
              }`}
            />
          </div>
          <div className="h-5 mt-1 flex items-center" aria-live="polite">
            {fieldErrors.email && (
              <p className="text-xs text-rose-600 font-medium flex items-center gap-1.5 leading-none animate-in fade-in">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{fieldErrors.email}</span>
              </p>
            )}
          </div>
        </div>

        {/* Password Field */}
        <div>
          <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1.5">
            Password <span className="text-rose-500">*</span>
          </label>
          <div className="relative group">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (fieldErrors.password) {
                  setFieldErrors((prev) => ({ ...prev, password: undefined }));
                }
              }}
              placeholder="Enter your password"
              className={`w-full pl-10 pr-10 py-2.5 bg-white border rounded-lg text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-1 transition-all font-medium ${fieldErrors.password
                ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500 bg-rose-50/20'
                : 'border-zinc-200 focus:border-zinc-900 focus:ring-zinc-900'
                }`}
            />
            <Lock
              className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none transition-colors stroke-[2] ${fieldErrors.password ? 'text-rose-400' : 'text-zinc-400 group-focus-within:text-zinc-900'
                }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="p-1 absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 focus:outline-none cursor-pointer rounded"
              aria-label="Toggle password visibility"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4 stroke-[2]" />
              ) : (
                <Eye className="w-4 h-4 stroke-[2]" />
              )}
            </button>
          </div>
          <div className="h-5 mt-1 flex items-center" aria-live="polite">
            {fieldErrors.password && (
              <p className="text-xs text-rose-600 font-medium flex items-center gap-1.5 leading-none animate-in fade-in">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{fieldErrors.password}</span>
              </p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="group w-full mt-0.5 py-2.5 px-4 bg-zinc-900 hover:bg-zinc-800 active:bg-zinc-950 text-white font-medium text-sm rounded-lg shadow-xs flex items-center justify-center gap-2 transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border border-zinc-900"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Signing in...</span>
            </>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4 stroke-[2] transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </button>
      </form>

    </div>
  );
}
