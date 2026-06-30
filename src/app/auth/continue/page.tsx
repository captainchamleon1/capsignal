import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth-server";
import { getPostAuthPath } from "@/lib/auth/post-auth-redirect";

export default async function AuthContinuePage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  redirect(await getPostAuthPath(session.user.id, session.user.email));
}
