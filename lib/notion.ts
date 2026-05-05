import { Client } from '@notionhq/client';

let cached: Client | null = null;

export function getNotion(): Client {
  if (cached) return cached;
  const token = process.env.NOTION_TOKEN;
  if (!token) throw new Error('NOTION_TOKEN is not set');
  cached = new Client({ auth: token });
  return cached;
}

export const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID || '';

export type CaseStudyPayload = {
  firstName: string;
  lastName: string;
  email?: string;
  beforeProgramme: string;
  clickMoment: string;
  bestBuild: string;
  links: string[];
  files: { name: string; url: string }[];
  publicUseOk: 'Yes' | 'No' | '';
  teachingStyle: string;
  recommendation: string;
  idealProgramme: string;
  stayInCommunity: 'Yes' | 'No' | '';
  otherNotes: string;
};

const text = (value: string) =>
  value
    ? { rich_text: [{ type: 'text' as const, text: { content: value.slice(0, 1990) } }] }
    : { rich_text: [] };

export async function createCaseStudyPage(payload: CaseStudyPayload) {
  if (!NOTION_DATABASE_ID) throw new Error('NOTION_DATABASE_ID is not set');
  const notion = getNotion();

  const fullName = `${payload.firstName} ${payload.lastName}`.trim();
  const linksBlock = payload.links.filter(Boolean).join('\n');

  const properties: Record<string, unknown> = {
    Name: {
      title: [{ type: 'text', text: { content: fullName || 'Anonymous' } }],
    },
    'First Name': text(payload.firstName),
    'Last Name': text(payload.lastName),
    'Before Programme': text(payload.beforeProgramme),
    'Click Moment': text(payload.clickMoment),
    'Best Build': text(payload.bestBuild),
    'Shared Links': text(linksBlock),
    'Teaching Style': text(payload.teachingStyle),
    Recommendation: text(payload.recommendation),
    'Ideal Programme': text(payload.idealProgramme),
    'Other Notes': text(payload.otherNotes),
    'Submitted At': {
      date: { start: new Date().toISOString() },
    },
  };

  if (payload.email) {
    properties.Email = { email: payload.email };
  }
  if (payload.publicUseOk === 'Yes' || payload.publicUseOk === 'No') {
    properties['Public Use OK'] = { select: { name: payload.publicUseOk } };
  }
  if (payload.stayInCommunity === 'Yes' || payload.stayInCommunity === 'No') {
    properties['Stay In Community'] = { select: { name: payload.stayInCommunity } };
  }
  if (payload.files.length > 0) {
    properties.Files = {
      files: payload.files.map((f) => ({
        name: f.name.slice(0, 100),
        type: 'external' as const,
        external: { url: f.url },
      })),
    };
  }

  // Body content with the long-form answers, so they're easy to read in Notion.
  const blocks = buildPageBody(payload);

  // The Notion SDK's TS types are strict; cast to any to keep this file readable.
  // Field types match the official API reference.
  const response = await notion.pages.create({
    parent: { database_id: NOTION_DATABASE_ID },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    properties: properties as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    children: blocks as any,
  });

  return response;
}

function paragraph(content: string) {
  if (!content) return null;
  return {
    object: 'block',
    type: 'paragraph',
    paragraph: {
      rich_text: [{ type: 'text', text: { content: content.slice(0, 1990) } }],
    },
  };
}

function heading(content: string) {
  return {
    object: 'block',
    type: 'heading_3',
    heading_3: {
      rich_text: [{ type: 'text', text: { content } }],
    },
  };
}

function buildPageBody(payload: CaseStudyPayload) {
  const blocks: unknown[] = [];

  const sections: { title: string; body: string }[] = [
    { title: 'Before the programme', body: payload.beforeProgramme },
    { title: 'The moment it clicked', body: payload.clickMoment },
    { title: 'Best build', body: payload.bestBuild },
    { title: 'Links', body: payload.links.join('\n') },
    { title: 'Public use OK', body: payload.publicUseOk },
    { title: 'Teaching style', body: payload.teachingStyle },
    { title: 'Recommendation', body: payload.recommendation },
    { title: 'Ideal programme', body: payload.idealProgramme },
    { title: 'Stay in community', body: payload.stayInCommunity },
    { title: 'Other notes', body: payload.otherNotes },
  ];

  for (const s of sections) {
    if (!s.body) continue;
    blocks.push(heading(s.title));
    const p = paragraph(s.body);
    if (p) blocks.push(p);
  }

  if (payload.files.length > 0) {
    blocks.push(heading('Files'));
    for (const f of payload.files) {
      blocks.push({
        object: 'block',
        type: 'bookmark',
        bookmark: { url: f.url },
      });
    }
  }

  return blocks;
}
