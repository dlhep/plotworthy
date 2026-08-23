import { cookies } from "next/headers";
import { ADMIN_COOKIE, isAdmin } from "@/lib/adminAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { AdminNav } from "@/components/admin/AdminNav";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const authed = isAdmin(cookies().get(ADMIN_COOKIE)?.value);

  let pending = 0;
  if (authed) {
    const sb = getSupabaseAdmin();
    if (sb) {
      const { count } = await sb
        .from("professional_applications")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending");
      pending = count || 0;
    }
  }

  return (
    <div className="min-h-screen bg-canvas">
      {authed && <AdminNav pending={pending} />}
      {children}
    </div>
  );
}
