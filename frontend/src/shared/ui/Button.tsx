import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed';

    const sizeClasses = {
      sm: 'px-2.5 py-1 text-xs gap-1.5 h-8',
      md: 'px-3.5 py-2 text-sm gap-2 h-9.5',
      lg: 'px-5 py-2.5 text-sm sm:text-base gap-2.5 h-11',
    };

    const variantClasses = {
      primary:
        'bg-slate-900 hover:bg-slate-800 text-white shadow-xs focus-visible:ring-slate-900/20 active:translate-y-px',
      secondary:
        'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 shadow-xs hover:border-slate-300 hover:text-slate-900 active:translate-y-px',
      outline:
        'bg-transparent hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-900 hover:border-slate-300',
      danger:
        'bg-rose-600 hover:bg-rose-700 text-white shadow-xs focus-visible:ring-rose-500/20 active:translate-y-px',
      ghost:
        'bg-transparent hover:bg-slate-100/80 text-slate-600 hover:text-slate-900',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin text-current" />
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';

