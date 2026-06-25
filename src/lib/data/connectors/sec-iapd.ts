import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { XMLParser } from "fast-xml-parser";
import { BaseConnector } from "@/lib/data/connectors/base";
import type { ConnectorResult, NormalizedFirm } from "@/lib/data/types";
import { normalizeWebsite, parseGeos } from "@/lib/data/utils/mappings";

type SecFirm = {
  Info?: { BusNm?: string; LegalNm?: string; FirmCrdNb?: string; SECNb?: string };
  MainAddr?: { City?: string; State?: string; Cntry?: string };
  Rgstn?: { FirmType?: string };
  FormInfo?: {
    Part1A?: {
      Item1?: { WebAddrs?: { WebAddr?: string | string[] } };
      Item5K?: { Q5K4?: string };
    };
  };
};

const VC_NAME = /\b(ventures?|capital partners|seed fund|early[- ]stage|startup)\b/i;
const VC_NAME_LOOSE = /\b(capital|partners)\b/i;
const EXCLUDE =
  /\b(wealth management|financial planning|retirement|insurance|accounting|advisory services|financial advisors)\b/i;

const SEC_FEED_BASE =
  "https://reports.adviserinfo.sec.gov/reports/CompilationReports/IA_FIRM_SEC_Feed";

function feedUrlForToday(): string {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${SEC_FEED_BASE}_${mm}_${dd}_${yyyy}.xml.gz`;
}

function isVcLike(firm: SecFirm): boolean {
  const name = firm.Info?.BusNm ?? firm.Info?.LegalNm ?? "";
  if (!name || EXCLUDE.test(name)) return false;

  const isEra = firm.Rgstn?.FirmType === "ERA";
  const advisesPrivateFunds = firm.FormInfo?.Part1A?.Item5K?.Q5K4 === "Y";

  if (VC_NAME.test(name)) return true;
  if (isEra && VC_NAME_LOOSE.test(name)) return true;
  if (isEra && advisesPrivateFunds) return true;
  if (advisesPrivateFunds && VC_NAME_LOOSE.test(name)) return true;

  return false;
}

function extractWebsite(firm: SecFirm): string | undefined {
  const addrs = firm.FormInfo?.Part1A?.Item1?.WebAddrs?.WebAddr;
  if (!addrs) return undefined;
  const list = Array.isArray(addrs) ? addrs : [addrs];
  const site = list.find(
    (u) =>
      u &&
      !/linkedin|instagram|facebook|twitter|youtube/i.test(u) &&
      /\.(com|vc|capital|fund|io|co)\b/i.test(u),
  );
  return normalizeWebsite(site);
}

/** SEC IAPD bulk feed — 7,000+ VC and private-fund advisers (public domain). */
export class SecIapdConnector extends BaseConnector {
  key = "sec_iapd";
  name = "SEC IAPD (Form ADV)";
  description = "7,000+ SEC-registered VC and private-fund advisers from nightly Form ADV feed";
  priority = 95;

  async fetch(options?: { limit?: number }): Promise<ConnectorResult[]> {
    const cachePath = path.join(process.cwd(), "data", "sec-iapd-feed.xml.gz");
    let gz: Buffer;

    if (fs.existsSync(cachePath)) {
      const age = Date.now() - fs.statSync(cachePath).mtimeMs;
      if (age < 24 * 60 * 60 * 1000) {
        gz = fs.readFileSync(cachePath);
      } else {
        gz = await this.downloadFeed(cachePath);
      }
    } else {
      gz = await this.downloadFeed(cachePath);
    }

    const xml = zlib.gunzipSync(gz).toString("latin1");
    const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "" });
    const doc = parser.parse(xml) as {
      IAPDFirmSECReport?: { Firms?: { Firm?: SecFirm | SecFirm[] } };
    };

    const rawFirms = doc.IAPDFirmSECReport?.Firms?.Firm;
    const firms = Array.isArray(rawFirms) ? rawFirms : rawFirms ? [rawFirms] : [];

    const results: ConnectorResult[] = [];
    const limit = options?.limit ?? Infinity;

    for (const firm of firms) {
      if (!isVcLike(firm)) continue;
      if (results.length >= limit) break;

      const name = (firm.Info?.BusNm ?? firm.Info?.LegalNm ?? "").trim();
      if (!name) continue;

      const crd = firm.Info?.FirmCrdNb;
      const normalized: NormalizedFirm = {
        externalId: `sec-iapd-${crd ?? this.slugify(name)}`,
        name,
        website: extractWebsite(firm),
        firmType: firm.Rgstn?.FirmType === "ERA" ? "vc" : "vc",
        hqCity: firm.MainAddr?.City,
        hqCountry: firm.MainAddr?.Cntry === "United States" ? "US" : firm.MainAddr?.Cntry,
        stages: [],
        sectors: [],
        geos: parseGeos(firm.MainAddr?.Cntry),
        description: `SEC-registered ${firm.Rgstn?.FirmType === "ERA" ? "exempt reporting adviser" : "investment adviser"} (Form ADV).`,
        secAdvId: firm.Info?.SECNb,
        metadata: {
          source: "sec_iapd",
          crd,
          firmType: firm.Rgstn?.FirmType,
          privateFunds: firm.FormInfo?.Part1A?.Item5K?.Q5K4 === "Y",
        },
      };

      results.push({ externalId: normalized.externalId, raw: { name, crd }, normalized });
    }

    return results;
  }

  private async downloadFeed(cachePath: string): Promise<Buffer> {
    const urls = [feedUrlForToday()];
    // Fallback: try yesterday if today's feed isn't published yet
    const d = new Date();
    d.setDate(d.getDate() - 1);
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    urls.push(`${SEC_FEED_BASE}_${mm}_${dd}_${d.getFullYear()}.xml.gz`);

    let lastErr: Error | undefined;
    for (const url of urls) {
      try {
        const res = await fetch(url, {
          headers: { "User-Agent": "CapSignal Data Pipeline (contact@getcapsignal.com)" },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const buf = Buffer.from(await res.arrayBuffer());
        fs.mkdirSync(path.dirname(cachePath), { recursive: true });
        fs.writeFileSync(cachePath, buf);
        return buf;
      } catch (e) {
        lastErr = e instanceof Error ? e : new Error(String(e));
      }
    }
    throw lastErr ?? new Error("SEC IAPD feed download failed");
  }
}

export const secIapdConnector = new SecIapdConnector();
