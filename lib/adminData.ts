import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import {
  normalizeMembership,
  revenueBreakdown,
  type Membership,
  type RevenueBreakdown,
} from "@/lib/pricing";

export type AppStatus = "pending" | "approved" | "rejected" | "suspended";

export type Application = {
  id: string;
  name: string;
  company: string | null;
  email: string;
  phone: string | null;
  discipline: string;
  coverage: string | null;
  accreditations: string | null;
  insurance: string | null;
  website: string | null;
  about: string | null;
  status: AppStatus;
  membership: Membership;
  decided_at: string | null;
  created_at: string;
};

export type ClientRow = {
  userId: string;
  email: string | null;
  name: string | null;
  createdAt: string | null;
  lastSignIn: string | null;
  confirmed: boolean;
  project: {
    goalId: string | null;
    postcode: string | null;
    positionLabel: string | null;
    stage: number | null;
    updatedAt: string | null;
  } | null;
};

export type AdminStats = {
  connected: boolean;
  pending: number;
  approved: number;
  rejected: number;
  suspended: number;
  network: number; // approved + suspended (ever admitted)
  clients: number;
  projects: number;
};

/** All professional applications, newest first. */
export async function listApplications(): Promise<{ apps: Application[]; note: string }> {
  const sb = getSupabaseAdmin();
  if (!sb) {
    return {
      apps: [],
      note: "The database isn’t connected, so applications aren’t stored here yet — they’re emailed to hello@plotworthy.co.uk. Add the Supabase keys to manage them on this page.",
    };
  }
  const { data, error } = await sb
    .from("professional_applications")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return { apps: [], note: `Couldn’t load applications: ${error.message}` };
  const apps = ((data as any[]) || []).map((a) => ({
    ...a,
    membership: normalizeMembership(a.membership),
  })) as Application[];
  return { apps, note: "" };
}

/** MRR/ARR across all active (approved) members. */
export async function getRevenue(): Promise<RevenueBreakdown> {
  const { apps } = await listApplications();
  const active = apps.filter((a) => a.status === "approved");
  return revenueBreakdown(active.map((a) => a.membership));
}

/** Signed-up clients joined to their saved project. */
export async function listClients(): Promise<{ clients: ClientRow[]; note: string }> {
  const sb = getSupabaseAdmin();
  if (!sb) {
    return { clients: [], note: "The database isn’t connected, so client accounts can’t be listed yet." };
  }

  // Projects keyed by user_id.
  const { data: projectRows, error: pErr } = await sb
    .from("projects")
    .select("user_id, goal_id, data, position_label, stage, updated_at");
  if (pErr) return { clients: [], note: `Couldn’t load projects: ${pErr.message}` };

  const projByUser = new Map<string, ClientRow["project"]>();
  for (const r of (projectRows as any[]) || []) {
    projByUser.set(r.user_id, {
      goalId: r.goal_id ?? null,
      postcode: (r.data && (r.data.postcode as string)) || null,
      positionLabel: r.position_label ?? null,
      stage: r.stage ?? null,
      updatedAt: r.updated_at ?? null,
    });
  }

  // Auth users (admin API, paginated).
  const clients: ClientRow[] = [];
  let page = 1;
  // Cap at a few pages for safety; the network is small in this phase.
  for (; page <= 10; page++) {
    const { data, error } = await sb.auth.admin.listUsers({ page, perPage: 200 });
    if (error) return { clients: [], note: `Couldn’t load users: ${error.message}` };
    const users = data?.users || [];
    for (const u of users) {
      clients.push({
        userId: u.id,
        email: u.email ?? null,
        name: (u.user_metadata?.full_name as string) || null,
        createdAt: u.created_at ?? null,
        lastSignIn: u.last_sign_in_at ?? null,
        confirmed: Boolean(u.email_confirmed_at || (u as any).confirmed_at),
        project: projByUser.get(u.id) || null,
      });
    }
    if (users.length < 200) break;
  }

  clients.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
  return { clients, note: "" };
}

export async function getStats(): Promise<AdminStats> {
  const sb = getSupabaseAdmin();
  const empty: AdminStats = {
    connected: false,
    pending: 0,
    approved: 0,
    rejected: 0,
    suspended: 0,
    network: 0,
    clients: 0,
    projects: 0,
  };
  if (!sb) return empty;

  const [{ apps }, { clients }] = await Promise.all([listApplications(), listClients()]);
  const by = (s: AppStatus) => apps.filter((a) => a.status === s).length;
  const projects = clients.filter((c) => c.project && c.project.goalId).length;

  return {
    connected: true,
    pending: by("pending"),
    approved: by("approved"),
    rejected: by("rejected"),
    suspended: by("suspended"),
    network: by("approved") + by("suspended"),
    clients: clients.length,
    projects,
  };
}
