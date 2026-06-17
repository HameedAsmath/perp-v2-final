import { prisma, getMarketId } from "database";

const cache = new Map<string, number>(); // symbol → balance

export function resetInsuranceCache() {
  cache.clear();
}

async function ensureFund(marketId: string) {
  return prisma.insuranceFund.upsert({
    where: { marketId },
    create: { marketId, balance: 0 },
    update: {},
  });
}

export async function getInsuranceBalance(symbol: string): Promise<number> {
  const hit = cache.get(symbol);
  if (hit !== undefined) return hit;

  const marketId = await getMarketId(symbol);
  const fund = await ensureFund(marketId);
  cache.set(symbol, fund.balance);
  return fund.balance;
}

export async function creditInsurance(
  symbol: string,
  amount: number,
  reason: string,
  userId?: string,
) {
  if (amount <= 0) return;
  const marketId = await getMarketId(symbol);
  await ensureFund(marketId);

  const fund = await prisma.insuranceFund.update({
    where: { marketId },
    data: { balance: { increment: amount } },
  });

  await prisma.insuranceLedgerEntry.create({
    data: { marketId, amount, reason, userId },
  });

  cache.set(symbol, fund.balance);
}

/** Returns shortfall still uncovered after insurance pays */
export async function debitInsurance(
  symbol: string,
  amount: number,
  reason: string,
  userId?: string,
): Promise<number> {
  if (amount <= 0) return 0;

  const marketId = await getMarketId(symbol);
  const fund = await ensureFund(marketId);
  const paid = Math.min(fund.balance, amount);

  if (paid > 0) {
    const updated = await prisma.insuranceFund.update({
      // updating the current balance
      where: { marketId },
      data: { balance: { increment: -paid } },
    });
    await prisma.insuranceLedgerEntry.create({
      // for history(insuranceLedgerEntry table)
      data: { marketId, amount: -paid, reason, userId },
    });
    cache.set(symbol, updated.balance);
  }

  return amount - paid;
}

export async function resetInsurance() {
  await prisma.insuranceLedgerEntry.deleteMany();
  await prisma.insuranceFund.deleteMany();
  cache.clear();
}
