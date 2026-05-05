'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost' | 'subtle';
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className = '', variant = 'primary', children, ...props },
  ref,
) {
  const base =
    'inline-flex items-center gap-2 px-5 py-3 text-[14px] tracking-tight font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed';

  const styles = {
    primary: 'bg-bone text-ink hover:bg-white',
    ghost: 'bg-transparent text-bone border border-line hover:border-bone',
    subtle: 'bg-transparent text-cloud hover:text-bone',
  }[variant];

  return (
    <button ref={ref} className={`${base} ${styles} ${className}`} {...props}>
      {children}
    </button>
  );
});
