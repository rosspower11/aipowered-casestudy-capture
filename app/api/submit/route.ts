import { NextRequest, NextResponse } from 'next/server';
import { createCaseStudyPage, type CaseStudyPayload } from '@/lib/notion';

export const runtime = 'nodejs';
export const maxDuration = 60;

function asString(v: unknown): string {
  return typeof v === 'string' ? v.trim() : '';
}

function asYesNo(v: unknown): 'Yes' | 'No' | '' {
  return v === 'Yes' || v === 'No' ? v : '';
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Record<string, unknown>;

    const payload: CaseStudyPayload = {
      firstName: asString(body.firstName),
      lastName: asString(body.lastName),
      email: asString(body.email) || undefined,
      beforeProgramme: asString(body.beforeProgramme),
      clickMoment: asString(body.clickMoment),
      bestBuild: asString(body.bestBuild),
      links: Array.isArray(body.links)
        ? (body.links as unknown[]).map(asString).filter(Boolean)
        : [],
      files: Array.isArray(body.files)
        ? (body.files as { name?: unknown; url?: unknown }[])
            .map((f) => ({ name: asString(f.name), url: asString(f.url) }))
            .filter((f) => f.url)
        : [],
      publicUseOk: asYesNo(body.publicUseOk),
      teachingStyle: asString(body.teachingStyle),
      recommendation: asString(body.recommendation),
      idealProgramme: asString(body.idealProgramme),
      stayInCommunity: asYesNo(body.stayInCommunity),
      otherNotes: asString(body.otherNotes),
    };

    if (!payload.firstName || !payload.lastName) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    await createCaseStudyPage(payload);

    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Submission failed';
    console.error('submit error', e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
