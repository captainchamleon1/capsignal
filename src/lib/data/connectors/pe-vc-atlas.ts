import path from "node:path";
import { BaseConnector } from "@/lib/data/connectors/base";
import type { ConnectorResult, NormalizedFirm } from "@/lib/data/types";
import { loadCsvFromFile, loadCsvFromUrl, parseCsv } from "@/lib/data/utils/csv-parse";
import {
  normalizeWebsite,
  parseFirmType,
  parseGeos,
  parseSectors,
  parseStages,
} from "@/lib/data/utils/mappings";

/** CC BY 4.0 — Imergea PE/VC Atlas (~4,400 firms). https://github.com/Imergea-com/private-equity-venture-capital-atlas */
const ATLAS_URL =
  "https://raw.githubusercontent.com/Imergea-com/private-equity-venture-capital-atlas/main/atlas.csv";

export class PeVcAtlasConnector extends BaseConnector {
  key = "pe_vc_atlas";
  name = "PE/VC Atlas";
  description = "4,400+ global PE and VC firms (Imergea Atlas, CC BY 4.0)";
  priority = 85;

  async fetch(options?: { limit?: number }): Promise<ConnectorResult[]> {
    const localPath = path.join(process.cwd(), "data", "atlas.csv");
    let text: string;
    try {
      text = await loadCsvFromFile(localPath);
    } catch {
      text = await loadCsvFromUrl(ATLAS_URL);
    }

    const rows = parseCsv(text);
    const limit = options?.limit ?? rows.length;
    const results: ConnectorResult[] = [];

    for (const row of rows.slice(0, limit)) {
      const name = row.company?.trim();
      if (!name) continue;

      const sectorText = `${row["Sector Focus"] ?? ""} ${row.Description ?? ""}`;
      const normalized: NormalizedFirm = {
        externalId: `atlas-${this.slugify(name)}`,
        name,
        website: normalizeWebsite(row.Website),
        firmType: parseFirmType(sectorText),
        hqCity: row.City?.split("(")[0]?.trim(),
        hqCountry: row["Country Full Name"]?.trim() || row["Country "]?.trim(),
        stages: parseStages(sectorText),
        sectors: parseSectors(sectorText),
        geos: parseGeos(row["Country Full Name"], row.Region),
        description: row.Description?.trim(),
        metadata: { source: "pe_vc_atlas", region: row.Region },
      };

      results.push({ externalId: normalized.externalId, raw: row, normalized });
    }

    return results;
  }
}

export const peVcAtlasConnector = new PeVcAtlasConnector();
