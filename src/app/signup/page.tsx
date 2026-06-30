import { redirect } from "next/navigation";

/** New users start with the raise profile, not auth signup. */
export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const params = await searchParams;
  if (params.next) {
    redirect(`/signup/create?next=${encodeURIComponent(params.next)}`);
  }
  redirect("/start#apply");
}
