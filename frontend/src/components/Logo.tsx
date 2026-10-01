interface LogoProps {
  variant?: 'light' | 'dark'
  className?: string
}

export function Logo({ variant = 'dark', className = '' }: LogoProps) {
  const isDark = variant === 'dark' // dark variant = for light backgrounds (dark text)

  return (
    <div className={`flex items-center gap-2.5 font-sans select-none ${className}`}>
      {/* Stylized 'M' badge icon */}
      <div className="relative w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm overflow-hidden flex-shrink-0">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5 text-white transform -translate-y-0.5"
        >
          <path d="M4 19V7l8 8 8-8v12" />
        </svg>
      </div>

      {/* Brand Text */}
      <div className="flex items-baseline tracking-tight">
        <span className={`text-xl font-bold ${isDark ? 'text-slate-900' : 'text-white'}`}>
          Magenta
        </span>
        <span className={`text-xl font-medium ${isDark ? 'text-slate-800' : 'text-slate-200'}`}>
          grid
        </span>
      </div>
    </div>
  )
}
