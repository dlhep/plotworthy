# PlotWorthy

Your property project adviser — showing clients what happens next and introducing
the right vetted professional when they need them.

Built with **Next.js 14 (App Router)**, **TypeScript** and **Tailwind CSS**.

---

## What's inside

A real, deployable website (not static HTML) structured around the client journey:

- **Homepage** built around *"Start your property journey"* with the one opening
  question: *What are you hoping to do with a property?*
- **Guided questionnaire** (`/start`) — two questions (goal → where you are)
  that place the client at the correct stage instead of forcing stage one.
- **Universal seven-stage project hub** — the whole journey is always visible;
  the current stage opens in detail, future stages stay collapsed with a short
  "you'll deal with this later" note. Persistent **"You are here"** indicator.
- **Five project journeys**, all sharing the same spine:
  - `HMO` — the fully developed **reference model**
  - `Extension / improve a home`
  - `House to flats`
  - `Office / commercial to residential`
  - `Care / supported accommodation`
- **Supporting pages** — Find a professional, How PlotWorthy helps, Join as a
  professional, Log in.
- Pricing/report emphasis deliberately left out, per the reset brief.

The journey content lives in one data file — `lib/journeys.ts` — so stages,
actions, decisions, documents and professionals are easy to edit without
touching layout code.

---

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

```bash
npm run build   # production build
npm run start   # serve the production build
```

---

## Deploy: GitHub + Vercel

### 1. Push to GitHub

```bash
git init
git add -A
git commit -m "Initial PlotWorthy site"
git branch -M main
git remote add origin https://github.com/<your-username>/plotworthy.git
git push -u origin main
```

(Create the empty `plotworthy` repo on GitHub first, without a README.)

### 2. Deploy on Vercel

1. Go to https://vercel.com and sign in with GitHub.
2. **Add New → Project**, import the `plotworthy` repo.
3. Vercel auto-detects Next.js — no configuration needed. Click **Deploy**.
4. Every push to `main` redeploys automatically; pull requests get preview URLs.

No environment variables are required for this version.

---

## Project structure

```
app/
  layout.tsx              # shell: nav, footer, fonts
  page.tsx                # homepage + opening question
  start/page.tsx          # guided questionnaire
  journeys/page.tsx       # journeys index
  journeys/[slug]/page.tsx# universal 7-stage hub (data-driven)
  professionals/          # find a professional
  how-it-works/           # how PlotWorthy helps
  join/                   # join as a professional
  login/                  # log in
components/
  Nav.tsx, Footer.tsx, Logo.tsx
  StartFlow.tsx           # questionnaire logic (one decision per screen)
  JourneyStepper.tsx      # the seven-stage hub with "You are here"
lib/
  journeys.ts             # all five journeys + the seven universal stages
  start.ts                # questionnaire options + stage routing
```

---

## Design notes

Calm, warm, professional palette (soft sage green + warm clay accent on a warm
off-white canvas), small legible serif headings (Fraunces) with a clean sans
(Inter), one main decision per screen, numbered stages, minimal jargon and no
dense compliance dashboards on the hub.

## Next steps (not yet built)

- New-build development journey
- Real professional directory + proposal flow (currently illustrative)
- Accounts / authentication (login is a demo screen)
- Pricing, subscriptions and reports — added at the correct stages once the
  core journey is established
