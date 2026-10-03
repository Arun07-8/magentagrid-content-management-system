interface LogoProps {
  variant?: 'light' | 'dark';
  className?: string;
}

export function Logo({ variant = 'dark', className = '' }: LogoProps) {
  const isDark = variant === 'dark';

  return (
    <div className={`flex items-center gap-2.5 font-sans select-none ${className}`}>
      {/* Refined Brand Mark */}
      <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 shadow-xs border transition-transform ${
        isDark 
          ? 'bg-zinc-900 text-white border-zinc-950' 
          : 'bg-white text-zinc-950 border-white'
      }`}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-3.5 h-3.5"
        >
          <rect width="18" height="18" x="3" y="3" rx="2" />
          <path d="M3 9h18" />
          <path d="M9 21V9" />
        </svg>
      </div>

      <div className="flex items-baseline tracking-tight">
        <span className={`text-base font-bold tracking-tight ${isDark ? 'text-zinc-900' : 'text-white'}`}>
          CMS
        </span>
      </div>
    </div>
  );
}
