import type { NormalizedFirm } from "@/lib/data/types";
import { db } from "@/lib/db";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

export async function upsertFirmFromNormalized(
  firm: NormalizedFirm,
  source: string,
): Promise<{ firmId: string; isNew: boolean }> {
  const slug = slugify(firm.name);

  const existing = await db.investorFirm.findFirst({
    where: {
      OR: [
        { slug },
        { name: firm.name },
        ...(firm.cik ? [{ cik: firm.cik }] : []),
      ],
    },
  });

  const dataQuality = scoreDataQuality(firm);

  const base = {
    name: firm.name,
    website: firm.website,
    hqCity: firm.hqCity,
    hqCountry: firm.hqCountry,
    firmType: firm.firmType,
    aumUsd: firm.metadata?.aumUsd as number | undefined,
    checkMinUsd: firm.checkMinUsd,
    checkMaxUsd: firm.checkMaxUsd,
    stages: JSON.stringify(firm.stages),
    sectors: JSON.stringify(firm.sectors),
    geos: JSON.stringify(firm.geos),
    description: firm.description,
    cik: firm.cik,
    secAdvId: firm.secAdvId,
    dataQuality,
    lastEnrichedAt: new Date(),
  };

  let firmId: string;
  let isNew = false;

  if (existing) {
    await db.investorFirm.update({ where: { id: existing.id }, data: base });
    firmId = existing.id;
  } else {
    const created = await db.investorFirm.create({
      data: { ...base, slug },
    });
    firmId = created.id;
    isNew = true;
  }

  await db.entityAlias.upsert({
    where: { alias_source: { alias: firm.name, source } },
    create: { alias: firm.name, source, firmId, confidence: 1 },
    update: { firmId, confidence: 1 },
  });

  if (firm.people?.length) {
    for (const person of firm.people) {
      const match = await db.investorPerson.findFirst({
        where: { firmId, name: person.name },
      });
      if (match) {
        await db.investorPerson.update({
          where: { id: match.id },
          data: {
            title: person.title,
            isPartner: person.isPartner ?? false,
            linkedInUrl: person.linkedInUrl,
          },
        });
      } else {
        await db.investorPerson.create({
          data: {
            firmId,
            name: person.name,
            title: person.title,
            isPartner: person.isPartner ?? false,
            linkedInUrl: person.linkedInUrl,
          },
        });
      }
    }
  }

  if (firm.investments?.length) {
    for (const inv of firm.investments) {
      const exists = await db.investment.findFirst({
        where: { firmId, companyName: inv.companyName },
      });
      if (!exists) {
        await db.investment.create({
          data: {
            firmId,
            companyName: inv.companyName,
            companySector: inv.companySector,
            companyStage: inv.companyStage,
            announcedAt: inv.announcedAt,
            amountUsd: inv.amountUsd,
            isLead: inv.isLead ?? false,
            sourceUrl: inv.sourceUrl,
            sourceType: inv.sourceType,
          },
        });
      }
    }
  }

  return { firmId, isNew };
}

function scoreDataQuality(firm: NormalizedFirm): number {
  let score = 30;
  if (firm.website) score += 10;
  if (firm.checkMinUsd && firm.checkMaxUsd) score += 15;
  if (firm.description) score += 10;
  if (firm.people?.length) score += 15;
  if (firm.investments?.length) score += 20;
  return Math.min(100, score);
}
