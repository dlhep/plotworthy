# PlotWorthy

Your property project adviser — showing clients what happens next and introducing
the right vetted professional when they need them.

Built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS** and **MapLibre GL**.

---

## What's inside

A real, deployable two-sided platform.

### Client side
- **Homepage** built around *"Start your property journey"* with the opening
  question *What are you hoping to do with a property?*
- **Guided questionnaire** (`/start`) — goal → where you are → property
  (address + postcode) — placing the client at the correct stage.
- **Universal seven-stage project hub** (`/journeys/[slug]`) — the whole journey
  is always visible; the current stage opens in full (overview, timescale,
  who-leads, an interactive checklist, key considerations), future stages stay a
  calm one-line glimpse. Persistent **"You are here"** indicator.
- **Property intelligence** — enter a postcode to get Article 4 status, **HMO
  saturation within 100m** (against the 10% threshold), a local-area map, and
  **planning history nearby** with an approval-rate ("your chances") figure.
- **Information hub per project type** — an about-this-project facts strip, a
  required-information library across all stages, a **postcode professional
  finder**, and **best-practice resource links**.
- **Five project journeys** sharing one spine: HMO (reference model), Extension,
  House to flats, Office/commercial to residential, Care/supported.

### Professional side (`/professional`)
- **Dashboard** — opportunities in your area with the **7-day escalation**
  ("first access" → "opens wider").
- **Coverage map** — a real **MapLibre + OpenFreeMap** map with postcode-district
  boundaries you click to select; 5 districts included, add-on packages, and an
  Enhanced-profile tier.
- **Public profile** — how clients see and hire you.

> Prototype data note: property intelligence, opportunities, professionals and
> pricing use realistic placeholder data. Wiring them to live sources (Article 4
> layers, the HMO licensing register, the Planning Data API, Stripe, accounts and
> file storage) is the backend phase.

---

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000 — the coverage map (`/professional/coverage`) loads
live OpenFreeMap tiles and postcode boundaries, so view it with a normal internet
connection.

```bash
npm run build   # production build
npm run start   # serve the production build
```

---

## Deploy: GitHub + Vercel

The project is already a git repository with commits — you do **not** need
`git init`.

### 1. Create an empty repo on GitHub

On https://github.com/new create a repository named `plotworthy` — **do not** add
a README, .gitignore or licence (the project already has them).

### 2. Push this project to it

From the project folder:

```bash
git remote add origin https://github.com/<your-username>/plotworthy.git
git branch -M main
git push -u origin main
```

### 3. Deploy on Vercel

1. Go to https://vercel.com and sign in with GitHub.
2. **Add New → Project**, import the `plotworthy` repo.
3. Vercel auto-detects Next.js — no build settings to change. Click **Deploy**.
4. Every push to `main` redeploys automatically; pull requests get preview URLs.

**No environment variables are required.** The coverage map fetches OpenFreeMap
tiles and public postcode-district boundaries from the visitor's browser at
runtime, so it works on Vercel with no configuration.

---

## Project structure

```
app/
  layout.tsx                    # shell (public nav/footer hidden on /professional)
  page.tsx                      # homepage + opening question
  start/page.tsx                # guided questionnaire (captures property)
  journeys/page.tsx             # journeys index
  journeys/[slug]/page.tsx      # project hub: intelligence, stages, info, resources
  professional/
    layout.tsx                  # workspace shell (deep-sage sidebar)
    page.tsx                    # dashboard
    opportunities/page.tsx
    coverage/page.tsx           # real MapLibre coverage map + controls
    profile/page.tsx            # public profile
  professionals|how-it-works|join|login/
components/
  Nav, Footer, Logo, SiteFrame  # SiteFrame hides public chrome in the workspace
  StartFlow                     # questionnaire (one decision per screen)
  JourneyStepper                # seven-stage hub with "You are here"
  PropertyIntel                 # Article 4 / HMO saturation / planning history
  ProsNearYou                   # postcode professional finder
  IntroFlow                     # contextual professional-introduction modal
  CoverageMap                   # MapLibre GL map (client)
  WorkspaceSidebar
  Icons, Reveal
lib/
  journeys.ts   # journeys, stages, per-stage detail, hub info + resources
  start.ts      # questionnaire options + stage routing
  professionals.ts  # sample vetted professionals + discipline matcher
  intel.ts      # prototype property-intelligence engine
```

---

## Design notes

Warm, calm, professional palette (sage green + terracotta clay on a warm
off-white canvas) with a deep-sage workspace sidebar; modern **Bricolage
Grotesque** display headings with **Inter** body; subtle paper texture and
scroll-in entrance animations; one main decision per screen; numbered stages.

## Next steps (backend phase)

- Accounts / authentication (login and workspace are currently demos)
- Stripe for the membership + postcode add-on packages and Enhanced profile
- Live data: Article 4 layers, HMO licensing register, Planning Data API
- Postcode-based project ↔ professional matching + the 7-day escalation job
- File storage for client documents
