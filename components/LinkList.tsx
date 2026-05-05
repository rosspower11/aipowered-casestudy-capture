'use client';

import { useEffect } from 'react';

export function LinkList({
  links,
  onChange,
}: {
  links: string[];
  onChange: (v: string[]) => void;
}) {
  useEffect(() => {
    if (links.length === 0) onChange(['']);
  }, [links, onChange]);

  const update = (i: number, v: string) => {
    const next = [...links];
    next[i] = v;
    onChange(next);
  };

  const remove = (i: number) => {
    const next = links.filter((_, idx) => idx !== i);
    onChange(next.length === 0 ? [''] : next);
  };

  const add = () => onChange([...links, '']);

  return (
    <div className="flex flex-col gap-3">
      {links.map((l, i) => (
        <div key={i} className="flex items-center gap-3 border-b border-line pb-2">
          <input
            type="url"
            value={l}
            onChange={(e) => update(i, e.target.value)}
            placeholder="https://"
            className="flex-1 bg-transparent text-bone text-[16px] tracking-tight placeholder:text-cloud focus:outline-none"
          />
          {links.length > 1 ? (
            <button
              type="button"
              onClick={() => remove(i)}
              className="text-[12px] uppercase tracking-widest text-cloud hover:text-bone transition-colors"
            >
              Remove
            </button>
          ) : null}
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="self-start text-[12px] uppercase tracking-widest text-cloud hover:text-bone transition-colors mt-1"
      >
        + Add another link
      </button>
    </div>
  );
}
