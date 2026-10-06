import React from 'react';

export interface FormInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label: string;
  value?: string;
  onChange: (val: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function FormInput({
  label,
  value = '',
  onChange,
  placeholder,
  disabled,
  className = '',
  ...props
}: FormInputProps) {
  return (
    <div className={`space-y-1 ${className}`}>
      <label className="text-[11px] font-bold text-zinc-700 uppercase tracking-wider font-mono">
        {label}
      </label>
      <input
        type="text"
        disabled={disabled}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200/90 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-zinc-950 focus:bg-white transition disabled:opacity-50 font-medium shadow-2xs"
        {...props}
      />
    </div>
  );
}

export const FormField = FormInput;
export const InputField = FormInput;

