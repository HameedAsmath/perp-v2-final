import type { Liquidation } from "../generated/prisma/client";

export function serializeLiquidation(row: Liquidation) {
  return {
    id: row.id,
    userId: row.userId,
    marketId: row.marketId,
    side: row.side,
    quantity: row.quantity,
    entryPrice: row.entryPrice,
    markPrice: row.markPrice,
    margin: row.margin,
    settlement: row.settlement,
    reason: row.reason,
    createdAt: row.createdAt.toISOString(),
  };
}
