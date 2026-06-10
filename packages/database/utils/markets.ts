import { prisma } from "../db";
import type { Market } from "../generated/prisma/client";

export function serializeMarket(market: Market) {
  return {
    id: market.id,
    slug: market.slug,
    baseCurrency: market.baseCurrency,
    quoteCurrency: market.quoteCurrency,
    imageUrl: market.imageUrl,
    tickSize: Number(market.tickSize),
    minOrderSize: Number(market.minOrderSize),
    maxOrderSize: Number(market.maxOrderSize),
    maxLeverage: market.maxLeverage,
    makerFeeRate: Number(market.makerFeeRate),
    takerFeeRate: Number(market.takerFeeRate),
    maintenanceMarginRate: market.maintenanceMarginRate,
    initialMarginRate: market.initialMarginRate,
    isActive: market.isActive,
    createdAt: market.createdAt.toISOString(),
  };
}

export async function getMarketBySlug(slug: string) {
  return prisma.market.findUnique({ where: { slug } });
}

export async function listActiveMarkets() {
  return prisma.market.findMany({
    where: { isActive: true },
    orderBy: { slug: "asc" },
  });
}
