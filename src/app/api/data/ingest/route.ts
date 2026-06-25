import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth-server";
import { runIngest } from "@/lib/data/pipeline/orchestrator";
import { db } from "@/lib/db";

const schema = z.object({
  sourceKeys: z.array(z.string()).optional(),
  bulk: z.boolean().optional(),
});

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = schema.safeParse(await request.json().catch(() => ({})));
  const sourceKeys = body.success ? body.data.sourceKeys : undefined;
  const bulk = body.success ? body.data.bulk ?? false : false;

  const summary = await runIngest({ sourceKeys, bulk });
  const total = await db.investorFirm.count();
  return NextResponse.json({ summary, totalFirms: total });
}
