import { hfInvestorsConnector } from "@/lib/data/connectors/hf-investors";
import { peVcAtlasConnector } from "@/lib/data/connectors/pe-vc-atlas";
import { secEdgarConnector } from "@/lib/data/connectors/sec-edgar";
import { secIapdConnector } from "@/lib/data/connectors/sec-iapd";
import type { DataConnector } from "@/lib/data/types";
import { db } from "@/lib/db";
import { upsertFirmFromNormalized } from "@/lib/data/pipeline/normalizer";
import { computeFirmSignals } from "@/lib/data/scoring/signals";

/** Connectors ordered by priority — bulk sources first, enrichment last. */
export const connectors: DataConnector[] = [
  secIapdConnector,
  peVcAtlasConnector,
  hfInvestorsConnector,
  secEdgarConnector,
];

export async function runIngest(options?: {
  sourceKeys?: string[];
  limit?: number;
  bulk?: boolean;
  skipSignals?: boolean;
}) {
  const keys = options?.sourceKeys;
  const bulk = options?.bulk ?? false;
  const active = connectors.filter((c) => !keys?.length || keys.includes(c.key));

  const summary: { source: string; new: number; updated: number; errors: number; total: number }[] =
    [];
  const touchedFirmIds = new Set<string>();

  for (const connector of active.sort((a, b) => b.priority - a.priority)) {
    let source = await db.dataSource.findUnique({ where: { key: connector.key } });
    if (!source) {
      source = await db.dataSource.create({
        data: {
          key: connector.key,
          name: connector.name,
          description: connector.description,
          priority: connector.priority,
        },
      });
    }

    const job = await db.ingestJob.create({
      data: { sourceId: source.id, status: "running", startedAt: new Date() },
    });

    let recordsNew = 0;
    let recordsUpdated = 0;
    let errors = 0;

    try {
      const results = await connector.fetch({ limit: options?.limit });
      console.log(`[ingest] ${connector.key}: ${results.length} records`);

      for (const result of results) {
        try {
          if (!bulk) {
            await db.ingestRecord.create({
              data: {
                jobId: job.id,
                externalId: result.externalId,
                rawPayload: JSON.stringify(result.raw),
                normalized: JSON.stringify(result.normalized),
                status: "pending",
              },
            });
          }

          const { firmId, isNew } = await upsertFirmFromNormalized(
            result.normalized,
            connector.key,
          );
          touchedFirmIds.add(firmId);
          if (isNew) recordsNew++;
          else recordsUpdated++;

          if (!bulk) {
            await db.ingestRecord.updateMany({
              where: { jobId: job.id, externalId: result.externalId },
              data: { status: "processed", firmId },
            });
          }
        } catch (err) {
          errors++;
          if (!bulk) {
            await db.ingestRecord.updateMany({
              where: { jobId: job.id, externalId: result.externalId },
              data: {
                status: "error",
                error: err instanceof Error ? err.message : "Unknown error",
              },
            });
          }
        }
      }

      await db.ingestJob.update({
        where: { id: job.id },
        data: {
          status: "completed",
          recordsFound: results.length,
          recordsNew,
          recordsUpdated,
          completedAt: new Date(),
        },
      });

      await db.dataSource.update({
        where: { id: source.id },
        data: { lastSyncAt: new Date() },
      });
    } catch (err) {
      await db.ingestJob.update({
        where: { id: job.id },
        data: {
          status: "failed",
          error: err instanceof Error ? err.message : "Unknown error",
          completedAt: new Date(),
        },
      });
      errors++;
    }

    summary.push({
      source: connector.key,
      new: recordsNew,
      updated: recordsUpdated,
      errors,
      total: recordsNew + recordsUpdated,
    });
  }

  // Refresh signals only for firms touched in this run (skip during bulk — run data:signals after)
  if (!options?.skipSignals) {
    console.log(`[ingest] Computing signals for ${touchedFirmIds.size} firms…`);
    let i = 0;
    for (const firmId of touchedFirmIds) {
      await computeFirmSignals(firmId);
      i++;
      if (i % 500 === 0) console.log(`[ingest] Signals: ${i}/${touchedFirmIds.size}`);
    }
  } else {
    console.log(`[ingest] Skipped signal refresh for ${touchedFirmIds.size} firms (run data:signals)`);
  }

  return summary;
}
