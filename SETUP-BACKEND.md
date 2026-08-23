# PlotWorthy — Backend setup (Phase 0/1)

This turns the demo "Join as a professional" into a real flow: applications are
**stored**, you get an **email at hello@plotworthy.co.uk**, and you **approve or
reject** each one at `/admin/applications`. The site keeps working with none of
this connected — each piece just activates when you add its keys.

You'll set up two free services (Supabase + Resend), pick an admin password, and
paste five-ish values into Vercel. ~20 minutes.

---

## 1. Supabase (database) — ~8 min

1. Create a free project at https://supabase.com (New project). Pick a region
   near the UK (London/EU).
2. When it's ready, open **SQL Editor → New query**, paste the contents of
   `supabase/migrations/0001_init.sql` from this project, and click **Run**.
3. Go to **Project Settings → API** and copy:
   - **Project URL** → this is `SUPABASE_URL`
   - **service_role** secret key → this is `SUPABASE_SERVICE_ROLE_KEY`
     (keep this secret — it's server-only, never shipped to the browser).

## 2. Resend (email) — ~5 min

1. Create a free account at https://resend.com.
2. **API Keys → Create API Key**, copy it → this is `RESEND_API_KEY`.
3. **Important (free tier):** until you verify a domain, Resend only delivers to
   the email address you signed up with. So for now set `ADMIN_EMAIL` to **that
   email** so the application alerts actually reach you.
4. When ready, verify **plotworthy.co.uk** under **Domains** (add the DNS records
   it shows). Then set `ADMIN_EMAIL=hello@plotworthy.co.uk` and
   `EMAIL_FROM=PlotWorthy <hello@plotworthy.co.uk>` so mail sends from your domain.

## 3. Admin password

Pick a strong value for `ADMIN_PASSWORD`. You'll use it to sign in at
`/admin/login` and review applications.

## 4. Add the variables in Vercel — ~3 min

Project → **Settings → Environment Variables** → add each (Production + Preview):

| Name | Value |
|------|-------|
| `SUPABASE_URL` | from Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | from Supabase (service_role) |
| `RESEND_API_KEY` | from Resend |
| `ADMIN_EMAIL` | your Resend email now; hello@plotworthy.co.uk after domain verify |
| `EMAIL_FROM` | `PlotWorthy <onboarding@resend.dev>` now; hello@ after verify |
| `ADMIN_PASSWORD` | your chosen password |
| `NEXT_PUBLIC_SITE_URL` | `https://plotworthy.co.uk` |

Then **Deployments → … → Redeploy** (or push any commit) so the new values load.

## 5. Try it

1. Go to **plotworthy.co.uk/join**, fill in the form, submit → you should see
   "Application received", a row appears in Supabase, and an email lands in your
   inbox.
2. Go to **plotworthy.co.uk/admin/login**, enter `ADMIN_PASSWORD`, then
   **/admin/applications** → Approve or Reject. The applicant gets an email.

---

### What's next (later phases)
Accounts for clients & professionals (replacing the admin password with proper
auth + roles), Stripe for the membership + postcode packages, real Article 4 /
HMO-register / planning-data feeds, and the matching + 7-day escalation. See the
backend plan for the full sequence.
