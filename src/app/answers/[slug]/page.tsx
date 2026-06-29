import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { faqEntries, getAnswer } from "@/lib/content/answers";
import { AnswerPage } from "@/components/content/answer-page";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return faqEntries.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const entry = getAnswer(slug);
  if (!entry) return { title: "Answer" };
  return {
    title: entry.question,
    description: entry.description,
  };
}

export default async function AnswerDetailPage({ params }: Props) {
  const { slug } = await params;
  const entry = getAnswer(slug);
  if (!entry) notFound();

  return <AnswerPage entry={entry} />;
}
