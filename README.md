# Vivelo — test build

Four-page scaffold: `index.html` (landing) → `login.html` (magic link) → `onboarding.html` (profile + pillar baseline) → `dashboard.html` (pillar cards + AI assistant).

Plain HTML/JS, no build step — same GitHub Pages delivery model as your other sites. Supabase JS is loaded straight from CDN.

## What's real vs. what needs your setup

Everything is wired up and functional **once you fill in three things**:

### 1. Supabase config
Open `js/supabase-client.js` and replace:
- `YOUR_SUPABASE_PROJECT_URL` — from Supabase dashboard → Settings → API
- `YOUR_SUPABASE_ANON_KEY` — same page, "anon public" key

### 2. Database tables
In the Supabase SQL Editor, run `supabase/schema.sql`. Creates three tables (`profiles`, `pillar_scores`, `ai_suggestions`), all with row-level security so users can only ever see their own data.

### 3. Enable magic-link auth
Supabase dashboard → Authentication → Providers → Email. Make sure "Confirm email" / OTP is on (it is by default). Under Authentication → URL Configuration, add your test URL (e.g. `https://sharplinedigital.com/vivelo/` or wherever this ends up hosted, plus `http://localhost` if testing locally) to the allowed redirect URLs.

### 4. AI assistant (Edge Function)
`supabase/functions/pillar-assistant/index.ts` mirrors the `sharpline-chat` function you already have live. Deploy it the same way:
```
supabase functions deploy pillar-assistant
supabase secrets set ANTHROPIC_API_KEY=sk-ant-...   (reuse the existing key)
```
Until this is deployed, the dashboard's "Suggestions" panel will show a friendly error instead of crashing — everything else works fine without it.

## Notes on design decisions made without asking

- **Pillar baseline** = a 1–10 slider per pillar, plus optional interest chips (reused from the original quiz style) so the AI assistant has real context to work from, not just a bare number. If sliders feel wrong once Yann sees it, this is an easy swap.
- **Colors** pulled directly from the original prototype file, not reinvented: Purpose gold `#C49A2E`, Connections blue `#3A7FC1`, Mind purple `#7B4FBB`, Body sage `#3D6B5E`.
- **AI suggestions are saved, not regenerated every load** — first visit fetches from Claude and stores the result; "Get new suggestions" button forces a fresh call. Keeps API costs down for a test group.

## Known gaps (fine for a small test group, not for real launch)

- No password reset / account deletion flow — not needed with magic links
- No editing pillar scores after onboarding yet (would be a "recheck my map" flow — good next feature to discuss)
- No rate-limiting on the AI assistant — a handful of testers is fine, don't publicize the link
- Old prototype's home-page marketing copy, quiz-flow animation, and canvas-drawn map were **not** carried over — this scaffold prioritizes the real signed-in flow you described. Worth deciding together whether the canvas life-map visual comes back for the dashboard, or whether the simpler card grid here is good enough for testing.
