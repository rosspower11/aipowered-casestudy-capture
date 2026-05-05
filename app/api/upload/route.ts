import { NextRequest, NextResponse } from 'next/server';
import { putObject, publicUrl } from '@/lib/r2';
import { randomUUID } from 'node:crypto';

export const runtime = 'nodejs';
export const maxDuration = 60;

const MAX_BYTES = 50 * 1024 * 1024;

function sanitiseName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 80) || 'file';
}

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: 'File is over 50MB' }, { status: 413 });
    }

    const id = randomUUID();
    const date = new Date();
    const yyyy = date.getUTCFullYear();
    const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(date.getUTCDate()).padStart(2, '0');
    const safe = sanitiseName(file.name);
    const key = `case-studies/${yyyy}/${mm}/${dd}/${id}-${safe}`;

    const buf = Buffer.from(await file.arrayBuffer());
    await putObject(key, buf, file.type || 'application/octet-stream');

    return NextResponse.json({ url: publicUrl(key), key });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Upload failed';
    console.error('upload error', e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
