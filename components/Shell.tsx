'use client';

import { ReactNode } from 'react';
import { Logo } from './Logo';

export function Shell({
  children,
  step,
  total,
}: {
  children: ReactNode;
  step?: number;
  total?: number;
}) {
  const pct = step && total ? Math.round((step / total) * 100) : 0;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center justify-between px-6 sm:px-10 py-6 border-b border-line">
        <Logo />
        {step && total ? (
          <div className="flex items-center gap-3 text-[12px] tracking-widest uppercase text-cloud">
            <span>{String(step).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
            <div className="h-[2px] w-32 bg-line overflow-hidden">
              <div
                className="h-full bg-bone transition-[width] duration-500 ease-out"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        ) : (
          <span className="text-[12px] tracking-widest uppercase text-cloud">Case Study</span>
        )}
      </header>

      <main className="flex-1 flex items-start sm:items-center justify-center px-6 sm:px-10 py-10 sm:py-16">
        <div className="w-full max-w-3xl">{children}</div>
      </main>

      <footer className="px-6 sm:px-10 py-6 border-t border-line text-[11px] tracking-widest uppercase text-cloud flex items-center justify-between">
        <span>ai powered &copy; {new Date().getFullYear()}</span>
        <span>End of cohort feedback</span>
      </footer>
    </div>
  );
}
