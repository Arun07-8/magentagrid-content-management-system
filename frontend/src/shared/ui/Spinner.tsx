import { Loader2 } from 'lucide-react';

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
  fullHeight?: boolean;
}

export function Spinner({
  size = 'md',
  text,
  className = '',
  fullHeight = false,
}: SpinnerProps) {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  const content = (
    <div className={`flex flex-col items-center justify-center gap-2 text-slate-400 ${className}`}>
      <Loader2 className={`${sizeMap[size]} animate-spin text-[#FCD06B]`} />
      {text && <p className="text-xs font-medium text-slate-500">{text}</p>}
    </div>
  );

  if (fullHeight) {
    return <div className="py-20 w-full flex items-center justify-center">{content}</div>;
  }

  return content;
}
