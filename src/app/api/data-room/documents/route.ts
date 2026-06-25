import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession, getUserOrganization } from "@/lib/auth-server";
import { db } from "@/lib/db";

const schema = z.object({
  dataRoomId: z.string(),
  name: z.string().min(1),
  category: z.enum(["deck", "financials", "legal", "product", "other"]),
});

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const org = await getUserOrganization(session.user.id);
  if (!org) return NextResponse.json({ error: "No organization" }, { status: 400 });

  const body = schema.safeParse(await request.json());
  if (!body.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const room = await db.dataRoom.findFirst({
    where: { id: body.data.dataRoomId, organizationId: org.id },
  });
  if (!room) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const document = await db.document.create({
    data: {
      dataRoomId: room.id,
      name: body.data.name,
      category: body.data.category,
      uploadedBy: session.user.id,
    },
  });

  return NextResponse.json({ document });
}
