import { createClient } from "./supabase/client";
import { BRIEF_STORAGE_KEY, type BriefData } from "./brief";

export type Project = {
  goalId: string;
  data: BriefData;
  stage: number | null;
  positionLabel: string | null;
  updatedAt?: string;
};

// Local draft (used before a client has an account).
export function readLocalDraft(): Project | null {
  try {
    const raw = localStorage.getItem(BRIEF_STORAGE_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw);
    return {
      goalId: s.goalId ?? "",
      data: s.data ?? {},
      stage: s.stage ?? null,
      positionLabel: s.positionLabel ?? null,
      updatedAt: s.savedAt,
    };
  } catch {
    return null;
  }
}

export function writeLocalDraft(p: Project) {
  try {
    localStorage.setItem(
      BRIEF_STORAGE_KEY,
      JSON.stringify({ ...p, savedAt: new Date().toISOString() })
    );
  } catch {
    /* storage unavailable */
  }
}

export async function getCurrentUser() {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}

export async function loadProject(userId: string): Promise<Project | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("goal_id, data, stage, position_label, updated_at")
    .eq("user_id", userId)
    .maybeSingle();
  if (error || !data) return null;
  return {
    goalId: data.goal_id ?? "",
    data: (data.data as BriefData) ?? {},
    stage: data.stage,
    positionLabel: data.position_label,
    updatedAt: data.updated_at,
  };
}

export async function saveProject(userId: string, p: Project) {
  const supabase = createClient();
  const { error } = await supabase.from("projects").upsert(
    {
      user_id: userId,
      goal_id: p.goalId,
      data: p.data,
      stage: p.stage,
      position_label: p.positionLabel,
    },
    { onConflict: "user_id" }
  );
  return !error;
}
