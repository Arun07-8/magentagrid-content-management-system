interface LogoProps {
  className?: string;
  imageClassName?: string;
  textClassName?: string;
  variant?: 'light' | 'dark';
  showText?: boolean;
}

export function Logo({
  className = '',
  imageClassName,
  textClassName,
  variant = 'dark',
  showText = true,
}: LogoProps) {
  const isLight = variant === 'light';
  
  // Smart default font sizing if not explicitly provided
  const resolvedTextSize =
    textClassName ||
    (imageClassName?.includes('h-7') || imageClassName?.includes('h-8')
      ? 'text-lg sm:text-xl'
      : imageClassName?.includes('h-12') || imageClassName?.includes('h-14')
      ? 'text-2xl sm:text-3xl'
      : 'text-xl sm:text-2xl');

  return (
    <div className={`inline-flex items-center gap-2 sm:gap-2.5 select-none ${className}`}>
      <img
        src="/logo/logo.png"
        alt="CMS Logo"
        className={`w-auto object-contain flex-shrink-0 ${imageClassName || 'h-9 sm:h-10'}`}
      />
      {showText && (
        <span
          className={`brand-logo-text uppercase leading-none tracking-tight ${resolvedTextSize} ${
            isLight ? 'text-white' : 'text-zinc-950'
          }`}
        >
          CMS
        </span>
      )}
    </div>
  );
}
