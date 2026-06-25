import { BaseConnector } from "@/lib/data/connectors/base";
import type { ConnectorResult, NormalizedFirm } from "@/lib/data/types";

/**
 * SEC EDGAR EFTS full-text search for Form D filings (private fund raises).
 * Form D is filed when funds raise capital under Regulation D — strong signal
 * of active deployment and fund vintage.
 *
 * @see https://www.sec.gov/edgar/search/
 */
type EftsHit = {
  _id: string;
  _source: {
    display_names?: string[];
    file_date?: string;
    form_type?: string;
    entity_name?: string;
    biz_locations?: string[];
    file_num?: string;
  };
};

type EftsResponse = {
  hits?: { hits?: EftsHit[]; total?: { value?: number } };
};

const STAGE_KEYWORDS: Record<string, string[]> = {
  pre_seed: ["pre-seed", "preseed", "angel"],
  seed: ["seed", "early stage", "early-stage"],
  series_a: ["series a", "series-a", "growth"],
  series_b: ["series b", "series-b", "late stage"],
};

function inferStages(text: string): string[] {
  const lower = text.toLowerCase();
  const stages: string[] = [];
  for (const [stage, keywords] of Object.entries(STAGE_KEYWORDS)) {
    if (keywords.some((k) => lower.includes(k))) stages.push(stage);
  }
  return stages.length ? stages : ["seed", "series_a"];
}

function inferSectors(text: string): string[] {
  const lower = text.toLowerCase();
  const map: [string, string][] = [
    ["b2b_saas", "software saas enterprise b2b"],
    ["fintech", "fintech financial payments banking"],
    ["healthtech", "health biotech medical pharma"],
    ["climate", "climate clean energy sustainability"],
    ["deep_tech", "ai machine learning robotics semiconductor"],
    ["consumer", "consumer retail marketplace"],
  ];
  const sectors: string[] = [];
  for (const [sector, keywords] of map) {
    if (keywords.split(" ").some((k) => lower.includes(k))) sectors.push(sector);
  }
  return sectors.length ? sectors : ["b2b_saas"];
}

export class SecEdgarConnector extends BaseConnector {
  key = "sec_edgar";
  name = "SEC EDGAR (Form D)";
  description = "Form D exempt offerings — fund raises and deployment signals from SEC filings";
  priority = 90;

  async fetch(options?: { limit?: number }): Promise<ConnectorResult[]> {
    const limit = options?.limit ?? 40;
    const queries = [
      "venture capital fund",
      "seed fund LP",
      "early stage venture",
    ];

    const results: ConnectorResult[] = [];
    const seen = new Set<string>();

    for (const q of queries) {
      if (results.length >= limit) break;

      const params = new URLSearchParams({
        q: `"${q}"`,
        forms: "D",
        dateRange: "custom",
        startdt: "2023-01-01",
        enddt: new Date().toISOString().slice(0, 10),
      });

      const data = await this.fetchJson<EftsResponse>(
        `https://efts.sec.gov/LATEST/search-index?${params}`,
      ).catch(() => ({ hits: { hits: [] } }));

      for (const hit of data.hits?.hits ?? []) {
        if (results.length >= limit) break;
        const src = hit._source;
        const name = src.entity_name ?? src.display_names?.[0];
        if (!name || seen.has(name)) continue;
        seen.add(name);

        const location = src.biz_locations?.[0] ?? "";
        const textBlob = `${name} ${q} venture capital fund`;
        const normalized: NormalizedFirm = {
          externalId: `sec-formd-${hit._id}`,
          name: name.trim(),
          firmType: "vc",
          hqCity: location.split(",")[0]?.trim(),
          hqCountry: location.includes("US") || /,\s*[A-Z]{2}$/.test(location) ? "US" : undefined,
          stages: inferStages(textBlob),
          sectors: inferSectors(textBlob),
          geos: ["US"],
          description: `SEC Form D filing (${src.form_type ?? "D"}) on ${src.file_date ?? "unknown date"}. Active fund raise signal.`,
          metadata: {
            formType: src.form_type,
            fileDate: src.file_date,
            fileNum: src.file_num,
            source: "sec_edgar_efts",
          },
        };

        results.push({ externalId: normalized.externalId, raw: hit, normalized });
      }
    }

    return results;
  }
}

export const secEdgarConnector = new SecEdgarConnector();
