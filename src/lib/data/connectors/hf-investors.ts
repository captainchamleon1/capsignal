import path from "node:path";
import { BaseConnector } from "@/lib/data/connectors/base";
import type { ConnectorResult, NormalizedFirm } from "@/lib/data/types";
import { loadCsvFromFile, loadCsvFromUrl, parseCsv } from "@/lib/data/utils/csv-parse";
import {
  normalizeWebsite,
  parseFirmType,
  parseSectors,
  parseStages,
} from "@/lib/data/utils/mappings";

/** MIT — Hugging Face startup investor dataset (~2,500 firms). */
const HF_URL =
  "https://huggingface.co/datasets/IqraSAYEDhassan/startup-investor-and-accelerator-dataset/resolve/main/investors_CLEAN.csv";

export class HfInvestorsConnector extends BaseConnector {
  key = "hf_investors";
  name = "Startup investor dataset";
  description = "2,500+ global VCs, angels, and accelerators (Hugging Face, MIT)";
  priority = 80;

  async fetch(options?: { limit?: number }): Promise<ConnectorResult[]> {
    const localPath = path.join(process.cwd(), "data", "investors_CLEAN.csv");
    let text: string;
    try {
      text = await loadCsvFromFile(localPath);
    } catch {
      text = await loadCsvFromUrl(HF_URL);
    }

    const rows = parseCsv(text);
    const limit = options?.limit ?? rows.length;
    const results: ConnectorResult[] = [];

    for (const row of rows.slice(0, limit)) {
      const name = row["Investor Name"]?.trim();
      if (!name || name === ".") continue;

      const sectorText = `${row["Fund Focus (Sectors)"] ?? ""} ${row["Fund Type"] ?? ""}`;
      const normalized: NormalizedFirm = {
        externalId: `hf-${this.slugify(name)}`,
        name,
        website: normalizeWebsite(row.Website),
        firmType: parseFirmType(row["Fund Type"] ?? "Venture Fund"),
        stages: parseStages(row["Fund Stage"] ?? sectorText),
        sectors: parseSectors(sectorText),
        geos: [],
        description: `${row["Fund Type"] ?? "Investor"} — ${row["Fund Stage"] ?? "multi-stage"}`,
        metadata: { source: "hf_investors" },
      };

      results.push({ externalId: normalized.externalId, raw: row, normalized });
    }

    return results;
  }
}

export const hfInvestorsConnector = new HfInvestorsConnector();
