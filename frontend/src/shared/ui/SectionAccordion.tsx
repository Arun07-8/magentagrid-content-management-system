import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

export interface SectionAccordionProps {
  title: string;
  subtitle: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  badge?: string;
  className?: string;
}

export function SectionAccordion({
  title,
  subtitle,
  isOpen,
  onToggle,
  children,
  badge,
  className = '',
}: SectionAccordionProps) {
  return (
    <div className={`rounded-2xl border border-zinc-200/90 overflow-hidden bg-white shadow-2xs transition-all ${className}`}>
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-zinc-50/80 transition cursor-pointer"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`w-7 h-7 rounded-xl flex items-center justify-center transition-colors shrink-0 ${
              isOpen ? 'bg-amber-100 text-amber-900' : 'bg-zinc-100 text-zinc-500'
            }`}
          >
            {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-zinc-950 font-['Plus_Jakarta_Sans'] truncate">{title}</h3>
            <p className="text-[11px] text-zinc-400 font-normal leading-tight truncate">{subtitle}</p>
          </div>
        </div>

        <span className="text-xs font-semibold text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-md shrink-0 ml-2">
          {badge || (isOpen ? 'Collapse' : 'Configure')}
        </span>
      </button>

      {isOpen && <div className="p-4 pt-2 border-t border-zinc-100 bg-white">{children}</div>}
    </div>
  );
}
