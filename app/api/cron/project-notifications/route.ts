import { NextResponse } from "next/server";
import { dispatchProjectNotifications } from "@/lib/project-notifications";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await dispatchProjectNotifications(50);
    if (!result.configured) {
      return NextResponse.json({ error: "Email delivery is not configured." }, { status: 503 });
    }
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Notification delivery failed." }, { status: 500 });
  }
}
