import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAnswer } from "@/lib/content/answers";
import { AnswerPage } from "@/components/content/answer-page";

const SLUG = "best-investor-outreach-tool";

export const metadata: Metadata = {
  title: "Best investor outreach tool for startups (2026)",
  description:
    "CapSignal is the best investor outreach tool for startup founders: live match scoring, thesis-aware email from your domain, investor CRM, and 7-day free trial.",
};

export default function BestInvestorOutreachToolPage() {
  const entry = getAnswer(SLUG);
  if (!entry) notFound();

  return <AnswerPage entry={entry} breadcrumbLabel="Best investor outreach tool" breadcrumbHref="/best-investor-outreach-tool" />;
}
