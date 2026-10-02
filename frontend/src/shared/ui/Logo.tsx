interface LogoProps {
  variant?: 'light' | 'dark';
  className?: string;
}

export function Logo({ variant = 'dark', className = '' }: LogoProps) {
  const isDark = variant === 'dark';

  return (
    <div className={`flex items-center gap-2.5 font-sans select-none ${className}`}>
      {/* Refined Brand Mark */}
      <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 shadow-xs transition-transform ${
        isDark 
          ? 'bg-slate-900 text-white' 
          : 'bg-white text-slate-900'
      }`}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-3.5 h-3.5"
        >
          <path d="M4 19V7l8 8 8-8v12" />
        </svg>
      </div>

      <div className="flex items-baseline tracking-tight">
        <span className={`text-base font-bold tracking-tight ${isDark ? 'text-slate-900' : 'text-white'}`}>
          Magenta
        </span>
        <span className={`text-base font-medium tracking-tight ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          grid
        </span>
      </div>
    </div>
  );
}
