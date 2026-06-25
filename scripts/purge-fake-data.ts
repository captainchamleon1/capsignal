import { db } from "@/lib/db";

const FICTIONAL_FIRM_NAMES = [
  "Horizon Capital",
  "Northwind Ventures",
  "Basecamp Fund",
  "Summit Partners",
  "Lattice Ventures",
];

async function main() {
  const fictional = await db.investorFirm.findMany({
    where: {
      OR: [
        { website: { contains: ".example" } },
        { name: { in: FICTIONAL_FIRM_NAMES } },
      ],
    },
    select: { id: true, name: true },
  });

  if (fictional.length) {
    const ids = fictional.map((f) => f.id);
    await db.investment.deleteMany({ where: { firmId: { in: ids } } });
    await db.investorPerson.deleteMany({ where: { firmId: { in: ids } } });
    await db.signal.deleteMany({ where: { firmId: { in: ids } } });
    await db.entityAlias.deleteMany({ where: { firmId: { in: ids } } });
    await db.campaignInvestor.deleteMany({ where: { firmId: { in: ids } } });
    await db.investorFirm.deleteMany({ where: { id: { in: ids } } });
    console.log(`Removed ${fictional.length} fictional firm(s):`, fictional.map((f) => f.name).join(", "));
  } else {
    console.log("No fictional firms found in database.");
  }

  const curatedSource = await db.dataSource.findUnique({ where: { key: "curated_vcs" } });
  if (curatedSource) {
    await db.ingestJob.deleteMany({ where: { sourceId: curatedSource.id } });
    await db.dataSource.delete({ where: { id: curatedSource.id } });
    console.log("Removed curated_vcs data source.");
  }

  const remaining = await db.investorFirm.count();
  console.log(`\n${remaining.toLocaleString()} investor firms remain.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
