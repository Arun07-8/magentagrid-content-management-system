import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from './Button';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
  action?: React.ReactNode;
}

export function ErrorState({
  title = 'Something went wrong',
  message,
  onRetry,
  className = '',
  action,
}: ErrorStateProps) {
  return (
    <div
      className={`py-12 px-6 text-center space-y-3 bg-white rounded-xl border border-rose-200/80 shadow-xs ${className}`}
    >
      <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-100">
        <AlertCircle className="w-5 h-5 stroke-[1.75]" />
      </div>
      <div>
        <h3 className="text-sm sm:text-base font-semibold text-slate-900">{title}</h3>
        {message && <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">{message}</p>}
      </div>
      {onRetry && (
        <div className="pt-2">
          <Button variant="secondary" size="sm" onClick={onRetry}>
            Try again
          </Button>
        </div>
      )}
      {action && <div className="pt-2">{action}</div>}
    </div>
  );
}
