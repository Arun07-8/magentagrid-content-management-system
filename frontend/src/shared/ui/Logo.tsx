interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
}

export function Logo({ className = '' }: LogoProps) {
  return (
    <div className={`flex items-center ${className}`}>
      <img src="/logo/logo.png" alt="Logo" className="h-[44px] sm:h-12 w-auto object-contain" />
    </div>
  );
}
