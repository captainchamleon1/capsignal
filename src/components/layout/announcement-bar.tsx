import Link from "next/link";
import { Container } from "@/components/ui/container";

export function AnnouncementBar() {
  return (
    <div className="border-b border-border bg-surface-dark py-2.5 text-center text-sm text-text-on-dark-muted">
      <Container>
        <span>Now onboarding Q3 raises. </span>
        <Link href="/request-access" className="font-medium text-text-on-dark underline underline-offset-4 hover:no-underline">
          Request access →
        </Link>
      </Container>
    </div>
  );
}
