# ai powered — Case Study Survey

A click-through end-of-cohort feedback + case study form for ai powered.
Saves answers to a Notion database. Uploads files to Cloudflare R2.

## What it does

- Cover page with first name / last name / email
- Ten click-through questions, one per screen, with a subtle progress bar
- Long-form text fields, Yes/No questions, multi-link input, multi-file upload
- On submit: creates a Notion page in the **Case Studies** database with every
  answer as a property and a tidy formatted body, plus all uploaded files
  attached as external file links pointing at your R2 bucket
- Brand: black background, lowercase "ai powered" wordmark, Inter, large display
  type, subtle line dividers — matches the Vault style

---

## 1. Local setup

```bash
cd case-study-survey
npm install
cp .env.example .env.local
```

Fill `.env.local` with the values below.

```bash
npm run dev
# open http://localhost:3000
```

Production build check:
```bash
npm run build
```

---

## 2. Environment variables

| Variable | What | How to get it |
| --- | --- | --- |
| `NOTION_TOKEN` | Notion integration secret | https://www.notion.so/profile/integrations → New integration → copy "Internal Integration Token" |
| `NOTION_DATABASE_ID` | Case Studies database ID | Already filled in `.env.example`: `357b938b5c83803aa926cabe1ba7804a`. (It's the segment of the database URL after the workspace name.) |
| `R2_ACCOUNT_ID` | Cloudflare account ID | Cloudflare dashboard → top right copy icon |
| `R2_ACCESS_KEY_ID` / `R2_SECRET_ACCESS_KEY` | R2 token credentials | R2 → Manage R2 API tokens → "Create API token" with **Object Read & Write** for your bucket |
| `R2_BUCKET` | Bucket name | Whatever you called the bucket — e.g. `ai-powered-case-studies` |
| `R2_PUBLIC_BASE_URL` | Public URL prefix | R2 → Bucket → Settings → connect a custom domain (e.g. `files.aipowered.xyz`) and put `https://files.aipowered.xyz` here. (You can also use the bucket's default `r2.dev` URL while testing.) |

### Notion: don't forget to share

After you create the integration, open the **Case Studies** database in Notion,
click `…` (top right) → **Connections** → add your integration. Without this
step the API calls return 404.

The schema is already configured. The app writes to these properties:

- `Name` (title), `First Name`, `Last Name`, `Email`
- `Before Programme`, `Click Moment`, `Best Build`, `Shared Links`,
  `Teaching Style`, `Recommendation`, `Ideal Programme`, `Other Notes`
- `Public Use OK`, `Stay In Community` (Yes/No selects)
- `Files` (external file links pointing at R2)
- `Submitted At` (date)

### Cloudflare R2 setup

1. R2 → **Create bucket** → name it `ai-powered-case-studies`.
2. Bucket → **Settings** → **Public access** → connect a custom domain (e.g.
   `files.aipowered.xyz`). This is what makes uploaded files visible from
   Notion. Without a public URL, Notion can't render the file links.
3. Manage R2 API tokens → **Create API token** → permission "Object Read &
   Write" → scope to that bucket → copy the access key + secret.
4. Add CORS to the bucket (only if you ever switch to direct browser uploads;
   not required for the current server-proxy upload flow):
   ```json
   [{ "AllowedOrigins": ["*"], "AllowedMethods": ["PUT","POST","GET"],
      "AllowedHeaders": ["*"], "MaxAgeSeconds": 3600 }]
   ```

---

## 3. Deploy to Vercel

```bash
npm i -g vercel
vercel link
vercel env add NOTION_TOKEN
vercel env add NOTION_DATABASE_ID
vercel env add R2_ACCOUNT_ID
vercel env add R2_ACCESS_KEY_ID
vercel env add R2_SECRET_ACCESS_KEY
vercel env add R2_BUCKET
vercel env add R2_PUBLIC_BASE_URL
vercel --prod
```

Or push to GitHub and import the repo in the Vercel dashboard, paste the env
vars there, and click Deploy.

Point your domain (e.g. `casestudy.aipowered.xyz`) at the Vercel project once
it's live.

---

## 4. File map

```
case-study-survey/
  app/
    page.tsx               # Cover screen — name + email + Start
    survey/page.tsx        # The 10-question click-through state machine
    api/upload/route.ts    # Receives a file, puts it in R2, returns its URL
    api/submit/route.ts    # Receives the full answer payload, creates a Notion page
    layout.tsx, globals.css
  components/
    Shell.tsx              # Header / footer / progress bar
    Logo.tsx               # Lowercase "ai powered" wordmark
    Buttons.tsx, Field.tsx, LinkList.tsx, FileDrop.tsx
  lib/
    notion.ts              # Notion client + payload mapping
    r2.ts                  # R2 client wrapper
  .env.example
  README.md
```

## 5. Tweaking

- **Add or rename a question:** edit the `STEPS` array in `app/survey/page.tsx`.
  If you add a new field, also add it to the `Answers` type and `empty` object,
  and to `lib/notion.ts` so the answer lands in Notion.
- **Change the brand colours:** `tailwind.config.ts` (`ink`, `bone`, `cloud`,
  `line`).
- **Change file size limit:** `MAX_BYTES` in `app/api/upload/route.ts` and the
  same constant in `components/FileDrop.tsx`.
