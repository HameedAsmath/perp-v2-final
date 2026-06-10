import { prisma } from "../db";
import type { Order } from "../generated/prisma/client";

const marketCache = new Map<string, string>();

export async function getMarketId(symbol: string): Promise<string> {
  const cached = marketCache.get(symbol);
  if (cached) return cached;

  const market = await prisma.market.findUnique({ where: { slug: symbol } });
  if (!market) throw new Error(`Market not found: ${symbol}`);

  marketCache.set(symbol, market.id);
  return market.id;
}

export function serializeOrder(order: Order) {
  return {
    id: order.id,
    userId: order.userId,
    marketId: order.marketId,
    side: order.side,
    type: order.type,
    status: order.status,
    qty: order.qty,
    price: order.price,
    filledQty: order.filledQty,
    remainingQty: order.remainingQty,
    leverage: order.leverage,
    slippage: order.slippage,
    postOnly: order.postOnly,
    rejectionReason: order.rejectionReason,
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
  };
}
