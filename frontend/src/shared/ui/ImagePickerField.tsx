import React from 'react';
import { Upload, Trash2 } from 'lucide-react';

export interface ImagePickerFieldProps {
  label: string;
  value?: string;
  onChange: (val: string) => void;
  onUploadClick: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove?: () => void;
  className?: string;
  placeholder?: string;
}

export function ImagePickerField({
  label,
  value = '',
  onChange,
  onUploadClick,
  onRemove,
  className = '',
  placeholder = 'https://example.com/image.jpg',
}: ImagePickerFieldProps) {
  const safeVal = value || '';

  return (
    <div className={`space-y-1.5 ${className}`}>
      <label className="text-[11px] font-bold text-zinc-700 uppercase tracking-wider font-mono">
        {label}
      </label>
      <div className="flex items-center gap-3">
        {safeVal ? (
          <div className="relative w-14 h-14 rounded-xl border border-zinc-200 overflow-hidden bg-zinc-100 shrink-0 group">
            <img src={safeVal} alt="Preview" className="w-full h-full object-cover" />
            {onRemove && (
              <button
                type="button"
                onClick={onRemove}
                className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                title="Remove image"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ) : (
          <div className="w-14 h-14 rounded-xl border border-dashed border-zinc-300 flex items-center justify-center text-zinc-400 text-[10px] shrink-0 font-mono">
            No image
          </div>
        )}

        <div className="flex-1 space-y-1.5 min-w-0">
          <input
            type="text"
            value={safeVal}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full px-2.5 py-1.5 bg-zinc-50 border border-zinc-200 rounded-lg text-xs text-zinc-900 focus:outline-none focus:border-zinc-950 font-medium"
          />
          <label className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-[11px] font-bold cursor-pointer transition">
            <Upload className="w-3 h-3 shrink-0" />
            <span>Upload Image</span>
            <input type="file" accept="image/*" onChange={onUploadClick} className="hidden" />
          </label>
        </div>
      </div>
    </div>
  );
}
