import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral';
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({
  children,
  variant = 'neutral',
  size = 'sm',
  className = '',
}: BadgeProps) {
  const variantStyles = {
    primary: 'bg-zinc-100 text-zinc-900 border-zinc-200 font-medium',
    success: 'bg-emerald-50 text-emerald-800 border-emerald-200/80 font-medium',
    warning: 'bg-amber-50 text-amber-800 border-amber-200/80 font-medium',
    danger: 'bg-rose-50 text-rose-800 border-rose-200/80 font-medium',
    neutral: 'bg-zinc-100/70 text-zinc-700 border-zinc-200/70 font-medium',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 tracking-tight',
    md: 'text-xs px-2.5 py-1 tracking-tight',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 border rounded-md select-none font-sans ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
