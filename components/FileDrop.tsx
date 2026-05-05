'use client';

import { useRef, useState } from 'react';

export type UploadedFile = {
  name: string;
  size: number;
  url: string;
};

export function FileDrop({
  files,
  onChange,
}: {
  files: UploadedFile[];
  onChange: (v: UploadedFile[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null);

  const handleFiles = async (chosen: FileList | null) => {
    if (!chosen || chosen.length === 0) return;
    setError(null);
    setBusy(true);

    const list = Array.from(chosen);
    const next: UploadedFile[] = [...files];

    try {
      for (let i = 0; i < list.length; i++) {
        const file = list[i];
        setProgress({ current: i + 1, total: list.length });

        if (file.size > 50 * 1024 * 1024) {
          throw new Error(`${file.name} is over 50MB`);
        }

        const fd = new FormData();
        fd.append('file', file);

        const res = await fetch('/api/upload', { method: 'POST', body: fd });
        if (!res.ok) {
          const { error: msg } = await res.json().catch(() => ({ error: 'Upload failed' }));
          throw new Error(msg || 'Upload failed');
        }
        const data = (await res.json()) as { url: string };
        next.push({ name: file.name, size: file.size, url: data.url });
      }
      onChange(next);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setBusy(false);
      setProgress(null);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={busy}
        className="border border-dashed border-line hover:border-bone transition-colors text-cloud hover:text-bone py-10 px-6 text-center"
      >
        <div className="text-[14px] tracking-tight">
          {busy
            ? `Uploading ${progress ? `${progress.current} / ${progress.total}` : '...'}`
            : 'Click to upload files'}
        </div>
        <div className="text-[12px] tracking-widest uppercase text-cloud mt-1">
          PDF, DOCX, PNG, JPG, MP4 — up to 50MB each
        </div>
      </button>
      <input
        ref={inputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {error ? <p className="text-[13px] text-red-400">{error}</p> : null}

      {files.length > 0 ? (
        <ul className="flex flex-col gap-2 mt-1">
          {files.map((f, i) => (
            <li
              key={`${f.url}-${i}`}
              className="flex items-center justify-between border-b border-line pb-2"
            >
              <span className="text-[14px] tracking-tight text-bone truncate pr-3">
                {f.name}
                <span className="ml-2 text-cloud text-[12px]">
                  {(f.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </span>
              <button
                type="button"
                onClick={() => onChange(files.filter((_, idx) => idx !== i))}
                className="text-[12px] uppercase tracking-widest text-cloud hover:text-bone transition-colors"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
