/**
 * Deep team-page scrape for OpenVC CSV — partner names, titles, emails, LinkedIn.
 *
 * Usage:
 *   npx tsx scripts/enrich-openvc-team-emails.ts "path/to/openvc-enriched.csv"
 *   npx tsx scripts/enrich-openvc-team-emails.ts "path/to.csv" --resume
 *   npx tsx scripts/enrich-openvc-team-emails.ts "path/to.csv" --limit 50
 */

import fs from "node:fs";
import path from "node:path";
import { parseCsv } from "../src/lib/data/utils/csv-parse";
import {
  BLOCKED_LOCAL,
  decodeHtmlEntities,
  domainFromUrl,
  emailMatchesDomain,
  extractObfuscatedEmails,
  fetchPage,
  isLikelyPartnerEmail,
  isValidEmail,
  normalizePersonName,
  normalizeWebsite,
  PARTNER_TITLE_RE,
  resolveUrl,
  serializeCsv,
  sleep,
  stripTags,
  USER_AGENT,
} from "./lib/website-email-scraper";

const CONCURRENCY = 6;
const DELAY_BETWEEN_MS = 250;
const MAX_TEAM_PAGES = 8;
const MAX_PROFILE_PAGES = 12;

const TEAM_PATHS = [
  "/team",
  "/teams",
  "/our-team",
  "/people",
  "/our-people",
  "/partners",
  "/leadership",
  "/investment-team",
  "/investment-team/",
  "/about/team",
  "/about-us/team",
  "/company/team",
  "/who-we-are",
  "/meet-the-team",
  "/team-members",
  "/the-team",
  "/about/people",
  "/about/leadership",
  "/portfolio-team",
  "/our-partners",
];

const TEAM_LINK_RE =
  /team|people|partner|leadership|who-we|our-team|meet-the|investment-team|professionals|staff/i;

type PartnerContact = {
  name: string;
  title: string;
  email: string;
  linkedIn: string;
  sourceUrl: string;
  confidence: "high" | "medium" | "low";
};

type TeamEnrichedRow = Record<string, string>;

function scorePartnerContact(
  contact: Omit<PartnerContact, "confidence">,
  siteDomain: string | null,
): PartnerContact["confidence"] {
  let score = 0;
  if (emailMatchesDomain(contact.email, siteDomain)) score += 40;
  if (isLikelyPartnerEmail(contact.email)) score += 30;
  if (contact.name) score += 15;
  if (contact.title && PARTNER_TITLE_RE.test(contact.title)) score += 15;
  if (contact.linkedIn) score += 5;
  if (score >= 70) return "high";
  if (score >= 45) return "medium";
  return "low";
}

function discoverTeamUrls(html: string, origin: string): string[] {
  const urls = new Set<string>();

  for (const suffix of TEAM_PATHS) {
    const resolved = resolveUrl(suffix, origin);
    if (resolved) urls.add(resolved);
  }

  const linkRe = /<a[^>]+href=["']([^"'#?][^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let m: RegExpExecArray | null;
  while ((m = linkRe.exec(html)) !== null) {
    const href = m[1].trim();
    const text = stripTags(m[2]).trim();
    if (!TEAM_LINK_RE.test(href) && !TEAM_LINK_RE.test(text)) continue;
    const resolved = resolveUrl(href, origin);
    if (!resolved) continue;
    try {
      const host = new URL(resolved).hostname.replace(/^www\./, "");
      const siteHost = new URL(origin).hostname.replace(/^www\./, "");
      if (host === siteHost || host.endsWith(`.${siteHost}`)) {
        urls.add(resolved);
      }
    } catch {
      // skip
    }
  }

  return [...urls].slice(0, MAX_TEAM_PAGES + 4);
}

function extractJsonLdPeople(html: string, sourceUrl: string, siteDomain: string | null): PartnerContact[] {
  const contacts: PartnerContact[] = [];
  const scriptRe = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m: RegExpExecArray | null;

  while ((m = scriptRe.exec(html)) !== null) {
    try {
      const parsed = JSON.parse(m[1].trim()) as unknown;
      const nodes = flattenJsonLd(parsed);
      for (const node of nodes) {
        if (!node || typeof node !== "object") continue;
        const obj = node as Record<string, unknown>;
        const type = String(obj["@type"] ?? "");
        if (!/Person/i.test(type)) continue;

        const email = String(obj.email ?? "")
          .toLowerCase()
          .trim();
        if (!isValidEmail(email)) continue;

        const raw: Omit<PartnerContact, "confidence"> = {
          name: normalizePersonName(String(obj.name ?? "")) ?? "",
          title: String(obj.jobTitle ?? obj.title ?? "").trim(),
          email,
          linkedIn: String(obj.sameAs ?? obj.url ?? "").includes("linkedin.com")
            ? String(obj.sameAs ?? obj.url)
            : "",
          sourceUrl,
        };
        contacts.push({ ...raw, confidence: scorePartnerContact(raw, siteDomain) });
      }
    } catch {
      // invalid JSON-LD
    }
  }

  return contacts;
}

function flattenJsonLd(node: unknown): unknown[] {
  if (!node) return [];
  if (Array.isArray(node)) return node.flatMap(flattenJsonLd);
  if (typeof node === "object") {
    const obj = node as Record<string, unknown>;
    if (Array.isArray(obj["@graph"])) return obj["@graph"].flatMap(flattenJsonLd);
    return [node];
  }
  return [];
}

function extractMailtoContacts(html: string, sourceUrl: string, siteDomain: string | null): PartnerContact[] {
  const contacts: PartnerContact[] = [];
  const re = /<a[^>]*href=["']mailto:([^"'?]+)[^"']*["'][^>]*>([\s\S]*?)<\/a>/gi;
  let m: RegExpExecArray | null;

  while ((m = re.exec(html)) !== null) {
    const email = decodeHtmlEntities(m[1]).split("?")[0].toLowerCase().trim();
    if (!isValidEmail(email)) continue;

    const linkText = normalizePersonName(m[2]);
    const context = stripTags(html.slice(Math.max(0, m.index - 600), m.index + 400));
    const titleMatch = context.match(PARTNER_TITLE_RE);

    let name = linkText ?? "";
    if (!name) {
      const before = context.slice(0, context.indexOf(email)).trim();
      const nameCandidate = before.match(/([A-Z][a-z]+(?:\s+[A-Z][a-z'.-]+){1,3})\s*$/);
      if (nameCandidate) name = normalizePersonName(nameCandidate[1]) ?? "";
    }

    const raw: Omit<PartnerContact, "confidence"> = {
      name,
      title: titleMatch?.[0] ?? "",
      email,
      linkedIn: extractLinkedInNear(html, m.index),
      sourceUrl,
    };
    contacts.push({ ...raw, confidence: scorePartnerContact(raw, siteDomain) });
  }

  return contacts;
}

function extractLinkedInNear(html: string, index: number): string {
  const chunk = html.slice(index, index + 1200);
  const match = chunk.match(/https?:\/\/(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+/i);
  return match?.[0] ?? "";
}

function extractMicrodataPeople(html: string, sourceUrl: string, siteDomain: string | null): PartnerContact[] {
  const contacts: PartnerContact[] = [];
  const blocks = html.split(/itemscope/i).slice(1);

  for (const block of blocks.slice(0, 40)) {
    const slice = block.slice(0, 4000);
    if (!/itemtype=["'][^"']*Person/i.test(slice)) continue;

    const emailMatch =
      slice.match(/itemprop=["']email["'][^>]*>([^<]+)</i) ??
      slice.match(/href=["']mailto:([^"'?]+)/i);
    const email = emailMatch?.[1]?.toLowerCase().trim() ?? "";
    if (!isValidEmail(email)) continue;

    const nameMatch = slice.match(/itemprop=["']name["'][^>]*>([^<]+)</i);
    const titleMatch = slice.match(/itemprop=["'(jobTitle|title)']['"][^>]*>([^<]+)</i);

    const raw: Omit<PartnerContact, "confidence"> = {
      name: normalizePersonName(nameMatch?.[1] ?? "") ?? "",
      title: titleMatch?.[2]?.trim() ?? "",
      email,
      linkedIn: slice.match(/https?:\/\/(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+/i)?.[0] ?? "",
      sourceUrl,
    };
    contacts.push({ ...raw, confidence: scorePartnerContact(raw, siteDomain) });
  }

  return contacts;
}

function extractCardContacts(html: string, sourceUrl: string, siteDomain: string | null): PartnerContact[] {
  const contacts: PartnerContact[] = [];
  const cardRe =
    /<(div|article|li|section)[^>]*class=["'][^"']*(?:team|member|person|partner|people|staff|profile)[^"']*["'][^>]*>([\s\S]{0,5000}?)<\/\1>/gi;
  let m: RegExpExecArray | null;

  while ((m = cardRe.exec(html)) !== null) {
    const card = m[2];
    const email =
      card.match(/mailto:([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i)?.[1]?.toLowerCase() ??
      extractObfuscatedEmails(card)[0] ??
      card.match(/[a-zA-Z0-9._%+'-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i)?.[0]?.toLowerCase();

    if (!email || !isValidEmail(email)) continue;

    const heading = card.match(/<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/i)?.[1];
    const name = normalizePersonName(heading ?? "") ?? "";
    const title =
      card.match(PARTNER_TITLE_RE)?.[0] ??
      stripTags(card).match(PARTNER_TITLE_RE)?.[0] ??
      "";

    const raw: Omit<PartnerContact, "confidence"> = {
      name,
      title: title.trim(),
      email,
      linkedIn: card.match(/https?:\/\/(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+/i)?.[0] ?? "",
      sourceUrl,
    };
    contacts.push({ ...raw, confidence: scorePartnerContact(raw, siteDomain) });
  }

  return contacts;
}

function discoverProfileUrls(html: string, origin: string): string[] {
  const urls = new Set<string>();
  const linkRe = /<a[^>]+href=["']([^"'#?][^"']*)["'][^>]*>/gi;
  let m: RegExpExecArray | null;

  while ((m = linkRe.exec(html)) !== null) {
    const href = m[1].trim();
    if (!/(team|people|partners|profile|member|bio)\//i.test(href)) continue;
    if (/\/(contact|jobs|careers|news|blog|portfolio|investments)(\/|$)/i.test(href)) continue;
    const resolved = resolveUrl(href, origin);
    if (!resolved) continue;
    try {
      const host = new URL(resolved).hostname.replace(/^www\./, "");
      const siteHost = new URL(origin).hostname.replace(/^www\./, "");
      if (host === siteHost || host.endsWith(`.${siteHost}`)) {
        const path = new URL(resolved).pathname;
        if (path.split("/").filter(Boolean).length >= 2) urls.add(resolved);
      }
    } catch {
      // skip
    }
  }

  return [...urls].slice(0, MAX_PROFILE_PAGES);
}

function extractDataAttributeEmails(html: string, sourceUrl: string, siteDomain: string | null): PartnerContact[] {
  const contacts: PartnerContact[] = [];
  const re =
    /data-(?:email|mail|contact)=["']([^"']+@[^"']+)["']|data-user=["']([^"']+@[^"']+)["']/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    const email = (m[1] ?? m[2])?.toLowerCase().trim();
    if (!email || !isValidEmail(email)) continue;
    const raw: Omit<PartnerContact, "confidence"> = {
      name: "",
      title: "",
      email,
      linkedIn: "",
      sourceUrl,
    };
    contacts.push({ ...raw, confidence: scorePartnerContact(raw, siteDomain) });
  }
  return contacts;
}

function extractEmbeddedJsEmails(html: string, sourceUrl: string, siteDomain: string | null): PartnerContact[] {
  const contacts: PartnerContact[] = [];
  const re = /["']([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})["']/g;
  let m: RegExpExecArray | null;
  const seen = new Set<string>();
  while ((m = re.exec(html)) !== null) {
    const email = m[1].toLowerCase();
    if (!isValidEmail(email) || seen.has(email)) continue;
    if (!emailMatchesDomain(email, siteDomain)) continue;
    if (!isLikelyPartnerEmail(email)) continue;
    seen.add(email);
    const raw: Omit<PartnerContact, "confidence"> = {
      name: "",
      title: "",
      email,
      linkedIn: "",
      sourceUrl,
    };
    contacts.push({ ...raw, confidence: scorePartnerContact(raw, siteDomain) });
  }
  return contacts;
}

function mergeContacts(existing: Map<string, PartnerContact>, incoming: PartnerContact[]) {
  for (const c of incoming) {
    const key = c.email.toLowerCase();
    const prev = existing.get(key);
    if (!prev) {
      existing.set(key, c);
      continue;
    }
    const score = (x: PartnerContact) =>
      (x.name ? 2 : 0) + (x.title ? 2 : 0) + (x.linkedIn ? 1 : 0) + (x.confidence === "high" ? 3 : x.confidence === "medium" ? 2 : 1);
    if (score(c) > score(prev)) existing.set(key, c);
  }
}

function formatContact(c: PartnerContact): string {
  const parts = [c.name || "Unknown", c.title, c.email, c.linkedIn].filter(Boolean);
  return parts.join(" | ");
}

async function scrapeTeamContacts(website: string): Promise<{
  contacts: PartnerContact[];
  teamPageUrl: string;
}> {
  const origin = normalizeWebsite(website);
  if (!origin) return { contacts: [], teamPageUrl: "" };

  const siteDomain = domainFromUrl(origin);
  const all = new Map<string, PartnerContact>();
  const teamUrls = new Set<string>();

  const homeHtml = await fetchPage(origin);
  if (homeHtml) {
    for (const url of discoverTeamUrls(homeHtml, origin)) {
      teamUrls.add(url);
    }
  } else {
    for (const suffix of TEAM_PATHS.slice(0, MAX_TEAM_PAGES)) {
      const resolved = resolveUrl(suffix, origin);
      if (resolved) teamUrls.add(resolved);
    }
  }

  const pages = [...teamUrls].slice(0, MAX_TEAM_PAGES);
  let primaryTeamPage = pages.find((u) => TEAM_LINK_RE.test(u)) ?? pages[0] ?? "";

  for (const pageUrl of pages) {
    const html = pageUrl === origin ? homeHtml : await fetchPage(pageUrl);
    if (!html) continue;

    mergeContacts(all, extractJsonLdPeople(html, pageUrl, siteDomain));
    mergeContacts(all, extractMailtoContacts(html, pageUrl, siteDomain));
    mergeContacts(all, extractMicrodataPeople(html, pageUrl, siteDomain));
    mergeContacts(all, extractCardContacts(html, pageUrl, siteDomain));
    mergeContacts(all, extractDataAttributeEmails(html, pageUrl, siteDomain));
    mergeContacts(all, extractEmbeddedJsEmails(html, pageUrl, siteDomain));

    for (const email of extractObfuscatedEmails(html)) {
      if (!isValidEmail(email) || !emailMatchesDomain(email, siteDomain)) continue;
      if (!isLikelyPartnerEmail(email)) continue;
      const raw: Omit<PartnerContact, "confidence"> = {
        name: "",
        title: "",
        email,
        linkedIn: "",
        sourceUrl: pageUrl,
      };
      mergeContacts(all, [{ ...raw, confidence: scorePartnerContact(raw, siteDomain) }]);
    }

    const profileUrls = discoverProfileUrls(html, origin);
    for (const profileUrl of profileUrls) {
      const profileHtml = await fetchPage(profileUrl);
      if (!profileHtml) continue;
      mergeContacts(all, extractMailtoContacts(profileHtml, profileUrl, siteDomain));
      mergeContacts(all, extractJsonLdPeople(profileHtml, profileUrl, siteDomain));
      mergeContacts(all, extractDataAttributeEmails(profileHtml, profileUrl, siteDomain));
      mergeContacts(all, extractEmbeddedJsEmails(profileHtml, profileUrl, siteDomain));
      await sleep(80);
    }

    const subLinks = discoverTeamUrls(html, origin).filter(
      (u) => u !== pageUrl && /team|people|partner/i.test(u),
    );
    for (const sub of subLinks.slice(0, 2)) {
      if (pages.length >= MAX_TEAM_PAGES + 2) break;
      if (teamUrls.has(sub)) continue;
      teamUrls.add(sub);
      pages.push(sub);
    }

    await sleep(100);
  }

  const contacts = [...all.values()]
    .filter((c) => !BLOCKED_LOCAL.has(c.email.split("@")[0] ?? ""))
    .sort((a, b) => {
      const rank = (c: PartnerContact) =>
        (c.confidence === "high" ? 3 : c.confidence === "medium" ? 2 : 1) +
        (isLikelyPartnerEmail(c.email) ? 2 : 0) +
        (c.name ? 1 : 0);
      return rank(b) - rank(a);
    });

  return { contacts, teamPageUrl: primaryTeamPage };
}

async function processRow(row: Record<string, string>): Promise<TeamEnrichedRow> {
  const website = row.Website ?? row.website ?? "";
  const { contacts, teamPageUrl } = website ? await scrapeTeamContacts(website) : { contacts: [], teamPageUrl: "" };

  const partnerEmails = contacts.filter((c) => isLikelyPartnerEmail(c.email));
  const bestPartner = partnerEmails[0] ?? contacts[0];

  const existingContact = row["Contact email"] ?? "";
  const contactEmail =
    existingContact ||
    bestPartner?.email ||
    contacts.find((c) => GENERIC_OK(c.email))?.email ||
    "";

  return {
    ...row,
    "Contact email": contactEmail,
    "Team page URL": teamPageUrl,
    "Partner count": String(partnerEmails.length || contacts.length),
    "Partner emails": (partnerEmails.length ? partnerEmails : contacts).map((c) => c.email).join("; "),
    "Partner contacts": (partnerEmails.length ? partnerEmails : contacts).map(formatContact).join(" || "),
    "Best partner email": bestPartner?.email ?? "",
    "Best partner name": bestPartner?.name ?? "",
    "Best partner title": bestPartner?.title ?? "",
    "Partner email confidence": bestPartner?.confidence ?? "none",
  };
}

function GENERIC_OK(email: string): boolean {
  const local = email.split("@")[0]?.toLowerCase() ?? "";
  return ["info", "hello", "contact", "team", "invest", "pitch"].includes(local);
}

async function runPool<T, R>(items: T[], worker: (item: T) => Promise<R>): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let next = 0;

  async function workerLoop() {
    while (true) {
      const i = next++;
      if (i >= items.length) break;
      results[i] = await worker(items[i]);
      await sleep(DELAY_BETWEEN_MS);
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, () => workerLoop()));
  return results;
}

async function main() {
  const args = process.argv.slice(2);
  const inputPath = args.find((a) => !a.startsWith("--"));
  if (!inputPath) {
    console.error(
      "Usage: npx tsx scripts/enrich-openvc-team-emails.ts <csv-path> [--limit N] [--resume]",
    );
    process.exit(1);
  }

  const limitArg = args.find((a) => a.startsWith("--limit"));
  const limit = limitArg ? parseInt(args[args.indexOf(limitArg) + 1] ?? "0", 10) : Infinity;
  const resume = args.includes("--resume");

  const resolved = path.resolve(inputPath);
  const outPath = resolved.replace(/\.csv$/i, "").replace(/ - enriched$/i, "") + " - team-enriched.csv";
  const checkpointPath = resolved.replace(/\.csv$/i, "").replace(/ - enriched$/i, "") + ".team-enrich-checkpoint.json";

  const text = fs.readFileSync(resolved, "utf8");
  const rows = parseCsv(text);
  const toProcess = limit < Infinity ? rows.slice(0, limit) : rows;

  let checkpoint: Record<number, TeamEnrichedRow> = {};
  if (resume && fs.existsSync(checkpointPath)) {
    checkpoint = JSON.parse(fs.readFileSync(checkpointPath, "utf8")) as Record<number, TeamEnrichedRow>;
    console.log(`Resuming — ${Object.keys(checkpoint).length} rows already done`);
  }

  const extraHeaders = [
    "Team page URL",
    "Partner count",
    "Partner emails",
    "Partner contacts",
    "Best partner email",
    "Best partner name",
    "Best partner title",
    "Partner email confidence",
  ];
  const baseHeaders = Object.keys(rows[0] ?? {});
  const headers = [
    ...baseHeaders.filter((h) => !extraHeaders.includes(h)),
    ...extraHeaders.filter((h) => !baseHeaders.includes(h)),
  ];
  if (!headers.includes("Contact email") && baseHeaders.includes("Contact email")) {
    const idx = headers.indexOf("Team page URL");
    headers.splice(idx, 0, "Contact email");
  }

  const pending: { index: number; row: Record<string, string> }[] = [];
  for (let i = 0; i < toProcess.length; i++) {
    if (!checkpoint[i]) pending.push({ index: i, row: toProcess[i] });
  }

  console.log(`Team scrape: ${pending.length} of ${toProcess.length} firms (${CONCURRENCY} concurrent)`);
  console.log(`Output: ${outPath}`);
  console.log(`User-Agent: ${USER_AGENT}`);

  let done = Object.keys(checkpoint).length;
  const start = Date.now();

  const batchSize = 30;
  for (let b = 0; b < pending.length; b += batchSize) {
    const batch = pending.slice(b, b + batchSize);
    await runPool(batch, async ({ index, row }) => {
      const result = await processRow(row);
      checkpoint[index] = result;
      done++;
      if (done % 10 === 0 || done === toProcess.length) {
        const elapsed = ((Date.now() - start) / 1000).toFixed(0);
        const withPartner = Object.values(checkpoint).filter((r) => r["Best partner email"]).length;
        const withTeam = Object.values(checkpoint).filter((r) => r["Team page URL"]).length;
        console.log(`[${done}/${toProcess.length}] ${withPartner} partner emails, ${withTeam} team pages — ${elapsed}s`);
        fs.writeFileSync(checkpointPath, JSON.stringify(checkpoint));
      }
      return result;
    });
    fs.writeFileSync(checkpointPath, JSON.stringify(checkpoint));
  }

  const outputRows = toProcess.map(
    (row, i) =>
      checkpoint[i] ?? {
        ...row,
        "Team page URL": "",
        "Partner count": "0",
        "Partner emails": "",
        "Partner contacts": "",
        "Best partner email": "",
        "Best partner name": "",
        "Best partner title": "",
        "Partner email confidence": "none",
      },
  );

  fs.writeFileSync(outPath, serializeCsv(outputRows, headers));

  const withPartner = outputRows.filter((r) => r["Best partner email"]).length;
  const withAny = outputRows.filter((r) => Number(r["Partner count"]) > 0).length;
  const high = outputRows.filter((r) => r["Partner email confidence"] === "high").length;

  console.log(`\nDone. Wrote ${outPath}`);
  console.log(`  ${withPartner}/${outputRows.length} firms with partner-level email`);
  console.log(`  ${withAny}/${outputRows.length} firms with any team contact`);
  console.log(`  ${high} high-confidence partner emails`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
