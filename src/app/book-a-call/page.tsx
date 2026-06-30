import type { Metadata } from "next";
import { raiseMovement } from "@/lib/content/raise-movement";
import { siteConfig } from "@/lib/content/site";

export const metadata: Metadata = {
  title: `${raiseMovement.bookCall.title} · ${siteConfig.name}`,
  description: raiseMovement.bookCall.subtitle,
};

export { default } from "./book-a-call-view";
