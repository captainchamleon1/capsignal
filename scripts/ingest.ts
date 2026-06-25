import "dotenv/config";
import { runIngest } from "../src/lib/data/pipeline/orchestrator";
import { db } from "../src/lib/db";

const args = process.argv.slice(2);
const bulk = args.includes("--bulk") || args.length === 0;
const sourceKeys = args.filter((a) => !a.startsWith("--"));

async function main() {
  console.log(
    bulk ? "Bulk ingest (all sources, no per-row limit)…" : `Ingest: ${sourceKeys.join(", ") || "all"}`,
  );

  const summary = await runIngest({
    sourceKeys: sourceKeys.length ? sourceKeys : undefined,
    bulk,
    limit: bulk ? undefined : 100,
    skipSignals: bulk,
  });

  console.table(summary);

  const firms = await db.investorFirm.count();
  console.log(`Total investor firms in database: ${firms.toLocaleString()}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
