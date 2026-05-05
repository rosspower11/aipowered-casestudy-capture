# Handover prompt for Cursor

Paste the block below into Cursor's chat (Cmd+L). The agent will pick up the
project, install, wire credentials, and ship to Vercel.

---

You are taking over a Next.js 14 project called `case-study-survey`. It is a
click-through end-of-cohort feedback / case study form for **ai powered**.
It saves answers to a Notion database and uploads files to Cloudflare R2.

The project is fully built and TypeScript-clean. Your job is to get it running
locally, then ship it to Vercel as fast as possible. Follow the steps below in
order. Ask me for any secret you need — do not guess them.

## What's already done
- Full Next.js 14 app (App Router, TS, Tailwind) — cover page + 10-step
  click-through survey + `/api/upload` (R2) + `/api/submit` (Notion).
- Notion **Case Studies** database schema is already configured with all 16
  properties the app writes to. Database ID: `357b938b5c83803aa926cabe1ba7804a`.
- README.md and .env.example are in the repo root with full setup steps.

## What you need to do, in order

### 1. Move out of Google Drive (if applicable)
Run `pwd`. If the path contains `CloudStorage/GoogleDrive`, move the project
to `~/Code/case-study-survey` first, because Drive choking on `node_modules`
will slow everything down. Use:
```bash
mv "$(pwd)" ~/Code/case-study-survey && cd ~/Code/case-study-survey
```

### 2. Install + first run
```bash
npm install
cp .env.example .env.local
```
Open `.env.local` and stop. Ask me for these seven values, one batch:
- `NOTION_TOKEN`
- `R2_ACCOUNT_ID`
- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`
- `R2_BUCKET` (suggest `ai-powered-case-studies`)
- `R2_PUBLIC_BASE_URL` (the public URL for the bucket — custom domain like
  `https://files.aipowered.xyz`, or the bucket's r2.dev URL while testing)
- Confirm the Notion database is **shared with the integration**
  (Database → ⋯ → Connections → add)

`NOTION_DATABASE_ID` is already set in `.env.example` — leave it.

### 3. Sanity check locally
```bash
npm run dev
```
Open http://localhost:3000. Test:
- Fill out the cover (first name, last name).
- Click through 1-2 questions, then jump to question 4 and try uploading a small
  image — confirm it appears in the file list.
- Submit on the last screen and confirm a new page appears in the Case Studies
  Notion database, with the file attached as an external link that opens.

If submit fails, the most likely causes are:
- Notion 404 → integration not shared with the database. Fix in Notion.
- Notion 401 → wrong `NOTION_TOKEN`.
- Upload 500 → R2 credentials wrong, or `R2_PUBLIC_BASE_URL` not pointing at a
  public-readable URL for the bucket.

### 4. Ship to Vercel
```bash
npm i -g vercel  # if not installed
vercel link      # create a new project under the ai powered scope
```
Then add the seven env vars to Vercel:
```bash
for key in NOTION_TOKEN NOTION_DATABASE_ID R2_ACCOUNT_ID R2_ACCESS_KEY_ID \
           R2_SECRET_ACCESS_KEY R2_BUCKET R2_PUBLIC_BASE_URL; do
  vercel env add "$key" production
done
```
Paste each value when prompted (read them from `.env.local`).
Then deploy:
```bash
vercel --prod
```

### 5. Wire up a clean URL
After deploy, ask me which subdomain I want (suggest `casestudy.aipowered.xyz`).
Add it in the Vercel dashboard → Domains, and follow the DNS instructions.

### 6. Smoke test live
Hit the production URL and submit one real case study end-to-end. Confirm:
- Notion page is created with all properties populated.
- Uploaded file is reachable from Notion (click the file link in Notion — it
  should open in browser).

### 7. Hand back
Reply with:
- The production URL.
- Any unresolved issues from the smoke test.
- A one-line summary of what's left for me to do (e.g. set up custom domain DNS).

## Conventions for this project
- No em dashes in any UI copy or commits. Commas, periods, colons instead.
- Brand voice for any user-facing copy: short, declarative, lowercase wordmark.
  Match the existing tone in `app/page.tsx` and `app/survey/page.tsx`.
- If you need to change a question, edit the `STEPS` array in
  `app/survey/page.tsx` AND the `Answers` type / `lib/notion.ts` mapping.
- File size limit is 50MB, set in both `app/api/upload/route.ts` (`MAX_BYTES`)
  and `components/FileDrop.tsx`. If you change one, change both.

Begin.
