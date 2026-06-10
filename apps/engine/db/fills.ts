import { prisma, getMarketId } from "database";
import type { Side } from "../state/orderbook";

type TradeFillInput = {
  symbol: string;
  price: number;
  quantity: number;
  makerOrderId: string;
  makerUserId: string;
  makerSide: Side;
  takerOrderId: string;
  takerUserId: string;
  takerSide: Side;
};

export async function persistTradeFill(input: TradeFillInput) {
  const marketId = await getMarketId(input.symbol);

  await prisma.fill.createMany({
    data: [
      {
        orderId: input.makerOrderId,
        userId: input.makerUserId,
        marketId,
        side: input.makerSide,
        role: "maker",
        quantity: input.quantity,
        price: input.price,
        fee: 0,
      },
      {
        orderId: input.takerOrderId,
        userId: input.takerUserId,
        marketId,
        side: input.takerSide,
        role: "taker",
        quantity: input.quantity,
        price: input.price,
        fee: 0,
      },
    ],
  });
}

export async function resetFills() {
  await prisma.fill.deleteMany();
}
