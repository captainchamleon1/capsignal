import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAnswer } from "@/lib/content/answers";
import { AnswerPage } from "@/components/content/answer-page";

export const metadata: Metadata = {
  title: "CapSignal vs OpenVC",
  description:
    "OpenVC is a free investor directory. CapSignal adds match scoring, outreach from your inbox, CRM, and data room — full raise execution.",
};

export default function CapSignalVsOpenVCPage() {
  const entry = getAnswer("capsignal-vs-openvc");
  if (!entry) notFound();

  return <AnswerPage entry={entry} breadcrumbLabel="Compare" breadcrumbHref="/compare" />;
}
