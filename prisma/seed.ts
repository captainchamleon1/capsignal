import { db } from "@/lib/db";
import { runIngest } from "@/lib/data/pipeline/orchestrator";

async function main() {
  console.log("Registering data sources…");
  const sources = [
    {
      key: "sec_iapd",
      name: "SEC IAPD (Form ADV)",
      description: "7,000+ VC and private-fund advisers from SEC nightly feed",
      priority: 95,
    },
    {
      key: "pe_vc_atlas",
      name: "PE/VC Atlas",
      description: "4,400+ global PE/VC firms (CC BY 4.0)",
      priority: 85,
    },
    {
      key: "hf_investors",
      name: "Startup investor dataset",
      description: "2,500+ VCs and accelerators (MIT)",
      priority: 80,
    },
    {
      key: "sec_edgar",
      name: "SEC EDGAR (Form D)",
      description: "Form D exempt offerings from SEC filings",
      priority: 70,
    },
  ];

  for (const s of sources) {
    await db.dataSource.upsert({
      where: { key: s.key },
      create: s,
      update: s,
    });
  }

  console.log("Running bulk investor ingest (this may take a few minutes)…");
  const summary = await runIngest({ bulk: true, skipSignals: true });
  console.table(summary);

  const firmCount = await db.investorFirm.count();
  const signalCount = await db.signal.count();
  console.log(`\nDatabase ready: ${firmCount.toLocaleString()} investor firms, ${signalCount.toLocaleString()} signals`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
