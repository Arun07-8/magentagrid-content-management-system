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
    primary: 'bg-blue-50/80 text-blue-700 border-blue-200/70',
    success: 'bg-emerald-50/80 text-emerald-700 border-emerald-200/70',
    warning: 'bg-amber-50/80 text-amber-700 border-amber-200/70',
    danger: 'bg-rose-50/80 text-rose-700 border-rose-200/70',
    neutral: 'bg-slate-50 text-slate-600 border-slate-200/80',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 font-medium tracking-tight',
    md: 'text-xs px-2.5 py-1 font-medium tracking-tight',
  };

  return (
    <span
      className={`inline-flex items-center border rounded-md select-none ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
