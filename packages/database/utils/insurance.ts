import { prisma } from "../db";
import type { InsuranceFund } from "../generated/prisma/client";

export function serializeInsuranceFund(fund: InsuranceFund, slug: string) {
  return {
    symbol: slug,
    balance: fund.balance,
    updatedAt: fund.updatedAt.toISOString(),
  };
}

export async function getInsuranceFundBySlug(slug: string) {
  return prisma.insuranceFund.findFirst({
    where: { market: { slug } },
    include: { market: true },
  });
}
