import React from 'react';
import { FileText } from 'lucide-react';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className = '',
}: EmptyStateProps) {
  return (
    <div
      className={`py-14 px-6 flex flex-col items-center justify-center text-center bg-white rounded-xl border border-zinc-200/80 shadow-xs ${className}`}
    >
      <div className="w-11 h-11 rounded-lg bg-zinc-100/80 text-zinc-500 flex items-center justify-center mb-3.5 border border-zinc-200/70">
        {icon || <FileText className="w-5 h-5 stroke-[1.75]" />}
      </div>
      <h3 className="text-sm sm:text-base font-semibold text-zinc-900 mb-1">{title}</h3>
      {description && (
        <p className="text-xs sm:text-sm text-zinc-500 max-w-sm mb-4 leading-relaxed">
          {description}
        </p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
}
