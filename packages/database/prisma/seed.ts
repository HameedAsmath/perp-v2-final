import { prisma } from "../db";

async function main() {
  await prisma.market.upsert({
    where: { slug: "BTC-PERP" },
    update: {},
    create: {
      slug: "BTC-PERP",
      baseCurrency: "BTC",
      quoteCurrency: "USDT",
      tickSize: 1n,
      minOrderSize: 1n,
      maxOrderSize: 1_000_000n,
      maxLeverage: 100,
      makerFeeRate: 0n,
      takerFeeRate: 0n,
      maintenanceMarginRate: 50, // 0.5%
      initialMarginRate: 100, // 1%
    },
  });
}
main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
