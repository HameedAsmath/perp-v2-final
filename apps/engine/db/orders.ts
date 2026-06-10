import { prisma, getMarketId } from "database";
import type { PlaceOrderInput, OrderResponse } from "../state/orderbook";

export async function persistRejectedOrder(
  orderId: string,
  input: PlaceOrderInput,
  reason: string,
) {
  const marketId = await getMarketId(input.symbol);
  await prisma.order.create({
    data: {
      id: orderId,
      userId: input.userId,
      marketId,
      side: input.side,
      type: input.type,
      status: "rejected",
      qty: input.quantity,
      price: input.type === "limit" ? input.price : null,
      filledQty: 0,
      remainingQty: 0,
      leverage: input.leverage ?? 1,
      slippage: 0,
      postOnly: input.postOnly ?? false,
      rejectionReason: reason,
    },
  });
}

export async function persistPlacedOrder(
  orderId: string,
  input: PlaceOrderInput,
  response: OrderResponse,
) {
  const marketId = await getMarketId(input.symbol);
  const filledQty =
    input.quantity - response.cancelledQuantity - response.remainingQuantity;

  await prisma.order.create({
    data: {
      id: orderId,
      userId: input.userId,
      marketId,
      side: input.side,
      type: input.type,
      status: response.status,
      qty: input.quantity,
      price: input.type === "limit" ? input.price : null,
      filledQty,
      remainingQty: response.remainingQuantity,
      leverage: input.leverage ?? 1,
      slippage: 0,
      postOnly: input.postOnly ?? false,
      rejectionReason: response.reason ?? null,
    },
  });
}

export async function persistMakerFill(
  makerOrderId: string,
  remainingQty: number,
  fillQty: number,
) {
  await prisma.order.update({
    where: { id: makerOrderId },
    data: {
      filledQty: { increment: fillQty },
      remainingQty,
      status: remainingQty === 0 ? "filled" : "partially_filled",
    },
  });
}

export async function resetOrders() {
  await prisma.order.deleteMany();
}
