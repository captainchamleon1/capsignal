import type { Metadata } from "next";
import { getSession, getUserOrganization } from "@/lib/auth-server";
import { db } from "@/lib/db";
import { DataRoomManager } from "@/components/app/data-room-manager";

export const metadata: Metadata = { title: "Data room" };

export default async function DataRoomPage() {
  const session = await getSession();
  if (!session) return null;
  const org = await getUserOrganization(session.user.id);
  if (!org) return null;

  const dataRoom = await db.dataRoom.findFirst({
    where: { organizationId: org.id },
    include: {
      documents: {
        include: { access: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-text-primary">Data room</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Share diligence materials with investors — track who viewed what
        </p>
      </div>
      <DataRoomManager
        dataRoomId={dataRoom?.id}
        documents={(dataRoom?.documents ?? []).map((d) => ({
          id: d.id,
          name: d.name,
          category: d.category,
          viewCount: d.access.reduce((sum, a) => sum + a.viewCount, 0),
          createdAt: d.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
