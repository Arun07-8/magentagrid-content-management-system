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
      'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950/20 focus-visible:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-[0.99]';

    const sizeClasses = {
      sm: 'px-2.5 py-1 text-xs gap-1.5 h-8',
      md: 'px-3.5 py-2 text-sm gap-2 h-9',
      lg: 'px-5 py-2.5 text-sm font-medium gap-2 h-10',
    };

    const variantClasses = {
      primary:
        'bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-900 shadow-xs hover:border-zinc-800',
      secondary:
        'bg-white hover:bg-zinc-50 text-zinc-900 border border-zinc-200/90 shadow-xs hover:border-zinc-300',
      outline:
        'bg-transparent hover:bg-zinc-50 border border-zinc-200 text-zinc-700 hover:text-zinc-900 hover:border-zinc-300',
      danger:
        'bg-rose-600 hover:bg-rose-700 text-white border border-rose-600 shadow-xs focus-visible:ring-rose-500/20',
      ghost:
        'bg-transparent hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900',
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

