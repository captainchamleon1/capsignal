import "dotenv/config";
import { db } from "../src/lib/db";
import { computeFirmSignals } from "../src/lib/data/scoring/signals";

async function main() {
  const firms = await db.investorFirm.findMany({ select: { id: true } });
  console.log(`Computing signals for ${firms.length} firms…`);

  let i = 0;
  for (const { id } of firms) {
    await computeFirmSignals(id);
    i++;
    if (i % 500 === 0) console.log(`${i}/${firms.length}`);
  }

  console.log("Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
