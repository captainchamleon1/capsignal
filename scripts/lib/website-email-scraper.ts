/** Shared website fetch + email validation for OpenVC enrichment scripts. */

export const USER_AGENT = "CapSignal Email Enrichment (contact@getcapsignal.com)";
export const FETCH_TIMEOUT_MS = 15_000;

export const EMAIL_RE = /[a-zA-Z0-9._%+'-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

export const BLOCKED_LOCAL = new Set([
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
  "info",
  "hello",
  "contact",
  "team",
  "office",
  "enquiries",
  "inquiries",
  "general",
]);

export const GENERIC_LOCAL = new Set([
  "info",
  "hello",
  "contact",
  "team",
  "office",
  "enquiries",
  "inquiries",
  "general",
  "mail",
  "email",
  "reach",
  "connect",
  "invest",
  "investments",
  "investing",
  "deals",
  "pitch",
  "founders",
  "partners",
  "partner",
  "apply",
  "ideas",
  "submissions",
  "talent",
  "pitch",
  "deal",
  "deals",
]);

export const BLOCKED_DOMAINS = [
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

export const PARTNER_TITLE_RE =
  /\b(managing\s+partner|general\s+partner|founding\s+partner|partner|principal|venture\s+partner|investment\s+director|associate|analyst|gp|mp)\b/i;

export function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export function normalizeWebsite(raw?: string): string | null {
  if (!raw?.trim()) return null;
  let u = raw.trim();
  if (!/^https?:\/\//i.test(u)) u = `https://${u}`;
  try {
    return new URL(u).origin;
  } catch {
    return null;
  }
}

export function domainFromUrl(origin: string): string | null {
  try {
    return new URL(origin).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return null;
  }
}

export function resolveUrl(href: string, origin: string): string | null {
  try {
    const u = new URL(href, origin);
    if (!/^https?:$/i.test(u.protocol)) return null;
    u.hash = "";
    return u.toString().replace(/\/$/, "");
  } catch {
    return null;
  }
}

export function decodeHtmlEntities(s: string): string {
  return s
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ");
}

export function stripTags(html: string): string {
  return decodeHtmlEntities(html.replace(/<[^>]+>/g, " "));
}

export function isValidEmail(email: string): boolean {
  const lower = email.toLowerCase().trim();
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

export function emailMatchesDomain(email: string, siteDomain: string | null): boolean {
  if (!siteDomain) return false;
  const domain = email.split("@")[1]?.toLowerCase();
  return domain === siteDomain || domain?.endsWith(`.${siteDomain}`) === true;
}

export function isLikelyPartnerEmail(email: string): boolean {
  const local = email.split("@")[0]?.toLowerCase() ?? "";
  if (GENERIC_LOCAL.has(local)) return false;
  if (local.includes("partner") && local.length > 10) return true;
  if (/^[a-z][a-z0-9]*\.[a-z][a-z0-9]+$/.test(local)) return true;
  if (/^[a-z][a-z0-9]{1,20}$/.test(local) && local.length >= 3) return true;
  return false;
}

export function normalizePersonName(raw: string): string | null {
  const name = stripTags(raw)
    .replace(/\s+/g, " ")
    .replace(/[|•·–—].*$/, "")
    .trim();
  if (name.length < 3 || name.length > 60) return null;
  if (/^(read more|contact|email|linkedin|twitter|view profile|learn more)$/i.test(name)) return null;
  if (/@|https?:/i.test(name)) return null;
  if (!/[A-Za-z]/.test(name)) return null;
  const words = name.split(" ").filter(Boolean);
  if (words.length < 2 || words.length > 5) return null;
  if (words.some((w) => w.length > 25)) return null;
  return name;
}

export async function fetchPage(url: string): Promise<string | null> {
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
    return (await res.text()).slice(0, 800_000);
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export function extractObfuscatedEmails(text: string): string[] {
  const found: string[] = [];
  const atPatterns = [
    /([a-zA-Z0-9._%+-]+)\s*(?:@|\[at\]|\(at\)|&#64;| at )\s*([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/gi,
  ];
  for (const re of atPatterns) {
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
      const email = `${m[1]}@${m[2]}`.toLowerCase();
      if (isValidEmail(email)) found.push(email);
    }
  }
  return found;
}

export function serializeCsv(rows: Record<string, string>[], headers: string[]): string {
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
