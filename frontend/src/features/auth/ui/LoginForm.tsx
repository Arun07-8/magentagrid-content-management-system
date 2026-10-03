import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../model/useAuth';
import { toast } from '../../../store/toast';

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
      errors.email = 'Valid email is required';
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
      toast.success('Signed in successfully!');
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Login failed. Please check your credentials.';
      setLocalError(message);
      toast.error(message);
    }
  };

  const displayedError = localError || (error?.message ? String(error.message) : null);

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 tracking-tight mb-2">
          Admin Sign In
        </h1>
        <p className="text-sm font-medium text-zinc-500">
          Enter your credentials to access the workspace.
        </p>
      </div>

      {displayedError && (
        <div className="mb-6 p-3 bg-red-50 text-red-700 text-sm font-medium rounded-[4px] border border-red-100">
          {displayedError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div>
          <label className="block text-[13px] font-semibold text-zinc-900 mb-2">
            Email address
          </label>
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: undefined }));
              }}
              placeholder="name@example.com"
              autoComplete="email"
              className={`w-full h-11 pl-10 pr-4 bg-zinc-50 border rounded-[6px] text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:bg-white transition-all font-medium ${
                fieldErrors.email
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : 'border-zinc-200 focus:border-zinc-400 focus:ring-zinc-400'
              }`}
            />
            <Mail
              className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors ${
                fieldErrors.email ? 'text-red-400' : 'text-zinc-400'
              }`}
            />
          </div>
          {fieldErrors.email && (
            <p className="mt-1.5 text-xs font-medium text-red-600">{fieldErrors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-[13px] font-semibold text-zinc-900 mb-2">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: undefined }));
              }}
              placeholder="••••••••"
              className={`w-full h-11 pl-10 pr-10 bg-zinc-50 border rounded-[6px] text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:bg-white transition-all font-medium ${
                fieldErrors.password
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : 'border-zinc-200 focus:border-zinc-400 focus:ring-zinc-400'
              }`}
            />
            <Lock
              className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors ${
                fieldErrors.password ? 'text-red-400' : 'text-zinc-400'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors focus:outline-none"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {fieldErrors.password && (
            <p className="mt-1.5 text-xs font-medium text-red-600">{fieldErrors.password}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-11 mt-2 bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-sm rounded-[6px] flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Signing in...</span>
            </>
          ) : (
            <span>Sign In</span>
          )}
        </button>
      </form>
    </div>
  );
}
