import { NextResponse } from "next/server";
import { z } from "zod";
import { recordServerFunnelMilestone } from "@/lib/analytics/server-milestone";

const schema = z.object({
  sessionId: z.string().min(1),
  milestone: z.string().min(1),
  pagePath: z.string().optional(),
  leadEmail: z.string().email().optional(),
  leadName: z.string().optional(),
  leadCompany: z.string().optional(),
  params: z.record(z.string(), z.unknown()).optional(),
});

export async function POST(request: Request) {
  const body = schema.safeParse(await request.json());
  if (!body.success) {
    return NextResponse.json({ ok: false, error: "Invalid payload" }, { status: 400 });
  }

  try {
    await recordServerFunnelMilestone(body.data);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Server funnel milestone error:", err);
    return NextResponse.json({ ok: false, error: "Failed to record milestone" }, { status: 500 });
  }
}
