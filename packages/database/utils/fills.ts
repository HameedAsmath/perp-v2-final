import type { Fill } from "../generated/prisma/client";

export function serializeFill(fill: Fill) {
  return {
    id: fill.id,
    orderId: fill.orderId,
    userId: fill.userId,
    marketId: fill.marketId,
    side: fill.side,
    role: fill.role,
    quantity: fill.quantity,
    price: fill.price,
    fee: fill.fee,
    createdAt: fill.createdAt.toISOString(),
  };
}
