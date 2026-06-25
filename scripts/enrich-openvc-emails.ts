/**
 * Enrich OpenVC CSV with contact emails scraped from firm websites.
 *
 * Usage:
 *   npx tsx scripts/enrich-openvc-emails.ts "path/to/openvc.csv"
 *   npx tsx scripts/enrich-openvc-emails.ts "path/to/openvc.csv" --limit 50
 *   npx tsx scripts/enrich-openvc-emails.ts "path/to/openvc.csv" --resume
 */

import fs from "node:fs";
import path from "node:path";
import { parseCsv } from "../src/lib/data/utils/csv-parse";

const USER_AGENT = "CapSignal Email Enrichment (contact@getcapsignal.com)";
const FETCH_TIMEOUT_MS = 12_000;
const CONCURRENCY = 8;
const DELAY_BETWEEN_MS = 200;

const CONTACT_PATHS = [
  "",
  "/contact",
  "/contact-us",
  "/team",
  "/people",
  "/about",
  "/about-us",
  "/connect",
  "/get-in-touch",
];

const EMAIL_RE = /[a-zA-Z0-9._%+'-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

const BLOCKED_LOCAL = new Set([
  "noreply",
  "no-reply",
  "donotreply",
  "do-not-reply",
  "mailer-daemon",
  "postmaster",
  "webmaster",
  "sentry",
  "wixpress",
  "example",
  "test",
  "privacy",
  "abuse",
  "support",
  "help",
  "newsletter",
  "unsubscribe",
  "billing",
  "sales",
  "jobs",
  "careers",
  "hr",
  "recruiting",
  "press",
  "media",
  "legal",
  "compliance",
  "security",
  "admin",
  "root",
  "hostmaster",
  "dmca",
]);

const PREFERRED_LOCAL = new Set([
  "hello",
  "hi",
  "info",
  "contact",
  "team",
  "invest",
  "investments",
  "investing",
  "deal",
  "deals",
  "pitch",
  "founders",
  "partners",
  "partner",
  "general",
  "office",
  "reach",
  "connect",
]);

const BLOCKED_DOMAINS = [
  "sentry.io",
  "wix.com",
  "wixpress.com",
  "example.com",
  "email.com",
  "domain.com",
  "yourcompany.com",
  "company.com",
  "test.com",
  "schema.org",
  "gravatar.com",
  "cloudflare.com",
  "google.com",
  "facebook.com",
  "twitter.com",
  "linkedin.com",
  "instagram.com",
  "youtube.com",
  "github.com",
  "apple.com",
  "microsoft.com",
  "gmail.com",
  "yahoo.com",
  "hotmail.com",
  "outlook.com",
  "protonmail.com",
  "calendly.com",
  "typeform.com",
  "hubspot.com",
  "mailchimp.com",
  "squarespace.com",
  "wordpress.com",
  "shopify.com",
  "notion.so",
  "figma.com",
];

type EmailHit = {
  email: string;
  sourceUrl: string;
  score: number;
};

type EnrichedRow = Record<string, string> & {
  "Contact email": string;
  "All emails found": string;
  "Email source URL": string;
  "Email confidence": string;
};

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function normalizeWebsite(raw?: string): string | null {
  if (!raw?.trim()) return null;
  let u = raw.trim();
  if (!/^https?:\/\//i.test(u)) u = `https://${u}`;
  try {
    const parsed = new URL(u);
    return parsed.origin;
  } catch {
    return null;
  }
}

function domainFromUrl(origin: string): string | null {
  try {
    return new URL(origin).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return null;
  }
}

function decodeHtmlEntities(s: string): string {
  return s
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/&amp;/g, "&");
}

function extractEmails(html: string): string[] {
  const found = new Set<string>();

  const mailtoRe = /mailto:([a-zA-Z0-9._%+'-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/gi;
  let m: RegExpExecArray | null;
  while ((m = mailtoRe.exec(html)) !== null) {
    found.add(decodeHtmlEntities(m[1]).toLowerCase());
  }

  const text = decodeHtmlEntities(html.replace(/<[^>]+>/g, " "));
  const matches = text.match(EMAIL_RE) ?? [];
  for (const email of matches) {
    found.add(email.toLowerCase());
  }

  return [...found].filter(isValidEmail);
}

function isValidEmail(email: string): boolean {
  const lower = email.toLowerCase();
  if (lower.length > 80 || lower.length < 6) return false;
  if (/\.(png|jpg|jpeg|gif|svg|webp|css|js)$/i.test(lower)) return false;
  if (lower.includes("..") || lower.startsWith(".") || lower.endsWith(".")) return false;

  const [local, domain] = lower.split("@");
  if (!local || !domain || !domain.includes(".")) return false;
  if (BLOCKED_LOCAL.has(local)) return false;
  if (BLOCKED_DOMAINS.some((d) => domain === d || domain.endsWith(`.${d}`))) return false;
  if (/^(u003e|u003c|3d)/.test(local)) return false;

  return true;
}

function scoreEmail(email: string, siteDomain: string | null, path: string): number {
  const [local, domain] = email.split("@");
  let score = 10;

  if (siteDomain && (domain === siteDomain || domain.endsWith(`.${siteDomain}`))) {
    score += 50;
  } else {
    score -= 30;
  }

  if (PREFERRED_LOCAL.has(local)) score += 25;
  if (local.includes("partner") || local.includes("invest")) score += 15;

  if (path.includes("contact")) score += 20;
  else if (path.includes("team") || path.includes("people")) score += 15;
  else if (path === "" || path === "/") score += 5;

  return score;
}

async function fetchPage(url: string): Promise<string | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "text/html,application/xhtml+xml",
      },
      redirect: "follow",
    });
    if (!res.ok) return null;
    const type = res.headers.get("content-type") ?? "";
    if (!type.includes("text/html") && !type.includes("application/xhtml")) return null;
    const text = await res.text();
    return text.slice(0, 500_000);
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

async function findEmailsForSite(website: string): Promise<EmailHit[]> {
  const origin = normalizeWebsite(website);
  if (!origin) return [];

  const siteDomain = domainFromUrl(origin);
  const hits = new Map<string, EmailHit>();

  for (const suffix of CONTACT_PATHS) {
    const pageUrl = suffix ? `${origin}${suffix}` : origin;
    const html = await fetchPage(pageUrl);
    if (!html) continue;

    const emails = extractEmails(html);
    for (const email of emails) {
      const score = scoreEmail(email, siteDomain, suffix);
      const existing = hits.get(email);
      if (!existing || score > existing.score) {
        hits.set(email, { email, sourceUrl: pageUrl, score });
      }
    }

    if (hits.size > 0 && [...hits.values()].some((h) => h.score >= 70)) break;
    await sleep(80);
  }

  return [...hits.values()].sort((a, b) => b.score - a.score);
}

function confidenceLabel(topScore: number): string {
  if (topScore >= 75) return "high";
  if (topScore >= 50) return "medium";
  if (topScore >= 25) return "low";
  return "none";
}

function serializeCsv(rows: Record<string, string>[], headers: string[]): string {
  const escape = (val: string) => {
    if (/[",\n\r]/.test(val)) return `"${val.replace(/"/g, '""')}"`;
    return val;
  };
  const lines = [headers.map(escape).join(",")];
  for (const row of rows) {
    lines.push(headers.map((h) => escape(row[h] ?? "")).join(","));
  }
  return lines.join("\n");
}

async function processRow(row: Record<string, string>): Promise<EnrichedRow> {
  const website = row.Website ?? row.website ?? "";
  const hits = website ? await findEmailsForSite(website) : [];
  const best = hits[0];

  return {
    ...row,
    "Contact email": best?.email ?? "",
    "All emails found": hits.map((h) => h.email).join("; "),
    "Email source URL": best?.sourceUrl ?? "",
    "Email confidence": best ? confidenceLabel(best.score) : "none",
  };
}

async function runPool<T, R>(items: T[], worker: (item: T, index: number) => Promise<R>): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let next = 0;

  async function workerLoop() {
    while (true) {
      const i = next++;
      if (i >= items.length) break;
      results[i] = await worker(items[i], i);
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
    console.error("Usage: npx tsx scripts/enrich-openvc-emails.ts <csv-path> [--limit N] [--resume]");
    process.exit(1);
  }

  const limitArg = args.find((a) => a.startsWith("--limit"));
  const limit = limitArg ? parseInt(args[args.indexOf(limitArg) + 1] ?? "0", 10) : Infinity;
  const resume = args.includes("--resume");

  const resolved = path.resolve(inputPath);
  const outPath = resolved.replace(/\.csv$/i, " - enriched.csv");
  const checkpointPath = resolved.replace(/\.csv$/i, ".enrich-checkpoint.json");

  const text = fs.readFileSync(resolved, "utf8");
  const rows = parseCsv(text);
  const toProcess = limit < Infinity ? rows.slice(0, limit) : rows;

  let checkpoint: Record<number, EnrichedRow> = {};
  if (resume && fs.existsSync(checkpointPath)) {
    checkpoint = JSON.parse(fs.readFileSync(checkpointPath, "utf8")) as Record<number, EnrichedRow>;
    console.log(`Resuming — ${Object.keys(checkpoint).length} rows already done`);
  }

  const extraHeaders = ["Contact email", "All emails found", "Email source URL", "Email confidence"];
  const baseHeaders = Object.keys(rows[0] ?? {});
  const headers = [...baseHeaders, ...extraHeaders.filter((h) => !baseHeaders.includes(h))];

  const pending: { index: number; row: Record<string, string> }[] = [];
  for (let i = 0; i < toProcess.length; i++) {
    if (!checkpoint[i]) pending.push({ index: i, row: toProcess[i] });
  }

  console.log(`Enriching ${pending.length} of ${toProcess.length} firms (${CONCURRENCY} concurrent)…`);
  console.log(`Output: ${outPath}`);

  let done = Object.keys(checkpoint).length;
  const start = Date.now();

  const batchSize = 50;
  for (let b = 0; b < pending.length; b += batchSize) {
    const batch = pending.slice(b, b + batchSize);
    const enriched = await runPool(batch, async ({ index, row }) => {
      const result = await processRow(row);
      checkpoint[index] = result;
      done++;
      if (done % 25 === 0 || done === toProcess.length) {
        const elapsed = ((Date.now() - start) / 1000).toFixed(0);
        const withEmail = Object.values(checkpoint).filter((r) => r["Contact email"]).length;
        console.log(`[${done}/${toProcess.length}] ${withEmail} with email — ${elapsed}s`);
        fs.writeFileSync(checkpointPath, JSON.stringify(checkpoint));
      }
      return { index, result };
    });

    for (const { index, result } of enriched) {
      checkpoint[index] = result;
    }
    fs.writeFileSync(checkpointPath, JSON.stringify(checkpoint));
  }

  const outputRows: EnrichedRow[] = toProcess.map((row, i) => checkpoint[i] ?? {
    ...row,
    "Contact email": "",
    "All emails found": "",
    "Email source URL": "",
    "Email confidence": "none",
  });

  fs.writeFileSync(outPath, serializeCsv(outputRows, headers));

  const withEmail = outputRows.filter((r) => r["Contact email"]).length;
  const high = outputRows.filter((r) => r["Email confidence"] === "high").length;
  const medium = outputRows.filter((r) => r["Email confidence"] === "medium").length;

  console.log(`\nDone. Wrote ${outPath}`);
  console.log(`  ${withEmail}/${outputRows.length} firms with at least one email (${((withEmail / outputRows.length) * 100).toFixed(1)}%)`);
  console.log(`  high confidence: ${high}, medium: ${medium}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
