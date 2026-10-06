import React from 'react';

export interface FormTextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  label: string;
  value?: string;
  onChange: (val: string) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
}

export function FormTextarea({
  label,
  value = '',
  onChange,
  placeholder,
  rows = 3,
  className = '',
  ...props
}: FormTextareaProps) {
  return (
    <div className={`space-y-1 ${className}`}>
      <label className="text-[11px] font-bold text-zinc-700 uppercase tracking-wider font-mono">
        {label}
      </label>
      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200/90 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-zinc-950 focus:bg-white transition font-medium shadow-2xs resize-none"
        {...props}
      />
    </div>
  );
}
