import type { AdlEvent } from "../generated/prisma/client";

export function serializeAdlEvent(row: AdlEvent) {
  return {
    id: row.id,
    userId: row.userId,
    marketId: row.marketId,
    reducedQuantity: row.reducedQuantity,
    bankruptcyPrice: row.bankruptcyPrice,
    createdAt: row.createdAt.toISOString(),
  };
}
