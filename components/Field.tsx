'use client';

import { ReactNode } from 'react';

export function Field({
  label,
  hint,
  children,
}: {
  label?: string;
  hint?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      {label ? (
        <label className="text-[12px] tracking-widest uppercase text-cloud">{label}</label>
      ) : null}
      {children}
      {hint ? <p className="text-[13px] text-cloud leading-relaxed">{hint}</p> : null}
    </div>
  );
}

export function TextInput({
  value,
  onChange,
  placeholder,
  type = 'text',
  autoFocus,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  autoFocus?: boolean;
}) {
  return (
    <input
      autoFocus={autoFocus}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-transparent border-b border-line text-bone text-[24px] sm:text-[28px] tracking-tight pb-3 placeholder:text-cloud focus:border-bone focus:outline-none transition-colors"
    />
  );
}

export function Textarea({
  value,
  onChange,
  placeholder,
  autoFocus,
  rows = 5,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  rows?: number;
}) {
  return (
    <textarea
      autoFocus={autoFocus}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full bg-transparent border-b border-line text-bone text-[18px] sm:text-[20px] leading-relaxed tracking-tight pb-3 placeholder:text-cloud focus:border-bone focus:outline-none transition-colors"
    />
  );
}

export function YesNo({
  value,
  onChange,
}: {
  value: 'Yes' | 'No' | '';
  onChange: (v: 'Yes' | 'No') => void;
}) {
  return (
    <div className="flex gap-3 mt-2">
      {(['Yes', 'No'] as const).map((opt) => {
        const selected = value === opt;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`px-6 py-3 text-[14px] tracking-tight border transition-colors ${
              selected
                ? 'bg-bone text-ink border-bone'
                : 'bg-transparent text-bone border-line hover:border-bone'
            }`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}
